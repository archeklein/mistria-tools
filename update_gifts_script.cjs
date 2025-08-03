const fs = require("fs");
const path = require("path");

// NOTE: This script needs to be updated to work with the new data structure
// where characters.json stores gift names as strings and items.json stores the icon mappings
// For now, the data structure has been successfully refactored using refactor_data_structure.cjs

// Read the current JSON files
const charactersData = JSON.parse(
  fs.readFileSync("src/data/characters.json", "utf8")
);
const itemsData = JSON.parse(fs.readFileSync("src/data/items.json", "utf8"));

// List of available icon files (from the listing)
const availableIcons = [
  "Alda_gem_bracelet.webp",
  "Apple_honey_curry.webp",
  "Candied_lemon_peel.webp",
  "Cauliflower_curry.webp",
  "Chickpea_curry.webp",
  "Chili_coconut_curry.webp",
  "Coffee.webp",
  "Crystal_rose.webp",
  "Cup_of_tea.webp",
  "Deluxe_curry.webp",
  "Diamond.webp",
  "Emerald.webp",
  "Family_crest_pendant.webp",
  "Fog_orchid.webp",
  "Frost_lily.webp",
  "Gazpacho.webp",
  "Gold_Ingot.webp",
  "Gold_Ore.webp",
  "Golden_cheesecake.webp",
  "Golden_cookies.webp",
  "Heather.webp",
  "Jasmine.webp",
  "Lemon.webp",
  "Lemon_cake.webp",
  "Lemon_pie.webp",
  "Lemonade.webp",
  "Middlemist.webp",
  "Paper.webp",
  "Peach.webp",
  "Peaches_and_cream.webp",
  "Perfect_diamond.webp",
  "Perfect_emerald.webp",
  "Perfect_gold_ore.webp",
  "Perfect_ruby.webp",
  "Perfect_sapphire.webp",
  "Pineshroom_toast.webp",
  "Plum_blossom.webp",
  "Pumpkin_pie.webp",
  "Pumpkin_stew.webp",
  "Red_Wine.webp",
  "Rose.webp",
  "Ruby.webp",
  "Rusted_treasure_chest.webp",
  "Sapphire.webp",
  "Sapphire_betta.webp",
  "Snapdragon.webp",
  "Snowdrop_anemone.webp",
  "Spicy_cheddar_biscuit.webp",
  "Tulip.webp",
  "Vegetable_soup.webp",
  "White_wine.webp",
  "Wild_berry_pie.webp",
  "Wild_berry_scone.webp",
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
    peaches_and_cream: "Peaches_and_cream.webp",
    gold_ingot: "Gold_Ingot.webp",
    gold_ore: "Gold_Ore.webp",
  };

  if (specialCases[normalized]) {
    return specialCases[normalized];
  }

  return null;
}

// Update existing gift objects to add missing icons
function updateGiftIcons(giftArray) {
  return giftArray.map((gift) => {
    // If icon is null or missing, try to find one
    if (!gift.icon) {
      gift.icon = findIconForGift(gift.name);
    }
    return gift;
  });
}

// Update each character's gifts
jsonData.characters.forEach((character) => {
  character.loved_gifts = updateGiftIcons(character.loved_gifts);
  character.liked_gifts = updateGiftIcons(character.liked_gifts);
});

// Write the updated JSON file
fs.writeFileSync("characters_gifts.json", JSON.stringify(jsonData, null, 2));

console.log("Successfully updated characters_gifts.json with missing icons");

// Log some statistics
let totalGifts = 0;
let giftsWithIcons = 0;
const usedIcons = new Set();

jsonData.characters.forEach((character) => {
  character.loved_gifts.forEach((gift) => {
    totalGifts++;
    if (gift.icon) {
      giftsWithIcons++;
      usedIcons.add(gift.icon);
    }
  });
  character.liked_gifts.forEach((gift) => {
    totalGifts++;
    if (gift.icon) {
      giftsWithIcons++;
      usedIcons.add(gift.icon);
    }
  });
});

console.log(`\n📊 STATISTICS:`);
console.log(`Total gifts: ${totalGifts}`);
console.log(`Gifts with icons: ${giftsWithIcons}`);
console.log(`Gifts without icons: ${totalGifts - giftsWithIcons}`);
console.log(`Total available icons: ${availableIcons.length}`);
console.log(`Icons used: ${usedIcons.size}`);

// Find unused icons
const unusedIcons = availableIcons.filter((icon) => !usedIcons.has(icon));
if (unusedIcons.length > 0) {
  console.log("\n⚠️  UNUSED ICONS:");
  unusedIcons.forEach((icon) => {
    console.log(`  - ${icon}`);
  });
  console.log(
    `\n💡 Consider removing these ${unusedIcons.length} unused icon files or finding corresponding items.`
  );
} else {
  console.log("\n✅ All icons have corresponding items!");
}

// Show items without icons
const itemsWithoutIcons = [];
jsonData.characters.forEach((character) => {
  character.loved_gifts.forEach((gift) => {
    if (!gift.icon) {
      itemsWithoutIcons.push(gift.name);
    }
  });
  character.liked_gifts.forEach((gift) => {
    if (!gift.icon) {
      itemsWithoutIcons.push(gift.name);
    }
  });
});

const uniqueItemsWithoutIcons = [...new Set(itemsWithoutIcons)];
if (uniqueItemsWithoutIcons.length > 0) {
  console.log("\n❌ ITEMS WITHOUT ICONS:");
  uniqueItemsWithoutIcons.forEach((item) => {
    console.log(`  - ${item}`);
  });
}
