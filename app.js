/* ============================================================
   ELEVATE PORTAL — Application Logic
   Complete SPA Router + All Features
   ============================================================ */

'use strict';

// ──────────────────────────────────────────────────────────────
// STATE
// ──────────────────────────────────────────────────────────────
const state = {
  currentScreen: 'login',
  currentPage: 'dashboard',
  selectedDept: 'Engineering',
  student: {
    name: 'Priya Sharma',
    initials: 'PS',
    id: 'GHRCE2024047',
    dept: 'CSE',
    semester: '6th Semester',
    readiness: 72,
    rank: 47,
    targetCompany: 'TCS / Infosys'
  },
  assessment: {
    currentQ: 0,
    answers: {},
    flagged: new Set(),
    timer: 45 * 60,
    timerInterval: null,
    totalQ: 30
  },
  test: {
    currentQ: 0,
    answers: {},
    timer: 90 * 60,
    timerInterval: null,
    totalQ: 20,
    testName: 'TCS Comprehensive'
  },
  interview: {
    company: 'Microsoft',
    type: 'HR',
    currentQ: 0,
    timer: 0,
    timerInterval: null,
    micActive: true,
    camActive: true,
    chatHistory: []
  },
  charts: {},
  isFirstLogin: true,
  bookmarks: new Set()
};

// ──────────────────────────────────────────────────────────────
// DATA
// ──────────────────────────────────────────────────────────────
const ASSESSMENT_QUESTIONS = {
  Engineering: [
    { q: "What is the time complexity of Binary Search?", opts: ["O(n)", "O(log n)", "O(n²)", "O(1)"], ans: 1, section: "Technical Aptitude" },
    { q: "Which data structure uses LIFO (Last In First Out) principle?", opts: ["Queue", "Stack", "Linked List", "Tree"], ans: 1, section: "Data Structures" },
    { q: "What does CPU stand for?", opts: ["Central Processing Unit", "Computer Processing Unit", "Central Program Utility", "Core Processing Unit"], ans: 0, section: "Computer Science" },
    { q: "In SQL, which command is used to retrieve data?", opts: ["INSERT", "UPDATE", "SELECT", "DELETE"], ans: 2, section: "Database" },
    { q: "What is polymorphism in OOP?", opts: ["Data hiding", "Multiple forms of a function/method", "Inheritance chain", "Memory management"], ans: 1, section: "Programming" },
    { q: "If a train covers 120 km in 2 hours, what is its speed?", opts: ["50 km/h", "60 km/h", "70 km/h", "80 km/h"], ans: 1, section: "Aptitude" },
    { q: "What is a deadlock in Operating Systems?", opts: ["When CPU overheats", "Circular wait where processes block each other indefinitely", "Memory overflow error", "Network timeout"], ans: 1, section: "Operating Systems" },
    { q: "Which protocol is used for secure web browsing?", opts: ["HTTP", "FTP", "HTTPS", "SMTP"], ans: 2, section: "Networks" },
    { q: "What is the output of 2 ** 10 in Python?", opts: ["20", "100", "1024", "512"], ans: 2, section: "Programming" },
    { q: "Find the odd one out: 2, 4, 8, 15, 32", opts: ["2", "4", "15", "32"], ans: 2, section: "Logical Reasoning" },
    { q: "Which sorting algorithm has O(n log n) average complexity?", opts: ["Bubble Sort", "Selection Sort", "Merge Sort", "Insertion Sort"], ans: 2, section: "Algorithms" },
    { q: "What is the full form of DNS?", opts: ["Data Network Service", "Domain Name System", "Dynamic Network Standard", "Domain Number Service"], ans: 1, section: "Networks" },
    { q: "A can do a work in 10 days, B in 15 days. Together they finish in?", opts: ["5 days", "6 days", "7 days", "8 days"], ans: 1, section: "Aptitude" },
    { q: "Which is NOT a primary key property?", opts: ["Unique", "Not Null", "Can be composite", "Can contain duplicates"], ans: 3, section: "Database" },
    { q: "What is recursion?", opts: ["Loop iteration", "A function calling itself", "Memory allocation", "Exception handling"], ans: 1, section: "Programming" },
    { q: "OSI model has how many layers?", opts: ["5", "6", "7", "8"], ans: 2, section: "Networks" },
    { q: "Which company developed the Java programming language?", opts: ["Microsoft", "Apple", "Sun Microsystems", "IBM"], ans: 2, section: "General Tech" },
    { q: "What is the difference between == and === in JavaScript?", opts: ["No difference", "=== checks value and type", "== checks type only", "=== is slower"], ans: 1, section: "Programming" },
    { q: "What is a Foreign Key?", opts: ["Primary key of same table", "Key from another table used for reference", "Unique identifier", "Auto-increment key"], ans: 1, section: "Database" },
    { q: "P is 30% more than Q. Q is how much less than P?", opts: ["30%", "23.07%", "25%", "26.09%"], ans: 1, section: "Aptitude" },
    { q: "What does RAM stand for?", opts: ["Random Access Memory", "Read Access Memory", "Remote Access Module", "Read Addressable Memory"], ans: 0, section: "Computer Science" },
    { q: "Which is a greedy algorithm?", opts: ["Merge Sort", "Binary Search", "Dijkstra's Algorithm", "DFS"], ans: 2, section: "Algorithms" },
    { q: "What is encapsulation in OOP?", opts: ["Hiding implementation details", "Multiple inheritance", "Function overloading", "Code duplication"], ans: 0, section: "Programming" },
    { q: "Find next in series: 1, 1, 2, 3, 5, 8, __", opts: ["10", "11", "12", "13"], ans: 3, section: "Logical Reasoning" },
    { q: "A book costs ₹200. After 25% discount, price is?", opts: ["₹150", "₹160", "₹175", "₹140"], ans: 0, section: "Aptitude" },
    { q: "What is the base of hexadecimal number system?", opts: ["2", "8", "10", "16"], ans: 3, section: "Computer Science" },
    { q: "Which is an example of a compile-time error?", opts: ["Division by zero", "Array index out of bounds", "Syntax error", "Infinite loop"], ans: 2, section: "Programming" },
    { q: "What is normalization in databases?", opts: ["Encryption of data", "Process to reduce data redundancy", "Indexing method", "Compression technique"], ans: 1, section: "Database" },
    { q: "What does HTTP stand for?", opts: ["HyperText Transfer Protocol", "High Transfer Text Program", "HyperText Terminal Protocol", "Home Transfer Protocol"], ans: 0, section: "Networks" },
    { q: "If 5 machines produce 5 units in 5 minutes, how many units do 100 machines produce in 100 minutes?", opts: ["100", "500", "1000", "2000"], ans: 3, section: "Logical Reasoning" }
  ]
};

// Generate questions for other departments
['Medical', 'Commerce', 'Management', 'Law', 'Pharmacy', 'Architecture', 'Design'].forEach(dept => {
  ASSESSMENT_QUESTIONS[dept] = ASSESSMENT_QUESTIONS.Engineering.map((q, i) => ({
    ...q,
    section: dept === 'Commerce' ? ['Accounting', 'Economics', 'Business Math', 'Finance', 'Management'][i % 5]
      : dept === 'Management' ? ['Leadership', 'Strategy', 'HR Concepts', 'Operations', 'Business Ethics'][i % 5]
      : q.section
  }));
});

const COURSES = [
  { id: 1, title: "Data Structures & Algorithms", icon: "DSA", bg: "#EDE9F7", diff: "intermediate", cat: "dsa", duration: "12h", rating: 4.8, lessons: 48, instructor: "Dr. Rajesh Kumar", progress: 68 },
  { id: 2, title: "Database Management (DBMS)", icon: "DBMS", bg: "#DCFCE7", diff: "intermediate", cat: "core", duration: "8h", rating: 4.7, lessons: 32, instructor: "Prof. Meera Singh", progress: 35 },
  { id: 3, title: "Quantitative Aptitude Mastery", icon: "APT", bg: "#FEF3C7", diff: "beginner", cat: "aptitude", duration: "10h", rating: 4.9, lessons: 80, instructor: "Amit Verma", progress: 52 },
  { id: 4, title: "Computer Networks Fundamentals", icon: "NET", bg: "#DBEAFE", diff: "intermediate", cat: "core", duration: "6h", rating: 4.6, lessons: 24, instructor: "Dr. Priya Nair", progress: 15 },
  { id: 5, title: "Operating Systems Deep Dive", icon: "OS", bg: "#FEE2E2", diff: "advanced", cat: "core", duration: "9h", rating: 4.5, lessons: 36, instructor: "Prof. Rajan", progress: 0 },
  { id: 6, title: "Python Programming Bootcamp", icon: "PY", bg: "#ECFDF5", diff: "beginner", cat: "programming", duration: "15h", rating: 4.9, lessons: 60, instructor: "Kavya Menon", progress: 80 },
  { id: 7, title: "Communication & Soft Skills", icon: "COMM", bg: "#F3E8FF", diff: "beginner", cat: "communication", duration: "5h", rating: 4.7, lessons: 20, instructor: "Ms. Ananya Roy", progress: 30 },
  { id: 8, title: "Logical Reasoning Pro", icon: "LOG", bg: "#FFF7ED", diff: "intermediate", cat: "aptitude", duration: "7h", rating: 4.8, lessons: 40, instructor: "Vikram Sharma", progress: 45 },
  { id: 9, title: "Java Full Stack Development", icon: "JAVA", bg: "#FFF1F2", diff: "advanced", cat: "programming", duration: "20h", rating: 4.6, lessons: 80, instructor: "Ravi Patel", progress: 10 }
];

const COMPANIES = [
  {
    id: 'tcs', name: 'TCS', logo: 'TCS', type: 'IT Services', status: 'hiring',
    desc: 'Tata Consultancy Services — Global IT services giant.',
    eligibility: ['B.Tech / B.E any branch (2025 batch)', 'CGPA 6.0 and above', 'No active backlogs', 'Gap year ≤ 2 years'],
    stages: [
      { name: 'Online Assessment (TCS NQT)', desc: 'Aptitude, Reasoning, Verbal, Coding (2 questions)' },
      { name: 'Technical Round', desc: 'Core CS subjects: DBMS, OS, Networks, DSA' },
      { name: 'HR Round', desc: 'Behavioral, cultural fit, salary discussion' }
    ],
    matchScore: 72,
    matchDesc: 'Strong aptitude skills. Improve OS and Networks.',
    ctc: '₹3.6 LPA',
    tags: ['IT', 'Mass Recruiter', 'Open Apply']
  },
  {
    id: 'infosys', name: 'Infosys', logo: 'INF', type: 'IT Consulting', status: 'hiring',
    desc: 'Infosys — Global leader in next-generation digital services.',
    eligibility: ['B.Tech / B.E / M.Tech (2025 batch)', 'CGPA 6.5 and above', 'No active backlogs', 'All branches eligible'],
    stages: [
      { name: 'Online Assessment (HackWithInfy)', desc: 'Reasoning, Math, Verbal, Coding' },
      { name: 'Technical Interview', desc: 'Programming, OOPS, project discussion' },
      { name: 'HR Interview', desc: 'Behavioral and situational questions' }
    ],
    matchScore: 68,
    matchDesc: 'Good coding skills. Communication needs improvement.',
    ctc: '₹3.6 LPA',
    tags: ['IT', 'Mass Recruiter', 'Campus Drive']
  },
  {
    id: 'wipro', name: 'Wipro', logo: 'WIP', type: 'IT Services', status: 'hiring',
    desc: 'Wipro — Technology-led innovation company.',
    eligibility: ['B.Tech / B.E (2025 batch)', 'CGPA 6.0+', 'No arrears during application'],
    stages: [
      { name: 'NLTH Assessment', desc: 'Aptitude: Quant, Reasoning, Verbal' },
      { name: 'Online Technical Test', desc: 'C/C++/Java fundamentals, DBMS' },
      { name: 'Final Interview', desc: 'Technical + HR combined' }
    ],
    matchScore: 78,
    matchDesc: 'Well prepared. Focus on final interview preparation.',
    ctc: '₹3.5 LPA',
    tags: ['IT', 'Mass Recruiter']
  },
  {
    id: 'accenture', name: 'Accenture', logo: 'ACN', type: 'IT Consulting', status: 'upcoming',
    desc: 'Accenture — Global professional services company.',
    eligibility: ['Full-time graduates (2025 batch)', 'CGPA 6.0+', 'No gap year > 1 year', 'Good communication skills'],
    stages: [
      { name: 'Communication Assessment', desc: 'English proficiency, business communication' },
      { name: 'Cognitive & Technical Assessment', desc: 'Aptitude, reasoning, technical MCQs' },
      { name: 'Interview', desc: 'Technical skills + HR round' }
    ],
    matchScore: 65,
    matchDesc: 'Improve communication scores for Accenture.',
    ctc: '₹4.5 LPA',
    tags: ['IT', 'Premium Package']
  },
  {
    id: 'amazon', name: 'Amazon', logo: 'AMZ', type: 'E-Commerce / Cloud', status: 'upcoming',
    desc: 'Amazon — Customer-centric global technology company.',
    eligibility: ['B.Tech CSE/IT preferred', 'CGPA 7.0+', 'Strong DSA fundamentals', 'No backlogs'],
    stages: [
      { name: 'Online Coding Test', desc: '2–3 medium/hard DSA problems, 90 min' },
      { name: 'Technical Round 1', desc: 'DSA, System Design basics, LLD' },
      { name: 'Technical Round 2', desc: 'Advanced DSA, OOP, Leadership Principles' },
      { name: 'Bar Raiser', desc: 'Behavioral, culture fit, Amazon LP questions' }
    ],
    matchScore: 52,
    matchDesc: 'Need stronger DSA and System Design skills.',
    ctc: '₹12–18 LPA',
    tags: ['Product', 'Premium', 'High CGPA']
  }
];

