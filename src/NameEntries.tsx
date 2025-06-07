import { useState, useEffect, useRef } from "react";
import { Box, Button, Flex } from "@chakra-ui/react";
import { ArrowUp, ArrowDown, Shuffle, Trash } from "lucide-react";

const SortAZIcon = (props: any) => <Box as={ArrowUp} {...props} />;
const SortZAIcon = (props: any) => <Box as={ArrowDown} {...props} />;
const ShuffleIcon = (props: any) => <Box as={Shuffle} {...props} />;
const DeleteIcon = (props: any) => <Box as={Trash} {...props} />;

interface NameEntriesProps {
  names: string[];
  setNames: (names: string[]) => void;
}

export const NameEntries: React.FC<NameEntriesProps> = ({
  names,
  setNames,
}) => {
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

  const [newName, setNewName] = useState<string>("");
  const [isAscending, setIsAscending] = useState<boolean>(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const storedNames = localStorage.getItem("wheel-names");
    if (storedNames) {
      try {
        const parsedNames = JSON.parse(storedNames);
        if (Array.isArray(parsedNames) && parsedNames.length > 0) {
          setNames(parsedNames);

          // Populate the textarea with stored names
          const textarea = document.querySelector("textarea");
          if (textarea) {
            textarea.value = parsedNames.join("\n");
          }
        } else {
          updateNames(defaultNames); // Initialize with default names if stored data is invalid
        }
      } catch (error) {
        console.error("Error parsing names from localStorage:", error);
        setNames(defaultNames); // Fallback to default names on error
      }
    } else {
      setNames(defaultNames); // Initialize with default names if no data is stored
    }
  }, []);

  const updateNames = (updatedNames: string[]) => {
    setNames(updatedNames);
    localStorage.setItem("wheel-names", JSON.stringify(updatedNames));

    // Update the textarea content
    const textarea = document.querySelector("textarea");
    if (textarea) {
      textarea.value = updatedNames.join("\n");
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const updatedNames = text
      .split("\n")
      .map((name) => name.trim())
      .filter((name) => name);
    setNames(updatedNames);
    localStorage.setItem("wheel-names", JSON.stringify(updatedNames));
  };

  return (
    <>
      <Box
        width="full"
        borderRadius="xl"
        overflow="hidden"
        boxShadow="xl"
        bg="white"
        _dark={{ bg: "gray.800" }}
        borderWidth="1px"
        borderColor="gray.200"
        height="full"
        p={6}
      >
        <Box>
          <Flex align="center" justify="start" gap={2}>
            <Button
              bgGradient="linear(to-r, teal.400, blue.500)"
              color="white"
              _hover={{ bgGradient: "linear(to-r, teal.500, blue.600)" }}
              onClick={() => {
                const shuffled = [...names].sort(() => Math.random() - 0.9);
                updateNames(shuffled);
              }}
              display="flex"
              alignItems="center"
            >
              <ShuffleIcon />
              <Box display={{ base: "none", md: "block" }}>Shuffle</Box>
            </Button>
            <Button
              bgGradient="linear(to-r, green.400, lime.500)"
              color="white"
              _hover={{ bgGradient: "linear(to-r, green.500, lime.600)" }}
              onClick={() => {
                const sortedNames = isAscending
                  ? [...names].sort((a, b) => a.localeCompare(b))
                  : [...names].sort((a, b) => b.localeCompare(a));
                updateNames(sortedNames);
                setIsAscending(!isAscending);
              }}
              display="flex"
              alignItems="center"
            >
              {isAscending ? <SortAZIcon /> : <SortZAIcon />}
              <Box display={{ base: "none", md: "block" }}>Sort</Box>
            </Button>
            <Button
              bgGradient="linear(to-r, red.400, pink.500)"
              color="white"
              _hover={{ bgGradient: "linear(to-r, red.500, pink.600)" }}
              onClick={() => {
                updateNames([]);
              }}
              display="flex"
              alignItems="center"
            >
              <DeleteIcon />
              <Box display={{ base: "none", md: "block" }}>Clear</Box>
            </Button>
          </Flex>
        </Box>

        <Box mt={6}>
          <textarea
            placeholder="Enter names, one per line"
            style={{
              width: "100%",
              height: "auto",
              minHeight: "500px",
              resize: "none",
              backgroundColor: "#f0f8ff",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "10px",
              fontFamily: "Arial, sans-serif",
              fontSize: "14px",
            }}
            onChange={handleTextareaChange}
          />
        </Box>
      </Box>
    </>
  );
};
