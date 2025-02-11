import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

export default function HelpDialog() {
  const handleDownloadTemplate = () => {
    const headers = "startOfOrder,plannedProductionTime,actualProductionTime,idealCycleTime,totalPieces,goodPieces\n";
    const example = "2024-02-11T10:00:00,480,420,0.5,800,750\n";
    const csvContent = headers + example;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = "oee_template.csv";
    link.click();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <HelpCircle className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>How to Use OEE Dashboard</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <section>
            <h3 className="font-semibold mb-2">CSV Upload Format</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Upload your data using a CSV file with the following columns:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li><strong>startOfOrder</strong>: Date and time of the record (format: YYYY-MM-DDTHH:mm:ss)</li>
              <li><strong>plannedProductionTime</strong>: Total planned production time (in minutes)</li>
              <li><strong>actualProductionTime</strong>: Actual production time (in minutes)</li>
              <li><strong>idealCycleTime</strong>: Ideal cycle time per piece (in minutes)</li>
              <li><strong>totalPieces</strong>: Total number of pieces produced</li>
              <li><strong>goodPieces</strong>: Number of good quality pieces</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold mb-2">Metrics Explained</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li><strong>Availability</strong>: Measures actual vs planned production time</li>
              <li><strong>Performance</strong>: Compares actual vs ideal cycle time</li>
              <li><strong>Quality</strong>: Ratio of good pieces to total pieces produced</li>
              <li><strong>OEE</strong>: Overall Equipment Effectiveness (Availability × Performance × Quality)</li>
            </ul>
          </section>

          <Button onClick={handleDownloadTemplate} className="w-full">
            Download CSV Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}