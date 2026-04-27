import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function FeaturesPage() {
  const features = await prisma.feature.findMany({
    include: {
      ownerIdUser: { select: { fullName: true } },
      project: { select: { projectName: true } },
    },
    orderBy: { addedDate: "desc" },
    take: 50,
  });

  function statusColor(s: string) {
    const map: Record<string, string> = { "LIVE": "badge-green", "IN_PROGRESS": "badge-blue", "TESTING": "badge-blue", "PLANNED": "badge-yellow", "DEPRECATED": "badge-gray", "BLOCKED": "badge-red" };
    return map[s] || "badge-gray";
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Feature Register</h1>
        <p className="text-muted-foreground mt-1">All features across projects</p>
        <button className="btn-primary">Add Feature</button>
      </div>
      <div className="card">
        <table className="table">
          <thead><tr><th>Feature</th><th>Project</th><th>Owner</th><th>Status</th><th>Priority</th><th>Added</th><th>Actions</th></tr></thead>
          <tbody>
            {features.map((f) => (
              <tr key={f.id}>
                <td>
                  <p className="font-medium text-foreground">{f.featureName}</p>
                  {f.description && <p className="text-xs text-muted-foreground">{f.description}</p>}
                </td>
                <td className="text-sm">{f.project.projectName}</td>
                <td>{f.ownerIdUser.fullName}</td>
                <td><span className={`badge ${statusColor(f.status)}`}>{f.status}</span></td>
                <td><span className={`badge ${f.priority === "HIGH" || f.priority === "URGENT" ? "badge-red" : f.priority === "MEDIUM" ? "badge-yellow" : "badge-green"}`}>{f.priority}</span></td>
                <td className="text-sm text-muted-foreground">{new Date(f.addedDate).toLocaleDateString()}</td>
                <td><button className="btn-secondary text-xs py-1 px-2">Edit</button></td>
              </tr>
            ))}
            {features.length === 0 && <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">No features added yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
