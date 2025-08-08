import { Character, Item } from "../../stores/giftStore";

export const mockItems: Item[] = [
  { name: "Apple", icon: "Apple.webp" },
  { name: "Bread", icon: "Bread.webp" },
  { name: "Chocolate", icon: "Chocolate.webp" },
  { name: "Coffee", icon: "Coffee.webp" },
  { name: "Diamond", icon: "Diamond.webp" },
  { name: "Emerald", icon: "Emerald.webp" },
  { name: "Fish", icon: null },
  { name: "Garlic", icon: "Garlic.webp" },
  { name: "Honey", icon: "Honey.webp" },
  { name: "Ice Cream", icon: "Ice_cream_sundae.webp" },
];

export const mockCharacters: Character[] = [
  {
    name: "Adeline",
    category: "Romance Options",
    loved_gifts: ["Diamond", "Chocolate"],
    liked_gifts: ["Apple", "Bread"],
    icon: "Adeline_icon.webp",
    isSpoiler: false,
    isUnreleased: false,
  },
  {
    name: "March",
    category: "Romance Options",
    loved_gifts: ["Coffee", "Emerald"],
    liked_gifts: ["Garlic", "Honey"],
    icon: "March_icon.webp",
    isSpoiler: false,
    isUnreleased: false,
  },
  {
    name: "Balor",
    category: "Special Characters",
    loved_gifts: ["Fish"],
    liked_gifts: ["Ice Cream"],
    icon: "Balor_icon.webp",
    isSpoiler: true,
    isUnreleased: false,
  },
  {
    name: "Dell",
    category: "Townsfolk",
    loved_gifts: ["Bread", "Coffee"],
    liked_gifts: ["Apple"],
    icon: "Dell_icon.webp",
    isSpoiler: false,
    isUnreleased: false,
  },
  {
    name: "Unreleased Character",
    category: "Romance Options",
    loved_gifts: ["Diamond"],
    liked_gifts: ["Chocolate"],
    icon: "Unknown_icon.webp",
    isSpoiler: false,
    isUnreleased: true,
  },
];

export const mockCharactersData = {
  characters: mockCharacters,
};

export const mockItemsData = {
  items: mockItems,
};
