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
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import { Navigation } from './navigation'
import { getPayload } from 'payload'
import { urlLocaleToLangCodeMap } from '@/constants/urlLocaleToLangCodeMap'

export function generateStaticParams() {
  return ['ja-jp', 'en-us'].map(locale => ({ locale }))
}

export default async function RootLayout({ children, params }: { children: React.ReactNode, params: Promise<{ locale: string }> }) {
  const locale = (await params).locale
  setRequestLocale(locale);
  const { isEnabled } = await draftMode()

  if (!routing.locales.includes(locale as any)) notFound();

  const pages = await queryPages({ locale })

  let withChildrenNodes: any[] = []
  let withoutChildrenNodes: any[] = []

  // Loop through all pages and determine if a page has a parent node
  // If it does, find the parent page and add the current page as a child to the parent page
  const addChildPagesToParentPage = () => pages.forEach(pageX => {
    if (pageX.parent !== null) {
      pages.filter(pageY => {
        if (pageY.title === (pageX.parent as any).title) {
          // @ts-ignore
          pageY.children = pageY.children ? [...pageY.children] : []
          // @ts-ignore
          pageY.children.push(pageX)
        }
      })
    }
  })

  // Loop through the children property and modify some properties
  // Convert id to string and add 'name' property to allow the Tree library to render the data
  const updateTreeChildrenValues = (treeNode) => {
    for (let childNode of treeNode) {
      childNode.id = childNode.slug
      childNode.label = childNode.title

      if (childNode.children && Array.isArray(childNode.children) && childNode.children.length > 0) {
        updateTreeChildrenValues(childNode.children)
      }
    }

    return treeNode
  };

  // Create the tree/tree nodes for the sidebar
  const createTrees = () => {
    addChildPagesToParentPage()

    pages.map(({ parent, id, title, slug, ...page }) => {
      // @ts-ignore
      const isRootPageWithChildren = parent === null && page.children?.length

      if (isRootPageWithChildren) {
        // @ts-ignore
        page.children = updateTreeChildrenValues(page.children)
        withChildrenNodes.push({
          id: slug,
          label: title,
          // @ts-ignore
          children: page.children
        })
      } else if (parent === null) {
        withoutChildrenNodes.push({
          id: slug,
          label: title
        })
      }
    })
  }

  createTrees()

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

          <NextIntlClientProvider messages={{}}>
            <Header />
            <main className='bg-white-100 main-wrapper'>
              <Navigation nodes={[...withoutChildrenNodes, ...withChildrenNodes]} />
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