const PAPERS = [
  { company: 'TCS', logo: 'TCS', role: 'NQT Hiring Pattern', year: 2024, tags: ['Aptitude & Reasoning'], diff: 'medium', downloads: '4.2k', category: 'tech' },
  { company: 'Infosys', logo: 'INF', role: 'Systems Engineer Assessment', year: 2024, tags: ['Technical + Verbal'], diff: 'medium', downloads: '3.8k', category: 'aptitude' },
  { company: 'Wipro', logo: 'WIP', role: 'NLTH Round Pattern', year: 2023, tags: ['Aptitude', 'Coding'], diff: 'easy', downloads: '2.9k', category: 'aptitude' },
  { company: 'Accenture', logo: 'ACN', role: 'Communication + Cognitive', year: 2024, tags: ['Verbal', 'Reasoning'], diff: 'easy', downloads: '3.1k', category: 'communication' },
  { company: 'Amazon', logo: 'AMZ', role: 'SDE Coding Assessment', year: 2024, tags: ['DSA', 'Coding'], diff: 'hard', downloads: '5.7k', category: 'coding' },
  { company: 'Capgemini', logo: 'CAP', role: 'Fresh Hiring Pattern', year: 2023, tags: ['Aptitude', 'Psychometric'], diff: 'easy', downloads: '2.4k', category: 'aptitude' }
];

const MOCK_TESTS = [
  {
    id: 1, company: 'TCS', companyLabel: 'TCS SPEC', name: 'TCS NQT Comprehensive', featured: true,
    desc: 'Simulates the exact pattern of TCS National Qualifier Test covering Aptitude, Reasoning, Verbal and Coding.',
    questions: 60, duration: 90, difficulty: 'Intermediate', prevScore: 65, locked: false
  },
  {
    id: 2, company: 'Infosys', companyLabel: 'INFOSYS', name: 'Infosys Systems Engineer Assessment', featured: false,
    desc: 'Comprehensive test for Infosys campus recruitment covering Reasoning, Math, Verbal Ability and Pseudocode.',
    questions: 40, duration: 60, difficulty: 'Intermediate', prevScore: null, locked: false
  },
  {
    id: 3, company: 'Wipro', companyLabel: 'WIPRO', name: 'Wipro NLTH Mock Test', featured: false,
    desc: 'Focuses on aptitude, logical reasoning, and verbal ability as per NLTH pattern.',
    questions: 45, duration: 60, difficulty: 'Beginner', prevScore: null, locked: false
  },
  {
    id: 4, company: 'Accenture', companyLabel: 'ACCENTURE', name: 'Accenture Cognitive + Communication', featured: false,
    desc: 'Tests English communication proficiency and cognitive ability — critical for Accenture selection.',
    questions: 50, duration: 70, difficulty: 'Beginner', prevScore: null, locked: false
  },
  {
    id: 5, company: 'TCS', companyLabel: 'TCS ADV', name: 'TCS Digital Advanced DSA', featured: false,
    desc: 'Advanced DSA and System Design for TCS Digital (premium package). Requires 75%+ in basic test.',
    questions: 20, duration: 120, difficulty: 'Advanced', prevScore: null, locked: true, lockMsg: 'Score 75%+ in TCS Basic'
  }
];

const TEST_QUESTIONS = [
  { q: "A train 200m long crosses a platform 400m long at 90 km/h. Time taken?", opts: ["20s", "24s", "28s", "30s"], ans: 1, section: "Aptitude" },
  { q: "Which is NOT a characteristic of a good algorithm?", opts: ["Definiteness", "Finiteness", "Ambiguity", "Effectiveness"], ans: 2, section: "Technical" },
  { q: "The average of 5 numbers is 27. If one number is excluded, avg is 25. Excluded number?", opts: ["30", "35", "37", "40"], ans: 1, section: "Aptitude" },
  { q: "In C, what is sizeof(int)?", opts: ["2 bytes", "4 bytes", "Depends on system", "8 bytes"], ans: 2, section: "Technical" },
  { q: "Which traversal of a BST gives sorted output?", opts: ["Preorder", "Postorder", "Inorder", "Level Order"], ans: 2, section: "DSA" },
  { q: "If Ram is 3 times older than Shyam. After 5 years, Ram is 2.5 times. Ram's current age?", opts: ["40", "45", "50", "35"], ans: 1, section: "Aptitude" },
  { q: "What is the maximum value of an unsigned 8-bit integer?", opts: ["127", "128", "255", "256"], ans: 2, section: "Technical" },
  { q: "Which design pattern is used when exactly one instance of a class is needed?", opts: ["Factory", "Singleton", "Observer", "Decorator"], ans: 1, section: "Technical" },
  { q: "2^8 × 2^(-5) = ?", opts: ["2^3", "2^13", "2^(-40)", "4^3"], ans: 0, section: "Aptitude" },
  { q: "What does the git command 'git pull' do?", opts: ["Push changes to remote", "Fetch and merge from remote", "Create a new branch", "Delete remote branch"], ans: 1, section: "Technical" },
  { q: "A cistern is filled in 9 hours and emptied in 18 hours. If both pipes open, fill time?", opts: ["12h", "15h", "18h", "9h"], ans: 2, section: "Aptitude" },
  { q: "Which of these is NOT a JavaScript data type?", opts: ["String", "Boolean", "Float", "Symbol"], ans: 2, section: "Technical" },
  { q: "What is the space complexity of a recursive Fibonacci function?", opts: ["O(1)", "O(n)", "O(n²)", "O(log n)"], ans: 1, section: "DSA" },
  { q: "P and Q invest ₹3000 and ₹4000. Q invests for 5 months, P for 12 months. Profit ratio?", opts: ["9:5", "12:10", "36:20", "3:4"], ans: 2, section: "Aptitude" },
  { q: "What does SQL HAVING clause do?", opts: ["Filter rows before GROUP BY", "Filter groups after GROUP BY", "Sort results", "Join tables"], ans: 1, section: "Technical" },
  { q: "Which data structure is best for implementing a priority queue?", opts: ["Stack", "Queue", "Heap", "Linked List"], ans: 2, section: "DSA" },
  { q: "A shopkeeper marks goods 40% above cost. Sells at 20% discount. Profit %?", opts: ["12%", "16%", "18%", "20%"], ans: 1, section: "Aptitude" },
  { q: "What is the output of: print(type([]) == list) in Python?", opts: ["False", "True", "Error", "None"], ans: 1, section: "Technical" },
  { q: "Dijkstra's algorithm is used for?", opts: ["Minimum spanning tree", "Shortest path", "Maximum flow", "Topological sort"], ans: 1, section: "DSA" },
  { q: "If all roses are flowers and some flowers fade quickly, which is definitely true?", opts: ["All roses fade quickly", "Some roses fade quickly", "No rose fades", "Cannot be determined"], ans: 3, section: "Logical Reasoning" }
];

const INTERVIEW_QUESTIONS = {
  Microsoft: {
    HR: [
      { q: "Tell me about yourself and why you're interested in this role at Microsoft.", tags: ["HR", "BEHAVIORAL"] },
      { q: "Describe a time when you had to work under significant pressure. How did you handle it?", tags: ["BEHAVIORAL", "STAR"] },
      { q: "What are your greatest strengths and how will they help you at Microsoft?", tags: ["HR", "SELF-ASSESSMENT"] },
      { q: "Where do you see yourself in 5 years and how does Microsoft fit into your vision?", tags: ["HR", "CAREER GOALS"] },
      { q: "Do you have any questions for us?", tags: ["HR", "GENERAL"] }
    ],
    Technical: [
      { q: "Can you walk me through a time when you had to optimize a piece of code that was running too slowly? What was your approach?", tags: ["TECHNICAL", "PROBLEM SOLVING"] },
      { q: "Explain the difference between a process and a thread. When would you use one over the other?", tags: ["TECHNICAL", "OS"] },
      { q: "Design a URL shortening service like bit.ly. Walk me through your architecture.", tags: ["SYSTEM DESIGN", "TECHNICAL"] },
      { q: "What is the difference between TCP and UDP? Give real-world use cases for each.", tags: ["NETWORKS", "TECHNICAL"] },
      { q: "Write a function to find if a string is a palindrome without using extra space.", tags: ["CODING", "DSA"] }
    ]
  },
  Google: {
    HR: [
      { q: "Why do you want to work at Google specifically? What draws you to our mission?", tags: ["HR", "MOTIVATION"] },
      { q: "Tell me about a project you're most proud of and your specific contribution to it.", tags: ["BEHAVIORAL", "ACHIEVEMENT"] },
      { q: "How do you approach learning something completely new and unfamiliar?", tags: ["HR", "LEARNING"] },
      { q: "Describe a situation where you disagreed with your team. How did you resolve it?", tags: ["BEHAVIORAL", "CONFLICT"] },
      { q: "What does 'impact at scale' mean to you? Give an example from your experience.", tags: ["HR", "GOOGLE-FIT"] }
    ],
    Technical: [
      { q: "Given an array of integers, find two numbers that add up to a target sum. Optimize for time.", tags: ["CODING", "DSA"] },
      { q: "Explain how Google Search works at a high level. What systems are involved?", tags: ["SYSTEM DESIGN", "GOOGLE-SPECIFIC"] },
      { q: "What is the difference between BFS and DFS? When would you use each?", tags: ["DSA", "ALGORITHMS"] },
      { q: "Design a notification system that sends millions of push notifications per second.", tags: ["SYSTEM DESIGN", "SCALE"] },
      { q: "Explain memory management in Java (JVM garbage collection, stack vs heap).", tags: ["TECHNICAL", "JAVA"] }
    ]
  },
  TCS: {
    HR: [
      { q: "Tell me about yourself and your academic background.", tags: ["HR", "INTRO"] },
      { q: "Why do you want to join TCS as your first job?", tags: ["HR", "MOTIVATION"] },
      { q: "Are you comfortable relocating to any city in India?", tags: ["HR", "PRACTICAL"] },
      { q: "What are your salary expectations and why?", tags: ["HR", "SALARY"] },
      { q: "Describe yourself in three words. Justify each.", tags: ["HR", "SELF-ASSESSMENT"] }
    ],
    Technical: [
      { q: "What are the different types of joins in SQL? Explain with examples.", tags: ["TECHNICAL", "DBMS"] },
      { q: "Explain the concept of normalization. What is 3NF?", tags: ["TECHNICAL", "DBMS"] },
      { q: "What is the difference between == and .equals() in Java?", tags: ["TECHNICAL", "JAVA"] },
      { q: "Explain the OSI model and its seven layers.", tags: ["TECHNICAL", "NETWORKS"] },
      { q: "What is a pointer in C? How is it different from a reference?", tags: ["TECHNICAL", "C"] }
    ]
  }
};

