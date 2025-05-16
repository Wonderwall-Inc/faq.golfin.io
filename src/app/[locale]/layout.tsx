import type { Metadata } from 'next'
import React, { cache } from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import configPromise from '@payload-config'
import '../_css/globals.css'
import { draftMode } from 'next/headers'
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import { Navigation } from './navigation'
import { getPayload } from 'payload'
import { urlLocaleToLangCodeMap } from '@/constants/urlLocaleToLangCodeMap'
import { createTreeNodes } from '@/utilities/createTreeNodes'

export function generateStaticParams() {
  return ['ja-jp', 'en-us'].map(locale => ({ locale }))
}

export default async function RootLayout({ children, params }: { children: React.ReactNode, params: Promise<{ locale: string }> }) {
  const locale = (await params).locale
  setRequestLocale(locale);
  const { isEnabled } = await draftMode()

  if (!routing.locales.includes(locale as any)) notFound();

  const pages = await queryPages({ locale })

  const { treeNodes } = createTreeNodes(pages)

  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />
          <LivePreviewListener />

          <NextIntlClientProvider messages={messages}>
            <Header />
            <main className='bg-white-100 main-wrapper'>
              {/* <Navigation nodes={treeNodes} /> */}
              {children}
            </main>
            <Footer />
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'https://payloadcms.com'),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}

const queryPages = cache(async (params) => {
  const { locale } = (await params)
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    overrideAccess: true,
    limit: 999,
    locale: urlLocaleToLangCodeMap.get(locale),
    fallbackLocale: locale === 'ja-jp' ? 'en' : 'ja'
  })

  return result.docs
})