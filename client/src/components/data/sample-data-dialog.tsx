import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wand2, Download } from "lucide-react";
import { useState } from "react";
import { generateSampleData } from "@/lib/sample-data";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function SampleDataDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [numRecords, setNumRecords] = useState("100");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const downloadCsv = (records: ReturnType<typeof generateSampleData>) => {
    const headers = "startOfOrder,plannedProductionTime,actualProductionTime,idealCycleTime,totalPieces,goodPieces\n";
    const rows = records.map(record => 
      `${record.startOfOrder.toISOString()},${record.plannedProductionTime},${record.actualProductionTime},${record.idealCycleTime},${record.totalPieces},${record.goodPieces}`
    ).join('\n');

    const csvContent = headers + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = "sample_oee_data.csv";
    link.click();
  };

  const handleGenerate = async () => {
    const count = parseInt(numRecords);
    if (isNaN(count) || count < 1 || count > 5000) {
      toast({
        variant: "destructive",
        title: "Invalid input",
        description: "Please enter a number between 1 and 5000",
      });
      return;
    }

    setIsGenerating(true);
    setIsOpen(false); // Close dialog immediately

    try {
      const records = generateSampleData(count);
      downloadCsv(records);

      toast({
        description: "Generating and uploading sample data...",
      });

      // Upload records sequentially
      for (const record of records) {
        await apiRequest('POST', '/api/oee-records', record);
      }

      // Invalidate queries to refresh data
      await queryClient.invalidateQueries({ queryKey: ['/api/oee-records'] });
      await queryClient.invalidateQueries({ queryKey: ['/api/oee-records/latest'] });

      toast({
        title: "Success",
        description: `Generated ${count} sample records successfully and downloaded as CSV.`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to generate sample data";
      console.error("Sample data generation error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8" 
          disabled={isGenerating}
        >
          <Wand2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Sample Data</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="numRecords">Number of Records (1-5000)</Label>
            <Input
              id="numRecords"
              type="number"
              min="1"
              max="5000"
              value={numRecords}
              onChange={(e) => setNumRecords(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? "Generating..." : (
              <>
                Generate & Download
                <Download className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
