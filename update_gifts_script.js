const fs = require("fs");
const path = require("path");

// Read the current JSON file
const jsonData = JSON.parse(fs.readFileSync("characters_gifts.json", "utf8"));

// List of available icon files (from the listing)
const availableIcons = [
  "Wild_berry_scone.webp",
  "Wild_berry_pie.webp",
  "White_wine.webp",
  "Vegetable_soup.webp",
  "Tulip.webp",
  "Spicy_cheddar_biscuit.webp",
  "Snapdragon.webp",
  "Red_Wine.webp",
  "Pumpkin_stew.webp",
  "Pineshroom_toast.webp",
  "Peach.webp",
  "Paper.webp",
  "Lemonade.webp",
  "Lemon.webp",
  "Lemon_cake.webp",
  "Heather.webp",
  "Diamond.webp",
  "Candied_lemon_peel.webp",
  "Pumpkin_pie.webp",
  "Plum_blossom.webp",
  "Peaches_and_cream.webp",
  "Middlemist.webp",
  "Lemon_pie.webp",
  "Gazpacho.webp",
  "Cup_of_tea.webp",
  "Coffee.webp",
];

// Function to normalize gift names to match icon file names
function normalizeGiftName(giftName) {
  return giftName
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/&/g, "and")
    .replace(/[^\w_]/g, "");
}

// Function to find matching icon for a gift
function findIconForGift(giftName) {
  const normalized = normalizeGiftName(giftName);

  // Direct match
  const directMatch = availableIcons.find(
    (icon) => icon.toLowerCase().replace(".webp", "") === normalized
  );
  if (directMatch) return directMatch;

  // Special cases for mismatches
  const specialCases = {
    tea_with_lemon: "Cup_of_tea.webp",
    snap_dragon: "Snapdragon.webp",
    spicy_chedder_biscuit: "Spicy_cheddar_biscuit.webp",
    wild_berry_pie: "Wild_berry_pie.webp",
    wild_berry_scone: "Wild_berry_scone.webp",
    red_wine: "Red_Wine.webp",
    white_wine: "White_wine.webp",
  };

  if (specialCases[normalized]) {
    return specialCases[normalized];
  }

  return null;
}

// Transform gift arrays from strings to Item objects
function transformGifts(giftArray) {
  return giftArray.map((giftName) => ({
    name: giftName,
    icon: findIconForGift(giftName),
  }));
}

// Update each character's gifts
jsonData.characters.forEach((character) => {
  character.loved_gifts = transformGifts(character.loved_gifts);
  character.liked_gifts = transformGifts(character.liked_gifts);
});

// Write the updated JSON file
fs.writeFileSync("characters_gifts.json", JSON.stringify(jsonData, null, 2));

console.log("Successfully updated characters_gifts.json with Item structure");

// Log some statistics
let totalGifts = 0;
let giftsWithIcons = 0;
jsonData.characters.forEach((character) => {
  character.loved_gifts.forEach((gift) => {
    totalGifts++;
    if (gift.icon) giftsWithIcons++;
  });
  character.liked_gifts.forEach((gift) => {
    totalGifts++;
    if (gift.icon) giftsWithIcons++;
  });
});

console.log(`Total gifts: ${totalGifts}`);
console.log(`Gifts with icons: ${giftsWithIcons}`);
console.log(`Gifts without icons: ${totalGifts - giftsWithIcons}`);
