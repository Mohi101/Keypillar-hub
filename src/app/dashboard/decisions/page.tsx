import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DecisionsPage() {
  const decisions = await prisma.decision.findMany({
    include: {
      decisionOwnerIdUser: { select: { fullName: true } },
      project: { select: { projectName: true } },
    },
    orderBy: { decisionDate: "desc" },
    take: 50,
  });

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Decision Log</h1>
        <p className="text-muted-foreground mt-1">All decisions across projects</p>
        <button className="btn-primary">Record Decision</button>
      </div>
      <div className="card">
        <table className="table">
          <thead><tr><th>Decision</th><th>Project</th><th>Made By</th><th>Reason</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {decisions.map((d) => (
              <tr key={d.id}>
                <td>
                  <p className="font-medium text-foreground">{d.title}</p>
                  {d.description && <p className="text-xs text-muted-foreground mt-0.5">{d.description}</p>}
                </td>
                <td className="text-sm">{d.project.projectName}</td>
                <td>{d.decisionOwnerIdUser.fullName}</td>
                <td className="max-w-xs"><p className="text-sm">{d.reason}</p></td>
                <td className="text-sm text-muted-foreground">{new Date(d.decisionDate).toLocaleDateString()}</td>
                <td><button className="btn-secondary text-xs py-1 px-2">View</button></td>
              </tr>
            ))}
            {decisions.length === 0 && <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">No decisions recorded.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
