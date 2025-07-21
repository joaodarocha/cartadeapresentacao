#!/usr/bin/env node

/**
 * Generate static sitemap.xml file for production deployment
 * This script fetches the sitemap from the backend API and saves it as a static file
 */

import fs from 'fs';
import path from 'path';

const BACKEND_URL = process.env.REACT_APP_API_URL || 'https://api.cartadeapresentacao.pt';
const OUTPUT_DIR = './public';
const SITEMAP_FILE = path.join(OUTPUT_DIR, 'sitemap.xml');

async function generateStaticSitemap() {
  console.log('🗺️  Generating static sitemap.xml...');
  
  try {
    // Fetch sitemap from backend API
    console.log(`📡 Fetching sitemap from: ${BACKEND_URL}/sitemap.xml`);
    const response = await fetch(`${BACKEND_URL}/sitemap.xml`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const sitemapXml = await response.text();
    
    // Ensure public directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
    // Write sitemap to public directory
    fs.writeFileSync(SITEMAP_FILE, sitemapXml, 'utf8');
    
    console.log(`✅ Static sitemap.xml generated successfully!`);
    console.log(`📍 Location: ${SITEMAP_FILE}`);
    console.log(`📊 Size: ${(sitemapXml.length / 1024).toFixed(2)} KB`);
    
    // Count URLs in sitemap
    const urlCount = (sitemapXml.match(/<url>/g) || []).length;
    console.log(`🔗 URLs included: ${urlCount}`);
    
  } catch (error) {
    console.error('❌ Error generating static sitemap:', error.message);
    
    // Create a basic fallback sitemap
    console.log('🔄 Creating fallback sitemap...');
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://cartadeapresentacao.pt/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://cartadeapresentacao.pt/login</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>`;
    
    fs.writeFileSync(SITEMAP_FILE, fallbackSitemap, 'utf8');
    console.log('✅ Fallback sitemap created');
  }
}

// Run the script
generateStaticSitemap();
