# Wheel of Names

## Overview

The Wheel of Names is a fun and interactive web application that allows users to input names and spin a wheel to randomly select a winner. It is built using React and Chakra UI for a modern and responsive design.

## Features

- **Add Names**: Users can input names to be added to the wheel.
- **Shuffle Names**: Randomize the order of names on the wheel.
- **Sort Names**: Sort names alphabetically.
- **Clear Names**: Remove all names from the wheel.
- **Spin the Wheel**: Spin the wheel to randomly select a winner.
- **Winner Announcement**: Display the winner in a dialog with options to remove the winner from the wheel.

## Technologies Used

- **React**: For building the user interface.
- **Chakra UI**: For styling and responsive design.
- **Vite**: For fast development and build setup.

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd wheel-of-names
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Start the development server:
   ```bash
   pnpm dev
   ```

## Usage

1. Open the application in your browser.
2. Add names to the wheel using the input field.
3. Use the buttons to shuffle, sort, or clear names.
4. Spin the wheel to select a random winner.
5. View the winner announcement and optionally remove the winner from the wheel.

### Ideal for Daily Standups

The Wheel of Names can be used to randomly select a host for daily standup meetings, ensuring fairness and adding a fun element to the process.

## Folder Structure

```
wheel-of-names/
├── public/
│   ├── sounds/
│   │   ├── spin.wav
│   │   ├── win.wav
├── src/
│   ├── App.tsx
│   ├── NameEntries.tsx
│   ├── Wheel.tsx
│   ├── fireworks.css
├── index.html
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── vite.config.ts
```

## License

This project is licensed under the MIT License.

## Acknowledgments

- Chakra UI for the design components.
- Vite for the development setup.
- React for the framework.

## Contributing

Feel free to submit issues or pull requests to improve the project!
