const fs = require("fs");
const path = require("path");

console.log("🔄 Starting comprehensive gift and icon update...");

// Read the current JSON files
const charactersData = JSON.parse(
  fs.readFileSync("src/data/characters.json", "utf8")
);
const itemsData = JSON.parse(fs.readFileSync("src/data/items.json", "utf8"));

// Collect all gift names that are actually referenced by characters
const referencedGiftNames = new Set();
charactersData.characters.forEach((character) => {
  character.loved_gifts.forEach((giftName) =>
    referencedGiftNames.add(giftName)
  );
  character.liked_gifts.forEach((giftName) =>
    referencedGiftNames.add(giftName)
  );
});

console.log(
  `📋 Found ${referencedGiftNames.size} unique gifts referenced by characters`
);

// Remove items that are not referenced by any character
const originalItemsCount = itemsData.items.length;
itemsData.items = itemsData.items.filter((item) =>
  referencedGiftNames.has(item.name)
);
const removedItemsCount = originalItemsCount - itemsData.items.length;

if (removedItemsCount > 0) {
  console.log(
    `🧹 Removed ${removedItemsCount} unreferenced items from items.json`
  );
} else {
  console.log(`✅ All items in items.json are properly referenced`);
}

// Add any missing items that are referenced in characters.json but not in items.json
const existingItemNames = new Set(itemsData.items.map((item) => item.name));
const missingItems = [];

referencedGiftNames.forEach((giftName) => {
  if (!existingItemNames.has(giftName)) {
    missingItems.push({
      name: giftName,
      icon: null,
    });
  }
});

if (missingItems.length > 0) {
  itemsData.items.push(...missingItems);
  console.log(`➕ Added ${missingItems.length} missing items to items.json:`);
  missingItems.forEach((item) => {
    console.log(`   - ${item.name}`);
  });
} else {
  console.log(`✅ All referenced items are already in items.json`);
}

// Dynamically read all available icon files from the items directory
const itemsDirectory = "src/assets/items";
const availableIconFiles = fs
  .readdirSync(itemsDirectory)
  .filter((file) => file.endsWith(".webp") || file.endsWith(".png"))
  .filter((file) => !file.includes("(")) // Filter out duplicate files with parentheses
  .sort();

console.log(
  `📁 Found ${availableIconFiles.length} icon files in ${itemsDirectory}`
);

