import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tiny RAG Assistant",
  description: "A tiny manual RAG project for learning",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}