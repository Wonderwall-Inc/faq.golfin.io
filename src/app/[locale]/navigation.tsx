'use client'

import { TreeComponent } from "@/components/Tree"
import clsx from "clsx"
import { usePathname } from "next/navigation"
import { useState, useEffect } from 'react';

const MobileMenu = ({ setIsMobileMenuOpen, isMobileMenuOpen, nodes }) => {
  const pathname = usePathname()

  useEffect(() => {
    setIsMobileMenuOpen(pathname === '/ja-jp' || pathname === '/en-us' ? true : false)
  }, [pathname, setIsMobileMenuOpen])

  return (
    <>
      <div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`menu-icon flex items-center justify-center rounded-sm hover:bg-green-250 md:hidden ${isMobileMenuOpen ? 'open' : 'close'}`}
        >
          <span className='inline-block h-2 w-full bg-black-100'></span>
        </button>
      </div>
      <div className={clsx('mobile-menu-container', isMobileMenuOpen ? 'mobile-menu-open' : 'mobile-menu-closed')}>
        <nav className="mobile-menu">
          <div className="mobile-menu-content-container">
            <div className="hide-navigation"></div>
            <div>
              <div className="mobile-navigation-content">
                <div className="mobile-navigation-content-container">
                  <ul>
                    <TreeComponent nodes={nodes} />
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  )
}

export const Navigation = ({ nodes }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      <article className={clsx('navigation-wrapper', isMobileMenuOpen && 'mobile-menu-open')}>
        <MobileMenu setIsMobileMenuOpen={setIsMobileMenuOpen} isMobileMenuOpen={isMobileMenuOpen} nodes={nodes} />
        <div className='navigation-container'>
          <nav className='navigation'>
            <div>
              <TreeComponent nodes={nodes} />
            </div>
          </nav>
        </div>
      </article>
    </>
  )
}
