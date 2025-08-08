# Data Conversion Scripts

This directory contains scripts for converting Excel data to JSON format for the Mistria Gift Planner application.

## convertExcelToData.js

This script reads data from `src/data/data.xlsx` and generates JSON files for the application.

### Usage

```bash
npm run convert-excel
```

### Excel File Structure

The Excel file should contain three sheets:

1. **characters** - Contains character information

   - `name`: Character name (string)
   - `category`: Character category (string)
   - `icon`: Icon filename (string)
   - `isSpoiler`: Whether character is a spoiler (TRUE/FALSE)
   - `isUnreleased`: Whether character is unreleased (TRUE/FALSE)

2. **items** - Contains item information

   - `name`: Item name (string)
   - `image`: Icon filename (string)

3. **preference** - Contains gift preferences
   - `character`: Character name (string)
   - `item`: Item name (string)
   - `scale`: Preference level (2 = loved, 1 = liked)

### Output

The script generates two JSON files:

- `src/data/characters.json` - Contains all character data with their gift preferences
- `src/data/items.json` - Contains all item data

### Notes

- Character and item names are used as unique identifiers
- The script automatically maps preferences to characters based on the scale value
- Scale 2 = loved gifts, Scale 1 = liked gifts
- Old JSON files are backed up to the `backup/` directory before conversion
