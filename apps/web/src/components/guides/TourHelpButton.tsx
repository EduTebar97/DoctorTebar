import { HelpCircle } from "lucide-react";
import { guideDefinitions } from "../../guides/guideDefinitions";
import { useGuidedTour } from "./GuidedTourProvider";

export function TourHelpButton({ guideIds }: { guideIds: string[] }) {
  const { startGuide } = useGuidedTour();
  const guides = guideDefinitions.filter((guide) => guideIds.includes(guide.id));
  if (!guides.length) return null;

  return (
    <div className="tour-help">
      <HelpCircle size={18} />
      <select aria-label="Guia contextual" onChange={(event) => event.target.value && startGuide(event.target.value)} defaultValue="">
        <option value="">Ayuda de esta pantalla</option>
        {guides.map((guide) => <option key={guide.id} value={guide.id}>{guide.title}</option>)}
      </select>
    </div>
  );
}
