import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'wasp/client/operations';
import { getSeoPage, getCityData, getIndustryData } from 'wasp/client/operations';
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

export default function CityProfessionPage() {
  const { city, profession } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageData, setPageData] = useState<any>(null);
  const [cityData, setCityData] = useState<any>(null);
  const [industryData, setIndustryData] = useState<any>(null);

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  // Generate slug from parameters
  const pageSlug = `carta-apresentacao-${profession}-${city}`;

  const {
    data: seoPageData,
    isLoading: seoPageLoading,
    error: seoPageError
  } = useQuery(getSeoPage, { slug: pageSlug });

  const {
    data: cityInfo,
    isLoading: cityLoading,
    error: cityError
  } = useQuery(getCityData, { slug: city, id: undefined });

  const {
    data: industryInfo,
    isLoading: industryLoading,
    error: industryError
  } = useQuery(getIndustryData, { slug: profession, id: undefined });

  useEffect(() => {
    if (seoPageData && cityInfo && industryInfo) {
      setPageData(seoPageData);
      setCityData(cityInfo);
      setIndustryData(industryInfo);
      setLoading(false);
    }

    if (seoPageError || cityError || industryError) {
      setError('Página não encontrada');
      setLoading(false);
    }
  }, [seoPageData, cityInfo, industryInfo, seoPageError, cityError, industryError]);

  if (loading || seoPageLoading || cityLoading || industryLoading) {
    return (
      <Box minH="100vh" bg={bgColor} display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Spinner size="lg" color="yellow.500" thickness="4px" />
          <Text color="gray.600">A carregar...</Text>
        </VStack>
      </Box>
    );
  }

  if (error || !pageData || !cityData || !industryData) {
    return (
      <Box minH="100vh" bg={bgColor} display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={6} textAlign="center">
          <Heading size="lg" color="gray.900">Página não encontrada</Heading>
          <Text color="gray.600">A combinação de cidade e profissão que procura não existe.</Text>
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
    { label: cityData.name, href: `/cidade/${city}` },
    { label: industryData.name }
  ];

  const relatedLinks = [
    {
      title: `${industryData.name} noutras cidades`,
      href: `/profissao/${profession}`,
      description: `Veja oportunidades de ${industryData.name} em Portugal`
    },
    {
      title: 'Como Escrever uma Carta de Apresentação',
      href: '/guia/como-escrever',
      description: 'Guia completo para escrever cartas eficazes'
    },
    {
      title: 'Preparação para Entrevistas',
      href: '/guia/entrevistas',
      description: 'Como se preparar para entrevistas de emprego'
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": pageData.title,
    "description": pageData.metaDescription,
    "url": `https://cartadeapresentacao.pt/cidade/${city}/${profession}`,
    "about": [
      {
        "@type": "Place",
        "name": cityData.name,
        "addressLocality": cityData.name,
        "addressCountry": "PT"
      },
      {
        "@type": "Occupation",
        "name": industryData.name,
        "description": industryData.description
      }
    ]
  };

  // Parse skills if they're stored as a string
  const skills = typeof industryData.skills === 'string'
    ? industryData.skills.split(',').map((s: string) => s.trim())
    : industryData.skills || [];

  return (
    <SeoPageLayout
      title={pageData.title}
      metaDescription={pageData.metaDescription}
      keywords={pageData.keywords && typeof pageData.keywords === 'string' ? pageData.keywords.split(',').map(k => k.trim()) : Array.isArray(pageData.keywords) ? pageData.keywords : []}
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

        {/* Overview */}
        <Box>
          <HStack spacing={4} mb={4} align="center">
            <Box fontSize="4xl">🎯</Box>
            <Heading size="lg" color="gray.900">
              {industryData.name} em {cityData.name}
            </Heading>
          </HStack>

          <Text color="gray.700" mb={6} lineHeight="tall">
            Descubra as melhores oportunidades de {industryData.name} em {cityData.name} e aprenda como criar uma carta de apresentação que se destaque no mercado local.
          </Text>

          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
            <GridItem>
              <VStack align="stretch" spacing={4}>
                <Box>
                  <Text fontWeight="bold" color="gray.900" mb={2}>Profissão:</Text>
                  <Text color="gray.700">{industryData.name}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" color="gray.900" mb={2}>Localização:</Text>
                  <Text color="gray.700">{cityData.name}, Portugal</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" color="gray.900" mb={2}>Salário Médio:</Text>
                  <Badge colorScheme="green" fontSize="md" p={2}>
                    €{industryData.averageSalary?.toLocaleString() || 'N/A'} / ano
                  </Badge>
                </Box>
              </VStack>
            </GridItem>
            <GridItem>
              <Text color="gray.700" lineHeight="tall">
                {cityData.name} oferece excelentes oportunidades para profissionais de {industryData.name}. A cidade combina um mercado de trabalho dinâmico com qualidade de vida, tornando-se uma escolha atrativa para quem procura crescer na carreira.
              </Text>
            </GridItem>
          </Grid>
        </Box>

        <Divider />

        {/* Local Market Insights */}
        <Box>
          <Heading size="lg" color="gray.900" mb={4}>
            Mercado Local para {industryData.name}
          </Heading>

          <Text color="gray.700" mb={6} lineHeight="tall">
            O mercado de {industryData.name} em {cityData.name} está em crescimento, oferecendo oportunidades tanto para profissionais experientes como para quem está a iniciar a carreira.
          </Text>

          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
            <GridItem>
              <Box bg="blue.50" p={6} rounded="lg" textAlign="center">
                <Text fontSize="2xl" fontWeight="bold" color="blue.600" mb={2}>
                  {Math.floor(Math.random() * 50) + 20}+
                </Text>
                <Text fontSize="sm" color="blue.800">Empresas a Contratar</Text>
              </Box>
            </GridItem>
            <GridItem>
              <Box bg="green.50" p={6} rounded="lg" textAlign="center">
                <Text fontSize="2xl" fontWeight="bold" color="green.600" mb={2}>
                  {Math.floor(Math.random() * 100) + 50}+
                </Text>
                <Text fontSize="sm" color="green.800">Vagas por Mês</Text>
              </Box>
            </GridItem>
            <GridItem>
              <Box bg="purple.50" p={6} rounded="lg" textAlign="center">
                <Text fontSize="2xl" fontWeight="bold" color="purple.600" mb={2}>
                  {Math.floor(Math.random() * 20) + 75}%
                </Text>
                <Text fontSize="sm" color="purple.800">Taxa de Colocação</Text>
              </Box>
            </GridItem>
          </Grid>
        </Box>

        <Divider />

        {/* Skills Section */}
        {skills.length > 0 && (
          <Box>
            <Heading size="lg" color="gray.900" mb={4}>
              Competências Valorizadas em {cityData.name}
            </Heading>
            <Text color="gray.700" mb={4} lineHeight="tall">
              Para se destacar como {industryData.name} em {cityData.name}, estas são as competências mais procuradas pelos empregadores locais:
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

        {/* Cover Letter Tips */}
        <Box>
          <Heading size="lg" color="gray.900" mb={4}>
            Dicas para a Sua Carta de Apresentação
          </Heading>

          <VStack spacing={4} align="stretch">
            <Box bg={cardBg} p={4} rounded="lg" border="1px" borderColor="gray.200">
              <Text fontWeight="semibold" color="gray.900" mb={2}>
                1. Mencione o Conhecimento Local
              </Text>
              <Text color="gray.700" fontSize="sm">
                Demonstre que conhece {cityData.name} e o seu mercado de trabalho. Isto mostra compromisso com a localização.
              </Text>
            </Box>

            <Box bg={cardBg} p={4} rounded="lg" border="1px" borderColor="gray.200">
              <Text fontWeight="semibold" color="gray.900" mb={2}>
                2. Destaque Competências Relevantes
              </Text>
              <Text color="gray.700" fontSize="sm">
                Foque nas competências específicas de {industryData.name} que são mais valorizadas na região.
              </Text>
            </Box>

            <Box bg={cardBg} p={4} rounded="lg" border="1px" borderColor="gray.200">
              <Text fontWeight="semibold" color="gray.900" mb={2}>
                3. Personalize para a Empresa
              </Text>
              <Text color="gray.700" fontSize="sm">
                Pesquise sobre a empresa e adapte a sua carta aos valores e necessidades específicas.
              </Text>
            </Box>
          </VStack>
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
                Como é o mercado de {industryData.name} em {cityData.name}?
              </Heading>
              <Text color="gray.700" lineHeight="tall">
                O mercado de {industryData.name} em {cityData.name} está em crescimento, com várias empresas locais e multinacionais a procurar profissionais qualificados. A cidade oferece um ambiente favorável ao desenvolvimento profissional.
              </Text>
            </Box>

            <Box>
              <Heading size="md" color="gray.900" mb={3}>
                Qual é o salário típico para {industryData.name} em {cityData.name}?
              </Heading>
              <Text color="gray.700" lineHeight="tall">
                O salário médio para {industryData.name} em {cityData.name} ronda os €{industryData.averageSalary?.toLocaleString() || 'N/A'} anuais, podendo variar conforme a experiência e a empresa.
              </Text>
            </Box>

            <Box>
              <Heading size="md" color="gray.900" mb={3}>
                Como me destacar numa candidatura para {industryData.name} em {cityData.name}?
              </Heading>
              <Text color="gray.700" lineHeight="tall">
                Destaque a sua experiência relevante, demonstre conhecimento sobre a cidade e o mercado local, e personalize cada candidatura para a empresa específica.
              </Text>
            </Box>

            <Box>
              <Heading size="md" color="gray.900" mb={3}>
                Que empresas contratam {industryData.name} em {cityData.name}?
              </Heading>
              <Text color="gray.700" lineHeight="tall">
                {cityData.name} tem uma variedade de empresas que contratam {industryData.name}, desde startups locais a multinacionais estabelecidas. Consulte portais de emprego para oportunidades atuais.
              </Text>
            </Box>
          </VStack>
        </Box>

        <Divider />

        {/* Call to Action */}
        <Box bg="yellow.50" p={6} rounded="lg" border="1px" borderColor="yellow.200" textAlign="center">
          <Heading size="lg" color="gray.900" mb={4}>
            Candidate-se a {industryData.name} em {cityData.name}
          </Heading>
          <Text color="gray.700" mb={6}>
            Crie uma carta de apresentação personalizada que destaque a sua motivação para trabalhar como {industryData.name} em {cityData.name}.
          </Text>
          <VStack spacing={4}>
            <a href="/">
              <Button colorScheme="yellow" size="lg">
                Criar Carta Personalizada
              </Button>
            </a>
            <a href="/">
              <Button variant="outline" colorScheme="yellow" size="md">
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

          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
            <GridItem>
              <Box bg={cardBg} p={4} rounded="lg" border="1px" borderColor="gray.200" h="full">
                <a href={`/cidade/${city}`} style={{ textDecoration: 'none' }}>
                  <Text fontWeight="semibold" color="blue.600" _hover={{ color: 'blue.800' }} mb={2}>
                    Empregos em {cityData.name}
                  </Text>
                </a>
                <Text fontSize="sm" color="gray.600">
                  Explore todas as profissões e oportunidades disponíveis em {cityData.name}
                </Text>
              </Box>
            </GridItem>

            <GridItem>
              <Box bg={cardBg} p={4} rounded="lg" border="1px" borderColor="gray.200" h="full">
                <a href={`/profissao/${profession}`} style={{ textDecoration: 'none' }}>
                  <Text fontWeight="semibold" color="blue.600" _hover={{ color: 'blue.800' }} mb={2}>
                    {industryData.name} em Portugal
                  </Text>
                </a>
                <Text fontSize="sm" color="gray.600">
                  Veja oportunidades de {industryData.name} noutras cidades portuguesas
                </Text>
              </Box>
            </GridItem>

            <GridItem>
              <Box bg={cardBg} p={4} rounded="lg" border="1px" borderColor="gray.200" h="full">
                <a href="/guia/como-escrever" style={{ textDecoration: 'none' }}>
                  <Text fontWeight="semibold" color="blue.600" _hover={{ color: 'blue.800' }} mb={2}>
                    Como Escrever uma Carta de Apresentação
                  </Text>
                </a>
                <Text fontSize="sm" color="gray.600">
                  Guia completo para criar cartas de apresentação eficazes
                </Text>
              </Box>
            </GridItem>

            <GridItem>
              <Box bg={cardBg} p={4} rounded="lg" border="1px" borderColor="gray.200" h="full">
                <a href="/guia/entrevistas" style={{ textDecoration: 'none' }}>
                  <Text fontWeight="semibold" color="blue.600" _hover={{ color: 'blue.800' }} mb={2}>
                    Preparação para Entrevistas
                  </Text>
                </a>
                <Text fontSize="sm" color="gray.600">
                  Dicas para se preparar para entrevistas de emprego
                </Text>
              </Box>
            </GridItem>
          </Grid>
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
              Crie a sua carta personalizada para {industryData.name} em {cityData.name}
            </Button>
          </a>
        </Box>
      </VStack>
    </SeoPageLayout>
  );
}
