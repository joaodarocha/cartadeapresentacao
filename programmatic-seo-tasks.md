# Programmatic SEO Implementation Tasks

## Project Overview
This document outlines the tasks needed to implement programmatic SEO for the CoverLetterGPT application targeting the Portuguese market. The project uses WaspLang framework with React frontend and PostgreSQL database.

## Current Project Structure Analysis
- **Framework**: WaspLang 0.16.0
- **Frontend**: React with Chakra UI
- **Backend**: Node.js (via Wasp)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Google OAuth
- **Existing Entities**: User, Job, CoverLetter, LnData, LnPayment

## Phase 1: Database Schema Extension

### Task 1.1: Create SEO-related Entities
**Priority**: High  
**Estimated Time**: 2-3 hours

Add new entities to `schema.prisma`:

```prisma
model SeoPage {
  id              String   @id @default(uuid())
  slug            String   @unique
  title           String
  metaDescription String
  content         String   @db.Text
  category        String   // "profissao", "setor", "cidade", "guia"
  subcategory     String?  // specific profession, sector, city
  keywords        String[] // target keywords array
  isActive        Boolean  @default(true)
  viewCount       Int      @default(0)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  // Relations
  industry        Industry? @relation(fields: [industryId], references: [id])
  industryId      String?
  city            City?     @relation(fields: [cityId], references: [id])
  cityId          String?
  
  @@index([category, subcategory])
  @@index([isActive])
}

model Industry {
  id          String    @id @default(uuid())
  name        String    @unique // "Engenheiro de Software"
  slug        String    @unique // "engenheiro-software"
  description String    @db.Text
  salary      String?   // "€25.000 - €45.000"
  skills      String[]  // ["JavaScript", "React", "Node.js"]
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  // Relations
  seoPages    SeoPage[]
  
  @@index([isActive])
}

model City {
  id          String    @id @default(uuid())
  name        String    @unique // "Lisboa"
  slug        String    @unique // "lisboa"
  district    String?   // "Lisboa"
  population  Int?
  description String    @db.Text
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  // Relations
  seoPages    SeoPage[]
  
  @@index([isActive])
}

model SeoTemplate {
  id          String   @id @default(uuid())
  name        String   @unique
  category    String   // "profession", "city", "guide"
  titleTemplate String // "Carta de Apresentação para {profession} | Modelos e Exemplos"
  metaTemplate  String // "Crie a carta perfeita para {profession}. Modelos, exemplos e dicas."
  contentTemplate String @db.Text // HTML template with placeholders
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**Deliverables**:
- [X] Update `schema.prisma` with new entities
- [X] Run `wasp db migrate-dev` to apply changes
- [X] Verify database schema in PostgreSQL

### Task 1.2: Seed Initial Data
**Priority**: High  
**Estimated Time**: 3-4 hours

Create seed data for industries and cities:

**Deliverables**:
- [X] Create `src/server/seeds/industries.ts` with 50+ Portuguese professions
- [X] Create `src/server/seeds/cities.ts` with major Portuguese cities
- [x] Create `src/server/seeds/templates.ts` with content templates
- [X] Create seed script to populate database

## Phase 2: Backend API Development

### Task 2.1: Create SEO Operations in main.wasp
**Priority**: High  
**Estimated Time**: 2-3 hours

Add new operations to `main.wasp`:

```wasp
// Queries
query getSeoPage {
  fn: import { getSeoPage } from "@src/server/seo.js",
  entities: [SeoPage, Industry, City]
}

query getIndustryData {
  fn: import { getIndustryData } from "@src/server/seo.js",
  entities: [Industry]
}

query getCityData {
  fn: import { getCityData } from "@src/server/seo.js",
  entities: [City]
}

query getAllIndustries {
  fn: import { getAllIndustries } from "@src/server/seo.js",
  entities: [Industry]
}

query getAllCities {
  fn: import { getAllCities } from "@src/server/seo.js",
  entities: [City]
}

query getSeoSitemap {
  fn: import { getSeoSitemap } from "@src/server/seo.js",
  entities: [SeoPage]
}

// Actions
action generateSeoPages {
  fn: import { generateSeoPages } from "@src/server/seo.js",
  entities: [SeoPage, Industry, City, SeoTemplate]
}

