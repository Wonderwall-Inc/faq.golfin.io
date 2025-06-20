'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import LocaleSwitcher from '../LocaleSwitcher/LocaleSwitcher'

interface Props {
  header: HeaderType
  isNavOpen: boolean
}

export const HeaderNav: React.FC<Props> = ({ header, isNavOpen }) => {
  const navItems = header?.navItems || []

  if (isNavOpen) {
    return (
      <nav className="flex gap-3 flex-col items-center">
        {navItems.map(({ link }, i) => {
          return (
            <li className='border-b border-solid border-green-250 w-100p' key={i}>
              <CMSLink {...link} className='font-thin padding-10 text-white' appearance='link' />
            </li>
          )
        })}
      </nav>
    )
  }

  return (
    <nav className="flex gap-30 items-center">
      {navItems.map(({ link }, i) => {
        return (
          <li key={i}>
            {/* <CMSLink {...link} className='font-thin text-white' appearance='link' /> */}
          </li>
        )
      })}
      <LocaleSwitcher />
    </nav>
  )
}
