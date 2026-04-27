import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function UpdatesPage() {
  const session = await auth();
  const updates = await prisma.dailyWorkUpdate.findMany({
    include: {
      employeeIdUser: { select: { fullName: true, role: true } },
      project: { select: { projectName: true } },
    },
    orderBy: { date: "desc" },
    take: 50,
  });

  function statusColor(s: string) {
    const map: Record<string, string> = { "COMPLETED": "badge-green", "IN_PROGRESS": "badge-blue", "BLOCKED": "badge-red", "WAITING_FOR_REVIEW": "badge-yellow", "NOT_STARTED": "badge-gray" };
    return map[s] || "badge-gray";
  }
  function reviewColor(r: string) {
    const map: Record<string, string> = { "REVIEWED": "badge-green", "NOT_REVIEWED": "badge-yellow", "NEEDS_CLARIFICATION": "badge-yellow", "ACTION_REQUIRED": "badge-red" };
    return map[r] || "badge-gray";
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Daily Work Updates</h1>
        <p className="text-muted-foreground mt-1">All daily work updates across projects</p>
        <button className="btn-primary">New Update</button>
      </div>
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Project</th>
              <th>Date</th>
              <th>Today's Work</th>
              <th>Status</th>
              <th>Review</th>
              <th>Manager Comment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {updates.map((u) => (
              <tr key={u.id}>
                <td>
                  <p className="font-medium text-foreground">{u.employeeIdUser.fullName}</p>
                  <p className="text-xs text-muted-foreground">{u.employeeIdUser.role}</p>
                </td>
                <td>{u.project.projectName}</td>
                <td className="text-sm">{new Date(u.date).toLocaleDateString()}</td>
                <td className="max-w-xs"><p className="text-sm">{u.todayWorkedOn}</p></td>
                <td><span className={`badge ${statusColor(u.currentStatus)}`}>{u.currentStatus}</span></td>
                <td><span className={`badge ${reviewColor(u.managerReviewStatus)}`}>{u.managerReviewStatus.replace(/_/g, " ")}</span></td>
                <td className="text-sm text-muted-foreground max-w-xs">{u.managerComment || "—"}</td>
                <td><button className="btn-secondary text-xs py-1 px-2">Review</button></td>
              </tr>
            ))}
            {updates.length === 0 && <tr><td colSpan={8} className="text-center py-8 text-muted-foreground">No daily updates yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
