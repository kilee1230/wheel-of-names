import { useEffect, useRef, useState } from "react";
import { Howl } from "howler";

interface WheelProps {
  names: string[];
  setNames: (names: string[]) => void;
}

const spinSound = new Howl({ src: ["/sounds/spin.wav"] });
const winSound = new Howl({ src: ["/sounds/win.wav"] });

export const Wheel: React.FC<WheelProps> = ({ names, setNames }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [angle, setAngle] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [settings, setSettings] = useState({
    removeAfterWin: true,
    darkMode: false,
  });

  const drawWheel = (ctx: CanvasRenderingContext2D, size: number) => {
    const numSlices = names.length;
    const arc = (2 * Math.PI) / numSlices;

    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.translate(size / 2, size / 2);
    ctx.rotate(angle);

    names.forEach((name, i) => {
      const startAngle = i * arc;
      ctx.beginPath();
      ctx.fillStyle = `hsl(${(i * 360) / numSlices}, 80%, 70%)`;
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, size / 2, startAngle, startAngle + arc);
      ctx.fill();
      ctx.save();

      ctx.fillStyle = settings.darkMode ? "white" : "black";
      ctx.rotate(startAngle + arc / 2);
      ctx.translate(size / 4, 0);
      ctx.rotate(Math.PI / 2);
      ctx.font = "14px sans-serif";
      ctx.fillText(name, 0, 0);
      ctx.restore();
    });

    ctx.restore();
    ctx.beginPath();
    ctx.fillStyle = settings.darkMode ? "#333" : "#fff";
    ctx.arc(size / 2, size / 2, 20, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.moveTo(size / 2 - 10, 0);
    ctx.lineTo(size / 2 + 10, 0);
    ctx.lineTo(size / 2, 20);
    ctx.fill();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = canvas.width;
    drawWheel(ctx, size);
  }, [names, angle, settings.darkMode]);

  useEffect(() => {
    const storedNames = localStorage.getItem("wheel-names");
    if (storedNames) {
      setNames(JSON.parse(storedNames));
    }

    const storedSettings = localStorage.getItem("wheel-settings");
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("wheel-names", JSON.stringify(names));
  }, [names]);

  useEffect(() => {
    localStorage.setItem("wheel-settings", JSON.stringify(settings));
  }, [settings]);

  const spinWheel = () => {
    winSound.stop();
    if (isSpinning || names.length < 2) return;

    setIsSpinning(true);
    spinSound.play();

    const duration = 5000;
    const finalAngle = angle + 10 * Math.PI + Math.random() * 2 * Math.PI;

    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const newAngle = angle + (finalAngle - angle) * easedProgress;

      setAngle(newAngle);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        spinSound.stop();
        winSound.play();

        const winnerIndex =
          Math.floor(
            names.length -
              ((newAngle % (2 * Math.PI)) / (2 * Math.PI)) * names.length
          ) % names.length;

        const winner = names[winnerIndex];
        alert(`🎉 Winner: ${winner}!`);

        if (settings.removeAfterWin) {
          const newNames = names.filter((_, i) => i !== winnerIndex);
          setNames(newNames);
        }
      }
    };

    requestAnimationFrame(animate);
  };

  const importNames = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const imported = reader.result
        ?.toString()
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
      if (imported && imported.length) setNames(imported);
    };
    reader.readAsText(file);
  };

  const exportNames = () => {
    const blob = new Blob([names.join("\n")], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "names.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={
        settings.darkMode
          ? "text-center bg-gray-900 text-white min-h-screen"
          : "text-center bg-white text-black min-h-screen"
      }
    >
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="mx-auto border rounded"
      />
      <button
        onClick={spinWheel}
        disabled={isSpinning}
        className="px-6 py-2 mt-4 text-white bg-green-500 rounded disabled:opacity-50"
      >
        {isSpinning ? "Spinning..." : "Spin"}
      </button>

      <div className="flex justify-center gap-4 mt-6">
        <label className="text-blue-600 cursor-pointer">
          📥 Import
          <input type="file" accept=".txt" onChange={importNames} hidden />
        </label>
        <button onClick={exportNames} className="text-blue-600">
          📤 Export
        </button>
        <button
          onClick={() =>
            setSettings({
              ...settings,
              removeAfterWin: !settings.removeAfterWin,
            })
          }
          className="text-sm"
        >
          {settings.removeAfterWin ? "✅ Remove Winner" : "❌ Keep Winner"}
        </button>
        <button
          onClick={() =>
            setSettings({ ...settings, darkMode: !settings.darkMode })
          }
          className="text-sm"
        >
          {settings.darkMode ? "🌙 Dark Mode On" : "☀️ Light Mode"}
        </button>
      </div>
    </div>
  );
};
