import React, { useEffect, useState } from 'react';
import { generateXmlSitemap } from 'wasp/client/operations';

export default function SitemapPage() {
  const [xmlContent, setXmlContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateSitemap = async () => {
      try {
        const result = await generateXmlSitemap();
        if (result && result.xml) {
          setXmlContent(result.xml);
          
          // Set proper content type in document head
          const metaTag = document.createElement('meta');
          metaTag.httpEquiv = 'Content-Type';
          metaTag.content = 'application/xml; charset=utf-8';
          document.head.appendChild(metaTag);
          
          // Replace document content with XML
          document.open();
          document.write(result.xml);
          document.close();
        }
      } catch (err) {
        console.error('Error generating sitemap:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    generateSitemap();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', fontFamily: 'monospace' }}>
        Generating XML sitemap...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', fontFamily: 'monospace', color: 'red' }}>
        Error generating sitemap: {error}
      </div>
    );
  }

  // Fallback: show XML as formatted text if document replacement doesn't work
  return (
    <div style={{ padding: '0', margin: '0' }}>
      <pre style={{ 
        whiteSpace: 'pre-wrap', 
        fontFamily: 'monospace', 
        fontSize: '12px',
        margin: '0',
        padding: '10px',
        backgroundColor: '#f5f5f5',
        border: '1px solid #ddd'
      }}>
        {xmlContent}
      </pre>
    </div>
  );
}
