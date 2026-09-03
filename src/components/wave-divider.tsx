/**
 * The white wave that sits on the hero's bottom edge and on the footer's top edge.
 * Both paths are exported verbatim from Figma (1870 x 78.58, overhanging its
 * container by ~8px each side so the curve runs off the rounded corners).
 */
const PATHS = {
  // hero bottom edge — white is full-height at the corners and thins to nothing
  // in the middle, so the photo bulges downward at the centre
  bottom:
    "M-7.93723 78.5781V2.28882e-05H1877.94V78.5781C1251.78 -0.157791 618.222 -0.157791 -7.93723 78.5781Z",
  // footer top edge — the same curve mirrored, so the navy domes upward
  top: "M-7.93723 0V78.5781H1877.94V0C1251.78 78.7359 618.222 78.7359 -7.93723 0Z",
} as const;

export function WaveDivider({
  placement,
  className = "",
}: {
  placement: "bottom" | "top";
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1870 79"
      preserveAspectRatio="none"
      className={[
        "pointer-events-none absolute -inset-x-2 w-[calc(100%+16px)] text-background",
        placement === "bottom" ? "bottom-[-1px]" : "top-[-1px]",
        "h-[36px] sm:h-[56px] xl:h-[78.58px]",
        className,
      ].join(" ")}
      style={{
        transform: "scaleY(-1)",
      }}
    >
      <path d={PATHS[placement]} fill="currentColor" />
    </svg>
  );
}
