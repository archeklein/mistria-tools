const fs = require("fs");
const path = require("path");

console.log("🔄 Starting icon update for new data structure...");

// Read the current JSON files
const charactersData = JSON.parse(
  fs.readFileSync("src/data/characters.json", "utf8")
);
const itemsData = JSON.parse(fs.readFileSync("src/data/items.json", "utf8"));

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
    .replace(/[^\w_]/g, "");
}

// Function to find matching icon for an item
function findIconForItem(itemName) {
  const normalized = normalizeGiftName(itemName);

  // Direct match (case insensitive)
  const directMatch = availableIconFiles.find(
    (icon) => icon.toLowerCase().replace(/\.(webp|png)$/, "") === normalized
  );
  if (directMatch) return directMatch;

  // Special cases for mismatches
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
  };

  if (specialCases[normalized]) {
    return specialCases[normalized];
  }

  return null;
}

// Update items in the items array
let updatedCount = 0;
itemsData.items.forEach((item) => {
  if (!item.icon) {
    const foundIcon = findIconForItem(item.name);
    if (foundIcon) {
      item.icon = foundIcon;
      updatedCount++;
    }
  }
});

// Write the updated items.json file
fs.writeFileSync("src/data/items.json", JSON.stringify(itemsData, null, 2));

console.log(`✅ Successfully updated items.json!`);
console.log(`🔄 Updated ${updatedCount} items with new icons`);

// Statistics
let totalItems = itemsData.items.length;
let itemsWithIcons = itemsData.items.filter((item) => item.icon).length;
let itemsWithoutIcons = totalItems - itemsWithIcons;

console.log(`\n📊 UPDATED STATISTICS:`);
console.log(`Total items: ${totalItems}`);
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

// Find used and unused icons
const usedIcons = new Set();
itemsData.items.forEach((item) => {
  if (item.icon) {
    usedIcons.add(item.icon);
  }
});

const unusedIcons = availableIconFiles.filter((icon) => !usedIcons.has(icon));

console.log(`\n🎨 ICON USAGE:`);
console.log(`Available icons: ${availableIconFiles.length}`);
console.log(`Used icons: ${usedIcons.size}`);
console.log(`Unused icons: ${unusedIcons.length}`);

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

// Show items without icons (first 20 for readability)
const itemsWithoutIconsList = itemsData.items.filter((item) => !item.icon);
if (itemsWithoutIconsList.length > 0) {
  console.log("\n❌ ITEMS WITHOUT ICONS (first 20):");
  itemsWithoutIconsList.slice(0, 20).forEach((item) => {
    console.log(`  - ${item.name}`);
  });
  if (itemsWithoutIconsList.length > 20) {
    console.log(`  ... and ${itemsWithoutIconsList.length - 20} more`);
  }
}

// Update metadata
itemsData.metadata = {
  ...itemsData.metadata,
  totalItems: totalItems,
  itemsWithIcons: itemsWithIcons,
  itemsWithoutIcons: itemsWithoutIcons,
  lastUpdated: new Date().toISOString(),
  availableIconFiles: availableIconFiles.length,
  usedIcons: usedIcons.size,
  unusedIcons: unusedIcons.length,
};

// Write the final updated file with metadata
fs.writeFileSync("src/data/items.json", JSON.stringify(itemsData, null, 2));

console.log("\n🎉 Icon update completed successfully!");
