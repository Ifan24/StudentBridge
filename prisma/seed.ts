import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const demoUserId = "demo-user";

async function main() {
  const user = await prisma.user.upsert({
    where: { id: demoUserId },
    update: {
      name: "Ruiqi Li",
      email: "ruiqili1024@gmail.com"
    },
    create: {
      id: demoUserId,
      name: "Ruiqi Li",
      email: "ruiqili1024@gmail.com"
    }
  });

  await prisma.studentProfile.upsert({
    where: { userId: user.id },
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
      userId: user.id,
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
      helpfulCount: 128
    },
    {
      title: "Best places to study near Town Hall?",
      body: "I need quiet spaces with Wi-Fi and power outlets. Libraries, cafes or student spaces you recommend?",
      city: "Sydney",
      topic: "study-help",
      tags: ["study", "library", "city"],
      helpfulCount: 96
    },
    {
      title: "What should I bring to my first networking event?",
      body: "Going to a tech networking event next week and not sure what to expect. Any tips on what to bring and how to introduce myself?",
      city: "Melbourne",
      topic: "events",
      tags: ["networking", "confidence", "tech"],
      helpfulCount: 74
    },
    {
      title: "Has anyone used a Study NSW support hub?",
      body: "I saw they offer help with study, wellbeing and career planning. Curious about your experience and how to book an appointment.",
      city: "Sydney",
      topic: "general",
      tags: ["support", "study nsw", "wellbeing"],
      helpfulCount: 63
    },
    {
      title: "How do rental inspections work?",
      body: "My agent wants to do inspections every 3 months. What are my rights as a tenant in Queensland?",
      city: "Brisbane",
      topic: "accommodation",
      tags: ["renting", "inspection", "housing"],
      helpfulCount: 52
    }
  ];

  for (const post of posts) {
    const topic = topicBySlug.get(post.topic);
    if (!topic) continue;
    const existing = await prisma.forumPost.findFirst({ where: { title: post.title } });
    const data = {
      body: post.body,
      city: post.city,
      tags: post.tags,
      helpfulCount: post.helpfulCount,
      replyCount: 1,
      topicId: topic.id,
      authorId: user.id
    };
    const row = existing
      ? await prisma.forumPost.update({ where: { id: existing.id }, data })
      : await prisma.forumPost.create({ data: { title: post.title, ...data } });

    await prisma.forumComment.upsert({
      where: { id: `${row.id}-seed-comment` },
      update: {
        body: "This is a useful question. Keep personal details private and check official sources when the answer affects work rights, money or safety."
      },
      create: {
        id: `${row.id}-seed-comment`,
        body: "This is a useful question. Keep personal details private and check official sources when the answer affects work rights, money or safety.",
        postId: row.id,
        authorId: user.id
      }
    });
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
  const existingSubscription = await prisma.userSubscription.findFirst({ where: { userId: user.id, status: "ACTIVE" } });
  if (existingSubscription) {
    await prisma.userSubscription.update({
      where: { id: existingSubscription.id },
      data: { planId: freePlan.id }
    });
  } else {
    await prisma.userSubscription.create({
      data: {
        userId: user.id,
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
