import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { generateMeta } from '@/utilities/generateMeta'
import { setRequestLocale } from 'next-intl/server';
import { urlLocaleToLangCodeMap } from '@/constants/urlLocaleToLangCodeMap'

export const dynamic = 'force-static'

export default async function Page({ params }) {
  const { locale } = (await params)
  setRequestLocale(locale);

  const page = await queryPageBySlug({ locale, slug: 'home' })

  return (
    <article>
    </article>
  )
}

export async function generateMetadata({ params }): Promise<Metadata> {
  const { slug } = (await params)
  const page = await queryPageBySlug({
    slug,
  })

  return generateMeta({ doc: page })
}

const queryPageBySlug = cache(async (params) => {
  const { locale, slug } = (await params)
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    overrideAccess: true,
    locale: urlLocaleToLangCodeMap.get(locale),
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})