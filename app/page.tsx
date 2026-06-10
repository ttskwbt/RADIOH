import { ClientOnly } from "@/components/ClientOnly";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { RadioApp } from "@/components/RadioApp";

export default function Home() {
  return (
    <ErrorBoundary>
      <ClientOnly>
        <RadioApp />
      </ClientOnly>
    </ErrorBoundary>
  );
}
