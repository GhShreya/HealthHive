import { CalendarDays, Activity, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MedicineCard from "@/components/MedicineCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Dashboard = () => {
  // Mock data - will be replaced with real data from backend
  const todayReminders = [
    {
      id: "1",
      name: "Aspirin",
      dosage: "100mg tablet",
      time: "8:00 AM",
      frequency: "Daily",
      taken: true,
    },
    {
      id: "2",
      name: "Vitamin D",
      dosage: "2000 IU capsule",
      time: "2:00 PM",
      frequency: "Daily",
      nextDose: "in 3 hours",
    },
    {
      id: "3",
      name: "Omega-3",
      dosage: "1000mg softgel",
      time: "8:00 PM",
      frequency: "Daily",
      nextDose: "in 9 hours",
    },
  ];

  const stats = [
    { label: "Today's Doses", value: "3", icon: CalendarDays, color: "text-primary" },
    { label: "Completed", value: "1", icon: CheckCircle2, color: "text-success" },
    { label: "Streak", value: "12 days", icon: Activity, color: "text-secondary" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Welcome back!</h2>
        <p className="text-muted-foreground">Here's your medication schedule for today</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center gap-2">
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-gradient-primary border-0 shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-primary-foreground mb-1">
                Stay on track!
              </h3>
              <p className="text-sm text-primary-foreground/90">
                You have 2 doses remaining today
              </p>
            </div>
            <Activity className="w-12 h-12 text-primary-foreground/80" />
          </div>
        </CardContent>
      </Card>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Today's Schedule</h3>
          <Link to="/reminders">
            <Button variant="ghost" size="sm">View All</Button>
          </Link>
        </div>
        <div className="space-y-3">
          {todayReminders.map((reminder) => (
            <MedicineCard key={reminder.id} {...reminder} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
