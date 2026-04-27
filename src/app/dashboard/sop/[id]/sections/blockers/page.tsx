import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function BlockersPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  const sections = await prisma.projectSection.findMany({ where: { projectId: id } });
  const section = sections.find(s => s.sectionName === "Blocker Log");
  const blockers = await prisma.blockerLog.findMany({
    where: { projectId: id },
    include: { reportedByUser: { select: { fullName: true } } },
    orderBy: { reportedDate: "desc" },
  });

  function badge(status: string) {
    const c: Record<string, string> = { COMPLETE: "badge-green", NEEDS_UPDATE: "badge-yellow", UNDER_REVIEW: "badge-blue", MISSING: "badge-gray" };
    return c[status] || "badge-gray";
  }
  function blockerBadge(s: string) {
    const c: Record<string, string> = { OPEN: "badge-red", IN_PROGRESS: "badge-blue", WAITING_FOR_SOMEONE: "badge-yellow", RESOLVED: "badge-green", CLOSED: "badge-green" };
    return c[s] || "badge-gray";
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Blocker Log</h1>
        <p className="text-muted-foreground mt-1">{project?.projectName}</p>
        <button className="btn-primary">Report Blocker</button>
      </div>
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-semibold text-foreground">Blocker Log</p>
            <p className="text-sm text-muted-foreground">Section content</p>
          </div>
          <span className={`badge ${badge(section?.status || "MISSING")}`}>{section?.status || "Missing"}</span>
        </div>
      </div>
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Blocker</th>
              <th>Reported By</th>
              <th>Escalation</th>
              <th>Status</th>
              <th>Person Needed</th>
              <th>Reported</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blockers.map((b) => (
              <tr key={b.id}>
                <td>
                  <p className="font-medium text-foreground">{b.blockerDesc}</p>
                  {b.impact && <p className="text-xs text-muted-foreground mt-0.5">{b.impact}</p>}
                </td>
                <td>{b.reportedByUser.fullName}</td>
                <td><span className={`badge ${b.escalationLevel === "CRITICAL" ? "badge-red" : b.escalationLevel === "HIGH" ? "badge-red" : b.escalationLevel === "MEDIUM" ? "badge-yellow" : "badge-green"}`}>{b.escalationLevel}</span></td>
                <td><span className={`badge ${blockerBadge(b.currentStatus)}`}>{b.currentStatus}</span></td>
                <td className="text-sm text-muted-foreground">{b.personNeeded || "\u2014"}</td>
                <td className="text-sm text-muted-foreground">{new Date(b.reportedDate).toLocaleDateString()}</td>
                <td><button className="btn-secondary text-xs py-1 px-2">View</button></td>
              </tr>
            ))}
            {blockers.length === 0 && <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">No blockers reported.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
