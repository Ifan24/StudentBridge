import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const demoUserId = "demo-user";

const seedUsers = [
  { id: demoUserId, name: "Maya Chen", email: "maya.chen@studentbridge.test" },
  { id: "seed-user-arjun", name: "Arjun Kapoor", email: "arjun.kapoor@studentbridge.test" },
  { id: "seed-user-sarah", name: "Sarah Morgan", email: "sarah.morgan@studentbridge.test" },
  { id: "seed-user-jason", name: "Jason Lee", email: "jason.lee@studentbridge.test" },
  { id: "seed-user-priya", name: "Priya Raman", email: "priya.raman@studentbridge.test" },
  { id: "seed-user-michael", name: "Michael Tran", email: "michael.tran@studentbridge.test" },
  { id: "seed-user-noor", name: "Noor Ahmed", email: "noor.ahmed@studentbridge.test" },
  { id: "seed-user-sofia", name: "Sofia Garcia", email: "sofia.garcia@studentbridge.test" },
  { id: "seed-user-hana", name: "Hana Park", email: "hana.park@studentbridge.test" },
  { id: "seed-user-ethan", name: "Ethan Wilson", email: "ethan.wilson@studentbridge.test" },
  { id: "seed-user-mei", name: "Mei Lin", email: "mei.lin@studentbridge.test" }
];