const ROADMAP_ITEMS = [
  { week: 'Week 1-2', title: 'Foundation Reset', desc: 'Reassess fundamentals in Arrays, Strings, and basic Math. Complete aptitude basics.', topics: ['Arrays', 'Strings', 'Basic Math', 'Number Systems'], progress: 100, status: 'done' },
  { week: 'Week 3-4', title: 'DSA Core', desc: 'Master Linked Lists, Stacks, Queues, and Trees. Solve 30 LeetCode easy problems.', topics: ['Linked Lists', 'Stacks', 'Queues', 'Trees'], progress: 70, status: 'current' },
  { week: 'Week 5-6', title: 'Database & OS', desc: 'Complete DBMS fundamentals (SQL, Normalization) and OS basics (Process Management, Memory).', topics: ['SQL', 'Normalization', 'Process Management', 'Memory Management'], progress: 20, status: 'upcoming' },
  { week: 'Week 7-8', title: 'Advanced DSA', desc: 'Graph algorithms, Dynamic Programming, and Advanced Trees. Solve 50 medium problems.', topics: ['Graphs', 'DP', 'Heaps', 'Tries'], progress: 0, status: 'upcoming' },
  { week: 'Week 9-10', title: 'Mock Tests Sprint', desc: 'Take company-specific mock tests daily. Focus on weak areas identified in analytics.', topics: ['TCS Mock', 'Infosys Mock', 'Aptitude Tests', 'Verbal Tests'], progress: 0, status: 'locked' },
  { week: 'Week 11-12', title: 'Interview Preparation', desc: 'Practice 20+ AI mock interviews. Improve communication, confidence, and STAR method answers.', topics: ['HR Questions', 'Technical Interview', 'STAR Method', 'Communication'], progress: 0, status: 'locked' }
];

const QA_FEEDBACK = [
  { q: "Tell me about yourself.", your: "I am Priya Sharma, a B.Tech CSE student at GH Raisoni College...", feedback: "Good structured answer. Try to connect your skills directly to the job role. Mention a quantifiable achievement early.", star: "pass" },
  { q: "Why do you want to work at Microsoft?", your: "Microsoft is a great company with amazing culture and technology...", feedback: "Too generic. Research Microsoft's specific initiatives (Azure, AI, Bing). Mention 1–2 specific projects that excite you.", star: "partial" },
  { q: "Describe a technical challenge you solved.", your: "In my college project, I optimized a database query that was slow...", feedback: "Excellent STAR structure! The 'reduce 60% load time' metric is very impressive. This is your strongest answer.", star: "pass" },
  { q: "Where do you see yourself in 5 years?", your: "I want to become a senior developer and lead a team...", feedback: "Good but add specificity: what kind of team? What technology? Align your 5-year vision with Microsoft's cloud/AI roadmap.", star: "partial" },
  { q: "Do you have any questions for us?", your: "What is the team culture like at Microsoft?", feedback: "Asking questions shows engagement, but ask more insightful questions: 'What metrics define success in the first 6 months?'", star: "pass" }
];

// ──────────────────────────────────────────────────────────────
// SCREEN ROUTING
// ──────────────────────────────────────────────────────────────
function showScreen(screenId) {
  // Hide all screens
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
    s.style.display = 'none';
  });
  const screen = document.getElementById(`screen-${screenId}`);
  if (!screen) return;
  screen.classList.add('active');
  // Each screen needs its own display type
  const displayMap = {
    'login':      'flex',
    'welcome':    'flex',
    'assessment': 'flex',
    'app':        'flex',
    'test':       'flex',
    'interview':  'flex',
    'results':    'block',
    'interview-report': 'block'
  };
  screen.style.display = displayMap[screenId] || 'block';
  state.currentScreen = screenId;
}

function navigateTo(page) {
  // Update nav
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === page);
  });
  // Update pages
  document.querySelectorAll('.app-page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(`page-${page}`);
  if (target) {
    target.classList.add('active');
    target.classList.remove('fade-in');
    void target.offsetWidth;
    target.classList.add('fade-in');
  }
  // Update header title
  const titles = {
    'dashboard': 'Dashboard', 'skill-report': 'Skill Report', 'roadmap': 'Learning Roadmap',
    'learning-hub': 'Learning Hub', 'company-prep': 'Company Preparation',
    'company-papers': 'Company Papers', 'mock-tests': 'Mock Tests',
    'ai-interview': 'AI Interview', 'profile': 'Profile', 'settings': 'Settings',
    'college-dashboard': 'T&P Dashboard', 'college-students': 'Student Directory',
    'college-drives': 'Placement Drives', 'college-assessments': 'Question Bank',
    'company-dashboard': 'Recruiter Dashboard', 'company-jobs': 'Post Job Openings',
    'company-applicants': 'Applicants Tracker', 'company-candidates': 'Candidate Insights'
  };
  const titleEl = document.getElementById('headerPageTitle');
  if (titleEl) titleEl.textContent = titles[page] || 'Elevate';
  state.currentPage = page;
  // Close notifications
  closeNotifications();
  // Close sidebar on mobile
  if (window.innerWidth <= 768) document.getElementById('mainSidebar').classList.remove('open');
  // Page-specific init
  if (page === 'skill-report') initSkillReport();
  if (page === 'roadmap') initRoadmap();
  if (page === 'learning-hub') initLearningHub();
  if (page === 'company-prep') initCompanyPrep();
  if (page === 'company-papers') initCompanyPapers();
  if (page === 'mock-tests') initMockTests();
  
  // New Page Specific Init
  if (page === 'college-dashboard') initCollegeDashboard();
  if (page === 'college-students') initCollegeStudents();
  if (page === 'college-drives') initCollegeDrives();
  if (page === 'college-assessments') initCollegeAssessments();
  if (page === 'company-dashboard') initCompanyDashboard();
  if (page === 'company-jobs') initCompanyJobs();
  if (page === 'company-applicants') initCompanyApplicants();
  if (page === 'company-candidates') initCompanyCandidate(state.selectedCandidateId);
}

// ──────────────────────────────────────────────────────────────
// LOGIN
// ──────────────────────────────────────────────────────────────
function handleLogin(e) {
  e.preventDefault();
  const id = document.getElementById('studentId').value.trim();
  const pw = document.getElementById('password').value;
  const errEl = document.getElementById('loginError');
  const errText = document.getElementById('loginErrorMsg');
  const btn = document.getElementById('loginBtn');
  const btnText = document.getElementById('loginBtnText');
  
  if (!id || !pw) { 
    errEl.classList.add('show'); 
    errText.textContent = 'Please enter your login ID and password.'; 
    return; 
  }
  
  errEl.classList.remove('show');
  btn.style.opacity = '0.7';
  btnText.textContent = 'Authenticating...';
  
  setTimeout(async () => {
    btn.style.opacity = '1';
    btnText.textContent = 'Sign In to Portal';
    
    const role = state.loginRole || 'student';
    
    if (role === 'student') {
      const student = await db.getStudentById(id);
      if (student && pw.length >= 3) {
        state.student = student;
        // set app role
        setAppRole('student');
        if (state.isFirstLogin && student.readiness === 50) {
          showScreen('welcome');
        } else {
          state.isFirstLogin = false;
          enterApp();
        }
        showToast(`Welcome back, ${student.name}!`, 'success');
      } else {
        errEl.classList.add('show');
        errText.textContent = 'Invalid Student ID or Password. Try ID: GHRCE2024047 and password: 123';
      }
    } else if (role === 'college') {
      if (id === 'tp@ghrce.ac.in' && pw === 'admin') {
        setAppRole('college');
        showScreen('app');
        navigateTo('college-dashboard');
        showToast('Logged in as T&P Placement Officer.', 'success');
      } else {
        errEl.classList.add('show');
        errText.textContent = 'Invalid admin credentials. Use tp@ghrce.ac.in / admin';
      }
    } else if (role === 'company') {
      if ((id.startsWith('recruiter@') || id === 'recruiter') && pw === 'microsoft') {
        let company = 'Microsoft';
        if (id.includes('@')) {
          const domain = id.split('@')[1].split('.')[0];
          company = domain.charAt(0).toUpperCase() + domain.slice(1);
        }
        state.companyName = company;
        setAppRole('company');
        showScreen('app');
        navigateTo('company-dashboard');
        showToast(`Logged in as Recruiter for ${company}.`, 'success');
      } else {
        errEl.classList.add('show');
        errText.textContent = 'Invalid recruiter credentials. Use recruiter@microsoft.com / microsoft';
      }
    }
  }, 1200);
}

function togglePassword() {
  const pw = document.getElementById('password');
  pw.type = pw.type === 'password' ? 'text' : 'password';
}

function showForgotModal() {
  showModal('Forgot Password?', 'Please contact the Training & Placement Cell:\n\nOffice: Room 204, Academic Block\nEmail: placement@ghrce.ac.in\nPhone: 0712-2249966', null, 'Close');
}

// ──────────────────────────────────────────────────────────────
// WELCOME / FIRST LOGIN
// ──────────────────────────────────────────────────────────────
function selectDept(btn) {
  document.querySelectorAll('.dept-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  state.selectedDept = btn.dataset.dept;
}

function startAssessment() {
  if (!state.selectedDept) { showToast('Please select your department first.', 'warning'); return; }
  showScreen('assessment');
  initAssessment();
}

// ──────────────────────────────────────────────────────────────
// ASSESSMENT
// ──────────────────────────────────────────────────────────────
function initAssessment() {
  const dept = state.selectedDept;
  const questions = ASSESSMENT_QUESTIONS[dept] || ASSESSMENT_QUESTIONS.Engineering;
  state.assessment.questions = questions;
  state.assessment.totalQ = questions.length;
  state.assessment.currentQ = 0;
  state.assessment.answers = {};
  state.assessment.flagged = new Set();
  state.assessment.timer = 45 * 60;
  document.getElementById('atbDept').textContent = `${dept} Assessment`;
  buildPalette();
  renderQuestion();
  startAssessmentTimer();
}

function buildPalette() {
  const palette = document.getElementById('qPalette');
  palette.innerHTML = '';
  state.assessment.questions.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.className = `q-num${i === 0 ? ' current' : ''}`;
    btn.textContent = i + 1;
    btn.onclick = () => { state.assessment.currentQ = i; renderQuestion(); };
    palette.appendChild(btn);
  });
}

function updatePalette() {
  const btns = document.querySelectorAll('#qPalette .q-num');
  btns.forEach((btn, i) => {
    btn.className = 'q-num';
    if (i === state.assessment.currentQ) btn.classList.add('current');
    else if (state.assessment.answers[i] !== undefined) btn.classList.add('answered');
    else if (state.assessment.flagged.has(i)) btn.classList.add('flagged');
  });
}

function renderQuestion() {
  const { questions, currentQ, answers } = state.assessment;
  const q = questions[currentQ];
  if (!q) return;
  document.getElementById('qSectionLabel').textContent = q.section;
  document.getElementById('qCount').textContent = `Question ${currentQ + 1} of ${questions.length}`;
  document.getElementById('qText').textContent = q.q;
  const opts = document.getElementById('qOptions');
  opts.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];
  q.opts.forEach((opt, i) => {
    const div = document.createElement('div');
    div.className = `q-option${answers[currentQ] === i ? ' selected' : ''}`;
    div.innerHTML = `<div class="option-letter">${letters[i]}</div><div class="option-text">${opt}</div>`;
    div.onclick = () => { state.assessment.answers[currentQ] = i; renderQuestion(); updatePalette(); };
    opts.appendChild(div);
  });
  document.getElementById('prevBtn').disabled = currentQ === 0;
  document.getElementById('nextBtn').textContent = currentQ === questions.length - 1 ? 'Review' : 'Next';
  document.getElementById('nextBtn').className = `btn-nav ${currentQ === questions.length - 1 ? 'success' : 'primary'}`;
  const fill = document.getElementById('assessmentProgressFill');
  fill.style.width = `${((currentQ + 1) / questions.length) * 100}%`;
  updatePalette();
}

