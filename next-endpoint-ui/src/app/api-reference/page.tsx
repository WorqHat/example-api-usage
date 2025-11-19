import AppClient from "@/components/AppClient";
import PageLayout from "@/components/PageLayout";
import { getEndpoints } from "@/lib/endpoints";

export default function ApiReferencePage() {
  const endpoints = getEndpoints();
  return (
    <PageLayout>
      <AppClient endpoints={endpoints} />
    </PageLayout>
  );
}

