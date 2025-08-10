import React, { ReactElement, ReactNode } from "react";

/**
 * ToolLayout
 * - Uniform page header
 * - Two-column layout on md+ screens
 * - Automatically normalises child panels to equal height by
 *   injecting the "tool-panel" class into each direct child.
 */
type Props = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: ReactNode;
};

function withToolPanelClass(child: ReactNode): ReactNode {
  if (!React.isValidElement(child)) {
    return <div className="tool-panel">{child}</div>;
  }

  // Merge/append className
  const el = child as ReactElement<{ className?: string }>;
  const className = el.props?.className
    ? `${el.props.className} tool-panel`
    : "tool-panel";

  return React.cloneElement(el, { className });
}

export default function ToolLayout({ title, description, actions, children }: Props) {
  const items = React.Children.toArray(children).map(withToolPanelClass);

  return (
    <section className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description ? <p className="text-sm text-muted mt-1">{description}</p> : null}
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>

      {/* Panels wrapper enforces equal heights */}
      <div className="tool-panels">
        {items}
      </div>
    </section>
  );
}
