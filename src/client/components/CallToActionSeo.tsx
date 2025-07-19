import React from 'react';

interface CallToActionSeoProps {
  variant?: 'primary' | 'secondary' | 'minimal' | 'banner' | 'inline';
  title?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
  profession?: string;
  city?: string;
  className?: string;
  showFeatures?: boolean;
  showTestimonial?: boolean;
}

const CallToActionSeo: React.FC<CallToActionSeoProps> = ({
  variant = 'primary',
  title,
  description,
  buttonText = 'Criar Carta de Apresentação',
  buttonHref = '/',
  profession,
  city,
  className = '',
  showFeatures = false,
  showTestimonial = false
}) => {
  // Generate dynamic content based on profession/city
  const generateDynamicContent = () => {
    if (profession && city) {
      return {
        title: title || `Destaque-se como ${profession} em ${city}`,
        description: description || `Crie uma carta de apresentação personalizada para ${profession} em ${city}. Nossa IA analisa o mercado local e cria conteúdo otimizado para aumentar suas chances de sucesso.`
      };
    } else if (profession) {
      return {
        title: title || `Carta de Apresentação para ${profession}`,
        description: description || `Crie uma carta de apresentação profissional para ${profession}. Nossa ferramenta AI gera conteúdo personalizado baseado nas melhores práticas da indústria.`
      };
    } else if (city) {
      return {
        title: title || `Encontre Emprego em ${city}`,
        description: description || `Destaque-se no mercado de trabalho em ${city} com uma carta de apresentação personalizada. Nossa IA conhece as preferências dos empregadores locais.`
      };
    } else {
      return {
        title: title || 'Crie Sua Carta de Apresentação Perfeita',
        description: description || 'Nossa ferramenta AI cria cartas de apresentação personalizadas que destacam suas competências e aumentam suas chances de conseguir o emprego dos seus sonhos.'
      };
    }
  };

  const { title: dynamicTitle, description: dynamicDescription } = generateDynamicContent();

  const features = [
    'Personalização com IA',
    'Modelos profissionais',
    'Otimizado para ATS',
    'Suporte em português'
  ];

  const testimonial = {
    text: "Consegui 3 entrevistas na primeira semana após usar esta ferramenta!",
    author: "Maria S.",
    role: profession || "Profissional"
  };

  // Render based on variant
  switch (variant) {
    case 'banner':
      return (
        <div className={`bg-gradient-to-r from-blue-600 to-blue-700 text-white py-8 px-6 rounded-lg ${className}`}>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{dynamicTitle}</h2>
            <p className="text-blue-100 mb-6 text-lg">{dynamicDescription}</p>
            <a
              href={buttonHref}
              className="inline-flex items-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-lg"
            >
              {buttonText}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      );

    case 'minimal':
      return (
        <div className={`text-center py-6 ${className}`}>
          <p className="text-gray-600 mb-4">{dynamicDescription}</p>
          <a
            href={buttonHref}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            {buttonText}
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      );

    case 'inline':
      return (
        <div className={`bg-blue-50 border-l-4 border-blue-400 p-4 my-6 ${className}`}>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm text-blue-700">
                <strong>Dica:</strong> {dynamicDescription}
              </p>
              <div className="mt-2">
                <a
                  href={buttonHref}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  {buttonText} →
                </a>
              </div>
            </div>
          </div>
        </div>
      );

    case 'secondary':
      return (
        <div className={`bg-gray-50 border border-gray-200 rounded-lg p-6 ${className}`}>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">{dynamicTitle}</h3>
            <p className="text-gray-600 mb-4">{dynamicDescription}</p>
            <a
              href={buttonHref}
              className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-600 hover:text-white transition-colors duration-200"
            >
              {buttonText}
            </a>
          </div>
        </div>
      );

    default: // primary
      return (
        <div className={`bg-white border border-gray-200 rounded-lg shadow-lg p-8 ${className}`}>
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{dynamicTitle}</h3>
            <p className="text-gray-600 mb-6 text-lg">{dynamicDescription}</p>
            
            {showFeatures && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </div>
                ))}
              </div>
            )}
            
            {showTestimonial && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-gray-700 italic mb-2">"{testimonial.text}"</p>
                <p className="text-sm text-gray-500">— {testimonial.author}, {testimonial.role}</p>
              </div>
            )}
            
            <a
              href={buttonHref}
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg"
            >
              {buttonText}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            
            <p className="text-xs text-gray-500 mt-4">
              Gratuito para começar • Sem cartão de crédito necessário
            </p>
          </div>
        </div>
      );
  }
};

// Helper function to generate contextual CTAs
export const generateContextualCTA = (
  pageType: 'profession' | 'city' | 'guide' | 'sector',
  params: {
    profession?: string;
    city?: string;
    topic?: string;
    sector?: string;
  }
): CallToActionSeoProps => {
  switch (pageType) {
    case 'profession':
      return {
        variant: 'primary',
        profession: params.profession,
        showFeatures: true,
        buttonText: `Criar Carta para ${params.profession}`
      };

    case 'city':
      return {
        variant: 'banner',
        city: params.city,
        showTestimonial: true,
        buttonText: `Encontrar Emprego em ${params.city}`
      };

    case 'guide':
      return {
        variant: 'secondary',
        title: 'Pronto para Aplicar o que Aprendeu?',
        description: 'Use nossa ferramenta AI para criar uma carta de apresentação profissional baseada nas melhores práticas que acabou de descobrir.',
        buttonText: 'Criar Minha Carta'
      };

    case 'sector':
      return {
        variant: 'primary',
        title: `Destaque-se no Sector ${params.sector}`,
        description: `Crie uma carta de apresentação otimizada para o sector ${params.sector}. Nossa IA conhece as expectativas específicas desta indústria.`,
        showFeatures: true
      };

    default:
      return {
        variant: 'primary'
      };
  }
};

export default CallToActionSeo;
