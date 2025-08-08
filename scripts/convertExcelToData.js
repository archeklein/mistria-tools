import XLSX from "xlsx";
import fs from "fs";
import path from "path";

const EXCEL_FILE_PATH = "src/data/data.xlsx";
const OUTPUT_DIR = "src/data";

/**
 * Read Excel file and convert to JSON data structure
 */
function convertExcelToData() {
  try {
    // Read the Excel file
    const workbook = XLSX.readFile(EXCEL_FILE_PATH);

    // Get all sheet names
    const sheetNames = workbook.SheetNames;
    console.log("Found sheets:", sheetNames);

    // Uncomment below to debug sheet structure
    // sheetNames.forEach((sheetName) => {
    //   const sheet = workbook.Sheets[sheetName];
    //   const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    //   console.log(`\n${sheetName} sheet structure:`);
    //   console.log("Headers:", data[0]);
    //   if (data[1]) console.log("Sample row:", data[1]);
    // });

    // Initialize data structures
    const charactersData = { characters: [] };
    const itemsData = { items: [] };

    // Process characters sheet
    if (sheetNames.includes("characters")) {
      const charactersSheet = workbook.Sheets["characters"];
      const charactersArray = XLSX.utils.sheet_to_json(charactersSheet);

      console.log(`Processing ${charactersArray.length} characters...`);

      charactersData.characters = charactersArray.map((row) => ({
        name: row.name,
        category: row.category,
        icon: row.icon,
        isSpoiler: row.isSpoiler === "TRUE" || row.isSpoiler === true,
        isUnreleased: row.isUnreleased === "TRUE" || row.isUnreleased === true,
        loved_gifts: [],
        liked_gifts: [],
      }));
    }

    // Process items sheet
    if (sheetNames.includes("items")) {
      const itemsSheet = workbook.Sheets["items"];
      const itemsArray = XLSX.utils.sheet_to_json(itemsSheet);

      console.log(`Processing ${itemsArray.length} items...`);

      itemsData.items = itemsArray.map((row) => ({
        name: row.name,
        icon: row.image,
      }));
    }

    // Process preferences sheet (try different possible names)
    const preferenceSheetName = sheetNames.find(
      (name) =>
        name.toLowerCase().includes("preference") ||
        name.toLowerCase().includes("gift") ||
        name.toLowerCase() === "preference"
    );

    if (preferenceSheetName) {
      console.log(`Found preferences sheet: ${preferenceSheetName}`);
      const preferencesSheet = workbook.Sheets[preferenceSheetName];

      const preferencesArray = XLSX.utils.sheet_to_json(preferencesSheet);

      console.log(`Processing ${preferencesArray.length} preferences...`);

      // Group preferences by character and scale
      const preferencesByCharacter = {};

      preferencesArray.forEach((row) => {
        const characterName = row.character;
        const itemName = row.item;
        const scale = parseInt(row.scale);

        if (!preferencesByCharacter[characterName]) {
          preferencesByCharacter[characterName] = {
            loved: [], // scale 2
            liked: [], // scale 1
          };
        }

        if (scale === 2) {
          preferencesByCharacter[characterName].loved.push(itemName);
        } else if (scale === 1) {
          preferencesByCharacter[characterName].liked.push(itemName);
        }
      });

      // Update characters with their gift preferences
      charactersData.characters.forEach((character) => {
        const preferences = preferencesByCharacter[character.name];
        if (preferences) {
          character.loved_gifts = preferences.loved;
          character.liked_gifts = preferences.liked;
        }
      });
    }

    // Write JSON files
    const charactersPath = path.join(OUTPUT_DIR, "characters.json");
    const itemsPath = path.join(OUTPUT_DIR, "items.json");

    fs.writeFileSync(charactersPath, JSON.stringify(charactersData, null, 2));
    fs.writeFileSync(itemsPath, JSON.stringify(itemsData, null, 2));

    console.log("✅ Successfully converted Excel data to JSON files:");
    console.log(`   - Characters: ${charactersData.characters.length} entries`);
    console.log(`   - Items: ${itemsData.items.length} entries`);
    console.log(`   - Files written to: ${charactersPath}, ${itemsPath}`);
  } catch (error) {
    console.error("❌ Error converting Excel file:", error.message);
    process.exit(1);
  }
}

// Run the conversion
convertExcelToData();
