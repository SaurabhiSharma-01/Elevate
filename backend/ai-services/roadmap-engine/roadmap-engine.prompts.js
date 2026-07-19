/* ============================================================
   AGENT 3 — Personalized Roadmap AI
   Prompt Templates
   ============================================================ */

'use strict';

function buildRoadmapPrompt(student, skillReport, readinessReport, targetCompany, studyHoursPerDay) {
  const weakAreas = skillReport?.weaknesses || student.weakSkills || ['DSA', 'Aptitude'];
  const priorityAreas = skillReport?.priorityAreas || weakAreas.slice(0, 2);
  const readinessScore = readinessReport?.placementReadinessScore || student.readiness || 60;
  const company = targetCompany || student.targetCompany || 'TCS';
  const hours = studyHoursPerDay || student.todayHours || 2;

  return `
You are an expert AI Career Roadmap Generator for the Elevate Career Intelligence Platform.

Your job is to generate a UNIQUE, PERSONALIZED learning roadmap for this specific student.
NO two students should receive the same roadmap. Base everything on the actual data below.

## Student Profile
- Name: ${student.name}
- Branch: ${student.branch}
- Semester: ${student.semester}
- CGPA: ${student.cgpa}
- Target Company: ${company}
- Current Readiness Score: ${readinessScore}/100
- Available Study Hours Per Day: ${hours} hours
- Weak Areas: ${weakAreas.join(', ')}
- Priority Areas: ${priorityAreas.join(', ')}
- Courses Completed: ${student.coursesCompleted}
- Mock Tests Done: ${student.mockTestsCompleted}

## Goal
Generate a realistic 4-week roadmap that:
1. Addresses the student's specific weak areas first
2. Progressively builds difficulty
3. Is aligned with ${company}'s hiring process
4. Fits within ${hours} study hours per day

Return ONLY valid JSON — no markdown, no explanation:

{
  "studentId": "${student.id}",
  "studentName": "${student.name}",
  "targetCompany": "${company}",
  "targetReadinessScore": 0-100,
  "studyHoursPerDay": ${hours},
  "weeklyPlan": [
    {
      "week": 1,
      "theme": "Week theme/focus",
      "focus": ["Topic 1", "Topic 2"],
      "dailyTasks": [
        { "day": "Monday", "tasks": ["Specific task 1", "Specific task 2"], "hours": ${hours} },
        { "day": "Tuesday", "tasks": ["Specific task 1", "Specific task 2"], "hours": ${hours} },
        { "day": "Wednesday", "tasks": ["Specific task 1", "Specific task 2"], "hours": ${hours} },
        { "day": "Thursday", "tasks": ["Specific task 1", "Specific task 2"], "hours": ${hours} },
        { "day": "Friday", "tasks": ["Specific task 1", "Specific task 2"], "hours": ${hours} },
        { "day": "Saturday", "tasks": ["Revision + Mock test"], "hours": ${Math.max(hours - 0.5, 1)} },
        { "day": "Sunday", "tasks": ["Rest + Light revision"], "hours": 1 }
      ],
      "milestone": "What the student should achieve by end of week 1",
      "resources": ["Resource 1", "Resource 2"]
    },
    {
      "week": 2,
      "theme": "Week 2 theme",
      "focus": ["Topic 3", "Topic 4"],
      "dailyTasks": [
        { "day": "Monday", "tasks": ["task"], "hours": ${hours} },
        { "day": "Tuesday", "tasks": ["task"], "hours": ${hours} },
        { "day": "Wednesday", "tasks": ["task"], "hours": ${hours} },
        { "day": "Thursday", "tasks": ["task"], "hours": ${hours} },
        { "day": "Friday", "tasks": ["task"], "hours": ${hours} },
        { "day": "Saturday", "tasks": ["Mock test"], "hours": ${hours} },
        { "day": "Sunday", "tasks": ["Rest"], "hours": 1 }
      ],
      "milestone": "Week 2 milestone",
      "resources": ["Resource 3"]
    },
    {
      "week": 3,
      "theme": "Week 3 theme",
      "focus": ["Topic 5"],
      "dailyTasks": [
        { "day": "Monday", "tasks": ["task"], "hours": ${hours} },
        { "day": "Tuesday", "tasks": ["task"], "hours": ${hours} },
        { "day": "Wednesday", "tasks": ["task"], "hours": ${hours} },
        { "day": "Thursday", "tasks": ["task"], "hours": ${hours} },
        { "day": "Friday", "tasks": ["task"], "hours": ${hours} },
        { "day": "Saturday", "tasks": ["Full mock test"], "hours": ${hours} },
        { "day": "Sunday", "tasks": ["Rest"], "hours": 1 }
      ],
      "milestone": "Week 3 milestone",
      "resources": []
    },
    {
      "week": 4,
      "theme": "Final Prep & Assessment",
      "focus": ["Full-length mock tests", "Interview prep"],
      "dailyTasks": [
        { "day": "Monday", "tasks": ["Company-specific OA"], "hours": ${hours} },
        { "day": "Tuesday", "tasks": ["HR interview prep"], "hours": ${hours} },
        { "day": "Wednesday", "tasks": ["Resume polish"], "hours": ${hours} },
        { "day": "Thursday", "tasks": ["Technical mock interview"], "hours": ${hours} },
        { "day": "Friday", "tasks": ["Final revision"], "hours": ${hours} },
        { "day": "Saturday", "tasks": ["Full mock interview"], "hours": ${hours} },
        { "day": "Sunday", "tasks": ["Rest & confidence building"], "hours": 1 }
      ],
      "milestone": "Ready to apply to ${company}",
      "resources": ["Previous year papers", "GlassDoor reviews"]
    }
  ],
  "monthlyMilestones": [
    { "month": 1, "goal": "Specific monthly goal", "keyOutcome": "What changes" }
  ],
  "priorities": ["Top priority 1", "Top priority 2", "Top priority 3"],
  "companySpecificTips": ["${company}-specific tip 1", "${company}-specific tip 2"],
  "summary": "Personalized 2-3 sentence roadmap summary for ${student.name}"
}
`;
}

module.exports = { buildRoadmapPrompt };
