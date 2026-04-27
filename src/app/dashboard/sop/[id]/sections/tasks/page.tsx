import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function TasksPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  const sections = await prisma.projectSection.findMany({ where: { projectId: id } });
  const section = sections.find(s => s.sectionName === "Task Tracking");
  const tasks = await prisma.projectTask.findMany({
    where: { projectId: id },
    include: { assignedToUser: { select: { fullName: true } } },
    orderBy: { createdAt: "desc" },
  });

  function badge(status: string) {
    const c: Record<string, string> = { COMPLETE: "badge-green", NEEDS_UPDATE: "badge-yellow", UNDER_REVIEW: "badge-blue", MISSING: "badge-gray" };
    return c[status] || "badge-gray";
  }
  function taskBadge(s: string) {
    const c: Record<string, string> = { COMPLETED: "badge-green", BACKLOG: "badge-gray", NOT_STARTED: "badge-gray", IN_PROGRESS: "badge-blue", BLOCKED: "badge-red", WAITING_FOR_REVIEW: "badge-yellow", NEEDS_CHANGES: "badge-yellow", CANCELLED: "badge-gray" };
    return c[s] || "badge-gray";
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Task Tracking</h1>
        <p className="text-muted-foreground mt-1">{project?.projectName}</p>
        <button className="btn-primary">Create Task</button>
      </div>
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-semibold text-foreground">Task Tracking</p>
            <p className="text-sm text-muted-foreground">Section content</p>
          </div>
          <span className={`badge ${badge(section?.status || "MISSING")}`}>{section?.status || "Missing"}</span>
        </div>
      </div>
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Assigned</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Blocker</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => (
              <tr key={t.id}>
                <td>
                  <p className="font-medium text-foreground">{t.taskTitle}</p>
                  {t.taskDescription && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{t.taskDescription}</p>}
                </td>
                <td>{t.assignedToUser.fullName}</td>
                <td><span className={`badge ${t.priority === "URGENT" || t.priority === "HIGH" ? "badge-red" : t.priority === "MEDIUM" ? "badge-yellow" : "badge-green"}`}>{t.priority}</span></td>
                <td><span className={`badge ${taskBadge(t.status)}`}>{t.status.replace(/_/g, " ")}</span></td>
                <td className="text-sm text-muted-foreground">{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "\u2014"}</td>
                <td className="text-sm">{t.blockerReason ? <span className="text-red-600">{t.blockerReason}</span> : "\u2014"}</td>
                <td><button className="btn-secondary text-xs py-1 px-2">View</button></td>
              </tr>
            ))}
            {tasks.length === 0 && <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">No tasks for this project.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
