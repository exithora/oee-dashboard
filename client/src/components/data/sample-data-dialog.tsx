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
import { Wand2 } from "lucide-react";
import { useState } from "react";
import { generateSampleData } from "@/lib/sample-data";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function SampleDataDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [numRecords, setNumRecords] = useState("10");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    const count = parseInt(numRecords);
    if (isNaN(count) || count < 1 || count > 100) {
      toast({
        variant: "destructive",
        title: "Invalid input",
        description: "Please enter a number between 1 and 100",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const records = generateSampleData(count);
      
      // Upload records sequentially
      for (const record of records) {
        await apiRequest('POST', '/api/oee-records', record);
      }

      // Invalidate queries to refresh data
      await queryClient.invalidateQueries({ queryKey: ['/api/oee-records'] });
      await queryClient.invalidateQueries({ queryKey: ['/api/oee-records/latest'] });

      toast({
        title: "Success",
        description: `Generated ${count} sample records successfully.`,
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate sample data.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <Wand2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Sample Data</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="numRecords">Number of Records (1-100)</Label>
            <Input
              id="numRecords"
              type="number"
              min="1"
              max="100"
              value={numRecords}
              onChange={(e) => setNumRecords(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? "Generating..." : "Generate Sample Data"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
