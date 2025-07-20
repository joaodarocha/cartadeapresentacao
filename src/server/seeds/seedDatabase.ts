import { PrismaClient } from '@prisma/client';
import industriesData from './industries.js';
import citiesData from './cities.js';
import templatesData from './templates.js';

const prisma = new PrismaClient();

async function seedIndustries() {
  console.log('🌱 Seeding industries...');

  for (const industry of industriesData) {
    try {
      await prisma.industry.upsert({
        where: { slug: industry.slug },
        update: {
          name: industry.name,
          description: industry.description,
          salary: industry.salary,
          skills: industry.skills,
          isActive: true,
        },
        create: {
          name: industry.name,
          slug: industry.slug,
          description: industry.description,
          salary: industry.salary,
          skills: industry.skills,
          isActive: true,
        },
      });
      console.log(`✅ Industry: ${industry.name}`);
    } catch (error) {
      console.error(`❌ Error seeding industry ${industry.name}:`, error);
    }
  }

  console.log(`✅ Seeded ${industriesData.length} industries`);
}

async function seedCities() {
  console.log('🌱 Seeding cities...');

  for (const city of citiesData) {
    try {
      await prisma.city.upsert({
        where: { slug: city.slug },
        update: {
          name: city.name,
          district: city.district,
          population: city.population,
          description: city.description,
          isActive: true,
        },
        create: {
          name: city.name,
          slug: city.slug,
          district: city.district,
          population: city.population,
          description: city.description,
          isActive: true,
        },
      });
      console.log(`✅ City: ${city.name}`);
    } catch (error) {
      console.error(`❌ Error seeding city ${city.name}:`, error);
    }
  }

  console.log(`✅ Seeded ${citiesData.length} cities`);
}

async function seedTemplates() {
  console.log('🌱 Seeding SEO templates...');

  for (const template of templatesData) {
    try {
      // Convert contentStructure to a simple HTML template
      const contentTemplate = `
        <div class="seo-content">
          <p>${template.contentStructure.introduction}</p>
          <div class="main-sections">
            ${template.contentStructure.mainSections.map((section: string) => `<h2>${section}</h2>`).join('\n')}
          </div>
          <div class="cta">
            <p><strong>${template.contentStructure.cta}</strong></p>
          </div>
        </div>
      `;

      await prisma.seoTemplate.upsert({
        where: { name: `${template.category}-${template.subcategory}` },
        update: {
          category: template.category,
          titleTemplate: template.title,
          metaTemplate: template.metaDescription,
          contentTemplate: contentTemplate,
          isActive: true,
        },
        create: {
          name: `${template.category}-${template.subcategory}`,
          category: template.category,
          titleTemplate: template.title,
          metaTemplate: template.metaDescription,
          contentTemplate: contentTemplate,
          isActive: true,
        },
      });
      console.log(`✅ Template: ${template.category}-${template.subcategory}`);
    } catch (error) {
      console.error(`❌ Error seeding template ${template.name}:`, error);
    }
  }

  console.log(`✅ Seeded ${templatesData.length} SEO templates`);
}

