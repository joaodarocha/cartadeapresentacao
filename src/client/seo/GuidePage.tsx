import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'wasp/client/operations';
import { getSeoPage } from 'wasp/client/operations';
import SeoPageLayout from './SeoPageLayout';

export default function GuidePage() {
  const { topic } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageData, setPageData] = useState<any>(null);

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
      setError('Guia não encontrado');
      setLoading(false);
    }
  }, [seoPageData, seoPageError]);

  if (loading || seoPageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">A carregar guia...</p>
        </div>
      </div>
    );
  }

  if (error || !pageData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Guia não encontrado</h1>
          <p className="text-gray-600 mb-8">O guia que procura não existe ou foi removido.</p>
          <a href="/guias" className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-md font-medium">
            Ver Todos os Guias
          </a>
        </div>
      </div>
    );
  }

  const topicName = topic?.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ') || 'Guia';

  const breadcrumbs = [
    { label: 'Guias', href: '/guias' },
    { label: topicName }
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
      title: 'Erros Comuns a Evitar',
      href: '/guia/erros-comuns',
      description: 'Principais erros e como evitá-los'
    },
    {
      title: 'Dicas para Entrevistas',
      href: '/guia/entrevistas',
      description: 'Como se preparar para entrevistas'
    },
    {
      title: 'Negociação Salarial',
      href: '/guia/salarios',
      description: 'Estratégias de negociação'
    },
    {
      title: 'Procura de Emprego Online',
      href: '/guia/procurar-emprego',
      description: 'Melhores sites e estratégias'
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": pageData.title,
    "description": pageData.metaDescription,
    "url": `https://cartadeapresentacao.pt/guia/${topic}`,
    "datePublished": new Date().toISOString(),
    "dateModified": new Date().toISOString(),
    "author": {
      "@type": "Organization",
      "name": "Carta de Apresentação"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Carta de Apresentação",
      "logo": {
        "@type": "ImageObject",
        "url": "https://cartadeapresentacao.pt/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://cartadeapresentacao.pt/guia/${topic}`
    }
  };

  // Guide-specific content based on topic
  const getGuideIcon = () => {
    switch (topic) {
      case 'como-escrever':
        return (
          <svg className="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        );
      case 'exemplos':
        return (
          <svg className="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'entrevistas':
        return (
          <svg className="h-8 w-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      default:
        return (
          <svg className="h-8 w-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
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
        {/* Guide Header */}
        <div className="flex items-center mb-8">
          <div className="flex-shrink-0 mr-4">
            {getGuideIcon()}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {pageData.title}
            </h1>
            <p className="text-lg text-gray-600">
              {pageData.metaDescription}
            </p>
          </div>
        </div>

        {/* Reading Time and Difficulty */}
        <div className="flex items-center space-x-6 mb-8 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center text-sm text-gray-600">
            <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            5-10 min de leitura
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Nível: Iniciante
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            Guia Completo
          </div>
        </div>

        {/* Main Content */}
        <div dangerouslySetInnerHTML={{ __html: pageData.content }} />

        {/* Quick Tips Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Dicas Rápidas
          </h3>
          <ul className="space-y-2 text-blue-700">
            <li>• Personalize sempre a sua carta para cada candidatura</li>
            <li>• Mantenha um tom profissional mas autêntico</li>
            <li>• Destaque conquistas específicas e mensuráveis</li>
            <li>• Revise cuidadosamente antes de enviar</li>
            <li>• Use uma estrutura clara e fácil de ler</li>
          </ul>
        </div>

        {/* Related Guides */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Guias Relacionados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedLinks.slice(0, 6).map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-yellow-400 hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-gray-900 mb-2">{link.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{link.description}</p>
                <div className="text-sm text-yellow-600 font-medium">
                  Ler guia →
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Action Steps */}
        <div className="mt-12 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Próximos Passos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Aplique o Conhecimento</h3>
              <p className="text-sm text-gray-600">
                Use as dicas deste guia na sua próxima carta de apresentação
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Pratique Regularmente</h3>
              <p className="text-sm text-gray-600">
                Crie várias versões e adapte para diferentes oportunidades
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Obtenha Feedback</h3>
              <p className="text-sm text-gray-600">
                Peça opinião a profissionais da área ou use a nossa ferramenta
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 p-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Pronto para Criar a Sua Carta?
          </h2>
          <p className="text-yellow-100 mb-6">
            Use a nossa ferramenta AI para aplicar todas estas dicas automaticamente.
          </p>
          <a 
            href="/" 
            className="inline-block bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Começar Agora - É Grátis
          </a>
        </div>
      </div>
    </SeoPageLayout>
  );
}
