"use client";

import { Plane, Clock, AlertTriangle, CheckCircle2, Users } from "lucide-react";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ScheduleInterval {
  time: string;
  scheduled: number;
  inFlight: number;
  delayed: number;
}

export default function FlightStatusChart() {
  const [data, setData] = useState<ScheduleInterval[]>([]);

  useEffect(() => {
    (async () => {
      const response = await fetch("/api/flights/departures");
      const data = await response.json();
      setData(data);
    })();
  }, []);
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="scheduled"
          stroke="hsl(var(--chart-1))"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="inFlight"
          stroke="hsl(var(--chart-2))"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="delayed"
          stroke="hsl(var(--chart-3))"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
