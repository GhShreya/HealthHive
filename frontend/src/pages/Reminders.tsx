import { useState } from "react";
import MedicineCard from "@/components/MedicineCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Reminders = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - will be replaced with real data from backend
  const allMedicines = [
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
    {
      id: "4",
      name: "Antibiotics",
      dosage: "500mg capsule",
      time: "9:00 AM",
      frequency: "Every 12 hours",
      nextDose: "tomorrow",
    },
  ];

  const filteredMedicines = allMedicines.filter((med) =>
    med.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeMedicines = filteredMedicines.filter((med) => !med.taken);
  const completedMedicines = filteredMedicines.filter((med) => med.taken);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">All Reminders</h2>
        <p className="text-muted-foreground">Manage your medication schedule</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search medicines..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-3 mt-4">
          {filteredMedicines.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No medicines found</p>
            </div>
          ) : (
            filteredMedicines.map((medicine) => (
              <MedicineCard key={medicine.id} {...medicine} />
            ))
          )}
        </TabsContent>
        <TabsContent value="active" className="space-y-3 mt-4">
          {activeMedicines.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No active medicines</p>
            </div>
          ) : (
            activeMedicines.map((medicine) => (
              <MedicineCard key={medicine.id} {...medicine} />
            ))
          )}
        </TabsContent>
        <TabsContent value="completed" className="space-y-3 mt-4">
          {completedMedicines.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No completed doses today</p>
            </div>
          ) : (
            completedMedicines.map((medicine) => (
              <MedicineCard key={medicine.id} {...medicine} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reminders;
