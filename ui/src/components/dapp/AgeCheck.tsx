import React, { useEffect, useCallback, useState } from 'react';

import {
  Text,
  Box,
  Heading,
  Button,
  Collapse,
  Input,
  Flex,
  Alert,
  Spinner,
  useToast,
} from '@chakra-ui/react';

import { getAgeCheckContract } from '@hooks/contractHelpers';
import { generateBroadcastParams } from '@utils/zk/zk-witness';
import { truncateAddress } from '@utils/wallet';

import { useWalletContext } from './WalletContext';
import DocScan from './DocScan';
import { ethers } from 'ethers';
import { MINT_ABI } from '@abi/ExampleMint';

const AgeCheck = () => {
  const MINT_NFT_CONTRACT_ADDRESS =
    '0xCd44114d387d2bB4d64F9caFa3c67Ba3E9D19F6e';

  const [minting, setMinting] = useState<'notMinted' | 'minting' | 'minted'>(
    'notMinted',
  );
  const [age, setAge] = React.useState<number>(0);
  const [isScanned, setIsScanned] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();
  const [statusMsg, setStatusMsg] = React.useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [canMint, setCanMint] = useState(false);
  const [alert, setAlert] = React.useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  });
  const [ageVerified, setAgeVerified] = React.useState<boolean>(false);
  const { chainId, provider, account } = useWalletContext();
  const toast = useToast();

  const ageCheckContract = React.useMemo(
    () => getAgeCheckContract(chainId ?? 1666700000),
    [chainId],
  );

  useEffect(() => {
    console.log(1);
    if (ageCheckContract == null || chainId == null || account == null) {
      return;
    }

    ageCheckContract.on(
      'AgeVerfied',
      (address: string, isVerified: boolean) => {
        if (isVerified && address === account) {
          setAlert({
            open: true,
            message: `Age Verified for ${truncateAddress(address)}`,
          });
          setAgeVerified(true);
          setStatusMsg(undefined);
          setLoading(false);
          return;
        }
        if (!isVerified && address === account) {
          setAlert({
            open: true,
            message: `Age flag reset for ${truncateAddress(address)}`,
          });
          setAgeVerified(false);
          return;
        }
      },
    );
  }, [chainId, account, ageCheckContract]);

  const getAgeVerificationStatus = useCallback(async () => {
    if (account == null || ageCheckContract == null || chainId == null) {
      return;
    }

    const isVerified = await ageCheckContract.getVerficationStatus(account);

    if (isVerified) {
      setAgeVerified(true);
    }
  }, [ageCheckContract, account, chainId]);

  useEffect(() => {
    getAgeVerificationStatus();
  }, [account, getAgeVerificationStatus, chainId, ageCheckContract]);

  const handleVerify = async () => {
    if (ageCheckContract == null || provider == null) {
      return;
    }
    setLoading(true);
    setStatusMsg('Generating Proof...');
    try {
      const [a, b, c, input] = await generateBroadcastParams(
        {
          ...{
            ageLimit: 18,
            age,
          },
        },
        'circuit',
      );
      setError(undefined);
      setStatusMsg('Proof Generated...');
      const proof = [...a, ...b[0], ...b[1], ...c];

      setStatusMsg('Verifying Proof...');
      try {
        const tx = await ageCheckContract
          .connect(provider.getSigner())
          .verifyUsingGroth(proof, input);
        if (tx?.hash) {
          setAlert({
            open: true,
            message: `Transaction broadcasted with hash ${tx.hash}`,
          });
          setCanMint(true);
        }
      } catch (e) {
        setAlert({
          open: true,
          message: `Error sending transaction. Please try again!`,
        });
        console.log(`Errror: ${e}`);
        setStatusMsg(undefined);
        setLoading(false);
      }
    } catch (e) {
      setError('Failed to generate proof, possibly age not valid.');
      setStatusMsg('Invalid proof');
      setLoading(false);
    }
  };

  // Mint NFT Function
  const handleMint = async () => {
    setMinting('minting');
    toast({
      title: 'Miniting NFT',
      status: 'info',
      duration: 4000,
      isClosable: false,
    });
    try {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum as ethers.providers.ExternalProvider,
      );

      const contract = new ethers.Contract(
        MINT_NFT_CONTRACT_ADDRESS,
        MINT_ABI,
        provider,
      );

      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Get the signer from the provider
      const signer = provider.getSigner();
      console.log({ signer });

      // Create a transaction object for the mint function
      const transaction = await contract.connect(signer).safeMint();
      console.log({ transaction });

      // Prompt the user to sign the transaction using MetaMask
      const response = await transaction.wait();
      console.log({ response });
      setMinting('minted');
      toast({
        title: 'NFT Minted',
        status: 'success',
        duration: 4000,
        isClosable: false,
      });
    } catch (err) {
      setMinting('notMinted');
      console.log(err);
      toast({
        title: 'NFT Mint Failed',
        description: 'Please try again!',
        status: 'error',
        duration: 4000,
        isClosable: false,
      });
    }
  };

  const handleReset = async () => {
    if (ageCheckContract == null || provider == null) {
      return;
    }
    try {
      const tx = await ageCheckContract
        .connect(provider.getSigner())
        .setVerficationStatus(false);

      if (tx?.hash) {
        setAlert({
          open: true,
          message: `Transaction broadcasted with hash ${tx.hash}`,
        });
      }
    } catch (e) {
      setAlert({
        open: true,
        message: `Error sending transaction. Please try again!`,
      });
    }
  };
  const AgeVerfiedText = React.memo(() => {
    if (account == null) {
      return null;
      console.log(ageCheckContract, provider, account, chainId);
    }
    return (
      <Text mb="8px">
        Age for<b> {truncateAddress(account) ?? ''} </b>{' '}
        {ageVerified ? 'is above 18.' : 'not verified.'}
      </Text>
    );
  });

  return (
    <div>
      <Box display="flex" flexDirection="row" justifyContent="center">
        <Collapse
          in={alert.open}
          style={{ margin: 0, padding: 0, width: '300px' }}
        >
          <Alert variant="subtle" status="success" sx={{ mb: 2 }}>
            <Text flexWrap={'wrap'} sx={{ wordBreak: 'break-word' }}>
              {alert.message}
            </Text>
          </Alert>
        </Collapse>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignContent: 'center',
          marginBottom: '16px',
          marginTop: '20px',
        }}
      >
        <Heading variant={'h2'}>
          Age verification using Zero Knowledge Proofs.
        </Heading>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignContent: 'center',
          marginBottom: '16px',
          marginTop: '16px',
        }}
      >
        <Box
          sx={{
            height: '140px',
            width: '300px',
            backgroundColor: '#D0CDD7',
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            padding: '8px',
            borderRadius: '16px',
            marginTop: '30px',
          }}
        >
          {account ? (
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              marginTop="10px"
            >
              <AgeVerfiedText />
              {canMint ? (
                <Button
                  variant="solid"
                  onClick={handleMint}
                  disabled={minting == 'minted'}
                >
                  {minting == 'notMinted' ? (
                    'Mint NFT'
                  ) : minting == 'minting' ? (
                    <Spinner size="xs" />
                  ) : minting == 'minted' ? (
                    'NFT Minted'
                  ) : (
                    ''
                  )}
                </Button>
              ) : (
                ''
              )}
            </Box>
          ) : (
            <Text fontSize="lg" variant="bold" as="b">
              {' '}
              Please connect your wallet.
            </Text>
          )}
        </Box>
      </Box>
      <DocScan
        setAge={setAge}
        onScan={() => {
          setIsScanned(true);
        }}
      />
      {isScanned && (
        <Flex justifyContent="center">
          <Input
            id="outlined-basic"
            value={age}
            type="number"
            disabled
            onChange={(e) => setAge(Number(e.target.value ?? 0))}
            isInvalid={!!error}
            errorBorderColor="red.300"
            w="140px"
            style={{ marginRight: '8px' }}
          />

          <Button
            variant="solid"
            bg="black"
            _hover={{ bg: 'gray.600' }}
            color="white"
            onClick={handleVerify}
            isLoading={loading}
            loadingText="Verifying"
          >
            Verify Age
          </Button>
        </Flex>
      )}
      <Flex justifyContent="center" mt="8px">
        <Text fontSize="lg">{statusMsg}</Text>
        {loading && <Spinner />}
      </Flex>
    </div>
  );
};

export default AgeCheck;
