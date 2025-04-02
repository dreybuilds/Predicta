import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Predicta - AI-powered stock market predictions" />
        <meta name="theme-color" content="#000000" />
      </Head>
      <body className="bg-gradient-to-b from-gray-900 to-black text-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
} 