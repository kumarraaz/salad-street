import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
import Recipes from "@/components/Recipes";

export const metadata: Metadata = {
  title: "Fresh Recipes",
  description: "Easy recipes made with Salad Street salad greens, herbs and microgreens, with recipe videos.",
  alternates: { canonical: "/recipes" },
};

export default function RecipesPage() {
  return (
    <>
      <PageHero title="Fresh Recipes" sub="Easy, healthy recipes made with our farm-fresh greens. Press play to watch the recipe video." trail={[{ label: "Recipes" }]} />
      <Recipes title={false} />
    </>
  );
}
