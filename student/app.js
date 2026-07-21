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
    'ai-interview': 'AI Interview', 'all-startups': 'All Startups', 'my-startup': 'Pitch My Startup', 'mentors': 'Startup Mentors',
    'profile': 'Profile', 'settings': 'Settings',
    'college-dashboard': 'T&P Dashboard', 'college-students': 'Student Monitoring',
    'college-innovation': 'Innovation Hub', 'college-companies': 'Company Relations',
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
  if (page === 'all-startups') renderAllStartupsList();
  if (page === 'learning-hub') initLearningHub();
  if (page === 'company-prep') initCompanyPrep();
  if (page === 'company-papers') initCompanyPapers();
  if (page === 'mock-tests') initMockTests();
  if (page === 'profile') initProfilePage();

  // College Portal Pages
  if (page === 'college-dashboard') initCollegeDashboard();
  if (page === 'college-students') initCollegeStudents();
  if (page === 'college-innovation') initCollegeInnovation();
  if (page === 'college-companies') initCollegeCompanies();

  // Company Recruiter Pages
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
    
    const student = await db.getStudentById(id);
    if (student && pw.length >= 3) {
      state.student = student;
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
  }, 1200);
}

// ──────────────────────────────────────────────────────────────
// ONBOARDING & ASSESSMENT LOGIC
// ──────────────────────────────────────────────────────────────
function startAssessment() {
  const dept = state.student?.dept || 'Engineering';
  state.assessment.currentQ = 0;
  state.assessment.answers = {};
  state.assessment.flagged = new Set();
  state.assessment.timer = 45 * 60;
  state.assessment.totalQ = (ASSESSMENT_QUESTIONS[dept] || ASSESSMENT_QUESTIONS.Engineering).length;
  
  const deptEl = document.getElementById('atbDept');
  if (deptEl) deptEl.textContent = `${dept} Assessment`;
  
  showScreen('assessment');
  buildPalette();
  renderQuestion();
  startAssessmentTimer();
}

function buildPalette() {
  const palette = document.getElementById('qPalette');
  if (!palette) return;
  palette.innerHTML = '';
  const total = state.assessment.totalQ;
  for (let i = 0; i < total; i++) {
    const btn = document.createElement('button');
    btn.className = `q-num${i === 0 ? ' current' : ''}`;
    btn.textContent = i + 1;
    btn.onclick = () => {
      state.assessment.currentQ = i;
      renderQuestion();
    };
    palette.appendChild(btn);
  }
}

function updatePalette() {
  const btns = document.querySelectorAll('#qPalette .q-num');
  btns.forEach((btn, i) => {
    btn.className = 'q-num';
    if (i === state.assessment.currentQ) {
      btn.classList.add('current');
    } else if (state.assessment.flagged.has(i)) {
      btn.classList.add('flagged');
    } else if (state.assessment.answers[i] !== undefined) {
      btn.classList.add('answered');
    }
  });
}

function renderQuestion() {
  const { currentQ, answers } = state.assessment;
  const dept = state.student?.dept || 'Engineering';
  const questions = ASSESSMENT_QUESTIONS[dept] || ASSESSMENT_QUESTIONS.Engineering;
  const q = questions[currentQ];
  if (!q) return;

  const sectionLabel = document.getElementById('qSectionLabel');
  const countLabel = document.getElementById('qCount');
  const qText = document.getElementById('qText');
  const qOptions = document.getElementById('qOptions');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const progressFill = document.getElementById('assessmentProgressFill');

  if (sectionLabel) sectionLabel.textContent = q.section;
  if (countLabel) countLabel.textContent = `Question ${currentQ + 1} of ${questions.length}`;
  if (qText) qText.textContent = q.q;

  if (qOptions) {
    qOptions.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];
    q.opts.forEach((opt, idx) => {
      const div = document.createElement('div');
      div.className = `q-option${answers[currentQ] === idx ? ' selected' : ''}`;
      div.innerHTML = `<div class="option-letter">${letters[idx]}</div><div class="option-text">${opt}</div>`;
      div.onclick = () => {
        state.assessment.answers[currentQ] = idx;
        renderQuestion();
        updatePalette();
      };
      qOptions.appendChild(div);
    });
  }

  if (prevBtn) prevBtn.disabled = currentQ === 0;
  if (nextBtn) {
    if (currentQ === questions.length - 1) {
      nextBtn.innerHTML = `Finish <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>`;
    } else {
      nextBtn.innerHTML = `Next <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>`;
    }
  }

  if (progressFill) {
    progressFill.style.width = `${((currentQ + 1) / questions.length) * 100}%`;
  }

  updatePalette();
}

function nextQuestion() {
  const dept = state.student?.dept || 'Engineering';
  const total = (ASSESSMENT_QUESTIONS[dept] || ASSESSMENT_QUESTIONS.Engineering).length;
  if (state.assessment.currentQ < total - 1) {
    state.assessment.currentQ++;
    renderQuestion();
  } else {
    confirmSubmitAssessment();
  }
}

function prevQuestion() {
  if (state.assessment.currentQ > 0) {
    state.assessment.currentQ--;
    renderQuestion();
  }
}

// ──────────────────────────────────────────────────────────────
// BACKEND SYNC AND WIDGETS
// ──────────────────────────────────────────────────────────────
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

async function submitAssessment() {
  clearInterval(state.assessment.timerInterval);
  closeModal();
  
  // Grade the assessment
  const dept = state.student.dept || 'Engineering';
  const questions = ASSESSMENT_QUESTIONS[dept] || ASSESSMENT_QUESTIONS.Engineering;
  let correct = 0;
  const answers = state.assessment.answers;
  const weakSections = new Set();
  
  questions.forEach((q, idx) => {
    if (answers[idx] === q.ans) {
      correct++;
    } else {
      // Add the section to weak areas if they got it wrong or didn't answer
      weakSections.add(q.section);
    }
  });
  
  // Calculate readiness score: base 40% + (correct / total) * 60%
  const score = Math.round(40 + (correct / questions.length) * 60);
  const weakSkills = Array.from(weakSections);
  
  // Save to database
  const updatedStudent = await db.updateStudent(state.student.id, {
    readiness: score,
    weakSkills: weakSkills.length > 0 ? weakSkills : ['None']
  });
  
  if (updatedStudent) {
    state.student = updatedStudent;
  }
  
  state.isFirstLogin = false;
  showToast(`Assessment submitted! Your Placement Readiness is now ${score}%.`, 'success');
  setTimeout(() => { enterApp(); }, 1500);
}

function enterApp() {
  showScreen('app');
  const el = document.getElementById('screen-app');
  el.style.display = 'flex';
  
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning,' : hour < 17 ? 'Good afternoon,' : 'Good evening,';
  
  // Set greetings
  const greetText = document.getElementById('dashGreetingText');
  if (greetText) greetText.textContent = greet;
  const greetEl = document.getElementById('dashGreeting');
  if (greetEl) greetEl.textContent = greet;
  
  // Dynamic names
  const dashName = document.getElementById('dashStudentName');
  if (dashName) dashName.textContent = state.student.name.split(' ')[0] + '.';
  const dashHeroName = document.getElementById('dashReadinessStudentName');
  if (dashHeroName) dashHeroName.textContent = state.student.name;
  const dashBranch = document.getElementById('dashStudentBranch');
  if (dashBranch) dashBranch.textContent = `${state.student.branch} • ${state.student.semester}`;
  
  // Dynamic metrics
  const targetCompany = document.getElementById('dashTargetCompany');
  if (targetCompany) targetCompany.textContent = state.student.targetCompany || 'TCS / Infosys';
  const rank = document.getElementById('dashRank');
  if (rank) rank.textContent = `#${state.student.rank || 47} / 420`;
  const readinessVal = document.getElementById('dashReadinessVal');
  if (readinessVal) readinessVal.textContent = state.student.readiness;
  
  // Stats
  const todayHours = document.getElementById('dashTodayHours');
  if (todayHours) todayHours.innerHTML = `${state.student.todayHours || 2.4}<span class="text-xl text-on-surface-variant font-medium ml-1">h</span>`;
  const coursesCompleted = document.getElementById('dashCoursesCompleted');
  if (coursesCompleted) coursesCompleted.textContent = state.student.coursesCompleted || 0;
  const mockTestsCompleted = document.getElementById('dashMockTestsCompleted');
  if (mockTestsCompleted) mockTestsCompleted.textContent = state.student.mockTestsCompleted || 0;
  
  // Sidebar elements
  const sidebarReadiness = document.getElementById('sidebarReadiness');
  if (sidebarReadiness) sidebarReadiness.style.width = `${state.student.readiness}%`;
  const sidebarReadinessVal = document.getElementById('sidebarReadinessVal');
  if (sidebarReadinessVal) sidebarReadinessVal.textContent = `${state.student.readiness}%`;
  const headerReadiness = document.getElementById('headerReadiness');
  if (headerReadiness) headerReadiness.textContent = `${state.student.readiness}%`;
  
  // Initialize tasks in state if not present
  if (!state.student.tasks) {
    state.student.tasks = [
      { id: 1, title: 'Complete Arrays Module', desc: 'DSA • 45 min', priority: 'Done', done: true },
      { id: 2, title: 'Practice SQL Queries', desc: 'DBMS • 30 min', priority: 'High', done: false },
      { id: 3, title: 'TCS Mock Test #3', desc: '90 min • 60 questions', priority: 'Medium', done: false },
      { id: 4, title: 'Review Aptitude Mistakes', desc: '20 questions', priority: 'Low', done: false }
    ];
  }
  
  animateReadiness();
  setTimeout(initHeatmap, 300);
  renderDashTasks();
  renderDashWeakSkills();
}

function animateReadiness() {
  const circle = document.getElementById('readinessFillCircle');
  if (circle) {
    const r = 38, circ = 2 * Math.PI * r;
    const offset = circ - (state.student.readiness / 100) * circ;
    setTimeout(() => { circle.style.strokeDashoffset = offset; }, 400);
  }
  
  const dashCircle = document.getElementById('dashReadinessCircle');
  if (dashCircle) {
    const r = 45, circ = 2 * Math.PI * r;
    const offset = circ - (state.student.readiness / 100) * circ;
    setTimeout(() => { dashCircle.style.strokeDashoffset = offset; }, 400);
  }
}

function renderDashTasks() {
  const list = document.getElementById('dashTaskList');
  if (!list) return;
  const tasks = state.student.tasks || [];
  
  list.innerHTML = tasks.map(t => {
    const doneClass = t.done ? 'line-through opacity-60' : 'font-bold';
    const tagColor = t.done ? 'bg-surface-variant text-on-surface-variant'
      : t.priority === 'High' ? 'bg-red-100 text-red-700 border-red-200 shadow-sm'
      : t.priority === 'Medium' ? 'bg-orange-100 text-orange-700 border-orange-200 shadow-sm'
      : 'bg-white text-on-surface-variant border border-outline-variant shadow-sm';
    
    return `
      <li class="flex items-start">
        <div class="mt-0.5 w-5 h-5 rounded-full shrink-0 mr-4 shadow-sm cursor-pointer flex items-center justify-center transition-all ${
          t.done ? 'bg-primary text-white border border-primary' : 'border-2 border-primary bg-white'
        }" onclick="toggleDashTask(${t.id})">
          ${t.done ? '<svg width="10" height="10" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
        </div>
        <div class="flex-1">
          <p class="text-sm text-on-surface ${doneClass}">${t.title}</p>
          <p class="text-xs text-on-surface-variant font-label mt-1 font-medium">${t.desc}</p>
        </div>
        <span class="px-2 py-1 rounded-md text-[10px] font-bold font-label uppercase tracking-widest shadow-sm ${tagColor}">${t.priority}</span>
      </li>
    `;
  }).join('') || '<div class="text-xs text-on-surface-variant p-4 text-center">No tasks for today. Add one below!</div>';
}

