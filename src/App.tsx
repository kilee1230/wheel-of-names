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
  Dialog,
  DialogRoot,
  DialogTrigger,
  DialogBackdrop,
  DialogPositioner,
  DialogContent,
  DialogCloseTrigger,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  Button,
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
  const [names, setNames] = useState<string[]>([]);
  const [shuffleNames, setShuffleNames] = useState<boolean>(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const removeWinnerFromWheel = () => {
    if (winner) {
      const updatedNames = names.filter((name) => name !== winner);
      setNames(updatedNames);
      setWinner(null); // Clear the winner after removal
      setIsDialogOpen(false);
    }
  };

  const announceWinner = (name: string) => {
    setWinner(name);
    setIsDialogOpen(true); // Open the dialog without modifying the names
  };

  const handleShuffle = () => {
    if (shuffleNames) {
      const shuffled = [...names].sort(() => Math.random() - 0.5);
      setNames(shuffled);
    }
  };

  return (
    <>
      <Box as="main" minH="100vh">
        <Container maxW="container.xl" py={6}>
          <Heading
            mt={10}
            mb={10}
            textAlign="center"
            fontSize="3xl"
            fontWeight="bold"
            bgGradient="linear(to-r, blue.600, purple.500, pink.500)"
            bgClip="text"
            color="black"
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

      {/* Chakra UI Dialog for winner announcement */}
      <DialogRoot open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger />
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent>
            <DialogCloseTrigger />
            <DialogHeader>
              <DialogTitle>Winner Announcement</DialogTitle>
            </DialogHeader>
            <DialogBody>🎉 Winner: {winner}! 🎉</DialogBody>
            <DialogFooter>
              <Button
                onClick={() => setIsDialogOpen(false)}
                variant="ghost"
                background="transparent"
              >
                Close
              </Button>
              <Button colorScheme="red" onClick={removeWinnerFromWheel} ml={3}>
                Remove
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider value={defaultSystem}>
      <App />
    </ChakraProvider>
  </StrictMode>
);
