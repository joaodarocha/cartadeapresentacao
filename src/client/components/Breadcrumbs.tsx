import React from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  separator?: React.ReactNode;
  showHome?: boolean;
  homeLabel?: string;
  homeHref?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  className = '',
  separator,
  showHome = true,
  homeLabel = 'Início',
  homeHref = '/'
}) => {
  // Add home breadcrumb if enabled
  const allItems = showHome 
    ? [{ label: homeLabel, href: homeHref }, ...items]
    : items;

  // Default separator
  const defaultSeparator = (
    <svg 
      className="w-4 h-4 text-gray-400" 
      fill="currentColor" 
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
    </svg>
  );

  const separatorElement = separator || defaultSeparator;

  return (
    <nav 
      className={`flex ${className}`} 
      aria-label="Breadcrumb"
    >
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          const isActive = item.isActive || isLast;

          return (
            <li key={index} className="inline-flex items-center">
              {/* Separator (not shown for first item) */}
              {index > 0 && (
                <span className="mx-2 text-gray-400" aria-hidden="true">
                  {separatorElement}
                </span>
              )}

              {/* Breadcrumb item */}
              {item.href && !isActive ? (
                <a
                  href={item.href}
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
                  {...(index === 0 && showHome && {
                    'aria-label': 'Voltar ao início'
                  })}
                >
                  {/* Home icon for first item */}
                  {index === 0 && showHome && (
                    <svg 
                      className="w-4 h-4 mr-2" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                  )}
                  {item.label}
                </a>
              ) : (
                <span 
                  className={`inline-flex items-center text-sm font-medium ${
                    isActive 
                      ? 'text-gray-500 cursor-default' 
                      : 'text-gray-700'
                  }`}
                  {...(isActive && { 'aria-current': 'page' })}
                >
                  {/* Home icon for first item */}
                  {index === 0 && showHome && (
                    <svg 
                      className="w-4 h-4 mr-2" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                  )}
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

// Helper function to generate breadcrumbs from URL path
export const generateBreadcrumbsFromPath = (
  pathname: string,
  customLabels?: Record<string, string>
): BreadcrumbItem[] => {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  let currentPath = '';
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;
    
    // Use custom label if provided, otherwise format the segment
    const label = customLabels?.[segment] || 
      segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    
    breadcrumbs.push({
      label,
      href: isLast ? undefined : currentPath,
      isActive: isLast
    });
  });

  return breadcrumbs;
};

// Helper function for common SEO page breadcrumbs
export const createSeoBreadcrumbs = (
  pageType: 'profession' | 'city' | 'sector' | 'guide' | 'city-profession',
  params: {
    profession?: string;
    city?: string;
    sector?: string;
    topic?: string;
  }
): BreadcrumbItem[] => {
  const breadcrumbs: BreadcrumbItem[] = [];

  switch (pageType) {
    case 'profession':
      breadcrumbs.push(
        { label: 'Profissões', href: '/profissoes' },
        { 
          label: params.profession?.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ') || 'Profissão'
        }
      );
      break;

    case 'city':
      breadcrumbs.push(
        { label: 'Cidades', href: '/cidades' },
        { 
          label: params.city?.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ') || 'Cidade'
        }
      );
      break;

    case 'sector':
      breadcrumbs.push(
        { label: 'Sectores', href: '/sectores' },
        { 
          label: params.sector?.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ') || 'Sector'
        }
      );
      break;

    case 'guide':
      breadcrumbs.push(
        { label: 'Guias', href: '/guias' },
        { 
          label: params.topic?.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ') || 'Guia'
        }
      );
      break;

    case 'city-profession':
      const cityName = params.city?.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ') || 'Cidade';
      
      const professionName = params.profession?.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ') || 'Profissão';

      breadcrumbs.push(
        { label: 'Cidades', href: '/cidades' },
        { label: cityName, href: `/cidade/${params.city}` },
        { label: professionName }
      );
      break;

    default:
      break;
  }

  return breadcrumbs;
};

export default Breadcrumbs;
