import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: Readonly<React.HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-800/10", className)}
      {...props}
    />
  );
}

export { Skeleton };
