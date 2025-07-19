export const templatesData = [
  // 1. Profession-specific pages
  {
    id: 1,
    category: "profession",
    subcategory: "main",
    name: "Página Principal de Profissão",
    title: "Carta de Apresentação para {profession} | Exemplos e Dicas 2024",
    metaDescription: "Crie uma carta de apresentação profissional para {profession}. Exemplos práticos, dicas especializadas e templates gratuitos para conseguir o emprego dos seus sonhos.",
    h1: "Carta de Apresentação para {profession}",
    contentStructure: {
      introduction: "Uma carta de apresentação bem elaborada é essencial para profissionais de {profession} que procuram destacar-se no mercado de trabalho português.",
      mainSections: [
        "Competências essenciais para {profession}",
        "Estrutura ideal da carta",
        "Dicas específicas do sector",
        "Exemplo prático",
        "Erros comuns a evitar",
        "Salário médio em Portugal"
      ],
      cta: "Crie a sua carta de apresentação personalizada para {profession}"
    },
    keywords: ["carta apresentação {profession}", "emprego {profession}", "candidatura {profession}", "CV {profession}", "trabalho {profession}"],
    targetUrl: "/profissao/{profession-slug}"
  },

  // 2. City-specific pages
  {
    id: 2,
    category: "city",
    subcategory: "main",
    name: "Página Principal de Cidade",
    title: "Cartas de Apresentação em {city} | Oportunidades de Emprego 2024",
    metaDescription: "Encontre as melhores oportunidades de emprego em {city}. Guia completo para criar cartas de apresentação adaptadas ao mercado de trabalho local.",
    h1: "Oportunidades de Emprego em {city}",
    contentStructure: {
      introduction: "Procura emprego em {city}? Descubra como criar cartas de apresentação que se destacam no mercado de trabalho local.",
      mainSections: [
        "Mercado de trabalho em {city}",
        "Principais sectores económicos",
        "Empresas em destaque",
        "Dicas para candidaturas locais",
        "Salários médios na região",
        "Recursos de networking"
      ],
      cta: "Crie a sua carta de apresentação para {city}"
    },
    keywords: ["emprego {city}", "trabalho {city}", "cartas apresentação {city}", "oportunidades {city}", "mercado trabalho {city}"],
    targetUrl: "/cidade/{city-slug}"
  },

  // 3. Combined profession + city pages
  {
    id: 3,
    category: "profession-city",
    subcategory: "combined",
    name: "Página Combinada Profissão + Cidade",
    title: "Emprego de {profession} em {city} | Carta de Apresentação 2024",
    metaDescription: "Procura emprego como {profession} em {city}? Guia especializado com exemplos de cartas de apresentação e dicas para o mercado local.",
    h1: "Emprego de {profession} em {city}",
    contentStructure: {
      introduction: "Procura oportunidades como {profession} em {city}? Descubra o mercado local e como criar uma carta de apresentação eficaz.",
      mainSections: [
        "Panorama para {profession} em {city}",
        "Competências mais procuradas",
        "Principais empregadores",
        "Salários e condições",
        "Estratégia de candidatura",
        "Exemplo de carta personalizada"
      ],
      cta: "Comece a sua procura como {profession} em {city}"
    },
    keywords: ["emprego {profession} {city}", "{profession} {city}", "trabalho {profession} {city}", "salário {profession} {city}"],
    targetUrl: "/profissao/{profession-slug}/cidade/{city-slug}"
  },

  // 4. How-to guides
  {
    id: 4,
    category: "guide",
    subcategory: "how-to",
    name: "Guia Como Escrever",
    title: "Como Escrever uma Carta de Apresentação | Guia Completo 2024",
    metaDescription: "Guia passo-a-passo para escrever cartas de apresentação eficazes. Estrutura, exemplos e dicas de especialistas para conseguir mais entrevistas.",
    h1: "Como Escrever uma Carta de Apresentação Perfeita",
    contentStructure: {
      introduction: "Uma carta de apresentação bem escrita pode ser o factor decisivo para conseguir uma entrevista. Aprenda a criar cartas que impressionam.",
      mainSections: [
        "Estrutura da carta ideal",
        "Parágrafo de abertura impactante",
        "Como destacar competências",
        "Personalização para cada empresa",
        "Erros fatais a evitar",
        "Checklist final"
      ],
      cta: "Comece a escrever a sua carta agora"
    },
    keywords: ["como escrever carta apresentação", "guia carta apresentação", "estrutura carta apresentação", "dicas carta apresentação"],
    targetUrl: "/guia/como-escrever-carta-apresentacao"
  },

  // 5. Templates and examples
  {
    id: 5,
    category: "template",
    subcategory: "examples",
    name: "Modelos e Exemplos",
    title: "Modelos de Carta de Apresentação Gratuitos | Templates 2024",
    metaDescription: "Modelos gratuitos de cartas de apresentação para diferentes profissões. Templates editáveis e exemplos práticos para download.",
    h1: "Modelos Gratuitos de Carta de Apresentação",
    contentStructure: {
      introduction: "Encontre o modelo perfeito para a sua carta de apresentação. Templates profissionais e personalizáveis para todas as áreas.",
      mainSections: [
        "Modelos por profissão",
        "Templates por nível de experiência",
        "Exemplos de sucesso",
        "Como personalizar templates",
        "Formatos disponíveis",
        "Dicas de design"
      ],
      cta: "Descarregue o seu template gratuito"
    },
    keywords: ["modelos carta apresentação", "templates carta apresentação", "exemplos carta apresentação", "carta apresentação grátis"],
    targetUrl: "/modelos"
  },

  // 6. Entry-level/recent graduates
  {
    id: 6,
    category: "experience-level",
    subcategory: "entry-level",
    name: "Recém-Licenciados",
    title: "Carta de Apresentação para Recém-Licenciados | Guia 2024",
    metaDescription: "Guia especializado para recém-licenciados criarem cartas de apresentação eficazes. Como destacar potencial quando falta experiência profissional.",
    h1: "Carta de Apresentação para Recém-Licenciados",
    contentStructure: {
      introduction: "Recém-licenciado e à procura do primeiro emprego? Aprenda a criar uma carta que destaque o seu potencial e formação académica.",
      mainSections: [
        "Como compensar falta de experiência",
        "Destacar projectos académicos",
        "Valorizar estágios e voluntariado",
        "Demonstrar motivação e potencial",
        "Exemplos para diferentes áreas",
        "Dicas para primeira entrevista"
      ],
      cta: "Crie a sua primeira carta profissional"
    },
    keywords: ["carta apresentação recém licenciado", "primeiro emprego", "carta apresentação sem experiência", "recém graduado"],
    targetUrl: "/guia/recem-licenciados"
  },

  // 7. Career change
  {
    id: 7,
    category: "experience-level",
    subcategory: "career-change",
    name: "Mudança de Carreira",
    title: "Carta de Apresentação para Mudança de Carreira | Guia 2024",
    metaDescription: "Quer mudar de carreira? Aprenda a criar cartas de apresentação que destacam competências transferíveis e justificam a mudança profissional.",
    h1: "Carta de Apresentação para Mudança de Carreira",
    contentStructure: {
      introduction: "Planeia uma mudança de carreira? Descubra como criar uma carta convincente que demonstre o valor das suas competências transferíveis.",
      mainSections: [
        "Como justificar a mudança",
        "Identificar competências transferíveis",
        "Demonstrar conhecimento da nova área",
        "Abordar lacunas de experiência",
        "Exemplos de transições bem-sucedidas",
        "Preparação para entrevistas"
      ],
      cta: "Inicie a sua mudança de carreira"
    },
    keywords: ["mudança de carreira", "carta apresentação mudança profissional", "competências transferíveis", "transição carreira"],
    targetUrl: "/guia/mudanca-carreira"
  },

  // 8. Remote work
  {
    id: 8,
    category: "work-type",
    subcategory: "remote",
    name: "Trabalho Remoto",
    title: "Carta de Apresentação para Trabalho Remoto | Guia 2024",
    metaDescription: "Procura trabalho remoto? Aprenda a criar cartas de apresentação que destacam as suas competências para trabalho à distância.",
    h1: "Carta de Apresentação para Trabalho Remoto",
    contentStructure: {
      introduction: "O trabalho remoto está em crescimento. Aprenda a criar cartas que demonstram a sua capacidade de trabalhar eficazmente à distância.",
      mainSections: [
        "Competências essenciais para remote work",
        "Como demonstrar autodisciplina",
        "Ferramentas e tecnologias",
        "Comunicação eficaz à distância",
        "Exemplos para diferentes profissões",
        "Dicas para entrevistas online"
      ],
      cta: "Encontre o seu trabalho remoto ideal"
    },
    keywords: ["trabalho remoto", "carta apresentação remote work", "trabalho à distância", "teletrabalho"],
    targetUrl: "/guia/trabalho-remoto"
  },

  // 9. Internships
  {
    id: 9,
    category: "experience-level",
    subcategory: "internship",
    name: "Estágios",
    title: "Carta de Apresentação para Estágios | Guia Estudantes 2024",
    metaDescription: "Procura um estágio? Guia completo para estudantes criarem cartas de apresentação que conseguem oportunidades de estágio.",
    h1: "Carta de Apresentação para Estágios",
    contentStructure: {
      introduction: "À procura de um estágio? Aprenda a criar uma carta que demonstre o seu entusiasmo e potencial de aprendizagem.",
      mainSections: [
        "Objectivos claros do estágio",
        "Como destacar formação académica",
        "Demonstrar motivação para aprender",
        "Projectos e actividades relevantes",
        "Exemplos por área de estudo",
        "Preparação para processo selectivo"
      ],
      cta: "Consiga o seu estágio ideal"
    },
    keywords: ["carta apresentação estágio", "estágio", "carta motivação estágio", "candidatura estágio"],
    targetUrl: "/guia/estagios"
  },

  // 10. Senior/Executive positions
  {
    id: 10,
    category: "experience-level",
    subcategory: "senior",
    name: "Posições Sénior",
    title: "Carta de Apresentação para Cargos Sénior | Executivos 2024",
    metaDescription: "Candidata-se a posições de liderança? Guia especializado para executivos criarem cartas de apresentação que demonstram liderança e resultados.",
    h1: "Carta de Apresentação para Cargos Sénior",
    contentStructure: {
      introduction: "Candidatura a posições de liderança requer uma abordagem diferente. Aprenda a criar cartas que demonstram liderança e visão estratégica.",
      mainSections: [
        "Demonstrar liderança e visão",
        "Quantificar resultados e impacto",
        "Estratégia e transformação",
        "Gestão de equipas e stakeholders",
        "Exemplos para C-level",
        "Preparação para executive search"
      ],
      cta: "Avance para o próximo nível da sua carreira"
    },
    keywords: ["carta apresentação executivo", "cargos sénior", "posições liderança", "executive search"],
    targetUrl: "/guia/cargos-senior"
  }
];

