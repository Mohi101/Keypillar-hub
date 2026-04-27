import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function SopHealthPage() {
  const projects = await prisma.project.findMany({
    orderBy: { sopHealthScore: "desc" },
    include: {
      projectOwnerUser: { select: { fullName: true } },
      sections: true,
      dailyUpdates: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  function scoreColor(s: number) {
    if (s >= 95) return "text-green-600";
    if (s >= 85) return "text-blue-600";
    if (s >= 70) return "text-yellow-600";
    if (s >= 50) return "text-orange-500";
    return "text-red-600";
  }

  function scoreBg(s: number) {
    if (s >= 95) return "bg-green-500";
    if (s >= 85) return "bg-blue-500";
    if (s >= 70) return "bg-yellow-500";
    if (s >= 50) return "bg-orange-500";
    return "bg-red-500";
  }

  function scoreLabel(s: number) {
    if (s >= 95) return "Excellent";
    if (s >= 85) return "Strong";
    if (s >= 70) return "Average";
    if (s >= 50) return "Weak";
    return "Critical";
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">SOP Health Report</h1>
        <p className="text-muted-foreground mt-1">Health scores for all projects</p>
      </div>
      <div className="card">
        <table className="table">
          <thead><tr><th>Project</th><th>Owner</th><th>Health Score</th><th>Status</th><th>Sections</th><th>Last Update</th><th>Actions</th></tr></thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id}>
                <td>
                  <p className="font-medium text-foreground">{p.projectName}</p>
                </td>
                <td>{p.projectOwnerUser.fullName}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-3">
                      <div className={`${scoreBg(p.sopHealthScore)} rounded-full h-3`} style={{ width: `${Math.min(p.sopHealthScore, 100)}%` }}></div>
                    </div>
                    <span className={`text-sm font-bold ${scoreColor(p.sopHealthScore)}`}>{p.sopHealthScore.toFixed(0)}/100</span>
                  </div>
                </td>
                <td><span className="badge badge-green">{scoreLabel(p.sopHealthScore)}</span></td>
                <td className="text-sm">{p.sections.filter(s => s.status === "COMPLETE").length}/{p.sections.length}</td>
                <td className="text-sm text-muted-foreground">{p.dailyUpdates[0] ? new Date(p.dailyUpdates[0].createdAt).toLocaleDateString() : "—"}</td>
                <td><a href={`/dashboard/sop/${p.id}/sections/health`} className="btn-secondary text-xs py-1 px-2">View</a></td>
              </tr>
            ))}
            {projects.length === 0 && <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">No projects to report on.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
