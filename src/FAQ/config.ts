import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { Content } from '@/blocks/Content/config'

export const FAQ: GlobalConfig = {
  slug: 'FAQ',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'golfinGame',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true
        },
        {
          type: 'tabs',
          tabs: [
            {
              fields: [
                {
                  name: 'layout',
                  type: 'blocks',
                  blocks: [Content],
                  localized: true
                },
              ],
              label: 'Content',
            },
          ],
        },
      ],
      localized: true,
      maxRows: 6,
    },
  ],
}
