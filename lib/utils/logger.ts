type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private readonly isDevelopment = process.env.NODE_ENV === 'development';

  private formatMessage(level: LogLevel, message: string, ...args: any[]) {
    const timestamp = new Date().toISOString();
    const formattedArgs = args.map(arg => 
      arg instanceof Error ? arg.stack : JSON.stringify(arg)
    ).join(' ');
    
    return `[${timestamp}] ${level.toUpperCase()}: ${message} ${formattedArgs}`;
  }

  private log(level: LogLevel, message: string, ...args: any[]) {
    const formattedMessage = this.formatMessage(level, message, ...args);

    switch (level) {
      case 'info':
        console.log(formattedMessage);
        break;
      case 'warn':
        console.warn(formattedMessage);
        break;
      case 'error':
        console.error(formattedMessage);
        break;
      case 'debug':
        if (this.isDevelopment) {
          console.debug(formattedMessage);
        }
        break;
    }

    // In a production environment, you might want to send logs to a service
    if (process.env.NODE_ENV === 'production') {
      // Implement production logging service integration here
      // e.g., send to CloudWatch, Datadog, etc.
    }
  }

  info(message: string, ...args: any[]) {
    this.log('info', message, ...args);
  }

  warn(message: string, ...args: any[]) {
    this.log('warn', message, ...args);
  }

  error(message: string, ...args: any[]) {
    this.log('error', message, ...args);
  }

  debug(message: string, ...args: any[]) {
    this.log('debug', message, ...args);
  }
}

export const logger = new Logger();