async function toggleDashTask(id) {
  const task = state.student.tasks.find(t => t.id === id);
  if (task) {
    task.done = !task.done;
    task.priority = task.done ? 'Done' : 'High';
    
    let bonus = 0;
    if (task.done) {
      bonus = 2;
      showToast('Task completed! Readiness +2%', 'success');
    } else {
      bonus = -2;
      showToast('Task uncompleted.', 'warning');
    }
    
    state.student.readiness = Math.min(100, Math.max(40, state.student.readiness + bonus));
    
    await db.updateStudent(state.student.id, {
      tasks: state.student.tasks,
      readiness: state.student.readiness
    });
    
    const val = document.getElementById('dashReadinessVal');
    if (val) val.textContent = state.student.readiness;
    const sidebarVal = document.getElementById('sidebarReadinessVal');
    if (sidebarVal) sidebarVal.textContent = `${state.student.readiness}%`;
    const sidebarFill = document.getElementById('sidebarReadiness');
    if (sidebarFill) sidebarFill.style.width = `${state.student.readiness}%`;
    
    animateReadiness();
    renderDashTasks();
  }
}

async function addNewTask() {
  const input = document.getElementById('newTaskInput');
  if (!input || !input.value.trim()) return;
  const title = input.value.trim();
  
  const newTask = {
    id: Date.now(),
    title: title,
    desc: 'Self Study',
    priority: 'High',
    done: false
  };
  
  state.student.tasks.push(newTask);
  input.value = '';
  
  await db.updateStudent(state.student.id, {
    tasks: state.student.tasks
  });
  
  renderDashTasks();
  showToast('New custom task added.', 'success');
}

function renderDashWeakSkills() {
  const container = document.getElementById('dashWeakSkills');
  if (!container) return;
  const weakSkills = state.student.weakSkills || [];
  
  const mockPercentages = {
    'Operating Systems': 32,
    'Computer Networks': 38,
    'Verbal Communication': 45,
    'System Design': 48,
    'Quantitative Aptitude': 58,
    'DBMS': 50,
    'Programming': 55,
    'DSA': 42,
    'Logical Reasoning': 47,
    'Technical Aptitude': 40
  };
  
  container.innerHTML = weakSkills.map(skill => {
    const pct = mockPercentages[skill] || Math.floor(Math.random() * 20 + 35);
    const colorClass = pct < 40 ? 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]'
      : pct < 50 ? 'bg-orange-400 shadow-[0_0_5px_rgba(251,146,60,0.5)]'
      : 'bg-yellow-400 shadow-[0_0_5px_rgba(250,204,21,0.5)]';
    const textClass = pct < 40 ? 'text-red-600' : pct < 50 ? 'text-orange-500' : 'text-yellow-600';
    
    return `
      <div>
        <div class="flex justify-between text-sm mb-2 font-label">
          <span class="font-bold text-on-surface">${skill}</span>
          <span class="font-extrabold ${textClass}">${pct}%</span>
        </div>
        <div class="w-full bg-white rounded-full h-2 shadow-inner border border-outline-variant">
          <div class="${colorClass} h-2 rounded-full" style="width: ${pct}%"></div>
        </div>
      </div>
    `;
  }).join('') || '<div class="text-xs text-on-surface-variant p-4 text-center">No weak skills identified. Great job!</div>';
}

function initHeatmap() {
  const table = document.getElementById('ghHeatmapTable');
  if (!table) return;

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const DAY_LABELS = ['','Mon','','Wed','','Fri',''];
  const levels = ['l0','l0','l1','l1','l2','l3','l4'];

  // Generate 1 year of dates ending today
  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - 365);

  // Align start to the nearest preceding Sunday
  start.setDate(start.getDate() - start.getDay());

  // Build date grid (columns = weeks, rows = 0-6 Sun-Sat)
  const weeks = [];
  const d = new Date(start);
  while (d <= today) {
    const week = [];
    for (let dow = 0; dow < 7; dow++) {
      const cellDate = new Date(d);
      cellDate.setDate(d.getDate() + dow);
      if (cellDate <= today) {
        const lvl = Math.random() < 0.3 ? 'l0' : levels[Math.floor(Math.random() * levels.length)];
        const hrs = Math.floor(Math.random() * 5);
        week.push({ date: new Date(cellDate), lvl, hrs });
      } else {
        week.push(null);
      }
    }
    weeks.push(week);
    d.setDate(d.getDate() + 7);
  }

  // Build month header row
  let monthRow = '<tr><td class="gh-day-label"></td>';
  let lastMonth = -1;
  for (let w = 0; w < weeks.length; w++) {
    const firstValid = weeks[w].find(c => c !== null);
    if (firstValid && firstValid.date.getMonth() !== lastMonth) {
      lastMonth = firstValid.date.getMonth();
      // Count how many consecutive weeks share this month
      let span = 0;
      for (let ww = w; ww < weeks.length; ww++) {
        const fv = weeks[ww].find(c => c !== null);
        if (fv && fv.date.getMonth() === lastMonth) span++;
        else break;
      }
      monthRow += `<td class="gh-month-cell" colspan="${span}">${MONTHS[lastMonth]}</td>`;
      w += span - 1; // skip spanned weeks
    } else {
      monthRow += '<td></td>';
    }
  }
  monthRow += '</tr>';

  // Build 7 day-rows
  let bodyRows = '';
  for (let dow = 0; dow < 7; dow++) {
    bodyRows += `<tr><td class="gh-day-label">${DAY_LABELS[dow]}</td>`;
    for (let w = 0; w < weeks.length; w++) {
      const cell = weeks[w][dow];
      if (cell) {
        const dateStr = `${MONTHS[cell.date.getMonth()]} ${cell.date.getDate()}`;
        const tooltip = `${cell.hrs}h studied on ${dateStr}`;
        bodyRows += `<td><div class="gh-cell ${cell.lvl}" data-tooltip="${tooltip}"></div></td>`;
      } else {
        bodyRows += '<td></td>';
      }
    }
    bodyRows += '</tr>';
  }

  table.innerHTML = monthRow + bodyRows;
}

