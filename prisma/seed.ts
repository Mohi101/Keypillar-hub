import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@keypillarhub.com" },
    update: {},
    create: { fullName: "Admin User", email: "admin@keypillarhub.com", passwordHash, role: "ADMIN", department: "IT" },
  });
  const founder = await prisma.user.upsert({
    where: { email: "founder@keypillarhub.com" },
    update: {},
    create: { fullName: "Founder", email: "founder@keypillarhub.com", passwordHash, role: "FOUNDER", department: "Executive" },
  });
  const pm = await prisma.user.upsert({
    where: { email: "manager@keypillarhub.com" },
    update: {},
    create: { fullName: "Project Manager", email: "manager@keypillarhub.com", passwordHash, role: "PROJECT_MANAGER", department: "Engineering" },
  });
  const po = await prisma.user.upsert({
    where: { email: "owner@keypillarhub.com" },
    update: {},
    create: { fullName: "Project Owner", email: "owner@keypillarhub.com", passwordHash, role: "PROJECT_OWNER", department: "Product" },
  });
  const docOwner = await prisma.user.upsert({
    where: { email: "docowner@keypillarhub.com" },
    update: {},
    create: { fullName: "Documentation Owner", email: "docowner@keypillarhub.com", passwordHash, role: "DOCUMENTATION_OWNER", department: "Documentation" },
  });
  const member = await prisma.user.upsert({
    where: { email: "employee@keypillarhub.com" },
    update: {},
    create: { fullName: "Team Member", email: "employee@keypillarhub.com", passwordHash, role: "TEAM_MEMBER", department: "Engineering" },
  });
  const newHire = await prisma.user.upsert({
    where: { email: "newhire@keypillarhub.com" },
    update: {},
    create: { fullName: "New Employee", email: "newhire@keypillarhub.com", passwordHash, role: "NEW_EMPLOYEE", department: "Engineering" },
  });

  const chatbot = await prisma.project.create({
    data: {
      projectName: "AI Chatbot",
      summary: "AI-powered customer support chatbot with natural language understanding",
      problemStatement: "Current support system cannot handle 60% of inquiries",
      targetUsers: "Enterprise customers",
      projectOwner: pm.id,
      documentationOwner: docOwner.id,
      currentStage: "In Progress",
      status: "IN_PROGRESS",
      sopHealthScore: 78,
    },
  });
  const crm = await prisma.project.create({
    data: {
      projectName: "CRM Automation",
      summary: "Automated CRM workflow for lead management and follow-ups",
      problemStatement: "Manual CRM updates cause 30% data loss",
      targetUsers: "Sales team",
      projectOwner: po.id,
      documentationOwner: docOwner.id,
      currentStage: "MVP",
      status: "IN_PROGRESS",
      sopHealthScore: 65,
    },
  });
  const dataTool = await prisma.project.create({
    data: {
      projectName: "Data Analysis Tool",
      summary: "Real-time data analysis and visualization platform",
      problemStatement: "No real-time analytics available for decision making",
      targetUsers: "Management and analytics team",
      projectOwner: pm.id,
      documentationOwner: docOwner.id,
      currentStage: "Planning",
      status: "PLANNING",
      sopHealthScore: 30,
    },
  });

  const sectionNames = ["Project Overview", "AI System Overview", "Technical Setup Guide", "Feature Register", "Roadmap / Missing Features", "Issue and Bug Log", "Decision Log", "Change Log", "Daily Work Updates", "Task Tracking", "Blocker Log", "Onboarding Checklist", "Handover Checklist"];
  const statuses: Array<"COMPLETE" | "NEEDS_UPDATE" | "MISSING" | "UNDER_REVIEW"> = ["COMPLETE", "COMPLETE", "COMPLETE", "NEEDS_UPDATE", "NEEDS_UPDATE", "COMPLETE", "NEEDS_UPDATE", "COMPLETE", "COMPLETE", "COMPLETE", "MISSING", "MISSING", "MISSING"];

  for (const proj of [chatbot, crm, dataTool]) {
    for (const [i, name] of sectionNames.entries()) {
      await prisma.projectSection.create({
        data: {
          projectId: proj.id,
          projectName: proj.projectName,
          sectionName: name,
          purpose: `Document ${name} for ${proj.projectName}`,
          owner: docOwner.id,
          status: statuses[i],
        },
      });
    }
  }

  const taskData = [
    { taskTitle: "Implement NLU pipeline", taskDescription: "Build natural language understanding", projectId: chatbot.id, assignedTo: member.id, createdBy: pm.id, priority: "URGENT", status: "IN_PROGRESS" as const },
    { taskTitle: "Design chatbot UI", taskDescription: "Create chat interface", projectId: chatbot.id, assignedTo: member.id, createdBy: pm.id, priority: "HIGH" as const, status: "IN_PROGRESS" as const },
    { taskTitle: "Set up test environment", taskDescription: "Configure QA environment", projectId: chatbot.id, assignedTo: member.id, createdBy: pm.id, priority: "MEDIUM" as const, status: "COMPLETED" as const },
    { taskTitle: "Build lead scoring", taskDescription: "Automated lead scoring algorithm", projectId: crm.id, assignedTo: member.id, createdBy: po.id, priority: "HIGH" as const, status: "IN_PROGRESS" as const },
    { taskTitle: "Email templates", taskDescription: "Create automated email sequences", projectId: crm.id, assignedTo: member.id, createdBy: po.id, priority: "MEDIUM" as const, status: "BACKLOG" as const },
    { taskTitle: "CRM dashboard", taskDescription: "Build admin dashboard", projectId: crm.id, assignedTo: newHire.id, createdBy: pm.id, priority: "MEDIUM" as const, status: "NOT_STARTED" as const },
    { taskTitle: "Data pipeline setup", taskDescription: "ETL pipeline for analytics", projectId: dataTool.id, assignedTo: member.id, createdBy: pm.id, priority: "HIGH" as const, status: "BACKLOG" as const },
    { taskTitle: "UI mockup", taskDescription: "Design analytics dashboard", projectId: dataTool.id, assignedTo: newHire.id, createdBy: po.id, priority: "LOW" as const, status: "BACKLOG" as const },
    { taskTitle: "Feature A implementation", taskDescription: "Core feature A", projectId: chatbot.id, assignedTo: member.id, createdBy: pm.id, priority: "URGENT" as const, status: "BLOCKED" as const, blockerReason: "Waiting for API access" },
    { taskTitle: "Performance testing", taskDescription: "Load test chatbot", projectId: chatbot.id, assignedTo: member.id, createdBy: pm.id, priority: "HIGH" as const, status: "WAITING_FOR_REVIEW" as const },
  ];

  for (const t of taskData) {
    await prisma.projectTask.create({ data: t });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const day2 = new Date(today); day2.setDate(day2.getDate() - 1);
  const day3 = new Date(today); day3.setDate(day3.getDate() - 2);

  const updateData = [
    { projectId: chatbot.id, employeeId: member.id, employeeRole: "Engineer", date: day2, todayWorkedOn: "Implemented NLU pipeline v2", progressMade: "70% complete", currentStatus: "IN_PROGRESS" as const, nextStep: "Test with real queries" },
    { projectId: chatbot.id, employeeId: member.id, employeeRole: "Engineer", date: day3, todayWorkedOn: "Research NLU frameworks", progressMade: "Research phase complete", currentStatus: "COMPLETED" as const, nextStep: "Implement pipeline" },
    { projectId: crm.id, employeeId: member.id, employeeRole: "Engineer", date: day2, todayWorkedOn: "Built lead scoring model", progressMade: "50% complete", currentStatus: "IN_PROGRESS" as const, nextStep: "Train on historical data" },
    { projectId: crm.id, employeeId: newHire.id, employeeRole: "New Hire", date: today, todayWorkedOn: "Set up dev environment and read docs", progressMade: "Setting up", currentStatus: "IN_PROGRESS" as const, nextStep: "Complete technical setup" },
    { projectId: chatbot.id, employeeId: newHire.id, employeeRole: "New Hire", date: day3, todayWorkedOn: "Onboarding - read project overview", progressMade: "Day 1 complete", currentStatus: "COMPLETED" as const, nextStep: "Run project locally" },
    { projectId: dataTool.id, employeeId: member.id, employeeRole: "Engineer", date: day3, todayWorkedOn: "Defined requirements", progressMade: "Requirements phase", currentStatus: "COMPLETED" as const, nextStep: "Start data pipeline" },
  ];

  for (const u of updateData) {
    await prisma.dailyWorkUpdate.create({ data: u });
  }

  const blockerData = [
    { projectId: chatbot.id, reportedBy: member.id, blockerDesc: "API rate limiting causing timeout errors", impact: "Blocks NLU pipeline testing", escalationLevel: "HIGH" as const, currentStatus: "OPEN" as const },
    { projectId: chatbot.id, reportedBy: member.id, blockerDesc: "Waiting for API access credentials", impact: "Blocks Feature A implementation", escalationLevel: "CRITICAL" as const, currentStatus: "OPEN" as const },
    { projectId: crm.id, reportedBy: newHire.id, blockerDesc: "Cannot access production database", impact: "Blocks lead scoring model", escalationLevel: "MEDIUM" as const, currentStatus: "OPEN" as const },
    { projectId: dataTool.id, reportedBy: member.id, blockerDesc: "Data source not ready", impact: "Blocks ETL pipeline", escalationLevel: "LOW" as const, currentStatus: "OPEN" as const },
  ];

  for (const b of blockerData) {
    await prisma.blockerLog.create({ data: b });
  }

  const featureData = [
    { projectId: chatbot.id, featureName: "Intent Recognition", description: "AI intent classification", status: "IN_PROGRESS" as const, priority: "HIGH" as const, ownerId: member.id },
    { projectId: chatbot.id, featureName: "Multi-language Support", description: "Support 5 languages", status: "PLANNED" as const, priority: "MEDIUM" as const, ownerId: member.id },
    { projectId: chatbot.id, featureName: "Sentiment Analysis", description: "Customer emotion detection", status: "PLANNED" as const, priority: "HIGH" as const, ownerId: member.id },
    { projectId: crm.id, featureName: "Lead Scoring", description: "AI-powered lead scoring", status: "IN_PROGRESS" as const, priority: "HIGH" as const, ownerId: member.id },
    { projectId: crm.id, featureName: "Automated Follow-ups", description: "Smart email sequences", status: "PLANNED" as const, priority: "MEDIUM" as const, ownerId: member.id },
    { projectId: crm.id, featureName: "Dashboard Analytics", description: "Sales performance dashboard", status: "PLANNED" as const, priority: "LOW" as const, ownerId: member.id },
  ];

  for (const f of featureData) {
    await prisma.feature.create({ data: f });
  }

  const roadmapData = [
    { projectId: chatbot.id, title: "Voice Support", description: "Enable voice input for chatbot", priority: "MEDIUM" as const, ownerId: member.id, status: "NOT_STARTED" as const },
    { projectId: chatbot.id, title: "Knowledge Base Integration", description: "Connect to company docs", priority: "HIGH" as const, ownerId: member.id, status: "PLANNED" as const },
    { projectId: crm.id, title: "Social Media Integration", description: "Connect Facebook, LinkedIn", priority: "MEDIUM" as const, ownerId: member.id, status: "NOT_STARTED" as const },
    { projectId: dataTool.id, title: "Real-time Analytics", description: "Live dashboard updates", priority: "HIGH" as const, ownerId: member.id, status: "NOT_STARTED" as const },
    { projectId: dataTool.id, title: "Export Features", description: "CSV, PDF exports", priority: "LOW" as const, ownerId: member.id, status: "NOT_STARTED" as const },
  ];

  for (const r of roadmapData) {
    await prisma.roadmapItem.create({ data: r });
  }

  const issueData = [
    { projectId: chatbot.id, date: day2, reportedBy: member.id, title: "NLU confidence too low", description: "Intent confidence below threshold", impact: "Medium", rootCause: "Training data insufficient", fixApplied: "Added more training samples", preventionMethod: "Review training data weekly", status: "FIXED" as const, ownerId: member.id },
    { projectId: chatbot.id, date: new Date(Date.now() - 86400000 * 3), reportedBy: member.id, title: "Response timeout", description: "API responses taking >5s", impact: "High", rootCause: null, fixApplied: null, preventionMethod: null, status: "OPEN" as const, ownerId: member.id },
    { projectId: crm.id, date: day2, reportedBy: newHire.id, title: "Email template not rendering", description: "HTML not rendering properly", impact: "Medium", rootCause: "CSS inlining issue", fixApplied: "Fixed inlining", preventionMethod: "Add template tests", status: "FIXED" as const, ownerId: member.id },
    { projectId: crm.id, date: new Date(Date.now() - 86400000 * 2), reportedBy: member.id, title: "Lead data not syncing", description: "CRM data sync delay", impact: "High", rootCause: null, fixApplied: null, preventionMethod: null, status: "OPEN" as const, ownerId: member.id },
    { projectId: chatbot.id, date: new Date(Date.now() - 86400000 * 5), reportedBy: member.id, title: "Memory leak in long sessions", description: "Session memory growing", impact: "Low", rootCause: "Session object not cleaned", fixApplied: "Added cleanup", preventionMethod: "Add memory monitoring", status: "FIXED" as const, ownerId: member.id },
  ];

  for (const i of issueData) {
    await prisma.issue.create({ data: i });
  }

  const decisionData = [
    { projectId: chatbot.id, decisionDate: day2, title: "Use LangChain for NLU", description: "Selected LangChain over custom implementation", reason: "Faster development, good ecosystem", alternativesConsidered: "Custom NLP pipeline, OpenAI API only", impact: "Technical architecture decision", decisionOwnerId: member.id, approvedBy: pm.id },
    { projectId: chatbot.id, decisionDate: new Date(Date.now() - 86400000 * 3), title: "SQLite for MVP", description: "Use SQLite for prototype", reason: "Fast setup, no external dependency", alternativesConsidered: "PostgreSQL, MongoDB", impact: "Database choice", decisionOwnerId: member.id, approvedBy: pm.id },
    { projectId: crm.id, decisionDate: day2, title: "Use Twilio for email", description: "Email service provider selection", reason: "Best deliverability rates", alternativesConsidered: "SendGrid, Mailgun", impact: "Third-party dependency", decisionOwnerId: member.id, approvedBy: po.id },
    { projectId: crm.id, decisionDate: new Date(Date.now() - 86400000 * 5), title: "React for frontend", description: "Frontend framework choice", reason: "Team familiarity, component library", alternativesConsidered: "Vue, Svelte", impact: "Technology stack", decisionOwnerId: member.id, approvedBy: pm.id },
    { projectId: dataTool.id, decisionDate: new Date(Date.now() - 86400000 * 2), title: "D3.js for charts", description: "Charting library selection", reason: "Flexible, customizable", alternativesConsidered: "Chart.js, Recharts", impact: "Library choice", decisionOwnerId: member.id, approvedBy: po.id },
  ];

  for (const d of decisionData) {
    await prisma.decision.create({ data: d });
  }

  const changeLogData = [
    { projectId: chatbot.id, date: day2, changeType: "NEW_FEATURE" as const, title: "NLU Pipeline v2", whatChanged: "Upgraded NLU from v1 to v2", whyChanged: "Better accuracy", impact: "Medium", addedById: member.id },
    { projectId: chatbot.id, date: new Date(Date.now() - 86400000 * 3), changeType: "BUG_FIX" as const, title: "Fixed memory leak", whatChanged: "Added session cleanup", whyChanged: "Memory growing", impact: "High", addedById: member.id },
    { projectId: chatbot.id, date: new Date(Date.now() - 86400000 * 4), changeType: "IMPROVEMENT" as const, title: "API response optimization", whatChanged: "Added caching layer", whyChanged: "Response time too slow", impact: "Medium", addedById: member.id },
    { projectId: chatbot.id, date: new Date(Date.now() - 86400000 * 7), changeType: "DOCUMENTATION" as const, title: "Updated API docs", whatChanged: "Added endpoint documentation", whyChanged: "Outdated docs", impact: "Low", addedById: member.id },
    { projectId: crm.id, date: day2, changeType: "NEW_FEATURE" as const, title: "Lead scoring model v1", whatChanged: "Implemented initial scoring", whyChanged: "Feature request", impact: "High", addedById: member.id },
    { projectId: crm.id, date: new Date(Date.now() - 86400000 * 2), changeType: "BUG_FIX" as const, title: "Fixed email rendering", whatChanged: "Fixed HTML inlining", whyChanged: "Broken emails", impact: "Medium", addedById: member.id },
    { projectId: crm.id, date: new Date(Date.now() - 86400000 * 5), changeType: "UI_CHANGE" as const, title: "Updated dashboard layout", whatChanged: "New sidebar and charts", whyChanged: "UX feedback", impact: "Low", addedById: member.id },
    { projectId: dataTool.id, date: new Date(Date.now() - 86400000 * 2), changeType: "DOCUMENTATION" as const, title: "Project requirements document", whatChanged: "Initial requirements created", whyChanged: "Project kickoff", impact: "Low", addedById: member.id },
  ];

  for (const c of changeLogData) {
    await prisma.changeLog.create({ data: c });
  }

  const onboardingData = [
    { employeeId: newHire.id, projectId: chatbot.id, role: "Engineer", startDate: today, onboardingBuddyId: member.id, managerId: pm.id, currentStage: "DAY_1" as const, completionPct: 25, employeeFeedback: "First day, learning the codebase", managerReview: "Good progress so far" },
    { employeeId: newHire.id, projectId: crm.id, role: "New Hire", startDate: day2, onboardingBuddyId: member.id, managerId: pm.id, currentStage: "DAY_1" as const, completionPct: 10, employeeFeedback: "Setting up environment", managerReview: null },
  ];

  for (const o of onboardingData) {
    await prisma.onboardingRecord.create({ data: o });
  }

  await prisma.handoverRecord.create({
    data: {
      employeeId: member.id,
      projectId: dataTool.id,
      role: "Engineer",
      projectAreaOwned: "Data Pipeline",
      lastWorkingDate: new Date(Date.now() + 86400000 * 14),
      completedWork: "Requirements document, initial architecture",
      pendingWork: "ETL pipeline setup, UI development",
      knownRisks: "Data source integration not yet confirmed",
      importantLinks: "https://internal.tools/data",
      recommendedNextSteps: "Assign new owner, schedule handover meeting",
      replacementOwnerId: newHire.id,
      managerApprovalStatus: "PENDING" as const,
    },
  });

  const notificationData = [
    { userId: pm.id, title: "Daily Update Reminder", message: "Send your daily update", type: "REMINDER" },
    { userId: member.id, title: "New Task Assigned", message: "Implement NLU pipeline v2", type: "TASK" },
    { userId: member.id, title: "Blocker Critical", message: "Feature A implementation blocked", type: "BLOCKER" },
    { userId: docOwner.id, title: "SOP Review Due", message: "Review chatbot SOP sections", type: "REVIEW" },
    { userId: pm.id, title: "Task Overdue", message: "3 tasks past due date", type: "OVERDUE" },
    { userId: member.id, title: "Manager Comment", message: "Nice work on NLU pipeline", type: "COMMENT" },
    { userId: newHire.id, title: "Onboarding Started", message: "Welcome to the project", type: "ONBOARDING" },
    { userId: founder.id, title: "New Project Created", message: "Data Analysis Tool project", type: "PROJECT" },
    { userId: po.id, title: "Feature Added", message: "Lead scoring model started", type: "FEATURE" },
    { userId: pm.id, title: "Issue Reported", message: "NLU confidence too low", type: "ISSUE" },
  ];

  for (const n of notificationData) {
    await prisma.notification.create({ data: n });
  }

  const auditData = [
    { userId: admin.id, action: "CREATE", entityType: "Project", entityId: chatbot.id, newValue: "AI Chatbot project created" },
    { userId: pm.id, action: "CREATE", entityType: "Project", entityId: crm.id, newValue: "CRM Automation project created" },
    { userId: pm.id, action: "CREATE", entityType: "Project", entityId: dataTool.id, newValue: "Data Analysis Tool project created" },
    { userId: member.id, action: "CREATE", entityType: "Task", entityId: "task-1", newValue: "Implement NLU pipeline" },
    { userId: member.id, action: "UPDATE", entityType: "DailyUpdate", entityId: "update-1", oldValue: "Not Started", newValue: "In Progress" },
    { userId: member.id, action: "CREATE", entityType: "Blocker", entityId: "blocker-1", newValue: "API rate limiting" },
    { userId: member.id, action: "CREATE", entityType: "Feature", entityId: "feature-1", newValue: "Intent Recognition" },
    { userId: member.id, action: "CREATE", entityType: "Issue", entityId: "issue-1", newValue: "NLU confidence too low" },
    { userId: member.id, action: "CREATE", entityType: "Decision", entityId: "decision-1", newValue: "Use LangChain for NLU" },
    { userId: member.id, action: "CREATE", entityType: "ChangeLog", entityId: "change-1", newValue: "NLU Pipeline v2" },
  ];

  for (const a of auditData) {
    await prisma.auditLog.create({ data: a });
  }

  const settings = [
    { key: "companyName", value: "KeyPillar", updatedBy: admin.id },
    { key: "appName", value: "KeyPillar Hub", updatedBy: admin.id },
    { key: "themeColor", value: "hsl(222.2 47.4% 11.2%)", updatedBy: admin.id },
    { key: "dailyUpdateReminder", value: "17:00", updatedBy: admin.id },
    { key: "managerReviewReminder", value: "24", updatedBy: admin.id },
    { key: "sopReviewFrequency", value: "30", updatedBy: admin.id },
    { key: "workingDays", value: "Monday-Friday", updatedBy: admin.id },
  ];

  for (const s of settings) {
    await prisma.setting.create({ data: s });
  }

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
