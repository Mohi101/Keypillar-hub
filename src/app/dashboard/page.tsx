import { prisma } from "@/lib/prisma";
import { FolderKanban, CheckSquare, AlertTriangle, Clock } from "lucide-react";

export default async function DashboardPage() {
  const metrics = await Promise.all([
    prisma.project.count({ where: { status: { not: "ARCHIVED" } } }),
    prisma.projectTask.count({ where: { status: { in: ["IN_PROGRESS", "NOT_STARTED", "BACKLOG"] } } }),
    prisma.projectTask.count({ where: { status: "BLOCKED" } }),
    prisma.projectTask.count({
      where: { status: "COMPLETED", completedDate: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } }
    }),
  ]);

  const [sopHealthScores, dailyUpdates, tasks] = await Promise.all([
    prisma.sopReview.findMany({
      take: 5,
      include: {
        project: { select: { projectName: true } },
        reviewedByUser: { select: { fullName: true } }
      },
      orderBy: { reviewDate: "desc" }
    }),
    prisma.dailyWorkUpdate.findMany({
      take: 5,
      include: { employeeIdUser: { select: { fullName: true } } },
      orderBy: { date: "desc" }
    }),
    prisma.projectTask.findMany({
      take: 8,
      include: { project: { select: { projectName: true } } },
      orderBy: { updatedAt: "desc" }
    })
  ]);

  const metricLabels = [
    { label: "Total Projects", icon: FolderKanban },
    { label: "Active Tasks", icon: CheckSquare },
    { label: "Blocked Tasks", icon: AlertTriangle },
    { label: "Completed Today", icon: Clock },
  ];

  const healthColor = (score: number) => {
    if (score >= 90) return "#22c55e";
    if (score >= 75) return "#3b82f6";
    if (score >= 60) return "#eab308";
    if (score >= 40) return "#f97316";
    return "#ef4444";
  };

  const healthBg = (score: number) => {
    if (score >= 90) return "#dcfce7";
    if (score >= 75) return "#dbeafe";
    if (score >= 60) return "#fef9c3";
    if (score >= 40) return "#ffedd5";
    return "#fee2e2";
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      COMPLETED: "badge-green", BACKLOG: "badge-gray", NOT_STARTED: "badge-gray",
      IN_PROGRESS: "badge-blue", BLOCKED: "badge-red", WAITING_FOR_REVIEW: "badge-yellow",
      NEEDS_CHANGES: "badge-yellow", CANCELLED: "badge-gray",
      OPEN: "badge-red", FIXED: "badge-green", MONITORING: "badge-yellow",
      CLOSED: "badge-green", WONT_FIX: "badge-gray"
    };
    return map[status] || "badge-gray";
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
      </div>

      {/* Metric Cards */}
      <div className="metrics-grid">
        {metrics.map((value, i) => (
          <div className="metric-card" key={i}>
            <div className="flex items-center justify-between">
              <div>
                <p className="metric-value">{value}</p>
                <p className="metric-label">{metricLabels[i].label}</p>
              </div>
              <metricLabels[i].icon className="w-8 h-8 text-muted-foreground/30" />
            </div>
          </div>
        ))}
      </div>

      {/* SOP Health Score */}
      <div className="card">
        <div className="card-header">
          <h3 className="font-semibold text-foreground">SOP Health Score</h3>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Score</th>
              <th>Progress</th>
              <th>Reviewed By</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {sopHealthScores.map((r) => (
              <tr key={r.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div
                      className="health-score-circle"
                      style={{ background: healthBg(r.score), color: healthColor(r.score) }}
                    >
                      {r.score.toFixed(0)}
                    </div>
                    <span className="font-medium text-foreground">{r.project?.projectName || "—"}</span>
                  </div>
                </td>
                <td><span className="font-semibold" style={{ color: healthColor(r.score) }}>{r.score.toFixed(0)}/100</span></td>
                <td style={{ width: "200px" }}>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: r.score + "%", background: healthColor(r.score) }}
                    />
                  </div>
                </td>
                <td className="text-muted-foreground">{r.reviewedByUser?.fullName || "—"}</td>
                <td className="text-muted-foreground">{r.reviewDate ? new Date(r.reviewDate).toLocaleDateString() : "—"}</td>
              </tr>
            ))}
            {sopHealthScores.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8 text-muted-foreground">No health scores yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Recent Daily Updates */}
      <div className="card">
        <div className="card-header">
          <h3 className="font-semibold text-foreground">Recent Daily Updates</h3>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Date</th>
              <th>Today&apos;s Work</th>
              <th>Current Status</th>
            </tr>
          </thead>
          <tbody>
            {dailyUpdates.map((u) => (
              <tr key={u.id}>
                <td className="font-medium text-foreground">{u.employeeIdUser?.fullName || "—"}</td>
                <td className="text-muted-foreground">{u.date ? new Date(u.date).toLocaleDateString() : "—"}</td>
                <td>{u.todayWorkedOn || "—"}</td>
                <td>
                  <span className={`badge ${
                    u.currentStatus === "COMPLETED" ? "badge-green" :
                    u.currentStatus === "IN_PROGRESS" ? "badge-blue" :
                    u.currentStatus === "BLOCKED" ? "badge-red" :
                    u.currentStatus === "WAITING_FOR_REVIEW" ? "badge-yellow" : "badge-gray"
                  }`}>{u.currentStatus || "—"}</span>
                </td>
              </tr>
            ))}
            {dailyUpdates.length === 0 && (
              <tr><td colSpan={4} className="text-center py-8 text-muted-foreground">No updates yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Tasks */}
      <div className="card">
        <div className="card-header">
          <h3 className="font-semibold text-foreground">Tasks</h3>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Task</th>
              <th>Assigned</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Due</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => (
              <tr key={t.id}>
                <td className="text-muted-foreground">{t.project?.projectName || "—"}</td>
                <td className="font-medium text-foreground">{t.taskTitle}</td>
                <td className="text-muted-foreground">{t.assignedToUser?.fullName || "—"}</td>
                <td>
                  <span className={`badge ${
                    t.priority === "URGENT" || t.priority === "HIGH" ? "badge-red" :
                    t.priority === "MEDIUM" ? "badge-yellow" : "badge-green"
                  }`}>{t.priority}</span>
                </td>
                <td><span className={`badge ${statusBadge(t.status)}`}>{t.status.replace(/_/g, " ")}</span></td>
                <td className="text-muted-foreground">{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "—"}</td>
              </tr>
            ))}
            {tasks.length === 0 && (
              <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">No tasks yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
