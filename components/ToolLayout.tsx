"use client";

// components/ToolLayout.tsx
import React, { ReactElement, ReactNode } from "react";
import ShareButton from "./ShareButton";
import { motion } from "framer-motion";

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
    <motion.section
      className="w-full"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header: same width as content */}
      <div className="container-wrap px-4 md:px-6 lg:px-8">
        <div
          className={
            center
              ? "flex flex-col items-center text-center gap-2"
              : "flex flex-wrap items-end justify-between gap-3"
          }
        >
          <div>
            <h1
              className="text-3xl font-bold tracking-tight bg-gradient-to-r from-brand to-blue-600 bg-clip-text text-transparent"
            >
              {title}
            </h1>
            {description ? (
              <p className="mt-2 text-base text-muted max-w-2xl">{description}</p>
            ) : null}
          </div>
          {!center && (
            <div className="flex items-center gap-2">
              {actions}
              <ShareButton />
            </div>
          )}
        </div>
      </div>

      {/* Panels wrapper */}
      <div className="container-wrap px-4 md:px-6 lg:px-8 mt-6">
        <div className="tool-panels">{items}</div>
      </div>
    </motion.section>
  );
}