function nextQuestion() {
  const { questions, currentQ } = state.assessment;
  if (currentQ < questions.length - 1) { state.assessment.currentQ++; renderQuestion(); }
  else confirmSubmitAssessment();
}

function prevQuestion() {
  if (state.assessment.currentQ > 0) { state.assessment.currentQ--; renderQuestion(); }
}

function flagQuestion() {
  const { flagged, currentQ } = state.assessment;
  if (flagged.has(currentQ)) flagged.delete(currentQ); else flagged.add(currentQ);
  updatePalette();
  showToast(flagged.has(currentQ) ? 'Question flagged for review.' : 'Flag removed.', 'warning');
}

function startAssessmentTimer() {
  clearInterval(state.assessment.timerInterval);
  state.assessment.timerInterval = setInterval(() => {
    state.assessment.timer--;
    const el = document.getElementById('assessmentTimer');
    const m = Math.floor(state.assessment.timer / 60);
    const s = state.assessment.timer % 60;
    el.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    if (state.assessment.timer <= 300) el.className = 'timer-count warning';
    if (state.assessment.timer <= 60) el.className = 'timer-count danger';
    if (state.assessment.timer <= 0) { clearInterval(state.assessment.timerInterval); submitAssessment(); }
  }, 1000);
}

function confirmSubmitAssessment() {
  const answered = Object.keys(state.assessment.answers).length;
  const total = state.assessment.totalQ;
  showModal('Submit Assessment?', `You have answered ${answered} of ${total} questions. Unanswered questions will be marked incorrect. Are you sure you want to submit?`, submitAssessment);
}

function submitAssessment() {
  clearInterval(state.assessment.timerInterval);
  closeModal();
  state.isFirstLogin = false;
  showToast('Assessment submitted! Generating your personalized dashboard...', 'success');
  setTimeout(() => { enterApp(); }, 1500);
}

// ──────────────────────────────────────────────────────────────
// ENTER APP
// ──────────────────────────────────────────────────────────────
function enterApp() {
  showScreen('app');
  const el = document.getElementById('screen-app');
  el.style.display = 'flex';
  // Set greeting
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning,' : hour < 17 ? 'Good afternoon,' : 'Good evening,';
  const greetEl = document.getElementById('dashGreeting');
  if (greetEl) greetEl.textContent = greet;
  // Set readiness animation
  animateReadiness();
  // Update sidebar
  document.getElementById('sidebarReadiness').style.width = `${state.student.readiness}%`;
  document.getElementById('sidebarReadinessVal').textContent = `${state.student.readiness}%`;
  document.getElementById('headerReadiness').textContent = `${state.student.readiness}%`;
  // Init heatmap
  setTimeout(initHeatmap, 300);
}

function animateReadiness() {
  const circle = document.getElementById('readinessFillCircle');
  if (!circle) return;
  const r = 38, circ = 2 * Math.PI * r;
  const offset = circ - (state.student.readiness / 100) * circ;
  setTimeout(() => { circle.style.strokeDashoffset = offset; }, 400);
}

// ──────────────────────────────────────────────────────────────
// HEATMAP
// ──────────────────────────────────────────────────────────────
function initHeatmap() {
  const grid = document.getElementById('heatmapGrid');
  if (!grid) return;
  grid.innerHTML = '';
  const levels = ['l0', 'l0', 'l1', 'l1', 'l2', 'l3', 'l4'];
  for (let i = 0; i < 84; i++) {
    const day = document.createElement('div');
    const lvl = Math.random() < 0.3 ? 'l0' : levels[Math.floor(Math.random() * levels.length)];
    day.className = `hm-day ${lvl}`;
    day.title = `${Math.floor(Math.random() * 4)}h studied`;
    grid.appendChild(day);
  }
}

// ──────────────────────────────────────────────────────────────
// SKILL REPORT — Charts
// ──────────────────────────────────────────────────────────────
function initSkillReport() {
  if (state.charts.radar) { state.charts.radar.destroy(); }
  const ctx = document.getElementById('radarChart');
  if (!ctx) return;
  state.charts.radar = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Technical', 'Programming', 'Communication', 'Logical\nReasoning', 'Problem\nSolving', 'Core CS', 'Confidence'],
      datasets: [{
        label: 'Your Skills',
        data: [75, 75, 62, 68, 73, 50, 65],
        fill: true,
        backgroundColor: 'rgba(91,45,144,0.15)',
        borderColor: 'rgba(91,45,144,0.8)',
        pointBackgroundColor: '#5B2D90',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#5B2D90',
        borderWidth: 2
      }, {
        label: 'Placement Target',
        data: [80, 80, 75, 75, 75, 75, 75],
        fill: true,
        backgroundColor: 'rgba(212,175,55,0.08)',
        borderColor: 'rgba(212,175,55,0.6)',
        pointBackgroundColor: '#D4AF37',
        borderDash: [5, 5],
        borderWidth: 1.5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: { legend: { position: 'bottom', labels: { font: { size: 11, family: 'Inter' }, boxWidth: 12 } } },
      scales: {
        r: {
          min: 0, max: 100,
          ticks: { stepSize: 25, font: { size: 10 } },
          grid: { color: 'rgba(0,0,0,0.08)' },
          pointLabels: { font: { size: 11, family: 'Inter', weight: '600' } }
        }
      }
    }
  });
}

// ──────────────────────────────────────────────────────────────
// ROADMAP
// ──────────────────────────────────────────────────────────────
function initRoadmap() {
  const container = document.getElementById('roadmapTimeline');
  if (!container) return;
  container.innerHTML = ROADMAP_ITEMS.map(item => `
    <div class="timeline-item">
      <div class="timeline-marker">
        <div class="tl-dot ${item.status}"></div>
        <div class="tl-week">${item.week}</div>
      </div>
      <div class="timeline-card ${item.status}">
        <div class="tc-top">
          <div class="tc-title">${item.title}</div>
          <span class="tc-badge ${item.status}">${item.status === 'done' ? '✓ Completed' : item.status === 'current' ? '▶ In Progress' : item.status === 'locked' ? '🔒 Locked' : '◷ Upcoming'}</span>
        </div>
        <div class="tc-desc">${item.desc}</div>
        <div class="tc-topics">${item.topics.map(t => `<span class="tc-topic">${t}</span>`).join('')}</div>
        ${item.status !== 'locked' ? `<div class="tc-progress"><div class="tc-prog-fill" style="width:${item.progress}%"></div></div>` : ''}
      </div>
    </div>
  `).join('');
}

// ──────────────────────────────────────────────────────────────
// LEARNING HUB
// ──────────────────────────────────────────────────────────────
function initLearningHub(filter = 'all', search = '') {
  const grid = document.getElementById('coursesGrid');
  if (!grid) return;
  let courses = COURSES.filter(c =>
    (filter === 'all' || c.cat === filter) &&
    (!search || c.title.toLowerCase().includes(search.toLowerCase()))
  );
  grid.innerHTML = courses.map(c => `
    <div class="course-card">
      <div class="course-thumb-big" style="background:${c.bg}">
        <span>${c.icon}</span>
        <span class="course-diff ${c.diff}">${c.diff}</span>
      </div>
      <div class="course-card-body">
        <h4>${c.title}</h4>
        <div class="course-card-meta">
          <span>⏱ ${c.duration}</span>
          <span>📚 ${c.lessons} lessons</span>
        </div>
        <div class="course-rating">
          <span class="stars">${'★'.repeat(Math.floor(c.rating))}${'☆'.repeat(5 - Math.floor(c.rating))}</span>
          <span>${c.rating} • ${c.instructor}</span>
        </div>
        <div class="course-prog-wrap">
          <div class="course-prog-top"><span>${c.progress}% complete</span><span>${c.lessons - Math.floor(c.lessons * c.progress / 100)} left</span></div>
          <div class="course-prog-bar"><div class="course-prog-fill" style="width:${c.progress}%"></div></div>
        </div>
        <button class="btn-continue" onclick="showToast('Continuing ${c.title}...','success')">
          ${c.progress > 0 ? '▶ Continue Learning' : '▶ Start Course'}
        </button>
      </div>
    </div>
  `).join('') || '<div class="empty-state"><div class="es-icon">📭</div><h4>No courses found</h4><p>Try a different filter or search term.</p></div>';
}

function filterHub(btn, filter) {
  document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  initLearningHub(filter);
}

function searchHub(val) {
  const activeFilter = document.querySelector('.filter-chip.active')?.textContent?.toLowerCase() === 'all courses' ? 'all' : 'all';
  initLearningHub(activeFilter, val);
}

// ──────────────────────────────────────────────────────────────
// COMPANY PREP
// ──────────────────────────────────────────────────────────────
async function initCompanyPrep() {
  const list = document.getElementById('companyList');
  if (!list) return;
  const jobs = await db.getJobs();
  
  if (jobs.length === 0) {
    list.innerHTML = '<div style="padding:20px;color:var(--text-3)">No active jobs available.</div>';
    document.getElementById('companyDetail').innerHTML = '';
    return;
  }
  
  list.innerHTML = jobs.map((j, i) => `
    <div class="company-list-item ${i === 0 ? 'active' : ''}" onclick="selectCompanyJob(this,'${j.id}')">
      <div class="cli-logo">${j.logo || j.company.substring(0,3).toUpperCase()}</div>
      <div class="cli-info">
        <div class="ci-company">${j.company}</div>
        <div class="ci-type">${j.role}</div>
        <span class="ci-badge hiring" style="font-size:10px;background:var(--success-light);color:#16a34a;padding:2px 6px;border-radius:4px;font-weight:700">OPEN</span>
      </div>
    </div>
  `).join('');
  
  renderCompanyJobDetail(jobs[0]);
}

async function selectCompanyJob(el, id) {
  document.querySelectorAll('.company-list-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');
  const jobs = await db.getJobs();
  const job = jobs.find(j => j.id === id);
  if (job) renderCompanyJobDetail(job);
}

