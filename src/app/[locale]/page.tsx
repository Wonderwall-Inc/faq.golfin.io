import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import { generateMeta } from '@/utilities/generateMeta'
import { setRequestLocale } from 'next-intl/server'
import { urlLocaleToLangCodeMap } from '@/constants/urlLocaleToLangCodeMap'
import { RenderBlocks } from '@/blocks/RenderBlocks'

export const dynamic = 'force-static'
export const revalidate = 60

export default async function Page({ params }) {
  const locale = (await params).locale
  setRequestLocale((await params).locale);

  // const page = await queryPageBySlug({
  //   locale
  // })

  // console.log({ page })

  // if (!page) return null

  return (
    <article className="w-100p lg:m-auto">
      {/* <BreadCrumb breadcrumbs={page.breadcrumbs} path='/recruitment' /> */}
      <section className="pb-12 text-center" >
        <div className="py-15 text-left md:py-30 lg:py-0">
          <div className="position">
            {/* <RenderBlocks blocks={page.layout as any} /> */}
          </div>
        </div>
      </section>
    </article >
  )
}

export async function generateMetadata({ params }): Promise<Metadata> {
  const { locale } = (await params)
  const page = await queryPageBySlug({
    locale,
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
    limit: 999,
    overrideAccess: true,
    locale: urlLocaleToLangCodeMap.get(locale),
  })

  return result.docs?.[0] || null
})