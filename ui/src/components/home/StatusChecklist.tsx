import React from 'react';

import { Text, Box } from '@chakra-ui/react';

type StatusChecklistPropsType = {};
const featureChecklist = [
];
const StatusChecklist = (_: StatusChecklistPropsType) => {
  return (
    <Box
      backgroundColor="gray.200"
      p="16px"
      borderRadius="8px"
      mt={['32px', 0]}
    >
      {featureChecklist.map((item) => {
        return (
          <Box display="flex" key={item} marginY={1} alignItems="center">
            <CheckIcon color="green.500" fontSize="lg" />
            <Text fontSize="lg" ml={4}>
              {item}
            </Text>
          </Box>
        );
      })}
    </Box>
  );
};

export default StatusChecklist;
