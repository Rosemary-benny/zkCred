import React from 'react';

import Link from 'next/link';
import {
  Box,
  Heading,
  Button,
  Text,
  Divider,
  Container,
  Flex,
  Stack,
} from '@chakra-ui/react';
import StatusChecklist from '@components/home/StatusChecklist';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';


const Index = () => {
  return (
    <Main
      meta={
        <Meta
          title="Zk Block"
          description="Zero Knowledge Proofs"
        />
      }
    >
      <Box display="flex" flexDirection="column" justifyContent="center">
        <Container maxW="container.lg" pb="90px">
          <Box py={['23px', '23px', '35px']} color="gray.200">
            <Heading
              color="black"
              fontSize={['22px', '22px', '28px']}
              mb={['8px', '8px', '16px']}
            >
              zk-Cred{' '}
            </Heading>

         
          </Box>
          <Divider />
        </Container>

        <Box>
          <Container maxW="container.lg">
            <Flex
              flexDirection={['column', 'row']}
              justifyContent="space-between"
              mb="16px"
            >
              <Stack spacing="24px">
                

                <Divider />
                <Link href="/dapp" passHref>
                  <Button bg="black" color="white" _hover={{ bg: 'gray.600' }}>
                    zk Age Verification
                  </Button>
                </Link>
                
                {/* <Link href="" passHref>
                  <Button
                    disabled
                    bg="black"
                    color="white"
                    _hover={{ bg: 'gray.600' }}
                  >
                    {' '}
                    zK Authentication (coming soon)
                  </Button>
                </Link> */}
              </Stack>
              <StatusChecklist />
            </Flex>
          </Container>
        </Box>
      </Box>
    </Main>
  );
};

export default Index;
