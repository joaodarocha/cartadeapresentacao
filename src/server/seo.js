import { HttpError } from 'wasp/server';

// ===== SEO PAGE QUERIES =====

/**
 * Get a specific SEO page by slug
 */
export const getSeoPage = async ({ slug }, context) => {
  if (!slug) {
    throw new HttpError(400, 'Slug is required');
  }

  const seoPage = await context.entities.SeoPage.findUnique({
    where: { 
      slug: slug,
      isActive: true 
    },
    include: {
      industry: true,
      city: true,
    },
  });

  if (!seoPage) {
    throw new HttpError(404, 'SEO page not found');
  }

  return seoPage;
};

/**
 * Get industry data by slug or ID
 */
export const getIndustryData = async ({ slug, id }, context) => {
  if (!slug && !id) {
    throw new HttpError(400, 'Either slug or id is required');
  }

  const whereClause = slug ? { slug, isActive: true } : { id, isActive: true };
  
  const industry = await context.entities.Industry.findUnique({
    where: whereClause,
    include: {
      seoPages: {
        where: { isActive: true },
        select: { slug: true, title: true, category: true }
      }
    },
  });

  if (!industry) {
    throw new HttpError(404, 'Industry not found');
  }

  return industry;
};

/**
 * Get city data by slug or ID
 */
export const getCityData = async ({ slug, id }, context) => {
  if (!slug && !id) {
    throw new HttpError(400, 'Either slug or id is required');
  }

  const whereClause = slug ? { slug, isActive: true } : { id, isActive: true };
  
  const city = await context.entities.City.findUnique({
    where: whereClause,
    include: {
      seoPages: {
        where: { isActive: true },
        select: { slug: true, title: true, category: true }
      }
    },
  });

  if (!city) {
    throw new HttpError(404, 'City not found');
  }

  return city;
};

/**
 * Get all active industries
 */
export const getAllIndustries = async (args, context) => {
  const industries = await context.entities.Industry.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      salary: true,
      skills: true,
    },
  });

  return industries;
};

/**
 * Get all active cities
 */
export const getAllCities = async (args, context) => {
  const cities = await context.entities.City.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
      district: true,
      population: true,
      description: true,
    },
  });

  return cities;
};

/**
 * Get SEO sitemap data
 */
export const getSeoSitemap = async (args, context) => {
  const seoPages = await context.entities.SeoPage.findMany({
    where: { isActive: true },
    select: {
      slug: true,
      updatedAt: true,
      category: true,
    },
    orderBy: { updatedAt: 'desc' },
  });

  // Transform to sitemap format
  const sitemapData = seoPages.map(page => ({
    url: `https://cartadeapresentacao.pt/${page.slug}`,
    lastModified: page.updatedAt.toISOString(),
    changeFrequency: getCategoryChangeFrequency(page.category),
    priority: getCategoryPriority(page.category),
  }));

  return sitemapData;
};

// ===== SEO PAGE ACTIONS =====

/**
 * XML Sitemap API endpoint - serves raw XML with proper headers
 */
export const xmlSitemapApi = async (req, res, context) => {
  try {
    const seoPages = await context.entities.SeoPage.findMany({
      where: { isActive: true },
      select: {
        slug: true,
        updatedAt: true,
        category: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    const baseUrl = 'https://cartadeapresentacao.pt';
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Add main pages
    xml += `
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/login</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${baseUrl}/jobs</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;

    // Add SEO pages
    seoPages.forEach(page => {
      const url = getPageUrlForSitemap(page, baseUrl);
      const lastmod = page.updatedAt ? new Date(page.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      const changefreq = getCategoryChangeFrequency(page.category);
      const priority = getCategoryPriority(page.category);

      xml += `
  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    });

    xml += `
</urlset>`;

    // Set proper XML content type and headers
    res.set('Content-Type', 'application/xml; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    
    return res.send(xml);
  } catch (error) {
    console.error('Error generating XML sitemap:', error);
    res.status(500).set('Content-Type', 'text/plain').send('Error generating sitemap');
  }
};

/**
 * Generate XML sitemap with proper headers
 */
export const generateXmlSitemap = async (args, context) => {
  const seoPages = await context.entities.SeoPage.findMany({
    where: { isActive: true },
    select: {
      slug: true,
      updatedAt: true,
      category: true,
    },
    orderBy: { updatedAt: 'desc' },
  });

  const baseUrl = 'https://cartadeapresentacao.pt';
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Add main pages
  xml += `
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/login</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${baseUrl}/jobs</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;

  // Add SEO pages
  seoPages.forEach(page => {
    const url = getPageUrlForSitemap(page, baseUrl);
    const lastmod = page.updatedAt ? new Date(page.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    const changefreq = getCategoryChangeFrequency(page.category);
    const priority = getCategoryPriority(page.category);

    xml += `
  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  });

  xml += `
</urlset>`;

  return {
    xml,
    contentType: 'application/xml; charset=utf-8'
  };
};

