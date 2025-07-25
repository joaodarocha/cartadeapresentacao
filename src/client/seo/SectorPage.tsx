import {
  Badge,
  Box,
  Button,
  Divider,
  Grid,
  GridItem,
  Heading,
  HStack,
  Spinner,
  Text,
  useColorModeValue,
  VStack
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAllIndustries, getSeoPage, useQuery } from 'wasp/client/operations';
import { Link } from 'wasp/client/router';
import StructuredData, { createOrganizationData, createWebPageData } from '../components/StructuredData';
import SeoPageLayout from './SeoPageLayout';

export default function SectorPage() {
  const { sector } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageData, setPageData] = useState<any>(null);
  const [sectorIndustries, setSectorIndustries] = useState<any[]>([]);

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  // Generate slug from sector parameter
  const sectorSlug = `carta-apresentacao-sector-${sector}`;

  const {
    data: seoPageData,
    isLoading: seoPageLoading,
    error: seoPageError
  } = useQuery(getSeoPage, { slug: sectorSlug });

  const {
    data: industries,
    isLoading: industriesLoading
  } = useQuery(getAllIndustries, {});

  useEffect(() => {
    if (seoPageData) {
      setPageData(seoPageData);
    }

    if (industries && industries.length > 0 && sector) {
      // Filter industries by sector
      const filtered = industries.filter((industry: any) =>
        industry.sector?.toLowerCase() === sector.toLowerCase() ||
        industry.name.toLowerCase().includes(sector.toLowerCase())
      );
      setSectorIndustries(filtered);

      if (seoPageData) {
        setLoading(false);
      }
    }

    if (seoPageError) {
      setError('Página não encontrada');
      setLoading(false);
    }
  }, [seoPageData, industries, sector, seoPageError]);

  if (loading || seoPageLoading || industriesLoading) {
    return (
      <Box minH="100vh" bg={bgColor} display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Spinner size="lg" color="blue.500" thickness="4px"/>
          <Text color="gray.600">A carregar...</Text>
        </VStack>
      </Box>
    );
  }

  if (error || !pageData) {
    return (
      <Box minH="100vh" bg={bgColor} display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={6} textAlign="center">
          <Heading size="lg" color="gray.900">Página não encontrada</Heading>
          <Text color="gray.600">O sector que procura não existe ou foi removido.</Text>
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
    { label: 'Sectores', href: '/sectores' },
    { label: sector ? sector.charAt(0).toUpperCase() + sector.slice(1) : 'Sector' }
  ];

  const relatedLinks = [
    {
      title: 'Como Escrever uma Carta de Apresentação',
      href: '/guia/como-escrever',
      description: 'Guia completo para escrever cartas eficazes'
    },
    {
      title: 'Exemplos de Cartas de Apresentação',
      href: '/guia/exemplos',
      description: 'Modelos e exemplos práticos'
    },
    {
      title: 'Dicas para Procurar Emprego',
      href: '/guia/dicas',
      description: 'Estratégias eficazes de procura de emprego'
    },
    {
      title: 'Preparação para Entrevistas',
      href: '/guia/entrevistas',
      description: 'Como se preparar para entrevistas de emprego'
    }
  ];

  // Create structured data
  const webPageData = createWebPageData(
    pageData.title,
    pageData.metaDescription,
    `https://cartadeapresentacao.pt/setor/${sector}`
  );

  const organizationData = createOrganizationData();

  // Set canonical URL - sector pages are canonical
  const canonicalUrl = `https://cartadeapresentacao.pt/setor/${sector}`;

  return (
    <SeoPageLayout
      title={pageData.title}
      metaDescription={pageData.metaDescription}
      keywords={pageData.keywords && typeof pageData.keywords === 'string' ? pageData.keywords.split(',').map((k: string) => k.trim()) : Array.isArray(pageData.keywords) ? pageData.keywords : []}
      canonicalUrl={canonicalUrl}
      breadcrumbs={breadcrumbs}
      relatedLinks={relatedLinks}
    >
      <StructuredData data={[webPageData, organizationData]}/>
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

        {/* Sector Overview */}
        <Box>
          <HStack spacing={4} mb={4} align="center">
            <Box fontSize="4xl">🏢</Box>
            <Heading size="lg" color="gray.900">
              Sector de {sector ? sector.charAt(0).toUpperCase() + sector.slice(1) : 'Profissões'}
            </Heading>
          </HStack>

          <Text color="gray.700" mb={6} lineHeight="tall">
            O sector de {sector} oferece diversas oportunidades de carreira em Portugal, com profissões que vão desde
            posições de entrada até cargos de gestão sénior.
          </Text>

          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
            <GridItem>
              <VStack align="stretch" spacing={4}>
                <Box>
                  <Text fontWeight="bold" color="gray.900" mb={2}>Profissões Disponíveis:</Text>
                  <Badge colorScheme="blue" fontSize="md" p={2}>
                    {sectorIndustries.length}+ profissões
                  </Badge>
                </Box>
                <Box>
                  <Text fontWeight="bold" color="gray.900" mb={2}>Sector:</Text>
                  <Text
                    color="gray.700">{sector ? sector.charAt(0).toUpperCase() + sector.slice(1) : 'Diversas áreas'}</Text>
                </Box>
              </VStack>
            </GridItem>
            <GridItem>
              <Text color="gray.700" lineHeight="tall">
                Descubra as melhores oportunidades no sector de {sector} e aprenda como criar cartas de apresentação que
                se destacam no mercado de trabalho português.
              </Text>
            </GridItem>
          </Grid>
        </Box>

        <Divider/>

        {/* Professions in Sector */}
        <Box>
          <Heading size="lg" color="gray.900" mb={4}>
            Profissões no Sector de {sector ? sector.charAt(0).toUpperCase() + sector.slice(1) : 'Profissões'}
          </Heading>

          <Text color="gray.700" mb={6} lineHeight="tall">
            Explore as diferentes profissões disponíveis neste sector e descubra qual se adequa melhor ao seu perfil
            profissional.
          </Text>

          {sectorIndustries.length > 0 ? (
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
              {sectorIndustries.map((industry, index) => (
                <GridItem key={index}>
                  <Box bg={cardBg} p={6} rounded="lg" border="1px" borderColor="gray.200" h="full">
                    <a href={`/profissao/${industry.slug}`} style={{ textDecoration: 'none' }}>
                      <Heading size="md" color="blue.600" _hover={{ color: 'blue.800' }} mb={3}>
                        {industry.name}
                      </Heading>
                    </a>
                    <Text fontSize="sm" color="gray.600" mb={4} noOfLines={3}>
                      {industry.description || `Oportunidades de carreira em ${industry.name}`}
                    </Text>
                    {industry.averageSalary && (
                      <Badge colorScheme="green" fontSize="sm">
                        €{industry.averageSalary.toLocaleString()} / ano
                      </Badge>
                    )}
                  </Box>
                </GridItem>
              ))}
            </Grid>
          ) : (
            <Box bg="gray.50" p={8} rounded="lg" textAlign="center">
              <Text color="gray.600" mb={4}>
                Não foram encontradas profissões específicas para este sector.
              </Text>
              <a href="/profissoes" style={{ textDecoration: 'none' }}>
                <Button variant="outline" colorScheme="blue" size="md">
                  Ver Todas as Profissões
                </Button>
              </a>
            </Box>
          )}
        </Box>

        <Divider/>

        {/* Career Tips */}
        <Box>
          <Heading size="lg" color="gray.900" mb={4}>
            Dicas de Carreira para o Sector
          </Heading>

          <VStack spacing={4} align="stretch">
            <Box bg={cardBg} p={4} rounded="lg" border="1px" borderColor="gray.200">
              <Text fontWeight="semibold" color="gray.900" mb={2}>
                1. Mantenha-se Atualizado
              </Text>
              <Text color="gray.700" fontSize="sm">
                O sector de {sector} está em constante evolução. Mantenha-se informado sobre as últimas tendências e
                tecnologias.
              </Text>
            </Box>

            <Box bg={cardBg} p={4} rounded="lg" border="1px" borderColor="gray.200">
              <Text fontWeight="semibold" color="gray.900" mb={2}>
                2. Desenvolva Competências Relevantes
              </Text>
              <Text color="gray.700" fontSize="sm">
                Identifique as competências mais procuradas no sector e invista na sua formação contínua.
              </Text>
            </Box>

            <Box bg={cardBg} p={4} rounded="lg" border="1px" borderColor="gray.200">
              <Text fontWeight="semibold" color="gray.900" mb={2}>
                3. Construa uma Rede Profissional
              </Text>
              <Text color="gray.700" fontSize="sm">
                Participe em eventos do sector, associações profissionais e plataformas online para expandir a sua rede.
              </Text>
            </Box>
          </VStack>
        </Box>

        <Divider/>

        {/* FAQ Section */}
        <Box>
          <Heading size="lg" color="gray.900" mb={6}>
            Perguntas Frequentes
          </Heading>

          <VStack spacing={6} align="stretch">
            <Box>
              <Heading size="md" color="gray.900" mb={3}>
                Quais são as profissões mais procuradas no sector de {sector}?
              </Heading>
              <Text color="gray.700" lineHeight="tall">
                As profissões mais procuradas variam conforme as tendências do mercado, mas geralmente incluem posições
                que combinam competências técnicas com capacidades de liderança e inovação.
              </Text>
            </Box>

            <Box>
              <Heading size="md" color="gray.900" mb={3}>
                Como me preparar para uma carreira no sector de {sector}?
              </Heading>
              <Text color="gray.700" lineHeight="tall">
                Invista na formação adequada, desenvolva competências práticas através de estágios ou projetos, e
                mantenha-se atualizado com as tendências do sector.
              </Text>
            </Box>

            <Box>
              <Heading size="md" color="gray.900" mb={3}>
                Que competências são mais valorizadas no sector?
              </Heading>
              <Text color="gray.700" lineHeight="tall">
                Além das competências técnicas específicas, são valorizadas competências como resolução de problemas,
                comunicação, trabalho em equipa e adaptabilidade.
              </Text>
            </Box>

            <Box>
              <Heading size="md" color="gray.900" mb={3}>
                Como personalizar uma carta de apresentação para este sector?
              </Heading>
              <Text color="gray.700" lineHeight="tall">
                Destaque a sua experiência relevante no sector, use terminologia específica da área, e demonstre
                conhecimento sobre as tendências e desafios do mercado.
              </Text>
            </Box>
          </VStack>
        </Box>

        <Divider/>

        {/* Call to Action */}
        <Box bg="blue.50" p={6} rounded="lg" border="1px" borderColor="blue.200" textAlign="center">
          <Heading size="lg" color="gray.900" mb={4}>
            Inicie a Sua Carreira no Sector
            de {sector ? sector.charAt(0).toUpperCase() + sector.slice(1) : 'Profissões'}
          </Heading>
          <Text color="gray.700" mb={6}>
            Crie uma carta de apresentação personalizada que destaque a sua adequação para o sector de {sector}.
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
            Recursos Úteis
          </Heading>

          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
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
                <a href="/guia/exemplos" style={{ textDecoration: 'none' }}>
                  <Text fontWeight="semibold" color="blue.600" _hover={{ color: 'blue.800' }} mb={2}>
                    Exemplos de Cartas de Apresentação
                  </Text>
                </a>
                <Text fontSize="sm" color="gray.600">
                  Modelos e exemplos práticos para diferentes sectores
                </Text>
              </Box>
            </GridItem>

            <GridItem>
              <Box bg={cardBg} p={4} rounded="lg" border="1px" borderColor="gray.200" h="full">
                <a href="/guia/dicas" style={{ textDecoration: 'none' }}>
                  <Text fontWeight="semibold" color="blue.600" _hover={{ color: 'blue.800' }} mb={2}>
                    Dicas para Procurar Emprego
                  </Text>
                </a>
                <Text fontSize="sm" color="gray.600">
                  Estratégias eficazes para encontrar oportunidades
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
                  Como se preparar para entrevistas de emprego
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
            A ferramenta mais avançada para criar cartas de apresentação profissionais em Portugal. Powered by AI,
            designed for success.
          </Text>
          <a href="/" style={{ textDecoration: 'none' }}>
            <Button colorScheme="blue" size="md">
              Crie a sua carta personalizada para o sector de {sector}
            </Button>
          </a>
        </Box>
      </VStack>
    </SeoPageLayout>
  );
}
