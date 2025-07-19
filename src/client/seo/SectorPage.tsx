import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'wasp/client/operations';
import { getSeoPage, getAllIndustries } from 'wasp/client/operations';
import SeoPageLayout from './SeoPageLayout';

export default function SectorPage() {
  const { sector } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageData, setPageData] = useState<any>(null);
  const [sectorIndustries, setSectorIndustries] = useState<any[]>([]);

  // Generate slug from sector parameter
  const sectorSlug = `setor-${sector}`;

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
      setLoading(false);
    }
    
    if (industries && industries.length > 0) {
      // Filter industries by sector (this is a simplified approach)
      // In a real implementation, you'd have sector categorization in your data
      setSectorIndustries(industries.slice(0, 12));
    }

    if (seoPageError) {
      setError('Página não encontrada');
      setLoading(false);
    }
  }, [seoPageData, industries, seoPageError]);

  if (loading || seoPageLoading || industriesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">A carregar...</p>
        </div>
      </div>
    );
  }

  if (error || !pageData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Página não encontrada</h1>
          <p className="text-gray-600 mb-8">O sector que procura não existe ou foi removido.</p>
          <a href="/" className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-md font-medium">
            Voltar ao Início
          </a>
        </div>
      </div>
    );
  }

  const sectorName = sector ? sector.charAt(0).toUpperCase() + sector.slice(1).replace('-', ' ') : 'Sector';
  
  const breadcrumbs = [
    { label: 'Sectores', href: '/sectores' },
    { label: sectorName }
  ];

  const relatedLinks = [
    {
      title: 'Guia de Cartas por Sector',
      href: '/guia/sectores',
      description: 'Como adaptar cartas para diferentes sectores'
    },
    {
      title: 'Tendências do Mercado',
      href: '/guia/tendencias',
      description: 'Últimas tendências do mercado de trabalho'
    },
    {
      title: 'Competências Transversais',
      href: '/guia/competencias',
      description: 'Competências valorizadas em todos os sectores'
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": pageData.title,
    "description": pageData.metaDescription,
    "url": `https://cartadeapresentacao.pt/setor/${sector}`,
    "mainEntity": {
      "@type": "ItemList",
      "name": `Profissões no sector ${sectorName}`,
      "description": `Lista de profissões disponíveis no sector ${sectorName}`,
      "itemListElement": sectorIndustries.map((industry, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "JobPosting",
          "title": industry.name,
          "description": industry.description
        }
      }))
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

        {/* Sector Overview */}
        <div className="bg-purple-50 border-l-4 border-purple-400 p-6 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-purple-800">
                Sector {sectorName}
              </h3>
              <div className="mt-2 text-sm text-purple-700">
                <p>
                  O sector {sectorName.toLowerCase()} é uma área dinâmica do mercado de trabalho português, 
                  oferecendo diversas oportunidades de carreira para profissionais qualificados.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div dangerouslySetInnerHTML={{ __html: pageData.content }} />

        {/* Professions in Sector */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Profissões no Sector {sectorName}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sectorIndustries.map((industry, index) => (
              <a
                key={index}
                href={`/profissao/${industry.slug}`}
                className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-purple-400 hover:shadow-lg transition-all"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{industry.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{industry.description}</p>
                {industry.salary && (
                  <p className="text-purple-600 font-medium text-sm mb-3">
                    💰 {industry.salary}
                  </p>
                )}
                <div className="flex items-center text-purple-600 text-sm font-medium">
                  Ver detalhes
                  <svg className="ml-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Sector Statistics */}
        <div className="mt-12 bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Estatísticas do Sector {sectorName}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{sectorIndustries.length}+</div>
              <div className="text-gray-600">Profissões</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">2.5K+</div>
              <div className="text-gray-600">Vagas/Mês</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">78%</div>
              <div className="text-gray-600">Taxa Emprego</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">+12%</div>
              <div className="text-gray-600">Crescimento</div>
            </div>
          </div>
        </div>

        {/* Tips for Sector */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Dicas para Cartas no Sector {sectorName}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Linguagem Específica</h3>
              <p className="text-gray-600">
                Use terminologia específica do sector {sectorName.toLowerCase()} para demonstrar 
                conhecimento técnico e familiaridade com a área.
              </p>
            </div>
            <div className="bg-white p-6 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Competências Relevantes</h3>
              <p className="text-gray-600">
                Destaque competências técnicas e interpessoais valorizadas especificamente 
                no sector {sectorName.toLowerCase()}.
              </p>
            </div>
            <div className="bg-white p-6 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Tendências Atuais</h3>
              <p className="text-gray-600">
                Mencione conhecimento sobre tendências e inovações recentes no sector 
                {sectorName.toLowerCase()}.
              </p>
            </div>
            <div className="bg-white p-6 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Resultados Mensuráveis</h3>
              <p className="text-gray-600">
                Inclua exemplos concretos de resultados e conquistas relevantes para o sector 
                {sectorName.toLowerCase()}.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 p-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Destaque-se no Sector {sectorName}
          </h2>
          <p className="text-purple-100 mb-6">
            Crie uma carta de apresentação personalizada que demonstre a sua adequação ao sector {sectorName.toLowerCase()}.
          </p>
          <a 
            href="/" 
            className="inline-block bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Criar Carta Especializada
          </a>
        </div>
      </div>
    </SeoPageLayout>
  );
}
