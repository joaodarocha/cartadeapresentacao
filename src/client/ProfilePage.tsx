import { type User } from 'wasp/entities';
import { logout } from 'wasp/client/auth';

import { stripePayment, stripeGpt4Payment, stripeCreditsPayment, useQuery, getUserInfo } from 'wasp/client/operations';

import BorderBox from './components/BorderBox';
import { Box, Heading, Text, Button, Code, Spinner, VStack, HStack, Link } from '@chakra-ui/react';
import { useState } from 'react';
import { IoWarningOutline } from 'react-icons/io5';

export default function ProfilePage({ user }: { user: User }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isCreditsLoading, setIsCreditsLoading] = useState(false);
  const [isGpt4loading, setIsGpt4Loading] = useState(false);

  const { data: userInfo } = useQuery(getUserInfo, { id: user.id });

  const userPaidOnDay = new Date(String(user.datePaid));
  const oneMonthFromDatePaid = new Date(userPaidOnDay.setMonth(userPaidOnDay.getMonth() + 1));

  async function handleCreditsClick() {
    setIsCreditsLoading(true);
    try {
      const response = await stripeCreditsPayment();
      const url = response.sessionUrl;
      if (url) window.open(url, '_self');
    } catch (error) {
      alert('Algo correu mal. Por favor, tente novamente');
    }
    setIsCreditsLoading(false);
  }

  async function handleBuy4oMini() {
    setIsLoading(true);
    try {
      const response = await stripePayment();
      const url = response.sessionUrl;
      if (url) window.open(url, '_self');
    } catch (error) {
      alert('Algo correu mal. Por favor, tente novamente');
    }
    setIsLoading(false);
  }

  async function handleBuy4o() {
    setIsGpt4Loading(true);
    try {
      const response = await stripeGpt4Payment();
      const url = response.sessionUrl;
      if (url) window.open(url, '_self');
    } catch (error) {
      alert('Algo correu mal. Por favor, tente novamente');
    }
    setIsGpt4Loading(false);
  }

  return (
    <BorderBox>
      {!!userInfo ? (
        <>
          <Heading size='md'>👋 Olá {userInfo.email || 'Utilizador'} </Heading>
          {userInfo.subscriptionStatus === 'past_due' ? (
            <VStack gap={3} py={5} alignItems='center'>
              <Box color='blue.400'>
                <IoWarningOutline size={30} color='inherit' />
              </Box>
              <Text textAlign='center' fontSize='sm' textColor='text-contrast-lg'>
                A sua subscrição está em atraso. <br /> Por favor, actualize o seu método de pagamento{' '}
                <Link textColor='blue.400' href='https://billing.stripe.com/p/login/test_6oU6oJ9il3Aderv6P65AQ00'>
                  clicando aqui
                </Link>
              </Text>
            </VStack>
          ) : userInfo.hasPaid && !userInfo.isUsingLn ? (
            <VStack gap={3} pt={5} alignItems='flex-start'>
              <Text textAlign='initial'>Muito obrigado pelo seu apoio!</Text>

              <Text textAlign='initial'>Tem acesso ilimitado ao CoverLetterGPT usando {user?.gptModel === 'gpt-4' || user?.gptModel === 'gpt-4o' ? 'GPT-4o.' : 'GPT-4o-mini.'}</Text>

              {userInfo.subscriptionStatus === 'canceled' && (
                <Code alignSelf='center' fontSize='lg'>
                  {oneMonthFromDatePaid.toUTCString().slice(0, -13)}
                </Code>
              )}
              <Text alignSelf='initial' fontSize='sm' fontStyle='italic' textColor='text-contrast-sm'>
                Para gerir a sua subscrição, por favor{' '}
                <Link textColor='blue.600' href='https://billing.stripe.com/p/login/test_6oU6oJ9il3Aderv6P65AQ00'>
                  clique aqui.
                </Link>
              </Text>
            </VStack>
          ) : (
            !userInfo.isUsingLn && (
              <HStack pt={3} textAlign='center'>
                <Heading size='sm'>Tem </Heading>
                <Code>{userInfo?.credits ? userInfo.credits : '0'}</Code>
                <Heading size='sm'>carta{userInfo?.credits === 1 ? '' : 's'} de apresentação restante{userInfo?.credits === 1 ? '' : 's'}</Heading>
              </HStack>
            )
          )}
          {!userInfo.hasPaid && !userInfo.isUsingLn && (
            <VStack py={3} gap={5}>
              <VStack py={3} gap={2}>
                <HStack gap={5} display='grid' gridTemplateColumns='1fr 1fr'>
                  <VStack
                    layerStyle='card'
                    py={5}
                    px={7}
                    gap={3}
                    height='100%'
                    width='100%'
                    justifyContent='space-between'
                    alignItems='center'
                  >
                    <VStack gap={3} alignItems='start'>
                      <Heading size='xl'>€2.95</Heading>
                      <Text textAlign='start' fontSize='md'>
                        10 créditos<br />
                        (10 Cartas de Apresentação)
                      </Text>
                    </VStack>
                    <Button mr={3} isLoading={isCreditsLoading} onClick={handleCreditsClick}>
                      Comprar Agora
                    </Button>
                  </VStack>
                  <VStack layerStyle='cardMd' borderColor={'blue.200'} borderWidth={3} py={5} px={7} gap={3} height='100%' width='100%' justifyContent='space-between' alignItems='center'>
                    <VStack gap={3} alignItems='start'>
                      <Heading size='xl'>€5.95</Heading>
                      <Text textAlign='start' fontSize='md'>
                        Ilimitado
                        <br />
                        subscrição mensal
                      </Text>
                    </VStack>
                    <Button mr={3} isLoading={isLoading} onClick={handleBuy4oMini}>
                      Comprar Agora!
                    </Button>
                  </VStack>
                </HStack>
              </VStack>
            </VStack>
          )}
          {userInfo.isUsingLn && (
            <VStack py={3} gap={5}>
              <VStack py={3} gap={2}>
                <HStack gap={5} display='grid' gridTemplateColumns='1fr'>
                  <VStack layerStyle='card' py={5} px={7} gap={3} height='100%' width='100%' justifyContent='center' alignItems='center'>
                    <VStack gap={3} alignItems='center'>
                      <Heading size='xl'>⚡️</Heading>
                      <Text textAlign='start' fontSize='md'>
                        Tem acesso acessível e por utilização ao CoverLetterGPT com GPT-4o através da Lightning Network
                      </Text>
                      <Text textAlign='start' fontSize='sm'>
                        Nota: se preferir uma subscrição mensal, por favor termine a sessão e inicie sessão com Google.
                      </Text>
                    </VStack>
                  </VStack>
                </HStack>
              </VStack>
            </VStack>
          )}
          <Button alignSelf='flex-end' size='sm' onClick={() => logout()}>
            Terminar Sessão
          </Button>
        </>
      ) : (
        <Spinner />
      )}
    </BorderBox>
  );
}
