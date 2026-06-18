import { AssistantPanel } from "@/app/_components/AssistantPanel";

// The assistant now lives beside services on /find-support; this standalone
// route stays as a thin wrapper (and /assistant redirects there via next.config).
export default function AssistantPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <AssistantPanel />
    </div>
  );
}
