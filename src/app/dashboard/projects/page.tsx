import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    "Live": "badge-green", "Completed": "badge-green", "Good": "badge-green",
    "In Progress": "badge-blue", "Active": "badge-blue", "Testing": "badge-blue",
    "Open": "badge-yellow", "MVP": "badge-yellow", "Review": "badge-yellow",
    "Blocked": "badge-red", "Critical": "badge-red",
    "Archived": "badge-gray", "Paused": "badge-gray", "Inactive": "badge-gray", "Planning": "badge-gray",
  };
  return <span className={`badge ${colors[status] || "badge-gray"}`}>{status}</span>;
}

function ScoreBadge({ score }: { score: number }) {
  if (score >= 95) return <span className="badge badge-green">{score}/100 Excellent</span>;
  if (score >= 85) return <span className="badge badge-blue">{score}/100 Strong</span>;
  if (score >= 70) return <span className="badge badge-yellow">{score}/100 Average</span>;
  if (score >= 50) return <span className="badge badge-red">{score}/100 Weak</span>;
  return <span className="badge badge-red">{score}/100 Critical</span>;
}

export default async function ProjectsPage() {
  const session = await auth();
  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      projectOwnerUser: { select: { fullName: true } },
      docOwnerUser: { select: { fullName: true } },
    },
  });

  const stages = ["Planning", "MVP", "In Progress", "Testing", "Live", "Paused", "Archived"];
  const statuses = ["Planning", "MVP", "In Progress", "Testing", "Live", "Paused", "Archived"];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Projects</h1>
        <button className="btn-primary">Create Project</button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Owner</th>
              <th>Stage</th>
              <th>Status</th>
              <th>SOP Health</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id}>
                <td>
                  <p className="font-medium text-foreground">{p.projectName}</p>
                  {p.summary && <p className="text-muted-foreground text-xs mt-0.5 line-clamp-1">{p.summary}</p>}
                </td>
                <td>{p.projectOwnerUser.fullName}</td>
                <td><StatusBadge status={p.currentStage} /></td>
                <td><StatusBadge status={p.status} /></td>
                <td><ScoreBadge score={Math.round(p.sopHealthScore)} /></td>
                <td className="text-muted-foreground text-sm">{new Date(p.updatedAt).toLocaleDateString()}</td>
                <td>
                  <div className="flex gap-2">
                    <a href={`/dashboard/sop/${p.id}/sections/overview`} className="btn-secondary text-xs py-1 px-2">Open</a>
                    <button className="btn-secondary text-xs py-1 px-2">Edit</button>
                  </div>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">No projects yet. Create your first project.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
