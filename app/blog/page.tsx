import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Notes from the build log — AI systems, workflows, and practical automation for small businesses.',
};

export default async function BlogPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from('posts')
    .select('slug, title, excerpt, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-32">
        <section className="section-padding">
          <div className="container mx-auto max-w-6xl">
            <h1 className="heading-lg mb-8">From the build log</h1>

            {!posts?.length ? (
              <div className="border-t border-gray-200 pt-12 max-w-2xl">
                <p className="text-xl text-gray-600 mb-4 font-display">
                  Posts coming soon.
                </p>
                <p className="text-gray-500 font-display">
                  I&apos;m writing about practical AI builds, workflow automation, and what actually works for small businesses. Check back soon — or{' '}
                  <Link href="/contact" className="text-black underline hover:no-underline">
                    start a conversation
                  </Link>{' '}
                  if you have a bottleneck now.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                {posts.map((post) => (
                  <article key={post.slug} className="group border-t border-gray-200 pt-8">
                    <Link href={`/blog/${post.slug}`} className="block space-y-4">
                      {post.published_at && (
                        <time
                          dateTime={post.published_at}
                          className="text-sm text-gray-500"
                        >
                          {new Date(post.published_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </time>
                      )}
                      <h2 className="text-2xl font-bold group-hover:text-gray-600 transition-colors">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-gray-600">{post.excerpt}</p>
                      )}
                      <span className="inline-flex items-center gap-2 text-black font-medium">
                        Read more
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
