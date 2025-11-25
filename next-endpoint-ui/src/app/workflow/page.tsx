import { redirect } from "next/navigation";

import { getWorkflowSections } from "@/lib/workflow";

export default function WorkflowIndexPage() {
  const sections = getWorkflowSections();
  if (sections.length === 0) {
    redirect("/"); // fallback
  }

  redirect(sections[0].href);
}

