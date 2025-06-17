import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Broker Website Content | Forex Broker Ratings",
  description: "View content extracted from broker websites",
};

export default function BrokerContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1">{children}</div>
    </div>
  );
}
