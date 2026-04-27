import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function ReportsPage() {
  const [
    totalProjects,
    totalTasks,
    totalUpdates,
    totalBlockers,
    totalFeatures,
    totalIssues,
    totalDecisions,
    totalChangeLogs,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.projectTask.count(),
    prisma.dailyWorkUpdate.count(),
    prisma.blockerLog.count(),
    prisma.feature.count(),
    prisma.issue.count(),
    prisma.decision.count(),
    prisma.changeLog.count(),
  ]);

  const reportCards = [
    { title: "Daily Update Report", desc: "All daily work updates with review status", count: totalUpdates, export: true },
    { title: "Weekly Project Progress", desc: "Project status overview across all projects", count: totalProjects, export: true },
    { title: "Blocker Report", desc: "All blockers with escalation levels", count: totalBlockers, export: true },
    { title: "Overdue Task Report", desc: "Tasks past due date", count: 0, export: true },
    { title: "SOP Health Report", desc: "Documentation quality scores", count: totalProjects, export: true },
    { title: "Employee Activity Report", desc: "Update submission frequency per employee", count: totalUpdates, export: true },
    { title: "Onboarding Progress", desc: "Onboarding completion rates", count: 0, export: true },
    { title: "Handover Risk Report", desc: "Pending handover approvals", count: 0, export: true },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Reports</h1>
        <p className="text-muted-foreground mt-1">Summary reports for managers and founders</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportCards.map((report) => (
          <div key={report.title} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{report.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{report.desc}</p>
                <p className="text-2xl font-bold text-foreground mt-3">{report.count}</p>
              </div>
              <button className="btn-secondary text-xs py-1 px-3">{report.export ? "Export" : "View"}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