action updateSeoPage {
  fn: import { updateSeoPage } from "@src/server/seo.js",
  entities: [SeoPage]
}

action trackPageView {
  fn: import { trackPageView } from "@src/server/seo.js",
  entities: [SeoPage]
}
```

**Deliverables**:
- [x] Add operations to `main.wasp`
- [x] Verify operations are properly configured

### Task 2.2: Implement Server-Side SEO Logic
**Priority**: High  
**Estimated Time**: 6-8 hours

Create `src/server/seo.js`:

**Deliverables**:
- [x] Implement `getSeoPage` function
- [x] Implement `getIndustryData` and `getCityData` functions
- [x] Implement `generateSeoPages` function with content generation logic
- [x] Implement `getSeoSitemap` for XML sitemap generation
- [x] Implement `trackPageView` for analytics
- [x] Create content generation templates and logic
- [x] Add error handling and validation

### Task 2.3: Create Content Generation System
**Priority**: High  
**Estimated Time**: 4-5 hours

**Deliverables**:
- [x] Create `src/server/contentGenerator.js` with template functions
- [x] Implement industry-specific content generation
- [x] Implement city-specific content generation
- [x] Implement guide content generation
- [x] Create content variation logic to avoid duplicate content
- [x] Add Portuguese language-specific content rules

## Phase 3: Frontend Route Configuration

### Task 3.1: Add Dynamic Routes to main.wasp
**Priority**: High  
**Estimated Time**: 2-3 hours

Add SEO routes to `main.wasp`:

```wasp
// SEO Routes
route ProfessionRoute { path: "/profissao/:profession", to: ProfessionPage }
page ProfessionPage {
  component: import ProfessionPage from "@src/client/seo/ProfessionPage"
}

route SectorRoute { path: "/setor/:sector", to: SectorPage }
page SectorPage {
  component: import SectorPage from "@src/client/seo/SectorPage"
}

route CityRoute { path: "/cidade/:city", to: CityPage }
page CityPage {
  component: import CityPage from "@src/client/seo/CityPage"
}

route CityProfessionRoute { path: "/cidade/:city/:profession", to: CityProfessionPage }
page CityProfessionPage {
  component: import CityProfessionPage from "@src/client/seo/CityProfessionPage"
}

route GuideRoute { path: "/guia/:topic", to: GuidePage }
page GuidePage {
  component: import GuidePage from "@src/client/seo/GuidePage"
}

route SitemapRoute { path: "/sitemap.xml", to: SitemapPage }
page SitemapPage {
  component: import SitemapPage from "@src/client/seo/SitemapPage"
}
```

**Deliverables**:
- [ ] Add routes to `main.wasp`
- [ ] Verify routing configuration
- [ ] Test route parameters parsing

### Task 3.2: Create SEO Page Components
**Priority**: High  
**Estimated Time**: 8-10 hours

Create React components for SEO pages:

**Deliverables**:
- [x] Create `src/client/seo/` directory structure
- [x] Implement `ProfessionPage.tsx` component
- [x] Implement `SectorPage.tsx` component  
- [x] Implement `CityPage.tsx` component
- [x] Implement `CityProfessionPage.tsx` component
- [x] Implement `GuidePage.tsx` component
- [x] Create shared `SeoPageLayout.tsx` component
- [x] Implement loading states and error handling

### Task 3.3: Create SEO Utility Components
**Priority**: Medium  
**Estimated Time**: 4-5 hours

**Deliverables**:
- [ ] Create `src/client/components/SeoHead.tsx` for dynamic meta tags
- [ ] Create `src/client/components/StructuredData.tsx` for JSON-LD
- [ ] Create `src/client/components/Breadcrumbs.tsx` for navigation
- [ ] Create `src/client/components/RelatedContent.tsx` for internal linking
- [ ] Create `src/client/components/CallToActionSeo.tsx` for conversions
- [ ] Update existing `NavBar.tsx` to include SEO page links

## Phase 4: Content Management System

### Task 4.1: Create Admin Interface Routes
**Priority**: Medium  
**Estimated Time**: 3-4 hours

Add admin routes to `main.wasp`:

```wasp
route AdminRoute { path: "/admin", to: AdminPage }
page AdminPage {
  authRequired: true,
  component: import AdminPage from "@src/client/admin/AdminPage"
}

