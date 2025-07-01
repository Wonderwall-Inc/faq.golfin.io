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

interface FaqContentItem {
  heading: string
  faqItems: GolfinGameFaq[]
}

interface FaqContent {
  items: FaqContentItem[]
}

export default async function Page({ params }) {
  const locale = (await params).locale
  setRequestLocale((await params).locale);

  const { categories, faqs } = await queryPageBySlug({
    locale
  })

  if (!faqs || !categories) return null

  const generateCategories = (categories: Category[], faq: FAQ) => {
    let faqContent: FaqContent = {
      items: []
    }

    if (faq.golfinGame) {
      faq.golfinGame.forEach(faq => {
        const currentCategory = categories.filter(category => (category as Category).id === (faq.categories!![0] as Category).id)
        const faqContentCategory = faqContent.items?.filter(item => item?.heading === currentCategory[0].title)

        if (faqContentCategory.length >= 1) {
          faqContentCategory[0]?.faqItems.push(faq)
        } else {
          const newItem: FaqContentItem = {
            heading: currentCategory[0].title,
            faqItems: [faq]
          }
          faqContent.items.push(newItem)
        }
      })
    }

    return faqContent.items.map((item, categoryIndex) =>
      <div key={categoryIndex} className="faq-category-wrapper">
        <h2 className="category-item-heading">{`${categoryIndex + 1}. ${item.heading}`}</h2>
        <ul className="category-content-list-wrapper">
          {item.faqItems.map((faqItem, index) => <FAQListItem faq={faqItem} key={index} />
          )}
        </ul>
        <p></p>
      </div>
    )
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
    limit: 999,
    locale: urlLocaleToLangCodeMap.get(locale),
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