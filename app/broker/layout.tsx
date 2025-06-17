import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Broker Information",
  description: "Detailed information about forex brokers",
};

export default function BrokerLayout({
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
