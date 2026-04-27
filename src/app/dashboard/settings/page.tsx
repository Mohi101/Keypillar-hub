import { auth } from "@/lib/auth";

export default async function SettingsPage() {
  const session = await auth();
  const user = session?.user;

  const settingsGroups = [
    {
      title: "Appearance",
      settings: [
        { key: "companyName", label: "Company Name", value: "KeyPillar", type: "text" },
        { key: "appName", label: "App Name", value: "KeyPillar Hub", type: "text" },
        { key: "themeColor", label: "Theme Color", value: "hsl(222.2 47.4% 11.2%)", type: "color" },
      ],
    },
    {
      title: "Project Configuration",
      settings: [
        { key: "projectStages", label: "Project Stages", value: "Planning, MVP, In Progress, Testing, Live, Paused, Archived", type: "text" },
        { key: "taskStatus", label: "Task Status Options", value: "Backlog, Not Started, In Progress, Blocked, Waiting for Review, Needs Changes, Completed, Cancelled", type: "text" },
        { key: "featureStatus", label: "Feature Status Options", value: "Planned, In Progress, Testing, Live, Deprecated, Blocked", type: "text" },
      ],
    },
    {
      title: "Notifications",
      settings: [
        { key: "dailyUpdateReminder", label: "Daily Update Reminder Time", value: "17:00", type: "time" },
        { key: "managerReviewReminder", label: "Manager Review Reminder (hours)", value: "24", type: "number" },
        { key: "sopReviewFrequency", label: "SOP Review Frequency (days)", value: "30", type: "number" },
        { key: "workingDays", label: "Working Days", value: "Monday-Friday", type: "text" },
      ],
    },
    {
      title: "Data",
      settings: [
        { key: "exportAll", label: "Export All Data", value: "", type: "action" },
        { key: "importData", label: "Import Data", value: "", type: "action" },
      ],
    },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="text-muted-foreground mt-1">Customize KeyPillar Hub for your business</p>
      </div>

      {settingsGroups.map((group) => (
        <div key={group.title} className="card mb-6">
          <h3 className="font-semibold text-foreground mb-4">{group.title}</h3>
          <div className="space-y-4">
            {group.settings.map((s) => (
              <div key={s.key} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{s.label}</p>
                  <p className="text-xs text-muted-foreground">{s.value}</p>
                </div>
                {s.type === "action" ? (
                  <button className="btn-secondary text-sm">Export</button>
                ) : (
                  <button className="btn-secondary text-sm">Edit</button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
