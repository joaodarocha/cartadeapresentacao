import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'wasp/client/operations';
import { getSeoPage, getCityData, getAllIndustries } from 'wasp/client/operations';
import SeoPageLayout from './SeoPageLayout';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Grid,
  GridItem,
  List,
  ListItem,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  Badge,
  Divider,
  useColorModeValue
} from '@chakra-ui/react';

export default function CityPage() {
  const { city } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageData, setPageData] = useState<any>(null);
  const [cityData, setCityData] = useState<any>(null);
  const [relatedIndustries, setRelatedIndustries] = useState<any[]>([]);

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  // Generate slug from city parameter
  const citySlug = `carta-apresentacao-${city}`;

  const { 
    data: seoPageData, 
    isLoading: seoPageLoading, 
    error: seoPageError 
  } = useQuery(getSeoPage, { slug: citySlug });

  const { 
    data: cityInfo, 
    isLoading: cityLoading, 
    error: cityError 
  } = useQuery(getCityData, { slug: city, id: undefined });

  const { 
    data: industries, 
    isLoading: industriesLoading 
  } = useQuery(getAllIndustries, {});

  useEffect(() => {
    if (seoPageData && cityInfo) {
      setPageData(seoPageData);
      setCityData(cityInfo);
      setLoading(false);
    }
    
    if (industries && industries.length > 0) {
      // Get top 6 industries for related links
      setRelatedIndustries(industries.slice(0, 6));
    }

    if (seoPageError || cityError) {
      setError('Página não encontrada');
      setLoading(false);
    }
  }, [seoPageData, cityInfo, industries, seoPageError, cityError]);

  if (loading || seoPageLoading || cityLoading) {
    return (
      <Box minH="100vh" bg={bgColor} display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Spinner size="lg" color="yellow.500" thickness="4px" />
          <Text color="gray.600">A carregar...</Text>
        </VStack>
      </Box>
    );
  }

  if (error || !pageData || !cityData) {
    return (
      <Box minH="100vh" bg={bgColor} display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={6} textAlign="center">
          <Heading size="lg" color="gray.900">Página não encontrada</Heading>
          <Text color="gray.600">A cidade que procura não existe ou foi removida.</Text>
          <a href="/">
            <Button colorScheme="yellow" size="lg">
              Voltar ao Início
            </Button>
          </a>
        </VStack>
      </Box>
    );
  }

  const breadcrumbs = [
    { label: 'Cidades', href: '/cidades' },
    { label: cityData.name }
  ];

  const relatedLinks = relatedIndustries.map(industry => ({
    title: `${industry.name} em ${cityData.name}`,
    href: `/cidade/${city}/${industry.slug}`,
    description: `Oportunidades de ${industry.name} em ${cityData.name}`
  }));

  // Add general related links
  relatedLinks.push(
    {
      title: 'Dicas para Procurar Emprego',
      href: '/guia/procurar-emprego',
      description: 'Estratégias eficazes de procura de emprego'
    },
    {
      title: 'Preparação para Entrevistas',
      href: '/guia/entrevistas',
      description: 'Como se preparar para entrevistas de emprego'
    }
  );

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": pageData.title,
    "description": pageData.metaDescription,
    "url": `https://cartadeapresentacao.pt/cidade/${city}`,
    "about": {
      "@type": "Place",
      "name": cityData.name,
      "addressLocality": cityData.name,
      "addressCountry": "PT"
    }
  };

  return (
    <SeoPageLayout
      title={pageData.title}
      metaDescription={pageData.metaDescription}
      keywords={pageData.keywords && typeof pageData.keywords === 'string' ? pageData.keywords.split(',').map((k: string) => k.trim()) : Array.isArray(pageData.keywords) ? pageData.keywords : []}
      breadcrumbs={breadcrumbs}
      structuredData={structuredData}
      relatedLinks={relatedLinks}
    >
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box textAlign="center">
          <Heading size="xl" color="gray.900" mb={4}>
            {pageData.title}
          </Heading>
          <Text fontSize="lg" color="gray.600">
            {pageData.metaDescription}
          </Text>
        </Box>

        {/* City Information */}
        <Box>
          <HStack spacing={4} mb={4} align="center">
            <Box fontSize="4xl">📍</Box>
            <Heading size="lg" color="gray.900">
              Informação sobre {cityData.name}
            </Heading>
          </HStack>
          
          <Text color="gray.700" mb={6} lineHeight="tall">
            {cityData.description || `${cityData.name} é uma cidade importante em Portugal com excelentes oportunidades de emprego.`}
          </Text>

          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
            <GridItem>
              <VStack align="stretch" spacing={3}>
                <HStack>
                  <Text fontWeight="bold" color="gray.900">População:</Text>
                  <Text color="gray.700">{cityData.population?.toLocaleString() || 'N/A'} habitantes</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold" color="gray.900">Distrito:</Text>
                  <Text color="gray.700">{cityData.district || cityData.name}</Text>
                </HStack>
              </VStack>
            </GridItem>
            <GridItem>
              <Text color="gray.700" lineHeight="tall">
                Procura emprego em {cityData.name}? Descubra como criar cartas de apresentação que se destacam no mercado de trabalho local.
              </Text>
            </GridItem>
          </Grid>
        </Box>

        <Divider />

        {/* Job Market in City */}
        <Box>
          <Heading size="lg" color="gray.900" mb={4}>
            Oportunidades de Trabalho em {cityData.name}
          </Heading>
          
          <Text color="gray.700" mb={6} lineHeight="tall">
            {cityData.name} oferece um mercado de trabalho dinâmico com oportunidades em diversos sectores. A cidade destaca-se pela sua economia diversificada e qualidade de vida.
          </Text>

          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
            {relatedIndustries.slice(0, 6).map((industry, index) => (
              <GridItem key={index}>
                <Box bg={cardBg} p={4} rounded="lg" border="1px" borderColor="gray.200">
                  <a href={`/cidade/${city}/${industry.slug}`} style={{ textDecoration: 'none' }}>
                    <Text fontWeight="semibold" color="blue.600" _hover={{ color: 'blue.800' }} mb={2}>
                      {industry.name} em {cityData.name}
                    </Text>
                  </a>
                  <Text fontSize="sm" color="gray.600">
                    Oportunidades de {industry.name} em {cityData.name}
                  </Text>
                </Box>
              </GridItem>
            ))}
          </Grid>
        </Box>

        <Divider />

        {/* FAQ Section */}
        <Box>
          <Heading size="lg" color="gray.900" mb={6}>
            Perguntas Frequentes
          </Heading>
          
          <VStack spacing={6} align="stretch">
            <Box>
              <Heading size="md" color="gray.900" mb={3}>
                Como é o mercado de trabalho em {cityData.name}?
              </Heading>
              <Text color="gray.700" lineHeight="tall">
                {cityData.name} oferece um mercado de trabalho dinâmico com oportunidades em diversos sectores. A cidade destaca-se pela sua economia diversificada e qualidade de vida.
              </Text>
            </Box>

            <Box>
              <Heading size="md" color="gray.900" mb={3}>
                Quais são os melhores sites para procurar emprego em {cityData.name}?
              </Heading>
              <Text color="gray.700" lineHeight="tall">
                Os principais sites incluem Net-Empregos, Sapo Emprego, LinkedIn, Indeed Portugal, e sites específicos das empresas locais. Muitas empresas também publicam vagas nas redes sociais.
              </Text>
            </Box>

            <Box>
              <Heading size="md" color="gray.900" mb={3}>
                Como adaptar a carta de apresentação para empresas em {cityData.name}?
              </Heading>
              <Text color="gray.700" lineHeight="tall">
                Mencione o seu conhecimento sobre a cidade, destaque a sua disponibilidade para trabalhar localmente, e demonstre interesse na comunidade empresarial de {cityData.name}.
              </Text>
            </Box>

            <Box>
              <Heading size="md" color="gray.900" mb={3}>
                Qual é o custo de vida em {cityData.name}?
              </Heading>
              <Text color="gray.700" lineHeight="tall">
                O custo de vida em {cityData.name} varia conforme a zona, mas geralmente oferece um bom equilíbrio entre oportunidades profissionais e qualidade de vida comparado com outras cidades europeias.
              </Text>
            </Box>
          </VStack>
        </Box>

        <Divider />

        {/* Call to Action */}
        <Box bg="yellow.50" p={6} rounded="lg" border="1px" borderColor="yellow.200" textAlign="center">
          <Heading size="lg" color="gray.900" mb={4}>
            Encontre o Seu Emprego em {cityData.name}
          </Heading>
          <Text color="gray.700" mb={6}>
            Crie uma carta de apresentação personalizada que destaque a sua motivação para trabalhar em {cityData.name}.
          </Text>
          <VStack spacing={4}>
            <a href="/">
              <Button colorScheme="yellow" size="lg">
                Criar Carta Agora
              </Button>
            </a>
            <a href="/">
              <Button variant="outline" colorScheme="yellow" size="md">
                Crie a Sua Carta Agora
              </Button>
            </a>
          </VStack>
        </Box>

        {/* Related Content */}
        <Box>
          <Heading size="lg" color="gray.900" mb={6}>
            Conteúdo Relacionado
          </Heading>
          
          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
            {[
              { title: 'Administrador de Sistemas em Lisboa', href: '/cidade/lisboa/administrador-sistemas' },
              { title: 'Oportunidades de Administrador de Sistemas em Lisboa', href: '/profissao/administrador-sistemas/lisboa' },
              { title: 'Advogado em Lisboa', href: '/cidade/lisboa/advogado' },
              { title: 'Oportunidades de Advogado em Lisboa', href: '/profissao/advogado/lisboa' },
              { title: 'Analista de Sistemas em Lisboa', href: '/cidade/lisboa/analista-sistemas' },
              { title: 'Oportunidades de Analista de Sistemas em Lisboa', href: '/profissao/analista-sistemas/lisboa' },
              { title: 'Analista Financeiro em Lisboa', href: '/cidade/lisboa/analista-financeiro' },
              { title: 'Oportunidades de Analista Financeiro em Lisboa', href: '/profissao/analista-financeiro/lisboa' },
              { title: 'Assistente Administrativo em Lisboa', href: '/cidade/lisboa/assistente-administrativo' },
              { title: 'Oportunidades de Assistente Administrativo em Lisboa', href: '/profissao/assistente-administrativo/lisboa' },
              { title: 'Atendimento ao Cliente em Lisboa', href: '/cidade/lisboa/atendimento-cliente' },
              { title: 'Oportunidades de Atendimento ao Cliente em Lisboa', href: '/profissao/atendimento-cliente/lisboa' }
            ].map((item, index) => (
              <GridItem key={index}>
                <Box bg={cardBg} p={4} rounded="lg" border="1px" borderColor="gray.200" h="full">
                  <a href={item.href} style={{ textDecoration: 'none' }}>
                    <Text fontWeight="semibold" color="blue.600" _hover={{ color: 'blue.800' }}>
                      {item.title}
                    </Text>
                  </a>
                </Box>
              </GridItem>
            ))}
          </Grid>
        </Box>

        {/* Additional Resources */}
        <Box>
          <Heading size="lg" color="gray.900" mb={6}>
            Recursos
          </Heading>
          
          <List spacing={3}>
            <ListItem>
              <a href="/guia/como-escrever" style={{ textDecoration: 'none' }}>
                <Text color="blue.600" _hover={{ color: 'blue.800' }}>
                  Como Escrever uma Carta de Apresentação
                </Text>
              </a>
            </ListItem>
            <ListItem>
              <a href="/guia/exemplos" style={{ textDecoration: 'none' }}>
                <Text color="blue.600" _hover={{ color: 'blue.800' }}>
                  Exemplos de Cartas de Apresentação
                </Text>
              </a>
            </ListItem>
            <ListItem>
              <a href="/guia/dicas" style={{ textDecoration: 'none' }}>
                <Text color="blue.600" _hover={{ color: 'blue.800' }}>
                  Dicas para Procurar Emprego
                </Text>
              </a>
            </ListItem>
          </List>
        </Box>

        {/* Footer CTA */}
        <Box bg="gray.50" p={6} rounded="lg" textAlign="center">
          <Text fontSize="lg" color="gray.900" mb={4}>
            Carta de Apresentação.pt
          </Text>
          <Text color="gray.600" mb={4}>
            A ferramenta mais avançada para criar cartas de apresentação profissionais em Portugal. Powered by AI, designed for success.
          </Text>
          <a href="/">
            <Button colorScheme="yellow" size="md">
              Use a nossa ferramenta AI para criar uma carta de apresentação personalizada em segundos.
            </Button>
          </a>
        </Box>
      </VStack>
    </SeoPageLayout>
  );
}
