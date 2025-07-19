/**
 * Content Generation System for Portuguese SEO Pages
 * Generates localized, SEO-optimized content for different page types
 */

// ===== CONTENT TEMPLATES =====

const CONTENT_VARIATIONS = {
  introductions: [
    'Uma carta de apresentação bem elaborada é fundamental para',
    'Destacar-se no mercado de trabalho português requer uma carta de apresentação profissional para',
    'Para conseguir o emprego dos seus sonhos como',
    'O sucesso na procura de emprego em Portugal começa com uma carta de apresentação eficaz para',
    'Profissionais de {profession} que procuram oportunidades em Portugal precisam de uma carta de apresentação que'
  ],
  
  closings: [
    'Crie hoje mesmo a sua carta de apresentação personalizada e destaque-se da concorrência.',
    'Não perca mais oportunidades - comece já a criar a sua carta de apresentação profissional.',
    'Invista no seu futuro profissional com uma carta de apresentação que realmente funciona.',
    'Transforme a sua procura de emprego com uma carta de apresentação que impressiona recrutadores.',
    'Dê o próximo passo na sua carreira com uma carta de apresentação que abre portas.'
  ],

  benefits: [
    'Aumenta as suas hipóteses de ser chamado para entrevista',
    'Destaca as suas competências mais relevantes',
    'Demonstra o seu interesse genuíno na posição',
    'Personaliza a sua candidatura para cada empresa',
    'Mostra o seu conhecimento sobre o sector',
    'Evidencia a sua motivação e profissionalismo'
  ],

  tips: [
    'Personalize sempre a carta para cada candidatura',
    'Destaque as competências mais relevantes para a posição',
    'Use uma linguagem profissional mas acessível',
    'Mantenha um tom positivo e confiante',
    'Seja específico sobre as suas conquistas',
    'Revise cuidadosamente antes de enviar'
  ]
};

const PORTUGUESE_CONNECTORS = [
  'além disso', 'por outro lado', 'desta forma', 'assim sendo', 'por conseguinte',
  'neste sentido', 'de facto', 'com efeito', 'por sua vez', 'em suma'
];

// ===== MAIN CONTENT GENERATORS =====

/**
 * Generate industry-specific content
 */
export function generateIndustryContent(industry, template) {
  const variations = getContentVariations();
  
  const content = {
    title: generateIndustryTitle(industry, variations),
    introduction: generateIndustryIntroduction(industry, variations),
    mainContent: generateIndustryMainContent(industry, variations),
    skillsSection: generateSkillsSection(industry, variations),
    salarySection: generateSalarySection(industry, variations),
    tipsSection: generateTipsSection(industry, variations),
    conclusion: generateConclusion(industry, variations),
    faq: generateIndustryFAQ(industry)
  };

  return assembleContent(content, template);
}

/**
 * Generate city-specific content
 */
export function generateCityContent(city, template) {
  const variations = getContentVariations();
  
  const content = {
    title: generateCityTitle(city, variations),
    introduction: generateCityIntroduction(city, variations),
    mainContent: generateCityMainContent(city, variations),
    marketSection: generateMarketSection(city, variations),
    opportunitiesSection: generateOpportunitiesSection(city, variations),
    tipsSection: generateCityTipsSection(city, variations),
    conclusion: generateConclusion(city, variations),
    faq: generateCityFAQ(city)
  };

  return assembleContent(content, template);
}

/**
 * Generate combined profession + city content
 */
export function generateCombinedContent(industry, city, template) {
  const variations = getContentVariations();
  
  const content = {
    title: generateCombinedTitle(industry, city, variations),
    introduction: generateCombinedIntroduction(industry, city, variations),
    mainContent: generateCombinedMainContent(industry, city, variations),
    localMarketSection: generateLocalMarketSection(industry, city, variations),
    skillsSection: generateSkillsSection(industry, variations),
    salarySection: generateLocalSalarySection(industry, city, variations),
    tipsSection: generateCombinedTipsSection(industry, city, variations),
    conclusion: generateCombinedConclusion(industry, city, variations),
    faq: generateCombinedFAQ(industry, city)
  };

  return assembleContent(content, template);
}

/**
 * Generate guide content
 */
export function generateGuideContent(guideType, template) {
  const variations = getContentVariations();
  
  const content = {
    title: generateGuideTitle(guideType, variations),
    introduction: generateGuideIntroduction(guideType, variations),
    stepByStep: generateStepByStepGuide(guideType, variations),
    examples: generateExamples(guideType, variations),
    commonMistakes: generateCommonMistakes(guideType, variations),
    bestPractices: generateBestPractices(guideType, variations),
    conclusion: generateGuideConclusion(guideType, variations),
    faq: generateGuideFAQ(guideType)
  };

  return assembleContent(content, template);
}

