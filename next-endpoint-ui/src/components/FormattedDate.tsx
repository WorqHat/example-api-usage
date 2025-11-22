const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

export function FormattedDate({
  date,
  ...props
}: {
  date: string | Date;
} & React.HTMLAttributes<HTMLElement>) {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return (
    <time dateTime={dateObj.toISOString()} {...props}>
      {dateFormatter.format(dateObj)}
    </time>
  );
}

