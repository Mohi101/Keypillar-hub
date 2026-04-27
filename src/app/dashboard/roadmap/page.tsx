import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function RoadmapPage() {
  const items = await prisma.roadmapItem.findMany({
    include: {
      ownerIdUser: { select: { fullName: true } },
      project: { select: { projectName: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  function statusColor(s: string) {
    const map: Record<string, string> = { "COMPLETED": "badge-green", "IN_PROGRESS": "badge-blue", "PLANNED": "badge-yellow", "NOT_STARTED": "badge-gray", "BLOCKED": "badge-red", "CANCELLED": "badge-gray" };
    return map[s] || "badge-gray";
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Roadmap / Missing Features</h1>
        <p className="text-muted-foreground mt-1">All roadmap items across projects</p>
        <button className="btn-primary">Add Item</button>
      </div>
      <div className="card">
        <table className="table">
          <thead><tr><th>Item</th><th>Project</th><th>Owner</th><th>Priority</th><th>Status</th><th>Target</th><th>Actions</th></tr></thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <p className="font-medium text-foreground">{item.title}</p>
                  {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
                </td>
                <td className="text-sm">{item.project.projectName}</td>
                <td>{item.ownerIdUser.fullName}</td>
                <td><span className={`badge ${item.priority === "HIGH" || item.priority === "URGENT" ? "badge-red" : item.priority === "MEDIUM" ? "badge-yellow" : "badge-green"}`}>{item.priority}</span></td>
                <td><span className={`badge ${statusColor(item.status)}`}>{item.status}</span></td>
                <td className="text-sm text-muted-foreground">{item.targetDate ? new Date(item.targetDate).toLocaleDateString() : "—"}</td>
                <td><button className="btn-secondary text-xs py-1 px-2">Edit</button></td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">No roadmap items yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
