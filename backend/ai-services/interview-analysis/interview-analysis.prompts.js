/* ============================================================
   AGENT 10 — Interview Analysis AI
   Prompt Templates
   ============================================================ */

'use strict';

function buildInterviewAnalysisPrompt(student, session) {
  const { transcript, company, interviewType } = session;

  const candidateAnswers = transcript
    .filter(t => t.role === 'candidate')
    .map((t, i) => `Answer ${i + 1}: ${t.content}`)
    .join('\n\n');

  const interviewerQuestions = transcript
    .filter(t => t.role === 'interviewer')
    .map((t, i) => `Q${i + 1} (${t.topic || 'General'}): ${t.content}`)
    .join('\n\n');

  const totalAnswers = transcript.filter(t => t.role === 'candidate').length;
  const avgAnswerLength = totalAnswers > 0
    ? Math.round(candidateAnswers.split(' ').length / totalAnswers)
    : 0;

  return `
You are an expert AI Interview Analyst for the Elevate Career Intelligence Platform.

Analyze this completed ${company} ${interviewType} interview and provide a comprehensive evaluation.
Be specific, detailed, and coach-like. Reference actual answers where possible.

## Student: ${student.name} (${student.branch})
## Interview: ${company} ${interviewType} Interview
## Total Questions: ${totalAnswers}

## Interview Questions Asked
${interviewerQuestions || 'Questions not available'}

## Candidate Answers
${candidateAnswers || 'No answers recorded'}

## Quantitative Observations
- Average Answer Length: ~${avgAnswerLength} words
- Total Questions Answered: ${totalAnswers}

Return ONLY valid JSON. Be specific and reference actual content from the answers:

{
  "studentId": "${student.id}",
  "studentName": "${student.name}",
  "company": "${company}",
  "interviewType": "${interviewType}",
  "overallScore": 0-100,
  "hiringRecommendation": "Strongly Recommend|Recommend|Maybe|Not Recommend",
  "communication": {
    "score": 0-100,
    "grammar": "Excellent|Good|Average|Needs Work",
    "clarity": "Very Clear|Clear|Average|Unclear",
    "confidence": "Very Confident|Confident|Moderate|Lacks Confidence",
    "vocabulary": "Rich|Good|Average|Limited",
    "feedback": "Specific feedback about communication"
  },
  "technical": {
    "score": 0-100,
    "accuracy": "High|Medium|Low",
    "depth": "Deep|Adequate|Surface-level",
    "problemSolving": "Excellent|Good|Average|Poor",
    "feedback": "Specific feedback about technical answers"
  },
  "behavioral": {
    "score": 0-100,
    "usedSTARMethod": true/false,
    "leadershipSignals": "Strong|Moderate|Weak|None",
    "teamworkOrientation": "High|Medium|Low",
    "feedback": "Specific feedback about behavioral answers"
  },
  "questionWiseFeedback": [
    {
      "questionNumber": 1,
      "topic": "Topic",
      "answerQuality": "Excellent|Good|Average|Poor",
      "feedback": "Specific feedback for this specific answer"
    }
  ],
  "strengths": ["Specific strength observed in the interview"],
  "areasToImprove": ["Specific area that needs improvement"],
  "improvementPlan": [
    { "area": "Communication", "action": "Specific action to take", "timeline": "1 week" }
  ],
  "companyFitScore": 0-100,
  "readinessImpact": "+X% or -X% change to placement readiness",
  "nextSteps": ["What to do next to improve interview performance"],
  "summary": "3-4 sentence personalized interview performance summary for ${student.name}"
}
`;
}

module.exports = { buildInterviewAnalysisPrompt };
