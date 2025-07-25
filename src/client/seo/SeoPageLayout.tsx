import { Box, Button, Container, Grid, GridItem, Heading, Text, useColorModeValue, VStack } from '@chakra-ui/react';
import React from 'react';
import { Link } from 'wasp/client/router';
import SeoHead from '../components/SeoHead';

interface SeoPageLayoutProps {
  title: string;
  metaDescription: string;
  keywords?: string[];
  canonicalUrl?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  children: React.ReactNode;
  structuredData?: object;
  relatedLinks?: Array<{ title: string; href: string; description?: string }>;
}

export default function SeoPageLayout({
                                        title,
                                        metaDescription,
                                        keywords = [],
                                        canonicalUrl,
                                        breadcrumbs = [],
                                        children,
                                        structuredData,
                                        relatedLinks = []
                                      }: SeoPageLayoutProps) {

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box minH="100vh" bg={'transparent'}>
      <SeoHead
        title={title}
        description={metaDescription}
        keywords={keywords.join(', ')}
        canonicalUrl={canonicalUrl}
      />
      
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
            <Box bg="blue.50" border="1px" borderColor="blue.200" rounded="lg" p={6} mb={6}>
              <Heading size="md" color="gray.900" mb={3}>
                Crie a Sua Carta Agora
              </Heading>
              <Text color="gray.600" fontSize="sm" mb={4}>
                Use a nossa ferramenta AI para criar uma carta de apresentação personalizada em segundos.
              </Text>
              <Link to="/">
                <Button colorScheme="blue" size="md" width="full">
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
    </Box>
  );
}
