import { AppShell, PageHeader } from "@/components/app-shell";
import { ForumBoard } from "@/components/forum-board";
import { getForumData, getSavedItemIds } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ForumPage() {
  const [{ topics, posts }, savedPostIds] = await Promise.all([
    getForumData(),
    getSavedItemIds("post")
  ]);

  return (
    <AppShell>
      <PageHeader title="Forum" description="Ask questions, share tips and get trusted peer help as an international student in Australia." />
      <ForumBoard topics={topics} posts={posts} initialSavedIds={savedPostIds} />
    </AppShell>
  );
}
