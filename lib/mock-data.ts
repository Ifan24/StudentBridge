import type {
  EventItem,
  ForumPostView,
  ForumTopicView,
  JobOpportunityView,
  StudentProfileView,
  SubscriptionPlanView,
  SupportResourceView
} from "@/lib/types";

export const mockProfile: StudentProfileView = {
  id: "demo-profile",
  city: "Sydney",
  institution: "QIBA",
  studyArea: "Information Technology",
  arrivalStage: "Settling in",
  goals: ["Make friends", "Find work", "Join forum topics", "Find job opportunities", "Get support"],
  languages: ["English", "Mandarin"],
  preferredEventTypes: ["Networking", "Career", "Workshop", "Community"]
};

export const mockTopics: ForumTopicView[] = [
  { id: "topic-city-life", slug: "city-life", name: "City life", description: "Transport, libraries, suburbs and everyday local tips.", icon: "MapPin", color: "#1769E0" },
  { id: "topic-study-help", slug: "study-help", name: "Study help", description: "Campus services, study habits and assignment confidence.", icon: "BookOpen", color: "#6B4FD8" },
  { id: "topic-jobs", slug: "jobs", name: "Jobs", description: "Part-time work, internships, resumes and interviews.", icon: "BriefcaseBusiness", color: "#1E8A6A" },
  { id: "topic-events", slug: "events", name: "Events", description: "Find people going to student-friendly events.", icon: "CalendarDays", color: "#B7791F" },
  { id: "topic-accommodation", slug: "accommodation", name: "Accommodation", description: "Rental inspections, share houses and safe housing questions.", icon: "Home", color: "#B64242" },
  { id: "topic-wellbeing", slug: "wellbeing", name: "Wellbeing", description: "Homesickness, stress, confidence and support pathways.", icon: "Heart", color: "#1E8A6A" },
  { id: "topic-general", slug: "general", name: "General Q&A", description: "Practical student-life questions.", icon: "MessageCircle", color: "#43556A" }
];

const topic = (slug: string) => mockTopics.find((item) => item.slug === slug) ?? mockTopics[6];

