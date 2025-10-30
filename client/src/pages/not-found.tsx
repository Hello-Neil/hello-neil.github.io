import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 px-6">
      <Card className="max-w-md w-full p-8 md:p-12 text-center">
        <div className="text-8xl mb-6">🤔</div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4">404</h1>
        
        <h2 className="text-xl md:text-2xl font-semibold mb-3">Page Not Found</h2>
        
        <p className="text-muted-foreground mb-8">
          Oops! The page you're looking for doesn't exist. Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          
          <Button
            variant="default"
            className="flex-1"
            onClick={() => setLocation("/")}
            data-testid="button-home"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </div>
      </Card>
    </div>
  );
}
