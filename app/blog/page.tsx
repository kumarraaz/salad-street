import type { Metadata } from "next";
import { BLOGS } from "@/lib/data";
import { PageHero } from "@/components/ui";
import { BlogCard } from "@/components/Cards";

export const metadata: Metadata = { title: "Power Blog" };

export default function BlogPage() {
  return (
    <>
      <PageHero title="Power Blog" sub="Fresh ideas, healthy living and stories from our farm." trail={[{ label: "Blog" }]} />
      <section className="sec">
        <div className="wrap">
          <div className="bgrid">
            {BLOGS.map((b) => (
              <BlogCard key={b.slug} b={b} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
