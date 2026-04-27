import { redirect } from "next/navigation";

export default async function SopRedirect({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect("/dashboard/sop/" + id + "/sections/overview");
}
