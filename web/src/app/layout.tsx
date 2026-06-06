import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Florida Shell Finder",
  description: "Real-time shelling conditions and shell finder for Florida beaches.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ShellingApp",
  }
};

export const viewport = {
  themeColor: "#0ea5e9",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://unpkg.com/maplibre-gl@4.3.2/dist/maplibre-gl.css" rel="stylesheet" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        <nav className="glass-panel" style={{ margin: '16px', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>🐚</span>
            <h1 className="heading-gradient" style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>FL Shell Finder</h1>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="/" style={{ fontWeight: 500 }}>Map</a>
            <a href="/shells" style={{ fontWeight: 500 }}>Encyclopedia</a>
          </div>
        </nav>
        <main style={{ paddingTop: '80px', minHeight: '100vh' }}>
          {children}
        </main>
        <Script id="pwa-init" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js');
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
