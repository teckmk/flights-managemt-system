import { Kafka, Producer, Consumer, KafkaMessage, logLevel } from 'kafkajs';
import { Flight, FlightStatus } from '@/lib/types/flight';

interface FlightUpdate {
  flightId: string;
  status: FlightStatus;
  timestamp: Date;
  updatedBy?: string;
  reason?: string;
}

class KafkaService {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;
  private isProducerConnected: boolean = false;
  private isConsumerConnected: boolean = false;
  private readonly RECONNECT_TIMEOUT = 5000;
  private readonly TOPIC_NAME = 'flight-updates';

  constructor() {
    this.kafka = new Kafka({
      clientId: 'flight-management-system',
      brokers: (process.env.KAFKA_BROKERS || 'localhost:29092').split(','),
      logLevel: logLevel.ERROR,
      retry: {
        initialRetryTime: 100,
        retries: 8
      }
    });

    this.producer = this.kafka.producer({
      allowAutoTopicCreation: true,
      transactionTimeout: 30000
    });

    this.consumer = this.kafka.consumer({ 
      groupId: 'flight-updates-group',
      sessionTimeout: 30000,
      heartbeatInterval: 3000
    });

    // Setup error handlers
    this.setupErrorHandlers();
  }

  private setupErrorHandlers(): void {
    this.producer.on('producer.disconnect', async () => {
      console.error('Producer disconnected. Attempting to reconnect...');
      this.isProducerConnected = false;
      await this.reconnectProducer();
    });

    this.consumer.on('consumer.disconnect', async () => {
      console.error('Consumer disconnected. Attempting to reconnect...');
      this.isConsumerConnected = false;
      await this.reconnectConsumer();
    });
  }

  private async reconnectProducer(): Promise<void> {
    while (!this.isProducerConnected) {
      try {
        await this.producer.connect();
        this.isProducerConnected = true;
        console.log('Producer reconnected successfully');
      } catch (error) {
        console.error('Failed to reconnect producer:', error);
        await new Promise(resolve => setTimeout(resolve, this.RECONNECT_TIMEOUT));
      }
    }
  }

  private async reconnectConsumer(): Promise<void> {
    while (!this.isConsumerConnected) {
      try {
        await this.consumer.connect();
        await this.consumer.subscribe({ topic: this.TOPIC_NAME, fromBeginning: false });
        this.isConsumerConnected = true;
        console.log('Consumer reconnected successfully');
      } catch (error) {
        console.error('Failed to reconnect consumer:', error);
        await new Promise(resolve => setTimeout(resolve, this.RECONNECT_TIMEOUT));
      }
    }
  }

  async connect(): Promise<void> {
    try {
      await Promise.all([
        this.producer.connect(),
        this.consumer.connect()
      ]);

      this.isProducerConnected = true;
      this.isConsumerConnected = true;

      await this.consumer.subscribe({ 
        topic: this.TOPIC_NAME, 
        fromBeginning: false 
      });

      console.log('Kafka service connected successfully');
    } catch (error) {
      console.error('Failed to connect to Kafka:', error);
      throw new Error('Kafka connection failed');
    }
  }

  async publishFlightUpdate(update: FlightUpdate): Promise<void> {
    if (!this.isProducerConnected) {
      throw new Error('Kafka producer is not connected');
    }

    try {
      await this.producer.send({
        topic: this.TOPIC_NAME,
        messages: [{
          key: update.flightId,
          value: JSON.stringify({
            ...update,
            timestamp: update.timestamp.toISOString()
          }),
          headers: {
            'content-type': 'application/json',
            'event-type': 'flight-update',
            'timestamp': Date.now().toString()
          }
        }]
      });
    } catch (error) {
      console.error('Error publishing flight update:', error);
      throw new Error('Failed to publish flight update');
    }
  }

  async subscribeToFlightUpdates(
    callback: (update: FlightUpdate) => Promise<void>
  ): Promise<void> {
    if (!this.isConsumerConnected) {
      throw new Error('Kafka consumer is not connected');
    }

    try {
      await this.consumer.run({
        autoCommit: true,
        eachMessage: async ({ message }: { message: KafkaMessage }) => {
          try {
            const update: FlightUpdate = JSON.parse(message.value?.toString() || '');
            update.timestamp = new Date(update.timestamp);
            await callback(update);
          } catch (error) {
            console.error('Error processing message:', error);
          }
        }
      });
    } catch (error) {
      console.error('Error in subscription:', error);
      throw new Error('Failed to subscribe to flight updates');
    }
  }

  async disconnect(): Promise<void> {
    try {
      await Promise.all([
        this.producer.disconnect(),
        this.consumer.disconnect()
      ]);

      this.isProducerConnected = false;
      this.isConsumerConnected = false;

      console.log('Kafka service disconnected successfully');
    } catch (error) {
      console.error('Error disconnecting from Kafka:', error);
      throw new Error('Failed to disconnect from Kafka');
    }
  }
}

// Export singleton instance
const kafkaService = new KafkaService();
export default kafkaService;