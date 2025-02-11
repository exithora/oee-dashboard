import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { type InsertOeeRecord, insertOeeRecordSchema } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";

export default function CsvUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const validateAndParseRecord = (values: string[]): InsertOeeRecord | null => {
    if (values.length !== 6) return null; // Updated to include timestamp

    try {
      const record = {
        timestamp: new Date(values[0]).toISOString(), // Parse the timestamp
        plannedProductionTime: parseInt(values[1]),
        actualProductionTime: parseInt(values[2]),
        idealCycleTime: parseFloat(values[3]),
        totalPieces: parseInt(values[4]),
        goodPieces: parseInt(values[5])
      };

      // Use the schema to validate the record
      return insertOeeRecordSchema.parse(record);
    } catch (error) {
      return null;
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please upload a CSV file",
      });
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n');

        // Verify header row
        const expectedHeaders = "timestamp,plannedProductionTime,actualProductionTime,idealCycleTime,totalPieces,goodPieces";
        const headers = lines[0].trim().toLowerCase();

        if (headers !== expectedHeaders.toLowerCase()) {
          throw new Error("Invalid CSV headers. Please use the template provided.");
        }

        // Parse and validate records
        const records: InsertOeeRecord[] = [];
        for (const line of lines.slice(1)) {
          const trimmedLine = line.trim();
          if (!trimmedLine) continue;

          const values = trimmedLine.split(',');
          const record = validateAndParseRecord(values);

          if (!record) {
            throw new Error("Invalid data format in CSV. Please check the values and ensure correct timestamp format (YYYY-MM-DDTHH:mm:ss).");
          }

          records.push(record);
        }

        if (records.length === 0) {
          throw new Error("No valid records found in the CSV file.");
        }

        // Upload records sequentially
        for (const record of records) {
          await apiRequest('POST', '/api/oee-records', record);
        }

        // Invalidate queries to refresh data
        await queryClient.invalidateQueries({ queryKey: ['/api/oee-records'] });
        await queryClient.invalidateQueries({ queryKey: ['/api/oee-records/latest'] });

        toast({
          title: "Success",
          description: `Uploaded ${records.length} records successfully.`,
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to upload CSV. Please check the file format.",
        });
      } finally {
        setIsUploading(false);
        event.target.value = ''; // Reset file input
      }
    };

    reader.readAsText(file);
  };

  return (
    <div>
      <Button
        variant="outline"
        className="relative"
        disabled={isUploading}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <Upload className="h-4 w-4 mr-2" />
        {isUploading ? "Uploading..." : "Upload CSV"}
      </Button>
    </div>
  );
}