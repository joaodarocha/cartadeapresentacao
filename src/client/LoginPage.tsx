import { useAuth, googleSignInUrl as signInUrl } from 'wasp/client/auth';
import { getLnLoginUrl, useQuery, getLnUserInfo } from 'wasp/client/operations';
import { AiOutlineGoogle } from 'react-icons/ai';
import { BsCurrencyBitcoin } from 'react-icons/bs';
import { VStack, Button, Spinner, Text, useDisclosure } from '@chakra-ui/react';
import BorderBox from './components/BorderBox';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LnLoginModal from './components/LnLoginModal';

export default function Login() {
  const [encodedUrl, setEncodedUrl] = useState<string | null>(null);
  const [k1Hash, setK1Hash] = useState<string>('');
  const [lnIsLoading, setLnIsLoading] = useState<boolean>(false);
  const [lnLoginStatus, setLnLoginStatus] = useState<string>('');
  const { data: lnUserInfo, refetch: fetchLnUser } = useQuery(getLnUserInfo, k1Hash, { enabled: !!k1Hash });
  const { data: user, isLoading } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user]);

  useEffect(() => {
    try {
      const getEncodedUrl = async () => {
        const response = await getLnLoginUrl();
        return response;
      };
      getEncodedUrl().then((resp) => {
        setK1Hash(resp.k1Hash);
        setEncodedUrl(resp.encoded);
      });
    } catch (error) {
      console.error('error fetching LN url: ', error);
      setEncodedUrl('error');
    }
  }, []);

  useEffect(() => {
    if (lnUserInfo?.token) {
      setLnLoginStatus('success');
      // this is how wasp stores the token for use with their auth api
      localStorage.setItem('wasp:sessionId', JSON.stringify(lnUserInfo.token));
      window.location.reload();
    }
  }, [lnUserInfo]);

  return (
    <>
      <BorderBox>
        {isLoading || !encodedUrl ? (
          <Spinner />
        ) : (
          <VStack>
            <a href={signInUrl}>
              <Button leftIcon={<AiOutlineGoogle />}>Iniciar Sessão com Google</Button>
            </a>
          </VStack>
        )}
      </BorderBox>
    </>
  );
}
