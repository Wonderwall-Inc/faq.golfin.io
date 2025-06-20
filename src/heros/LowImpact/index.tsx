import React from 'react'

import type { Page } from '@/payload-types'

import RichText from '@/components/RichText'

type LowImpactHeroType =
  | {
    children?: React.ReactNode
    richText?: never
  }
  //@ts-ignore
  | (Omit<Page['hero'], 'richText'> & {
    children?: never
    //@ts-ignore
    richText?: Page['hero']['richText']
  })

export const LowImpactHero: React.FC<LowImpactHeroType> = ({ children, richText }) => {
  return (
    <div className="container mt-16">
      <div className="max-w-[48rem]">
        {children || (richText && <RichText data={richText} enableGutter={false} />)}
      </div>
    </div>
  )
}
