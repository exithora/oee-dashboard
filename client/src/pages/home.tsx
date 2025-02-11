import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="container mx-auto max-w-6xl">
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-transparent bg-clip-text">
        OEE Dashboard
      </h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Track actual production time against planned production time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Monitor actual production rate versus theoretical maximum
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quality</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Measure good parts produced against total production
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex justify-center">
        <Link href="/dashboard">
          <Button size="lg" className="gap-2">
            Go to Dashboard
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
