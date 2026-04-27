import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AiSystemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  const sections = await prisma.projectSection.findMany({ where: { projectId: id } });
  const section = sections.find(s => s.sectionName === "AI System Overview");

  function badge(status: string) {
    const c: Record<string, string> = { COMPLETE: "badge-green", NEEDS_UPDATE: "badge-yellow", UNDER_REVIEW: "badge-blue", MISSING: "badge-gray" };
    return c[status] || "badge-gray";
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">AI System Overview</h1>
        <p className="text-muted-foreground mt-1">{project?.projectName}</p>
        <button className="btn-primary">Edit Section</button>
      </div>
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-semibold text-foreground">AI System Overview</p>
            <p className="text-sm text-muted-foreground">Section content</p>
          </div>
          <span className={`badge ${badge(section?.status || "MISSING")}`}>{section?.status || "Missing"}</span>
        </div>
        <p className="text-muted-foreground text-sm">
          {section?.purpose || "No content yet."}
        </p>
      </div>
    </div>
  );
}
