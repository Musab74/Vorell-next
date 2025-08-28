// pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Basic SEO */}
        <meta name="robots" content="index,follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0f0f0f" />

        <link rel="icon" type="image/svg+xml" href="/img/logo/vorell-gold.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/img/logo/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        <meta name="title" content="Vorell Watches – Luxury Timepieces for Collectors" />
        <meta
          name="description"
          content="Discover Vorell – your destination for luxury watches. Explore Rolex, Patek Philippe, Audemars Piguet, Omega, and more. Exclusive collections, timeless craftsmanship."
        />
        <meta
          name="keywords"
          content="luxury watches, Rolex, Patek Philippe, Audemars Piguet, Omega, TAG Heuer, Swiss watches, high-end timepieces, vorell"
        />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.vorell.com/" />
        <meta property="og:title" content="vorell Watches – Luxury Timepieces for Collectors" />
        <meta
          property="og:description"
          content="Experience the world of luxury watches with vorell. Curated collections from the most prestigious brands."
        />
        <meta property="og:image" content="https://www.vorell.com/img/og/vorell-watches.jpg" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://www.vorell.com/" />
        <meta name="twitter:title" content="Vorell Watches – Luxury Timepieces for Collectors" />
        <meta
          name="twitter:description"
          content="Your premier destination for luxury watches. Timeless elegance meets precision craftsmanship."
        />
        <meta name="twitter:image" content="https://www.vorell.com/img/og/vorell-watches.jpg" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Roboto:wght@300;400;500&display=swap"
          rel="stylesheet"
        />

        <link rel="preload" as="image" href="/img/banner/watchesPage.png" />
      </Head>
      <body style={{ backgroundColor: '#f7f4ee', color: '#0f0f0f' }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
