import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export default async function BlogTeaser() {
  const supabase = await createClient();
  const { count } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published');

  if (!count || count === 0) {
    return null;
  }

  const { data: posts } = await supabase
    .from('posts')
    .select('slug, title, excerpt, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(3);

  if (!posts?.length) {
    return null;
  }

  return (
    <section className="section-padding">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-end justify-between mb-12">
          <h2 className="heading-lg">From the build log</h2>
          <Link href="/blog" className="text-sm font-medium hover:text-gray-600 transition-colors">
            View all posts <ArrowRight className="inline h-4 w-4 ml-1" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group border-t border-gray-200 pt-6"
            >
              <h3 className="text-xl font-bold mb-3 group-hover:text-gray-600 transition-colors">
                {post.title}
              </h3>
              {post.excerpt && (
                <p className="text-gray-600 text-sm line-clamp-3">{post.excerpt}</p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
