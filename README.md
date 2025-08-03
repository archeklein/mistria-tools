# Mistria Tools

A web application for Fields of Mistria players to manage their gaming activities.

## Features

### 🎁 Gift Tracker (Module 1)

- **Character Overview**: Browse all game characters with their portrait icons
- **Loved Gifts Display**: View each character's loved gifts in an easy-to-scan format
- **Gift Selection**: Use segmented controls to check off gifts you plan to bring
- **Smart Shopping List**: Automatically generates a consolidated shopping list showing:
  - All selected gifts organized alphabetically
  - Quantity needed for each gift
  - Which characters receive each gift
- **Search & Filter**: Find characters quickly by name or filter by category (Romance Options, Townsfolk, etc.)
- **Progress Tracking**: See total gifts selected and per-character selection counts

### 📜 Quest Tracker (Module 2)

- Coming Soon!

## Technology Stack

- **React 19** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for styling
- **Zustand** for state management
- Character data from Fields of Mistria v0.11.5

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open your browser to the displayed local URL (typically `http://localhost:5173`)

## Usage

### Planning Your Gifting Run

1. **Browse Characters**: Scroll through the character cards to see everyone's loved gifts
2. **Select Gifts**: Click on any gift button to toggle it as "selected" - it will turn green when selected
3. **Check Shopping List**: The shopping list at the top automatically updates to show:
   - What items you need to collect
   - How many of each (if multiple characters want the same gift)
   - Which characters get each gift
4. **Filter as Needed**: Use the search bar or category dropdown to focus on specific characters

### Pro Tips

- **Romance Characters**: Focus on Romance Options category if you're building relationships
- **Efficiency**: Look for common gifts that multiple characters love to minimize inventory space
- **Planning**: The shopping list helps you gather everything before starting your run

## Data Source

Character gift preferences are extracted from the official Fields of Mistria v0.11.5 Mastery Spreadsheet. The app currently includes Romance Options and some Townsfolk data.

## Development

Built following React/TypeScript best practices:

- Component-based architecture
- Custom hooks for state management
- Accessible UI components
- Responsive design
- Performance optimizations

---

**Enhance your Fields of Mistria farming adventure! 🌾**
