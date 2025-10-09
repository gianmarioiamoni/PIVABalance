/**
 * Canonical URL Component for SEO
 * Prevents duplicate content issues by specifying the canonical version of a page
 */

interface CanonicalUrlProps {
  url?: string;
  pathname?: string;
}

export const CanonicalUrl: React.FC<CanonicalUrlProps> = ({ url, pathname }) => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pivabalance.com';
  
  // Generate canonical URL
  const canonicalUrl = url || `${baseUrl}${pathname || ''}`;
  
  // Ensure URL is properly formatted
  const formattedUrl = canonicalUrl.endsWith('/') && canonicalUrl !== baseUrl + '/' 
    ? canonicalUrl.slice(0, -1) 
    : canonicalUrl;

  return (
    <link rel="canonical" href={formattedUrl} />
  );
};