// Helper function to generate dynamic content
export const generatePageContent = (template: any, variables: any) => {
  let content = template.contentStructure.introduction;
  
  // Replace variables in content
  Object.keys(variables).forEach(key => {
    const placeholder = `{${key}}`;
    content = content.replace(new RegExp(placeholder, 'g'), variables[key]);
  });
  
  return {
    title: template.title.replace(/{(\w+)}/g, (match: string, key: string) => variables[key] || match),
    metaDescription: template.metaDescription.replace(/{(\w+)}/g, (match: string, key: string) => variables[key] || match),
    h1: template.h1.replace(/{(\w+)}/g, (match: string, key: string) => variables[key] || match),
    content: content,
    sections: template.contentStructure.mainSections,
    cta: template.contentStructure.cta.replace(/{(\w+)}/g, (match: string, key: string) => variables[key] || match),
    keywords: template.keywords.map((keyword: string) => 
      keyword.replace(/{(\w+)}/g, (match: string, key: string) => variables[key] || match)
    )
  };
};

// SEO page types for programmatic generation
export const seoPageTypes = {
  profession: {
    template: templatesData[0],
    urlPattern: "/profissao/{slug}",
    variables: ["profession", "skills", "salary"]
  },
  city: {
    template: templatesData[1],
    urlPattern: "/cidade/{slug}",
    variables: ["city", "population", "mainSectors"]
  },
  professionCity: {
    template: templatesData[2],
    urlPattern: "/profissao/{professionSlug}/cidade/{citySlug}",
    variables: ["profession", "city", "salary", "skills"]
  },
  guides: {
    templates: [templatesData[3], templatesData[5], templatesData[6], templatesData[7], templatesData[8], templatesData[9]],
    urlPattern: "/guia/{slug}",
    variables: ["topic", "audience"]
  }
};

export default templatesData;
