import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, Diamond } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

import type { ServiceDetailData } from "./serviceDetails";

interface ServiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ServiceDetailData | null;
}

export const ServiceDetailModal = ({ isOpen, onClose, data }: ServiceDetailModalProps) => {
  if (!data) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden bg-card border-border/50 duration-500 ease-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-1/2 data-[state=open]:slide-in-from-top-1/2">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/30">
          <DialogTitle className="text-2xl md:text-3xl font-bold gradient-text">
            {data.title}
          </DialogTitle>
          <p className="text-muted-foreground">{data.subtitle}</p>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] px-6 py-4">
          {data.description && (
            <p className="text-foreground/80 italic mb-6 text-sm leading-relaxed">
              {data.description}
            </p>
          )}
          
          <div className="space-y-6">
            {data.sections.map((section, idx) => (
              <div key={idx} className="space-y-3">
                <h4 className="font-semibold text-primary flex items-center gap-2">
                  <Diamond className="w-4 h-4" />
                  {section.title}
                </h4>
                <ul className="space-y-2 pl-1">
                  {section.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-2 text-sm text-foreground/80">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="mt-8 pt-6 border-t border-border/30">
            <h4 className="font-semibold text-foreground mb-3">{data.pricing.label}</h4>
            <ul className="space-y-2">
              {data.pricing.options.map((option, idx) => (
                <li key={idx} className="text-primary text-sm font-medium flex items-start gap-2">
                  <Diamond className="w-3 h-3 mt-1 flex-shrink-0" />
                  {option}
                </li>
              ))}
            </ul>
          </div>
          
          {data.extras && data.extras.length > 0 && (
            <div className="mt-6 pt-4 border-t border-border/30">
              <h4 className="font-semibold text-foreground mb-3">Дополнительные услуги:</h4>
              <ul className="space-y-1">
                {data.extras.map((extra, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                    <Diamond className="w-3 h-3 mt-1 flex-shrink-0 text-primary" />
                    {extra}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
