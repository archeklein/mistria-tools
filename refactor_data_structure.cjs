const fs = require("fs");
const path = require("path");

// Read the current JSON file (this script was used to create the new structure)
// const jsonData = JSON.parse(fs.readFileSync("src/data/characters_gifts.json", "utf8"));

console.log("🔄 Starting data structure refactoring...");

// Extract all unique items from characters
const itemsMap = new Map();

jsonData.characters.forEach((character) => {
  // Process loved gifts
  character.loved_gifts.forEach((gift) => {
    if (gift.name && !itemsMap.has(gift.name)) {
      itemsMap.set(gift.name, {
        name: gift.name,
        icon: gift.icon || null,
      });
    }
  });

  // Process liked gifts
  character.liked_gifts.forEach((gift) => {
    if (gift.name && !itemsMap.has(gift.name)) {
      itemsMap.set(gift.name, {
        name: gift.name,
        icon: gift.icon || null,
      });
    }
  });
});

// Convert items map to array
const itemsArray = Array.from(itemsMap.values());

// Create items.json structure
const itemsData = {
  items: itemsArray,
  metadata: {
    totalItems: itemsArray.length,
    itemsWithIcons: itemsArray.filter((item) => item.icon).length,
    itemsWithoutIcons: itemsArray.filter((item) => !item.icon).length,
    lastUpdated: new Date().toISOString(),
  },
};

// Create characters.json structure (with only string names for gifts)
const charactersData = {
  characters: jsonData.characters.map((character) => ({
    name: character.name,
    category: character.category,
    icon: character.icon,
    loved_gifts: character.loved_gifts.map((gift) => gift.name),
    liked_gifts: character.liked_gifts.map((gift) => gift.name),
  })),
  metadata: {
    ...jsonData.metadata,
    lastUpdated: new Date().toISOString(),
  },
};

// Write the new files
fs.writeFileSync("src/data/items.json", JSON.stringify(itemsData, null, 2));
fs.writeFileSync(
  "src/data/characters.json",
  JSON.stringify(charactersData, null, 2)
);

console.log("✅ Successfully created new data structure!");
console.log(`📦 Items extracted: ${itemsArray.length}`);
console.log(`👥 Characters processed: ${charactersData.characters.length}`);
console.log(`🎨 Items with icons: ${itemsData.metadata.itemsWithIcons}`);
console.log(`❌ Items without icons: ${itemsData.metadata.itemsWithoutIcons}`);

// Show some statistics
console.log("\n📊 STATISTICS:");
console.log(`Characters: ${charactersData.characters.length}`);
console.log(`Unique items: ${itemsArray.length}`);
console.log(
  `Items with icons: ${itemsData.metadata.itemsWithIcons} (${Math.round(
    (itemsData.metadata.itemsWithIcons / itemsArray.length) * 100
  )}%)`
);

// Verify no data loss
let totalGiftsOriginal = 0;
let totalGiftsNew = 0;

jsonData.characters.forEach((char) => {
  totalGiftsOriginal += char.loved_gifts.length + char.liked_gifts.length;
});

charactersData.characters.forEach((char) => {
  totalGiftsNew += char.loved_gifts.length + char.liked_gifts.length;
});

console.log(`\n🔍 VERIFICATION:`);
console.log(`Original total gifts: ${totalGiftsOriginal}`);
console.log(`New total gifts: ${totalGiftsNew}`);
console.log(
  `Data integrity: ${
    totalGiftsOriginal === totalGiftsNew ? "✅ PASSED" : "❌ FAILED"
  }`
);

console.log("\n📁 Files created:");
console.log("  - src/data/items.json");
console.log("  - src/data/characters.json");
console.log(
  "\n💡 You can now delete src/data/characters_gifts.json if everything looks good!"
);
