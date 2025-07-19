import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'wasp/client/operations';
import { getSeoPage, getCityData, getIndustryData } from 'wasp/client/operations';
import SeoPageLayout from './SeoPageLayout';

export default function CityProfessionPage() {
  const { city, profession } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageData, setPageData] = useState<any>(null);
  const [cityData, setCityData] = useState<any>(null);
  const [industryData, setIndustryData] = useState<any>(null);

  // Generate slug from city and profession parameters
  const combinedSlug = `carta-apresentacao-${profession}-${city}`;

  const { 
    data: seoPageData, 
    isLoading: seoPageLoading, 
    error: seoPageError 
  } = useQuery(getSeoPage, { slug: combinedSlug });

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">A carregar...</p>
        </div>
      </div>
    );
  }

  if (error || !pageData || !cityData || !industryData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Página não encontrada</h1>
          <p className="text-gray-600 mb-8">A combinação de cidade e profissão que procura não existe.</p>
          <div className="space-x-4">
            <a href={`/cidade/${city}`} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md font-medium">
              Ver {cityData?.name || 'Cidade'}
            </a>
            <a href={`/profissao/${profession}`} className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md font-medium">
              Ver {industryData?.name || 'Profissão'}
            </a>
          </div>
        </div>
      </div>
    );
  }

  const breadcrumbs = [
    { label: 'Cidades', href: '/cidades' },
    { label: cityData.name, href: `/cidade/${city}` },
    { label: industryData.name }
  ];

  const relatedLinks = [
    {
      title: `Todas as oportunidades em ${cityData.name}`,
      href: `/cidade/${city}`,
      description: `Ver todas as profissões disponíveis em ${cityData.name}`
    },
    {
      title: `${industryData.name} em outras cidades`,
      href: `/profissao/${profession}`,
      description: `Oportunidades de ${industryData.name} em Portugal`
    },
    {
      title: 'Guia de Entrevistas',
      href: '/guia/entrevistas',
      description: 'Como se preparar para entrevistas de emprego'
    },
    {
      title: 'Negociação Salarial',
      href: '/guia/salarios',
      description: 'Dicas para negociar o seu salário'
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": pageData.title,
    "description": pageData.metaDescription,
    "url": `https://cartadeapresentacao.pt/cidade/${city}/${profession}`,
    "mainEntity": {
      "@type": "JobPosting",
      "title": industryData.name,
      "description": `Oportunidades de ${industryData.name} em ${cityData.name}`,
      "hiringOrganization": {
        "@type": "Organization",
        "name": `Empresas em ${cityData.name}`
      },
      "jobLocation": {
        "@type": "Place",
        "name": cityData.name,
        "addressCountry": "PT",
        "addressRegion": cityData.district
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

        {/* Combined Overview */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                {industryData.name}
              </h3>
              <p className="text-blue-700 text-sm">{industryData.description}</p>
              {industryData.salary && (
                <p className="text-blue-800 font-medium mt-2">
                  <strong>Salário médio:</strong> {industryData.salary}
                </p>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {cityData.name}
              </h3>
              <p className="text-green-700 text-sm">{cityData.description}</p>
              <div className="mt-2 text-green-800 text-sm">
                {cityData.population && (
                  <p><strong>População:</strong> {cityData.population.toLocaleString('pt-PT')}</p>
                )}
                {cityData.district && (
                  <p><strong>Distrito:</strong> {cityData.district}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div dangerouslySetInnerHTML={{ __html: pageData.content }} />

        {/* Market Insights */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Mercado de {industryData.name} em {cityData.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">Alta</div>
              <div className="text-sm text-gray-600">Procura</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">Boa</div>
              <div className="text-sm text-gray-600">Perspetiva</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">Crescimento</div>
              <div className="text-sm text-gray-600">Tendência</div>
            </div>
          </div>
        </div>

        {/* Skills for Local Market */}
        {industryData.skills && industryData.skills.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Competências Valorizadas em {cityData.name}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {industryData.skills.map((skill: string, index: number) => (
                <div 
                  key={index}
                  className="flex items-center p-3 bg-white border border-gray-200 rounded-lg"
                >
                  <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-gray-900">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Local Tips */}
        <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">
            Dicas Específicas para {cityData.name}
          </h3>
          <ul className="space-y-2 text-yellow-700">
            <li>• Mencione o seu conhecimento sobre o mercado local de {cityData.name}</li>
            <li>• Destaque a sua disponibilidade para trabalhar na região</li>
            <li>• Refira empresas conhecidas da área de {industryData.name} em {cityData.name}</li>
            <li>• Demonstre interesse na comunidade profissional local</li>
          </ul>
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Perguntas Frequentes</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Como é trabalhar como {industryData.name} em {cityData.name}?
              </h3>
              <p className="text-gray-700">
                {cityData.name} oferece excelentes oportunidades para profissionais de {industryData.name}, 
                com um mercado dinâmico e empresas de referência no sector.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Que empresas contratam {industryData.name} em {cityData.name}?
              </h3>
              <p className="text-gray-700">
                Existem várias empresas em {cityData.name} que procuram profissionais de {industryData.name}, 
                desde startups a multinacionais. Consulte sites de emprego para oportunidades atuais.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Como personalizar a carta para empresas de {industryData.name} em {cityData.name}?
              </h3>
              <p className="text-gray-700">
                Pesquise sobre a empresa, mencione projetos locais relevantes, destaque competências específicas 
                para {industryData.name} e demonstre conhecimento sobre o mercado de {cityData.name}.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 p-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Candidate-se a {industryData.name} em {cityData.name}
          </h2>
          <p className="text-blue-100 mb-6">
            Crie uma carta de apresentação personalizada que destaque a sua adequação para trabalhar 
            como {industryData.name} em {cityData.name}.
          </p>
          <a 
            href="/" 
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Criar Carta Personalizada
          </a>
        </div>
      </div>
    </SeoPageLayout>
  );
}
