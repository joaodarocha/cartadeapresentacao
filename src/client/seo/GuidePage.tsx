import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'wasp/client/operations';
import { getSeoPage } from 'wasp/client/operations';
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
  OrderedList,
  UnorderedList,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/react';

export default function GuidePage() {
  const { topic } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageData, setPageData] = useState<any>(null);

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  // Generate slug from topic parameter
  const guideSlug = `guia-${topic}`;

  const { 
    data: seoPageData, 
    isLoading: seoPageLoading, 
    error: seoPageError 
  } = useQuery(getSeoPage, { slug: guideSlug });

  useEffect(() => {
    if (seoPageData) {
      setPageData(seoPageData);
      setLoading(false);
    }

    if (seoPageError) {
      setError('Página não encontrada');
      setLoading(false);
    }
  }, [seoPageData, seoPageError]);

  if (loading || seoPageLoading) {
    return (
      <Box minH="100vh" bg={bgColor} display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Spinner size="lg" color="yellow.500" thickness="4px" />
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
          <Text color="gray.600">O guia que procura não existe ou foi removido.</Text>
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
    { label: 'Guias', href: '/guias' },
    { label: topic ? topic.charAt(0).toUpperCase() + topic.slice(1).replace('-', ' ') : 'Guia' }
  ];

  const relatedLinks = [
    {
      title: 'Como Escrever uma Carta de Apresentação',
      href: '/guia/como-escrever',
      description: 'Guia completo passo a passo'
    },
    {
      title: 'Exemplos de Cartas de Apresentação',
      href: '/guia/exemplos',
      description: 'Modelos e templates gratuitos'
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

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": pageData.title,
    "description": pageData.metaDescription,
    "url": `https://cartadeapresentacao.pt/guia/${topic}`,
    "image": "https://cartadeapresentacao.pt/images/guide-cover.jpg",
    "totalTime": "PT30M",
    "supply": ["Computador", "Acesso à internet", "Informações profissionais"],
    "tool": ["Editor de texto", "Carta de Apresentação.pt"],
    "step": [
      {
        "@type": "HowToStep",
        "name": "Preparação",
        "text": "Reúna todas as informações necessárias sobre a sua experiência profissional"
      },
      {
        "@type": "HowToStep", 
        "name": "Estruturação",
        "text": "Organize o conteúdo da carta seguindo uma estrutura lógica"
      },
      {
        "@type": "HowToStep",
        "name": "Personalização",
        "text": "Adapte a carta para a empresa e posição específica"
      }
    ]
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

        {/* Introduction */}
        <Box>
          <HStack spacing={4} mb={4} align="center">
            <Box fontSize="4xl">📚</Box>
            <Heading size="lg" color="gray.900">
              Guia Completo
            </Heading>
          </HStack>
          
          <Text color="gray.700" mb={6} lineHeight="tall">
            Este guia foi criado para o ajudar a dominar todos os aspetos relacionados com {topic?.replace('-', ' ')}. 
            Siga os passos apresentados para obter os melhores resultados.
          </Text>

          <Alert status="info" rounded="lg">
            <AlertIcon />
            <Box>
              <AlertTitle>Tempo estimado:</AlertTitle>
              <AlertDescription>
                30 minutos para ler e aplicar todas as dicas deste guia.
              </AlertDescription>
            </Box>
          </Alert>
        </Box>

        <Divider />

        {/* Step-by-Step Guide */}
        <Box>
          <Heading size="lg" color="gray.900" mb={6}>
            Passos a Seguir
          </Heading>
          
          <OrderedList spacing={6}>
            <ListItem>
              <Box>
                <Heading size="md" color="gray.900" mb={3}>
                  Preparação Inicial
                </Heading>
                <Text color="gray.700" lineHeight="tall" mb={4}>
                  Antes de começar, reúna todas as informações necessárias sobre a sua experiência profissional, 
                  formação académica e competências relevantes.
                </Text>
                <UnorderedList color="gray.600" spacing={2}>
                  <ListItem>Currículo atualizado</ListItem>
                  <ListItem>Informações sobre a empresa</ListItem>
                  <ListItem>Descrição da vaga</ListItem>
                  <ListItem>Exemplos de trabalhos anteriores</ListItem>
                </UnorderedList>
              </Box>
            </ListItem>

            <ListItem>
              <Box>
                <Heading size="md" color="gray.900" mb={3}>
                  Estruturação do Conteúdo
                </Heading>
                <Text color="gray.700" lineHeight="tall" mb={4}>
                  Organize o conteúdo seguindo uma estrutura lógica que facilite a leitura e compreensão.
                </Text>
                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                  <GridItem>
                    <Box bg="blue.50" p={4} rounded="lg">
                      <Text fontWeight="semibold" color="blue.900" mb={2}>Introdução</Text>
                      <Text fontSize="sm" color="blue.800">
                        Apresente-se e mencione a posição de interesse
                      </Text>
                    </Box>
                  </GridItem>
                  <GridItem>
                    <Box bg="green.50" p={4} rounded="lg">
                      <Text fontWeight="semibold" color="green.900" mb={2}>Corpo</Text>
                      <Text fontSize="sm" color="green.800">
                        Destaque experiência e competências relevantes
                      </Text>
                    </Box>
                  </GridItem>
                  <GridItem>
                    <Box bg="purple.50" p={4} rounded="lg">
                      <Text fontWeight="semibold" color="purple.900" mb={2}>Conclusão</Text>
                      <Text fontSize="sm" color="purple.800">
                        Reforce o interesse e solicite uma entrevista
                      </Text>
                    </Box>
                  </GridItem>
                  <GridItem>
                    <Box bg="orange.50" p={4} rounded="lg">
                      <Text fontWeight="semibold" color="orange.900" mb={2}>Despedida</Text>
                      <Text fontSize="sm" color="orange.800">
                        Termine com uma despedida profissional
                      </Text>
                    </Box>
                  </GridItem>
                </Grid>
              </Box>
            </ListItem>

            <ListItem>
              <Box>
                <Heading size="md" color="gray.900" mb={3}>
                  Personalização
                </Heading>
                <Text color="gray.700" lineHeight="tall" mb={4}>
                  Adapte cada carta para a empresa e posição específica. A personalização é fundamental para o sucesso.
                </Text>
                <VStack spacing={3} align="stretch">
                  <Box bg={cardBg} p={4} rounded="lg" border="1px" borderColor="gray.200">
                    <Text fontWeight="semibold" color="gray.900" mb={2}>Pesquise a Empresa</Text>
                    <Text fontSize="sm" color="gray.700">
                      Conheça a missão, valores e cultura da empresa para adaptar o seu discurso.
                    </Text>
                  </Box>
                  <Box bg={cardBg} p={4} rounded="lg" border="1px" borderColor="gray.200">
                    <Text fontWeight="semibold" color="gray.900" mb={2}>Analise a Vaga</Text>
                    <Text fontSize="sm" color="gray.700">
                      Identifique as competências e requisitos mais importantes mencionados na oferta.
                    </Text>
                  </Box>
                  <Box bg={cardBg} p={4} rounded="lg" border="1px" borderColor="gray.200">
                    <Text fontWeight="semibold" color="gray.900" mb={2}>Use Palavras-Chave</Text>
                    <Text fontSize="sm" color="gray.700">
                      Inclua termos específicos da área e da empresa para mostrar alinhamento.
                    </Text>
                  </Box>
                </VStack>
              </Box>
            </ListItem>
          </OrderedList>
        </Box>

        <Divider />

        {/* Best Practices */}
        <Box>
          <Heading size="lg" color="gray.900" mb={4}>
            Melhores Práticas
          </Heading>
          
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
            <GridItem>
              <VStack spacing={4} align="stretch">
                <Box bg="green.50" p={4} rounded="lg" border="1px" borderColor="green.200">
                  <Text fontWeight="bold" color="green.800" mb={2}>✅ Faça</Text>
                  <UnorderedList color="green.700" spacing={1}>
                    <ListItem>Seja conciso e objetivo</ListItem>
                    <ListItem>Use exemplos concretos</ListItem>
                    <ListItem>Revise cuidadosamente</ListItem>
                    <ListItem>Personalize cada carta</ListItem>
                    <ListItem>Mantenha um tom profissional</ListItem>
                  </UnorderedList>
                </Box>
              </VStack>
            </GridItem>
            <GridItem>
              <VStack spacing={4} align="stretch">
                <Box bg="red.50" p={4} rounded="lg" border="1px" borderColor="red.200">
                  <Text fontWeight="bold" color="red.800" mb={2}>❌ Evite</Text>
                  <UnorderedList color="red.700" spacing={1}>
                    <ListItem>Cartas genéricas</ListItem>
                    <ListItem>Erros ortográficos</ListItem>
                    <ListItem>Informação irrelevante</ListItem>
                    <ListItem>Tom demasiado informal</ListItem>
                    <ListItem>Cartas muito longas</ListItem>
                  </UnorderedList>
                </Box>
              </VStack>
            </GridItem>
          </Grid>
        </Box>

        <Divider />

        {/* Common Mistakes */}
        <Box>
          <Heading size="lg" color="gray.900" mb={4}>
            Erros Comuns a Evitar
          </Heading>
          
          <VStack spacing={4} align="stretch">
            <Alert status="warning" rounded="lg">
              <AlertIcon />
              <Box>
                <AlertTitle>Carta Genérica</AlertTitle>
                <AlertDescription>
                  Usar a mesma carta para todas as candidaturas é um erro grave. Cada empresa é única.
                </AlertDescription>
              </Box>
            </Alert>

            <Alert status="error" rounded="lg">
              <AlertIcon />
              <Box>
                <AlertTitle>Foco Apenas em Si</AlertTitle>
                <AlertDescription>
                  Concentre-se no que pode oferecer à empresa, não apenas no que espera receber.
                </AlertDescription>
              </Box>
            </Alert>

            <Alert status="warning" rounded="lg">
              <AlertIcon />
              <Box>
                <AlertTitle>Falta de Pesquisa</AlertTitle>
                <AlertDescription>
                  Não pesquisar sobre a empresa demonstra falta de interesse genuíno na posição.
                </AlertDescription>
              </Box>
            </Alert>
          </VStack>
        </Box>

        <Divider />

        {/* Call to Action */}
        <Box bg="yellow.50" p={6} rounded="lg" border="1px" borderColor="yellow.200" textAlign="center">
          <Heading size="lg" color="gray.900" mb={4}>
            Pronto para Aplicar o Que Aprendeu?
          </Heading>
          <Text color="gray.700" mb={6}>
            Use a nossa ferramenta AI para criar uma carta de apresentação profissional seguindo todas as melhores práticas.
          </Text>
          <VStack spacing={4}>
            <a href="/">
              <Button colorScheme="yellow" size="lg">
                Criar Carta Agora
              </Button>
            </a>
            <a href="/">
              <Button variant="outline" colorScheme="yellow" size="md">
                Começar Gratuitamente
              </Button>
            </a>
          </VStack>
        </Box>

        {/* Related Guides */}
        <Box>
          <Heading size="lg" color="gray.900" mb={6}>
            Guias Relacionados
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
                  Guia completo passo a passo para criar cartas eficazes
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
                  Modelos e exemplos práticos para diferentes situações
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
            A ferramenta mais avançada para criar cartas de apresentação profissionais em Portugal. Powered by AI, designed for success.
          </Text>
          <a href="/">
            <Button colorScheme="yellow" size="md">
              Transforme este conhecimento numa carta vencedora
            </Button>
          </a>
        </Box>
      </VStack>
    </SeoPageLayout>
  );
}
