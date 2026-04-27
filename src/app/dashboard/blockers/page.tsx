import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function BlockersPage() {
  const blockers = await prisma.blockerLog.findMany({
    include: {
      reportedByUser: { select: { fullName: true } },
      project: { select: { projectName: true } },
    },
    orderBy: { reportedDate: "desc" },
    take: 50,
  });

  function statusColor(s: string) {
    const map: Record<string, string> = { "OPEN": "badge-red", "IN_PROGRESS": "badge-blue", "WAITING_FOR_SOMEONE": "badge-yellow", "RESOLVED": "badge-green", "CLOSED": "badge-green" };
    return map[s] || "badge-gray";
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Blockers</h1>
        <p className="text-muted-foreground mt-1">All blockers across projects</p>
        <button className="btn-primary">Report Blocker</button>
      </div>
      <div className="card">
        <table className="table">
          <thead><tr><th>Blocker</th><th>Project</th><th>Reported By</th><th>Escalation</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {blockers.map((b) => (
              <tr key={b.id}>
                <td><p className="font-medium text-foreground">{b.blockerDesc}</p></td>
                <td className="text-sm">{b.project.projectName}</td>
                <td>{b.reportedByUser.fullName}</td>
                <td><span className={`badge ${b.escalationLevel === "CRITICAL" ? "badge-red" : b.escalationLevel === "HIGH" ? "badge-red" : b.escalationLevel === "MEDIUM" ? "badge-yellow" : "badge-green"}`}>{b.escalationLevel}</span></td>
                <td><span className={`badge ${statusColor(b.currentStatus)}`}>{b.currentStatus}</span></td>
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