async function generateInitialSeoPages() {
  console.log('🌱 Generating initial SEO pages...');

  // Get all industries and cities from database
  const allIndustries = await prisma.industry.findMany({ where: { isActive: true } });
  const allCities = await prisma.city.findMany({ where: { isActive: true } });
  const professionTemplate = await prisma.seoTemplate.findFirst({
    where: { name: 'profession-main' }
  });
  const cityTemplate = await prisma.seoTemplate.findFirst({
    where: { name: 'city-main' }
  });
  const combinedTemplate = await prisma.seoTemplate.findFirst({
    where: { name: 'profession-city-combined' }
  });

  let pagesCreated = 0;

  // Generate profession pages
  if (professionTemplate) {
    for (const industry of allIndustries) {
      try {
        const slug = `carta-apresentacao-${industry.slug}`;
        const title = professionTemplate.titleTemplate.replace('{profession}', industry.name);
        const metaDescription = professionTemplate.metaTemplate.replace('{profession}', industry.name);
        const content = professionTemplate.contentTemplate
          .replace(/{profession}/g, industry.name)
          .replace(/{salary}/g, industry.salary || 'Salário competitivo')
          .replace(/{skills}/g, industry.skills.join(', '));

        await prisma.seoPage.upsert({
          where: { slug },
          update: {
            title,
            metaDescription,
            content,
            category: 'profissao',
            subcategory: industry.name,
            keywords: [`carta apresentação ${industry.name.toLowerCase()}`, `modelo carta ${industry.name.toLowerCase()}`, `exemplo carta ${industry.name.toLowerCase()}`],
            industryId: industry.id,
            isActive: true,
          },
          create: {
            slug,
            title,
            metaDescription,
            content,
            category: 'profissao',
            subcategory: industry.name,
            keywords: [`carta apresentação ${industry.name.toLowerCase()}`, `modelo carta ${industry.name.toLowerCase()}`, `exemplo carta ${industry.name.toLowerCase()}`],
            industryId: industry.id,
            isActive: true,
          },
        });

        pagesCreated++;
        console.log(`✅ SEO Page: ${slug}`);
      } catch (error) {
        console.error(`❌ Error creating profession page for ${industry.name}:`, error);
      }
    }
  }

  // Generate city pages
  if (cityTemplate) {
    for (const city of allCities) {
      try {
        const slug = `carta-apresentacao-${city.slug}`;
        const title = cityTemplate.titleTemplate.replace('{city}', city.name);
        const metaDescription = cityTemplate.metaTemplate.replace('{city}', city.name);
        const content = cityTemplate.contentTemplate
          .replace(/{city}/g, city.name)
          .replace(/{district}/g, city.district || city.name)
          .replace(/{population}/g, city.population?.toLocaleString('pt-PT') || 'N/A');

        await prisma.seoPage.upsert({
          where: { slug },
          update: {
            title,
            metaDescription,
            content,
            category: 'cidade',
            subcategory: city.name,
            keywords: [`carta apresentação ${city.name.toLowerCase()}`, `emprego ${city.name.toLowerCase()}`, `trabalho ${city.name.toLowerCase()}`],
            cityId: city.id,
            isActive: true,
          },
          create: {
            slug,
            title,
            metaDescription,
            content,
            category: 'cidade',
            subcategory: city.name,
            keywords: [`carta apresentação ${city.name.toLowerCase()}`, `emprego ${city.name.toLowerCase()}`, `trabalho ${city.name.toLowerCase()}`],
            cityId: city.id,
            isActive: true,
          },
        });

        pagesCreated++;
        console.log(`✅ SEO Page: ${slug}`);
      } catch (error) {
        console.error(`❌ Error creating city page for ${city.name}:`, error);
      }
    }
  }

  // Generate combined profession + city pages (sample - first 10 combinations to avoid too many pages)
  if (combinedTemplate && allIndustries.length > 0 && allCities.length > 0) {
    const topIndustries = allIndustries.slice(0, 5); // Top 5 industries
    const topCities = allCities.slice(0, 5); // Top 5 cities

    for (const industry of topIndustries) {
      for (const city of topCities) {
        try {
          const slug = `carta-apresentacao-${industry.slug}-${city.slug}`;
          const title = combinedTemplate.titleTemplate
            .replace('{profession}', industry.name)
            .replace('{city}', city.name);
          const metaDescription = combinedTemplate.metaTemplate
            .replace('{profession}', industry.name)
            .replace('{city}', city.name);
          const content = combinedTemplate.contentTemplate
            .replace(/{profession}/g, industry.name)
            .replace(/{city}/g, city.name)
            .replace(/{salary}/g, industry.salary || 'Salário competitivo')
            .replace(/{skills}/g, industry.skills.join(', '))
            .replace(/{district}/g, city.district || city.name);

          await prisma.seoPage.upsert({
            where: { slug },
            update: {
              title,
              metaDescription,
              content,
              category: 'profissao-cidade',
              subcategory: `${industry.name} em ${city.name}`,
              keywords: [
                `carta apresentação ${industry.name.toLowerCase()} ${city.name.toLowerCase()}`,
                `emprego ${industry.name.toLowerCase()} ${city.name.toLowerCase()}`,
                `trabalho ${industry.name.toLowerCase()} ${city.name.toLowerCase()}`
              ],
              industryId: industry.id,
              cityId: city.id,
              isActive: true,
            },
            create: {
              slug,
              title,
              metaDescription,
              content,
              category: 'profissao-cidade',
              subcategory: `${industry.name} em ${city.name}`,
              keywords: [
                `carta apresentação ${industry.name.toLowerCase()} ${city.name.toLowerCase()}`,
                `emprego ${industry.name.toLowerCase()} ${city.name.toLowerCase()}`,
                `trabalho ${industry.name.toLowerCase()} ${city.name.toLowerCase()}`
              ],
              industryId: industry.id,
              cityId: city.id,
              isActive: true,
            },
          });

          pagesCreated++;
          console.log(`✅ SEO Page: ${slug}`);
        } catch (error) {
          console.error(`❌ Error creating combined page for ${industry.name} in ${city.name}:`, error);
        }
      }
    }
  }

  // Generate guide pages
  console.log('🌱 Generating guide pages...');
  
  // Define the specific guide pages that are referenced in SEO components
  const specificGuidePages = [
    {
      slug: 'guia-como-escrever',
      title: 'Como Escrever uma Carta de Apresentação | Guia Completo 2024',
      metaDescription: 'Guia passo-a-passo para escrever cartas de apresentação eficazes. Estrutura, exemplos e dicas de especialistas para conseguir mais entrevistas.',
      topic: 'como-escrever',
      keywords: ['como escrever carta apresentação', 'guia carta apresentação', 'estrutura carta apresentação', 'dicas carta apresentação']
    },
    {
      slug: 'guia-exemplos',
      title: 'Exemplos de Cartas de Apresentação | Modelos Gratuitos 2024',
      metaDescription: 'Exemplos práticos de cartas de apresentação para diferentes profissões. Modelos gratuitos e editáveis para download.',
      topic: 'exemplos',
      keywords: ['exemplos carta apresentação', 'modelos carta apresentação', 'templates carta apresentação', 'carta apresentação gratis']
    },
    {
      slug: 'guia-dicas',
      title: 'Dicas para Cartas de Apresentação | Guia de Especialistas 2024',
      metaDescription: 'Dicas essenciais de especialistas para criar cartas de apresentação que impressionam recrutadores e conseguem entrevistas.',
      topic: 'dicas',
      keywords: ['dicas carta apresentação', 'conselhos carta apresentação', 'truques carta apresentação', 'segredos carta apresentação']
    },
    {
      slug: 'guia-entrevistas',
      title: 'Preparação para Entrevistas | Guia Completo 2024',
      metaDescription: 'Guia completo para preparação de entrevistas de emprego. Dicas, perguntas frequentes e estratégias para ter sucesso.',
      topic: 'entrevistas',
      keywords: ['preparação entrevistas', 'dicas entrevistas emprego', 'como preparar entrevista', 'perguntas entrevista trabalho']
    },
    {
      slug: 'guia-procurar-emprego',
      title: 'Como Procurar Emprego | Estratégias Eficazes 2024',
      metaDescription: 'Estratégias comprovadas para procurar emprego com sucesso. Dicas para encontrar oportunidades e destacar-se da concorrência.',
      topic: 'procurar-emprego',
      keywords: ['como procurar emprego', 'estratégias procura emprego', 'encontrar trabalho', 'procura trabalho portugal']
    },
    {
      slug: 'guia-competencias',
      title: 'Competências Profissionais | Guia de Desenvolvimento 2024',
      metaDescription: 'Guia completo sobre competências profissionais mais valorizadas. Como desenvolver e destacar as suas competências.',
      topic: 'competencias',
      keywords: ['competências profissionais', 'skills profissionais', 'desenvolvimento competências', 'competências trabalho']
    },
    {
      slug: 'guia-mercado-trabalho',
      title: 'Mercado de Trabalho em Portugal | Análise 2024',
      metaDescription: 'Análise completa do mercado de trabalho português. Tendências, oportunidades e sectores em crescimento.',
      topic: 'mercado-trabalho',
      keywords: ['mercado trabalho portugal', 'emprego portugal', 'oportunidades trabalho', 'sectores crescimento portugal']
    },
    {
      slug: 'guia-recem-licenciados',
      title: 'Carta de Apresentação para Recém-Licenciados | Guia 2024',
      metaDescription: 'Guia especializado para recém-licenciados criarem cartas de apresentação eficazes. Como destacar potencial quando falta experiência profissional.',
      topic: 'recem-licenciados',
      keywords: ['carta apresentação recém licenciado', 'primeiro emprego', 'carta apresentação sem experiência', 'recém graduado']
    }
  ];

  for (const guideData of specificGuidePages) {
    try {
      // Generate content for the guide page
      const content = `
        <div class="guide-content">
          <h1>${guideData.title}</h1>
          <div class="introduction">
            <p>${guideData.metaDescription}</p>
          </div>
          <div class="main-content">
            <h2>Guia Completo</h2>
            <p>Este guia abrangente foi criado para o ajudar a dominar todos os aspectos relacionados com ${guideData.topic.replace(/-/g, ' ')}.</p>
            <h3>O que vai aprender:</h3>
            <ul>
              <li>Estratégias comprovadas e eficazes</li>
              <li>Exemplos práticos e casos reais</li>
              <li>Dicas de especialistas da área</li>
              <li>Erros comuns a evitar</li>
              <li>Checklist para sucesso garantido</li>
            </ul>
            <div class="cta-section">
              <h3>Pronto para começar?</h3>
              <p>Use o nosso gerador de cartas de apresentação para criar a sua carta personalizada em minutos.</p>
              <a href="/" class="cta-button">Criar Carta de Apresentação</a>
            </div>
          </div>
        </div>
      `;

      await prisma.seoPage.upsert({
        where: { slug: guideData.slug },
        update: {
          title: guideData.title,
          metaDescription: guideData.metaDescription,
          content,
          category: 'guia',
          subcategory: guideData.topic,
          keywords: guideData.keywords,
          isActive: true,
        },
        create: {
          slug: guideData.slug,
          title: guideData.title,
          metaDescription: guideData.metaDescription,
          content,
          category: 'guia',
          subcategory: guideData.topic,
          keywords: guideData.keywords,
          isActive: true,
        },
      });

      pagesCreated++;
      console.log(`✅ Guide Page: ${guideData.slug}`);
    } catch (error) {
      console.error(`❌ Error creating guide page ${guideData.slug}:`, error);
    }
  }

  console.log(`✅ Generated ${pagesCreated} initial SEO pages`);
}

async function main() {
  try {
    console.log('🚀 Starting database seeding...');

    await seedIndustries();
    await seedCities();
    await seedTemplates();
    await generateInitialSeoPages();

    console.log('🎉 Database seeding completed successfully!');

    // Print summary
    const industryCount = await prisma.industry.count();
    const cityCount = await prisma.city.count();
    const templateCount = await prisma.seoTemplate.count();
    const seoPageCount = await prisma.seoPage.count();

    console.log('\n📊 Database Summary:');
    console.log(`   Industries: ${industryCount}`);
    console.log(`   Cities: ${cityCount}`);
    console.log(`   Templates: ${templateCount}`);
    console.log(`   SEO Pages: ${seoPageCount}`);

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed script
// if (require.main === module) {
  main();
// }

export { main as seedDatabase };
