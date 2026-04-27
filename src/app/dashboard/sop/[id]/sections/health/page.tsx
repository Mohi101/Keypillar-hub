import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function HealthPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) return <div className="card text-center py-12 text-muted-foreground">Project not found</div>;

  const sections = await prisma.projectSection.findMany({ where: { projectId: id } });
  const score = project.sopHealthScore || 0;

  function scoreColor(s: number) {
    if (s >= 95) return "text-green-600";
    if (s >= 85) return "text-blue-600";
    if (s >= 70) return "text-yellow-600";
    if (s >= 50) return "text-orange-500";
    return "text-red-600";
  }
  function scoreBg(s: number) {
    if (s >= 95) return "bg-green-500";
    if (s >= 85) return "bg-blue-500";
    if (s >= 70) return "bg-yellow-500";
    if (s >= 50) return "bg-orange-500";
    return "bg-red-500";
  }
  function scoreLabel(s: number) {
    if (s >= 95) return "Excellent";
    if (s >= 85) return "Strong";
    if (s >= 70) return "Average";
    if (s >= 50) return "Weak";
    return "Critical";
  }

  const criteria = [
    { name: "Project Overview Completed", weight: 8, has: !!project.summary },
    { name: "Technical Setup Completed", weight: 8, has: sections.some(s => s.sectionName === "Technical Setup Guide") },
    { name: "Feature Register Updated", weight: 12, has: true },
    { name: "Roadmap Updated", weight: 8, has: true },
    { name: "Issue Log Updated", weight: 10, has: true },
    { name: "Decision Log Updated", weight: 8, has: true },
    { name: "Change Log Updated", weight: 12, has: true },
    { name: "Onboarding Checklist Ready", weight: 8, has: true },
    { name: "Daily Work Updates Active", weight: 10, has: true },
    { name: "Blocked Work Tracking Active", weight: 6, has: true },
    { name: "Manager Dashboard Reviewed", weight: 5, has: true },
    { name: "Last SOP Review Completed", weight: 5, has: false },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">SOP Health Score</h1>
        <p className="text-muted-foreground mt-1">{project?.projectName}</p>
      </div>
      <div className="card mb-6 text-center py-8">
        <div className={scoreColor(score)} style={{ fontSize: "3rem", fontWeight: "bold" }}>{score.toFixed(0)}/100</div>
        <div className="inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 bg-green-100 text-green-800">{scoreLabel(score)}</div>
      </div>
      <div className="card mb-6">
        <h3 className="font-semibold text-foreground mb-4">Score Breakdown</h3>
        <div className="space-y-4">
          {criteria.map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className={`w-3 h-3 rounded-full ${item.has ? "bg-green-500" : "bg-gray-300"}`} />
                <span className="text-sm text-foreground">{item.name}</span>
              </div>
              <span className={`text-sm font-medium ${item.has ? "text-green-600" : "text-gray-400"}`}>{item.has ? item.weight : "0"}/{item.weight}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
