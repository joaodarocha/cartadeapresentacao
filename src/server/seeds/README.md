# Database Seeding Guide

This directory contains seed data and scripts to populate the CoverLetter-AI database with Portuguese SEO content.

## Files Overview

### Data Files
- **`industries.ts`** - Contains 50+ Portuguese professions with descriptions, salary ranges, and skills
- **`cities.ts`** - Contains 35+ major Portuguese cities with population data and economic descriptions  
- **`templates.ts`** - Contains 10 SEO content templates for different page types

### Seed Script
- **`seedDatabase.ts`** - Main seeding script that populates the database

## Database Schema

The seed script populates these models:
- **`Industry`** - Professional roles and sectors
- **`City`** - Portuguese cities and regions
- **`SeoTemplate`** - Content templates for page generation
- **`SeoPage`** - Generated SEO pages (initial set)

## Running the Seed Script

### Prerequisites
1. Ensure your database is running and accessible
2. Make sure `DATABASE_URL` is set in your environment
3. Run database migrations: `npx prisma migrate dev`

### Run Seeding
```bash
# Install dependencies (if not already done)
npm install

# Run the seed script
npm run seed
```

### Alternative Methods
```bash
# Using tsx directly
npx tsx src/server/seeds/seedDatabase.ts

# Using Node (if compiled)
node dist/server/seeds/seedDatabase.js
```

## What Gets Seeded

### Industries (50+ entries)
- Technology roles (Software Engineer, Frontend Developer, etc.)
- Healthcare professions (Médico, Enfermeiro, etc.)
- Education roles (Professor, Formador, etc.)
- Business and finance roles
- Creative and design roles
- And many more...

### Cities (35+ entries)
- Major metropolitan areas (Lisboa, Porto)
- District capitals and important cities
- Regional economic centers
- Tourist destinations

### Templates (10 types)
1. **Profession-specific pages** - Main landing pages for each profession
2. **City-specific pages** - Location-based job search pages
3. **Combined profession + city** - Targeted local job pages
4. **How-to guides** - Educational content
5. **Templates and examples** - Practical resources
6. **Entry-level content** - For recent graduates
7. **Career change guides** - For career transitions
8. **Remote work content** - For remote job seekers
9. **Internship guides** - For students and interns
10. **Senior/executive content** - For experienced professionals

### Generated SEO Pages
The script automatically generates initial SEO pages:
- One page per profession (~50 pages)
- One page per city (~35 pages)  
- Sample combined pages (25 pages for top 5 professions × top 5 cities)
- **Total: ~110 initial SEO pages**

## Expected Output

When successful, you should see:
```
🚀 Starting database seeding...
🌱 Seeding industries...
✅ Industry: Engenheiro de Software
✅ Industry: Engenheiro Frontend
... (50+ industries)
✅ Seeded 50+ industries

🌱 Seeding cities...
✅ City: Lisboa
✅ City: Porto
... (35+ cities)
✅ Seeded 35+ cities

🌱 Seeding SEO templates...
✅ Template: profession-main
✅ Template: city-main
... (10 templates)
✅ Seeded 10 SEO templates

🌱 Generating initial SEO pages...
✅ SEO Page: carta-apresentacao-engenheiro-software
... (110+ pages)
✅ Generated 110+ initial SEO pages

🎉 Database seeding completed successfully!

📊 Database Summary:
   Industries: 50+
   Cities: 35+
   Templates: 10
   SEO Pages: 110+
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure `DATABASE_URL` is set correctly
   - Check if database server is running
   - Verify database exists and is accessible

2. **Prisma Client Error**
   - Run `npx prisma generate` to regenerate client
   - Ensure migrations are up to date: `npx prisma migrate dev`

3. **Import Errors**
   - Check that all seed files exist and have correct exports
   - Verify TypeScript compilation is working

4. **Duplicate Key Errors**
   - The script uses `upsert` operations, so it's safe to run multiple times
   - If you see unique constraint errors, check for data inconsistencies

### Data Validation

After seeding, you can verify the data:
```sql
-- Check counts
SELECT 'industries' as table_name, COUNT(*) as count FROM "Industry"
UNION ALL
SELECT 'cities', COUNT(*) FROM "City"  
UNION ALL
SELECT 'templates', COUNT(*) FROM "SeoTemplate"
UNION ALL
SELECT 'seo_pages', COUNT(*) FROM "SeoPage";

-- Check sample data
SELECT name, slug, salary FROM "Industry" LIMIT 5;
SELECT name, district, population FROM "City" LIMIT 5;
SELECT name, category FROM "SeoTemplate";
```

## Next Steps

After successful seeding:
1. **Phase 2**: Implement backend API endpoints for SEO pages
2. **Phase 3**: Create frontend routing for dynamic pages
3. **Phase 4**: Build admin interface for content management
4. **Phase 5**: Add SEO optimization features

## Maintenance

- **Adding new professions**: Update `industries.ts` and re-run seed
- **Adding new cities**: Update `cities.ts` and re-run seed  
- **Modifying templates**: Update `templates.ts` and re-run seed
- **Bulk updates**: The upsert logic ensures safe re-seeding

---

For questions or issues, refer to the main project documentation or the programmatic SEO implementation plan.