// ===== CONTENT SECTION GENERATORS =====

function generateIndustryTitle(industry, variations) {
  const titleVariations = [
    `Carta de Apresentação para ${industry.name} | Modelos e Exemplos 2024`,
    `Como Criar uma Carta de Apresentação para ${industry.name} | Guia Completo`,
    `Carta de Apresentação ${industry.name} | Templates Profissionais`,
    `Modelos de Carta de Apresentação para ${industry.name} | Exemplos Práticos`
  ];
  
  return getRandomItem(titleVariations);
}

function generateIndustryIntroduction(industry, variations) {
  const intro = getRandomItem(CONTENT_VARIATIONS.introductions);
  const connector = getRandomItem(PORTUGUESE_CONNECTORS);
  
  return `${intro.replace('{profession}', industry.name)} destacar-se no competitivo mercado português. ${connector.charAt(0).toUpperCase() + connector.slice(1)}, uma carta bem estruturada pode ser o diferencial que precisa para conseguir a entrevista desejada.`;
}

function generateIndustryMainContent(industry, variations) {
  return `
    <h2>Por que uma Carta de Apresentação é Essencial para ${industry.name}</h2>
    <p>No sector de ${industry.name}, os recrutadores recebem centenas de candidaturas diariamente. Uma carta de apresentação personalizada permite-lhe:</p>
    <ul>
      ${CONTENT_VARIATIONS.benefits.slice(0, 4).map(benefit => `<li>${benefit}</li>`).join('')}
    </ul>
    
    <h2>Estrutura Ideal para ${industry.name}</h2>
    <p>Uma carta de apresentação eficaz para ${industry.name} deve seguir uma estrutura clara e profissional:</p>
    <ol>
      <li><strong>Cabeçalho:</strong> Os seus dados de contacto e os da empresa</li>
      <li><strong>Saudação:</strong> Dirija-se diretamente ao responsável pelo recrutamento</li>
      <li><strong>Introdução:</strong> Mencione a posição e como soube da oportunidade</li>
      <li><strong>Corpo:</strong> Destaque as suas competências relevantes para ${industry.name}</li>
      <li><strong>Conclusão:</strong> Reforce o seu interesse e solicite uma entrevista</li>
      <li><strong>Despedida:</strong> Termine de forma profissional</li>
    </ol>
  `;
}

function generateSkillsSection(industry, variations) {
  const skills = industry.skills || [];
  const skillsText = skills.length > 0 ? skills.slice(0, 6).join(', ') : 'competências técnicas e interpessoais relevantes';
  
  return `
    <h2>Competências Essenciais para ${industry.name}</h2>
    <p>Ao candidatar-se a uma posição em ${industry.name}, é crucial destacar as seguintes competências:</p>
    <p><strong>Competências técnicas:</strong> ${skillsText}</p>
    <p><strong>Competências interpessoais:</strong> Comunicação eficaz, trabalho em equipa, resolução de problemas, adaptabilidade e liderança.</p>
  `;
}

function generateSalarySection(industry, variations) {
  const salary = industry.salary || 'Salário competitivo conforme experiência';
  
  return `
    <h2>Perspetivas Salariais em ${industry.name}</h2>
    <p>Em Portugal, profissionais de ${industry.name} podem esperar: ${salary}</p>
    <p>Estes valores podem variar significativamente com base na experiência, localização e dimensão da empresa.</p>
  `;
}

function generateTipsSection(industry, variations) {
  const tips = CONTENT_VARIATIONS.tips.slice(0, 4);
  
  return `
    <h2>Dicas Específicas para ${industry.name}</h2>
    <ul>
      ${tips.map(tip => `<li>${tip}</li>`).join('')}
      <li>Mencione projetos ou conquistas específicas em ${industry.name}</li>
      <li>Demonstre conhecimento sobre as tendências do sector</li>
    </ul>
  `;
}

function generateCityTitle(city, variations) {
  const titleVariations = [
    `Carta de Apresentação em ${city.name} | Oportunidades de Emprego 2024`,
    `Como Encontrar Emprego em ${city.name} | Guia de Cartas de Apresentação`,
    `Trabalhar em ${city.name} | Modelos de Carta de Apresentação`,
    `Oportunidades de Carreira em ${city.name} | Templates Profissionais`
  ];
  
  return getRandomItem(titleVariations);
}

function generateCityIntroduction(city, variations) {
  const population = city.population ? city.population.toLocaleString('pt-PT') : 'milhares de';
  
  return `${city.name}, com ${population} habitantes, oferece excelentes oportunidades de carreira em diversos sectores. Uma carta de apresentação bem elaborada é essencial para se destacar no mercado de trabalho local e conseguir a posição desejada.`;
}

