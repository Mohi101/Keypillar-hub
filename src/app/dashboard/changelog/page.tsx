import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function ChangeLogPage() {
  const logs = await prisma.changeLog.findMany({
    include: {
      addedByIdUser: { select: { fullName: true } },
      project: { select: { projectName: true } },
    },
    orderBy: { date: "desc" },
    take: 50,
  });

  function typeColor(t: string) {
    const map: Record<string, string> = { "NEW_FEATURE": "badge-green", "BUG_FIX": "badge-red", "IMPROVEMENT": "badge-blue", "DOCUMENTATION": "badge-yellow", "SECURITY": "badge-red", "AI_PROMPT_CHANGE": "badge-blue", "AI_MODEL_CHANGE": "badge-blue", "DATABASE_CHANGE": "badge-blue", "UI_CHANGE": "badge-blue", "DEPLOYMENT_CHANGE": "badge-green", "PROCESS_CHANGE": "badge-yellow" };
    return map[t] || "badge-gray";
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Change Log</h1>
        <p className="text-muted-foreground mt-1">All changes across projects</p>
        <button className="btn-primary">Add Change</button>
      </div>
      <div className="card">
        <table className="table">
          <thead><tr><th>Change</th><th>Type</th><th>Project</th><th>Added By</th><th>Impact</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>
                  <p className="font-medium text-foreground">{log.title}</p>
                  {log.whatChanged && <p className="text-xs text-muted-foreground mt-0.5">{log.whatChanged}</p>}
                </td>
                <td><span className={`badge ${typeColor(log.changeType)}`}>{log.changeType.replace(/_/g, " ")}</span></td>
                <td className="text-sm">{log.project.projectName}</td>
                <td>{log.addedByIdUser.fullName}</td>
                <td className="text-sm text-muted-foreground">{log.impact || "—"}</td>
                <td className="text-sm text-muted-foreground">{new Date(log.date).toLocaleDateString()}</td>
                <td><button className="btn-secondary text-xs py-1 px-2">View</button></td>
              </tr>
            ))}
            {logs.length === 0 && <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">No changes logged.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
