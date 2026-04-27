import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function IssuesPage() {
  const issues = await prisma.issue.findMany({
    include: {
      reportedByUser: { select: { fullName: true } },
      ownerIdUser: { select: { fullName: true } },
      project: { select: { projectName: true } },
    },
    orderBy: { dateFound: "desc" },
    take: 50,
  });

  function statusColor(s: string) {
    const map: Record<string, string> = { "CLOSED": "badge-green", "FIXED": "badge-green", "MONITORING": "badge-blue", "IN_PROGRESS": "badge-blue", "OPEN": "badge-red", "WONT_FIX": "badge-gray" };
    return map[s] || "badge-gray";
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Issue & Bug Log</h1>
        <p className="text-muted-foreground mt-1">All issues across projects</p>
        <button className="btn-primary">Report Issue</button>
      </div>
      <div className="card">
        <table className="table">
          <thead><tr><th>Issue</th><th>Project</th><th>Reporter</th><th>Owner</th><th>Impact</th><th>Status</th><th>Found</th><th>Actions</th></tr></thead>
          <tbody>
            {issues.map((issue) => (
              <tr key={issue.id}>
                <td>
                  <p className="font-medium text-foreground">{issue.title}</p>
                  {issue.description && <p className="text-xs text-muted-foreground mt-0.5">{issue.description}</p>}
                </td>
                <td className="text-sm">{issue.project.projectName}</td>
                <td>{issue.reportedByUser.fullName}</td>
                <td>{issue.ownerIdUser.fullName}</td>
                <td className="text-sm">{issue.impact || "—"}</td>
                <td><span className={`badge ${statusColor(issue.status)}`}>{issue.status}</span></td>
                <td className="text-sm text-muted-foreground">{new Date(issue.dateFound).toLocaleDateString()}</td>
                <td><button className="btn-secondary text-xs py-1 px-2">View</button></td>
              </tr>
            ))}
            {issues.length === 0 && <tr><td colSpan={8} className="text-center py-8 text-muted-foreground">No issues reported.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
