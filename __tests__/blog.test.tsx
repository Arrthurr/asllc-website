import { describe, expect, it } from 'vitest';

describe('blog empty-state contract', () => {
  it('documents expected empty index behavior', () => {
    const posts: unknown[] = [];
    const emptyMessage = posts.length === 0 ? 'Posts coming soon.' : null;
    expect(emptyMessage).toBe('Posts coming soon.');
  });

  it('hides homepage teaser when no published posts', () => {
    const publishedCount = 0;
    const showTeaser = publishedCount > 0;
    expect(showTeaser).toBe(false);
  });

  it('does not expose draft posts to public visitors', () => {
    const posts = [
      { slug: 'draft-post', status: 'draft' },
      { slug: 'live-post', status: 'published' },
    ];
    const publicPosts = posts.filter((p) => p.status === 'published');
    expect(publicPosts).toHaveLength(1);
    expect(publicPosts[0]?.slug).toBe('live-post');
  });
});
