import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'


export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      localized: true,
      fields: [
        link({
          appearances: false,
        }),
        {
          name: 'footer_link_category',
          type: 'radio',
          options: [
            {
              label: 'Services',
              value: 'services',
            },
            {
              label: 'Recruitment',
              value: 'recruitment',
            },
            {
              label: 'About',
              value: 'about',
            },
            {
              label: 'Copyright Link',
              value: 'copyright_link',
            },
          ],
          label: 'Link Category',
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
