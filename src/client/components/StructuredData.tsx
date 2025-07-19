import React from 'react';
import { Helmet } from 'react-helmet-async';

// Base structured data interfaces
interface BaseStructuredData {
  '@context': string;
  '@type': string;
}

interface WebPageData extends BaseStructuredData {
  '@type': 'WebPage';
  name: string;
  description: string;
  url: string;
  inLanguage: string;
  isPartOf: {
    '@type': 'WebSite';
    name: string;
    url: string;
  };
  breadcrumb?: BreadcrumbListData;
}

interface JobPostingData extends BaseStructuredData {
  '@type': 'JobPosting';
  title: string;
  description: string;
  hiringOrganization: {
    '@type': 'Organization';
    name: string;
    sameAs: string;
  };
  jobLocation: {
    '@type': 'Place';
    address: {
      '@type': 'PostalAddress';
      addressCountry: string;
      addressLocality?: string;
    };
  };
  employmentType: string;
  industry: string;
  skills?: string[];
  baseSalary?: {
    '@type': 'MonetaryAmount';
    currency: string;
    value: {
      '@type': 'QuantitativeValue';
      minValue: number;
      maxValue: number;
      unitText: string;
    };
  };
}

interface LocalBusinessData extends BaseStructuredData {
  '@type': 'LocalBusiness';
  name: string;
  description: string;
  address: {
    '@type': 'PostalAddress';
    addressCountry: string;
    addressLocality: string;
    addressRegion?: string;
  };
  geo?: {
    '@type': 'GeoCoordinates';
    latitude: number;
    longitude: number;
  };
  url: string;
  sameAs?: string[];
}

interface HowToData extends BaseStructuredData {
  '@type': 'HowTo';
  name: string;
  description: string;
  image?: string[];
  estimatedCost?: {
    '@type': 'MonetaryAmount';
    currency: string;
    value: string;
  };
  supply?: string[];
  tool?: string[];
  step: Array<{
    '@type': 'HowToStep';
    name: string;
    text: string;
    image?: string;
    url?: string;
  }>;
  totalTime?: string;
  yield?: string;
}

interface BreadcrumbListData extends BaseStructuredData {
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item?: string;
  }>;
}

interface FAQData extends BaseStructuredData {
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }>;
}

interface OrganizationData extends BaseStructuredData {
  '@type': 'Organization';
  name: string;
  url: string;
  logo: string;
  description: string;
  contactPoint: {
    '@type': 'ContactPoint';
    contactType: string;
    email?: string;
    url?: string;
  };
  sameAs: string[];
  foundingDate?: string;
  address?: {
    '@type': 'PostalAddress';
    addressCountry: string;
    addressLocality?: string;
  };
}

// Props interface
interface StructuredDataProps {
  data: 
    | WebPageData 
    | JobPostingData 
    | LocalBusinessData 
    | HowToData 
    | BreadcrumbListData 
    | FAQData 
    | OrganizationData
    | Array<WebPageData | JobPostingData | LocalBusinessData | HowToData | BreadcrumbListData | FAQData | OrganizationData>;
}

const StructuredData: React.FC<StructuredDataProps> = ({ data }) => {
  const jsonLd = Array.isArray(data) ? data : [data];
  
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(jsonLd, null, 2)}
      </script>
    </Helmet>
  );
};

// Helper functions to create structured data
export const createWebPageData = (
  name: string,
  description: string,
  url: string,
  breadcrumb?: BreadcrumbListData
): WebPageData => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name,
  description,
  url,
  inLanguage: 'pt-PT',
  isPartOf: {
    '@type': 'WebSite',
    name: 'Carta de Apresentação.pt',
    url: 'https://cartadeapresentacao.pt'
  },
  ...(breadcrumb && { breadcrumb })
});

export const createJobPostingData = (
  title: string,
  description: string,
  city?: string,
  industry?: string,
  skills?: string[],
  salaryMin?: number,
  salaryMax?: number
): JobPostingData => ({
  '@context': 'https://schema.org',
  '@type': 'JobPosting',
  title,
  description,
  hiringOrganization: {
    '@type': 'Organization',
    name: 'Carta de Apresentação.pt',
    sameAs: 'https://cartadeapresentacao.pt'
  },
  jobLocation: {
    '@type': 'Place',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'PT',
      ...(city && { addressLocality: city })
    }
  },
  employmentType: 'FULL_TIME',
  industry: industry || 'General',
  ...(skills && { skills }),
  ...(salaryMin && salaryMax && {
    baseSalary: {
      '@type': 'MonetaryAmount',
      currency: 'EUR',
      value: {
        '@type': 'QuantitativeValue',
        minValue: salaryMin,
        maxValue: salaryMax,
        unitText: 'YEAR'
      }
    }
  })
});

export const createLocalBusinessData = (
  name: string,
  description: string,
  city: string,
  url: string,
  region?: string
): LocalBusinessData => ({
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name,
  description,
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'PT',
    addressLocality: city,
    ...(region && { addressRegion: region })
  },
  url,
  sameAs: ['https://cartadeapresentacao.pt']
});

export const createHowToData = (
  name: string,
  description: string,
  steps: Array<{ name: string; text: string; image?: string }>,
  estimatedTime?: string
): HowToData => ({
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name,
  description,
  step: steps.map((step, index) => ({
    '@type': 'HowToStep',
    name: step.name,
    text: step.text,
    ...(step.image && { image: step.image })
  })),
  ...(estimatedTime && { totalTime: estimatedTime })
});

export const createBreadcrumbData = (
  breadcrumbs: Array<{ name: string; url?: string }>
): BreadcrumbListData => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: breadcrumbs.map((crumb, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: crumb.name,
    ...(crumb.url && { item: crumb.url })
  }))
});

export const createFAQData = (
  faqs: Array<{ question: string; answer: string }>
): FAQData => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer
    }
  }))
});

export const createOrganizationData = (): OrganizationData => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Carta de Apresentação.pt',
  url: 'https://cartadeapresentacao.pt',
  logo: 'https://cartadeapresentacao.pt/images/logo.png',
  description: 'A ferramenta mais avançada para criar cartas de apresentação profissionais em Portugal. Powered by AI, designed for success.',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    url: 'https://cartadeapresentacao.pt/contact'
  },
  sameAs: [
    'https://www.linkedin.com/company/cartadeapresentacao',
    'https://twitter.com/cartadeapresentacao'
  ],
  foundingDate: '2024',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'PT'
  }
});

export default StructuredData;
