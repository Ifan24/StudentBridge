import { AppShell, PageHeader } from "@/components/app-shell";
import { ForumBoard } from "@/components/forum-board";
import { getForumData } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ForumPage() {
  const { topics, posts } = await getForumData();

  return (
    <AppShell>
      <PageHeader title="Forum" description="Ask questions, share tips and get trusted peer help as an international student in Australia." />
      <ForumBoard topics={topics} posts={posts} />
    </AppShell>
  );
}
