// components/ToolLayout.tsx
import React, { ReactElement, ReactNode } from "react";

/**
 * ToolLayout
 * - Uniform page header
 * - Two-column layout on md+ screens (via .tool-panels in globals.css)
 * - Injects "tool-panel" on each direct child so heights normalize
 */
type Props = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: ReactNode;
  align?: "left" | "center"; // NEW
};

function withToolPanelClass(child: ReactNode): ReactNode {
  if (!React.isValidElement(child)) return <div className="tool-panel">{child}</div>;
  const el = child as ReactElement<{ className?: string }>;
  const className = el.props?.className ? `${el.props.className} tool-panel` : "tool-panel";
  return React.cloneElement(el, { className });
}

export default function ToolLayout({
  title,
  description,
  actions,
  children,
  align = "left",
}: Props) {
  const items = React.Children.toArray(children).map(withToolPanelClass);
  const center = align === "center";

  return (
    <section className="w-full">
      {/* Header: same width as content */}
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8">
        <div
          className={
            center
              ? "flex flex-col items-center text-center gap-2"
              : "flex flex-wrap items-end justify-between gap-3"
          }
        >
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {description ? <p className="text-sm text-muted mt-1">{description}</p> : null}
          </div>
          {!center && actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </div>
      </div>

      {/* Panels wrapper */}
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8 mt-6">
        <div className="tool-panels">{items}</div>
      </div>
    </section>
  );
}
