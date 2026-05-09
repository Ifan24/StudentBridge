"use client";

import { FormEvent, useMemo, useState } from "react";
import { Bookmark, CheckCircle2, Flag, MessageCircle, Plus, Search, ThumbsUp } from "lucide-react";
import type { ForumCommentView, ForumPostView, ForumTopicView } from "@/lib/types";
import { Pill } from "@/components/ui";

export function ForumBoard({ topics, posts }: { topics: ForumTopicView[]; posts: ForumPostView[] }) {
  const [allPosts, setAllPosts] = useState(posts);
  const [topic, setTopic] = useState("all");
  const [sort, setSort] = useState<"trending" | "newest" | "unanswered">("trending");
  const [query, setQuery] = useState("");
  const [composerOpen, setComposerOpen] = useState(false);
  const [saved, setSaved] = useState<Set<string>>(new Set());
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
    <div className="grid gap-6 lg:grid-cols-[280px_1fr_340px]">
      <aside className="panel h-fit p-5">
        <button onClick={() => setTopic("all")} className={`focus-ring mb-5 flex w-full items-center gap-2 rounded-md px-3 py-3 text-sm font-extrabold ${topic === "all" ? "bg-mist text-bridge" : "text-ink"}`}>
          <MessageCircle className="h-4 w-4" /> All topics
        </button>
        <p className="muted-label">Browse by topic</p>
        <div className="mt-3 space-y-1">
          {topics.map((item) => (
            <button key={item.slug} onClick={() => setTopic(item.slug)} className={`focus-ring flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-bold ${topic === item.slug ? "bg-mist text-bridge" : "text-muted hover:bg-mist"}`}>
              {item.name}
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            </button>
          ))}
        </div>
        <div className="mt-7 rounded-md bg-notice p-4 text-sm leading-6 text-muted">
          Keep private details out of posts. High-risk questions should be checked with official sources.
        </div>
      </aside>

      <section>
        <div className="mb-4 grid gap-3 md:grid-cols-[1fr_auto]">
          <label className="flex min-h-12 items-center gap-2 rounded-md border border-line px-4">
            <Search className="h-5 w-5 text-muted" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search questions, topics or student tips..." className="w-full border-0 bg-transparent text-sm outline-none" />
          </label>
          <button onClick={() => setComposerOpen((value) => !value)} className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-bridge px-5 py-3 text-sm font-extrabold text-white">
            <Plus className="h-4 w-4" /> Ask question
          </button>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {(["trending", "newest", "unanswered"] as const).map((item) => (
            <button key={item} onClick={() => setSort(item)} className={`focus-ring rounded-md border px-4 py-2 text-sm font-extrabold capitalize ${sort === item ? "border-bridge bg-blue-50 text-bridge" : "border-line text-muted"}`}>
              {item}
            </button>
          ))}
        </div>

        {composerOpen && (
          <form onSubmit={createPost} className="panel mb-5 p-5">
            <div className="grid gap-3 md:grid-cols-[1fr_160px_180px]">
              <input name="title" required minLength={8} placeholder="Question title" className="rounded-md border border-line px-3 py-3 text-sm outline-none focus:border-bridge" />
              <input name="city" defaultValue="Sydney" className="rounded-md border border-line px-3 py-3 text-sm outline-none focus:border-bridge" />
              <select name="topic" className="rounded-md border border-line px-3 py-3 text-sm font-bold outline-none focus:border-bridge">
                {topics.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
              </select>
            </div>
            <textarea name="body" required minLength={10} placeholder="Add useful context. Avoid private contact details." className="mt-3 min-h-28 w-full rounded-md border border-line px-3 py-3 text-sm outline-none focus:border-bridge" />
            <input name="tags" placeholder="tags, comma separated" className="mt-3 w-full rounded-md border border-line px-3 py-3 text-sm outline-none focus:border-bridge" />
            <button className="focus-ring mt-3 rounded-md bg-bridge px-5 py-3 text-sm font-extrabold text-white">Post question</button>
          </form>
        )}

        <div className="space-y-4">
          {filtered.map((post) => (
            <ThreadCard key={post.id} post={post} saved={saved.has(post.id)} reported={reported.has(post.id)} onVote={() => vote(post.id)} onSave={() => toggleSaved(post.id)} onReport={() => report(post.id)} onComment={addComment} />
          ))}
        </div>
      </section>

      <aside className="space-y-5">
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
        <button onClick={onVote} className="focus-ring grid h-20 place-items-center rounded-md border border-line text-sm font-extrabold text-bridge">
          <ThumbsUp className="h-4 w-4" />
          {post.helpfulCount}
        </button>
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
          <button onClick={onSave} className="focus-ring grid h-10 w-10 place-items-center rounded-md border border-line text-bridge">
            {saved ? <CheckCircle2 className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
          </button>
          <button onClick={onReport} className="focus-ring grid h-10 w-10 place-items-center rounded-md border border-line text-danger">
            {reported ? <CheckCircle2 className="h-4 w-4" /> : <Flag className="h-4 w-4" />}
          </button>
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
          <input value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Reply with a helpful answer..." className="min-w-0 flex-1 rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-bridge" />
          <button className="focus-ring rounded-md bg-bridge px-4 py-2 text-sm font-extrabold text-white">Reply</button>
        </form>
      </div>
    </article>
  );
}
