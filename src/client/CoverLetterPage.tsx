import { type CoverLetter } from "wasp/entities";
import { editCoverLetter, useQuery, getCoverLetter } from "wasp/client/operations";
import { Tooltip, Button, Textarea, useClipboard, Spinner, HStack } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import BorderBox from './components/BorderBox';
import { useContext } from 'react';
import { TextareaContext } from './App';
import { EditAlert } from './components/AlertDialog';
import { useEffect, useState } from 'react';

export default function CoverLetterPage() {
  const { textareaState, setTextareaState } = useContext(TextareaContext);
  const [editIsLoading, setEditIsLoading] = useState<boolean>(false);
  const [isEdited, setIsEdited] = useState<boolean>(false);

  const { id } = useParams();
  if (!id) {
    return <BorderBox>Erro: É necessário o ID da carta de apresentação</BorderBox>;
  }

  const {
    data: coverLetter,
    isLoading,
    refetch,
  } = useQuery<{ id: string }, CoverLetter>(getCoverLetter, { id }, { enabled: false });

  const { hasCopied, onCopy } = useClipboard(coverLetter?.content || '');

  // restrains fetching to mount only to avoid re-render issues
  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (coverLetter) {
      setTextareaState(coverLetter.content);
    }
  }, [coverLetter]);

  const handleClick = async () => {
    try {
      setEditIsLoading(true);
      if (!id) {
        throw new Error('ID da carta de apresentação é necessário');
      }

      const editedCoverLetter = await editCoverLetter({ coverLetterId: id, content: textareaState });

      if (!!editedCoverLetter) {
        setIsEdited(true);
        setTimeout(() => {
          setIsEdited(false);
        }, 2500);
      }
    } catch (error) {
      console.error(error);
      alert('Ocorreu um erro. Por favor, tente novamente.');
    }
    setEditIsLoading(false);
  };

  return (
    <>
      <BorderBox>
        {isLoading && <Spinner />}

        <Textarea
          onChange={(e) => {
            setTextareaState(e.target.value);
          }}
          value={textareaState}
          id='cover-letter-textarea'
          height={['sm', 'lg', 'xl']}
          top='50%'
          left='50%'
          transform={'translate(-50%, 0%)'}
          dropShadow='lg'
          overflow='none'
          visibility={isLoading ? 'hidden' : 'visible'}
        />

        {coverLetter && (
          <HStack>
            <Tooltip
              label={isEdited && 'Alterações Guardadas!'}
              placement='top'
              hasArrow
              isOpen={isEdited}
              closeDelay={2500}
              closeOnClick={true}
            >
              <Button size='sm' mr={3} onClick={handleClick} isDisabled={false} isLoading={editIsLoading}>
                Guardar Alterações
              </Button>
            </Tooltip>
            <Tooltip
              label={hasCopied ? 'Copiado!' : 'Copiar Carta para a Área de Transferência'}
              placement='top'
              hasArrow
              closeOnClick={false}
            >
              <Button colorScheme='blue' size='sm' mr={3} onClick={onCopy}>
                Copiar
              </Button>
            </Tooltip>
          </HStack>
        )}
      </BorderBox>
      <EditAlert coverLetter={!!coverLetter} />
    </>
  );
}
