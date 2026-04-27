import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function HandoverPage() {
  const records = await prisma.handoverRecord.findMany({
    include: {
      employeeIdUser: { select: { fullName: true, role: true } },
      project: { select: { projectName: true } },
      replacementOwner: { select: { fullName: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  function statusBadge(s: string) {
    const map: Record<string, string> = { "APPROVED": "badge-green", "PENDING": "badge-yellow", "REJECTED": "badge-red" };
    return map[s] || "badge-gray";
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Handover</h1>
        <p className="text-muted-foreground mt-1">All handover records</p>
        <button className="btn-primary">Start Handover</button>
      </div>
      <div className="card">
        <table className="table">
          <thead><tr><th>Employee</th><th>Project</th><th>Role</th><th>Last Working</th><th>Replacement</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id}>
                <td>
                  <p className="font-medium text-foreground">{r.employeeIdUser.fullName}</p>
                  <p className="text-xs text-muted-foreground">{r.role}</p>
                </td>
                <td className="text-sm">{r.project.projectName}</td>
                <td className="text-sm">{r.role}</td>
                <td className="text-sm text-muted-foreground">{r.lastWorkingDate ? new Date(r.lastWorkingDate).toLocaleDateString() : "—"}</td>
                <td className="text-sm">{r.replacementOwner.fullName}</td>
                <td><span className={`badge ${statusBadge(r.managerApprovalStatus)}`}>{r.managerApprovalStatus}</span></td>
                <td className="text-sm text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</td>
                <td><button className="btn-secondary text-xs py-1 px-2">View</button></td>
              </tr>
            ))}
            {records.length === 0 && <tr><td colSpan={8} className="text-center py-8 text-muted-foreground">No handover records.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
