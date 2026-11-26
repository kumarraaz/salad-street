/* =====================================================================
   FRESH RECIPES — DRAFT – CLIENT TO REVIEW.
   Recipe names, times, ingredients and steps below are draft copy written for the
   Salad Street team to check and edit before they are treated as final.
   Each recipe features only Salad Street products (`uses` = product ids).
   ===================================================================== */
export type Recipe = {
  id: string;
  name: string;
  time: string;
  uses: string[];
  img: string;
  ingredients: string[];
  steps: string[];
};

export const RECIPES: Recipe[] = [
  {
    id: "rocket-lettuce-mint-salad",
    name: "Rocket, Lettuce & Mint Summer Salad",
    time: "10 min",
    uses: ["rocket-leaves", "lettuce-mix", "mint"],
    img: "/images/leafy/rocket.png",
    ingredients: [
      "1 pack Salad Street Rocket Leaves",
      "1 cup Salad Street Lettuce Mix",
      "A handful of Salad Street Mint leaves",
      "1 cucumber, sliced",
      "Juice of 1 lemon",
      "2 tbsp olive oil",
      "Salt and black pepper to taste",
    ],
    steps: [
      "Rinse the rocket, lettuce and mint in cold water and pat dry.",
      "Toss the leaves with the cucumber in a large bowl.",
      "Whisk the lemon juice, olive oil, salt and pepper together.",
      "Pour the dressing over the salad just before serving and toss gently.",
    ],
  },
  {
    id: "spinach-basil-pesto-pasta",
    name: "Baby Spinach & Basil Pesto Pasta",
    time: "25 min",
    uses: ["baby-spinach", "italian-basil"],
    img: "/images/leafy/italian-basil.png",
    ingredients: [
      "1 cup Salad Street Italian Basil leaves",
      "1 cup Salad Street Baby Spinach",
      "2 tbsp roasted peanuts or walnuts",
      "1 garlic clove",
      "4 tbsp olive oil",
      "200 g pasta",
      "Salt to taste",
    ],
    steps: [
      "Cook the pasta in salted water until tender; keep a little of the cooking water.",
      "Blend the basil, half the spinach, nuts, garlic, olive oil and a pinch of salt into a smooth pesto.",
      "Toss the hot pasta with the pesto, adding a splash of cooking water to loosen it.",
      "Fold in the remaining spinach leaves and serve straight away.",
    ],
  },
  {
    id: "microgreens-avocado-toast",
    name: "Microgreens & Salad Leaves Toast",
    time: "10 min",
    uses: ["microgreens", "salad-leaves-mix"],
    img: "/images/leafy/microgreens.png",
    ingredients: [
      "A handful of Salad Street Microgreens",
      "A few Salad Street Salad Leaves Mix leaves",
      "2 slices of bread, toasted",
      "1 ripe avocado (or hung curd)",
      "A squeeze of lemon",
      "Salt, pepper and chilli flakes",
    ],
    steps: [
      "Mash the avocado (or season the hung curd) with lemon, salt and pepper.",
      "Spread it over the warm toast.",
      "Top with the salad leaves and a generous pile of microgreens.",
      "Finish with chilli flakes and serve.",
    ],
  },
];
