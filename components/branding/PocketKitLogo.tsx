import * as React from "react";

export default function PocketKitLogo(
  props: React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="64" height="64" rx="12" fill="currentColor" />
      <path
        d="M18 20h28v24H18z"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 32h28"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