async function renderCompanyJobDetail(j) {
  const panel = document.getElementById('companyDetail');
  if (!panel) return;
  
  const studentId = state.student?.id || 'GHRCE2024047';
  const student = await db.getStudentById(studentId);
  const alreadyApplied = student?.appliedJobs?.some(a => a.jobId === j.id);
  const eligible = student ? student.cgpa >= (j.eligibility?.cgpa || 6.0) : false;
  
  panel.innerHTML = `
    <div class="company-hero">
      <div class="ch-left">
        <div class="ch-logo">${j.logo || j.company.substring(0,3).toUpperCase()}</div>
        <div class="ch-info">
          <h2>${j.company} - ${j.role} <span style="font-size:12px;background:var(--success-light);color:#16a34a;padding:3px 10px;border-radius:99px;font-weight:700;vertical-align:middle">ACTIVE</span></h2>
          <p>${j.desc} • CTC: <strong>${j.ctc}</strong></p>
          <div class="ch-tags">
            <span class="ch-tag" style="background:var(--primary-light);color:var(--primary);padding:3px 8px;border-radius:4px;font-size:11px;font-weight:600;margin-right:6px">${j.type}</span>
            <span class="ch-tag" style="background:var(--border-light);color:var(--text-2);padding:3px 8px;border-radius:4px;font-size:11px;font-weight:600">${j.location}</span>
          </div>
        </div>
      </div>
      <div class="ch-actions">
        ${alreadyApplied 
          ? `<button class="btn-prep" style="background:var(--success-light);color:#16a34a;cursor:default;font-weight:700;border:none" disabled>✓ Applied</button>`
          : eligible
            ? `<button class="btn-prep primary" onclick="applyForJobFromStudentPortal('${j.id}')">Apply Now</button>`
            : `<button class="btn-prep" style="background:var(--error-light);color:var(--error);cursor:not-allowed" disabled>Not Eligible</button>`
        }
        <button class="btn-prep outline" onclick="startInterview()">Practice Interview</button>
      </div>
    </div>
    <div class="company-info-grid">
      <div class="card eligibility-card">
        <h4>✅ Eligibility Criteria</h4>
        <div class="elig-item" style="display:flex;align-items:center;gap:8px;margin-top:10px;"><svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg><span>Min CGPA: <strong>${j.eligibility?.cgpa || '6.0'}</strong></span></div>
        <div class="elig-item" style="display:flex;align-items:center;gap:8px;margin-top:6px;"><svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg><span>Eligible Branches: <strong>Computer Science, IT</strong></span></div>
        <div class="elig-item" style="display:flex;align-items:center;gap:8px;margin-top:6px;"><svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg><span>Active Backlogs: <strong>Max ${j.eligibility?.backlogs ?? '0'}</strong></span></div>
      </div>
      <div class="card process-card">
        <h4>🔢 Recruitment Process</h4>
        <div class="process-step"><div class="ps-num">1</div><div class="ps-info"><div class="ps-name">Online Test</div><div class="ps-desc">Technical & Aptitude MCQ</div></div></div>
        <div class="process-step"><div class="ps-num">2</div><div class="ps-info"><div class="ps-name">Technical Interview</div><div class="ps-desc">Live coding and DSA round</div></div></div>
        <div class="process-step"><div class="ps-num">3</div><div class="ps-info"><div class="ps-name">HR & Fitment Round</div><div class="ps-desc">Behavioral and team match</div></div></div>
      </div>
    </div>
    <div class="company-resources-grid">
      <div class="resource-card" onclick="navigateTo('company-papers')" style="cursor:pointer">
        <div class="rc-info"><div class="rci-title">Previous Papers</div><div class="rci-sub">Explore last 5 years' questions</div></div>
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
      </div>
      <div class="resource-card" onclick="navigateTo('mock-tests')" style="cursor:pointer">
        <div class="rc-info"><div class="rci-title">Company Mock Test</div><div class="rci-sub">Timed assessment matching actual pattern</div></div>
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
      </div>
      <div class="card match-score-card" style="grid-column: span 2;">
        <h4>Eligibility Match Analysis</h4>
        <div class="ms-circle" style="margin-top: 12px; display:flex; align-items:center; gap:16px;">
          <div class="ms-pct" style="font-size:32px;color:${eligible ? 'var(--success)' : 'var(--error)'};font-weight:800">${eligible ? '100%' : '0%'}</div>
          <div class="ms-desc" style="font-size:12px;color:var(--text-2)">
            ${eligible 
              ? `Your CGPA (${student?.cgpa}) meets the eligibility requirement of ${j.eligibility?.cgpa || '6.0'}.`
              : `Your CGPA (${student?.cgpa}) does not meet the minimum criteria of ${j.eligibility?.cgpa || '6.0'} required for this opening.`
            }
          </div>
        </div>
      </div>
    </div>
  `;
}

async function applyForJobFromStudentPortal(jobId) {
  const studentId = state.student?.id || 'GHRCE2024047';
  const res = await db.applyToJob(jobId, studentId);
  if (res.success) {
    showToast('Applied successfully! Recruiter has been notified.', 'success');
    const jobs = await db.getJobs();
    const job = jobs.find(j => j.id === jobId);
    if (job) renderCompanyJobDetail(job);
  } else {
    showToast(res.message, 'error');
  }
}


// ──────────────────────────────────────────────────────────────
// COMPANY PAPERS
// ──────────────────────────────────────────────────────────────
function initCompanyPapers() {
  const grid = document.getElementById('papersGrid');
  if (!grid) return;
  grid.innerHTML = PAPERS.map((p, i) => `
    <div class="paper-card">
      <div class="pc-top">
        <div class="pc-company">
          <div class="pc-logo">${p.logo}</div>
          <div><div class="pc-name">${p.company}</div><div class="pc-role">${p.role}</div></div>
        </div>
        <button class="bookmark-btn ${state.bookmarks.has(i) ? 'active' : ''}" onclick="toggleBookmark(this,${i})">
          <svg width="16" height="16" fill="${state.bookmarks.has(i) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
        </button>
      </div>
      <div class="pc-tags">
        <span class="pc-tag year">${p.year}</span>
        ${p.tags.map(t => `<span class="pc-tag type">${t}</span>`).join('')}
        <span class="pc-tag ${p.diff}">${p.diff}</span>
      </div>
      <div class="pc-stats">
        <span class="pc-stat"><svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> ${p.downloads} downloads</span>
      </div>
      <div class="pc-actions">
        <button class="btn-solve" onclick="startTestFromPaper('${p.company}')">
          <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          Solve Online
        </button>
        <button class="btn-pdf" onclick="showToast('Downloading ${p.company} ${p.year} paper...','success')">
          <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/></svg>
          PDF
        </button>
      </div>
    </div>
  `).join('');
}

function toggleBookmark(btn, idx) {
  if (state.bookmarks.has(idx)) { state.bookmarks.delete(idx); showToast('Bookmark removed.', 'warning'); }
  else { state.bookmarks.add(idx); showToast('Paper bookmarked!', 'success'); }
  btn.classList.toggle('active', state.bookmarks.has(idx));
  btn.querySelector('svg').setAttribute('fill', state.bookmarks.has(idx) ? 'currentColor' : 'none');
}

// ──────────────────────────────────────────────────────────────
// MOCK TESTS
// ──────────────────────────────────────────────────────────────
function initMockTests() {
  const list = document.getElementById('testsList');
  if (!list) return;
  list.innerHTML = MOCK_TESTS.map(t => `
    <div class="test-card ${t.featured ? 'featured' : ''} ${t.locked ? 'locked' : ''}">
      <div class="tc-top-row">
        <div style="flex:1">
          <div class="tc-company-label">${t.companyLabel}</div>
          <div class="tc-name">${t.name}</div>
          <div class="tc-desc">${t.desc}</div>
          <div class="tc-meta">
            <span class="tc-meta-item"><svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> ${t.questions} Questions</span>
            <span class="tc-meta-item"><svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> ${t.difficulty}</span>
            ${t.prevScore ? `<span class="prev-score">✓ Prev: ${t.prevScore}%</span>` : ''}
          </div>
        </div>
      </div>
      <div class="tc-bottom">
        <div class="tc-duration"><svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ${t.duration} Minutes</div>
        ${t.locked ? `<div class="lock-badge"><svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> ${t.lockMsg}</div>`
          : `<button class="btn-start-test" onclick="startMockTest(${t.id},'${t.name}',${t.duration})">Start Test</button>`}
      </div>
    </div>
  `).join('');
}

function filterTest(btn) {
  document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
}

function startTestFromPaper(company) {
  const test = MOCK_TESTS.find(t => t.company === company) || MOCK_TESTS[0];
  startMockTest(test.id, test.name, test.duration);
}

// ──────────────────────────────────────────────────────────────
// TEST ENGINE
// ──────────────────────────────────────────────────────────────
function startMockTest(id, name, duration) {
  state.test.currentQ = 0;
  state.test.answers = {};
  state.test.timer = duration * 60;
  state.test.testName = name;
  state.test.totalQ = TEST_QUESTIONS.length;
  showScreen('test');
  document.getElementById('testTitle').textContent = `${name} — ${TEST_QUESTIONS.length} Questions`;
  buildTestPalette();
  renderTestQuestion();
  startTestTimer();
}

function buildTestPalette() {
  const palette = document.getElementById('testPalette');
  palette.innerHTML = '';
  TEST_QUESTIONS.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.className = `q-num-sm${i === 0 ? ' current' : ''}`;
    btn.textContent = i + 1;
    btn.onclick = () => { state.test.currentQ = i; renderTestQuestion(); };
    palette.appendChild(btn);
  });
}

function updateTestPalette() {
  const btns = document.querySelectorAll('#testPalette .q-num-sm');
  btns.forEach((btn, i) => {
    btn.className = 'q-num-sm';
    if (i === state.test.currentQ) btn.classList.add('current');
    else if (state.test.answers[i] !== undefined) btn.classList.add('answered');
  });
}

function renderTestQuestion() {
  const { currentQ, answers } = state.test;
  const q = TEST_QUESTIONS[currentQ];
  if (!q) return;
  document.getElementById('testQMeta').textContent = `Question ${currentQ + 1} • ${q.section}`;
  document.getElementById('testQText').textContent = q.q;
  document.getElementById('testQCount').textContent = `${currentQ + 1} / ${TEST_QUESTIONS.length}`;
  const opts = document.getElementById('testOptions');
  opts.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];
  q.opts.forEach((opt, i) => {
    const div = document.createElement('div');
    div.className = `q-option${answers[currentQ] === i ? ' selected' : ''}`;
    div.innerHTML = `<div class="option-letter">${letters[i]}</div><div class="option-text">${opt}</div>`;
    div.onclick = () => { state.test.answers[currentQ] = i; renderTestQuestion(); updateTestPalette(); };
    opts.appendChild(div);
  });
  document.getElementById('testPrevBtn').disabled = currentQ === 0;
  document.getElementById('testNextBtn').textContent = currentQ === TEST_QUESTIONS.length - 1 ? 'Finish →' : 'Next →';
  const fill = document.getElementById('testProgressFill');
  fill.style.width = `${((currentQ + 1) / TEST_QUESTIONS.length) * 100}%`;
  updateTestPalette();
}

function testNextQuestion() {
  if (state.test.currentQ < TEST_QUESTIONS.length - 1) { state.test.currentQ++; renderTestQuestion(); }
  else confirmEndTest();
}

function testPrevQuestion() {
  if (state.test.currentQ > 0) { state.test.currentQ--; renderTestQuestion(); }
}

function startTestTimer() {
  clearInterval(state.test.timerInterval);
  state.test.timerInterval = setInterval(() => {
    state.test.timer--;
    const m = Math.floor(state.test.timer / 60);
    const s = state.test.timer % 60;
    const time = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    const el = document.getElementById('testTimer');
    const pill = document.getElementById('testTimerPill');
    if (el) el.textContent = time;
    if (state.test.timer <= 600 && pill) pill.className = 'timer-pill warning';
    if (state.test.timer <= 120 && pill) pill.className = 'timer-pill danger';
    if (state.test.timer <= 0) { clearInterval(state.test.timerInterval); submitTest(); }
  }, 1000);
}

function confirmEndTest() {
  const answered = Object.keys(state.test.answers).length;
  showModal('Submit Test?', `You answered ${answered} of ${TEST_QUESTIONS.length} questions. Submit now?`, submitTest);
}

function submitTest() {
  clearInterval(state.test.timerInterval);
  closeModal();
  // Calculate score
  let correct = 0;
  TEST_QUESTIONS.forEach((q, i) => { if (state.test.answers[i] === q.ans) correct++; });
  const score = Math.round((correct / TEST_QUESTIONS.length) * 100);
  const timeTaken = Math.round((state.test.timer > 0 ? (90 * 60 - state.test.timer) : 90 * 60) / 60);
  showScreen('results');
  // Animate circle
  setTimeout(() => {
    const circle = document.getElementById('resultsFillCircle');
    if (circle) {
      const r = 58, circ = 2 * Math.PI * r;
      circle.style.strokeDashoffset = circ - (score / 100) * circ;
    }
    document.getElementById('resultsScore').textContent = score;
    document.getElementById('rqAccuracy').textContent = `${Math.round((correct / TEST_QUESTIONS.length) * 100)}%`;
    document.getElementById('rqCorrect').textContent = `${correct}/${TEST_QUESTIONS.length}`;
    document.getElementById('rqTime').textContent = `${timeTaken} min`;
    document.getElementById('resultsTitle').textContent = `${state.test.testName} — Completed!`;
    // Comparison chart
    initComparisonChart(score);
  }, 300);
}

