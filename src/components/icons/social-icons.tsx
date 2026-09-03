import type { SVGProps } from "react";

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TelegramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M21.05 3.64 2.9 10.7c-1.2.48-1.2 1.15-.22 1.45l4.64 1.45 1.79 5.44c.22.6.37.84.75.84.3 0 .43-.14.6-.3l2.55-2.42 4.7 3.44c.87.48 1.5.23 1.72-.8l3.1-14.6c.3-1.26-.48-1.83-1.48-1.36Zm-11.5 9.9-1-3.4 8.6-5.35c.4-.24.77-.11.47.16l-8.07 8.6Z" />
    </svg>
  );
}

export function TikTokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M14.5 3h2.3c.2 1.6 1.2 3 2.7 3.7v2.4a6.3 6.3 0 0 1-2.7-.7v6.4a5.4 5.4 0 1 1-5.4-5.4c.2 0 .5 0 .7.05v2.4a2.9 2.9 0 1 0 2 2.75V3Z" />
    </svg>
  );
}

export function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.3 3h3l-6.6 7.5L22.5 21h-6.1l-4.8-6.3L5.9 21H2.9l7.1-8.1L2 3h6.3l4.4 5.8L18.3 3Zm-1 16h1.7L7.8 4.9H6l11.3 14.1Z" />
    </svg>
  );
}
