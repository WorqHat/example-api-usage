import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, AlertTriangle, Lightbulb, XCircle } from "lucide-react";

type NoteProps = {
  children: React.ReactNode;
  type?: "info" | "warning" | "tip" | "error";
};

const typeConfig = {
  info: {
    variant: "default" as const,
    icon: Info,
  },
  warning: {
    variant: "warning" as const,
    icon: AlertTriangle,
  },
  tip: {
    variant: "tip" as const,
    icon: Lightbulb,
  },
  error: {
    variant: "destructive" as const,
    icon: XCircle,
  },
};

export default function Note({ children, type = "info" }: NoteProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <Alert variant={config.variant} className="my-6">
      <Icon className="h-5 w-5" />
      <AlertDescription className="leading-7">
        {children}
      </AlertDescription>
    </Alert>
  );
}

// Warning is an alias for Note with type="warning"
export function Warning({ children }: { children: React.ReactNode }) {
  return <Note type="warning">{children}</Note>;
}

