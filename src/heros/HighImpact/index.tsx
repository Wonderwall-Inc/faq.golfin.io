'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { PlaceholderValue } from 'next/dist/shared/lib/get-img-props'

export const HighImpactHero: React.FC<Page['hero'] & { blurDataSrc?: string, placeholder?: PlaceholderValue }> = ({ blurDataSrc, links, media, placeholder, richText }) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  })

  return (
    <div className="relative h-[300px] bg-red-50 text-center text-white-100 md:h-[450px] lg:h-[553px]" data-theme="dark">
      <div className="absolute top-0 left-0 z-10 h-full w-full">
        {media && typeof media === 'object' && (
          <Media fill imgClassName="-z-10 object-cover hero-img" placeholder={placeholder} blurDataSrc={blurDataSrc} priority resource={media} />
        )}
      </div>
      <div className="w-100p lg:w-960 relative z-20 mx-auto flex h-full flex-col items-start justify-center px-[15px] lg:px-0 py-10 text-left text-white font-thin md:py-15">
        <div className="max-w-[34rem]">
          {richText && <RichText className="high-impact-text mb-6 text-white" data={richText} enableGutter={false} />}
          {Array.isArray(links) && links.length > 0 && (
            <ul className="flex gap-4">
              {links.map(({ link }, i) => {
                return (
                  <li key={i}>
                    <CMSLink {...link} />
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
