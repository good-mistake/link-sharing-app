"use client";

import "../styles/styles.scss";
import ReduxProvider from "../redux/provider";
import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <AnimatePresence mode="wait">
            <div key={pathname}>{children}</div>{" "}
          </AnimatePresence>
        </ReduxProvider>
      </body>
    </html>
  );
}
