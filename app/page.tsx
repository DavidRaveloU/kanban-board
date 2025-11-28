"use client";

import dynamic from "next/dynamic";

const Kanban = dynamic(() => import("./components/Kanban"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="flex flex-col items-start mt-4">
        <h1 className="text-4xl font-bold">Kanban Board</h1>
        <span className="text-muted-foreground">By David Ravelo</span>
        <span className="text-muted-foreground">
          Created with Next.js, Radix UI and TailwindCSS
        </span>
      </div>

      <Kanban />
    </main>
  );
}
