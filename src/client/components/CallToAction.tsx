import { VStack, HStack, Text, Link, Divider } from '@chakra-ui/react';
import { FaTwitter, FaGithub } from 'react-icons/fa';
import { Link as WaspLink } from 'wasp/client/router';

export function Footer() {
  return (
    <VStack width='full' py={5} textAlign='center' gap={4}>
      <Divider />
      <VStack gap={3}>
        <WaspLink to='/tos'>
          <Text fontSize='sm' color='purple.300'>
            Terms of Service
          </Text>
        </WaspLink>
        <WaspLink to='/privacy'>
          <Text fontSize='sm' color='purple.300'>
            Privacy Policy
          </Text>
        </WaspLink>
      </VStack>
    </VStack>
  );
}
