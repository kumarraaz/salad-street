import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BLOGS } from "@/lib/data";
import { Cta, PageHero, Tbc } from "@/components/ui";
import Media from "@/components/Media";

export const dynamicParams = false;
export function generateStaticParams() {
  return BLOGS.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: BLOGS.find((b) => b.slug === slug)?.title || "Blog" };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const b = BLOGS.find((x) => x.slug === slug);
  if (!b) notFound();
  return (
    <>
      <PageHero title={b.title} trail={[{ label: "Blog", href: "/blog" }, { label: b.title }]} />
      <section className="sec">
        <div className="wrap">
          <article className="article">
            <Media src={b.img} label={"Blog cover · " + b.title} alt={b.title} />
            <p>{b.excerpt}</p>
            <p>
              <Tbc t="Full article content to be supplied by Salad Street." on />
            </p>
            <Cta label="Back to all blogs" href="/blog" />
          </article>
        </div>
      </section>
    </>
  );
}
