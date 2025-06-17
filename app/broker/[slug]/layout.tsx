import React from 'react';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Broker Details",
  description: "Detailed information about this forex broker",
};

export default function BrokerDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">{children}</main>
    </div>
  );
}
