import { useEffect, useRef, useState } from "react";
import { Howl } from "howler";
import { Box, Center, Text } from "@chakra-ui/react";

interface WheelProps {
  names: string[];
  setNames: (names: string[]) => void;
  onShuffle?: () => void;
  onSelectWinner?: (winner: string) => void;
}

const spinSound = new Howl({
  src: ["/wheel-of-names/sounds/spin.wav"],
  preload: true,
});
const winSound = new Howl({
  src: ["/wheel-of-names/sounds/win.wav"],
  preload: true,
});

export const Wheel: React.FC<WheelProps> = ({
  names,
  setNames,
  onShuffle,
  onSelectWinner,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [angle, setAngle] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [settings, setSettings] = useState({
    removeAfterWin: true,
    darkMode: false,
  });
  const slowSpinIntervalRef = useRef<number | null>(null);

  const drawWheel = (ctx: CanvasRenderingContext2D, size: number) => {
    const numSlices = names.length;
    const arc = (2 * Math.PI) / numSlices;
    const wheelRadius = size / 2 - 5; // Slightly smaller to fit within canvas
    const wheelBorder = 3;
    const centerRadius = 30;

    // Clear the canvas
    ctx.clearRect(0, 0, size, size);

    // Draw wheel background
    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, wheelRadius + wheelBorder, 0, 2 * Math.PI);
    ctx.fillStyle = settings.darkMode ? "#222" : "#ddd";
    ctx.fill();

    // Move to center for rotating
    ctx.translate(size / 2, size / 2);
    ctx.rotate(angle);

    // Draw each slice - starting from the right (0 radians) and going clockwise
    names.forEach((name, i) => {
      const startAngle = i * arc;
      const endAngle = startAngle + arc;

      // Draw slice
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, wheelRadius, startAngle, endAngle);
      ctx.fillStyle = `hsl(${(i * 360) / numSlices}, 80%, ${
        settings.darkMode ? "60%" : "75%"
      })`;
      ctx.fill();

      // Draw slice border
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, wheelRadius, startAngle, endAngle);
      ctx.strokeStyle = settings.darkMode
        ? "rgba(0,0,0,0.3)"
        : "rgba(255,255,255,0.5)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.rotate(startAngle + arc / 2);
      ctx.translate(wheelRadius / 2 + 10, 0);
      ctx.rotate(Math.PI / 2);

      const fontSize =
        window.innerWidth > 768
          ? Math.min(20, 200 / Math.max(5, numSlices))
          : Math.min(16, 180 / Math.max(5, numSlices));
      ctx.font = `${fontSize}px Arial, sans-serif`;
      ctx.fillStyle = settings.darkMode ? "white" : "black";
      ctx.textAlign = "center";

      // Apply truncation logic based on name length
      let displayName = name;

      if (name.length > 6) {
        displayName = name.slice(0, 10) + "...";
      } else if (name.length > 10) {
        displayName = name.slice(0, 3) + "...";
      }

      ctx.fillText(displayName, 0, 0);
      ctx.restore();
    });

    // Restore context for absolute positioning
    ctx.restore();

    // Draw center circle with a more polished look
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, centerRadius, 0, 2 * Math.PI);

    // Add a gradient to the center for a 3D effect
    const centerGradient = ctx.createRadialGradient(
      size / 2 - 5,
      size / 2 - 5,
      0,
      size / 2,
      size / 2,
      centerRadius
    );

    if (settings.darkMode) {
      centerGradient.addColorStop(0, "#444");
      centerGradient.addColorStop(1, "#222");
    } else {
      centerGradient.addColorStop(0, "#fff");
      centerGradient.addColorStop(1, "#f0f0f0");
    }

    ctx.fillStyle = centerGradient;
    ctx.fill();

    // Add a subtle shadow/highlight
    ctx.strokeStyle = settings.darkMode ? "#555" : "#ddd";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw pointer
    ctx.beginPath();
    ctx.fillStyle = "#e74c3c";
    ctx.moveTo(size / 2 - 10, 10);
    ctx.lineTo(size / 2 + 10, 10);
    ctx.lineTo(size / 2, 30);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = settings.darkMode ? "#222" : "#fff";
    ctx.lineWidth = 1;
    ctx.stroke();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = canvas.offsetWidth; // Use offsetWidth for consistent sizing
    const devicePixelRatio = window.devicePixelRatio || 1;
    canvas.width = size * devicePixelRatio;
    canvas.height = size * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio); // Scale the context for sharper rendering

    // Clear the canvas before drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the wheel (existing logic)
    drawWheel(ctx, size);
  }, [names, angle, settings.darkMode]);

  useEffect(() => {
    slowSpinIntervalRef.current = setInterval(() => {
      setAngle((prevAngle) => prevAngle + 0.01); // Increment angle slowly
    }, 50); // Adjust interval for smoothness

    return () => {
      if (slowSpinIntervalRef.current) {
        clearInterval(slowSpinIntervalRef.current);
      }
    };
  }, []);

  const spinWheel = () => {
    winSound.stop();
    if (isSpinning || names.length < 2) return;

    // Stop auto-spin
    if (slowSpinIntervalRef.current) {
      clearInterval(slowSpinIntervalRef.current);
      slowSpinIntervalRef.current = null;
    }

    // Call shuffle function if provided
    if (onShuffle) {
      onShuffle();
    }

    setIsSpinning(true);
    spinSound.play();

    const duration = 5500; // Slightly longer duration
    const segmentSize = (2 * Math.PI) / names.length;

    // Randomize the starting angle for true randomness
    const startingAngle = Math.random() * 2 * Math.PI;
    const randomOffset = Math.random() * segmentSize; // Fully random offset within a segment
    const finalAngle = startingAngle + 12 * Math.PI + randomOffset;

    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1); // Ensure progress matches the intended duration

      // Use a more realistic easing function for deceleration
      const easedProgress = 1 - Math.pow(1 - progress, 3); // Changed to cubic easing for smoother animation
      const newAngle =
        startingAngle + (finalAngle - startingAngle) * easedProgress;

      setAngle(newAngle);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        setTimeout(() => spinSound.stop(), 200); // Delay stopping spinSound slightly
        winSound.play();

        // Calculate the winner
        const normalizedAngle =
          ((newAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        const offsetAngle = (normalizedAngle + Math.PI / 2) % (2 * Math.PI);
        const winnerIndex =
          names.length -
          1 -
          (Math.floor(offsetAngle / segmentSize) % names.length);

        const winner = names[winnerIndex];
        console.log(`Winner: ${winner} (index: ${winnerIndex})`);

        if (onSelectWinner) {
          onSelectWinner(winner);
        }

        // Reset angle to avoid bias in subsequent spins
        setAngle(normalizedAngle);

        // Stop auto-spin after announcing the winner
        if (slowSpinIntervalRef.current) {
          clearInterval(slowSpinIntervalRef.current);
          slowSpinIntervalRef.current = null;
        }

        // Stop spin sound immediately after the wheel stops
        spinSound.stop();
      }
    };

    requestAnimationFrame(animate);
  };

  const handleMouseDown = (event: React.MouseEvent | React.TouchEvent) => {
    // Stop auto-spin when the wheel is grabbed
    if (slowSpinIntervalRef.current) {
      clearInterval(slowSpinIntervalRef.current);
      slowSpinIntervalRef.current = null;
    }

    const startAngle = angle;
    const startX =
      "touches" in event ? event.touches[0].clientX : event.clientX;
    const startY =
      "touches" in event ? event.touches[0].clientY : event.clientY;

    let isPulled = false;

    const handleMouseMove = (moveEvent: MouseEvent | TouchEvent) => {
      const currentX =
        "touches" in moveEvent
          ? moveEvent.touches[0].clientX
          : moveEvent.clientX;
      const currentY =
        "touches" in moveEvent
          ? moveEvent.touches[0].clientY
          : moveEvent.clientY;

      const deltaX = currentX - startX;
      const deltaY = currentY - startY;

      const pullDistance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
      if (pullDistance > 20) {
        isPulled = true;
      }

      const newAngle = startAngle + Math.atan2(deltaY, deltaX);
      setAngle(newAngle);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleMouseMove);
      document.removeEventListener("touchend", handleMouseUp);

      if (isPulled) {
        spinWheel();
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleMouseMove);
    document.addEventListener("touchend", handleMouseUp);
  };

  const handleInteractionStart = (
    event: React.MouseEvent | React.TouchEvent
  ) => {
    const isMobile = window.innerWidth <= 768; // Define mobile view threshold

    if (isMobile) {
      spinWheel(); // Click to spin in mobile view
    } else {
      handleMouseDown(event); // Drag to spin in web or iPad view
    }
  };

  return (
    <Box
      textAlign="center"
      bg="transparent"
      color="black"
      display="flex"
      flexDirection={{ base: "column", md: "row" }}
      alignItems="center"
      justifyContent="center"
    >
      <Box
        position="relative"
        width={{ base: "100%", md: "50%" }}
        height={{ base: "300px", md: "600px" }}
        display="flex"
        justifyContent="center"
        alignItems="center"
        cursor={{ base: "pointer", md: "grab" }}
        onMouseDown={handleInteractionStart}
        onTouchStart={handleInteractionStart}
        title="Spin the wheel"
      >
        <Box
          as="canvas"
          ref={canvasRef}
          width={{ base: "300px", md: "600px" }}
          height={{ base: "300px", md: "600px" }}
          borderRadius="full"
          boxShadow="lg"
          opacity={names.length < 2 ? 0.5 : 1}
          transition="box-shadow 0.3s, transform 0.3s"
          _hover={{
            boxShadow: names.length < 2 ? "lg" : "xl",
            transform: names.length < 2 ? "none" : "scale(1.02)",
          }}
        />
      </Box>
    </Box>
  );
};
