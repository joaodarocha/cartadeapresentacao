import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'wasp/client/operations';
import { getSeoPage, getIndustryData, getAllCities } from 'wasp/client/operations';
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
  Badge,
  Divider,
  useColorModeValue,
  Tag,
  TagLabel,
  Wrap,
  WrapItem
} from '@chakra-ui/react';
import { Link } from 'wasp/client/router';
import StructuredData, { 
  createWebPageData
} from '../components/StructuredData';

export default function ProfessionPage() {
  const { profession } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageData, setPageData] = useState<any>(null);
  const [industryData, setIndustryData] = useState<any>(null);
  const [relatedCities, setRelatedCities] = useState<any[]>([]);

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  // Generate slug from profession parameter
  const professionSlug = `carta-apresentacao-${profession}`;

  const { 
    data: seoPageData, 
    isLoading: seoPageLoading, 
    error: seoPageError 
  } = useQuery(getSeoPage, { slug: professionSlug });

  const { 
    data: industryInfo, 
    isLoading: industryLoading, 
    error: industryError 
  } = useQuery(getIndustryData, { slug: profession, id: undefined });

  const { 
    data: cities, 
    isLoading: citiesLoading 
  } = useQuery(getAllCities, {});

  useEffect(() => {
    if (seoPageData && industryInfo) {
      setPageData(seoPageData);
      setIndustryData(industryInfo);
      setLoading(false);
    }
    
    if (cities && cities.length > 0) {
      // Get top 8 cities for related links
      setRelatedCities(cities.slice(0, 8));
    }

    if (seoPageError || industryError) {
      setError('Página não encontrada');
      setLoading(false);
    }
  }, [seoPageData, industryInfo, cities, seoPageError, industryError]);

  if (loading || seoPageLoading || industryLoading) {
    return (
      <Box minH="100vh" bg={bgColor} display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Spinner size="lg" color="yellow.500" thickness="4px" />
          <Text color="gray.600">A carregar...</Text>
        </VStack>
      </Box>
    );
  }

  if (error || !pageData || !industryData) {
    return (
      <Box minH="100vh" bg={bgColor} display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={6} textAlign="center">
          <Heading size="lg" color="gray.900">Página não encontrada</Heading>
          <Text color="gray.600">A profissão que procura não existe ou foi removida.</Text>
          <Link to="/">
            <Button colorScheme="blue" size="lg">
              Voltar ao Início
            </Button>
          </Link>
        </VStack>
      </Box>
    );
  }

  const breadcrumbs = [
    { label: 'Profissões', href: '/profissoes' },
    { label: industryData.name }
  ];

  const relatedLinks = relatedCities.map(city => ({
    title: `${industryData.name} em ${city.name}`,
    href: `/cidade/${city.slug}/${profession}`,
    description: `Oportunidades de ${industryData.name} em ${city.name}`
  }));

  // Add general related links
  relatedLinks.push(
    {
      title: 'Como Escrever uma Carta de Apresentação',
      href: '/guia/como-escrever',
      description: 'Guia completo para escrever cartas eficazes'
    },
    {
      title: 'Exemplos de Cartas de Apresentação',
      href: '/guia/exemplos',
      description: 'Modelos e exemplos práticos'
    }
  );

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": pageData.title,
    "description": pageData.metaDescription,
    "url": `https://cartadeapresentacao.pt/profissao/${profession}`,
    "about": {
      "@type": "Occupation",
      "name": industryData.name,
      "description": industryData.description,
      "skills": industryData.skills,
      "estimatedSalary": {
        "@type": "MonetaryAmountDistribution",
        "name": "Salário estimado",
        "currency": "EUR",
        "median": industryData.averageSalary
      }
    }
  };

  // Parse skills if they're stored as a string
  const skills = typeof industryData.skills === 'string' 
    ? industryData.skills.split(',').map((s: string) => s.trim())
    : industryData.skills || [];

  // Create structured data
  const webPageData = createWebPageData(
    pageData.title,
    pageData.metaDescription,
    `https://cartadeapresentacao.pt/profissao/${profession}`
  );

  return (
    <SeoPageLayout
      title={pageData.title}
      metaDescription={pageData.metaDescription}
      keywords={pageData.keywords && typeof pageData.keywords === 'string' ? pageData.keywords.split(',').map((k: string) => k.trim()) : Array.isArray(pageData.keywords) ? pageData.keywords : []}
      breadcrumbs={breadcrumbs}
      structuredData={structuredData}
      relatedLinks={relatedLinks}
    >
      <StructuredData data={webPageData} />
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

        {/* Profession Overview */}
        <Box>
          <HStack spacing={4} mb={4} align="center">
            <Box fontSize="4xl">💼</Box>
            <Heading size="lg" color="gray.900">
              Sobre a Profissão de {industryData.name}
            </Heading>
          </HStack>
          
          <Text color="gray.700" mb={6} lineHeight="tall">
            {industryData.description || `${industryData.name} é uma área profissional com excelentes oportunidades de carreira em Portugal.`}
          </Text>

          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
            <GridItem>
              <VStack align="stretch" spacing={4}>
                <Box>
                  <Text fontWeight="bold" color="gray.900" mb={2}>Salário Médio:</Text>
                  <Badge colorScheme="green" fontSize="md" p={2}>
                    €{industryData.averageSalary?.toLocaleString() || 'N/A'} / ano
                  </Badge>
                </Box>
                <Box>
                  <Text fontWeight="bold" color="gray.900" mb={2}>Sector:</Text>
                  <Text color="gray.700">{industryData.sector || industryData.name}</Text>
                </Box>
              </VStack>
            </GridItem>
            <GridItem>
              <Text color="gray.700" lineHeight="tall">
                Procura trabalho como {industryData.name}? Descubra como criar uma carta de apresentação que destaque as suas competências e experiência nesta área.
              </Text>
            </GridItem>
          </Grid>
        </Box>

        <Divider />

        {/* Skills Section */}
        {skills.length > 0 && (
          <Box>
            <Heading size="lg" color="gray.900" mb={4}>
              Competências Essenciais
            </Heading>
            <Text color="gray.700" mb={4} lineHeight="tall">
              Para ter sucesso como {industryData.name}, é importante dominar estas competências-chave:
            </Text>
            <Wrap spacing={2}>
              {skills.map((skill: string, index: number) => (
                <WrapItem key={index}>
                  <Tag size="lg" colorScheme="blue" variant="subtle">
                    <TagLabel>{skill}</TagLabel>
                  </Tag>
                </WrapItem>
              ))}
            </Wrap>
          </Box>
        )}

        <Divider />

        {/* Job Opportunities */}
        <Box>
          <Heading size="lg" color="gray.900" mb={4}>
            Oportunidades de {industryData.name}
          </Heading>
          
          <Text color="gray.700" mb={6} lineHeight="tall">
            O mercado de trabalho para {industryData.name} em Portugal oferece diversas oportunidades em diferentes cidades e sectores.
          </Text>

          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
            {relatedCities.slice(0, 8).map((city, index) => (
              <GridItem key={index}>
                <Box bg={cardBg} p={4} rounded="lg" border="1px" borderColor="gray.200">
                  <a href={`/cidade/${city.slug}${profession ? `/${profession}` : ''}`} style={{ textDecoration: 'none' }}>
                    <Text fontWeight="semibold" color="blue.600" _hover={{ color: 'blue.800' }} mb={2}>
                      {industryData.name} em {city.name}
                    </Text>
                  </a>
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
                Qual é o salário médio de {industryData.name}?
              </Heading>
              <Text color="gray.700" lineHeight="tall">
                O salário médio para {industryData.name} em Portugal é de aproximadamente €{industryData.averageSalary?.toLocaleString() || 'N/A'} por ano, podendo variar conforme a experiência, localização e empresa.
              </Text>
            </Box>

            <Box>
              <Heading size="md" color="gray.900" mb={3}>
                Que competências são mais valorizadas para {industryData.name}?
              </Heading>
              <Text color="gray.700" lineHeight="tall">
                As competências mais procuradas incluem {skills.slice(0, 3).join(', ')}, entre outras competências técnicas e soft skills relevantes para a área.
              </Text>
            </Box>

            <Box>
              <Heading size="md" color="gray.900" mb={3}>
                Como destacar-me numa carta de apresentação para {industryData.name}?
              </Heading>
              <Text color="gray.700" lineHeight="tall">
                Destaque a sua experiência relevante, mencione projetos específicos, demonstre conhecimento do sector e personalize a carta para cada empresa e posição.
              </Text>
            </Box>

            <Box>
              <Heading size="md" color="gray.900" mb={3}>
                Quais são as perspetivas de carreira para {industryData.name}?
              </Heading>
              <Text color="gray.700" lineHeight="tall">
                A área de {industryData.name} oferece boas perspetivas de crescimento, com oportunidades de especialização e progressão para cargos de maior responsabilidade.
              </Text>
            </Box>
          </VStack>
        </Box>

        <Divider />

        {/* Call to Action */}
        <Box bg="blue.50" p={6} rounded="lg" border="1px" borderColor="blue.200" textAlign="center">
          <Heading size="lg" color="gray.900" mb={4}>
            Destaque-se como {industryData.name}
          </Heading>
          <Text color="gray.700" mb={6}>
            Crie uma carta de apresentação personalizada que realce as suas competências e experiência em {industryData.name}.
          </Text>
          <VStack spacing={4}>
            <a href="/" style={{ textDecoration: 'none' }}>
              <Button colorScheme="blue" size="lg">
                Criar Carta Agora
              </Button>
            </a>
            <a href="/" style={{ textDecoration: 'none' }}>
              <Button variant="outline" colorScheme="blue" size="md">
                Começar Agora
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
              { title: 'Como Escrever uma Carta de Apresentação', href: '/guia/como-escrever' },
              { title: 'Exemplos de Cartas de Apresentação', href: '/guia/exemplos' },
              { title: 'Dicas para Procurar Emprego', href: '/guia/dicas' },
              { title: 'Preparação para Entrevistas', href: '/guia/entrevistas' },
              { title: 'Competências Profissionais', href: '/guia/competencias' },
              { title: 'Mercado de Trabalho em Portugal', href: '/guia/mercado-trabalho' }
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
            Recursos Adicionais
          </Heading>
          
          <List spacing={3}>
            <ListItem>
              <a href="/guia/como-escrever" style={{ textDecoration: 'none' }}>
                <Text color="blue.600" _hover={{ color: 'blue.800' }}>
                  Guia Completo: Como Escrever uma Carta de Apresentação
                </Text>
              </a>
            </ListItem>
            <ListItem>
              <a href="/guia/exemplos" style={{ textDecoration: 'none' }}>
                <Text color="blue.600" _hover={{ color: 'blue.800' }}>
                  Modelos e Exemplos de Cartas de Apresentação
                </Text>
              </a>
            </ListItem>
            <ListItem>
              <a href="/guia/dicas" style={{ textDecoration: 'none' }}>
                <Text color="blue.600" _hover={{ color: 'blue.800' }}>
                  10 Dicas Essenciais para Procurar Emprego
                </Text>
              </a>
            </ListItem>
            <ListItem>
              <a href="/guia/entrevistas" style={{ textDecoration: 'none' }}>
                <Text color="blue.600" _hover={{ color: 'blue.800' }}>
                  Como se Preparar para Entrevistas de Emprego
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
          <a href="/" style={{ textDecoration: 'none' }}>
            <Button colorScheme="blue" size="md">
              Crie a sua carta personalizada em segundos
            </Button>
          </a>
        </Box>
      </VStack>
    </SeoPageLayout>
  );
}
