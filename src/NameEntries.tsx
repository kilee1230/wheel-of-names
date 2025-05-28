import { useState, useEffect } from "react";
import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";
import { Plus, X, ArrowUp, ArrowDown, Shuffle, Trash } from "lucide-react";
import "./fireworks.css";

const AddIcon = (props: any) => <Box as={Plus} {...props} />;
const CloseIcon = (props: any) => <Box as={X} {...props} />;
const SortAZIcon = (props: any) => <Box as={ArrowUp} {...props} />;
const SortZAIcon = (props: any) => <Box as={ArrowDown} {...props} />;
const ShuffleIcon = (props: any) => <Box as={Shuffle} {...props} />;
const DeleteIcon = (props: any) => <Box as={Trash} {...props} />;

interface NameEntriesProps {
  names: string[];
  setNames: (names: string[]) => void;
  winner: string | null;
  shuffleNames: boolean;
  setShuffleNames: (shuffle: boolean) => void;
}

export const NameEntries: React.FC<NameEntriesProps> = ({
  names,
  setNames,
  winner,
  shuffleNames,
  setShuffleNames,
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

  useEffect(() => {
    const storedNames = localStorage.getItem("wheel-names");
    if (storedNames) {
      try {
        const parsedNames = JSON.parse(storedNames);
        if (Array.isArray(parsedNames) && parsedNames.length > 0) {
          setNames(parsedNames);
        } else {
          setNames(defaultNames); // Initialize with default names if stored data is invalid
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
  };

  const addName = () => {
    if (newName.trim() !== "") {
      const updatedNames = [...names, newName.trim()];
      updateNames(updatedNames);
      setNewName("");
    }
  };

  const promptRemoveName = (nameToRemove: string) => {
    const updatedNames = names.filter((name) => name !== nameToRemove);
    updateNames(updatedNames);
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
        p={6} // Added padding for spacing
      >
        <Box mt={2}>
          {" "}
          {/* Added margin-top for spacing */}
          <Flex mb={6} align="center">
            {" "}
            {/* Increased margin-bottom */}
            <Input
              flex="1"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Add a name"
              onKeyDown={(e) => e.key === "Enter" && addName()}
              borderRightRadius="0"
            />
            <Button
              onClick={addName}
              colorScheme="blue"
              borderLeftRadius="0"
              px={6}
              display="flex"
              alignItems="center"
            >
              <AddIcon mr={2} /> Add
            </Button>
          </Flex>
          <Box>
            <Flex align="center" justify="start" gap={2}>
              <Button
                bgGradient="linear(to-r, teal.400, blue.500)"
                color="white"
                _hover={{ bgGradient: "linear(to-r, teal.500, blue.600)" }}
                onClick={() => {
                  const shuffled = [...names].sort(() => Math.random() - 0.9);
                  setNames(shuffled);
                }}
                display="flex"
                alignItems="center"
              >
                <ShuffleIcon mr={2} /> Shuffle
              </Button>
              <Button
                bgGradient="linear(to-r, green.400, lime.500)"
                color="white"
                _hover={{ bgGradient: "linear(to-r, green.500, lime.600)" }}
                onClick={() => {
                  const sortedNames = isAscending
                    ? [...names].sort((a, b) => a.localeCompare(b))
                    : [...names].sort((a, b) => b.localeCompare(a));
                  setNames(sortedNames);
                  setIsAscending(!isAscending);
                }}
                display="flex"
                alignItems="center"
              >
                {isAscending ? <SortAZIcon mr={2} /> : <SortZAIcon mr={2} />}{" "}
                Sort
              </Button>
              <Button
                bgGradient="linear(to-r, red.400, pink.500)"
                color="white"
                _hover={{ bgGradient: "linear(to-r, red.500, pink.600)" }}
                onClick={() => {
                  setNames([]);
                  updateNames([]);
                }}
                display="flex"
                alignItems="center"
              >
                <DeleteIcon mr={2} /> Clear
              </Button>
            </Flex>
          </Box>
          <Box mt={6}>
            {" "}
            {/* Added margin-top for spacing */}
            {names.map((name, index) => (
              <Flex key={index} align="center" mb={4} data-name={name}>
                {" "}
                {/* Increased margin-bottom */}
                <Text flex="1" truncate>
                  {" "}
                  {/* Fixed property */}
                  {name}
                </Text>
                <Button
                  onClick={() => promptRemoveName(name)}
                  size="sm"
                  variant="ghost"
                  colorScheme="red"
                  ml={2}
                  display="flex"
                  alignItems="center"
                >
                  <CloseIcon />
                </Button>
              </Flex>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );
};
