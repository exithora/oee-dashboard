import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { type OeeRecord, calculateAvailability, calculatePerformance, calculateQuality, calculateOEE } from '@shared/schema';

interface OeeChartProps {
  data: OeeRecord[];
}

export default function OeeChart({ data }: OeeChartProps) {
  const chartData = data.map(record => ({
    date: new Date(record.startOfOrder).toLocaleDateString(),
    availability: calculateAvailability(record.plannedProductionTime, record.actualProductionTime),
    performance: calculatePerformance(record.actualProductionTime, record.idealCycleTime, record.totalPieces),
    quality: calculateQuality(record.totalPieces, record.goodPieces),
    oee: calculateOEE(
      calculateAvailability(record.plannedProductionTime, record.actualProductionTime),
      calculatePerformance(record.actualProductionTime, record.idealCycleTime, record.totalPieces),
      calculateQuality(record.totalPieces, record.goodPieces)
    )
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="availability" stroke="hsl(var(--chart-1))" name="Availability %" />
        <Line type="monotone" dataKey="performance" stroke="hsl(var(--chart-2))" name="Performance %" />
        <Line type="monotone" dataKey="quality" stroke="hsl(var(--chart-3))" name="Quality %" />
        <Line type="monotone" dataKey="oee" stroke="hsl(var(--chart-4))" name="OEE %" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}