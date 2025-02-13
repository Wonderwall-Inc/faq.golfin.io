import { HeaderClient } from './Component.client'
import React from 'react'
import configPromise from '@payload-config'

import type { Header } from '@/payload-types'
import { getPayload } from 'payload'
import { getLocale } from 'next-intl/server'
import { urlLocaleToLangCodeMap } from '@/constants/urlLocaleToLangCodeMap'

export async function Header() {
  const locale = await getLocale()
  const payload = await getPayload({ config: configPromise })

  const header = await payload.findGlobal({
    slug: 'header',
    depth: 1,
    locale: urlLocaleToLangCodeMap.get(locale)
  })


  return <HeaderClient header={header} />
}
