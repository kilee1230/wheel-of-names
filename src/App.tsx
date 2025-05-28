import { StrictMode, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Wheel } from "./Wheel";
import { NameEntries } from "./NameEntries";
import {
  ChakraProvider,
  Box,
  Container,
  Heading,
  Flex,
  defaultSystem,
} from "@chakra-ui/react";

function App() {
  // Default names
  const defaultNames = [
    "Alice",
    "Bob",
    "Charlie",
    "David",
    "Emma",
    "Frank",
    "Grace",
    "Henry",
  ];
  const [names, setNames] = useState<string[]>(defaultNames);
  const [shuffleNames, setShuffleNames] = useState<boolean>(false);
  const [winner, setWinner] = useState<string | null>(null);

  // Function to handle winner announcement using alert instead of UI element
  const announceWinner = (name: string) => {
    alert(`🎉 Winner: ${name}! 🎉`);
    setWinner(name);
  };

  const handleShuffle = () => {
    if (shuffleNames) {
      const shuffled = [...names].sort(() => Math.random() - 0.5);
      setNames(shuffled);
    }
  };

  return (
    <Box as="main" minH="100vh">
      <Container maxW="container.xl" py={6}>
        <Heading
          mb={8}
          textAlign="center"
          fontSize="3xl"
          fontWeight="bold"
          bgGradient="linear(to-r, blue.600, purple.500, pink.500)"
          bgClip="text"
        >
          🎡 Wheel of Names
        </Heading>

        <Flex width="full" direction={{ base: "column", md: "row" }} gap={4}>
          <Box width={{ base: "100%", md: "60%" }} mb={{ base: 6, md: 0 }}>
            <Wheel
              names={names}
              setNames={setNames}
              onShuffle={handleShuffle}
              onSelectWinner={(name) => announceWinner(name)}
            />
          </Box>
          <Box width={{ base: "100%", md: "40%" }}>
            <NameEntries
              names={names}
              setNames={setNames}
              winner={winner}
              shuffleNames={shuffleNames}
              setShuffleNames={setShuffleNames}
            />
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider value={defaultSystem}>
      <App />
    </ChakraProvider>
  </StrictMode>
);
