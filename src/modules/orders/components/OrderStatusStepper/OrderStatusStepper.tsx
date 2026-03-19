import { Check, X } from "lucide-react";
import type { OrderState } from "../../types";

interface Step {
  key: OrderState | OrderState[];
  label: string;
}

const STEPS: Step[] = [
  { key: "PENDING",   label: "Creada"      },
  { key: "INVOICED",  label: "Facturada"   },
  { key: ["ASSIGNED", "IN_TRANSIT"], label: "En Despacho" },
  { key: "DELIVERED", label: "Entregada"   },
];

const STATE_ORDER: OrderState[] = [
  "PENDING",
  "INVOICED",
  "ASSIGNED",
  "IN_TRANSIT",
  "DELIVERED",
];

const getStepIndex = (state: OrderState): number => {
  if (state === "ASSIGNED" || state === "IN_TRANSIT") return 2;
  return ["PENDING", "INVOICED", "_", "_", "DELIVERED"].indexOf(
    state === "PENDING" ? "PENDING"
    : state === "INVOICED" ? "INVOICED"
    : state === "DELIVERED" ? "DELIVERED"
    : state
  );
};

const resolveCurrentStep = (state: OrderState): number => {
  const idx = STATE_ORDER.indexOf(state);
  if (state === "ASSIGNED")   return 2;
  if (state === "IN_TRANSIT") return 2;
  if (state === "PENDING")    return 0;
  if (state === "INVOICED")   return 1;
  if (state === "DELIVERED")  return 3;
  return idx;
};

interface OrderStatusStepperProps {
  state: OrderState;
}

const OrderStatusStepper = ({ state }: OrderStatusStepperProps) => {
  const isCancelled = state === "CANCELLED";
  const currentStep = isCancelled ? -1 : resolveCurrentStep(state);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-5">
      {isCancelled ? (
        <div className="flex items-center justify-center gap-3 py-2">
          <span className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
            <X className="w-4 h-4 text-red-600" />
          </span>
          <span className="text-sm font-medium text-red-600">Orden Cancelada</span>
        </div>
      ) : (
        <div className="flex items-center w-full">
          {STEPS.map((step, index) => {
            const isDone    = index < currentStep;
            const isCurrent = index === currentStep;
            const isPending = index > currentStep;

            return (
              <div key={index} className="flex items-center flex-1 last:flex-none">
                {/* Circle + label */}
                <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors
                      ${isDone || isCurrent
                        ? "bg-dispofast-primary"
                        : "bg-gray-200"
                      }`}
                  >
                    {isDone || isCurrent ? (
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-gray-400" />
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium whitespace-nowrap
                      ${isCurrent ? "text-dispofast-primary"
                      : isDone    ? "text-gray-600"
                      : "text-gray-400"}`}
                  >
                    {step.label}
                  </span>
                </div>

                {/* Connector line */}
                {index < STEPS.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-2 mb-5 rounded transition-colors
                      ${isDone ? "bg-dispofast-primary" : "bg-gray-200"}`}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderStatusStepper;