function initComparisonChart(score) {
  if (state.charts.comparison) state.charts.comparison.destroy();
  const ctx = document.getElementById('comparisonChart');
  if (!ctx) return;
  state.charts.comparison = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Test 1', 'Test 2', 'Test 3', 'Test 4', 'This Test'],
      datasets: [{
        label: 'Your Score',
        data: [52, 61, 68, 74, score],
        borderColor: '#5B2D90',
        backgroundColor: 'rgba(91,45,144,0.08)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#5B2D90',
        pointRadius: 5
      }, {
        label: 'Batch Average',
        data: [55, 58, 60, 62, 63],
        borderColor: '#D4AF37',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.4,
        pointBackgroundColor: '#D4AF37',
        pointRadius: 4
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom', labels: { font: { size: 11 }, boxWidth: 12 } } },
      scales: { y: { min: 40, max: 100, ticks: { font: { size: 10 } } }, x: { ticks: { font: { size: 11 } } } }
    }
  });
}

// ──────────────────────────────────────────────────────────────
// AI INTERVIEW
// ──────────────────────────────────────────────────────────────
function startInterview() {
  const companyEl = document.querySelector('input[name="ivCompany"]:checked');
  const typeEl = document.querySelector('input[name="ivType"]:checked');
  state.interview.company = companyEl ? companyEl.value : 'Microsoft';
  state.interview.type = typeEl ? typeEl.value : 'HR';
  state.interview.currentQ = 0;
  state.interview.timer = 0;
  state.interview.chatHistory = [];
  showScreen('interview');
  document.getElementById('ihInfo').textContent = `INTERVIEWING FOR SOFTWARE ENGINEER — ${state.interview.company.toUpperCase()}`;
  document.getElementById('ivProgType').textContent = `${state.interview.type} Round`;
  startInterviewTimer();
  initInterviewChat();
}

function startInterviewTimer() {
  clearInterval(state.interview.timerInterval);
  state.interview.timerInterval = setInterval(() => {
    state.interview.timer++;
    const m = Math.floor(state.interview.timer / 60);
    const s = state.interview.timer % 60;
    const el = document.getElementById('ivTimer');
    if (el) el.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }, 1000);
}

function initInterviewChat() {
  const company = state.interview.company;
  const type = state.interview.type;
  const qBank = INTERVIEW_QUESTIONS[company]?.[type] || INTERVIEW_QUESTIONS.TCS.HR;
  state.interview.questions = qBank;
  const transcript = document.getElementById('ivTranscript');
  transcript.innerHTML = '';
  // Initial greeting
  addChatBubble('ai', `Hello! Welcome to your mock interview for the Software Engineer position at ${company}. I'm Alex, your AI interviewer today. Are you ready to begin?`);
  updateInterviewQuestion(0);
}

function addChatBubble(role, text) {
  const transcript = document.getElementById('ivTranscript');
  if (!transcript) return;
  const div = document.createElement('div');
  div.className = `chat-bubble ${role}`;
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  div.innerHTML = `<div class="cb-text">${text}</div><div class="cb-time">${time}</div>`;
  transcript.appendChild(div);
  transcript.scrollTop = transcript.scrollHeight;
}

function updateInterviewQuestion(idx) {
  const qs = state.interview.questions;
  if (idx >= qs.length) return;
  const q = qs[idx];
  document.getElementById('irQMeta').textContent = `CURRENT QUESTION (${idx + 1}/${qs.length})`;
  document.getElementById('irQText').textContent = `"${q.q}"`;
  document.getElementById('irQTags').innerHTML = q.tags.map(t => `<span class="ir-q-tag">${t}</span>`).join('');
  document.getElementById('ivProgFill').style.width = `${((idx + 1) / qs.length) * 100}%`;
  document.getElementById('ivProgLabel').textContent = `Question ${idx + 1} of ${qs.length}`;
  state.interview.currentQ = idx;
  // Show listening indicator
  setTimeout(() => {
    const transcript = document.getElementById('ivTranscript');
    const listeningDiv = document.createElement('div');
    listeningDiv.className = 'listening-indicator';
    listeningDiv.innerHTML = `<div class="listening-dots"><div class="ld-dot"></div><div class="ld-dot"></div><div class="ld-dot"></div></div> LISTENING TO YOUR RESPONSE...`;
    listeningDiv.id = 'listeningIndicator';
    transcript.appendChild(listeningDiv);
    transcript.scrollTop = transcript.scrollHeight;
  }, 500);
}

function ivNextQuestion() {
  const next = state.interview.currentQ + 1;
  const qs = state.interview.questions;
  // Remove listening indicator
  const li = document.getElementById('listeningIndicator');
  if (li) li.remove();
  // Simulate student response
  const studentResponses = [
    "Yes, I'm ready. Thank you for having me.",
    "That's a great question. In my previous project, I faced a similar challenge where I had to optimize a database query that was running 5x slower than expected. I analyzed the query plan and added proper indexing, which reduced execution time by 60%.",
    "My greatest strengths are analytical thinking and quick problem-solving. I thrive in challenging technical environments.",
    "In 5 years, I see myself as a senior software engineer working on distributed systems and cloud infrastructure at Microsoft.",
    "Yes, I'd love to know what a typical day looks like for a new engineer in this team."
  ];
  addChatBubble('student', studentResponses[state.interview.currentQ] || "Thank you for the question. I have thought about this carefully and here is my response...");
  if (next < qs.length) {
    setTimeout(() => { addChatBubble('ai', qs[next].q); updateInterviewQuestion(next); }, 1000);
  } else {
    setTimeout(() => {
      addChatBubble('ai', "Thank you for your time today! That concludes our interview. You performed very well. We will now generate your AI performance report.");
      setTimeout(() => confirmEndInterview(), 2000);
    }, 1000);
  }
}

function switchIVTab(btn, tab) {
  document.querySelectorAll('.ir-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  const transcript = document.getElementById('ivTranscript');
  if (tab === 'notes') transcript.innerHTML = '<div style="padding:20px;color:var(--text-2);font-size:13px"><textarea style="width:100%;height:200px;border:1px solid var(--border);border-radius:8px;padding:12px;font-size:13px;resize:none;font-family:inherit" placeholder="Take interview notes here..."></textarea></div>';
  else initInterviewChat();
}

function toggleMic() {
  state.interview.micActive = !state.interview.micActive;
  const btn = document.getElementById('micBtn');
  btn.className = `iv-ctrl-btn ${state.interview.micActive ? 'active' : 'muted'}`;
  showToast(state.interview.micActive ? 'Microphone unmuted' : 'Microphone muted', state.interview.micActive ? 'success' : 'warning');
}

function toggleCam() {
  state.interview.camActive = !state.interview.camActive;
  const btn = document.getElementById('camBtn');
  btn.classList.toggle('active', state.interview.camActive);
  showToast(state.interview.camActive ? 'Camera on' : 'Camera off', state.interview.camActive ? 'success' : 'warning');
}

function confirmEndInterview() {
  clearInterval(state.interview.timerInterval);
  closeModal();
  showScreen('interview-report');
  document.getElementById('reportSubtitle').textContent = `Mock Interview for Software Engineer Role at ${state.interview.company}`;
  initQAFeedback();
  setTimeout(initInterviewRadarChart, 400);
}

function initQAFeedback() {
  const el = document.getElementById('qaFeedback');
  if (!el) return;
  el.innerHTML = QA_FEEDBACK.map((item, i) => `
    <div class="qa-item">
      <div class="qa-q">
        <div class="qa-q-num">${i + 1}</div>
        ${item.q}
        <span class="star-badge ${item.star}">${item.star === 'pass' ? '✓ Strong' : item.star === 'partial' ? '~ Partial' : '✗ Needs Work'}</span>
      </div>
      <div class="qa-your"><strong>Your answer:</strong> "${item.your}"</div>
      <div class="qa-feedback">💡 <strong>AI Feedback:</strong> ${item.feedback}</div>
    </div>
  `).join('');
}

function initInterviewRadarChart() {
  if (state.charts.ivRadar) state.charts.ivRadar.destroy();
  const ctx = document.getElementById('interviewRadarChart');
  if (!ctx) return;
  state.charts.ivRadar = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Technical', 'Communication', 'Confidence', 'Leadership', 'Problem Solving', 'Professionalism'],
      datasets: [{
        data: [78, 82, 85, 70, 74, 88],
        fill: true,
        backgroundColor: 'rgba(91,45,144,0.15)',
        borderColor: '#5B2D90',
        pointBackgroundColor: '#5B2D90',
        pointBorderColor: '#fff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        r: {
          min: 0, max: 100,
          ticks: { stepSize: 25, font: { size: 9 } },
          pointLabels: { font: { size: 10, family: 'Inter', weight: '600' } }
        }
      }
    }
  });
}

// ──────────────────────────────────────────────────────────────
// MODAL
// ──────────────────────────────────────────────────────────────
let _modalCallback = null;
function showModal(title, body, onConfirm, confirmText = 'Confirm') {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').textContent = body;
  document.getElementById('modalConfirm').textContent = confirmText;
  _modalCallback = onConfirm;
  document.getElementById('modalOverlay').classList.add('open');
  if (onConfirm) {
    document.getElementById('modalConfirm').onclick = () => { onConfirm(); closeModal(); };
    document.getElementById('modalConfirm').style.display = 'flex';
  } else {
    document.getElementById('modalConfirm').style.display = 'none';
  }
}
function closeModal() { document.getElementById('modalOverlay').classList.remove('open'); }

// ──────────────────────────────────────────────────────────────
// TOAST
// ──────────────────────────────────────────────────────────────
function showToast(msg, type = '') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icons = { success: '✓', error: '✗', warning: '!' };
  toast.innerHTML = `<span>${icons[type] || 'i'}</span> ${msg}`;
  container.appendChild(toast);
  toast.onclick = () => toast.remove();
  setTimeout(() => { toast.style.animation = 'toast-in 0.3s ease reverse forwards'; setTimeout(() => toast.remove(), 300); }, 4000);
}

// ──────────────────────────────────────────────────────────────
// NOTIFICATIONS
// ──────────────────────────────────────────────────────────────
function toggleNotifications() {
  document.getElementById('notifPanel').classList.toggle('open');
}
function closeNotifications() {
  document.getElementById('notifPanel')?.classList.remove('open');
}
document.addEventListener('click', (e) => {
  const panel = document.getElementById('notifPanel');
  const btn = document.getElementById('notifBtn');
  if (panel && btn && !panel.contains(e.target) && !btn.contains(e.target)) closeNotifications();
});

// ──────────────────────────────────────────────────────────────
// SIDEBAR
// ──────────────────────────────────────────────────────────────
function toggleSidebar() {
  document.getElementById('mainSidebar').classList.toggle('open');
}

// ──────────────────────────────────────────────────────────────
// TASK TOGGLE
// ──────────────────────────────────────────────────────────────
function toggleTask(el) {
  el.classList.toggle('done');
  if (el.classList.contains('done')) {
    el.innerHTML = '<svg width="10" height="10" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>';
    const tag = el.closest('.task-item').querySelector('.task-tag');
    if (tag) { tag.className = 'task-tag low'; tag.textContent = 'Done'; }
    showToast('Task completed successfully.', 'success');
  } else {
    el.innerHTML = '';
  }
}

// ──────────────────────────────────────────────────────────────
// LOGOUT
// ──────────────────────────────────────────────────────────────
function handleLogout() {
  showModal('Logout?', 'Are you sure you want to logout from Elevate Portal?', () => {
    state.isFirstLogin = true;
    showScreen('login');
    document.getElementById('studentId').value = '';
    document.getElementById('password').value = '';
    showToast('Logged out successfully.', 'success');
  });
}

// ──────────────────────────────────────────────────────────────
// ROLE INITIALIZATION & SWITCHER
// ──────────────────────────────────────────────────────────────
state.loginRole = 'student';
state.userRole = 'student';
state.companyName = 'Microsoft';
state.selectedCandidateId = null;
state.selectedJobId = null;