export const mockForumPosts: ForumPostView[] = [
  {
    id: "post-first-job",
    title: "How do I find my first part-time job in Sydney?",
    body: "I am an international student studying commerce and looking for beginner-friendly part-time work. Where should I start?",
    city: "Sydney",
    tags: ["part-time", "resume", "first job"],
    status: "ACTIVE",
    helpfulCount: 128,
    replyCount: 1,
    topic: topic("jobs"),
    authorName: "Arjun K.",
    comments: [{ id: "comment-first-job", body: "Start with your campus career service, then check Fair Work before accepting any offer.", authorName: "Sarah M.", helpfulCount: 18, createdAt: new Date().toISOString() }],
    createdAt: new Date("2026-05-05T02:30:00.000Z").toISOString()
  },
  {
    id: "post-study-town-hall",
    title: "Best places to study near Town Hall?",
    body: "I need quiet spaces with Wi-Fi and power outlets. Libraries, cafes or student spaces you recommend?",
    city: "Sydney",
    tags: ["study", "library", "city"],
    status: "ACTIVE",
    helpfulCount: 96,
    replyCount: 1,
    topic: topic("study-help"),
    authorName: "Sarah M.",
    comments: [{ id: "comment-study-town-hall", body: "Customs House Library is a good first stop, and it is close to trains.", authorName: "Noor Ahmed", helpfulCount: 11, createdAt: new Date().toISOString() }],
    createdAt: new Date("2026-05-06T06:00:00.000Z").toISOString()
  },
  {
    id: "post-networking-event",
    title: "What should I bring to my first networking event?",
    body: "Going to a tech networking event next week and not sure what to expect. Any tips on what to bring and how to introduce myself?",
    city: "Melbourne",
    tags: ["networking", "confidence", "tech"],
    status: "ACTIVE",
    helpfulCount: 74,
    replyCount: 1,
    topic: topic("events"),
    authorName: "Jason L.",
    comments: [{ id: "comment-networking-event", body: "Prepare a 20-second intro, one question about the speaker, and your LinkedIn QR code.", authorName: "Priya R.", helpfulCount: 21, createdAt: new Date().toISOString() }],
    createdAt: new Date("2026-05-07T08:10:00.000Z").toISOString()
  },
  {
    id: "post-study-nsw",
    title: "Has anyone used a Study NSW support hub?",
    body: "I saw they offer help with study, wellbeing and career planning. Curious about your experience and how to book an appointment.",
    city: "Sydney",
    tags: ["support", "study nsw", "wellbeing"],
    status: "ACTIVE",
    helpfulCount: 63,
    replyCount: 1,
    topic: topic("general"),
    authorName: "Priya R.",
    comments: [{ id: "comment-study-nsw", body: "Use the official Study NSW site to find current support and events.", authorName: "Maya Chen", helpfulCount: 9, createdAt: new Date().toISOString() }],
    createdAt: new Date("2026-05-08T09:20:00.000Z").toISOString()
  },
  {
    id: "post-rental-inspections",
    title: "How do rental inspections work?",
    body: "My agent wants to do inspections every 3 months. What are my rights as a tenant in Queensland?",
    city: "Brisbane",
    tags: ["renting", "inspection", "housing"],
    status: "ACTIVE",
    helpfulCount: 52,
    replyCount: 1,
    topic: topic("accommodation"),
    authorName: "Michael T.",
    comments: [{ id: "comment-rental-inspections", body: "This can depend on state law, so check the official tenancy authority before relying on forum advice.", authorName: "Hana Park", helpfulCount: 15, createdAt: new Date().toISOString() }],
    createdAt: new Date("2026-05-08T11:40:00.000Z").toISOString()
  },
  {
    id: "post-group-assignments",
    title: "How do you survive group assignments with strangers?",
    body: "I want to contribute properly but I get nervous speaking first. What process works for group assignments?",
    city: "Sydney",
    tags: ["group work", "assignments", "confidence"],
    status: "ACTIVE",
    helpfulCount: 47,
    replyCount: 2,
    topic: topic("study-help"),
    authorName: "Noor Ahmed",
    comments: [
      { id: "comment-group-assignments-1", body: "Suggest a shared doc with owners and dates. It feels less awkward when the work is visible.", authorName: "Sofia Garcia", helpfulCount: 14, createdAt: new Date().toISOString() },
      { id: "comment-group-assignments-2", body: "A short kickoff message helps: goal, deadline, preferred meeting time and who writes notes.", authorName: "Jason L.", helpfulCount: 10, createdAt: new Date().toISOString() }
    ],
    createdAt: new Date("2026-05-08T13:25:00.000Z").toISOString()
  },
  {
    id: "post-bank-documents",
    title: "Which documents should I bring to a bank appointment?",
    body: "I booked a student bank appointment and want to be prepared. What documents did you take?",
    city: "Sydney",
    tags: ["banking", "arrival", "documents"],
    status: "ACTIVE",
    helpfulCount: 42,
    replyCount: 1,
    topic: topic("city-life"),
    authorName: "Sofia Garcia",
    comments: [{ id: "comment-bank-documents", body: "Bring passport, student confirmation and proof of local address if you have it. Check the bank page before going.", authorName: "Maya Chen", helpfulCount: 17, createdAt: new Date().toISOString() }],
    createdAt: new Date("2026-05-08T15:10:00.000Z").toISOString()
  },
  {
    id: "post-casual-hours",
    title: "How do you track casual work hours around classes?",
    body: "I am worried about overcommitting. What tools or routines help you balance shifts and study?",
    city: "Adelaide",
    tags: ["casual work", "time management", "study"],
    status: "ACTIVE",
    helpfulCount: 39,
    replyCount: 1,
    topic: topic("jobs"),
    authorName: "Ethan Wilson",
    comments: [{ id: "comment-casual-hours", body: "Put classes, travel time and assignment blocks in first, then add shifts around that.", authorName: "Arjun K.", helpfulCount: 12, createdAt: new Date().toISOString() }],
    createdAt: new Date("2026-05-08T17:30:00.000Z").toISOString()
  },
  {
    id: "post-meet-people",
    title: "Easy ways to meet people after class?",
    body: "Most people leave quickly after lectures. What has worked for making friends without feeling forced?",
    city: "Sydney",
    tags: ["friends", "confidence", "campus"],
    status: "ACTIVE",
    helpfulCount: 35,
    replyCount: 2,
    topic: topic("wellbeing"),
    authorName: "Hana Park",
    comments: [
      { id: "comment-meet-people-1", body: "Ask if anyone is going for coffee before the next class. Small repeated chats add up.", authorName: "Mei Lin", helpfulCount: 13, createdAt: new Date().toISOString() },
      { id: "comment-meet-people-2", body: "Joining a weekly event is easier than one-off meetups because faces become familiar.", authorName: "Priya R.", helpfulCount: 9, createdAt: new Date().toISOString() }
    ],
    createdAt: new Date("2026-05-09T01:30:00.000Z").toISOString()
  },
  {
    id: "post-cheap-lunch",
    title: "Cheap lunch spots near campus?",
    body: "Looking for budget-friendly meals in the city that are not too far from public transport.",
    city: "Sydney",
    tags: ["food", "budget", "campus"],
    status: "ACTIVE",
    helpfulCount: 32,
    replyCount: 1,
    topic: topic("city-life"),
    authorName: "Mei Lin",
    comments: [{ id: "comment-cheap-lunch", body: "Food courts around Town Hall can be good if you go just before the lunch rush.", authorName: "Michael T.", helpfulCount: 7, createdAt: new Date().toISOString() }],
    createdAt: new Date("2026-05-09T03:15:00.000Z").toISOString()
  },
  {
    id: "post-volunteer-portfolio",
    title: "Is volunteering useful for an IT portfolio?",
    body: "I do not have local experience yet. Would a volunteer web project help when applying for internships?",
    city: "Perth",
    tags: ["portfolio", "volunteering", "internship"],
    status: "ACTIVE",
    helpfulCount: 30,
    replyCount: 1,
    topic: topic("jobs"),
    authorName: "Arjun K.",
    comments: [{ id: "comment-volunteer-portfolio", body: "Yes, if you can explain the problem, your role and the outcome. Keep screenshots and a short case study.", authorName: "Jason L.", helpfulCount: 16, createdAt: new Date().toISOString() }],
    createdAt: new Date("2026-05-09T04:50:00.000Z").toISOString()
  },
  {
    id: "post-tech-meetups",
    title: "Anyone going to beginner-friendly tech meetups this month?",
    body: "I want to attend but would feel better going with another student. Which events are good for first-timers?",
    city: "Sydney",
    tags: ["meetup", "tech", "first-timer"],
    status: "ACTIVE",
    helpfulCount: 28,
    replyCount: 1,
    topic: topic("events"),
    authorName: "Noor Ahmed",
    comments: [{ id: "comment-tech-meetups", body: "Look for events with a workshop format. They give you something practical to talk about.", authorName: "Sarah M.", helpfulCount: 10, createdAt: new Date().toISOString() }],
    createdAt: new Date("2026-05-09T06:15:00.000Z").toISOString()
  }
];

