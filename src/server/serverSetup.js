import { xmlSitemapApi } from './seo.js';

export const serverSetup = async (context) => {
  const { app, entities } = context;
  
  // Add middleware to handle sitemap.xml requests from the frontend
  app.get('/sitemap.xml', async (req, res) => {
    try {
      // Create a context object similar to what Wasp provides
      const apiContext = {
        entities,
      };
      
      // Call our XML sitemap API function
      await xmlSitemapApi(req, res, apiContext);
    } catch (error) {
      console.error('Error serving sitemap from frontend:', error);
      res.status(500).set('Content-Type', 'text/plain').send('Error generating sitemap');
    }
  });
  
  console.log('✅ Server setup complete - sitemap.xml middleware configured');
};