route AdminSeoRoute { path: "/admin/seo", to: AdminSeoPage }
page AdminSeoPage {
  authRequired: true,
  component: import AdminSeoPage from "@src/client/admin/AdminSeoPage"
}
```

**Deliverables**:
- [ ] Add admin routes to `main.wasp`
- [ ] Implement admin authentication checks
- [ ] Create admin navigation structure

### Task 4.2: Build Admin Dashboard
**Priority**: Medium  
**Estimated Time**: 6-8 hours

**Deliverables**:
- [ ] Create `src/client/admin/AdminPage.tsx`
- [ ] Create `src/client/admin/AdminSeoPage.tsx`
- [ ] Implement SEO page management interface
- [ ] Create forms for editing SEO content
- [ ] Implement bulk operations for SEO pages
- [ ] Add analytics dashboard for page performance
- [ ] Create content generation triggers

## Phase 5: SEO Optimization Features

### Task 5.1: Implement Meta Tag Management
**Priority**: High  
**Estimated Time**: 3-4 hours

**Deliverables**:
- [ ] Install and configure `react-helmet-async`
- [ ] Update `src/client/App.tsx` to include HelmetProvider
- [ ] Implement dynamic meta tag generation
- [ ] Add Open Graph and Twitter Card support
- [ ] Implement canonical URL management
- [ ] Add hreflang tags for Portuguese localization

### Task 5.2: Add Structured Data
**Priority**: High  
**Estimated Time**: 2-3 hours

**Deliverables**:
- [ ] Implement JSON-LD structured data for WebPage
- [ ] Add JobPosting structured data for profession pages
- [ ] Add LocalBusiness structured data for city pages
- [ ] Add HowTo structured data for guide pages
- [ ] Validate structured data with Google's testing tool

### Task 5.3: Create XML Sitemap
**Priority**: High  
**Estimated Time**: 2-3 hours

**Deliverables**:
- [ ] Implement `SitemapPage.tsx` component
- [ ] Create XML sitemap generation logic
- [ ] Include all SEO pages in sitemap
- [ ] Add lastmod dates and priority values
- [ ] Configure proper XML content-type headers

## Phase 6: Performance and Analytics

### Task 6.1: Implement Page Analytics
**Priority**: Medium  
**Estimated Time**: 3-4 hours

**Deliverables**:
- [ ] Add page view tracking to SEO pages
- [ ] Implement conversion tracking for CTA clicks
- [ ] Create analytics dashboard in admin panel
- [ ] Add Google Analytics 4 integration for SEO pages
- [ ] Implement custom events for user interactions

### Task 6.2: Performance Optimization
**Priority**: Medium  
**Estimated Time**: 4-5 hours

**Deliverables**:
- [ ] Implement lazy loading for SEO page components
- [ ] Add image optimization for SEO pages
- [ ] Implement caching strategies for generated content
- [ ] Optimize bundle size for SEO pages
- [ ] Add performance monitoring

## Phase 7: Content Strategy Implementation

### Task 7.1: Generate Initial Content
**Priority**: High  
**Estimated Time**: 6-8 hours

**Deliverables**:
- [ ] Create content for 50+ profession pages
- [ ] Create content for 20+ city pages
- [ ] Create content for 30+ guide pages
- [ ] Generate 500+ combination pages (city + profession)
- [ ] Review and optimize all generated content
- [ ] Implement content quality checks

### Task 7.2: SEO Content Optimization
**Priority**: High  
**Estimated Time**: 4-5 hours

**Deliverables**:
- [ ] Optimize titles and meta descriptions for target keywords
- [ ] Implement proper heading hierarchy (H1, H2, H3)
- [ ] Add internal linking between related pages
- [ ] Optimize content length and keyword density
- [ ] Add call-to-action elements throughout content
- [ ] Implement content freshness updates

## Phase 8: Testing and Quality Assurance

### Task 8.1: SEO Technical Testing
**Priority**: High  
**Estimated Time**: 3-4 hours

**Deliverables**:
- [ ] Test all dynamic routes and parameters
- [ ] Validate meta tags and structured data
- [ ] Test sitemap generation and accessibility
- [ ] Verify canonical URLs and redirects
- [ ] Test mobile responsiveness of SEO pages
- [ ] Validate HTML markup and accessibility

### Task 8.2: Content Quality Assurance
**Priority**: Medium  
**Estimated Time**: 4-5 hours

**Deliverables**:
- [ ] Review generated content for accuracy
- [ ] Check for duplicate content issues
- [ ] Verify Portuguese language quality
- [ ] Test internal linking functionality
- [ ] Validate call-to-action effectiveness
- [ ] Perform user experience testing

## Phase 9: Deployment and Monitoring

### Task 9.1: Production Deployment
**Priority**: High  
**Estimated Time**: 2-3 hours

**Deliverables**:
- [ ] Deploy database migrations to production
- [ ] Deploy application with SEO features
- [ ] Configure production environment variables
- [ ] Set up production caching strategies
- [ ] Verify all SEO pages work in production

### Task 9.2: SEO Monitoring Setup
**Priority**: High  
**Estimated Time**: 3-4 hours

**Deliverables**:
- [ ] Submit sitemap to Google Search Console
- [ ] Set up Google Analytics for SEO pages
- [ ] Configure search performance monitoring
- [ ] Set up automated SEO auditing
- [ ] Create performance dashboards
- [ ] Implement alerting for SEO issues

## Phase 10: Optimization and Scaling

### Task 10.1: Performance Analysis
**Priority**: Medium  
**Estimated Time**: 2-3 hours

**Deliverables**:
- [ ] Analyze page performance metrics
- [ ] Identify top-performing content
- [ ] Optimize underperforming pages
- [ ] A/B test different content variations
- [ ] Implement conversion rate optimizations

### Task 10.2: Content Expansion
**Priority**: Low  
**Estimated Time**: Ongoing

**Deliverables**:
- [ ] Add seasonal content campaigns
- [ ] Create industry-specific tools and calculators
- [ ] Implement user-generated content features
- [ ] Expand to additional Portuguese regions
- [ ] Create partnership content opportunities

## Success Metrics

### Technical KPIs
- [ ] 500+ SEO pages successfully generated and indexed
- [ ] Page load speed < 3 seconds for all SEO pages
- [ ] 100% mobile responsiveness score
- [ ] Zero duplicate content issues
- [ ] All structured data validated

### SEO KPIs
- [ ] 300% increase in organic traffic within 6 months
- [ ] Top 10 rankings for 50+ target keywords
- [ ] 5%+ click-through rate from search results
- [ ] 1000+ pages indexed by Google
- [ ] 50+ referring domains from content

### Business KPIs
- [ ] 25% increase in sign-ups from organic traffic
- [ ] 15% conversion rate from SEO pages to tool usage
- [ ] 10% reduction in customer acquisition cost
- [ ] 200+ new users per month from SEO
- [ ] 5% increase in overall revenue attribution

## Risk Mitigation

### Technical Risks
- **Database Performance**: Monitor query performance with large datasets
- **Content Quality**: Implement automated content quality checks
- **Duplicate Content**: Use content variation algorithms
- **Site Speed**: Implement aggressive caching strategies

### SEO Risks
- **Google Algorithm Changes**: Monitor rankings and adapt quickly
- **Content Penalties**: Ensure all content is unique and valuable
- **Technical SEO Issues**: Regular automated auditing
- **Competition**: Monitor competitor strategies and differentiate

## Timeline Summary

- **Phase 1-2**: 2 weeks (Database + Backend)
- **Phase 3**: 1.5 weeks (Frontend Routes)
- **Phase 4**: 1.5 weeks (Admin Interface)
- **Phase 5**: 1 week (SEO Features)
- **Phase 6**: 1 week (Performance)
- **Phase 7**: 1.5 weeks (Content)
- **Phase 8**: 1 week (Testing)
- **Phase 9**: 0.5 weeks (Deployment)
- **Phase 10**: Ongoing (Optimization)

**Total Estimated Time**: 10-12 weeks for full implementation

## Next Steps

1. **Start with Phase 1**: Database schema extension
2. **Set up development environment** for SEO testing
3. **Create project timeline** with specific deadlines
4. **Assign team members** to different phases
5. **Set up monitoring tools** for tracking progress

This implementation will establish CoverLetterGPT as the dominant Portuguese resource for cover letter assistance, capturing significant organic search traffic and driving user acquisition through SEO.
