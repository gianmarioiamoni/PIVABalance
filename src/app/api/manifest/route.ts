import { NextRequest, NextResponse } from "next/server";

/**
 * Manifest.json API Route
 * Serves the PWA manifest without authentication
 */

export async function GET(_request: NextRequest) {
  const manifest = {
    name: "PIVABalance - Gestione Finanziaria",
    short_name: "PIVABalance",
    description: "Sistema completo di gestione bilancio per freelancer e partite IVA",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#667eea",
    orientation: "portrait-primary",
    categories: ["business", "finance", "productivity"],
    lang: "it",
    dir: "ltr",
    icons: [
      {
        src: "/icons/icon-72x72.svg",
        sizes: "72x72",
        type: "image/svg+xml",
        purpose: "any"
      },
      {
        src: "/icons/icon-96x96.svg", 
        sizes: "96x96",
        type: "image/svg+xml",
        purpose: "any"
      },
      {
        src: "/icons/icon-128x128.svg",
        sizes: "128x128", 
        type: "image/svg+xml",
        purpose: "any"
      },
      {
        src: "/icons/icon-144x144.svg",
        sizes: "144x144",
        type: "image/svg+xml",
        purpose: "any"
      },
      {
        src: "/icons/icon-152x152.svg",
        sizes: "152x152",
        type: "image/svg+xml", 
        purpose: "any"
      },
      {
        src: "/icons/icon-192x192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "any maskable"
      },
      {
        src: "/icons/icon-384x384.svg",
        sizes: "384x384",
        type: "image/svg+xml",
        purpose: "any"
      },
      {
        src: "/icons/icon-512x512.svg", 
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any maskable"
      }
    ],
    shortcuts: [
      {
        name: "Dashboard",
        short_name: "Dashboard", 
        description: "Vai alla dashboard principale",
        url: "/dashboard",
        icons: [{ src: "/icons/icon-96x96.svg", sizes: "96x96" }]
      },
      {
        name: "Fatture",
        short_name: "Fatture",
        description: "Gestisci le fatture",
        url: "/dashboard/invoices", 
        icons: [{ src: "/icons/icon-96x96.svg", sizes: "96x96" }]
      },
      {
        name: "Costi",
        short_name: "Costi",
        description: "Gestisci i costi",
        url: "/dashboard/costs",
        icons: [{ src: "/icons/icon-96x96.svg", sizes: "96x96" }]
      }
    ]
  };

  return NextResponse.json(manifest, {
    status: 200,
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'public, max-age=86400', // Cache for 1 day
    },
  });
}
