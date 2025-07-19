import React from 'react';
import { Link } from 'wasp/client/router';

interface SeoPageLayoutProps {
  title: string;
  metaDescription: string;
  keywords?: string[];
  breadcrumbs?: Array<{ label: string; href?: string }>;
  children: React.ReactNode;
  structuredData?: object;
  relatedLinks?: Array<{ title: string; href: string; description?: string }>;
}

export default function SeoPageLayout({
  title,
  metaDescription,
  keywords = [],
  breadcrumbs = [],
  children,
  structuredData,
  relatedLinks = []
}: SeoPageLayoutProps) {

  // Set document title and meta tags
  React.useEffect(() => {
    document.title = title;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', metaDescription);
    } else {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      metaDesc.setAttribute('content', metaDescription);
      document.head.appendChild(metaDesc);
    }

    // Update meta keywords
    if (keywords.length > 0) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', keywords.join(', '));
      } else {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        metaKeywords.setAttribute('content', keywords.join(', '));
        document.head.appendChild(metaKeywords);
      }
    }

    // Add structured data
    if (structuredData) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    }
  }, [title, metaDescription, keywords, structuredData]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0">
                <span className="text-xl font-bold text-yellow-500">
                  Carta de Apresentação.pt
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-yellow-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Entrar
              </Link>
              <Link
                to="/"
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Criar Carta
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <Link to="/" className="text-gray-500 hover:text-gray-700">
                    Início
                  </Link>
                </li>
                {breadcrumbs.map((crumb, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="flex-shrink-0 h-4 w-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    {crumb.href ? (
                      <a href={crumb.href} className="text-gray-500 hover:text-gray-700">
                        {crumb.label}
                      </a>
                    ) : (
                      <span className="text-gray-900 font-medium">{crumb.label}</span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Content */}
          <div className="lg:col-span-3">
            <article className="bg-white rounded-lg shadow-sm p-8">
              {children}
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Call to Action */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Crie a Sua Carta Agora
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Use a nossa ferramenta AI para criar uma carta de apresentação personalizada em segundos.
              </p>
              <Link
                to="/"
                className="block w-full bg-yellow-500 hover:bg-yellow-600 text-white text-center px-4 py-2 rounded-md font-medium"
              >
                Começar Agora
              </Link>
            </div>

            {/* Related Links */}
            {relatedLinks.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Conteúdo Relacionado
                </h3>
                <ul className="space-y-3">
                  {relatedLinks.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className="block text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {link.title}
                      </a>
                      {link.description && (
                        <p className="text-gray-600 text-sm mt-1">{link.description}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Carta de Apresentação.pt</h3>
              <p className="text-gray-300 mb-4">
                A ferramenta mais avançada para criar cartas de apresentação profissionais em Portugal.
                Powered by AI, designed for success.
              </p>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">Recursos</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="/guia/como-escrever" className="hover:text-white">Como Escrever</a></li>
                <li><a href="/guia/exemplos" className="hover:text-white">Exemplos</a></li>
                <li><a href="/guia/dicas" className="hover:text-white">Dicas</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="/privacy" className="hover:text-white">Privacidade</Link></li>
                <li><Link to="/tos" className="hover:text-white">Termos</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Carta de Apresentação.pt. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
