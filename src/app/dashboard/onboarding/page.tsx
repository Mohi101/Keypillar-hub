import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function OnboardingPage() {
  const records = await prisma.onboardingRecord.findMany({
    include: {
      employeeIdUser: { select: { fullName: true, role: true } },
      project: { select: { projectName: true } },
      onboardingBuddy: { select: { fullName: true } },
    },
    orderBy: { startDate: "desc" },
    take: 50,
  });

  function stageBadge(stage: string) {
    const map: Record<string, string> = { "COMPLETED": "badge-green", "DAY_30": "badge-blue", "DAY_7": "badge-yellow", "DAY_3": "badge-yellow", "DAY_1": "badge-gray" };
    return map[stage] || "badge-gray";
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Onboarding</h1>
        <p className="text-muted-foreground mt-1">All onboarding records</p>
        <button className="btn-primary">Start Onboarding</button>
      </div>
      <div className="card">
        <table className="table">
          <thead><tr><th>Employee</th><th>Project</th><th>Role</th><th>Stage</th><th>Completion</th><th>Buddy</th><th>Manager Review</th><th>Actions</th></tr></thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id}>
                <td>
                  <p className="font-medium text-foreground">{r.employeeIdUser.fullName}</p>
                  <p className="text-xs text-muted-foreground">Started: {new Date(r.startDate).toLocaleDateString()}</p>
                </td>
                <td className="text-sm">{r.project.projectName}</td>
                <td>{r.role}</td>
                <td><span className={`badge ${stageBadge(r.currentStage)}`}>{r.currentStage}</span></td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 rounded-full h-2" style={{ width: `${r.completionPct}%` }}></div>
                    </div>
                    <span className="text-xs text-muted-foreground">{r.completionPct}%</span>
                  </div>
                </td>
                <td className="text-sm">{r.onboardingBuddy?.fullName || "—"}</td>
                <td>{r.managerReview ? <span className="text-sm text-green-600">Reviewed</span> : <span className="text-sm text-amber-600">Pending</span>}</td>
                <td><button className="btn-secondary text-xs py-1 px-2">View</button></td>
              </tr>
            ))}
            {records.length === 0 && <tr><td colSpan={8} className="text-center py-8 text-muted-foreground">No onboarding records.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
