'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { HeaderNav } from './Nav'
import { useLocale } from 'next-intl'
import LocaleSwitcher from './LocaleSwitcher/LocaleSwitcher'
import Link from 'next/link'

interface HeaderClientProps {
  header: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ header }) => {
  const locale = useLocale()
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  const [values, setValues] = useState({
    isNavOpen: false,
    isOpened: false,
  });

  const navToggleClick = () => {
    setValues({
      ...values,
      isNavOpen: !values.isNavOpen,
      isOpened: true
    });
  }

  return (
    <>
      <header className="font-thin nav-container sticky top-0 z-50 flex items-center lg:items-start flex-col justify-start bg-color-navigation text-white-100">
        <div className="m-auto flex items-center w-100p justify-between padding-10 lg:padding-y-15">
          <div className="">
            <a
              href="/"
            >
              <Image src="/Golfin_main_logotype.svg" alt="Golfin Logo" width={194} height={40} priority={true} />
            </a>
          </div>
          <div className='flex items-center'>
            <ul className='items-center justify-end gap-15 md:flex md:gap-30'>
              <HeaderNav header={header} isNavOpen={false} />
            </ul>
          </div>
        </div>
      </header>
    </>
  )
}
