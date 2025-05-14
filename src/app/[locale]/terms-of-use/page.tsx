

import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import { generateMeta } from '@/utilities/generateMeta'
import { setRequestLocale } from 'next-intl/server'
import { urlLocaleToLangCodeMap } from '@/constants/urlLocaleToLangCodeMap'
import { RenderBlocks } from '@/blocks/RenderBlocks'

import '../../_css/slug.css'

export const dynamic = 'force-static'
export const revalidate = 60

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    where: {
      slug: {
        equals: 'terms-of-use'
      }
    }
  })
  return posts.docs?.map(({ slug }) => ({ slug }))
}

export default async function Page({ params }) {
  const locale = (await params).locale
  setRequestLocale((await params).locale);
  const { slug } = (await params)

  const page = await queryPageBySlug({
    locale,
    slug,
  })

  if (!page) return null

  return (
    <article className="w-100p lg:m-auto">
      {/* <BreadCrumb breadcrumbs={page.breadcrumbs} path='/recruitment' /> */}
      <section className="pb-12 text-center" >
        <div className="py-15 text-left md:py-30 lg:py-0">
          <div className="position">
            <RenderBlocks blocks={page.layout as any} />
          </div>
        </div>
      </section>
    </article >
  )
}

export async function generateMetadata({ params }): Promise<Metadata> {
  const { locale, slug } = (await params)
  const page = await queryPageBySlug({
    locale,
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
        equals: 'terms-of-use'
      }
    },
  })

  return result.docs?.[0] || null
})