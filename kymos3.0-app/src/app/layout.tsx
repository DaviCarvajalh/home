import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default:  "KyMOS 3.0",
    template: "%s · KyMOS 3.0",
  },
  description: "KyMOS 3.0 — Sistema ERP Empresarial",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
