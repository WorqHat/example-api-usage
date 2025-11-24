import clsx from "clsx";

const badgeStyles = {
  general: {
    background: "bg-blue-400/10",
    text: "text-blue-400",
    ring: "ring-blue-400/30",
  },
  playground: {
    background: "bg-purple-400/10",
    text: "text-purple-400",
    ring: "ring-purple-400/30",
  },
  api: {
    background: "bg-amber-400/10",
    text: "text-amber-400",
    ring: "ring-amber-400/30",
  },
  app: {
    background: "bg-emerald-400/10",
    text: "text-emerald-400",
    ring: "ring-emerald-400/30",
  },
} as const;

type BadgeType = keyof typeof badgeStyles;

export function Badge({ type }: { type: BadgeType }) {
  const styles = badgeStyles[type];

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
        styles.background,
        styles.text,
        styles.ring
      )}
    >
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
}

