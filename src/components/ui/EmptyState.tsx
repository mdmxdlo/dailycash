import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in duration-500">
      <div className="bg-primary/10 p-6 rounded-full mb-6">
        <Icon className="w-12 h-12 text-primary" strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm max-w-sm mb-8">
        {description}
      </p>
      {action}
    </div>
  );
}
