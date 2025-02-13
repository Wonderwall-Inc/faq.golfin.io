import { CMSLink } from "@/components/Link";
import { Footer } from "@/payload-types";
import { useLocale } from "next-intl";

interface Props {
  category: string
  navItems: Footer['navItems']
}

export const FooterLinkCategory = (props: Props) => {

  const locale = useLocale()

  let localizedCategory: string | null = null

  if (locale === 'ja-jp') {
    switch (props.category) {
      case 'Services':
        localizedCategory = 'サービス'
        break
      case 'Recruitment':
        localizedCategory = '採用'
        break
      case 'About Us':
        localizedCategory = '会社概要'
        break
      default:
        break
    }
  }

  return (
    <div className="flex">
      <div className="mb-3 text-left">
        <h4 className="mb-2 flex text-xl font-bold text-color-primary">
          <span>{localizedCategory ? localizedCategory : props.category ?? ''}</span>
        </h4>
        {props.navItems?.map((navItem, index) => (
          <CMSLink key={index} className="block py-1 text-sm" {...navItem.link} />
        ))}
      </div>
    </div>
  )
}