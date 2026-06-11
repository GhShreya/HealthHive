import { Clock, Pill, Edit } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface MedicineCardProps {
  id: string;
  name: string;
  dosage: string;
  time: string;
  frequency: string;
  taken?: boolean;
  nextDose?: string;
}

const MedicineCard = ({
  id,
  name,
  dosage,
  time,
  frequency,
  taken = false,
  nextDose,
}: MedicineCardProps) => {
  return (
    <Card className={cn(
      "overflow-hidden transition-all hover:shadow-md",
      taken && "opacity-60"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex gap-3 flex-1">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
              taken ? "bg-muted" : "bg-accent"
            )}>
              <Pill className={cn(
                "w-6 h-6",
                taken ? "text-muted-foreground" : "text-accent-foreground"
              )} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground mb-1">{name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{dosage}</p>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {time}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {frequency}
                </Badge>
                {taken && (
                  <Badge variant="default" className="text-xs bg-success">
                    Taken
                  </Badge>
                )}
              </div>
              {nextDose && !taken && (
                <p className="text-xs text-muted-foreground mt-2">
                  Next dose: {nextDose}
                </p>
              )}
            </div>
          </div>
          <Link to={`/edit-medicine/${id}`}>
            <Button variant="ghost" size="icon" className="flex-shrink-0">
              <Edit className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicineCard;
