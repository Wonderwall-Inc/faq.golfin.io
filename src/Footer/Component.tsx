import React from 'react'

import type { Footer } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { getLocale } from 'next-intl/server'
import { urlLocaleToLangCodeMap } from '@/constants/urlLocaleToLangCodeMap'

type NavItems = Footer['navItems']
interface AboutLinks {
  services: NavItems
  recruitment: NavItems
  about: NavItems
  copyright: NavItems
}

const getAboutLinks = (navItems: NavItems, key: string): NavItems => {
  let aboutLinks: AboutLinks = {
    services: [],
    recruitment: [],
    about: [],
    copyright: []
  }

  navItems?.map(navItem => {
    switch (navItem.footer_link_category) {
      case 'services':
        aboutLinks.services!! = [...aboutLinks.services!!, navItem]
        break
      case 'recruitment':
        aboutLinks.recruitment!! = [...aboutLinks.recruitment!!, navItem]
        break
      case 'about':
        aboutLinks.about!! = [...aboutLinks.about!!, navItem]
        break
      case 'copyright_link':
        aboutLinks.copyright!! = [...aboutLinks.copyright!!, navItem]
        break
      default:
        break;
    }
  })

  return aboutLinks[key]
}

export async function Footer() {
  const payload = await getPayload({ config: configPromise })

  const footer = await payload.findGlobal({
    slug: 'footer',
    depth: 1,
    locale: urlLocaleToLangCodeMap.get(await getLocale())
  })

  const navItems = footer?.navItems || []

  const thisYear = (new Date()).getFullYear();

  return (
    <footer className="footer flex flex-col items-center text-center">
      <div className="w-100p">
        <div className="footer-nav flex flex-col-reverse md:flex-row padding-10 gap-15">
          <nav className="flex flex-row justify-center gap-4">
            {getAboutLinks(navItems, 'copyright')!!.map(({ link }, i) => {
              return <CMSLink className="text-dark-grey" key={i} {...link} />
            })}
          </nav>
          <p>golfin ©︎ {thisYear}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