/**
 * Generate new SEO pages based on templates and data
 */
export const generateSeoPages = async ({ templateType, limit = 10 }, context) => {
  if (!context.user) {
    throw new HttpError(401, 'User must be authenticated');
  }

  try {
    let pagesCreated = 0;
    const results = [];

    switch (templateType) {
      case 'profession':
        pagesCreated = await generateProfessionPages(context, limit);
        break;
      case 'city':
        pagesCreated = await generateCityPages(context, limit);
        break;
      case 'combined':
        pagesCreated = await generateCombinedPages(context, limit);
        break;
      case 'all':
        const professionCount = await generateProfessionPages(context, Math.floor(limit / 3));
        const cityCount = await generateCityPages(context, Math.floor(limit / 3));
        const combinedCount = await generateCombinedPages(context, Math.floor(limit / 3));
        pagesCreated = professionCount + cityCount + combinedCount;
        break;
      default:
        throw new HttpError(400, 'Invalid template type');
    }

    return {
      success: true,
      pagesCreated,
      message: `Successfully generated ${pagesCreated} SEO pages`
    };

  } catch (error) {
    console.error('Error generating SEO pages:', error);
    throw new HttpError(500, 'Failed to generate SEO pages');
  }
};

/**
 * Update an existing SEO page
 */
export const updateSeoPage = async ({ id, updates }, context) => {
  if (!context.user) {
    throw new HttpError(401, 'User must be authenticated');
  }

  if (!id) {
    throw new HttpError(400, 'Page ID is required');
  }

  try {
    const updatedPage = await context.entities.SeoPage.update({
      where: { id },
      data: {
        ...updates,
        updatedAt: new Date(),
      },
    });

    return updatedPage;
  } catch (error) {
    console.error('Error updating SEO page:', error);
    throw new HttpError(500, 'Failed to update SEO page');
  }
};

/**
 * Track page view for analytics
 */