function setLoginRole(role) {
  state.loginRole = role;
  document.querySelectorAll('.login-tab').forEach(tab => {
    if (tab.dataset.role === role) {
      tab.classList.add('active');
      tab.style.background = 'white';
      tab.style.color = 'var(--primary)';
    } else {
      tab.classList.remove('active');
      tab.style.background = 'none';
      tab.style.color = 'rgba(255,255,255,0.6)';
    }
  });

  const title = document.getElementById('loginTitle');
  const sub = document.getElementById('loginSubtitle');
  const tip = document.getElementById('loginTip');
  const label = document.getElementById('loginIdLabel');
  const input = document.getElementById('studentId');
  const regLink = document.getElementById('regLinkContainer');

  if (role === 'student') {
    title.textContent = 'Student Login';
    sub.textContent = 'Enter your college-provided credentials to continue.';
    label.textContent = 'Student ID';
    input.placeholder = 'e.g. GHRCE2024047';
    tip.innerHTML = '<strong>Demo Login:</strong> ID <span>GHRCE2024047</span> & Pass <span>123</span>';
    regLink.style.display = 'block';
  } else if (role === 'college') {
    title.textContent = 'T&P Officer Login';
    sub.textContent = 'Enter authorized administrative email and credentials.';
    label.textContent = 'Officer Email';
    input.placeholder = 'e.g. tp@ghrce.ac.in';
    tip.innerHTML = '<strong>Demo Login:</strong> Email <span>tp@ghrce.ac.in</span> & Pass <span>admin</span>';
    regLink.style.display = 'none';
  } else if (role === 'company') {
    title.textContent = 'Recruiter Login';
    sub.textContent = 'Enter your company recruiter account credentials.';
    label.textContent = 'Recruiter Email';
    input.placeholder = 'e.g. recruiter@microsoft.com';
    tip.innerHTML = '<strong>Demo Login:</strong> Email <span>recruiter@microsoft.com</span> & Pass <span>microsoft</span>';
    regLink.style.display = 'none';
  }
}

function showRegisterModal() {
  document.getElementById('registerModalOverlay').classList.add('open');
}

function closeRegisterModal() {
  document.getElementById('registerModalOverlay').classList.remove('open');
}

async function handleRegister(e) {
  e.preventDefault();
  const id = document.getElementById('regStudentId').value.trim();
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const dept = document.getElementById('regDept').value;
  const password = document.getElementById('regPassword').value;

  const res = await db.registerStudent({
    id,
    name,
    email,
    dept,
    branch: dept === 'Engineering' ? 'Computer Science' : 'General'
  });

  if (res.success) {
    closeRegisterModal();
    showToast('Registration successful! Logging in...', 'success');
    state.student = res.student;
    setAppRole('student');
    state.isFirstLogin = true;
    setTimeout(() => { showScreen('welcome'); }, 1000);
  } else {
    showToast(res.message, 'error');
  }
}

function setAppRole(role) {
  state.userRole = role;
  const screenApp = document.getElementById('screen-app');
  screenApp.className = 'screen flex-screen';
  screenApp.classList.add(`role-${role}`);

  const sidebarAvatar = document.getElementById('sidebarAvatar');
  const sidebarName = document.getElementById('sidebarName');
  const sidebarDept = document.getElementById('sidebarDept');

  if (role === 'student') {
    sidebarAvatar.textContent = state.student.initials || 'PS';
    sidebarName.textContent = state.student.name;
    sidebarDept.textContent = `${state.student.branch.split(' ')[0]} Senior`;
  } else if (role === 'college') {
    sidebarAvatar.textContent = 'TP';
    sidebarName.textContent = 'T&P Officer';
    sidebarDept.textContent = 'GH Raisoni Admin';
  } else if (role === 'company') {
    sidebarAvatar.textContent = state.companyName.substring(0, 2).toUpperCase();
    sidebarName.textContent = 'HR Recruiter';
    sidebarDept.textContent = state.companyName;
  }
}

// ──────────────────────────────────────────────────────────────
// COLLEGE PORTAL CONTROLLERS
// ──────────────────────────────────────────────────────────────
async function initCollegeDashboard() {
  const students = await db.getStudents();
  const drives = await db.getDrives();
  
  const total = students.length;
  const placed = students.filter(s => s.appliedJobs.some(j => j.status === 'Selected' || j.status === 'Offered')).length;
  const rate = total > 0 ? ((placed / total) * 100).toFixed(1) : 0;
  
  document.getElementById('tpTotalStudents').textContent = total;
  document.getElementById('tpPlacedStudents').textContent = placed;
  document.getElementById('tpPlacedRate').textContent = `${rate}% Placement Rate`;
  document.getElementById('tpActiveDrivesCount').textContent = drives.length;
  
  const tbody = document.querySelector('#tpDrivesTable tbody');
  tbody.innerHTML = drives.map(d => `
    <tr>
      <td style="padding:10px 6px; font-weight:600">${d.company}</td>
      <td style="padding:10px 6px;">${d.date}</td>
      <td style="padding:10px 6px;">${d.dept}</td>
      <td style="padding:10px 6px;"><span class="badge-status ${d.status.toLowerCase() === 'scheduled' ? 'verified' : 'pending'}">${d.status}</span></td>
    </tr>
  `).join('');

  setTimeout(renderCollegeDeptChart, 300);
}

let _collegeDeptChart = null;
async function renderCollegeDeptChart() {
  const ctx = document.getElementById('collegeDeptChart');
  if (!ctx) return;
  if (_collegeDeptChart) _collegeDeptChart.destroy();

  const students = await db.getStudents();
  const depts = {};
  
  students.forEach(s => {
    const branch = s.branch || 'General';
    if (!depts[branch]) depts[branch] = { sum: 0, count: 0 };
    depts[branch].sum += s.readiness || 50;
    depts[branch].count++;
  });

  const labels = Object.keys(depts);
  const data = labels.map(l => Math.round(depts[l].sum / depts[l].count));

  _collegeDeptChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels.map(l => l.split(' ')[0]),
      datasets: [{
        label: 'Average Readiness Score %',
        data: data,
        backgroundColor: '#5B2D90',
        borderRadius: 6,
        barThickness: 24
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { min: 0, max: 100, grid: { color: 'rgba(0,0,0,0.05)' } },
        x: { grid: { display: false } }
      }
    }
  });
}

async function initCollegeStudents() {
  filterStudentsList();
}

async function filterStudentsList() {
  const query = document.getElementById('studentSearch').value.toLowerCase();
  const branch = document.getElementById('studentBranchFilter').value;
  const status = document.getElementById('studentResumeFilter').value;
  const minCgpa = parseFloat(document.getElementById('studentCgpaFilter').value) || 0;

  const students = await db.getStudents();
  
  const filtered = students.filter(s => {
    const matchQuery = s.name.toLowerCase().includes(query) || s.id.toLowerCase().includes(query);
    const matchBranch = branch === 'All' || s.branch === branch;
    const matchStatus = status === 'All' || s.resumeVerified === status;
    const matchCgpa = s.cgpa >= minCgpa;
    return matchQuery && matchBranch && matchStatus && matchCgpa;
  });

  const tbody = document.querySelector('#studentsTable tbody');
  tbody.innerHTML = filtered.map(s => `
    <tr style="border-bottom: 1px solid var(--border-light)">
      <td style="padding:12px 6px; font-weight:600">${s.id}</td>
      <td style="padding:12px 6px; font-weight:600">${s.name}</td>
      <td style="padding:12px 6px;">${s.branch}</td>
      <td style="padding:12px 6px;">${s.cgpa} / 10</td>
      <td style="padding:12px 6px;">
        <div style="display:flex;align-items:center;gap:10px">
          <div style="background:var(--border);border-radius:99px;width:70px;height:6px;overflow:hidden">
            <div style="background:var(--primary);width:${s.readiness}%;height:100%"></div>
          </div>
          <span>${s.readiness}%</span>
        </div>
      </td>
      <td style="padding:12px 6px;">
        <span class="badge-status ${s.resumeVerified.toLowerCase() === 'verified' ? 'verified' : s.resumeVerified.toLowerCase() === 'rejected' ? 'rejected' : 'pending'}">
          ${s.resumeVerified}
        </span>
      </td>
      <td style="text-align:right;padding:12px 6px;">
        <button class="btn-solve" onclick="reviewStudentResume('${s.id}')" style="padding:6px 12px;font-size:11px">Verify Resume</button>
      </td>
    </tr>
  `).join('');
}

async function reviewStudentResume(studentId) {
  const student = await db.getStudentById(studentId);
  if (!student) return;

  const content = `Student: ${student.name} (${student.id})\nBranch: ${student.branch} | CGPA: ${student.cgpa}\n\nResume Contents:\n"${student.resumeText || 'No resume uploaded yet.'}"`;
  
  showModal(
    'Verify Student Resume',
    content,
    async () => {
      await db.updateStudent(studentId, { resumeVerified: 'Verified' });
      showToast(`${student.name}'s resume has been verified successfully.`, 'success');
      filterStudentsList();
    },
    'Approve & Verify'
  );
  
  const overlay = document.getElementById('modalOverlay');
  const cancelBtn = overlay.querySelector('.btn-outline');
  cancelBtn.textContent = 'Reject Resume';
  cancelBtn.onclick = async () => {
    await db.updateStudent(studentId, { resumeVerified: 'Rejected' });
    showToast(`${student.name}'s resume has been rejected.`, 'warning');
    closeModal();
    filterStudentsList();
  };
}

async function initCollegeDrives() {
  const drives = await db.getDrives();
  const tbody = document.querySelector('#allDrivesListTable tbody');
  tbody.innerHTML = drives.map(d => `
    <tr style="border-bottom: 1px solid var(--border-light)">
      <td style="padding:10px 4px;font-weight:600">${d.company}</td>
      <td style="padding:10px 4px;">${d.date}</td>
      <td style="padding:10px 4px;font-weight:600;color:var(--primary)">${d.ctc || '₹3.6 LPA'}</td>
      <td style="padding:10px 4px;">CGPA ≥ ${d.minCgpa || '6.0'}</td>
      <td style="padding:10px 4px;">${d.dept}</td>
    </tr>
  `).join('');
}

async function handleScheduleDrive(e) {
  e.preventDefault();
  const company = document.getElementById('drvCompany').value.trim();
  const date = document.getElementById('drvDate').value;
  const dept = document.getElementById('drvDept').value;
  const ctc = document.getElementById('drvCtc').value.trim();
  const minCgpa = parseFloat(document.getElementById('drvCgpa').value);

  await db.scheduleDrive({ company, date, dept, ctc, minCgpa });
  e.target.reset();
  showToast(`Successfully scheduled drive for ${company}!`, 'success');
  initCollegeDrives();
}

async function initCollegeAssessments() {
  const asms = await db.getAssessments();
  const tbody = document.querySelector('#allAssessmentsTable tbody');
  tbody.innerHTML = asms.map(a => `
    <tr style="border-bottom: 1px solid var(--border-light)">
      <td style="padding:10px 4px;font-weight:600">${a.name}</td>
      <td style="padding:10px 4px;">${a.questions}</td>
      <td style="padding:10px 4px;">${a.duration} mins</td>
      <td style="padding:10px 4px;color:var(--text-2)">${a.createdBy}</td>
    </tr>
  `).join('');
}

async function handleCreateAssessment(e) {
  e.preventDefault();
  const name = document.getElementById('asmName').value.trim();
  const duration = parseInt(document.getElementById('asmDuration').value);
  const questions = parseInt(document.getElementById('asmQuestions').value);
  const category = document.getElementById('asmCategory').value;

  await db.createAssessment({ name, duration, questions, category });
  e.target.reset();
  showToast(`Published ${name} Assessment!`, 'success');
  initCollegeAssessments();
}

