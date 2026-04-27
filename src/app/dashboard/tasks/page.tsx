import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function TasksPage() {
  const tasks = await prisma.projectTask.findMany({
    include: {
      assignedToUser: { select: { fullName: true } },
      project: { select: { projectName: true } },
    },
    orderBy: { dueDate: "asc" },
    take: 50,
  });

  function statusColor(s: string) {
    const map: Record<string, string> = { "COMPLETED": "badge-green", "BACKLOG": "badge-gray", "NOT_STARTED": "badge-gray", "IN_PROGRESS": "badge-blue", "BLOCKED": "badge-red", "WAITING_FOR_REVIEW": "badge-yellow", "NEEDS_CHANGES": "badge-yellow", "CANCELLED": "badge-gray" };
    return map[s] || "badge-gray";
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Tasks</h1>
        <p className="text-muted-foreground mt-1">All tasks across projects</p>
        <button className="btn-primary">Create Task</button>
      </div>
      <div className="card">
        <table className="table">
          <thead><tr><th>Task</th><th>Project</th><th>Assigned</th><th>Priority</th><th>Status</th><th>Due</th><th>Actions</th></tr></thead>
          <tbody>
            {tasks.map((t) => (
              <tr key={t.id}>
                <td><p className="font-medium text-foreground">{t.taskTitle}</p><p className="text-xs text-muted-foreground">{t.taskDescription}</p></td>
                <td className="text-sm">{t.project.projectName}</td>
                <td>{t.assignedToUser.fullName}</td>
                <td><span className={`badge ${t.priority === "URGENT" || t.priority === "HIGH" ? "badge-red" : t.priority === "MEDIUM" ? "badge-yellow" : "badge-green"}`}>{t.priority}</span></td>
                <td><span className={`badge ${statusColor(t.status)}`}>{t.status.replace(/_/g, " ")}</span></td>
                <td className="text-sm text-muted-foreground">{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "—"}</td>
                <td><button className="btn-secondary text-xs py-1 px-2">View</button></td>
              </tr>
            ))}
            {tasks.length === 0 && <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">No tasks created yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