export const trackPageView = async ({ slug }, context) => {
  if (!slug) {
    throw new HttpError(400, 'Slug is required');
  }

  try {
    // Increment view count
    await context.entities.SeoPage.update({
      where: { slug },
      data: {
        viewCount: {
          increment: 1
        }
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error tracking page view:', error);
    // Don't throw error for analytics - just log it
    return { success: false };
  }
};

// ===== HELPER FUNCTIONS =====

/**
 * Generate profession-specific SEO pages
 */
async function generateProfessionPages(context, limit) {
  const industries = await context.entities.Industry.findMany({
    where: { isActive: true },
    take: limit,
  });

  const template = await context.entities.SeoTemplate.findFirst({
    where: { name: 'profession-main' },
  });

  if (!template) {
    throw new Error('Profession template not found');
  }

  let created = 0;
  for (const industry of industries) {
    const slug = `carta-apresentacao-${industry.slug}`;
    
    // Check if page already exists
    const existingPage = await context.entities.SeoPage.findUnique({
      where: { slug },
    });

    if (existingPage) continue;

    const title = template.titleTemplate.replace('{profession}', industry.name);
    const metaDescription = template.metaTemplate.replace('{profession}', industry.name);
    const content = template.contentTemplate
      .replace(/{profession}/g, industry.name)
      .replace(/{salary}/g, industry.salary || 'Salário competitivo')
      .replace(/{skills}/g, industry.skills.join(', '));

    await context.entities.SeoPage.create({
      data: {
        slug,
        title,
        metaDescription,
        content,
        category: 'profissao',
        subcategory: industry.name,
        keywords: [
          `carta apresentação ${industry.name.toLowerCase()}`,
          `modelo carta ${industry.name.toLowerCase()}`,
          `exemplo carta ${industry.name.toLowerCase()}`
        ],
        industryId: industry.id,
        isActive: true,
      },
    });

    created++;
  }

  return created;
}

/**
 * Generate city-specific SEO pages
 */
async function generateCityPages(context, limit) {
  const cities = await context.entities.City.findMany({
    where: { isActive: true },
    take: limit,
  });

  const template = await context.entities.SeoTemplate.findFirst({
    where: { name: 'city-main' },
  });

  if (!template) {
    throw new Error('City template not found');
  }

  let created = 0;
  for (const city of cities) {
    const slug = `carta-apresentacao-${city.slug}`;
    
    // Check if page already exists
    const existingPage = await context.entities.SeoPage.findUnique({
      where: { slug },
    });

    if (existingPage) continue;

    const title = template.titleTemplate.replace('{city}', city.name);
    const metaDescription = template.metaTemplate.replace('{city}', city.name);
    const content = template.contentTemplate
      .replace(/{city}/g, city.name)
      .replace(/{district}/g, city.district || city.name)
      .replace(/{population}/g, city.population?.toLocaleString('pt-PT') || 'N/A');

    await context.entities.SeoPage.create({
      data: {
        slug,
        title,
        metaDescription,
        content,
        category: 'cidade',
        subcategory: city.name,
        keywords: [
          `carta apresentação ${city.name.toLowerCase()}`,
          `emprego ${city.name.toLowerCase()}`,
          `trabalho ${city.name.toLowerCase()}`
        ],
        cityId: city.id,
        isActive: true,
      },
    });

    created++;
  }

  return created;
}

/**
 * Generate combined profession + city SEO pages
 */
async function generateCombinedPages(context, limit) {
  const industries = await context.entities.Industry.findMany({
    where: { isActive: true },
    take: 5, // Top 5 industries
  });

  const cities = await context.entities.City.findMany({
    where: { isActive: true },
    take: 5, // Top 5 cities
  });

  const template = await context.entities.SeoTemplate.findFirst({
    where: { name: 'profession-city-combined' },
  });

  if (!template) {
    throw new Error('Combined template not found');
  }

  let created = 0;
  let totalAttempts = 0;

  for (const industry of industries) {
    for (const city of cities) {
      if (totalAttempts >= limit) break;
      totalAttempts++;

      const slug = `carta-apresentacao-${industry.slug}-${city.slug}`;
      
      // Check if page already exists
      const existingPage = await context.entities.SeoPage.findUnique({
        where: { slug },
      });

      if (existingPage) continue;

      const title = template.titleTemplate
        .replace('{profession}', industry.name)
        .replace('{city}', city.name);
      const metaDescription = template.metaTemplate
        .replace('{profession}', industry.name)
        .replace('{city}', city.name);
      const content = template.contentTemplate
        .replace(/{profession}/g, industry.name)
        .replace(/{city}/g, city.name)
        .replace(/{salary}/g, industry.salary || 'Salário competitivo')
        .replace(/{skills}/g, industry.skills.join(', '))
        .replace(/{district}/g, city.district || city.name);

      await context.entities.SeoPage.create({
        data: {
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

      created++;
    }
    if (totalAttempts >= limit) break;
  }

  return created;
}

/**
 * Get change frequency for sitemap based on category
 */
function getCategoryChangeFrequency(category) {
  switch (category) {
    case 'profissao':
    case 'cidade':
      return 'monthly';
    case 'guia':
      return 'weekly';
    case 'profissao-cidade':
      return 'monthly';
    default:
      return 'monthly';
  }
}

/**
 * Get priority for sitemap based on category
 */
function getCategoryPriority(category) {
  switch (category) {
    case 'profissao':
      return 0.8;
    case 'cidade':
      return 0.7;
    case 'guia':
      return 0.9;
    case 'profissao-cidade':
      return 0.6;
    default:
      return 0.5;
  }
}

/**
 * Helper function to generate page URLs for sitemap
 */
function getPageUrlForSitemap(page, baseUrl) {
  switch (page.category) {
    case 'profissao':
      return `${baseUrl}/profissao/${page.slug.replace('carta-apresentacao-', '')}`;
    case 'cidade':
      return `${baseUrl}/cidade/${page.slug.replace('carta-apresentacao-', '')}`;
    case 'profissao-cidade':
      // Extract city and profession from slug
      const slugPart = page.slug.replace('carta-apresentacao-', '');
      const parts = slugPart.split('-');
      if (parts.length >= 2) {
        const city = parts[parts.length - 1];
        const profession = parts.slice(0, -1).join('-');
        return `${baseUrl}/cidade/${city}/${profession}`;
      }
      return `${baseUrl}/${page.slug}`;
    case 'guia':
      return `${baseUrl}/${page.slug.replace('guia-', 'guia/')}`;
    case 'setor':
      return `${baseUrl}/setor/${page.slug.replace('carta-apresentacao-setor-', '')}`;
    default:
      return `${baseUrl}/${page.slug}`;
  }
}
