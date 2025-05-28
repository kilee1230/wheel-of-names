import { useState } from "react";
import { Box, Button, Flex, Input, Heading, Text } from "@chakra-ui/react";
import { Plus, X, ArrowUp, ArrowDown, Shuffle, Trash } from "lucide-react";

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
  const [newName, setNewName] = useState<string>("");
  const [isAscending, setIsAscending] = useState<boolean>(true);

  const addName = () => {
    if (newName.trim() !== "") {
      const updatedNames = [...names, newName.trim()];
      setNames(updatedNames);
      setNewName("");
    }
  };

  const removeName = (index: number) => {
    const updatedNames = names.filter((_, i) => i !== index);
    setNames(updatedNames);
  };

  return (
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
      <Heading size="md" textAlign="center" color="black">
        Name Entries
      </Heading>

      <Box mt={6}>
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
            onKeyPress={(e) => e.key === "Enter" && addName()}
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
        <Box p={4} borderWidth="1px" borderRadius="lg" boxShadow="sm" mb={6}>
          <Flex align="center" justify="space-between">
            <Button
              bgGradient="linear(to-r, teal.400, blue.500)"
              color="white"
              _hover={{ bgGradient: "linear(to-r, teal.500, blue.600)" }}
              onClick={() => {
                const shuffled = [...names].sort(() => Math.random() - 0.5);
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
              {isAscending ? <SortAZIcon mr={2} /> : <SortZAIcon mr={2} />} Sort
            </Button>
            <Button
              bgGradient="linear(to-r, red.400, pink.500)"
              color="white"
              _hover={{ bgGradient: "linear(to-r, red.500, pink.600)" }}
              onClick={() => setNames([])}
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
            <Flex key={index} align="center" mb={4}>
              {" "}
              {/* Increased margin-bottom */}
              <Text flex="1" truncate>
                {" "}
                {/* Fixed property */}
                {name}
              </Text>
              <Button
                onClick={() => removeName(index)}
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
  );
};
