import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { TimeRange, type OeeRecord, calculateAvailability, calculatePerformance, calculateQuality, calculateOEE } from "@shared/schema";
import OeeChart from "@/components/charts/oee-chart";
import MetricCard from "@/components/metrics/metric-card";
import HelpDialog from "@/components/help/help-dialog";
import CsvUpload from "@/components/data/csv-upload";

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    end: new Date().toISOString(),
    frequency: "day"
  });

  const { data: oeeData, isLoading } = useQuery<OeeRecord[]>({
    queryKey: ["/api/oee-records", timeRange],
    enabled: !!timeRange
  });

  const { data: latestRecord, isLoading: isLoadingLatest } = useQuery<OeeRecord>({
    queryKey: ["/api/oee-records/latest"]
  });

  const latestMetrics = latestRecord ? {
    availability: calculateAvailability(latestRecord.plannedProductionTime, latestRecord.actualProductionTime),
    performance: calculatePerformance(latestRecord.actualProductionTime, latestRecord.idealCycleTime, latestRecord.totalPieces),
    quality: calculateQuality(latestRecord.totalPieces, latestRecord.goodPieces)
  } : null;

  return (
    <div className="container mx-auto max-w-7xl space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">OEE Dashboard</h1>

        <div className="flex items-center gap-4">
          <CsvUpload />
          <HelpDialog />
          <Select
            value={timeRange.frequency}
            onValueChange={(value) => 
              setTimeRange(prev => ({ ...prev, frequency: value as TimeRange["frequency"] }))
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hour">Hourly</SelectItem>
              <SelectItem value="day">Daily</SelectItem>
              <SelectItem value="week">Weekly</SelectItem>
              <SelectItem value="month">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoadingLatest ? (
          Array(3).fill(0).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-20" />
              </CardContent>
            </Card>
          ))
        ) : latestMetrics ? (
          <>
            <MetricCard
              title="Availability"
              value={latestMetrics.availability}
              description="Actual vs Planned Production Time"
            />
            <MetricCard
              title="Performance"
              value={latestMetrics.performance}
              description="Actual vs Theoretical Output"
            />
            <MetricCard
              title="Quality"
              value={latestMetrics.quality}
              description="Good Parts vs Total Production"
            />
          </>
        ) : (
          <p className="col-span-3 text-center text-muted-foreground">
            No data available. Upload a CSV file to get started.
          </p>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>OEE Trends</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[400px]" />
          ) : oeeData && oeeData.length > 0 ? (
            <OeeChart data={oeeData} />
          ) : (
            <div className="h-[400px] flex items-center justify-center text-muted-foreground">
              No data available for the selected time range
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}