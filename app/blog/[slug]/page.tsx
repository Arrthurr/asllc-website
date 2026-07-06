import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { createClient } from '@/lib/supabase/server';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from('posts')
    .select('title, excerpt')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!post) {
    return { title: 'Post not found' };
  }

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from('posts')
    .select('title, body, excerpt, published_at')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-32">
        <article className="section-padding">
          <div className="container mx-auto max-w-3xl">
            <header className="mb-12">
              {post.published_at && (
                <time
                  dateTime={post.published_at}
                  className="text-sm text-gray-500 block mb-4"
                >
                  {new Date(post.published_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              )}
              <h1 className="text-5xl font-bold">{post.title}</h1>
              {post.excerpt && (
                <p className="text-xl text-gray-600 mt-6 font-display">{post.excerpt}</p>
              )}
            </header>

            <div className="prose prose-lg max-w-none whitespace-pre-wrap font-display">
              {post.body}
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
