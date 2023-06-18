import { useState } from 'react';
import { ChevronDownIcon, HamburgerIcon } from '@chakra-ui/icons';
import {
  Box,
  CloseButton,
  Container,
  Flex,
  IconButton,
  Image,
  Link,
  Stack,
  Text,
  Button,
} from '@chakra-ui/react';
import { Links } from '@config/constants';
import { useWalletContext } from './dapp/WalletContext';

type MenuLinkProps = {
  text: string;
  link: string;
  newTab?: boolean;
};

function MenuLink(props: MenuLinkProps) {
  const { text, link, newTab = false } = props;

  return (
    <Link
      borderBottomWidth={0}
      borderBottomColor="gray.500"
      _hover={{ textDecoration: 'none', borderBottomColor: 'black' }}
      fontWeight={500}
      color="black"
      href={link}
      target={newTab ? '_blank' : '_self'}
    >
      {text}
    </Link>
  );
}

function DesktopMenuLinks() {
  return (
    <Stack
      d={['none', 'flex', 'flex']}
      shouldWrapChildren
      isInline
      spacing="15px"
      alignItems="center"
      color="gray.50"
      fontSize="15px"
    ></Stack>
  );
}

function MobileMenuLinks() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <IconButton
        rounded="5px"
        padding={0}
        aria-label={'Menu'}
        d={['block', 'none', 'none']}
        icon={<HamburgerIcon color="black" w="25px" height="25px" />}
        color="black"
        cursor="pointer"
        h="auto"
        bg="transparent"
        _hover={{ bg: 'transparent' }}
        _active={{ bg: 'transparent' }}
        _focus={{ bg: 'transparent' }}
        onClick={() => setIsOpen(true)}
      />

      {isOpen && (
        <Stack
          color="gray.100"
          fontSize={['22px', '22px', '22px', '32px']}
          alignItems="center"
          justifyContent="center"
          pos="fixed"
          left={0}
          right={0}
          bottom={0}
          top={0}
          bg="gray.900"
          spacing="12px"
          zIndex={999}
        >
          <CloseButton
            onClick={() => setIsOpen(false)}
            pos="fixed"
            top="40px"
            right="15px"
            size="lg"
          />
        </Stack>
      )}
    </>
  );
}

type GlobalHeaderProps = {
  variant?: 'transparent' | 'solid';
};

export function GlobalHeader(props: GlobalHeaderProps) {
  const { variant = 'solid' } = props;
  const { account, connectWallet, disconnect } = useWalletContext();

  return (
    <Box bg={variant === 'solid' ? 'gray.900' : 'transparent'} p="20px 0">
      <Container maxW="container.lg">
        <Flex justifyContent="space-between" alignItems="center">
          <Box>
            <Link
              w="100%"
              d="flex"
              href={Links.home}
              alignItems="center"
              color="black"
              fontWeight={600}
              _hover={{ textDecoration: 'none' }}
              fontSize="18px"
            >
              <Image
                alt=""
                h="30px"
                w="30px"
                src="../assets/images/zk-block-logo.svg"
                mr="10px"
              />
              <Text as="span">zkCred</Text>
            </Link>
          </Box>
          <Box>
            {account ? (
              <Button
                variant="solid"
                bg="black"
                _hover={{ bg: 'gray.600' }}
                color="white"
                onClick={disconnect}
                title="Disconnect Wallet"
              >
                {account.trim().slice(0, 4) + '....' + account.trim().slice(-4)}
              </Button>
            ) : (
              <Button
                variant="solid"
                bg="black"
                _hover={{ bg: 'gray.600' }}
                color="white"
                onClick={connectWallet}
              >
                Connect Wallet
              </Button>
            )}
            <DesktopMenuLinks />
            <MobileMenuLinks />
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}