async function main() {
  const users = await Promise.all(
    seedUsers.map((user) =>
      prisma.user.upsert({
        where: { id: user.id },
        update: {
          name: user.name,
          email: user.email
        },
        create: user
      })
    )
  );

  const userByEmail = new Map(users.map((user) => [user.email, user]));
  const demoUser = userByEmail.get("maya.chen@studentbridge.test");
  if (!demoUser) throw new Error("Demo user was not seeded.");

  await prisma.studentProfile.upsert({
    where: { userId: demoUser.id },
    update: {
      city: "Sydney",
      institution: "QIBA",
      studyArea: "Information Technology",
      arrivalStage: "Settling in",
      goals: ["Make friends", "Find work", "Join forum topics", "Find job opportunities", "Get support"],
      languages: ["English", "Mandarin"],
      preferredEventTypes: ["Networking", "Career", "Workshop", "Community"]
    },
    create: {
      userId: demoUser.id,
      city: "Sydney",
      institution: "QIBA",
      studyArea: "Information Technology",
      arrivalStage: "Settling in",
      goals: ["Make friends", "Find work", "Join forum topics", "Find job opportunities", "Get support"],
      languages: ["English", "Mandarin"],
      preferredEventTypes: ["Networking", "Career", "Workshop", "Community"]
    }
  });

  const topics = [
    ["city-life", "City life", "Practical local tips for transport, libraries, suburbs and everyday Sydney life.", "MapPin", "#1769E0"],
    ["study-help", "Study help", "Ask about study habits, campus services, assignments and academic confidence.", "BookOpen", "#6B4FD8"],
    ["jobs", "Jobs", "Part-time work, internships, resumes and interview questions.", "BriefcaseBusiness", "#1E8A6A"],
    ["events", "Events", "Find people going to talks, workshops and student-friendly events.", "CalendarDays", "#B7791F"],
    ["accommodation", "Accommodation", "Rental inspections, share houses and safe housing questions.", "Home", "#B64242"],
    ["wellbeing", "Wellbeing", "Homesickness, stress, confidence and support pathways.", "Heart", "#1E8A6A"],
    ["general", "General Q&A", "Any practical student-life question that does not fit elsewhere.", "MessageCircle", "#43556A"]
  ];

  for (const [slug, name, description, icon, color] of topics) {
    await prisma.forumTopic.upsert({
      where: { slug },
      update: { name, description, icon, color },
      create: { slug, name, description, icon, color }
    });
  }

  const topicRows = await prisma.forumTopic.findMany();
  const topicBySlug = new Map(topicRows.map((topic) => [topic.slug, topic]));

  const posts = [
    {
      title: "How do I find my first part-time job in Sydney?",
      body: "I am an international student studying commerce and looking for beginner-friendly part-time work. Where should I start?",
      city: "Sydney",
      topic: "jobs",
      tags: ["part-time", "resume", "first job"],
      helpfulCount: 128,
      authorEmail: "arjun.kapoor@studentbridge.test",
      comments: [
        { body: "Start with your campus career service, then check Fair Work before accepting any offer.", authorEmail: "sarah.morgan@studentbridge.test", helpfulCount: 18 },
        { body: "Keep a simple spreadsheet of roles, dates and links so applications do not blur together.", authorEmail: "maya.chen@studentbridge.test", helpfulCount: 12 }
      ]
    },
    {
      title: "Best places to study near Town Hall?",
      body: "I need quiet spaces with Wi-Fi and power outlets. Libraries, cafes or student spaces you recommend?",
      city: "Sydney",
      topic: "study-help",
      tags: ["study", "library", "city"],
      helpfulCount: 96,
      authorEmail: "sarah.morgan@studentbridge.test",
      comments: [
        { body: "Customs House Library is a good first stop, and it is close to trains.", authorEmail: "noor.ahmed@studentbridge.test", helpfulCount: 11 },
        { body: "The State Library reading rooms are reliable when campus gets noisy.", authorEmail: "hana.park@studentbridge.test", helpfulCount: 8 }
      ]
    },
    {
      title: "What should I bring to my first networking event?",
      body: "Going to a tech networking event next week and not sure what to expect. Any tips on what to bring and how to introduce myself?",
      city: "Melbourne",
      topic: "events",
      tags: ["networking", "confidence", "tech"],
      helpfulCount: 74,
      authorEmail: "jason.lee@studentbridge.test",
      comments: [
        { body: "Prepare a 20-second intro, one question about the speaker, and your LinkedIn QR code.", authorEmail: "priya.raman@studentbridge.test", helpfulCount: 21 },
        { body: "Arrive early if you can. It is easier to talk before groups are already formed.", authorEmail: "ethan.wilson@studentbridge.test", helpfulCount: 13 }
      ]
    },
    {
      title: "Has anyone used a Study NSW support hub?",
      body: "I saw they offer help with study, wellbeing and career planning. Curious about your experience and how to book an appointment.",
      city: "Sydney",
      topic: "general",
      tags: ["support", "study nsw", "wellbeing"],
      helpfulCount: 63,
      authorEmail: "priya.raman@studentbridge.test",
      comments: [
        { body: "Use the official Study NSW site to find current support and events.", authorEmail: "maya.chen@studentbridge.test", helpfulCount: 9 }
      ]
    },
    {
      title: "How do rental inspections work?",
      body: "My agent wants to do inspections every 3 months. What are my rights as a tenant in Queensland?",
      city: "Brisbane",
      topic: "accommodation",
      tags: ["renting", "inspection", "housing"],
      helpfulCount: 52,
      authorEmail: "michael.tran@studentbridge.test",
      comments: [
        { body: "This can depend on state law, so check the official tenancy authority before relying on forum advice.", authorEmail: "hana.park@studentbridge.test", helpfulCount: 15 }
      ]
    },
    {
      title: "How do you survive group assignments with strangers?",
      body: "I want to contribute properly but I get nervous speaking first. What process works for group assignments?",
      city: "Sydney",
      topic: "study-help",
      tags: ["group work", "assignments", "confidence"],
      helpfulCount: 47,
      authorEmail: "noor.ahmed@studentbridge.test",
      comments: [
        { body: "Suggest a shared doc with owners and dates. It feels less awkward when the work is visible.", authorEmail: "sofia.garcia@studentbridge.test", helpfulCount: 14 },
        { body: "A short kickoff message helps: goal, deadline, preferred meeting time and who writes notes.", authorEmail: "jason.lee@studentbridge.test", helpfulCount: 10 }
      ]
    },
    {
      title: "Which documents should I bring to a bank appointment?",
      body: "I booked a student bank appointment and want to be prepared. What documents did you take?",
      city: "Sydney",
      topic: "city-life",
      tags: ["banking", "arrival", "documents"],
      helpfulCount: 42,
      authorEmail: "sofia.garcia@studentbridge.test",
      comments: [
        { body: "Bring passport, student confirmation and proof of local address if you have it. Check the bank page before going.", authorEmail: "maya.chen@studentbridge.test", helpfulCount: 17 }
      ]
    },
    {
      title: "How do you track casual work hours around classes?",
      body: "I am worried about overcommitting. What tools or routines help you balance shifts and study?",
      city: "Adelaide",
      topic: "jobs",
      tags: ["casual work", "time management", "study"],
      helpfulCount: 39,
      authorEmail: "ethan.wilson@studentbridge.test",
      comments: [
        { body: "Put classes, travel time and assignment blocks in first, then add shifts around that.", authorEmail: "arjun.kapoor@studentbridge.test", helpfulCount: 12 }
      ]
    },
    {
      title: "Easy ways to meet people after class?",
      body: "Most people leave quickly after lectures. What has worked for making friends without feeling forced?",
      city: "Sydney",
      topic: "wellbeing",
      tags: ["friends", "confidence", "campus"],
      helpfulCount: 35,
      authorEmail: "hana.park@studentbridge.test",
      comments: [
        { body: "Ask if anyone is going for coffee before the next class. Small repeated chats add up.", authorEmail: "mei.lin@studentbridge.test", helpfulCount: 13 },
        { body: "Joining a weekly event is easier than one-off meetups because faces become familiar.", authorEmail: "priya.raman@studentbridge.test", helpfulCount: 9 }
      ]
    },
    {
      title: "Cheap lunch spots near campus?",
      body: "Looking for budget-friendly meals in the city that are not too far from public transport.",
      city: "Sydney",
      topic: "city-life",
      tags: ["food", "budget", "campus"],
      helpfulCount: 32,
      authorEmail: "mei.lin@studentbridge.test",
      comments: [
        { body: "Food courts around Town Hall can be good if you go just before the lunch rush.", authorEmail: "michael.tran@studentbridge.test", helpfulCount: 7 }
      ]
    },
    {
      title: "Is volunteering useful for an IT portfolio?",
      body: "I do not have local experience yet. Would a volunteer web project help when applying for internships?",
      city: "Perth",
      topic: "jobs",
      tags: ["portfolio", "volunteering", "internship"],
      helpfulCount: 30,
      authorEmail: "arjun.kapoor@studentbridge.test",
      comments: [
        { body: "Yes, if you can explain the problem, your role and the outcome. Keep screenshots and a short case study.", authorEmail: "jason.lee@studentbridge.test", helpfulCount: 16 }
      ]
    },
    {
      title: "Anyone going to beginner-friendly tech meetups this month?",
      body: "I want to attend but would feel better going with another student. Which events are good for first-timers?",
      city: "Sydney",
      topic: "events",
      tags: ["meetup", "tech", "first-timer"],
      helpfulCount: 28,
      authorEmail: "noor.ahmed@studentbridge.test",
      comments: [
        { body: "Look for events with a workshop format. They give you something practical to talk about.", authorEmail: "sarah.morgan@studentbridge.test", helpfulCount: 10 }
      ]
    }
  ];

  for (const post of posts) {
    const topic = topicBySlug.get(post.topic);
    const author = userByEmail.get(post.authorEmail);
    if (!topic || !author) continue;

    const existing = await prisma.forumPost.findFirst({ where: { title: post.title } });
    const data = {
      body: post.body,
      city: post.city,
      tags: post.tags,
      helpfulCount: post.helpfulCount,
      replyCount: post.comments.length,
      topicId: topic.id,
      authorId: author.id
    };
    const row = existing
      ? await prisma.forumPost.update({ where: { id: existing.id }, data })
      : await prisma.forumPost.create({ data: { title: post.title, ...data } });

    await prisma.forumComment.deleteMany({ where: { postId: row.id } });
    for (const [index, comment] of post.comments.entries()) {
      const commentAuthor = userByEmail.get(comment.authorEmail);
      if (!commentAuthor) continue;
      await prisma.forumComment.create({
        data: {
          id: `${row.id}-seed-comment-${index + 1}`,
          body: comment.body,
          helpfulCount: comment.helpfulCount,
          postId: row.id,
          authorId: commentAuthor.id
        }
      });
    }
  }

  const jobs = [
    {
      title: "Junior Data Analyst Intern",
      company: "Data Insights Australia",
      city: "Sydney",
      workType: "Internship",
      industry: "Data & Analytics",
      experienceLevel: "Entry level",
      closingDate: new Date("2026-06-12T00:00:00.000Z"),
      description: "Support analytics team members with real datasets, dashboards and simple insights.",
      tags: ["SQL", "Excel", "Dashboarding", "Remote OK"],
      applyUrl: "https://example.com/jobs/data-analyst-intern"
    },
    {
      title: "Part-time IT Support Assistant",
      company: "TechConnect Solutions",
      city: "Melbourne",
      workType: "Part-time",
      industry: "IT Support",
      experienceLevel: "Beginner friendly",
      closingDate: new Date("2026-06-18T00:00:00.000Z"),
      description: "Help clients with basic tech support. Training provided and flexible student hours available.",
      tags: ["Customer service", "On-site", "20 hrs/week"],
      applyUrl: "https://example.com/jobs/it-support-assistant"
    },
    {
      title: "Graduate Marketing Coordinator",
      company: "BrightPath Marketing",
      city: "Sydney",
      workType: "Graduate",
      industry: "Marketing",
      experienceLevel: "Graduate",
      closingDate: new Date("2026-06-30T00:00:00.000Z"),
      description: "Join a small marketing team and help deliver digital campaigns for education and community clients.",
      tags: ["Content", "Digital campaigns", "Graduate"],
      applyUrl: "https://example.com/jobs/marketing-coordinator"
    },
    {
      title: "Volunteer Web Project",
      company: "Community Web Builders",
      city: "Australia-wide",
      workType: "Volunteer",
      industry: "Web Development",
      experienceLevel: "Student project",
      closingDate: null,
      description: "Build websites with other students for local not-for-profits and community groups.",
      tags: ["Portfolio", "Remote", "Community"],
      applyUrl: "https://example.com/jobs/volunteer-web-project",
      paid: false
    }
  ];

  for (const job of jobs) {
    const existing = await prisma.jobOpportunity.findFirst({ where: { title: job.title, company: job.company } });
    const data = {
      verified: true,
      city: job.city,
      workType: job.workType,
      industry: job.industry,
      experienceLevel: job.experienceLevel,
      workRightsFriendly: true,
      paid: job.paid ?? true,
      closingDate: job.closingDate,
      description: job.description,
      tags: job.tags,
      applyUrl: job.applyUrl
    };
    if (existing) {
      await prisma.jobOpportunity.update({ where: { id: existing.id }, data });
    } else {
      await prisma.jobOpportunity.create({ data: { title: job.title, company: job.company, ...data } });
    }
  }

  const supportResources = [
    { title: "Fair Work Ombudsman", category: "Work rights", description: "Official information about pay, workplace rights and minimum conditions in Australia.", url: "https://www.fairwork.gov.au/", tags: ["work rights", "pay", "jobs"] },
    { title: "Study Australia support", category: "Student support", description: "Official national support information for international students in Australia.", url: "https://www.studyaustralia.gov.au/en/life-in-australia/student-support-services", tags: ["support", "student services"] },
    { title: "Study NSW", category: "Study hub", description: "NSW support, events and practical resources for international students.", url: "https://www.study.nsw.gov.au/", tags: ["NSW", "study hub"] },
    { title: "Emergency services", category: "Safety", description: "Call 000 in life-threatening emergencies requiring police, fire or ambulance.", url: "https://www.triplezero.gov.au/", tags: ["emergency", "safety"] },
    { title: "Lifeline Australia", category: "Wellbeing", description: "24-hour crisis support and suicide prevention services.", url: "https://www.lifeline.org.au/", tags: ["wellbeing", "mental health"] }
  ];

  for (const resource of supportResources) {
    const existing = await prisma.supportResource.findFirst({ where: { title: resource.title } });
    const data = { category: resource.category, description: resource.description, url: resource.url, official: true, tags: resource.tags };
    if (existing) {
      await prisma.supportResource.update({ where: { id: existing.id }, data });
    } else {
      await prisma.supportResource.create({ data: { title: resource.title, ...data } });
    }
  }

  const plans = [
    {
      slug: "free",
      name: "Free",
      description: "Core StudentBridge access for events, forum, jobs and official support.",
      priceMonthlyCents: 0,
      aiMonthlyLimit: 5,
      highlighted: false,
      features: ["Events and forum access", "Job board browsing", "Official support resources", "5 AI Guide uses per month"]
    },
    {
      slug: "plus",
      name: "Plus",
      description: "More AI help for active job search and weekly planning.",
      priceMonthlyCents: 799,
      aiMonthlyLimit: 100,
      highlighted: true,
      features: ["100 AI Guide uses per month", "Job alerts", "Saved folders", "Weekly networking and job-search plans"]
    },
    {
      slug: "pro",
      name: "Pro",
      description: "High-usage coaching for resumes, interviews and opportunity matching.",
      priceMonthlyCents: 1499,
      aiMonthlyLimit: 300,
      highlighted: false,
      features: ["300 AI Guide uses per month", "Resume and LinkedIn coaching", "Interview prep", "Advanced job-fit explanations"]
    }
  ];

  for (const plan of plans) {
    await prisma.subscriptionPlan.upsert({
      where: { slug: plan.slug },
      update: plan,
      create: plan
    });
  }

  const freePlan = await prisma.subscriptionPlan.findUniqueOrThrow({ where: { slug: "free" } });
  const existingSubscription = await prisma.userSubscription.findFirst({ where: { userId: demoUser.id, status: "ACTIVE" } });
  if (existingSubscription) {
    await prisma.userSubscription.update({
      where: { id: existingSubscription.id },
      data: { planId: freePlan.id }
    });
  } else {
    await prisma.userSubscription.create({
      data: {
        userId: demoUser.id,
        planId: freePlan.id,
        status: "ACTIVE"
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