export const mockJobs: JobOpportunityView[] = [
  {
    id: "job-data-analyst",
    title: "Junior Data Analyst Intern",
    company: "Data Insights Australia",
    verified: true,
    city: "Sydney",
    workType: "Internship",
    industry: "Data & Analytics",
    experienceLevel: "Entry level",
    workRightsFriendly: true,
    paid: true,
    closingDate: "2026-06-12T00:00:00.000Z",
    description: "Support analytics team members with real datasets, dashboards and simple insights.",
    tags: ["SQL", "Excel", "Dashboarding", "Remote OK"],
    applyUrl: "https://example.com/jobs/data-analyst-intern"
  },
  {
    id: "job-it-support",
    title: "Part-time IT Support Assistant",
    company: "TechConnect Solutions",
    verified: true,
    city: "Melbourne",
    workType: "Part-time",
    industry: "IT Support",
    experienceLevel: "Beginner friendly",
    workRightsFriendly: true,
    paid: true,
    closingDate: "2026-06-18T00:00:00.000Z",
    description: "Help clients with basic tech support. Training provided and flexible student hours available.",
    tags: ["Customer service", "On-site", "20 hrs/week"],
    applyUrl: "https://example.com/jobs/it-support-assistant"
  },
  {
    id: "job-marketing",
    title: "Graduate Marketing Coordinator",
    company: "BrightPath Marketing",
    verified: true,
    city: "Sydney",
    workType: "Graduate",
    industry: "Marketing",
    experienceLevel: "Graduate",
    workRightsFriendly: true,
    paid: true,
    closingDate: "2026-06-30T00:00:00.000Z",
    description: "Help deliver digital campaigns for education and community clients.",
    tags: ["Content", "Digital campaigns", "Graduate"],
    applyUrl: "https://example.com/jobs/marketing-coordinator"
  },
  {
    id: "job-volunteer-web",
    title: "Volunteer Web Project",
    company: "Community Web Builders",
    verified: true,
    city: "Australia-wide",
    workType: "Volunteer",
    industry: "Web Development",
    experienceLevel: "Student project",
    workRightsFriendly: true,
    paid: false,
    closingDate: null,
    description: "Build websites with other students for local not-for-profits and community groups.",
    tags: ["Portfolio", "Remote", "Community"],
    applyUrl: "https://example.com/jobs/volunteer-web-project"
  }
];

