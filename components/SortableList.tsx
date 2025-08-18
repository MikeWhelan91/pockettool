"use client";

import { useRef } from "react";

type Props<T> = {
  items: T[];
  getKey: (item: T) => string;
  onMove: (from: number, to: number) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
};

export default function SortableList<T>({ items, getKey, onMove, renderItem, className = "" }: Props<T>) {
  const dragIndex = useRef<number | null>(null);

  function onDragStart(e: React.DragEvent<HTMLDivElement>, index: number) {
    dragIndex.current = index;
    e.dataTransfer.effectAllowed = "move";
  }
  function onDragOver(e: React.DragEvent<HTMLDivElement>, overIndex: number) {
    e.preventDefault();
    if (dragIndex.current === null || dragIndex.current === overIndex) return;
    e.dataTransfer.dropEffect = "move";
  }
  function onDrop(e: React.DragEvent<HTMLDivElement>, dropIndex: number) {
    e.preventDefault();
    const from = dragIndex.current;
    dragIndex.current = null;
    if (from === null || from === dropIndex) return;
    onMove(from, dropIndex);
  }

  return (
    <div className={["flex flex-col gap-2", className].join(" ")}>
      {items.map((it, i) => (
        <div
          key={getKey(it)}
          draggable
          onDragStart={(e) => onDragStart(e, i)}
          onDragOver={(e) => onDragOver(e, i)}
          onDrop={(e) => onDrop(e, i)}
          className="group rounded-lg border border-neutral-800 bg-neutral-900/70 hover:bg-neutral-900 transition flex items-center gap-3 p-2"
        >
          <svg aria-hidden className="shrink-0 opacity-60 group-hover:opacity-100" width="18" height="18" viewBox="0 0 24 24">
            <path fill="currentColor" d="M10 4h10v2H10V4Zm0 14h10v2H10v-2ZM4 9h16v2H4V9Zm0 5h16v2H4v-2Z"/>
          </svg>
          {renderItem(it, i)}
          <span className="ml-auto text-xs px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700">drag</span>
        </div>
      ))}
    </div>
  );
}
