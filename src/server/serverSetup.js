import { xmlSitemapApi } from './seo.js';

export const serverSetup = async (context) => {
  const { app, entities } = context;
  
  // Add middleware to handle sitemap.xml requests from both API and frontend domains
  const handleSitemap = async (req, res) => {
    try {
      // Create a context object similar to what Wasp provides
      const apiContext = {
        entities,
      };
      
      // Call our XML sitemap API function
      await xmlSitemapApi(req, res, apiContext);
    } catch (error) {
      console.error('Error serving sitemap:', error);
      res.status(500).set('Content-Type', 'text/plain').send('Error generating sitemap');
    }
  };
  
  // Handle sitemap requests from both API and frontend domains
  app.get('/sitemap.xml', handleSitemap);
  
  // Handle CORS for sitemap requests from frontend domain
  app.use('/sitemap.xml', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });
  
  console.log('✅ Server setup complete - sitemap.xml middleware configured for both domains');
};