export const mockSupportResources: SupportResourceView[] = [
  { id: "support-fair-work", title: "Fair Work Ombudsman", category: "Work rights", description: "Official information about pay, workplace rights and minimum conditions in Australia.", url: "https://www.fairwork.gov.au/", official: true, tags: ["work rights", "pay", "jobs"] },
  { id: "support-study-australia", title: "Study Australia support", category: "Student support", description: "National support information for international students in Australia.", url: "https://www.studyaustralia.gov.au/en/life-in-australia/student-support-services", official: true, tags: ["support", "student services"] },
  { id: "support-study-nsw", title: "Study NSW", category: "Study hub", description: "NSW support, events and practical resources for international students.", url: "https://www.study.nsw.gov.au/", official: true, tags: ["NSW", "study hub"] },
  { id: "support-emergency", title: "Emergency services", category: "Safety", description: "Call 000 in life-threatening emergencies requiring police, fire or ambulance.", url: "https://www.triplezero.gov.au/", official: true, tags: ["emergency", "safety"] },
  { id: "support-lifeline", title: "Lifeline Australia", category: "Wellbeing", description: "24-hour crisis support and suicide prevention services.", url: "https://www.lifeline.org.au/", official: true, tags: ["wellbeing", "mental health"] }
];

export const mockSubscriptionPlans: SubscriptionPlanView[] = [
  {
    id: "plan-free",
    slug: "free",
    name: "Free",
    description: "Core StudentBridge access for events, forum, jobs and official support.",
    priceMonthlyCents: 0,
    aiMonthlyLimit: 5,
    highlighted: false,
    features: ["Events and forum access", "Job board browsing", "Official support resources", "5 AI Guide uses per month"]
  },
  {
    id: "plan-plus",
    slug: "plus",
    name: "Plus",
    description: "More AI help for active job search and weekly planning.",
    priceMonthlyCents: 799,
    aiMonthlyLimit: 100,
    highlighted: true,
    features: ["100 AI Guide uses per month", "Job alerts", "Saved folders", "Weekly networking and job-search plans"]
  },
  {
    id: "plan-pro",
    slug: "pro",
    name: "Pro",
    description: "High-usage coaching for resumes, interviews and opportunity matching.",
    priceMonthlyCents: 1499,
    aiMonthlyLimit: 300,
    highlighted: false,
    features: ["300 AI Guide uses per month", "Resume and LinkedIn coaching", "Interview prep", "Advanced job-fit explanations"]
  }
];

export const fallbackEvents: EventItem[] = [
  {
    id: "fallback-tech-connect",
    title: "Tech Connect Sydney",
    description: "Networking night for international students interested in technology careers.",
    dateLabel: "Wed, 28 May 2026",
    nextDate: "2026-05-28",
    location: "Sydney, NSW",
    city: "Sydney",
    category: "Career",
    isFree: true,
    host: "Study NSW",
    imageUrl: "https://images.ctfassets.net/k7h9gk6i1z6d/3on84ybMKy8KQKihbbCS5g/e305a43b435a6ac2d8c4fda07893b59e/VividSydney2019_SydneyOperaHouse_AstralFloraBallet_CREDITDestinationNSW_HL0014_1904x2601.jpg",
    sourceUrl: "https://whatson.cityofsydney.nsw.gov.au/",
    tags: ["Networking", "Tech", "Career"]
  },
  {
    id: "fallback-resume-workshop",
    title: "Resume and LinkedIn Workshop",
    description: "Stand out in the Australian job market with practical resume support.",
    dateLabel: "Fri, 30 May 2026",
    nextDate: "2026-05-30",
    location: "Sydney, NSW",
    city: "Sydney",
    category: "Workshop",
    isFree: true,
    host: "UTS Careers",
    sourceUrl: "https://whatson.cityofsydney.nsw.gov.au/",
    tags: ["Workshop", "Career", "Employability"]
  }
];
