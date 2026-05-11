import { createContext, type ReactNode, useContext, useMemo, useState } from "react";
import { Joyride, type EventData, STATUS, type Step } from "react-joyride";
import { useNavigate } from "react-router-dom";
import { guideDefinitions } from "../../guides/guideDefinitions";
import type { GuideDefinition } from "../../guides/guide.types";

interface GuidedTourContextValue {
  activeGuide: GuideDefinition | null;
  startGuide: (guideId: string) => void;
  stopGuide: () => void;
}

const GuidedTourContext = createContext<GuidedTourContextValue | null>(null);

export function GuidedTourProvider({ children }: { children: ReactNode }) {
  const [activeGuide, setActiveGuide] = useState<GuideDefinition | null>(null);
  const [run, setRun] = useState(false);
  const navigate = useNavigate();

  const steps: Step[] = useMemo(() => {
    if (!activeGuide) return [];
    return activeGuide.steps.map((step) => ({
      target: step.target,
      disableBeacon: true,
      placement: step.placement ?? "bottom",
      content: (
        <div className="tour-step">
          <strong>{step.title}</strong>
          <p>{step.content}</p>
        </div>
      )
    }));
  }, [activeGuide]);

  function startGuide(guideId: string) {
    const guide = guideDefinitions.find((item) => item.id === guideId);
    if (!guide) return;
    setActiveGuide(guide);
    navigate(guide.routeToStart);
    window.setTimeout(() => setRun(true), 450);
    localStorage.setItem(`guide:${guide.id}:status`, "in_progress");
  }

  function stopGuide() {
    setRun(false);
    setActiveGuide(null);
  }

  function handleEvent(data: EventData) {
    if (data.status === STATUS.FINISHED || data.status === STATUS.SKIPPED) {
      if (activeGuide && data.status === STATUS.FINISHED) {
        localStorage.setItem(`guide:${activeGuide.id}:status`, "completed");
        localStorage.setItem(`guide:${activeGuide.id}:completedAt`, new Date().toISOString());
        window.dispatchEvent(new CustomEvent("guide-progress-changed"));
      }
      stopGuide();
    }
  }

  return (
    <GuidedTourContext.Provider value={{ activeGuide, startGuide, stopGuide }}>
      {children}
      <Joyride
        onEvent={handleEvent}
        continuous
        run={run}
        scrollToFirstStep
        steps={steps}
        options={{
          zIndex: 10000,
          primaryColor: "#66e3ff",
          backgroundColor: "#0f172a",
          textColor: "#eaf2ff",
          arrowColor: "#0f172a",
          showProgress: true,
          buttons: ["back", "close", "primary", "skip"]
        }}
        styles={{
          tooltip: {
            border: "1px solid rgba(150, 180, 255, 0.25)",
            borderRadius: 18
          },
          buttonPrimary: {
            background: "linear-gradient(135deg, #66e3ff, #a78bfa)",
            color: "#06111f",
            fontWeight: 800
          },
          buttonBack: { color: "#eaf2ff" },
          buttonSkip: { color: "#9fb1cd" }
        }}
        locale={{
          back: "Anterior",
          close: "Cerrar",
          last: "Finalizar",
          next: "Siguiente",
          skip: "Saltar"
        }}
      />
    </GuidedTourContext.Provider>
  );
}

export function useGuidedTour() {
  const context = useContext(GuidedTourContext);
  if (!context) throw new Error("useGuidedTour must be used inside GuidedTourProvider");
  return context;
}
