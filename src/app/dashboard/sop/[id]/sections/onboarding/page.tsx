import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function OnboardingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  const sections = await prisma.projectSection.findMany({ where: { projectId: id } });
  const section = sections.find(s => s.sectionName === "Onboarding Checklist");
  const records = await prisma.onboardingRecord.findMany({
    where: { projectId: id },
    include: { employeeIdUser: { select: { fullName: true } }, onboardingBuddy: { select: { fullName: true } } },
    orderBy: { startDate: "desc" },
  });

  function badge(status: string) {
    const c: Record<string, string> = { COMPLETE: "badge-green", NEEDS_UPDATE: "badge-yellow", UNDER_REVIEW: "badge-blue", MISSING: "badge-gray" };
    return c[status] || "badge-gray";
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Onboarding Checklist</h1>
        <p className="text-muted-foreground mt-1">{project?.projectName}</p>
        <button className="btn-primary">Start Onboarding</button>
      </div>
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-semibold text-foreground">Onboarding Checklist</p>
            <p className="text-sm text-muted-foreground">Section content</p>
          </div>
          <span className={`badge ${badge(section?.status || "MISSING")}`}>{section?.status || "Missing"}</span>
        </div>
      </div>
      <div className="card mb-6">
        <h3 className="font-semibold text-foreground mb-4">Onboarding Records</h3>
        <table className="table">
          <thead><tr><th>Employee</th><th>Role</th><th>Stage</th><th>Completion</th><th>Buddy</th><th>Manager Review</th><th>Actions</th></tr></thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id}>
                <td><p className="font-medium text-foreground">{r.employeeIdUser.fullName}</p></td>
                <td>{r.role}</td>
                <td><span className="badge badge-blue">{r.currentStage}</span></td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 rounded-full h-2" style={{ width: r.completionPct + "%" }}></div>
                    </div>
                    <span className="text-xs text-muted-foreground">{r.completionPct}%</span>
                  </div>
                </td>
                <td className="text-sm">{r.onboardingBuddy?.fullName || "\u2014"}</td>
                <td>{r.managerReview ? <span className="text-sm text-green-600">Reviewed</span> : <span className="text-sm text-amber-600">Pending</span>}</td>
                <td><button className="btn-secondary text-xs py-1 px-2">View</button></td>
              </tr>
            ))}
            {records.length === 0 && <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">No onboarding records.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
