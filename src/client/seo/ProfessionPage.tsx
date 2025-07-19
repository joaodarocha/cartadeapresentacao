import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'wasp/client/operations';
import { getSeoPage, getIndustryData, getAllCities } from 'wasp/client/operations';
import SeoPageLayout from './SeoPageLayout';

export default function ProfessionPage() {
  const { profession } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageData, setPageData] = useState<any>(null);
  const [industryData, setIndustryData] = useState<any>(null);
  const [relatedCities, setRelatedCities] = useState<any[]>([]);

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
      // Get top 5 cities for related links
      setRelatedCities(cities.slice(0, 5));
    }

    if (seoPageError || industryError) {
      setError('Página não encontrada');
      setLoading(false);
    }
  }, [seoPageData, industryInfo, cities, seoPageError, industryError]);

  if (loading || seoPageLoading || industryLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">A carregar...</p>
        </div>
      </div>
    );
  }

  if (error || !pageData || !industryData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Página não encontrada</h1>
          <p className="text-gray-600 mb-8">A profissão que procura não existe ou foi removida.</p>
          <a href="/" className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-md font-medium">
            Voltar ao Início
          </a>
        </div>
      </div>
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
      description: 'Guia completo passo a passo'
    },
    {
      title: 'Exemplos de Cartas de Apresentação',
      href: '/guia/exemplos',
      description: 'Modelos e templates gratuitos'
    }
  );

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": pageData.title,
    "description": pageData.metaDescription,
    "url": `https://cartadeapresentacao.pt/profissao/${profession}`,
    "mainEntity": {
      "@type": "JobPosting",
      "title": industryData.name,
      "description": industryData.description,
      "hiringOrganization": {
        "@type": "Organization",
        "name": "Empresas em Portugal"
      },
      "jobLocation": {
        "@type": "Place",
        "addressCountry": "PT"
      },
      "baseSalary": industryData.salary ? {
        "@type": "MonetaryAmount",
        "currency": "EUR",
        "value": {
          "@type": "QuantitativeValue",
          "value": industryData.salary
        }
      } : undefined
    }
  };

  return (
    <SeoPageLayout
      title={pageData.title}
      metaDescription={pageData.metaDescription}
      keywords={pageData.keywords}
      breadcrumbs={breadcrumbs}
      structuredData={structuredData}
      relatedLinks={relatedLinks}
    >
      <div className="prose prose-lg max-w-none">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {pageData.title}
        </h1>

        {/* Industry Overview */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Informação sobre {industryData.name}
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>{industryData.description}</p>
                {industryData.salary && (
                  <p className="mt-2"><strong>Salário médio:</strong> {industryData.salary}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div dangerouslySetInnerHTML={{ __html: pageData.content }} />

        {/* Skills Section */}
        {industryData.skills && industryData.skills.length > 0 && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Competências Essenciais para {industryData.name}
            </h2>
            <div className="flex flex-wrap gap-2">
              {industryData.skills.map((skill: string, index: number) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Perguntas Frequentes</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Como personalizar uma carta de apresentação para {industryData.name}?
              </h3>
              <p className="text-gray-700">
                Para personalizar uma carta para {industryData.name}, destaque as competências técnicas relevantes, 
                mencione projetos específicos da área e demonstre conhecimento sobre as tendências do sector.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Que competências devo destacar para {industryData.name}?
              </h3>
              <p className="text-gray-700">
                As competências mais valorizadas incluem: {industryData.skills?.slice(0, 3).join(', ')} 
                e competências interpessoais como comunicação e trabalho em equipa.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Qual o salário médio para {industryData.name} em Portugal?
              </h3>
              <p className="text-gray-700">
                {industryData.salary || 'Os salários variam conforme a experiência, localização e dimensão da empresa. Consulte sites especializados para valores atualizados.'}
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 p-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Pronto para Criar a Sua Carta de Apresentação?
          </h2>
          <p className="text-yellow-100 mb-6">
            Use a nossa ferramenta AI para criar uma carta personalizada para {industryData.name} em minutos.
          </p>
          <a 
            href="/" 
            className="inline-block bg-white text-yellow-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Começar Agora - É Grátis
          </a>
        </div>
      </div>
    </SeoPageLayout>
  );
}
