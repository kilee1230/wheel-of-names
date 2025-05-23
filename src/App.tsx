import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { Wheel } from "./Wheel";

function App() {
  const [names, setNames] = useState<string[]>(["Alice", "Bob", "Charlie"]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 text-black bg-gray-100 dark:bg-gray-900 dark:text-white">
      <h1 className="mb-4 text-2xl font-bold">🎡 Wheel of Names</h1>
      <Wheel names={names} setNames={setNames} />
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
