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
