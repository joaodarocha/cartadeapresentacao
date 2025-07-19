import React from 'react';

interface RelatedLink {
  title: string;
  href: string;
  description?: string;
  category?: string;
  isExternal?: boolean;
}

interface RelatedContentProps {
  links: RelatedLink[];
  title?: string;
  className?: string;
  maxItems?: number;
  showCategories?: boolean;
  layout?: 'grid' | 'list';
  variant?: 'default' | 'compact' | 'card';
}

const RelatedContent: React.FC<RelatedContentProps> = ({
  links,
  title = 'Conteúdo Relacionado',
  className = '',
  maxItems,
  showCategories = false,
  layout = 'list',
  variant = 'default'
}) => {
  // Limit items if maxItems is specified
  const displayLinks = maxItems ? links.slice(0, maxItems) : links;

  if (displayLinks.length === 0) {
    return null;
  }

  // Group links by category if showCategories is enabled
  const groupedLinks = showCategories
    ? displayLinks.reduce((acc, link) => {
        const category = link.category || 'Outros';
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(link);
        return acc;
      }, {} as Record<string, RelatedLink[]>)
    : { '': displayLinks };

  const renderLink = (link: RelatedLink, index: number) => {
    const linkElement = (
      <a
        href={link.href}
        className={`
          ${variant === 'compact' 
            ? 'text-blue-600 hover:text-blue-800 font-medium' 
            : 'block group'
          }
          ${variant === 'card' 
            ? 'block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200' 
            : ''
          }
          ${variant === 'default' 
            ? 'block text-blue-600 hover:text-blue-800 font-medium hover:underline' 
            : ''
          }
        `}
        {...(link.isExternal && {
          target: '_blank',
          rel: 'noopener noreferrer'
        })}
      >
        <div className={variant === 'card' ? 'flex items-start' : ''}>
          {variant === 'card' && (
            <div className="flex-shrink-0 mr-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            </div>
          )}
          <div className="flex-1">
            <span className={`
              ${variant === 'card' ? 'text-gray-900 font-medium group-hover:text-blue-600' : ''}
              ${variant === 'default' ? 'text-blue-600 hover:text-blue-800' : ''}
              ${variant === 'compact' ? 'text-blue-600 hover:text-blue-800' : ''}
            `}>
              {link.title}
              {link.isExternal && (
                <svg 
                  className="inline w-3 h-3 ml-1" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
                </svg>
              )}
            </span>
            {link.description && variant !== 'compact' && (
              <p className={`
                text-sm mt-1
                ${variant === 'card' ? 'text-gray-600' : 'text-gray-500'}
              `}>
                {link.description}
              </p>
            )}
          </div>
        </div>
      </a>
    );

    return (
      <li key={index} className={variant === 'compact' ? 'inline' : ''}>
        {linkElement}
        {variant === 'compact' && index < displayLinks.length - 1 && (
          <span className="mx-2 text-gray-400">•</span>
        )}
      </li>
    );
  };

  const renderLinkGroup = (groupLinks: RelatedLink[], categoryName: string) => {
    const listClasses = `
      ${layout === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 gap-4' 
        : variant === 'compact' 
          ? 'flex flex-wrap items-center'
          : 'space-y-3'
      }
    `;

    return (
      <div key={categoryName}>
        {showCategories && categoryName && (
          <h4 className="text-md font-semibold text-gray-900 mb-3">
            {categoryName}
          </h4>
        )}
        <ul className={listClasses}>
          {groupLinks.map((link, index) => renderLink(link, index))}
        </ul>
      </div>
    );
  };

  return (
    <div className={`related-content ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <svg 
          className="w-5 h-5 mr-2 text-blue-600" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        {title}
      </h3>
      
      <div className={showCategories ? 'space-y-6' : ''}>
        {Object.entries(groupedLinks).map(([category, categoryLinks]) =>
          renderLinkGroup(categoryLinks, category)
        )}
      </div>
    </div>
  );
};

// Helper functions to generate related content for different page types
export const generateProfessionRelatedLinks = (
  profession: string,
  cities?: string[],
  relatedProfessions?: string[]
): RelatedLink[] => {
  const links: RelatedLink[] = [];

  // Add city-specific profession pages
  if (cities) {
    cities.slice(0, 3).forEach(city => {
      links.push({
        title: `${profession} em ${city}`,
        href: `/cidade/${city.toLowerCase().replace(/\s+/g, '-')}/${profession.toLowerCase().replace(/\s+/g, '-')}`,
        description: `Oportunidades e salários para ${profession} em ${city}`,
        category: 'Por Cidade'
      });
    });
  }

  // Add related professions
  if (relatedProfessions) {
    relatedProfessions.slice(0, 3).forEach(relatedProf => {
      links.push({
        title: `Carta de Apresentação para ${relatedProf}`,
        href: `/profissao/${relatedProf.toLowerCase().replace(/\s+/g, '-')}`,
        description: `Guia completo para ${relatedProf}`,
        category: 'Profissões Relacionadas'
      });
    });
  }

  // Add general guides
  links.push(
    {
      title: 'Como Escrever uma Carta de Apresentação',
      href: '/guia/como-escrever',
      description: 'Guia passo-a-passo para criar uma carta perfeita',
      category: 'Guias'
    },
    {
      title: 'Exemplos de Cartas de Apresentação',
      href: '/guia/exemplos',
      description: 'Modelos e exemplos reais de cartas eficazes',
      category: 'Guias'
    }
  );

  return links;
};

export const generateCityRelatedLinks = (
  city: string,
  topProfessions?: string[],
  nearbyCities?: string[]
): RelatedLink[] => {
  const links: RelatedLink[] = [];

  // Add top professions in the city
  if (topProfessions) {
    topProfessions.slice(0, 3).forEach(profession => {
      links.push({
        title: `${profession} em ${city}`,
        href: `/cidade/${city.toLowerCase().replace(/\s+/g, '-')}/${profession.toLowerCase().replace(/\s+/g, '-')}`,
        description: `Oportunidades para ${profession} em ${city}`,
        category: 'Profissões em Destaque'
      });
    });
  }

  // Add nearby cities
  if (nearbyCities) {
    nearbyCities.slice(0, 3).forEach(nearbyCity => {
      links.push({
        title: `Empregos em ${nearbyCity}`,
        href: `/cidade/${nearbyCity.toLowerCase().replace(/\s+/g, '-')}`,
        description: `Mercado de trabalho em ${nearbyCity}`,
        category: 'Cidades Próximas'
      });
    });
  }

  return links;
};

export const generateGuideRelatedLinks = (
  currentTopic: string,
  allTopics?: string[]
): RelatedLink[] => {
  const links: RelatedLink[] = [];

  // Add related guide topics
  if (allTopics) {
    allTopics
      .filter(topic => topic !== currentTopic)
      .slice(0, 4)
      .forEach(topic => {
        links.push({
          title: topic.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' '),
          href: `/guia/${topic}`,
          description: `Aprenda mais sobre ${topic.replace(/-/g, ' ')}`,
          category: 'Outros Guias'
        });
      });
  }

  // Add tool link
  links.push({
    title: 'Criar Carta de Apresentação',
    href: '/',
    description: 'Use nossa ferramenta AI para criar sua carta personalizada',
    category: 'Ferramenta'
  });

  return links;
};

export default RelatedContent;
