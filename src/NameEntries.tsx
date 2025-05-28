import { useState } from "react";
import { Box, Button, Flex, Input, Heading, Text } from "@chakra-ui/react";
import { Plus, X } from "lucide-react";

const AddIcon = (props: any) => <Box as={Plus} {...props} />;
const CloseIcon = (props: any) => <Box as={X} {...props} />;

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
          {" "}
          {/* Added margin-bottom */}
          <Flex align="center">
            <input
              type="checkbox"
              checked={shuffleNames}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setShuffleNames(e.target.checked)
              }
              style={{ marginRight: "12px" }}
            />
            <Text fontSize="sm" fontWeight="medium">
              Shuffle before spinning
            </Text>
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
