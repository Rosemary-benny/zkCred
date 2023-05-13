import {
  Box,
  Container,
} from '@chakra-ui/react';
import { Links, twitterLink } from '@config/constants';


function NavigationLinks() {
  return (
    <>
      
    </>
  );
}

export function Footer() {
  return (
    <Box p={['25px 0', '25px 0', '18px 0']}>
      <Container maxW="container.lg">
        <NavigationLinks />
      </Container>
    </Box>
  );
}
