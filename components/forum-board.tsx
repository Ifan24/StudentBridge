"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Bookmark, CheckCircle2, Flag, MessageCircle, Plus, Search, ThumbsUp } from "lucide-react";
import type { ForumCommentView, ForumPostView, ForumTopicView } from "@/lib/types";
import { EmptyState, Pagination, Pill } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const FORUM_PAGE_SIZE = 3;

export function ForumBoard({ topics, posts, initialSavedIds = [] }: { topics: ForumTopicView[]; posts: ForumPostView[]; initialSavedIds?: string[] }) {
  const [allPosts, setAllPosts] = useState(posts);
  const [topic, setTopic] = useState("all");
  const [sort, setSort] = useState<"trending" | "newest" | "unanswered">("trending");
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [composerOpen, setComposerOpen] = useState(false);
  const [saved, setSaved] = useState<Set<string>>(() => new Set(initialSavedIds));
  const [reported, setReported] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const result = allPosts.filter((post) => {
      const text = `${post.title} ${post.body} ${post.tags.join(" ")} ${post.city}`.toLowerCase();
      return (topic === "all" || post.topic.slug === topic) && text.includes(query.toLowerCase());
    });
    if (sort === "newest") return result.toSorted((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
    if (sort === "unanswered") return result.filter((post) => post.replyCount === 0);
    return result.toSorted((a, b) => b.helpfulCount - a.helpfulCount);
  }, [allPosts, topic, sort, query]);

  useEffect(() => {
    setCurrentPage(1);
  }, [topic, sort, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / FORUM_PAGE_SIZE));
  const pageStart = (currentPage - 1) * FORUM_PAGE_SIZE;
  const visiblePosts = filtered.slice(pageStart, pageStart + FORUM_PAGE_SIZE);

  async function createPost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      title: String(form.get("title") ?? ""),
      body: String(form.get("body") ?? ""),
      city: String(form.get("city") ?? "Sydney"),
      topicSlug: String(form.get("topic") ?? "general"),
      tags: String(form.get("tags") ?? "").split(",").map((tag) => tag.trim()).filter(Boolean)
    };
    const response = await fetch("/api/forum/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = (await response.json()) as { post: ForumPostView };
    setAllPosts((current) => [data.post, ...current]);
    setComposerOpen(false);
    event.currentTarget.reset();
  }

  async function addComment(postId: string, body: string) {
    const response = await fetch("/api/forum/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, body })
    });
    const data = (await response.json()) as { comment: ForumCommentView };
    setAllPosts((current) =>
      current.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, data.comment], replyCount: post.replyCount + 1 }
          : post
      )
    );
  }

  async function vote(postId: string) {
    await fetch("/api/forum/votes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, value: 1 })
    });
    setAllPosts((current) => current.map((post) => (post.id === postId ? { ...post, helpfulCount: post.helpfulCount + 1 } : post)));
  }

  async function toggleSaved(postId: string) {
    const next = new Set(saved);
    const isSaved = next.has(postId);
    if (isSaved) next.delete(postId);
    else next.add(postId);
    setSaved(next);
    await fetch("/api/saved", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemType: "post", itemId: postId, saved: !isSaved })
    });
  }

  async function report(postId: string) {
    setReported((current) => new Set(current).add(postId));
    await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetType: "post", targetId: postId, reason: "Reported from MVP forum UI" })
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[240px_minmax(0,1fr)] 2xl:grid-cols-[260px_minmax(0,1fr)_320px]">
      <aside className="panel h-fit p-5">
        <Button onClick={() => setTopic("all")} variant={topic === "all" ? "secondary" : "ghost"} className={`mb-5 h-12 w-full justify-start rounded-md px-3 text-sm font-extrabold ${topic === "all" ? "bg-mist text-bridge" : "text-ink"}`}>
          <MessageCircle className="h-4 w-4" /> All topics
        </Button>
        <p className="muted-label">Browse by topic</p>
        <div className="mt-3 space-y-1">
          {topics.map((item) => (
            <Button key={item.slug} onClick={() => setTopic(item.slug)} variant={topic === item.slug ? "secondary" : "ghost"} className={`h-10 w-full justify-between rounded-md px-3 text-left text-sm font-bold ${topic === item.slug ? "bg-mist text-bridge" : "text-muted hover:bg-mist"}`}>
              {item.name}
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            </Button>
          ))}
        </div>
        <div className="mt-7 rounded-md bg-notice p-4 text-sm leading-6 text-muted">
          Keep private details out of posts. High-risk questions should be checked with official sources.
        </div>
      </aside>

      <section>
        <div className="mb-4 grid gap-3 md:grid-cols-[1fr_auto]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search questions, topics or student tips..." className="h-12 rounded-md border-line pl-11 text-sm" />
          </label>
          <Button onClick={() => setComposerOpen((value) => !value)} size="lg" className="h-12 rounded-md px-5 text-sm font-extrabold">
            <Plus data-icon="inline-start" /> Ask question
          </Button>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {(["trending", "newest", "unanswered"] as const).map((item) => (
            <Button key={item} variant={sort === item ? "secondary" : "outline"} onClick={() => setSort(item)} className={`rounded-md border px-4 py-2 text-sm font-extrabold capitalize ${sort === item ? "border-bridge bg-blue-50 text-bridge" : "border-line text-muted"}`}>
              {item}
            </Button>
          ))}
        </div>

        {composerOpen && (
          <form onSubmit={createPost} className="panel mb-5 p-5">
            <div className="grid gap-3 xl:grid-cols-[1fr_160px_180px]">
              <Input name="title" required minLength={8} placeholder="Question title" className="h-12 rounded-md border-line text-sm" />
              <Input name="city" defaultValue="Sydney" className="h-12 rounded-md border-line text-sm" />
              <Select name="topic" defaultValue={topics[0]?.slug ?? "general"}>
                <SelectTrigger className="h-12 w-full rounded-md border-line px-3 text-sm font-bold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {topics.map((item) => <SelectItem key={item.slug} value={item.slug}>{item.name}</SelectItem>)}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <Textarea name="body" required minLength={10} placeholder="Add useful context. Avoid private contact details." className="mt-3 min-h-28 rounded-md border-line px-3 py-3 text-sm" />
            <Input name="tags" placeholder="tags, comma separated" className="mt-3 h-12 rounded-md border-line text-sm" />
            <Button className="mt-3 h-12 rounded-md px-5 text-sm font-extrabold">Post question</Button>
          </form>
        )}

        <div className="space-y-4">
          {visiblePosts.length ? (
            visiblePosts.map((post) => (
              <ThreadCard key={post.id} post={post} saved={saved.has(post.id)} reported={reported.has(post.id)} onVote={() => vote(post.id)} onSave={() => toggleSaved(post.id)} onReport={() => report(post.id)} onComment={addComment} />
            ))
          ) : (
            <EmptyState title="No forum posts found" body="Try a different topic, sort or search term to browse the demo forum." />
          )}
        </div>
        <Pagination page={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} label={`Page ${currentPage} of ${totalPages}`} />
      </section>

      <aside className="space-y-5 xl:col-span-2 2xl:col-span-1">
        <div className="panel p-5">
          <p className="muted-label">Recommended threads</p>
          <div className="mt-4 space-y-3">
            {allPosts.slice(0, 4).map((post) => (
              <div key={post.id} className="rounded-md border border-line p-3">
                <p className="text-sm font-extrabold">{post.title}</p>
                <p className="mt-1 text-xs text-muted">{post.replyCount} replies · {post.city}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="panel p-5">
          <p className="muted-label">Community standards</p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-muted">
            <li>Be respectful and practical.</li>
            <li>No private contact details.</li>
            <li>Report suspicious advice.</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}

function ThreadCard({
  post,
  saved,
  reported,
  onVote,
  onSave,
  onReport,
  onComment
}: {
  post: ForumPostView;
  saved: boolean;
  reported: boolean;
  onVote: () => void;
  onSave: () => void;
  onReport: () => void;
  onComment: (postId: string, body: string) => void;
}) {
  const [comment, setComment] = useState("");

  return (
    <article className="panel p-5">
      <div className="grid gap-4 md:grid-cols-[72px_1fr_auto]">
        <Button onClick={onVote} variant="outline" className="grid h-20 place-items-center rounded-md border-line text-sm font-extrabold text-bridge">
          <ThumbsUp className="h-4 w-4" />
          {post.helpfulCount}
        </Button>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Pill>{post.topic.name}</Pill>
            <span className="text-xs font-bold text-muted">{post.city}</span>
            {post.status === "NEEDS_REVIEW" && <Pill tone="amber">Needs review</Pill>}
          </div>
          <h3 className="mt-3 text-xl font-extrabold">{post.title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted">{post.body}</p>
          <p className="mt-3 text-xs font-bold text-muted">{post.authorName} · {new Date(post.createdAt).toLocaleDateString("en-AU")}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => <Pill key={tag} tone="neutral">{tag}</Pill>)}
          </div>
        </div>
        <div className="flex gap-2 md:flex-col">
          <Button onClick={onSave} variant="outline" size="icon-lg" className="rounded-md border-line text-bridge">
            {saved ? <CheckCircle2 className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
          </Button>
          <Button onClick={onReport} variant="outline" size="icon-lg" className="rounded-md border-line text-danger">
            {reported ? <CheckCircle2 className="h-4 w-4" /> : <Flag className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      <div className="mt-5 rounded-md bg-mist p-4">
        <p className="text-sm font-extrabold">{post.replyCount} replies</p>
        <div className="mt-3 space-y-3">
          {post.comments.slice(0, 2).map((reply) => (
            <div key={reply.id} className="rounded-md bg-white p-3 text-sm leading-6 text-muted">
              <strong className="text-ink">{reply.authorName}:</strong> {reply.body}
            </div>
          ))}
        </div>
        <form
          className="mt-3 flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            if (!comment.trim()) return;
            onComment(post.id, comment.trim());
            setComment("");
          }}
        >
          <Input value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Reply with a helpful answer..." className="min-w-0 flex-1 rounded-md border-line text-sm" />
          <Button className="rounded-md px-4 text-sm font-extrabold">Reply</Button>
        </form>
      </div>
    </article>
  );
}
