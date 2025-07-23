import { Divider, Text, VStack } from '@chakra-ui/react';
import { Link as WaspLink } from 'wasp/client/router';

export function Footer() {
  return (
    <VStack width='full' py={5} textAlign='center' gap={4}>
      <Divider/>
      <VStack gap={3}>
        <WaspLink to='/tos'>
          <Text fontSize='sm' color='blue.300'>
            Terms of Service
          </Text>
        </WaspLink>
        <WaspLink to='/privacy'>
          <Text fontSize='sm' color='blue.300'>
            Privacy Policy
          </Text>
        </WaspLink>
      </VStack>
    </VStack>
  );
}
