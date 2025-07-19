import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'wasp/client/operations';
import { getSeoPage, getCityData, getAllIndustries } from 'wasp/client/operations';
import SeoPageLayout from './SeoPageLayout';

export default function CityPage() {
  const { city } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageData, setPageData] = useState<any>(null);
  const [cityData, setCityData] = useState<any>(null);
  const [relatedIndustries, setRelatedIndustries] = useState<any[]>([]);

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">A carregar...</p>
        </div>
      </div>
    );
  }

  if (error || !pageData || !cityData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Página não encontrada</h1>
          <p className="text-gray-600 mb-8">A cidade que procura não existe ou foi removida.</p>
          <a href="/" className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-md font-medium">
            Voltar ao Início
          </a>
        </div>
      </div>
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
    "mainEntity": {
      "@type": "Place",
      "name": cityData.name,
      "description": cityData.description,
      "addressCountry": "PT",
      "addressRegion": cityData.district,
      "population": cityData.population
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

        {/* City Overview */}
        <div className="bg-green-50 border-l-4 border-green-400 p-6 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Informação sobre {cityData.name}
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>{cityData.description}</p>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  {cityData.population && (
                    <p><strong>População:</strong> {cityData.population.toLocaleString('pt-PT')} habitantes</p>
                  )}
                  {cityData.district && (
                    <p><strong>Distrito:</strong> {cityData.district}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div dangerouslySetInnerHTML={{ __html: pageData.content }} />

        {/* Job Market Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">500+</div>
            <div className="text-sm text-blue-800">Empresas Ativas</div>
          </div>
          <div className="bg-green-50 p-6 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">1200+</div>
            <div className="text-sm text-green-800">Vagas por Mês</div>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">85%</div>
            <div className="text-sm text-purple-800">Taxa de Emprego</div>
          </div>
        </div>

        {/* Top Industries */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Principais Sectores em {cityData.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedIndustries.slice(0, 6).map((industry, index) => (
              <a
                key={index}
                href={`/cidade/${city}/${industry.slug}`}
                className="block p-4 border border-gray-200 rounded-lg hover:border-yellow-400 hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-gray-900 mb-2">{industry.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{industry.description}</p>
                <div className="mt-2 text-sm text-yellow-600 font-medium">
                  Ver oportunidades →
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Perguntas Frequentes</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Como é o mercado de trabalho em {cityData.name}?
              </h3>
              <p className="text-gray-700">
                {cityData.name} oferece um mercado de trabalho dinâmico com oportunidades em diversos sectores. 
                A cidade destaca-se pela sua economia diversificada e qualidade de vida.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Quais são os melhores sites para procurar emprego em {cityData.name}?
              </h3>
              <p className="text-gray-700">
                Os principais sites incluem Net-Empregos, Sapo Emprego, LinkedIn, Indeed Portugal, 
                e sites específicos das empresas locais. Muitas empresas também publicam vagas nas redes sociais.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Como adaptar a carta de apresentação para empresas em {cityData.name}?
              </h3>
              <p className="text-gray-700">
                Mencione o seu conhecimento sobre a cidade, destaque a sua disponibilidade para trabalhar localmente, 
                e demonstre interesse na comunidade empresarial de {cityData.name}.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Qual é o custo de vida em {cityData.name}?
              </h3>
              <p className="text-gray-700">
                O custo de vida em {cityData.name} varia conforme a zona, mas geralmente oferece um bom equilíbrio 
                entre oportunidades profissionais e qualidade de vida comparado com outras cidades portuguesas.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 p-8 bg-gradient-to-r from-green-400 to-green-500 rounded-lg text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Encontre o Seu Emprego em {cityData.name}
          </h2>
          <p className="text-green-100 mb-6">
            Crie uma carta de apresentação personalizada que destaque a sua motivação para trabalhar em {cityData.name}.
          </p>
          <a 
            href="/" 
            className="inline-block bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Criar Carta Agora
          </a>
        </div>
      </div>
    </SeoPageLayout>
  );
}
