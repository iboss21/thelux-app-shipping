import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TheLux Shipping - International Parcel Forwarding Service",
  description: "Get your USA address and ship packages worldwide. Fast, reliable international parcel forwarding with air and sea freight options.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