function initSkillReport() {
  initHeatmap(); // Initialize the GitHub-style heatmap

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

function initRoadmap() {
  const container = document.getElementById('roadmapIsoContainer');
  if (!container) return;

  const points = [
    { x: 150, y: 150, align: 'right' },
    { x: 400, y: 300, align: 'right' },
    { x: 650, y: 180, align: 'right' },
    { x: 900, y: 380, align: 'right' },
    { x: 1150, y: 220, align: 'left' },
    { x: 1320, y: 400, align: 'left' }
  ];

  // Extended smooth winding path going through the points
  const pathD = `M 50,100 S 150,150 150,150 S 250,250 400,300 S 550,150 650,180 S 750,400 900,380 S 1050,200 1150,220 S 1250,450 1320,400 S 1380,420 1450,400`;

  let nodesHtml = '';
  ROADMAP_ITEMS.forEach((item, i) => {
    const pt = points[i] || {x:0, y:0, align:'right'};
    const isLocked = item.status === 'locked';
    const isDone = item.status === 'done';
    
    let pinColor = '#7c3aed'; // Purple
    if (isDone) pinColor = '#16a34a'; // Green
    if (isLocked) pinColor = '#94a3b8'; // Gray

    const cardAlign = pt.align === 'right' ? 'right-side' : 'left-side';

    nodesHtml += `
      <div class="rm-iso-node ${isLocked ? 'locked' : ''}" style="left: ${pt.x}px; top: ${pt.y}px;">
        <!-- Default Label -->
        <div class="rm-iso-label">${item.title}</div>
        
        <!-- 3D Base -->
        <svg class="rm-iso-base" width="50" height="35" viewBox="0 0 50 35" style="position:absolute; transform:translate(-50%, -50%); top:15px; left:0;">
          <path d="M 5,10 v 15 a 20,10 0 0,0 40,0 v -15 z" fill="#f59e0b"/>
          <ellipse cx="25" cy="10" rx="20" ry="10" fill="#fcd34d"/>
          <ellipse cx="25" cy="10" rx="8" ry="4" fill="#fff"/>
        </svg>
        <!-- Pin -->
        <div class="rm-iso-pin" style="position:absolute; transform:translate(-50%, -100%); top:-5px; left:0;">
          <svg width="32" height="42" viewBox="0 0 24 30" fill="none">
            <path d="M12 0C5.373 0 0 5.373 0 12c0 8 12 18 12 18s12-10 12-18c0-6.627-5.373-12-12-12z" fill="${pinColor}"/>
            <circle cx="12" cy="12" r="5" fill="#fff"/>
            ${isDone ? '<path d="M9 12l2 2 4-4" stroke="'+pinColor+'" stroke-width="2" stroke-linecap="round"/>' : ''}
            ${isLocked ? '<rect x="9" y="10" width="6" height="4" rx="1" fill="'+pinColor+'"/><path d="M10 10V8a2 2 0 014 0v2" stroke="'+pinColor+'" stroke-width="1.5"/>' : ''}
          </svg>
        </div>
        
        <!-- Detailed Content Card -->
        <div class="rm-iso-card ${cardAlign}">
          <div class="rm-iso-card-top">
            <div class="rm-iso-card-title">${item.title}</div>
            <span class="rm-iso-badge ${item.status}">${item.status === 'done' ? '✓ Completed' : item.status === 'current' ? '▶ In Progress' : item.status === 'locked' ? '🔒 Locked' : '◷ Upcoming'}</span>
          </div>
          <div style="font-size:11px; color:var(--primary); font-weight:600; margin-bottom:8px;">${item.week}</div>
          <div class="rm-iso-card-desc">${item.desc}</div>
          <div class="rm-iso-topics">
            ${item.topics.map(t => `<span class="rm-iso-topic">${t}</span>`).join('')}
          </div>
          ${!isLocked ? `<div class="rm-iso-progress"><div class="rm-iso-prog-fill" style="width:${item.progress}%"></div></div>` : ''}
        </div>
      </div>
    `;
  });

  container.innerHTML = `
    <svg class="rm-iso-svg" viewBox="0 0 1500 500" preserveAspectRatio="xMidYMid meet">
      <!-- 3D Path Shadow/Extrusion -->
      <path d="${pathD}" fill="none" stroke="#4c1d95" stroke-width="40" stroke-linecap="round" stroke-linejoin="round" transform="translate(0, 15)"/>
      <!-- Main Path -->
      <path d="${pathD}" fill="none" stroke="#7c3aed" stroke-width="40" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- Inner Lines -->
      <path d="${pathD}" fill="none" stroke="#a78bfa" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" transform="translate(10, 0)"/>
      <path d="${pathD}" fill="none" stroke="#a78bfa" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" transform="translate(-10, 0)"/>
    </svg>
    ${nodesHtml}
  `;

  // Initialize the achievements grid below the roadmap
  initAchievements();
}

// ──────────────────────────────────────────────────────────────
// ACHIEVEMENTS GRID LOGIC
// ──────────────────────────────────────────────────────────────
const BADGES = [
  { id: 1, name: 'First Login', sub: 'Joined the portal', date: 'Oct 12, 2024', locked: false, icon: '🚀', points: '1,500 lifetime points' },
  { id: 2, name: 'Assessed', sub: 'Completed skill gap test', date: 'Oct 13, 2024', locked: false, icon: '🎯', points: '2,000 lifetime points' },
  { id: 3, name: 'DSA Beginner', sub: 'Arrays & Strings done', date: 'Oct 20, 2024', locked: false, icon: '🧩', points: '5,000 lifetime points' },
  { id: 4, name: 'First Test', sub: 'Attempted first mock', date: 'Nov 02, 2024', locked: false, icon: '📝', points: '4,500 lifetime points' },
  { id: 5, name: 'Interview Ready', sub: 'Score 80%+ in all areas', date: 'Locked', locked: true, icon: '🎙️', points: '10,000 lifetime points' },
  { id: 6, name: 'Placement Champ', sub: 'Get placed successfully', date: 'Locked', locked: true, icon: '🏆', points: '50,000 lifetime points' },
  { id: 7, name: 'Consistency', sub: '30 Day Streak', date: 'Locked', locked: true, icon: '🔥', points: '3,000 lifetime points' },
  { id: 8, name: 'Top 10%', sub: 'Rank in top 10% of batch', date: 'Locked', locked: true, icon: '⭐', points: '8,000 lifetime points' }
];

function initAchievements() {
  const container = document.getElementById('achievementsGrid');
  if (!container) return;

  container.innerHTML = BADGES.map(badge => `
    <div class="achv-card ${badge.locked ? 'locked' : ''}">
      <div class="achv-img-wrap">
        <div class="achv-img-inner">${badge.icon}</div>
      </div>
      <div class="achv-info">
        <div class="achv-title">${badge.name}</div>
        <div class="achv-points">${badge.points}</div>
        <div class="achv-date">${badge.locked ? 'Locked' : 'Earned ' + badge.date}</div>
      </div>
    </div>
  `).join('');
}

function getCourseVideos(courseId) {
  const topics = [
    { title: "Introduction & Fundamentals", desc: "Get started with the basic concepts.", dur: "15:00" },
    { title: "Core Architecture & Deep Dive", desc: "Understanding the underlying mechanics.", dur: "45:30" },
    { title: "Advanced Problem Solving", desc: "Applying theory to real-world scenarios.", dur: "1:20:00" }
  ];
  
  return topics.map((t, i) => {
    let statusHtml = `<div class="lh-video-status watch-now" onclick="openCoursePlayer(${courseId}); event.stopPropagation();">Watch Now</div>`;
    
    // Mocking video statuses for visual variety
    if (i === 0) {
      statusHtml = `<div class="lh-video-status completed">Completed</div>`;
    } else if (i === 1) {
      statusHtml = `<div class="lh-video-status paused" onclick="openCoursePlayer(${courseId}); event.stopPropagation();">12:45 / ${t.dur}</div>`;
    }
    
    return `
      <div class="lh-video-row">
        <div class="lh-video-thumb"></div>
        <div class="lh-video-info">
          <div class="lh-video-title">${t.title}</div>
          <div class="lh-video-desc">${t.desc}</div>
        </div>
        ${statusHtml}
      </div>
    `;
  }).join('');
}

function toggleLHDropdown(id) {
  const card = document.getElementById(`lh-card-${id}`);
  if (card) card.classList.toggle('open');
}

function initLearningHub(filter = 'all', search = '') {
  const list = document.getElementById('coursesList');
  if (!list) return;
  let courses = COURSES.filter(c =>
    (filter === 'all' || c.cat === filter) &&
    (!search || c.title.toLowerCase().includes(search.toLowerCase()))
  );
  list.innerHTML = courses.map(c => `
    <div class="lh-subject-card" id="lh-card-${c.id}">
      <div class="lh-subject-header" onclick="toggleLHDropdown(${c.id})">
        <div class="lh-subject-thumb" style="background:${c.bg}">
          ${c.icon}
        </div>
        <div class="lh-subject-info">
          <div class="lh-subject-title">${c.title}</div>
          <div class="lh-subject-meta">
            <span class="lh-subject-badge">Bestseller</span>
            <span class="lh-subject-rating">${c.rating} ⭐</span>
            <span>👥 ${(c.lessons * 1234).toLocaleString()}</span>
            <span>⏱ ${c.duration}</span>
            <span>Updated: 12/2025</span>
          </div>
        </div>
        <div class="lh-subject-right">
          <div class="lh-subject-toggle">▼</div>
        </div>
      </div>
      <div class="lh-video-dropdown">
        ${getCourseVideos(c.id)}
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

let activeCompanyFilter = null;
const TOP_RECRUITERS = ['Microsoft', 'Google', 'Amazon', 'Adobe', 'Infosys', 'TCS'];

function toggleCompanyPrepExpand(e) {
  if (e) e.stopPropagation();
  const navItem = document.querySelector('.expandable-nav[data-page="company-prep"]');
  const submenu = document.getElementById('companyPrepSubmenu');
  const chevron = navItem?.querySelector('.chevron-icon');
  
  if (submenu && navItem) {
    if (submenu.classList.contains('open')) {
      submenu.classList.remove('open');
      if (chevron) chevron.classList.remove('rotated');
    } else {
      submenu.classList.add('open');
      if (chevron) chevron.classList.add('rotated');
    }
  }
  navigateTo('company-prep');
}

function scrollToPrepSection(sectionId) {
  if (state.currentPage !== 'company-prep') {
    navigateTo('company-prep');
  }
  setTimeout(() => {
    const section = document.getElementById('section-' + sectionId);
    if (section) {
      const headerHeight = 80;
      const yOffset = -headerHeight;
      const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
      document.querySelectorAll('.nav-subitem').forEach(el => el.classList.remove('active'));
      document.querySelector(`.nav-subitem[data-section="${sectionId}"]`)?.classList.add('active');
    }
  }, 100);
}

document.addEventListener('DOMContentLoaded', () => {
  window.addEventListener('scroll', () => {
    if (state.currentPage !== 'company-prep') return;
    const sections = document.querySelectorAll('.scroll-spy-section');
    let currentSection = '';
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 120) {
        currentSection = section.id.replace('section-', '');
      }
    });
    document.querySelectorAll('.nav-subitem').forEach(el => {
      el.classList.toggle('active', el.dataset.section === currentSection);
    });
  });
});

async function initCompanyPrep() {
  const list = document.getElementById('recruitersGrid');
  if (!list) return;
  const jobs = await db.getJobs();
  
  let recruiters = jobs.filter(j => TOP_RECRUITERS.includes(j.company));
  if (recruiters.length < 6) recruiters = [...recruiters, ...jobs.filter(j => !TOP_RECRUITERS.includes(j.company))].slice(0, 6);
  
  list.innerHTML = recruiters.map((j) => `
    <div class="recruiter-card ${activeCompanyFilter === j.company ? 'active' : ''}" onclick="selectCompanyJob(this,'${j.id}','${j.company}')">
      <div class="rc-logo">${j.logo || j.company.substring(0,3).toUpperCase()}</div>
      <div class="rc-info-wrap">
        <div class="rc-name">${j.company}</div>
        <div class="rc-role">${j.role}</div>
        <span class="rc-badge">OPEN / ACTIVE</span>
      </div>
    </div>
  `).join('');
  
  if (!activeCompanyFilter) {
    const detailContainer = document.getElementById('companyDetailContainer');
    if (detailContainer) {
      detailContainer.style.display = 'none';
      detailContainer.style.opacity = '0';
    }
  }

  initCompanyPapers();
  initMockTests();
}

async function selectCompanyJob(el, jobId, companyName) {
  activeCompanyFilter = companyName;
  document.querySelectorAll('.recruiter-card').forEach(i => i.classList.remove('active'));
  el.classList.add('active');

  const jobs = await db.getJobs();
  const job = jobs.find(j => j.id === jobId);
  if (job) await renderCompanyJobDetail(job);

  document.getElementById('clearPapersFilterBtn').style.display = 'inline-flex';
  document.getElementById('clearTestsFilterBtn').style.display = 'inline-flex';

  initCompanyPapers();
  filterMockTests();
}

function clearCompanyFilter(keepDropdowns = false) {
  activeCompanyFilter = null;
  document.querySelectorAll('.recruiter-card').forEach(i => i.classList.remove('active'));
  
  const detailContainer = document.getElementById('companyDetailContainer');
  if (detailContainer) {
    detailContainer.style.opacity = '0';
    setTimeout(() => detailContainer.style.display = 'none', 400);
  }

  document.getElementById('clearPapersFilterBtn').style.display = 'none';
  document.getElementById('clearTestsFilterBtn').style.display = 'none';

  initCompanyPapers();
  
  if (!keepDropdowns) {
    const diffFilter = document.getElementById('testDifficultyFilter');
    const subjFilter = document.getElementById('testSubjectFilter');
    if(diffFilter) diffFilter.value = 'all';
    if(subjFilter) subjFilter.value = 'all';
  }
  
  filterMockTests();
}

async function renderCompanyJobDetail(j) {
  const panel = document.getElementById('companyDetailContainer');
  if (!panel) return;
  
  const studentId = state.student?.id || 'GHRCE2024047';
  const student = await db.getStudentById(studentId);
  const eligible = student ? student.cgpa >= (j.eligibility?.cgpa || 6.0) : false;
  
  panel.innerHTML = `
    <div class="hero-card">
      <div class="hero-header">
        <div class="hero-logo">${j.logo || j.company.substring(0,3).toUpperCase()}</div>
        <div>
          <div class="hero-title">${j.company}</div>
          <div style="font-size: 16px; color: var(--text-2); margin-bottom: 8px;">${j.role} • <span style="color:#16a34a; font-weight:700;">Hiring Active</span></div>
          <div style="font-size: 14px;">${j.desc}</div>
          <div class="hero-tags">
            <span class="hero-tag">CTC: ${j.ctc}</span>
            <span class="hero-tag">${j.location}</span>
            <span class="hero-tag">${j.type}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="details-grid">
      <div class="detail-card">
        <h3>✅ Eligibility Criteria</h3>
        <div class="elig-item" style="display:flex;align-items:center;gap:8px;margin-top:10px;"><svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg><span>Min CGPA: <strong>${j.eligibility?.cgpa || '6.0'}</strong></span></div>
        <div class="elig-item" style="display:flex;align-items:center;gap:8px;margin-top:6px;"><svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg><span>Eligible Branches: <strong>All Allowed</strong></span></div>
        <div class="elig-item" style="display:flex;align-items:center;gap:8px;margin-top:6px;"><svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg><span>Active Backlogs: <strong>Max ${j.eligibility?.backlogs ?? '0'}</strong></span></div>
        <div class="elig-item" style="display:flex;align-items:center;gap:8px;margin-top:6px;"><svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg><span>Passing Year: <strong>2024</strong></span></div>
      </div>
      <div class="detail-card">
        <h3>🔢 Recruitment Process</h3>
        <div class="process-step"><div class="ps-num">1</div><div class="ps-info"><div class="ps-name">Online Assessment</div><div class="ps-desc">Technical & Aptitude MCQ</div></div></div>
        <div class="process-step"><div class="ps-num">2</div><div class="ps-info"><div class="ps-name">Coding Round</div><div class="ps-desc">DSA & Logic Building</div></div></div>
        <div class="process-step"><div class="ps-num">3</div><div class="ps-info"><div class="ps-name">Technical Interview</div><div class="ps-desc">Live coding</div></div></div>
        <div class="process-step"><div class="ps-num">4</div><div class="ps-info"><div class="ps-name">HR Interview</div><div class="ps-desc">Behavioral and team match</div></div></div>
      </div>
    </div>

    <div class="eligibility-match-card">
      <div class="emc-score ${eligible ? 'success' : 'error'}">${eligible ? '100%' : '0%'}</div>
      <div>
        <h3 style="font-family:'Rajdhani', sans-serif; font-size:20px; font-weight:700; margin-bottom:4px;">Eligibility Match Analysis</h3>
        <div style="font-size:14px; color:var(--text-2);">
          ${eligible 
            ? `Your CGPA (${student?.cgpa}) meets the eligibility requirement of ${j.eligibility?.cgpa || '6.0'}. You are a strong match for this position.`
            : `Your CGPA (${student?.cgpa}) does not meet the minimum criteria of ${j.eligibility?.cgpa || '6.0'} required for this opening.`
          }
        </div>
      </div>
    </div>
  `;
  panel.style.display = 'block';
  setTimeout(() => {
    panel.style.opacity = '1';
    panel.style.transform = 'translateY(0)';
  }, 50);
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

function initCompanyPapers() {
  const grid = document.getElementById('papersGrid');
  if (!grid) return;
  
  let papersToRender = PAPERS;
  if (activeCompanyFilter) {
    papersToRender = PAPERS.filter(p => p.company.toLowerCase() === activeCompanyFilter.toLowerCase());
  }

  if (papersToRender.length === 0) {
    grid.innerHTML = '<div style="padding:20px;color:var(--text-3);grid-column:1/-1;text-align:center;">No papers found for this selection.</div>';
    return;
  }

  grid.innerHTML = papersToRender.map((p, i) => `
    <div class="paper-card" style="box-shadow: 0 4px 12px rgba(0,0,0,0.02); transition: transform 0.2s; border-radius: 12px;">
      <div class="pc-top">
        <div class="pc-company">
          <div class="pc-logo">${p.logo}</div>
          <div><div class="pc-name" style="font-family:'Rajdhani',sans-serif;font-size:16px;">${p.company}</div><div class="pc-role">${p.role}</div></div>
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

function initMockTests() {
  filterMockTests();
}

function filterMockTests() {
  const list = document.getElementById('testsList');
  if (!list) return;

  const diffFilter = document.getElementById('testDifficultyFilter')?.value || 'all';
  const subjFilter = document.getElementById('testSubjectFilter')?.value || 'all';

  if (activeCompanyFilter && (diffFilter !== 'all' || subjFilter !== 'all')) {
    clearCompanyFilter(true);
    scrollToPrepSection('mock-tests');
    return;
  }

  let testsToRender = MOCK_TESTS;

  if (activeCompanyFilter) {
    testsToRender = testsToRender.filter(t => t.companyLabel.toLowerCase().includes(activeCompanyFilter.toLowerCase()));
  }

  if (diffFilter !== 'all') {
    testsToRender = testsToRender.filter(t => t.difficulty.toLowerCase() === diffFilter.toLowerCase());
  }

  if (subjFilter !== 'all') {
    testsToRender = testsToRender.filter(t => t.desc.toLowerCase().includes(subjFilter.toLowerCase()) || t.name.toLowerCase().includes(subjFilter.toLowerCase()));
  }

  if (testsToRender.length === 0) {
    list.innerHTML = '<div style="padding:20px;color:var(--text-3);width:100%;text-align:center;">No mock tests found for this selection.</div>';
    return;
  }

  list.innerHTML = testsToRender.map(t => `
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

function filterTest(btn) {}

function startTestFromPaper(company) {
  const test = MOCK_TESTS.find(t => t.company === company) || MOCK_TESTS[0];
  startMockTest(test.id, test.name, test.duration);
}

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

async function submitTest() {
  clearInterval(state.test.timerInterval);
  closeModal();
  let correct = 0;
  TEST_QUESTIONS.forEach((q, i) => { if (state.test.answers[i] === q.ans) correct++; });
  const score = Math.round((correct / TEST_QUESTIONS.length) * 100);
  const timeTaken = Math.round((state.test.timer > 0 ? (90 * 60 - state.test.timer) : 90 * 60) / 60);
  
  // Increment completed mock tests count
  state.student.mockTestsCompleted = (state.student.mockTestsCompleted || 0) + 1;
  
  // Calculate readiness bonus
  let bonus = 0;
  if (score >= 80) bonus = 5;
  else if (score >= 60) bonus = 3;
  else if (score >= 40) bonus = 1;
  
  state.student.readiness = Math.min(100, state.student.readiness + bonus);
  
  if (!state.student.testHistory) state.student.testHistory = [];
  state.student.testHistory.push({
    testName: state.test.testName,
    score: score,
    date: new Date().toISOString().split('T')[0],
    correct: correct,
    total: TEST_QUESTIONS.length,
    timeTaken: timeTaken
  });
  
  // Save to database
  const updatedStudent = await db.updateStudent(state.student.id, {
    mockTestsCompleted: state.student.mockTestsCompleted,
    readiness: state.student.readiness,
    testHistory: state.student.testHistory
  });
  if (updatedStudent) {
    state.student = updatedStudent;
  }
  
  // Update dashboard values
  const mockTestsEl = document.getElementById('dashMockTestsCompleted');
  if (mockTestsEl) mockTestsEl.textContent = state.student.mockTestsCompleted;
  const readinessEl = document.getElementById('dashReadinessVal');
  if (readinessEl) readinessEl.textContent = state.student.readiness;
  animateReadiness();
  
  showScreen('results');
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

function startInterview() {
  const companyEl = document.querySelector('input[name="ivCompany"]:checked');
  const typeEl = document.querySelector('input[name="ivType"]:checked');
  state.interview.company = companyEl ? companyEl.value : 'Microsoft';
  state.interview.type = typeEl ? typeEl.value : 'HR';
  state.interview.currentQ = 0;
  state.interview.timer = 0;
  state.interview.chatHistory = [];
  
  showToast('Starting AI Interview session...', 'info');
  
  fetch('http://localhost:5001/api/ai/interview/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      studentId: state.student.id,
      company: state.interview.company,
      interviewType: state.interview.type
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      state.interview.sessionId = data.session.sessionId;
      showScreen('interview');
      document.getElementById('ihInfo').textContent = `INTERVIEWING FOR SOFTWARE ENGINEER — ${state.interview.company.toUpperCase()}`;
      document.getElementById('ivProgType').textContent = `${state.interview.type} Round`;
      
      const transcript = document.getElementById('ivTranscript');
      if (transcript) transcript.innerHTML = '';
      
      addChatBubble('ai', data.session.firstQuestion);
      
      document.getElementById('irQMeta').textContent = `CURRENT QUESTION (1/10)`;
      document.getElementById('irQText').textContent = `"${data.session.firstQuestion}"`;
      document.getElementById('irQTags').innerHTML = `<span class="ir-q-tag">${state.interview.type}</span><span class="ir-q-tag">BEHAVIORAL</span>`;
      document.getElementById('ivProgFill').style.width = '10%';
      document.getElementById('ivProgLabel').textContent = 'Question 1 of 10';
      
      startInterviewTimer();
    } else {
      showToast('Failed to start interview: ' + (data.error || 'Unknown error'), 'error');
    }
  })
  .catch(err => {
    showToast('Failed to connect to AI Server on port 5001. Please run the AI backend.', 'error');
    console.error(err);
  });
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

function ivNextQuestion() {
  const inputEl = document.getElementById('ivResponseInput');
  if (inputEl) inputEl.value = 'Candidate skipped this question.';
  ivSubmitResponse();
}

async function ivSubmitResponse() {
  const inputEl = document.getElementById('ivResponseInput');
  if (!inputEl) return;
  const answer = inputEl.value.trim();
  if (!answer) {
    showToast('Please type a response first!', 'warning');
    return;
  }
  
  inputEl.value = '';
  addChatBubble('student', answer);
  
  const transcript = document.getElementById('ivTranscript');
  const listeningDiv = document.createElement('div');
  listeningDiv.className = 'listening-indicator';
  listeningDiv.id = 'listeningIndicator';
  listeningDiv.innerHTML = `<div class="listening-dots"><div class="ld-dot"></div><div class="ld-dot"></div><div class="ld-dot"></div></div> GENERATING AI INTERVIEWER FOLLOW-UP...`;
  transcript.appendChild(listeningDiv);
  transcript.scrollTop = transcript.scrollHeight;
  
  const submitBtn = document.getElementById('ivSubmitBtn');
  if (submitBtn) submitBtn.disabled = true;
  
  try {
    const res = await fetch('http://localhost:5001/api/ai/interview/respond', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: state.interview.sessionId,
        answer: answer
      })
    });
    const data = await res.json();
    if (listeningDiv) listeningDiv.remove();
    if (submitBtn) submitBtn.disabled = false;
    
    if (data.success) {
      const resp = data.response;
      state.interview.currentQ = resp.questionNumber - 1;
      
      if (resp.isComplete) {
        addChatBubble('ai', "Thank you for your responses today. That concludes our interview! We will now generate your AI performance report.");
        setTimeout(() => { confirmEndInterview(); }, 2000);
      } else {
        addChatBubble('ai', resp.nextQuestion);
        
        document.getElementById('irQMeta').textContent = `CURRENT QUESTION (${resp.questionNumber}/10)`;
        document.getElementById('irQText').textContent = `"${resp.nextQuestion}"`;
        document.getElementById('ivProgFill').style.width = `${Math.min(100, (resp.questionNumber / 10) * 100)}%`;
        document.getElementById('ivProgLabel').textContent = `Question ${resp.questionNumber} of 10`;
      }
    } else {
      showToast('Error getting follow-up: ' + (data.error || 'Server error'), 'error');
    }
  } catch (err) {
    if (listeningDiv) listeningDiv.remove();
    if (submitBtn) submitBtn.disabled = false;
    showToast('Failed to contact AI server.', 'error');
    console.error(err);
  }
}

function switchIVTab(btn, tab) {
  document.querySelectorAll('.ir-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  const transcript = document.getElementById('ivTranscript');
  if (tab === 'notes') {
    transcript.innerHTML = '<div style="padding:20px;color:var(--text-2);font-size:13px"><textarea style="width:100%;height:200px;border:1px solid var(--border);border-radius:8px;padding:12px;font-size:13px;resize:none;font-family:inherit" placeholder="Take interview notes here..."></textarea></div>';
  } else {
    // Reload active interview chat transcript
    transcript.innerHTML = '';
    // Note: in a fully production app, we would re-render bubbles from state.interview.chatHistory
    addChatBubble('ai', document.getElementById('irQText').textContent.replace(/"/g, ''));
  }
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

async function confirmEndInterview() {
  clearInterval(state.interview.timerInterval);
  closeModal();
  
  showToast('AI Interview ended. Generating Gemini report...', 'info');
  showScreen('interview-report');
  
  // Set loading placeholders
  document.getElementById('reportSubtitle').textContent = `Mock Interview for Software Engineer Role at ${state.interview.company} — Analyzing...`;
  document.getElementById('irOverallScoreVal').textContent = '--';
  document.getElementById('irHiringReadinessVal').textContent = '--';
  document.getElementById('irCompanyFitVal').textContent = 'Analyzing...';
  document.getElementById('irBatchRankingVal').textContent = '--';
  
  const qaFeedback = document.getElementById('qaFeedback');
  if (qaFeedback) {
    qaFeedback.innerHTML = `
      <div style="padding:40px;text-align:center;color:var(--text-2)">
        <div class="listening-dots" style="display:inline-flex;margin-bottom:12px;">
          <div class="ld-dot"></div><div class="ld-dot"></div><div class="ld-dot"></div>
        </div>
        <br>Analyzing transcript using Gemini 1.5 Flash...
      </div>
    `;
  }
  
  try {
    // 1. Get final transcript
    const endRes = await fetch('http://localhost:5001/api/ai/interview/end', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: state.interview.sessionId })
    });
    const endData = await endRes.json();
    const transcriptData = endData.success ? endData.result.transcript : [];
    
    // 2. Trigger analysis
    const analyzeRes = await fetch('http://localhost:5001/api/ai/interview/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: state.student.id,
        sessionId: state.interview.sessionId
      })
    });
    const analyzeData = await analyzeRes.json();
    
    if (analyzeData.success) {
      const a = analyzeData.analysis;
      
      document.getElementById('reportSubtitle').textContent = `Mock Interview for Software Engineer Role at ${state.interview.company}`;
      document.getElementById('irOverallScoreVal').textContent = a.overallScore;
      document.getElementById('irOverallScoreBar').style.width = `${a.overallScore}%`;
      
      document.getElementById('irHiringReadinessVal').textContent = `${a.overallScore + 2}%`;
      document.getElementById('irHiringReadinessBar').style.width = `${a.overallScore + 2}%`;
      
      document.getElementById('irCompanyFitVal').textContent = a.hiringRecommendation || 'Recommend';
      document.getElementById('irCompanyFitBar').style.width = `${a.companyFitScore || 75}%`;
      
      document.getElementById('irBatchRankingVal').textContent = `Top ${Math.max(5, 100 - a.overallScore)}%`;
      document.getElementById('irBatchRankingBar').style.width = `${a.overallScore}%`;
      
      initQAFeedback(a, transcriptData);
      initInterviewRadarChart(a);
      
      // Update student in state
      const freshStudent = await db.getStudentById(state.student.id);
      if (freshStudent) {
        state.student = freshStudent;
        const readinessEl = document.getElementById('dashReadinessVal');
        if (readinessEl) readinessEl.textContent = state.student.readiness;
        animateReadiness();
      }
      
      showToast('AI Performance Report generated!', 'success');
    } else {
      showToast('Failed to analyze interview: ' + (analyzeData.error || 'Server error'), 'error');
    }
  } catch (err) {
    showToast('Failed to connect to AI server for analysis.', 'error');
    console.error(err);
  }
}

function initQAFeedback(analysis, transcript) {
  const el = document.getElementById('qaFeedback');
  if (!el) return;
  
  const qWise = analysis?.questionWiseFeedback || [];
  const qaItems = [];
  
  const interviewerQ = transcript.filter(t => t.role === 'interviewer');
  const candidateA = transcript.filter(t => t.role === 'candidate');
  
  for (let i = 0; i < interviewerQ.length; i++) {
    const qText = interviewerQ[i]?.content || 'Question';
    const aText = candidateA[i]?.content || 'Skipped question.';
    const fb = qWise[i]?.feedback || 'Answer showed adequate understanding.';
    const quality = qWise[i]?.answerQuality || 'Good';
    const starClass = quality.toLowerCase().includes('good') || quality.toLowerCase().includes('strong') || quality.toLowerCase().includes('exceptional') ? 'pass' : 'fail';
    
    qaItems.push({
      q: qText,
      your: aText,
      feedback: fb,
      star: starClass,
      quality: quality
    });
  }
  
  el.innerHTML = qaItems.map((item, i) => `
    <div class="qa-item">
      <div class="qa-q">
        <div class="qa-q-num">${i + 1}</div>
        ${item.q}
        <span class="star-badge ${item.star}">${item.quality}</span>
      </div>
      <div class="qa-your"><strong>Your answer:</strong> "${item.your}"</div>
      <div class="qa-feedback">💡 <strong>AI Feedback:</strong> ${item.feedback}</div>
    </div>
  `).join('') || '<div class="text-xs text-on-surface-variant p-4">No QA feedback generated.</div>';
}

function initInterviewRadarChart(analysis) {
  if (state.charts.ivRadar) state.charts.ivRadar.destroy();
  const ctx = document.getElementById('interviewRadarChart');
  if (!ctx) return;
  
  const tech = analysis?.technical?.score || 70;
  const comm = analysis?.communication?.score || 72;
  const bhv = analysis?.behavioral?.score || 70;
  const overall = analysis?.overallScore || 70;
  
  state.charts.ivRadar = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Technical', 'Communication', 'Confidence', 'Leadership', 'Problem Solving', 'Professionalism'],
      datasets: [{
        data: [tech, comm, overall, bhv, tech, comm],
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
// AI RESUME ANALYZER LOGIC
// ──────────────────────────────────────────────────────────────
async function analyzeResumeText() {
  const textEl = document.getElementById('profileResumeText');
  if (!textEl) return;
  const resumeText = textEl.value.trim();
  if (!resumeText) {
    showToast('Please paste your resume text first!', 'warning');
    return;
  }
  
  const btn = document.getElementById('btnAnalyzeResume');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Scanning Resume...';
  }
  
  showToast('Analyzing resume using Gemini AI ATS scanning agents...', 'info');
  
  try {
    const res = await fetch('http://localhost:5001/api/ai/resume/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: state.student.id,
        resumeText: resumeText
      })
    });
    const data = await res.json();
    
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Analyze Resume';
    }
    
    if (data.success) {
      const rep = data.report;
      
      document.getElementById('resumeAnalysisResults').style.display = 'block';
      document.getElementById('resumeOverallScore').textContent = rep.overallResumeScore;
      
      const circle = document.getElementById('resumeScoreCircle');
      if (circle) {
        const r = 42, circ = 2 * Math.PI * r;
        circle.style.strokeDashoffset = circ - (rep.overallResumeScore / 100) * circ;
      }
      
      const verdict = document.getElementById('resumeVerdict');
      verdict.textContent = rep.atsCompatibility?.verdict || 'Partially Compatible';
      
      const vStatus = document.getElementById('resumeVerificationStatus');
      const isVerified = rep.overallResumeScore >= 75;
      if (vStatus) {
        vStatus.textContent = isVerified ? 'Verified' : 'Pending Review';
        vStatus.style.color = isVerified ? 'var(--success)' : 'var(--warning)';
      }
      
      document.getElementById('resumeSummary').textContent = rep.summary;
      
      const secContainer = document.getElementById('resumeMissingSections');
      secContainer.innerHTML = (rep.missingSections || []).map(s => 
        `<span class="px-2 py-1 bg-red-50 text-red-700 border border-red-100 rounded-md text-[10px] font-bold uppercase tracking-wider">${s}</span>`
      ).join('') || '<span class="text-xs text-green-600 font-medium">✓ None (All sections present)</span>';
      
      const kwContainer = document.getElementById('resumeMissingKeywords');
      kwContainer.innerHTML = (rep.missingKeywords || []).map(k => 
        `<span class="px-2 py-1 bg-orange-50 text-orange-700 border border-orange-100 rounded-md text-[10px] font-bold uppercase tracking-wider">${k}</span>`
      ).join('') || '<span class="text-xs text-green-600 font-medium">✓ None (Keywords aligned)</span>';
      
      const sugContainer = document.getElementById('resumeSuggestions');
      sugContainer.innerHTML = (rep.suggestions || []).map(s => `
        <div style="font-size: 12px; border-left: 3px solid var(--primary); padding-left: 10px; margin-bottom: 4px; text-align: left;">
          <strong>${s.section}:</strong> <span style="color: var(--text-2);">${s.issue}</span>
          <br>
          <span style="color: var(--primary-dark); font-weight: 500;">👉 Fix: ${s.fix}</span>
        </div>
      `).join('') || '<div class="text-xs text-green-600 font-medium">No improvement suggestions required!</div>';
      
      const revSummary = document.getElementById('resumeRevisedSummary');
      if (revSummary) {
        revSummary.textContent = rep.revisedSummaryExample || '';
      }
      
      const freshStudent = await db.getStudentById(state.student.id);
      if (freshStudent) {
        state.student = freshStudent;
      }
      
      showToast('Resume analysis complete!', 'success');
    } else {
      showToast('Failed to analyze resume: ' + (data.error || 'Server error'), 'error');
    }
  } catch (err) {
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Analyze Resume';
    }
    showToast('Failed to connect to AI server.', 'error');
    console.error(err);
  }
}

// ──────────────────────────────────────────────────────────────
// PROFILE DETAILS & EDITING LOGIC
// ──────────────────────────────────────────────────────────────
function initProfilePage() {
  const s = state.student;
  if (!s) return;
  
  const initials = s.name.split(' ').map(n => n[0]).join('').toUpperCase();
  document.getElementById('profAvatar').textContent = initials;
  document.getElementById('profStudentName').textContent = s.name;
  document.getElementById('profStudentBranch').textContent = `${s.branch} • ${s.semester} • GH Raisoni College`;
  
  document.getElementById('profTagCGPA').textContent = `CGPA: ${s.cgpa}`;
  document.getElementById('profTagRoll').textContent = `Roll: ${s.id}`;
  document.getElementById('profTagReadiness').textContent = `Readiness: ${s.readiness}%`;
  
  document.getElementById('profFullName').textContent = s.name;
  document.getElementById('profStudentId').textContent = s.id;
  document.getElementById('profEmail').textContent = s.email;
  
  document.getElementById('profDept').textContent = s.dept || 'Engineering';
  document.getElementById('profSem').textContent = s.semester;
  document.getElementById('profCGPA').textContent = `${s.cgpa} / 10`;
  
  document.getElementById('profTarget').textContent = s.targetCompany || 'TCS / Infosys';
  document.getElementById('profReadiness').textContent = `${s.readiness}%`;
  document.getElementById('profRank').textContent = `#${s.rank || 47} / 420`;
  document.getElementById('profMockTests').textContent = `${s.mockTestsCompleted || 0} Attempted`;
  
  const textEl = document.getElementById('profileResumeText');
  if (textEl && s.resumeText) {
    textEl.value = s.resumeText;
    document.getElementById('resumeWordCount').textContent = s.resumeText.split(/\s+/).length + ' words pasted';
  }
}

function openEditProfileModal() {
  document.getElementById('editProfileName').value = state.student.name;
  document.getElementById('editProfileEmail').value = state.student.email;
  document.getElementById('editProfileTarget').value = state.student.targetCompany || '';
  document.getElementById('editProfileModalOverlay').classList.add('open');
}

function closeEditProfileModal() {
  document.getElementById('editProfileModalOverlay').classList.remove('open');
}

async function saveProfileDetails(e) {
  e.preventDefault();
  const name = document.getElementById('editProfileName').value.trim();
  const email = document.getElementById('editProfileEmail').value.trim();
  const target = document.getElementById('editProfileTarget').value.trim();
  
  if (!name || !email) {
    showToast('Name and email are required!', 'warning');
    return;
  }
  
  showToast('Saving profile changes...', 'info');
  
  const updatedStudent = await db.updateStudent(state.student.id, {
    name,
    email,
    targetCompany: target
  });
  
  if (updatedStudent) {
    state.student = updatedStudent;
    initProfilePage();
    closeEditProfileModal();
    showToast('Profile updated successfully.', 'success');
  } else {
    showToast('Failed to save profile changes.', 'error');
  }
}

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

function toggleSidebar() {
  document.getElementById('mainSidebar').classList.toggle('open');
  document.getElementById('mainSidebar').classList.toggle('collapsed');
}

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

function handleLogout() {
  showModal('Logout?', 'Are you sure you want to logout from Elevate Portal?', () => {
    state.isFirstLogin = true;
    showScreen('login');
    document.getElementById('studentId').value = '';
    document.getElementById('password').value = '';
    showToast('Logged out successfully.', 'success');
  });
}

state.loginRole = 'student';
state.userRole = 'student';
state.companyName = 'Microsoft';
state.selectedCandidateId = null;
state.selectedJobId = null;



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
  state.userRole = 'student';
  const screenApp = document.getElementById('screen-app');
  screenApp.className = 'screen flex-screen role-student';

  const sidebarAvatar = document.getElementById('sidebarAvatar');
  const sidebarName = document.getElementById('sidebarName');
  const sidebarDept = document.getElementById('sidebarDept');

  sidebarAvatar.textContent = state.student.initials || 'PS';
  sidebarName.textContent = state.student.name;
  sidebarDept.textContent = `${state.student.branch.split(' ')[0]} Senior`;
}

function toggleDarkTheme(isDark) {
  if (isDark) {
    document.body.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.body.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
}

// ──────────────────────────────────────────────────────────────
// COURSE LEARNING HUB & PLAYER LOGIC
// ──────────────────────────────────────────────────────────────
const COURSE_LESSONS = {
  1: [
    { title: '1. Introduction to Data Structures', desc: 'Understanding primitive and non-primitive structures.', type: 'video' },
    { title: '2. Array Representation', desc: 'Contiguous memory layout, addressing formulas.', type: 'video' },
    { title: '3. Operations on Arrays', desc: 'Insertion, deletion, and traversal algorithms.', type: 'video' },
    { title: '4. Mini-Quiz: Arrays & Lists', type: 'quiz', questions: [
      { q: 'What is the time complexity to insert an element at the beginning of an array of size N?', opts: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'], ans: 2 },
      { q: 'Which of the following is contiguous in memory?', opts: ['Linked List', 'Array', 'Binary Tree', 'Graph'], ans: 1 }
    ]}
  ],
  2: [
    { title: '1. Introduction to Databases & DBMS', desc: 'File systems vs Database Management Systems.', type: 'video' },
    { title: '2. Relational Model Concepts', desc: 'Schemas, tables, tuples, and attributes.', type: 'video' },
    { title: '3. SQL Basics: SELECT, WHERE', desc: 'Writing basic SQL queries.', type: 'video' },
    { title: '4. Mini-Quiz: Relational Database', type: 'quiz', questions: [
      { q: 'Which key uniquely identifies a record in a table?', opts: ['Foreign Key', 'Candidate Key', 'Primary Key', 'Alternate Key'], ans: 2 },
      { q: 'Which SQL command deletes table data but keeps structure?', opts: ['DROP', 'TRUNCATE', 'DELETE', 'REMOVE'], ans: 1 }
    ]}
  ]
};

function getCourseLessons(courseId) {
  if (COURSE_LESSONS[courseId]) return COURSE_LESSONS[courseId];
  return [
    { title: '1. Introduction to Topic', desc: 'Foundations and history.', type: 'video' },
    { title: '2. Core Concepts', desc: 'Key ideas and examples.', type: 'video' },
    { title: '3. Advanced Applications', desc: 'Case studies and optimizations.', type: 'video' },
    { title: '4. Mini-Quiz: Assessment', type: 'quiz', questions: [
      { q: 'What is the primary goal of this topic?', opts: ['Efficiency', 'Accuracy', 'Speed', 'All of the above'], ans: 3 },
      { q: 'Which approach is recommended?', opts: ['Brute force', 'Structured logic', 'Random choice', 'No approach'], ans: 1 }
    ]}
  ];
}

let currentCourseId = null;
let currentLessonIdx = 0;

function openCoursePlayer(courseId) {
  const course = COURSES.find(c => c.id === courseId);
  if (!course) return;
  
  currentCourseId = courseId;
  currentLessonIdx = 0;
  
  document.getElementById('cpCourseTitle').textContent = course.title;
  document.getElementById('cpCourseInstructor').textContent = `Instructor: ${course.instructor}`;
  
  renderCourseLessons();
  document.getElementById('coursePlayerOverlay').classList.add('open');
}

function closeCoursePlayer() {
  document.getElementById('coursePlayerOverlay').classList.remove('open');
}

function renderCourseLessons() {
  const lessons = getCourseLessons(currentCourseId);
  const list = document.getElementById('cpLessonList');
  if (!list) return;
  
  list.innerHTML = lessons.map((l, idx) => {
    const activeClass = idx === currentLessonIdx ? 'border-primary bg-primary-lighter text-primary' : 'border-transparent text-on-surface';
    const isCompleted = idx < currentLessonIdx || (idx === currentLessonIdx && COURSES.find(c => c.id === currentCourseId).progress >= ((idx+1)/lessons.length)*100);
    const icon = l.type === 'quiz' ? '📝' : isCompleted ? '✅' : '▶';
    
    return `
      <div class="p-3 mb-2 rounded-xl border cursor-pointer hover:bg-surface-dim transition-all flex items-center gap-3 ${activeClass}" onclick="selectLesson(${idx})">
        <span style="font-size: 14px;">${icon}</span>
        <div style="flex: 1;">
          <div style="font-size: 12px; font-weight: 700;">${l.title}</div>
          ${l.type === 'video' ? `<div style="font-size: 10px; color: var(--text-2); margin-top: 2px;">${l.desc.substring(0,35)}...</div>` : ''}
        </div>
      </div>
    `;
  }).join('');
  
  const activeLesson = lessons[currentLessonIdx];
  if (activeLesson.type === 'video') {
    document.getElementById('cpVideoSection').style.display = 'flex';
    document.getElementById('cpQuizSection').style.display = 'none';
    
    document.getElementById('cpLessonTitle').textContent = activeLesson.title;
    document.getElementById('cpLessonDetailTitle').textContent = activeLesson.title;
    document.getElementById('cpLessonDetailTitle').nextElementSibling.textContent = activeLesson.desc;
    
    document.getElementById('cpCompleteLessonBtn').textContent = currentLessonIdx === lessons.length - 1 ? 'Finish Course' : 'Complete & Next';
  } else {
    document.getElementById('cpVideoSection').style.display = 'none';
    document.getElementById('cpQuizSection').style.display = 'flex';
    renderCourseQuiz(activeLesson);
  }
}

function selectLesson(idx) {
  currentLessonIdx = idx;
  renderCourseLessons();
}

async function completeCurrentLesson() {
  const lessons = getCourseLessons(currentCourseId);
  const course = COURSES.find(c => c.id === currentCourseId);
  if (!course) return;
  
  const nextIdx = currentLessonIdx + 1;
  const newProgress = Math.min(100, Math.round((nextIdx / lessons.length) * 100));
  
  if (newProgress > course.progress) {
    course.progress = newProgress;
    initLearningHub();
    
    if (newProgress === 100) {
      state.student.coursesCompleted = (state.student.coursesCompleted || 0) + 1;
      state.student.readiness = Math.min(100, state.student.readiness + 3);
      
      await db.updateStudent(state.student.id, {
        coursesCompleted: state.student.coursesCompleted,
        readiness: state.student.readiness
      });
      
      const coursesEl = document.getElementById('dashCoursesCompleted');
      if (coursesEl) coursesEl.textContent = state.student.coursesCompleted;
      const readinessEl = document.getElementById('dashReadinessVal');
      if (readinessEl) readinessEl.textContent = state.student.readiness;
      
      animateReadiness();
      showToast(`Congratulations! You completed ${course.title}! Readiness +3%`, 'success');
      closeCoursePlayer();
      return;
    }
  }
  
  if (nextIdx < lessons.length) {
    currentLessonIdx = nextIdx;
    renderCourseLessons();
  } else {
    closeCoursePlayer();
  }
}

function renderCourseQuiz(lesson) {
  const container = document.getElementById('cpQuizQuestions');
  if (!container) return;
  
  container.innerHTML = lesson.questions.map((q, qIdx) => `
    <div style="padding: 16px; border: 1px solid var(--border); border-radius: 8px; background: var(--bg); text-align: left;">
      <div style="font-size: 13px; font-weight: 700; color: var(--text); margin-bottom: 12px;">Q${qIdx + 1}: ${q.q}</div>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        ${q.opts.map((opt, optIdx) => `
          <label style="display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: white; border: 1px solid var(--border); border-radius: 6px; cursor: pointer; font-size: 12px; color: var(--text);">
            <input type="radio" name="cp_quiz_q_${qIdx}" value="${optIdx}" style="accent-color: var(--primary);">
            <span>${opt}</span>
          </label>
        `).join('')}
      </div>
    </div>
  `).join('');
}

async function submitCourseQuiz() {
  const lessons = getCourseLessons(currentCourseId);
  const quizLesson = lessons[currentLessonIdx];
  let correct = 0;
  
  for (let i = 0; i < quizLesson.questions.length; i++) {
    const selected = document.querySelector(`input[name="cp_quiz_q_${i}"]:checked`);
    if (!selected) {
      showToast('Please answer all questions before submitting!', 'warning');
      return;
    }
    if (parseInt(selected.value) === quizLesson.questions[i].ans) {
      correct++;
    }
  }
  
  if (correct === quizLesson.questions.length) {
    showToast('All answers correct! Course Completed!', 'success');
    await completeCurrentLesson();
  } else {
    showToast(`Score: ${correct}/${quizLesson.questions.length}. Try again!`, 'error');
  }
}

function toggleResumeWidget() {
  const el = document.getElementById('floatingResumeAnalyzer');
  if (el) {
    el.classList.toggle('expanded');
    el.classList.toggle('collapsed');
  }
}

// ──────────────────────────────────────────────────────────────
// INIT
// ──────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const isDark = localStorage.getItem('theme') === 'dark';
  if (isDark) {
    document.body.classList.add('dark');
    const toggle = document.getElementById('darkThemeToggle');
    if (toggle) toggle.checked = true;
  }
  const loginScreen = document.getElementById('screen-login');
  if (loginScreen) loginScreen.style.display = 'flex';
  ['welcome','assessment','app','test','interview','results','interview-report'].forEach(id => {
    const el = document.getElementById(`screen-${id}`);
    if (el) el.style.display = 'none';
  });
  const hour = new Date().getHours();
  const dashGreet = document.getElementById('dashGreeting');
  if (dashGreet) dashGreet.textContent = hour < 12 ? 'Good morning,' : hour < 17 ? 'Good afternoon,' : 'Good evening,';
  state.selectedDept = 'Engineering';
  document.querySelectorAll('.iv-radio-item').forEach(item => {
    item.addEventListener('change', () => {
      document.querySelectorAll('.iv-radio-item').forEach(i => i.style.borderColor = 'var(--border)');
      item.style.borderColor = 'var(--primary)';
      item.style.background = 'var(--primary-lighter)';
    });
  });

  console.log('%cElevate Student Portal — GH Raisoni College', 'font-size:16px;font-weight:bold;color:#5B2D90');
  console.log('%cLogin with Student ID and password (min 3 chars)', 'font-size:12px;color:#6B7280');
  
  // Initialize Startup Pitch Slide & All Startups List
  if (typeof setStartupSlide === 'function') {
    setStartupSlide(0);
    startAutoScroll();
  }
  if (typeof renderAllStartupsList === 'function') {
    renderAllStartupsList();
  }
});

// ──────────────────────────────────────────────────────────────
// ALL STARTUPS & PITCH SLIDER LOGIC
// ──────────────────────────────────────────────────────────────
let currentStartupSlide = 0;
let autoScrollTimer = null;
let isAutoScrollPaused = false;

const startupSlides = [
  {
    title: 'SolarGrid',
    tagline: 'Decentralizing energy for a resilient tomorrow',
    fundedPercent: 45,
    daysLeft: 24,
    views: '315 views this week',
    badge: 'TRENDING',
    image: 'solargrid_banner.png'
  },
  {
    title: 'NeuroStream AI',
    tagline: 'Predictive health analytics & early diagnostic AI platform',
    fundedPercent: 78,
    daysLeft: 12,
    views: '540 views this week',
    badge: 'POPULAR',
    image: 'healthpulse_banner.png'
  },
  {
    title: 'BioPulp',
    tagline: 'Compostable protective packaging grown from agricultural waste and mycelium',
    fundedPercent: 60,
    daysLeft: 30,
    views: '298 views this week',
    badge: 'NEW PITCH',
    image: 'biopulp_banner.png'
  }
];

function setStartupSlide(index) {
  if (index < 0) index = startupSlides.length - 1;
  if (index >= startupSlides.length) index = 0;
  currentStartupSlide = index;
  const slide = startupSlides[index];
  
  const imgEl = document.getElementById('tpSlideImg');
  const viewsEl = document.getElementById('tpSlideViews');
  const badgeEl = document.getElementById('tpSlideBadge');
  const titleEl = document.getElementById('tpSlideTitle');
  const taglineEl = document.getElementById('tpSlideTagline');
  const progressEl = document.getElementById('tpSlideProgress');
  const statsEl = document.getElementById('tpSlideStats');
  const dotsContainer = document.getElementById('tpPaginationDots');
  
  if (imgEl) imgEl.src = slide.image;
  if (viewsEl) viewsEl.innerHTML = `<svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="display:inline;margin-right:5px;"><circle cx="12" cy="12" r="3"/><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/></svg> ${slide.views}`;
  if (badgeEl) badgeEl.innerHTML = `<svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24" style="display:inline;margin-right:4px;"><path d="M17.5 12a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg> ${slide.badge}`;
  if (titleEl) titleEl.textContent = slide.title;
  if (taglineEl) taglineEl.textContent = slide.tagline;
  if (progressEl) progressEl.style.width = slide.fundedPercent + '%';
  if (statsEl) statsEl.textContent = `${slide.fundedPercent}% FUNDED • ${slide.daysLeft} DAYS LEFT`;
  
  if (dotsContainer) {
    dotsContainer.innerHTML = startupSlides.map((_, i) => `
      <button onclick="setStartupSlide(${i}); resetAutoScroll();" class="tp-dot ${i === index ? 'active' : ''}" style="${i === index ? 'width: 24px; background: var(--primary); border-radius: 10px;' : 'width: 7px; background: var(--border); border-radius: 50%;'} height: 7px; border: none; padding: 0; cursor: pointer; transition: all 0.3s ease;"></button>
    `).join('');
  }
}

function prevStartupSlide() {
  setStartupSlide(currentStartupSlide - 1);
}

function nextStartupSlide() {
  setStartupSlide(currentStartupSlide + 1);
}

function startAutoScroll() {
  if (autoScrollTimer) clearInterval(autoScrollTimer);
  autoScrollTimer = setInterval(() => {
    if (!isAutoScrollPaused) {
      nextStartupSlide();
    }
  }, 5000);
}

function resetAutoScroll() {
  startAutoScroll();
}

function pauseAutoScroll() {
  isAutoScrollPaused = true;
}

function resumeAutoScroll() {
  isAutoScrollPaused = false;
}

// ──────────────────────────────────────────────────────────────
// ALL STARTUPS DATA & MODALS
// ──────────────────────────────────────────────────────────────
const allStartupsData = [
  {
    id: 'biopulp',
    title: 'BioPulp',
    founder: 'Ingrid Solberg',
    stage: 'SEED',
    categories: ['CLEANTECH', 'MATERIALS'],
    tagline: 'Compostable protective packaging grown from agricultural waste and mycelium',
    description: 'Compostable protective packaging grown from agricultural waste and mycelium, shipping cost-competitive with styrofoam at scale.',
    fullStory: 'BioPulp transforms agricultural waste streams into high-performance, fully bio-degradable packaging materials using proprietary fungal mycelium strains. Our packaging degrades completely within 30 days in soil while matching the impact cushioning of EPS styrofoam. We have signed pilot agreements with leading e-commerce distributors to replace single-use plastic cushions.',
    views: '298 views this week',
    upvotes: 298,
    commentsCount: 1,
    image: 'biopulp_banner.png',
    raised: '$1.2M',
    goal: '$2M',
    fundedPercent: 60,
    team: [
      { name: 'Ingrid Solberg', role: 'Founder & Lead Chemist', initials: 'IS', bg: '#059669' },
      { name: 'Lars Lindqvist', role: 'Head of Supply Chain', initials: 'LL', bg: '#0d9488' }
    ],
    comments: [
      { author: 'Elena Petrova', time: '3 days ago', text: 'Integrated the beta SDK into our Shopify store in a single afternoon. The automated 3D pipeline is the real magic here.', avatar: 'EP', color: '#84cc16' }
    ]
  },
  {
    id: 'roboserve',
    title: 'RoboServe',
    founder: 'Wei Zhang',
    stage: 'LATE SEED',
    categories: ['ROBOTICS', 'LOGISTICS'],
    tagline: 'Autonomous delivery units purpose-built for high-density campuses',
    description: 'Autonomous delivery units purpose-built for high-density campuses, hospitals, and corporate parks with elevator and door-system integration.',
    fullStory: 'RoboServe designs level-4 autonomous indoor/outdoor micro-delivery rovers. Built specifically for universities, medical centers, and tech campuses, RoboServe autonomous fleets navigate multi-story buildings, interact with smart elevators, and provide contactless last-yard deliveries.',
    views: '189 views this week',
    upvotes: 189,
    commentsCount: 2,
    image: 'roboserve_banner.png',
    raised: '$2.1M',
    goal: '$3M',
    fundedPercent: 70,
    team: [
      { name: 'Wei Zhang', role: 'Co-founder & CEO', initials: 'WZ', bg: '#2563eb' },
      { name: 'Chloe Dubois', role: 'Head of Autonomy', initials: 'CD', bg: '#3b82f6' }
    ],
    comments: [
      { author: 'David Osei', time: '1 week ago', text: 'Curious how the asset quality holds up for soft goods like apparel. Furniture demo looked great though.', avatar: 'DO', color: '#9333ea' },
      { author: 'Marcus Vance', time: '2 weeks ago', text: 'Autonomous elevator integration is super smooth on campus testing.', avatar: 'MV', color: '#0284c7' }
    ]
  },
  {
    id: 'neurostream-ai',
    title: 'NeuroStream AI',
    founder: 'Dr. Maya Chen',
    stage: 'SERIES A',
    categories: ['HEALTH TECH', 'AI'],
    tagline: 'Bridging cognitive performance and physical excellence',
    description: 'Real-time brain activity visualization for specialized athletic training. Bridging the gap between cognitive performance and physical excellence through proprietary AI hardware.',
    fullStory: 'NeuroStream AI builds proprietary EEG hardware paired with a real-time visualization platform that lets coaches and athletes see cognitive load, focus, and recovery states during training. Our patented dry-electrode headband streams sub-10ms latency data to a dashboard powered by on-device machine learning models. Teams across three professional leagues are already using NeuroStream to reduce injury rates and optimize peak performance windows. We are now scaling manufacturing and expanding into rehabilitation clinics.',
    views: '482 views this week',
    upvotes: 482,
    commentsCount: 3,
    image: 'healthpulse_banner.png',
    raised: '$4.2M',
    goal: '$6M',
    fundedPercent: 78,
    team: [
      { name: 'Dr. Maya Chen', role: 'CEO & Co-founder', initials: 'DM', bg: '#5B2D90' },
      { name: 'Arjun Patel', role: 'CTO & Co-founder', initials: 'AP', bg: '#7c3aed' },
      { name: 'Sofia Reyes', role: 'Head of Hardware', initials: 'SR', bg: '#9333ea' }
    ],
    comments: [
      { author: 'You', time: 'Just now', text: 'This is an incredible product. The latency demo blew me away!', avatar: 'Y', color: '#5B2D90' },
      { author: 'Jordan Lee', time: '2 days ago', text: 'The latency numbers here are seriously impressive. Would love to see this applied to esports training as well.', avatar: 'JL', color: '#2563eb' },
      { author: 'Priya Nair', time: '5 days ago', text: 'Met the team at the Elevate demo day. The hardware demo was flawless and the coaching insights were super clean.', avatar: 'PN', color: '#16a34a' }
    ]
  },
  {
    id: 'solargrid',
    title: 'SolarGrid',
    founder: 'Tomas Alvarez',
    stage: 'SEED',
    categories: ['CLEANTECH', 'ENERGY'],
    tagline: 'Decentralizing energy for a resilient tomorrow',
    description: 'Peer-to-peer energy trading platform that lets neighborhoods share excess solar power through smart microgrids and transparent billing.',
    fullStory: 'SolarGrid empowers communities to trade renewable energy directly with neighbors. By combining IoT smart meters with automated microgrid controllers, SolarGrid balances local energy supply and demand in real-time, reducing grid reliance during peak hours by up to 40%.',
    views: '315 views this week',
    upvotes: 315,
    commentsCount: 2,
    image: 'solargrid_banner.png',
    raised: '$450K',
    goal: '$3M',
    fundedPercent: 15,
    team: [
      { name: 'Tomas Alvarez', role: 'Founder & CEO', initials: 'TA', bg: '#d97706' },
      { name: 'Aisha Bello', role: 'Lead Grid Architect', initials: 'AB', bg: '#b45309' }
    ],
    comments: [
      { author: 'Elena Petrova', time: '3 days ago', text: 'Integrated the beta SDK into our Shopify store in a single afternoon. The automated 3D pipeline is the real magic here.', avatar: 'EP', color: '#84cc16' },
      { author: 'David Osei', time: '1 week ago', text: 'Curious how the asset quality holds up for soft goods like apparel. Furniture demo looked great though.', avatar: 'DO', color: '#9333ea' }
    ]
  }
];

function renderAllStartupsList(filterQuery = '') {
  const container = document.getElementById('allStartupsList');
  if (!container) return;
  
  const filtered = allStartupsData.filter(s => 
    s.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
    s.founder.toLowerCase().includes(filterQuery.toLowerCase()) ||
    s.categories.some(c => c.toLowerCase().includes(filterQuery.toLowerCase())) ||
    s.description.toLowerCase().includes(filterQuery.toLowerCase())
  );
  
  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: rgba(233, 213, 255, 0.7); background: rgba(30, 22, 53, 0.7); border-radius: 20px; border: 1px solid rgba(168, 85, 247, 0.25);">
        <p style="font-size: 14px; font-weight: 600;">No startups match your search query "${filterQuery}".</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = filtered.map(s => `
    <div class="card startup-list-card" style="display: flex; flex-direction: row; border-radius: 20px; background: rgba(30, 22, 53, 0.75); border: 1px solid rgba(168, 85, 247, 0.25); overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); backdrop-filter: blur(10px); color: #fff; transition: transform 0.2s ease, box-shadow 0.2s ease;" onmouseover="this.style.boxShadow='0 14px 40px rgba(147, 51, 234, 0.3)'; this.style.transform='translateY(-2px)';" onmouseout="this.style.boxShadow='0 10px 30px rgba(0, 0, 0, 0.3)'; this.style.transform='translateY(0)';" onclick="openStartupModal('${s.id}')">
      <!-- Left Photo -->
      <div style="width: 290px; min-width: 290px; height: 180px; overflow: hidden; background: #0b0f19; position: relative;">
        <img src="${s.image}" alt="${s.title}" style="width: 100%; height: 100%; object-fit: cover;" />
      </div>
      <!-- Right Content -->
      <div style="flex: 1; padding: 18px 22px; display: flex; flex-direction: column; justify-content: space-between; gap: 8px;">
        <!-- Top Row: Title & Stage -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <h3 style="font-size: 20px; font-weight: 800; color: #fff; font-family: 'Rajdhani', sans-serif; margin: 0 0 2px;">${s.title}</h3>
            <div style="font-size: 12px; color: rgba(233, 213, 255, 0.7); font-weight: 500;">Founded by <span style="color: #fff; font-weight: 600;">${s.founder}</span></div>
          </div>
          <span style="background: linear-gradient(135deg, #9333ea, #c084fc); color: #fff; font-size: 10px; font-weight: 700; padding: 4px 12px; border-radius: 12px; text-transform: uppercase; letter-spacing: 0.05em; box-shadow: 0 4px 12px rgba(147, 51, 234, 0.4);">${s.stage}</span>
        </div>
        <!-- Category Pills -->
        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
          ${s.categories.map(c => `<span style="background: rgba(168, 85, 247, 0.18); color: #e9d5ff; border: 1px solid rgba(168, 85, 247, 0.3); font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 12px; letter-spacing: 0.03em;">${c}</span>`).join('')}
        </div>
        <!-- Description -->
        <p style="font-size: 12px; color: rgba(233, 213, 255, 0.8); margin: 0; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${s.description}</p>
        <!-- Footer: Upvote, Comment & View Details -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
          <div style="display: flex; gap: 16px; align-items: center;">
            <button onclick="event.stopPropagation(); toggleUpvote('${s.id}')" style="background: none; border: none; color: #c084fc; font-size: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 4px; padding: 0;">
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
              <span>${s.upvotes}</span>
            </button>
            <button onclick="event.stopPropagation(); openStartupModal('${s.id}', true)" style="background: none; border: none; color: #c084fc; font-size: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 4px; padding: 0;">
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              <span>${s.commentsCount}</span>
            </button>
          </div>
          <button onclick="event.stopPropagation(); openStartupModal('${s.id}')" style="background: linear-gradient(135deg, #9333ea, #c084fc); color: #fff; border: none; padding: 6px 18px; border-radius: 20px; font-size: 11px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 4px; box-shadow: 0 4px 14px rgba(147, 51, 234, 0.4); transition: transform 0.2s ease;" onmouseover="this.style.transform='scale(1.04)'" onmouseout="this.style.transform='scale(1)'">
            View Details <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function filterStartups(query) {
  renderAllStartupsList(query);
}

function toggleUpvote(startupId) {
  const s = allStartupsData.find(item => item.id === startupId);
  if (!s) return;
  if (!s.isUpvoted) {
    s.upvotes += 1;
    s.isUpvoted = true;
    showToast(`Upvoted ${s.title}!`, 'success');
  } else {
    s.upvotes -= 1;
    s.isUpvoted = false;
  }
  renderAllStartupsList();
  const modalEl = document.getElementById('startupModalOverlay');
  if (modalEl && modalEl.style.display !== 'none') {
    openStartupModal(startupId, false);
  }
}

function openStartupModal(startupId, focusComment = false) {
  const s = allStartupsData.find(item => item.id === startupId);
  if (!s) return;
  
  const modalOverlay = document.getElementById('startupModalOverlay');
  const modalBox = document.getElementById('startupModalBox');
  if (!modalOverlay || !modalBox) return;
  
  modalBox.innerHTML = `
    <div style="position: relative;">
      <!-- Close Button -->
      <button onclick="closeStartupModal()" style="position: absolute; top: 16px; right: 16px; width: 34px; height: 34px; border-radius: 50%; background: rgba(0,0,0,0.5); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.3); color: #fff; font-size: 18px; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 10;" onmouseover="this.style.background='rgba(0,0,0,0.8)'" onmouseout="this.style.background='rgba(0,0,0,0.5)'">✕</button>
      
      <!-- Top Pitch Banner -->
      <div style="position: relative; width: 100%; height: 220px; overflow: hidden; background: #0b0f19;">
        <img src="${s.image}" alt="${s.title}" style="width: 100%; height: 100%; object-fit: cover;" />
        <div style="position: absolute; bottom: -20px; left: 24px; width: 56px; height: 56px; border-radius: 16px; background: var(--surface); border: 2px solid var(--border); box-shadow: 0 8px 16px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; color: var(--primary); font-weight: 800; font-size: 22px;">
          🚀
        </div>
      </div>
      
      <!-- Modal Content Body -->
      <div style="padding: 32px 24px 24px;">
        <!-- Title & Tagline -->
        <h2 style="font-size: 26px; font-weight: 800; color: var(--text); font-family: 'Rajdhani', sans-serif; margin: 0 0 4px;">${s.title}</h2>
        <p style="font-size: 14px; font-weight: 600; color: var(--primary); margin: 0 0 14px;">${s.tagline}</p>
        
        <!-- Category & Stage Pills -->
        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px;">
          ${s.categories.map(c => `<span style="background: rgba(91, 45, 144, 0.08); color: var(--primary); font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 14px;">${c}</span>`).join('')}
          <span style="background: var(--primary); color: #fff; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 14px;">${s.stage}</span>
        </div>
        
        <!-- Full Pitch Story -->
        <p style="font-size: 13px; color: var(--text-2); line-height: 1.6; margin-bottom: 24px;">${s.fullStory || s.description}</p>
        
        <!-- Founding Team Section -->
        <div style="margin-bottom: 24px;">
          <h4 style="font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
            👥 Founding Team
          </h4>
          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            ${s.team ? s.team.map(m => `
              <div style="flex: 1; min-width: 180px; background: var(--bg); border: 1px solid var(--border); padding: 10px 14px; border-radius: 14px; display: flex; align-items: center; gap: 10px;">
                <div style="width: 36px; height: 36px; border-radius: 50%; background: ${m.bg}; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700;">${m.initials}</div>
                <div>
                  <div style="font-size: 12px; font-weight: 700; color: var(--text);">${m.name}</div>
                  <div style="font-size: 10px; color: var(--text-2);">${m.role}</div>
                </div>
              </div>
            `).join('') : ''}
          </div>
        </div>
        
        <!-- Funding Section -->
        <div style="margin-bottom: 24px;">
          <h4 style="font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
            🏦 Funding
          </h4>
          <div style="background: var(--bg); border: 1px solid var(--border); border-radius: 16px; padding: 16px;">
            <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 700; color: var(--text); margin-bottom: 8px;">
              <span>${s.raised} raised of ${s.goal} goal</span>
              <span style="color: var(--primary);">${s.fundedPercent}%</span>
            </div>
            <div style="width: 100%; height: 8px; background: var(--border); border-radius: 9999px; overflow: hidden; margin-bottom: 8px;">
              <div style="width: ${s.fundedPercent}%; height: 100%; background: linear-gradient(90deg, var(--primary), #8b5cf6); border-radius: 9999px;"></div>
            </div>
            <div style="font-size: 10px; font-weight: 700; color: var(--text-2); letter-spacing: 0.05em; text-transform: uppercase;">
              STAGE: ${s.stage} • FOUNDER: ${s.founder.toUpperCase()}
            </div>
          </div>
        </div>
        
        <!-- Action Buttons: Upvote & Comment -->
        <div style="display: flex; gap: 12px; margin-bottom: 24px;">
          <button onclick="toggleUpvote('${s.id}')" style="padding: 10px 20px; border-radius: 20px; border: 1px solid var(--border); background: ${s.isUpvoted ? 'var(--primary)' : 'rgba(91, 45, 144, 0.08)'}; color: ${s.isUpvoted ? '#fff' : 'var(--primary)'}; font-size: 13px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.2s ease;">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
            <span>Upvote · ${s.upvotes}</span>
          </button>
          <button onclick="document.getElementById('commentSectionAnchor').scrollIntoView({ behavior: 'smooth' })" style="padding: 10px 20px; border-radius: 20px; border: 1px solid var(--border); background: var(--surface); color: var(--text); font-size: 13px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 6px;">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            <span>Comment</span>
          </button>
        </div>
        
        <!-- Comments Section -->
        <div id="commentSectionAnchor" style="border-top: 1px solid var(--border); padding-top: 20px;">
          <h4 style="font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 14px;">
            Comments (${s.comments ? s.comments.length : 0})
          </h4>
          
          <!-- Add Comment Form -->
          <div style="background: var(--bg); border: 1px solid var(--border); border-radius: 16px; padding: 14px; margin-bottom: 20px;">
            <textarea id="modalCommentInput" rows="3" placeholder="Share your thoughts..." style="width: 100%; border: none; background: transparent; color: var(--text); font-family: inherit; font-size: 13px; outline: none; resize: none;"></textarea>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px; border-top: 1px solid var(--border); padding-top: 8px;">
              <span style="font-size: 10px; color: var(--text-3);">0/500</span>
              <button onclick="postStartupComment('${s.id}')" style="background: var(--primary); color: #fff; border: none; padding: 6px 16px; border-radius: 14px; font-size: 11px; font-weight: 700; cursor: pointer;">
                Post Comment
              </button>
            </div>
          </div>
          
          <!-- Comments List Feed -->
          <div style="display: flex; flex-direction: column; gap: 14px;">
            ${s.comments ? s.comments.map(c => `
              <div style="display: flex; gap: 12px; align-items: flex-start;">
                <div style="width: 32px; height: 32px; border-radius: 50%; background: ${c.color || '#5B2D90'}; color: #fff; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; shrink: 0;">${c.avatar}</div>
                <div>
                  <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 2px;">
                    <span style="font-size: 12px; font-weight: 700; color: var(--text);">${c.author}</span>
                    <span style="font-size: 10px; color: var(--text-3);">• ${c.time}</span>
                  </div>
                  <p style="font-size: 12px; color: var(--text-2); margin: 0; line-height: 1.4;">${c.text}</p>
                </div>
              </div>
            `).join('') : ''}
          </div>
        </div>
      </div>
    </div>
  `;
  
  modalOverlay.style.display = 'flex';
  if (focusComment) {
    setTimeout(() => {
      const el = document.getElementById('commentSectionAnchor');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }
}

function closeStartupModal() {
  const modalOverlay = document.getElementById('startupModalOverlay');
  if (modalOverlay) modalOverlay.style.display = 'none';
}

function handleStartupModalOverlayClick(event) {
  if (event.target.id === 'startupModalOverlay') {
    closeStartupModal();
  }
}

function postStartupComment(startupId) {
  const input = document.getElementById('modalCommentInput');
  if (!input || !input.value.trim()) return;
  const text = input.value.trim();
  
  const s = allStartupsData.find(item => item.id === startupId);
  if (!s) return;
  
  s.comments.unshift({
    author: 'You',
    time: 'Just now',
    text: text,
    avatar: 'Y',
    color: '#5B2D90'
  });
  s.commentsCount = s.comments.length;
  
  showToast('Comment posted!', 'success');
  renderAllStartupsList();
  openStartupModal(startupId, true);
}

let uploadedPitchCoverDataUrl = null;

function handleCoverPhotoSelect(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    uploadedPitchCoverDataUrl = e.target.result;
    const previewBox = document.getElementById('coverPhotoPreviewContent');
    const dropzone = document.getElementById('coverDropzone');
    if (previewBox && dropzone) {
      dropzone.style.padding = '0';
      dropzone.style.height = '200px';
      previewBox.innerHTML = `
        <div style="width: 100%; height: 200px; position: relative;">
          <img src="${uploadedPitchCoverDataUrl}" style="width: 100%; height: 100%; object-fit: cover;" />
          <button type="button" onclick="event.stopPropagation(); resetCoverPhoto();" style="position: absolute; top: 12px; right: 12px; background: rgba(0,0,0,0.7); border: 1px solid rgba(255,255,255,0.4); color: #fff; border-radius: 50%; width: 32px; height: 32px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center;">✕</button>
        </div>
      `;
    }
  };
  reader.readAsDataURL(file);
}

function resetCoverPhoto() {
  uploadedPitchCoverDataUrl = null;
  const dropzone = document.getElementById('coverDropzone');
  const fileInput = document.getElementById('coverFileInput');
  if (fileInput) fileInput.value = '';
  if (dropzone) {
    dropzone.style.padding = '36px 20px';
    dropzone.style.height = 'auto';
    dropzone.innerHTML = `
      <input type="file" id="coverFileInput" accept="image/*" style="display: none;" onchange="handleCoverPhotoSelect(event)" />
      <div id="coverPhotoPreviewContent" style="display: flex; flex-direction: column; align-items: center;">
        <div style="width: 54px; height: 54px; border-radius: 16px; background: linear-gradient(135deg, #9333ea, #c084fc); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 24px; margin-bottom: 12px; box-shadow: 0 8px 24px rgba(147, 51, 234, 0.4);">
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </div>
        <div style="font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 4px;">Upload Cover Photo</div>
        <div style="font-size: 12px; color: rgba(233, 213, 255, 0.6);">Drag & drop or click — JPG, PNG, WEBP</div>
      </div>
    `;
  }
}

function formatFundingGoalInput(input) {
  let val = input.value.replace(/[^0-9]/g, '');
  if (!val) {
    input.value = '';
    return;
  }
  input.value = Number(val).toLocaleString('en-US');
}

function handleStartupPitchSubmit(event) {
  event.preventDefault();
  
  const name = document.getElementById('pitchNameInput').value.trim();
  const category = document.getElementById('pitchCategorySelect').value;
  const tagline = document.getElementById('pitchTaglineInput').value.trim();
  const desc = document.getElementById('pitchDescriptionInput').value.trim();
  const rawGoal = document.getElementById('pitchGoalInput').value.replace(/[^0-9]/g, '');
  const numericGoal = parseInt(rawGoal, 10) || 500000;
  
  const newPitch = {
    id: 'startup-' + Date.now(),
    title: name,
    founder: 'Priya Sharma',
    stage: 'PRE-SEED',
    categories: [category.toUpperCase()],
    description: tagline,
    fullStory: desc,
    upvotes: 1,
    isUpvoted: true,
    commentsCount: 0,
    comments: [],
    raised: '$0',
    goal: '$' + numericGoal.toLocaleString('en-US'),
    fundedPercent: 0,
    tagline: tagline,
    image: uploadedPitchCoverDataUrl || './solargrid_banner.png',
    team: [
      { name: 'Priya Sharma', role: 'Founder & CEO', initials: 'PS', bg: '#5B2D90' }
    ]
  };
  
  allStartupsData.unshift(newPitch);
  showToast('🚀 Startup Pitch Submitted Successfully!', 'success');
  renderAllStartupsList();
  navigateTo('all-startups');
}