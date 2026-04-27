import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function HandoverPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  const sections = await prisma.projectSection.findMany({ where: { projectId: id } });
  const section = sections.find(s => s.sectionName === "Handover Checklist");
  const records = await prisma.handoverRecord.findMany({
    where: { projectId: id },
    include: { employeeIdUser: { select: { fullName: true } }, replacementOwner: { select: { fullName: true } } },
    orderBy: { createdAt: "desc" },
  });

  function badge(status: string) {
    const c: Record<string, string> = { COMPLETE: "badge-green", NEEDS_UPDATE: "badge-yellow", UNDER_REVIEW: "badge-blue", MISSING: "badge-gray" };
    return c[status] || "badge-gray";
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Handover Checklist</h1>
        <p className="text-muted-foreground mt-1">{project?.projectName}</p>
        <button className="btn-primary">Start Handover</button>
      </div>
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-semibold text-foreground">Handover Checklist</p>
            <p className="text-sm text-muted-foreground">Section content</p>
          </div>
          <span className={`badge ${badge(section?.status || "MISSING")}`}>{section?.status || "Missing"}</span>
        </div>
      </div>
      <div className="card">
        <table className="table">
          <thead><tr><th>Employee</th><th>Role</th><th>Last Working</th><th>Replacement</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id}>
                <td><p className="font-medium text-foreground">{r.employeeIdUser.fullName}</p></td>
                <td>{r.role}</td>
                <td className="text-sm text-muted-foreground">{r.lastWorkingDate ? new Date(r.lastWorkingDate).toLocaleDateString() : "\u2014"}</td>
                <td className="text-sm">{r.replacementOwner.fullName}</td>
                <td><span className={`badge ${r.managerApprovalStatus === "APPROVED" ? "badge-green" : r.managerApprovalStatus === "PENDING" ? "badge-yellow" : "badge-red"}`}>{r.managerApprovalStatus}</span></td>
                <td className="text-sm text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</td>
                <td><button className="btn-secondary text-xs py-1 px-2">View</button></td>
              </tr>
            ))}
            {records.length === 0 && <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">No handover records.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