// ──────────────────────────────────────────────────────────────
// COMPANY RECRUITER CONTROLLERS
// ──────────────────────────────────────────────────────────────
async function initCompanyDashboard() {
  const company = state.companyName || 'Microsoft';
  document.getElementById('comDashHeader').textContent = `Recruiter Dashboard — ${company}`;

  const allJobs = await db.getJobs();
  const companyJobs = allJobs.filter(j => j.company.toLowerCase() === company.toLowerCase());
  
  let applicantCount = 0;
  companyJobs.forEach(j => applicantCount += j.applicants.length);

  document.getElementById('comTotalJobs').textContent = companyJobs.length;
  document.getElementById('comTotalApplicants').textContent = applicantCount;

  const tbody = document.querySelector('#comActiveJobsList tbody');
  tbody.innerHTML = companyJobs.map(j => `
    <tr style="border-bottom:1px solid var(--border-light)">
      <td style="padding:10px 4px;font-weight:600">${j.role}</td>
      <td style="padding:10px 4px;font-weight:600">${j.ctc}</td>
      <td style="padding:10px 4px;">CGPA ≥ ${j.eligibility?.cgpa || '6.0'}</td>
      <td style="padding:10px 4px;font-weight:700;color:var(--primary;cursor:pointer" onclick="navigateTo('company-applicants')">${j.applicants.length} applied</td>
    </tr>
  `).join('');
}

async function initCompanyJobs() {
  const company = state.companyName || 'Microsoft';
  const allJobs = await db.getJobs();
  const companyJobs = allJobs.filter(j => j.company.toLowerCase() === company.toLowerCase());

  const tbody = document.querySelector('#allJobsListTable tbody');
  tbody.innerHTML = companyJobs.map(j => `
    <tr style="border-bottom:1px solid var(--border-light)">
      <td style="padding:10px 4px;font-weight:600">${j.role}</td>
      <td style="padding:10px 4px;">${j.ctc}</td>
      <td style="padding:10px 4px;">CGPA ≥ ${j.eligibility?.cgpa || '6.0'}</td>
      <td style="padding:10px 4px;color:var(--text-2)">${j.location}</td>
    </tr>
  `).join('');
}

async function handlePostJob(e) {
  e.preventDefault();
  const company = state.companyName || 'Microsoft';
  const role = document.getElementById('jobRole').value.trim();
  const type = document.getElementById('jobType').value;
  const ctc = document.getElementById('jobCtc').value.trim();
  const location = document.getElementById('jobLocation').value.trim();
  const cgpa = parseFloat(document.getElementById('jobCgpa').value);
  const desc = document.getElementById('jobDesc').value.trim();

  await db.postJob({
    company,
    role,
    type,
    ctc,
    location,
    desc,
    eligibility: { cgpa, branches: ['Computer Science', 'Information Technology'], backlogs: 0 }
  });

  e.target.reset();
  showToast(`Successfully posted job opening for ${role}!`, 'success');
  initCompanyJobs();
}

async function initCompanyApplicants() {
  const company = state.companyName || 'Microsoft';
  const allJobs = await db.getJobs();
  const companyJobs = allJobs.filter(j => j.company.toLowerCase() === company.toLowerCase());

  const filter = document.getElementById('applicantJobFilter');
  const currentVal = filter.value;
  filter.innerHTML = '<option value="All">All Jobs</option>' + companyJobs.map(j => `<option value="${j.id}">${j.role}</option>`).join('');
  filter.value = currentVal || 'All';

  filterApplicantsList();
}

async function filterApplicantsList() {
  const company = state.companyName || 'Microsoft';
  const jobId = document.getElementById('applicantJobFilter').value;
  const branch = document.getElementById('applicantBranchFilter').value;
  const minCgpa = parseFloat(document.getElementById('applicantCgpaFilter').value) || 0;

  const allJobs = await db.getJobs();
  const companyJobs = allJobs.filter(j => j.company.toLowerCase() === company.toLowerCase() && (jobId === 'All' || j.id === jobId));
  
  const students = await db.getStudents();
  const rowsData = [];

  companyJobs.forEach(job => {
    job.applicants.forEach(studentId => {
      const student = students.find(s => s.id === studentId);
      if (student) {
        const matchBranch = branch === 'All' || student.branch === branch;
        const matchCgpa = student.cgpa >= minCgpa;

        if (matchBranch && matchCgpa) {
          const appliedObj = student.appliedJobs.find(a => a.jobId === job.id) || { status: 'Applied' };
          rowsData.push({
            student,
            job,
            stage: appliedObj.status
          });
        }
      }
    });
  });

  const tbody = document.querySelector('#applicantsTable tbody');
  tbody.innerHTML = rowsData.map(r => `
    <tr style="border-bottom:1px solid var(--border-light)">
      <td style="padding:12px 6px;font-weight:600">${r.student.name}</td>
      <td style="padding:12px 6px;">${r.job.role}</td>
      <td style="padding:12px 6px;">${r.student.cgpa}</td>
      <td style="padding:12px 6px;">
        <div style="display:flex;align-items:center;gap:10px">
          <div style="background:var(--border);border-radius:99px;width:60px;height:5px;overflow:hidden">
            <div style="background:var(--primary);width:${r.student.readiness}%;height:100%"></div>
          </div>
          <span>${r.student.readiness}%</span>
        </div>
      </td>
      <td style="padding:12px 6px;font-weight:600;color:var(--success)">${r.student.readiness >= (r.job.eligibility?.cgpa * 10) ? 'High Match' : 'Medium Match'}</td>
      <td style="padding:12px 6px;"><span class="badge-status ${r.stage.toLowerCase()}">${r.stage}</span></td>
      <td style="text-align:right;padding:12px 6px;">
        <button class="btn-solve" onclick="evaluateCandidate('${r.student.id}', '${r.job.id}')" style="padding:6px 12px;font-size:11px">AI Insights</button>
      </td>
    </tr>
  `).join('');
}

function evaluateCandidate(studentId, jobId) {
  state.selectedCandidateId = studentId;
  state.selectedJobId = jobId;
  navigateTo('company-candidates');
}

async function initCompanyCandidate(studentId) {
  if (!studentId) {
    navigateTo('company-applicants');
    return;
  }
  const student = await db.getStudentById(studentId);
  const jobs = await db.getJobs();
  const job = jobs.find(j => j.id === state.selectedJobId);
  if (!student || !job) return;

  const appliedObj = student.appliedJobs.find(a => a.jobId === job.id) || { status: 'Applied' };

  document.getElementById('candAvatar').textContent = student.name.split(' ').map(n=>n[0]).join('');
  document.getElementById('candName').textContent = student.name;
  document.getElementById('candBranchSem').textContent = `${student.branch} • ${student.semester} • GH Raisoni College`;
  document.getElementById('candCgpa').textContent = `CGPA: ${student.cgpa}`;
  
  const verifiedEl = document.getElementById('candVerified');
  verifiedEl.textContent = student.resumeVerified === 'Verified' ? 'Verified Resume' : 'Pending Verification';
  verifiedEl.style.background = student.resumeVerified === 'Verified' ? 'rgba(34,197,94,0.25)' : 'rgba(245,158,11,0.25)';
  verifiedEl.style.color = student.resumeVerified === 'Verified' ? '#4ade80' : '#f59e0b';
  
  document.getElementById('candReadiness').textContent = `Readiness: ${student.readiness}%`;
  document.getElementById('candResumeSummary').textContent = student.resumeText || 'No resume text uploaded yet.';
  
  const weakDiv = document.getElementById('candWeakSkills');
  weakDiv.innerHTML = student.weakSkills.map(s => `<span class="tc-topic" style="background:var(--error-light);color:var(--error);border:1px solid rgba(239,68,68,0.2)">${s}</span>`).join('');

  document.getElementById('candStatusSelect').value = appliedObj.status;

  setTimeout(() => { renderCandRadarChart(student); }, 300);

  const transcriptDiv = document.getElementById('candInterviewTranscript');
  if (student.interviewHistory && student.interviewHistory.length > 0) {
    transcriptDiv.innerHTML = `
      <div style="background:rgba(91,45,144,0.06);padding:8px;border-radius:6px;border-left:3px solid var(--primary);margin-bottom:6px">
        <strong>HR Mock Interview with Alex (AI Interviewer)</strong><br>
        Score: ${student.interviewHistory[0].score}/100 | Date: ${student.interviewHistory[0].date}
      </div>
      <div style="color:var(--text-2);margin-top:6px;line-height:1.4">
        <strong>Q: Tell me about yourself.</strong><br>
        <em>"I am Priya Sharma, a B.Tech CSE student at GH Raisoni College..."</em><br>
        <strong style="color:var(--primary)">Feedback:</strong> Good structured answer. Try to connect your skills directly to the job role.
      </div>
      <div style="color:var(--text-2);margin-top:6px;line-height:1.4">
        <strong>Q: Why do you want to work at Microsoft?</strong><br>
        <em>"Microsoft is a great company with amazing culture..."</em><br>
        <strong style="color:var(--primary)">Feedback:</strong> Too generic. Research Microsoft's specific cloud initiatives.
      </div>
    `;
  } else {
    transcriptDiv.innerHTML = '<div style="color:var(--text-3);text-align:center;padding:20px 0;">No interview history recorded for this student.</div>';
  }
}

let _candRadarChart = null;
function renderCandRadarChart(student) {
  const ctx = document.getElementById('candRadarChart');
  if (!ctx) return;
  if (_candRadarChart) _candRadarChart.destroy();

  _candRadarChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Technical', 'Coding', 'Comms', 'Logical', 'System', 'OS/Net'],
      datasets: [{
        label: 'Candidate Score',
        data: [75, 70, 82, 78, 60, 50],
        fill: true,
        backgroundColor: 'rgba(91,45,144,0.15)',
        borderColor: '#5B2D90',
        pointBackgroundColor: '#5B2D90',
        borderWidth: 2
      }, {
        label: 'Industry Benchmark',
        data: [80, 80, 75, 75, 75, 75],
        fill: true,
        backgroundColor: 'rgba(212,175,55,0.06)',
        borderColor: 'rgba(212,175,55,0.5)',
        borderDash: [4, 4],
        borderWidth: 1.5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: { legend: { display: false } },
      scales: {
        r: {
          min: 0, max: 100,
          ticks: { display: false },
          grid: { color: 'rgba(0,0,0,0.06)' },
          pointLabels: { font: { size: 9, family: 'Inter', weight: '600' } }
        }
      }
    }
  });
}

async function updateCandidateStage() {
  const status = document.getElementById('candStatusSelect').value;
  const success = await db.updateApplicantStatus(state.selectedJobId, state.selectedCandidateId, status);
  if (success) {
    showToast(`Hiring pipeline stage updated to: ${status}`, 'success');
  } else {
    showToast('Failed to update pipeline stage.', 'error');
  }
}

// ──────────────────────────────────────────────────────────────
// INIT
// ──────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Force correct initial display for login screen
  const loginScreen = document.getElementById('screen-login');
  if (loginScreen) loginScreen.style.display = 'flex';
  // Hide all other screens explicitly
  ['welcome','assessment','app','test','interview','results','interview-report'].forEach(id => {
    const el = document.getElementById(`screen-${id}`);
    if (el) el.style.display = 'none';
  });
  // Set greeting
  const hour = new Date().getHours();
  const dashGreet = document.getElementById('dashGreeting');
  if (dashGreet) dashGreet.textContent = hour < 12 ? 'Good morning,' : hour < 17 ? 'Good afternoon,' : 'Good evening,';
  // Pre-select first department
  state.selectedDept = 'Engineering';
  // Add hover effect on iv radio items
  document.querySelectorAll('.iv-radio-item').forEach(item => {
    item.addEventListener('change', () => {
      document.querySelectorAll('.iv-radio-item').forEach(i => i.style.borderColor = 'var(--border)');
      item.style.borderColor = 'var(--primary)';
      item.style.background = 'var(--primary-lighter)';
    });
  });
  console.log('%cElevate Portal — GH Raisoni College', 'font-size:16px;font-weight:bold;color:#5B2D90');
  console.log('%cLogin with any Student ID and any password (min 3 chars)', 'font-size:12px;color:#6B7280');
});
