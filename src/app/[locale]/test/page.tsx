import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import '../../_css/test.css'

import { setRequestLocale } from 'next-intl/server'
import { urlLocaleToLangCodeMap } from '@/constants/urlLocaleToLangCodeMap'
import { Category, FAQ } from '@/payload-types'
import { FAQListItem, GolfinGameFaq } from '@/components/FAQ/FAQListItem'

export const dynamic = 'force-static'
export const revalidate = 60

export default async function Page({ params }) {
  const locale = (await params).locale
  setRequestLocale((await params).locale);

  const { categories, faqs } = await queryPageBySlug({
    locale
  })

  if (!faqs || !categories) return null

  const generateCategories = (categories: Category[], faq: FAQ) => {
    return categories.map((category, categoryIndex) => {
      if ((category.parent as Category)?.slug === 'golfin-game') {
        const categoryContentList = ((faq.golfinGame as Array<GolfinGameFaq>).filter(faqs => faqs.categories!!.filter(faqCategory => (faqCategory as Category).title === category.title)))
        return (
          <>
            <h2 className="category-item-heading">{`${(category.parent as Category)?.slug} ${categoryIndex}. ${category.title}`}</h2>
            <ul className="category-content-list-wrapper">
              {categoryContentList.map((categoryContent) => (
                <FAQListItem faq={categoryContent} key={categoryContent.id} />
              ))}
            </ul>
            <p></p>
          </>
        )
      }

      return <></>
    })
  }

  return (
    <article className="w-100p">
      {/* <BreadCrumb breadcrumbs={page.breadcrumbs} path='/recruitment' /> */}
      <section className="pt-12 pb-12 text-center" >
        <div className="py-15 text-left md:py-30 lg:py-0">
          <div className="position">
            {generateCategories(categories, faqs)}
          </div>
        </div>
      </section>
    </article >
  )
}

const queryPageBySlug = cache(async (params) => {
  const { locale } = (await params)
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const categories = await payload.find({
    collection: "categories",
    limit: 999
  })

  const faqs = await payload.findGlobal({
    slug: 'FAQ',
    draft,
    overrideAccess: true,
    locale: urlLocaleToLangCodeMap.get(locale),
  })

  return {
    categories: categories?.docs || null,
    faqs: faqs || null
  }
})