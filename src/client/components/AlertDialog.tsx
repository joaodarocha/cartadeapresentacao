import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Code,
  Spacer,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { AiOutlineLogin } from 'react-icons/ai';
import { BiTrash } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { deleteJob } from "wasp/client/operations";

export function LeaveATip({
  isOpen,
  onClose,
  credits,
  isUsingLn,
}: {
  isUsingLn: boolean;
  credits: number;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const tipRef = useRef(null);

  const navigate = useNavigate();
  const handleClick = async () => {
    navigate('/profile');
    onClose();
  };

  return (
    <>
      <AlertDialog isOpen={isOpen} leastDestructiveRef={tipRef} onClose={onClose}>
        <AlertDialogOverlay backdropFilter='auto' backdropInvert='15%' backdropBlur='2px'>
          <AlertDialogContent bgColor='bg-modal'>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              👋 Obrigado por experimentar o CoverLetterGPT.
            </AlertDialogHeader>

            <AlertDialogBody textAlign='center'>
              <Text>
                Tem <Code>{credits}</Code> {credits === 1 ? 'crédito gratuito' : 'créditos gratuitos'} de carta de apresentação restante{credits === 1 ? '' : 's'}.
              </Text>
              <Text mt={4}>
                {!isUsingLn ? (
                  <>
                    Compre acesso ilimitado por apenas <Code>$2.95</Code> por mês!
                  </>
                ) : (
                  <>Depois, pague apenas uma pequena taxa por carta de apresentação com a sua carteira lightning ⚡️. </>
                )}
              </Text>
            </AlertDialogBody>

            <AlertDialogFooter>
              {!isUsingLn ? (
                <>
                  <Button isLoading={isLoading} ref={tipRef} colorScheme='blue' onClick={handleClick}>
                    💰 Comprar Mais
                  </Button>
                  <Spacer />
                  <Button alignSelf='flex-end' fontSize='sm' variant='solid' size='sm' onClick={onClose}>
                    Não, Obrigado
                  </Button>
                </>
              ) : (
                <Button alignSelf='flex-end' fontSize='sm' variant='solid' size='sm' onClick={onClose}>
                  OK
                </Button>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export function LoginToBegin({ isOpen, onClose }: { isOpen: boolean; onOpen: () => void; onClose: () => void }) {
  const navigate = useNavigate();
  const loginRef = useRef(null);

  const handleClick = async () => {
    navigate('/login');
    onClose();
  };

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={loginRef} onClose={onClose}>
      <AlertDialogOverlay backdropFilter='auto' backdropInvert='15%' backdropBlur='2px'>
        <AlertDialogContent bgColor='bg-modal'>
          <AlertDialogHeader textAlign='center' fontSize='md' mt={3} fontWeight='bold'>
            ✋
          </AlertDialogHeader>

          <AlertDialogBody textAlign='center'>Por favor, inicie sessão para começar!</AlertDialogBody>

          <AlertDialogFooter justifyContent='center'>
            <Button ref={loginRef} leftIcon={<AiOutlineLogin />} colorScheme='blue' onClick={handleClick}>
              Iniciar Sessão
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

export function DeleteJob({
  isOpen,
  onClose,
  jobId,
}: {
  jobId: string | null;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const cancelRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
      <AlertDialogOverlay backdropFilter='auto' backdropInvert='15%' backdropBlur='2px'>
        <AlertDialogContent bgColor='bg-modal'>
          <AlertDialogHeader fontSize='md' mt={3} fontWeight='bold'>
            ⛔️ Eliminar Emprego
          </AlertDialogHeader>

          <AlertDialogBody>
            Eliminar o emprego e todas as suas cartas de apresentação?
            <br />
            Esta acção não pode ser desfeita.
          </AlertDialogBody>

          <AlertDialogFooter display='grid' gridTemplateColumns='1fr 1fr 1fr'>
            <Button
              leftIcon={<BiTrash />}
              size='sm'
              isLoading={isLoading}
              onClick={async () => {
                if (!jobId) return;
                setIsLoading(true);
                await deleteJob({ jobId });
                setIsLoading(false);
                onClose();
              }}
            >
              Eliminar
            </Button>
            <Spacer />
            <Button ref={cancelRef} size='sm' colorScheme='blue' onClick={onClose}>
              Cancelar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

export function EditAlert({ coverLetter }: { coverLetter: boolean }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (coverLetter && localStorage.getItem('edit-alert') !== 'do not show') {
      onOpen();
    }
  }, [coverLetter]);

  const cancelRef = useRef(null);
  function handleCheckboxChange(e: any) {
    if (e.target.checked) {
      localStorage.setItem('edit-alert', 'do not show');
    } else {
      localStorage.removeItem('edit-alert');
    }
  }

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
      <AlertDialogOverlay backdropFilter='auto' backdropInvert='15%' backdropBlur='2px'>
        <AlertDialogContent bgColor='bg-modal'>
          <AlertDialogHeader fontSize='md' mt={3} fontWeight='bold'>
            📝 A sua carta de apresentação está pronta!
          </AlertDialogHeader>

          <AlertDialogBody gap={5} pointerEvents='none'>
            <Text pb={3}>
              Se quiser fazer edições mais precisas, realce o texto que gostaria de alterar para aceder ao pop-up abaixo:
            </Text>
            <VStack m={3} gap={1} borderRadius='lg'>
              <Box layerStyle='cardLg' p={3}>
                <Text fontSize='sm' textAlign='center'>
                  🤔 Pedir ao GPT para tornar esta parte mais..
                </Text>
                <ButtonGroup size='xs' p={1} variant='solid' colorScheme='blue' isAttached>
                  <Button size='xs' color='white' fontSize='xs'>
                    Concisa
                  </Button>

                  <Button size='xs' color='white' fontSize='xs'>
                    Detalhada
                  </Button>

                  <Button size='xs' color='white' fontSize='xs'>
                    Profissional
                  </Button>

                  <Button size='xs' color='white' fontSize='xs'>
                    Informal
                  </Button>
                </ButtonGroup>
              </Box>
            </VStack>
          </AlertDialogBody>

          <AlertDialogFooter justifyContent='space-between'>
            <Checkbox onChange={handleCheckboxChange} size='sm' color='text-contrast-md'>
              Não me mostrar isto novamente
            </Checkbox>
            <Button ref={cancelRef} size='sm' colorScheme='blue' onClick={onClose}>
              OK
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
