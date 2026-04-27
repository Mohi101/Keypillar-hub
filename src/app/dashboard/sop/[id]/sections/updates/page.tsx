import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function UpdatesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  const sections = await prisma.projectSection.findMany({ where: { projectId: id } });
  const section = sections.find(s => s.sectionName === "Daily Work Updates");
  const entries = await prisma.employeeEntry.findMany({
    where: { projectId: id },
    include: { employeeIdUser: { select: { fullName: true, role: true } } },
    orderBy: { updatedAt: "desc" },
  });

  function badge(s: string) {
    const c: Record<string, string> = { COMPLETE: "badge-green", NEEDS_UPDATE: "badge-yellow", UNDER_REVIEW: "badge-blue", MISSING: "badge-gray" };
    return c[s] || "badge-gray";
  }
  function statusBadge(s: string) {
    const c: Record<string, string> = { Completed: "badge-green", "In Progress": "badge-blue", Blocked: "badge-red", "Not Started": "badge-gray" };
    return c[s] || "badge-yellow";
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Daily Work Updates</h1>
        <p className="text-muted-foreground mt-1">{project?.projectName} - Team Work Log</p>
        <button className="btn-primary">Add Employee</button>
      </div>
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-semibold text-foreground">Daily Work Updates</p>
            <p className="text-sm text-muted-foreground">Section content</p>
          </div>
          <span className={`badge ${badge(section?.status || "MISSING")}`}>{section?.status || "Missing"}</span>
        </div>
      </div>
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Role</th>
              <th>Today&apos;s Work</th>
              <th>Progress</th>
              <th>Status</th>
              <th>Next Step</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id}>
                <td><p className="font-medium text-foreground">{entry.employeeName}</p></td>
                <td>{entry.role}</td>
                <td className="max-w-xs"><p className="text-sm text-foreground">{entry.todayWork || "-"}</p></td>
                <td><p className="text-sm text-muted-foreground">{entry.progress || "-"}</p></td>
                <td><span className={`badge ${statusBadge(entry.status)}`}>{entry.status}</span></td>
                <td className="text-sm text-muted-foreground max-w-xs">{entry.nextStep || "-"}</td>
                <td className="text-sm text-muted-foreground">{entry.lastUpdated ? new Date(entry.lastUpdated).toLocaleDateString() : "-"}</td>
                <td>
                  <div className="flex gap-2">
                    <button className="btn-secondary text-xs py-1 px-2">Edit</button>
                    <button className="btn-secondary text-xs py-1 px-2">Comment</button>
                  </div>
                </td>
              </tr>
            ))}
            {entries.length === 0 && (
              <tr><td colSpan={8} className="text-center py-8 text-muted-foreground">No employees assigned to this project yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
