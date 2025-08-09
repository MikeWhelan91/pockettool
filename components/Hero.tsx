"use client";

import { motion } from "framer-motion";
import PocketKitLogo from "@/components/branding/PocketKitLogo";

export default function Hero() {
  return (
    <section className="relative px-4 pt-6 pb-12 sm:pt-10 sm:pb-16">
      <div className="mx-auto max-w-screen-lg">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="card p-6 sm:p-8"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Logo */}
            <div className="flex-shrink-0">
              <PocketKitLogo
                className="h-16 w-auto text-[color:var(--brand)]"
                aria-label="PocketKit"
              />
            </div>

            {/* Text content */}
            <div className="text-center sm:text-left">
<h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-[1.1]">  
                  Fast, Private Web Tools
              </h1>
<p className="mt-3 text-lg sm:text-xl text-[color:var(--text-muted)] max-w-prose">
                    Everything runs in your browser. No uploads. No tracking.
                Just the tools you need, instantly.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
