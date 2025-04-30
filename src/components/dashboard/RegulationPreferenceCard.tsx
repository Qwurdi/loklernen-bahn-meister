
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RegulationFilterToggle } from "@/components/common/RegulationFilterToggle";
import { RegulationFilterType } from "@/types/regulation";

interface RegulationPreferenceCardProps {
  value: RegulationFilterType;
  onChange: (value: RegulationFilterType) => void;
}

export default function RegulationPreferenceCard({ value, onChange }: RegulationPreferenceCardProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row justify-between mb-2">
        <h2 className="text-lg font-semibold mb-3 sm:mb-0">Regelwerk-Präferenz</h2>
      </div>
      <Card className="p-4">
        <RegulationFilterToggle 
          value={value}
          onChange={onChange}
          showInfoTooltip={true}
        />
      </Card>
    </div>
  );
}
