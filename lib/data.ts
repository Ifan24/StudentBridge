import { DEMO_USER_ID } from "@/lib/constants";
import {
  mockForumPosts,
  mockJobs,
  mockSubscriptionPlans,
  mockProfile,
  mockSupportResources,
  mockTopics
} from "@/lib/mock-data";
import { hasDatabaseUrl, logServerFallback, prisma } from "@/lib/prisma";
import type {
  ForumPostView,
  ForumTopicView,
  JobOpportunityView,
  StudentProfileView,
  SubscriptionPlanView,
  SubscriptionStateView,
  SupportResourceView
} from "@/lib/types";

async function withFallback<T>(work: () => Promise<T>, fallback: T): Promise<T> {
  if (!hasDatabaseUrl()) return fallback;
  try {
    return await work();
  } catch (error) {
    logServerFallback("Database unavailable, using mock data:", error);
    return fallback;
  }
}

export async function ensureDemoUser() {
  if (!hasDatabaseUrl()) return null;
  return prisma.user.upsert({
    where: { id: DEMO_USER_ID },
    update: {
      name: "Maya Chen",
      email: "maya.chen@studentbridge.test"
    },
    create: {
      id: DEMO_USER_ID,
      name: "Maya Chen",
      email: "maya.chen@studentbridge.test"
    }
  });
}

export async function getStudentProfile(): Promise<StudentProfileView> {
  return withFallback(async () => {
    await ensureDemoUser();
    const profile = await prisma.studentProfile.findUnique({ where: { userId: DEMO_USER_ID } });
    if (!profile) return mockProfile;
    return {
      id: profile.id,
      city: profile.city,
      institution: profile.institution,
      studyArea: profile.studyArea,
      arrivalStage: profile.arrivalStage,
      goals: profile.goals,
      languages: profile.languages,
      preferredEventTypes: profile.preferredEventTypes
    };
  }, mockProfile);
}

export async function getForumData(): Promise<{ topics: ForumTopicView[]; posts: ForumPostView[] }> {
  return withFallback(async () => {
    const [topics, posts] = await Promise.all([
      prisma.forumTopic.findMany({ orderBy: { name: "asc" } }),
      prisma.forumPost.findMany({
        include: {
          author: true,
          topic: true,
          comments: { include: { author: true }, orderBy: { createdAt: "asc" } }
        },
        orderBy: [{ helpfulCount: "desc" }, { createdAt: "desc" }]
      })
    ]);
    return {
      topics: topics.map(mapTopic),
      posts: posts.map((post) => ({
        id: post.id,
        title: post.title,
        body: post.body,
        city: post.city,
        tags: post.tags,
        status: post.status,
        helpfulCount: post.helpfulCount,
        replyCount: post.comments.length,
        topic: mapTopic(post.topic),
        authorName: post.author.name,
        comments: post.comments.map((comment) => ({
          id: comment.id,
          body: comment.body,
          authorName: comment.author.name,
          helpfulCount: comment.helpfulCount,
          createdAt: comment.createdAt.toISOString()
        })),
        createdAt: post.createdAt.toISOString()
      }))
    };
  }, { topics: mockTopics, posts: mockForumPosts });
}

export async function getJobs(): Promise<JobOpportunityView[]> {
  return withFallback(async () => {
    const jobs = await prisma.jobOpportunity.findMany({ orderBy: [{ verified: "desc" }, { createdAt: "desc" }] });
    return jobs.map((job) => ({
      id: job.id,
      title: job.title,
      company: job.company,
      verified: job.verified,
      city: job.city,
      workType: job.workType,
      industry: job.industry,
      experienceLevel: job.experienceLevel,
      workRightsFriendly: job.workRightsFriendly,
      paid: job.paid,
      closingDate: job.closingDate?.toISOString() ?? null,
      description: job.description,
      tags: job.tags,
      applyUrl: job.applyUrl
    }));
  }, mockJobs);
}

export async function getSupportResources(): Promise<SupportResourceView[]> {
  return withFallback(async () => {
    const resources = await prisma.supportResource.findMany({ orderBy: [{ category: "asc" }, { title: "asc" }] });
    return resources.map((resource) => ({
      id: resource.id,
      title: resource.title,
      category: resource.category,
      description: resource.description,
      url: resource.url,
      official: resource.official,
      tags: resource.tags
    }));
  }, mockSupportResources);
}

export async function getSubscriptionState(): Promise<SubscriptionStateView> {
  return withFallback(async () => {
    await ensureDemoUser();
    const [plans, subscription, aiUsedThisMonth] = await Promise.all([
      prisma.subscriptionPlan.findMany({ orderBy: [{ priceMonthlyCents: "asc" }] }),
      prisma.userSubscription.findFirst({
        where: { userId: DEMO_USER_ID, status: "ACTIVE" },
        include: { plan: true },
        orderBy: { startedAt: "desc" }
      }),
      prisma.aiInteraction.count({
        where: {
          userId: DEMO_USER_ID,
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      })
    ]);
    return {
      activePlanSlug: subscription?.plan.slug ?? "free",
      aiUsedThisMonth,
      periodLabel: new Intl.DateTimeFormat("en-AU", { month: "long", year: "numeric" }).format(new Date()),
      plans: plans.map(mapSubscriptionPlan)
    };
  }, {
    activePlanSlug: "free",
    aiUsedThisMonth: 2,
    periodLabel: new Intl.DateTimeFormat("en-AU", { month: "long", year: "numeric" }).format(new Date()),
    plans: mockSubscriptionPlans
  });
}

export async function getActiveSubscriptionLimit(): Promise<{ activePlanSlug: string; aiMonthlyLimit: number; aiUsedThisMonth: number }> {
  const state = await getSubscriptionState();
  const activePlan = state.plans.find((plan) => plan.slug === state.activePlanSlug) ?? state.plans[0];
  return {
    activePlanSlug: activePlan.slug,
    aiMonthlyLimit: activePlan.aiMonthlyLimit,
    aiUsedThisMonth: state.aiUsedThisMonth
  };
}

function mapTopic(topic: { id: string; slug: string; name: string; description: string; icon: string; color: string }): ForumTopicView {
  return {
    id: topic.id,
    slug: topic.slug,
    name: topic.name,
    description: topic.description,
    icon: topic.icon,
    color: topic.color
  };
}

function mapSubscriptionPlan(plan: SubscriptionPlanView): SubscriptionPlanView {
  return {
    id: plan.id,
    slug: plan.slug,
    name: plan.name,
    description: plan.description,
    priceMonthlyCents: plan.priceMonthlyCents,
    aiMonthlyLimit: plan.aiMonthlyLimit,
    features: plan.features,
    highlighted: plan.highlighted
  };
}