function generateCityMainContent(city, variations) {
  return `
    <h2>Mercado de Trabalho em ${city.name}</h2>
    <p>${city.name} é um centro económico importante em Portugal, oferecendo oportunidades em diversos sectores. ${city.description || 'A cidade destaca-se pelo seu dinamismo económico e qualidade de vida.'}</p>
    
    <h2>Sectores em Crescimento</h2>
    <p>Os principais sectores com oportunidades em ${city.name} incluem:</p>
    <ul>
      <li>Tecnologia e inovação</li>
      <li>Serviços financeiros</li>
      <li>Turismo e hotelaria</li>
      <li>Comércio e retalho</li>
      <li>Saúde e serviços sociais</li>
    </ul>
  `;
}

function generateCombinedTitle(industry, city, variations) {
  const titleVariations = [
    `Carta de Apresentação para ${industry.name} em ${city.name} | Guia 2024`,
    `${industry.name} em ${city.name} | Como Criar a Carta Perfeita`,
    `Trabalhar como ${industry.name} em ${city.name} | Modelos de Carta`,
    `Oportunidades ${industry.name} em ${city.name} | Templates Profissionais`
  ];
  
  return getRandomItem(titleVariations);
}

function generateCombinedIntroduction(industry, city, variations) {
  return `Procura uma oportunidade como ${industry.name} em ${city.name}? Uma carta de apresentação personalizada é fundamental para se destacar no mercado local e impressionar os recrutadores da região.`;
}

function generateCombinedMainContent(industry, city, variations) {
  return `
    <h2>${industry.name} em ${city.name}: Panorama do Mercado</h2>
    <p>O sector de ${industry.name} em ${city.name} oferece excelentes perspetivas para profissionais qualificados. A cidade destaca-se como um centro importante para esta área, com empresas de referência e oportunidades de crescimento.</p>
    
    <h2>Vantagens de Trabalhar em ${city.name}</h2>
    <ul>
      <li>Mercado dinâmico e em crescimento</li>
      <li>Proximidade a centros de decisão</li>
      <li>Qualidade de vida elevada</li>
      <li>Rede de transportes eficiente</li>
      <li>Comunidade profissional ativa</li>
    </ul>
  `;
}

function generateIndustryFAQ(industry) {
  return `
    <h2>Perguntas Frequentes</h2>
    <h3>Quanto tempo deve ter uma carta de apresentação para ${industry.name}?</h3>
    <p>Uma carta de apresentação deve ter entre 250 a 400 palavras, ocupando no máximo uma página.</p>
    
    <h3>Devo mencionar o salário pretendido?</h3>
    <p>Apenas se for especificamente solicitado no anúncio de emprego. Caso contrário, deixe esta discussão para a entrevista.</p>
    
    <h3>Como personalizar a carta para cada empresa?</h3>
    <p>Pesquise sobre a empresa, mencione projetos específicos e adapte as suas competências às necessidades da posição.</p>
  `;
}

function generateCityFAQ(city) {
  return `
    <h2>Perguntas Frequentes</h2>
    <h3>Quais são os melhores sites de emprego para ${city.name}?</h3>
    <p>Net-Empregos, Sapo Emprego, LinkedIn e sites específicos das empresas locais são as melhores opções.</p>
    
    <h3>Como é o custo de vida em ${city.name}?</h3>
    <p>O custo de vida varia, mas ${city.name} oferece um bom equilíbrio entre oportunidades profissionais e qualidade de vida.</p>
    
    <h3>Preciso de conhecer a cultura empresarial local?</h3>
    <p>Sim, demonstrar conhecimento sobre a cultura empresarial de ${city.name} pode ser um diferencial na sua candidatura.</p>
  `;
}

// ===== UTILITY FUNCTIONS =====

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getContentVariations() {
  return {
    connector: getRandomItem(PORTUGUESE_CONNECTORS),
    introduction: getRandomItem(CONTENT_VARIATIONS.introductions),
    closing: getRandomItem(CONTENT_VARIATIONS.closings),
    benefits: shuffleArray([...CONTENT_VARIATIONS.benefits]),
    tips: shuffleArray([...CONTENT_VARIATIONS.tips])
  };
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function assembleContent(contentSections, template) {
  // Combine all content sections into a cohesive HTML structure
  const sections = Object.values(contentSections).filter(section => section && section.trim());
  return sections.join('\n\n');
}

function generateConclusion(entity, variations) {
  const closing = getRandomItem(CONTENT_VARIATIONS.closings);
  return `<h2>Conclusão</h2><p>${closing}</p>`;
}

// ===== EXPORT MAIN FUNCTIONS =====

export {
  generateIndustryContent,
  generateCityContent,
  generateCombinedContent,
  generateGuideContent,
  CONTENT_VARIATIONS,
  PORTUGUESE_CONNECTORS
};
