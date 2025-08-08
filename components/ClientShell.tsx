'use client';

import ToolMenu from './ToolMenu';

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolMenu />
      {children}
    </>
  );
}
