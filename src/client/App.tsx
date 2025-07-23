import { Box, ChakraProvider, Spacer, VStack } from '@chakra-ui/react';
import { createContext, useEffect, useState } from 'react';
import ReactGA from 'react-ga4';
import { HelmetProvider } from 'react-helmet-async';
import { Outlet, useLocation } from 'react-router-dom';
import { env } from 'wasp/client'
import { useAuth } from 'wasp/client/auth';
import NavBar from './components/NavBar';
import { EditPopover } from './components/Popover';
import { theme } from './theme';

export const TextareaContext = createContext({
  textareaState: '',
  setTextareaState: (value: string) => {
  },
  isLnPayPending: false,
  setIsLnPayPending: (value: boolean) => {
  },
});

export default function App() {
  const [tooltip, setTooltip] = useState<{ x: string; y: string; text: string } | null>(null);
  const [currentText, setCurrentText] = useState<string | null>(null);
  const [textareaState, setTextareaState] = useState<string>('');
  const [isLnPayPending, setIsLnPayPending] = useState<boolean>(false);

  const location = useLocation();

  const { data: user } = useAuth();

  useEffect(() => {
    if (env.REACT_APP_ANALYTICS_ID) {
      ReactGA.initialize(env.REACT_APP_ANALYTICS_ID);
    }
  }, []);

  useEffect(() => {
    if (isLnPayPending) {
      return;
    }
    if (!location.pathname.includes('cover-letter')) {
      setTooltip(null);
    }

    function handleMouseUp(event: any) {
      const selection = window.getSelection();

      if (selection?.toString() && location.pathname.includes('cover-letter')) {
        // closes the tooltip when the user clicks a tooltip button
        if (selection.toString() === currentText) {
          setTooltip(null);
          return;
        }
        setCurrentText(selection.toString());
        // get the x and y coordinates of the mouse position
        const x = event.clientX;
        const y = event.clientY;

        const text = selection.toString();

        setTooltip({ x, y, text });
      }
      else {
        setTooltip(null);
      }
    }

    function handleMouseDown() {
      if (location.pathname.includes('cover-letter')) {
        setCurrentText(null);
      }
    }

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousedown', handleMouseDown);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [tooltip, location, isLnPayPending]);

  return (
    <HelmetProvider>
      <ChakraProvider theme={theme}>
        <TextareaContext.Provider
          value={{
            textareaState,
            setTextareaState,
            isLnPayPending,
            setIsLnPayPending,
          }}
        >
          <Box
            top={tooltip?.y}
            left={tooltip?.x}
            display={tooltip?.text ? 'block' : 'none'}
            position='absolute'
            zIndex={100}
          >
            {!!user && <EditPopover setTooltip={setTooltip} user={user}/>}
          </Box>
          <VStack gap={5} minHeight='100vh'>
            <NavBar/>
            <Outlet/>
            <Spacer/>
            {/*<Footer/>*/}
          </VStack>
        </TextareaContext.Provider>
      </ChakraProvider>
    </HelmetProvider>
  );
}
