import { Box, Button, Container, Grid, GridItem, Heading, Text, useColorModeValue, VStack } from '@chakra-ui/react';
import React from 'react';
import { Link } from 'wasp/client/router';

interface SeoPageLayoutProps {
  title: string;
  metaDescription: string;
  keywords?: string[];
  breadcrumbs?: Array<{ label: string; href?: string }>;
  children: React.ReactNode;
  structuredData?: object;
  relatedLinks?: Array<{ title: string; href: string; description?: string }>;
}

export default function SeoPageLayout({
                                        title,
                                        metaDescription,
                                        keywords = [],
                                        breadcrumbs = [],
                                        children,
                                        structuredData,
                                        relatedLinks = []
                                      }: SeoPageLayoutProps) {

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Set document title and meta tags
  React.useEffect(() => {
    document.title = title;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', metaDescription);
    }
    else {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      metaDesc.setAttribute('content', metaDescription);
      document.head.appendChild(metaDesc);
    }

    // Update meta keywords
    if (keywords.length > 0) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', keywords.join(', '));
      }
      else {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        metaKeywords.setAttribute('content', keywords.join(', '));
        document.head.appendChild(metaKeywords);
      }
    }

    // Add structured data
    if (structuredData) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    }
  }, [title, metaDescription, keywords, structuredData]);

  return (
    <Box minH="100vh" bg={'transparent'}>
      {/* Navigation */}
      {/*  <Box bg={cardBg} borderBottom="1px" borderColor={borderColor} shadow="sm">
       <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }}>
       <Flex justify="space-between" align="center" h="16">
       <Link to="/">
       <Text fontSize="xl" fontWeight="bold" color="yellow.500">
       Carta de Apresentação.pt
       </Text>
       </Link>
       <HStack spacing={4}>
       <Link to="/login">
       <Button variant="ghost" size="sm" colorScheme="gray">
       Entrar
       </Button>
       </Link>
       <Link to="/">
       <Button colorScheme="yellow" size="sm">
       Criar Carta
       </Button>
       </Link>
       </HStack>
       </Flex>
       </Container>
       </Box>*/}

      {/* Breadcrumbs */}
      {/* {breadcrumbs.length > 0 && (
       <Box bg={cardBg} borderBottom="1px" borderColor={borderColor}>
       <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }} py={3}>
       <Breadcrumb separator={<ChevronRightIcon color="gray.500" />}>
       <BreadcrumbItem>
       <a href="/" style={{ color: '#3182ce', textDecoration: 'none' }}>
       Início
       </a>
       </BreadcrumbItem>
       {breadcrumbs.map((crumb, index) => (
       <BreadcrumbItem key={index} isCurrentPage={!crumb.href}>
       {crumb.href ? (
       <a href={crumb.href} style={{ color: '#3182ce', textDecoration: 'none' }}>
       {crumb.label}
       </a>
       ) : (
       <Text color="gray.900" fontWeight="medium">
       {crumb.label}
       </Text>
       )}
       </BreadcrumbItem>
       ))}
       </Breadcrumb>
       </Container>
       </Box>
       )}*/}

      {/* Main Content */}
      <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }} py={8}>
        <Grid templateColumns={{ base: '1fr', lg: '3fr 1fr' }} gap={8}>
          {/* Content */}
          <GridItem>
            <Box bg={'transparent'}  rounded="lg" shadow="sm" p={8}>
              {children}
            </Box>
          </GridItem>

          {/* Sidebar */}
          <GridItem>
            {/* Call to Action */}
            <Box bg="yellow.50" border="1px" borderColor="yellow.200" rounded="lg" p={6} mb={6}>
              <Heading size="md" color="gray.900" mb={3}>
                Crie a Sua Carta Agora
              </Heading>
              <Text color="gray.600" fontSize="sm" mb={4}>
                Use a nossa ferramenta AI para criar uma carta de apresentação personalizada em segundos.
              </Text>
              <Link to="/">
                <Button colorScheme="yellow" size="md" width="full">
                  Começar Agora
                </Button>
              </Link>
            </Box>

            {/* Related Links */}
            {relatedLinks.length > 0 && (
              <Box bg={cardBg} rounded="lg" shadow="sm" p={6}>
                <Heading size="md" color="gray.900" mb={4}>
                  Conteúdo Relacionado
                </Heading>
                <VStack spacing={3} align="stretch">
                  {relatedLinks.map((link, index) => (
                    <Box key={index}>
                      <a href={link.href} style={{ textDecoration: 'none' }}>
                        <Text color="blue.600" fontWeight="medium" _hover={{ color: 'blue.800' }}>
                          {link.title}
                        </Text>
                      </a>
                      {link.description && (
                        <Text color="gray.600" fontSize="sm" mt={1}>
                          {link.description}
                        </Text>
                      )}
                    </Box>
                  ))}
                </VStack>
              </Box>
            )}
          </GridItem>
        </Grid>
      </Container>

      {/* Footer */}
      {/* <Box bg={cardBg} borderTop="1px" borderColor={borderColor} mt={16}>
       <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }} py={12}>
       <Grid templateColumns={{ base: '1fr', md: '2fr 1fr 1fr' }} gap={8}>
       <GridItem>
       <Heading size="lg" color="gray.900" mb={4}>
       Carta de Apresentação.pt
       </Heading>
       <Text color="gray.300" mb={4}>
       A ferramenta mais avançada para criar cartas de apresentação profissionais em Portugal.
       Powered by AI, designed for success.
       </Text>
       </GridItem>
       <GridItem>
       <Heading size="md" color="gray.900" mb={4}>
       Recursos
       </Heading>
       <List>
       <ListItem>
       <a href="/guia/como-escrever" style={{ color: '#3182ce', textDecoration: 'none' }}>
       Como Escrever
       </a>
       </ListItem>
       <ListItem>
       <a href="/guia/exemplos" style={{ color: '#3182ce', textDecoration: 'none' }}>
       Exemplos
       </a>
       </ListItem>
       <ListItem>
       <a href="/guia/dicas" style={{ color: '#3182ce', textDecoration: 'none' }}>
       Dicas
       </a>
       </ListItem>
       </List>
       </GridItem>
       <GridItem>
       <Heading size="md" color="gray.900" mb={4}>
       Legal
       </Heading>
       <List>
       <ListItem>
       <a
       href="/privacy"
       style={{
       color: useColorModeValue('#718096', '#A0AEC0'),
       textDecoration: 'none'
       }}
       >
       Política de Privacidade
       </a>
       </ListItem>
       <ListItem>
       <a
       href="/tos"
       style={{
       color: useColorModeValue('#718096', '#A0AEC0'),
       textDecoration: 'none'
       }}
       >
       Termos de Serviço
       </a>
       </ListItem>
       </List>
       </GridItem>
       </Grid>
       <Box border="1px" borderColor={borderColor} mt={8} pt={8}>
       <Text textAlign="center" color="gray.600" fontSize="sm">
       &copy; 2024 Carta de Apresentação.pt. Todos os direitos reservados.
       </Text>
       </Box>
       </Container>
       </Box>*/}
    </Box>
  );
}