// Function to normalize gift names to match icon file names
function normalizeGiftName(giftName) {
  return giftName
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/&/g, "and")
    .replace(/[^\w'_]/g, ""); // Keep apostrophes in the normalization
}

// Function to find matching icon for an item
function findIconForItem(itemName) {
  const normalized = normalizeGiftName(itemName);

  // Direct match (case insensitive)
  const directMatch = availableIconFiles.find(
    (icon) => icon.toLowerCase().replace(/\.(webp|png)$/, "") === normalized
  );
  if (directMatch) return directMatch;

  // Special cases for mismatches between item names and icon filenames
  const specialCases = {
    tea_with_lemon: "Cup_of_tea.webp",
    snap_dragon: "Snapdragon.webp",
    wild_berry_pie: "Wild_berry_pie.webp",
    wild_berry_scone: "Wild_berry_scone.webp",
    red_wine: "Red_Wine.webp",
    white_wine: "White_wine.webp",
    peaches_and_cream: "Peaches_and_cream.webp",
    gold_ingot: "Gold_Ingot.webp",
    gold_ore: "Gold_Ore.webp",
    breath_of_fire: "Breath_of_flame.webp",
    chysanthemum: "Chrysanthemum.webp",
    spring_salad: "Spring_salad.png",
    lemon_pie: "Lemon_pie.webp",
    gazpacho: "Gazpacho.webp",
    cup_of_tea: "Cup_of_tea.webp",
    coffee: "Coffee.webp",
  };

  if (specialCases[normalized]) {
    return specialCases[normalized];
  }

  return null;
}

// Update items in the items array
let updatedCount = 0;
itemsData.items.forEach((item) => {
  const foundIcon = findIconForItem(item.name);
  if (foundIcon && item.icon !== foundIcon) {
    item.icon = foundIcon;
    updatedCount++;
  } else if (!item.icon && foundIcon) {
    item.icon = foundIcon;
    updatedCount++;
  }
});

// Write the updated files
fs.writeFileSync("src/data/items.json", JSON.stringify(itemsData, null, 2));

console.log(`✅ Successfully updated data structure!`);
console.log(`🔄 Updated ${updatedCount} items with icons`);

// Statistics
let totalItems = itemsData.items.length;
let itemsWithIcons = itemsData.items.filter((item) => item.icon).length;
let itemsWithoutIcons = totalItems - itemsWithIcons;

console.log(`\n📊 COMPREHENSIVE STATISTICS:`);
console.log(`Characters: ${charactersData.characters.length}`);
console.log(`Referenced gifts: ${referencedGiftNames.size}`);
console.log(`Items removed: ${removedItemsCount}`);
console.log(`Items added: ${missingItems.length}`);
console.log(`Total unique items: ${totalItems}`);
console.log(
  `Items with icons: ${itemsWithIcons} (${Math.round(
    (itemsWithIcons / totalItems) * 100
  )}%)`
);
console.log(
  `Items without icons: ${itemsWithoutIcons} (${Math.round(
    (itemsWithoutIcons / totalItems) * 100
  )}%)`
);

// Calculate total gift references across all characters
let totalGiftReferences = 0;
charactersData.characters.forEach((character) => {
  totalGiftReferences +=
    character.loved_gifts.length + character.liked_gifts.length;
});

console.log(`Total gift references: ${totalGiftReferences}`);
console.log(
  `Data normalization efficiency: ${Math.round(
    (1 - totalItems / totalGiftReferences) * 100
  )}% space saved`
);

// Find used and unused icons
const usedIcons = new Set();
itemsData.items.forEach((item) => {
  if (item.icon) {
    usedIcons.add(item.icon);
  }
});

const unusedIcons = availableIconFiles.filter((icon) => !usedIcons.has(icon));

console.log(`\n🎨 ICON ANALYSIS:`);
console.log(`Available icons: ${availableIconFiles.length}`);
console.log(`Used icons: ${usedIcons.size}`);
console.log(`Unused icons: ${unusedIcons.length}`);
console.log(
  `Icon utilization: ${Math.round(
    (usedIcons.size / availableIconFiles.length) * 100
  )}%`
);

if (unusedIcons.length > 0) {
  console.log("\n⚠️  UNUSED ICONS:");
  unusedIcons.forEach((icon) => {
    console.log(`  - ${icon}`);
  });
  console.log(
    `\n💡 Consider removing these ${unusedIcons.length} unused icon files or finding corresponding items.`
  );
} else {
  console.log("\n✅ Perfect! All icons have corresponding items!");
}

// Show sample of items without icons
const itemsWithoutIconsList = itemsData.items.filter((item) => !item.icon);
if (itemsWithoutIconsList.length > 0) {
  console.log("\n❌ ITEMS STILL NEEDING ICONS (first 25):");
  itemsWithoutIconsList.slice(0, 25).forEach((item) => {
    console.log(`  - ${item.name}`);
  });
  if (itemsWithoutIconsList.length > 25) {
    console.log(`  ... and ${itemsWithoutIconsList.length - 25} more`);
  }
}

// Update metadata with comprehensive info
itemsData.metadata = {
  ...itemsData.metadata,
  totalItems: totalItems,
  itemsWithIcons: itemsWithIcons,
  itemsWithoutIcons: itemsWithoutIcons,
  lastUpdated: new Date().toISOString(),
  availableIconFiles: availableIconFiles.length,
  usedIcons: usedIcons.size,
  unusedIcons: unusedIcons.length,
  iconUtilization: Math.round(
    (usedIcons.size / availableIconFiles.length) * 100
  ),
  totalGiftReferences: totalGiftReferences,
  dataNormalizationEfficiency: Math.round(
    (1 - totalItems / totalGiftReferences) * 100
  ),
  referencedGifts: referencedGiftNames.size,
  itemsRemovedLastUpdate: removedItemsCount,
  itemsAddedLastUpdate: missingItems.length,
};

// Write the final updated files with comprehensive metadata
fs.writeFileSync("src/data/items.json", JSON.stringify(itemsData, null, 2));

console.log("\n🎉 Comprehensive update completed successfully!");
console.log("📁 Files updated:");
console.log("  - src/data/items.json (with enhanced metadata)");
