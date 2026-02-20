import { SEO_CONFIG } from '../config/seo';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
}

export const SEO = ({
  title = SEO_CONFIG.defaultTitle,
  description = SEO_CONFIG.defaultDescription,
  canonical = SEO_CONFIG.siteUrl,
  ogImage = SEO_CONFIG.defaultOgImage,
}: SEOProps) => {
  const fullOgImage = ogImage.startsWith('http')
    ? ogImage
    : `${SEO_CONFIG.siteUrl}${ogImage}`;

  return (
    <>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name='description' content={description} />
      <link rel='canonical' href={canonical} />

      {/* Keywords */}
      <meta name='keywords' content={SEO_CONFIG.keywords.join(', ')} />

      {/* Open Graph / Facebook */}
      <meta property='og:type' content='website' />
      <meta property='og:url' content={canonical} />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:image' content={fullOgImage} />

      {/* Twitter */}
      <meta property='twitter:card' content='summary_large_image' />
      <meta property='twitter:url' content={canonical} />
      <meta property='twitter:title' content={title} />
      <meta property='twitter:description' content={description} />
      <meta property='twitter:image' content={fullOgImage} />

      {/* Twitter Site Handle (Only if configured) */}
      {SEO_CONFIG.twitterHandle && (
        <meta name='twitter:site' content={SEO_CONFIG.twitterHandle} />
      )}

      {/* Additional Meta Tags */}
      <meta name='robots' content='index, follow' />
      <meta name='language' content='English' />
      <meta name='author' content={SEO_CONFIG.siteName} />
    </>
  );
};
