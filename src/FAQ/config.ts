import type { GlobalConfig } from 'payload'
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
          name: 'categories',
          type: 'relationship',
          admin: {
            position: 'sidebar',
          },
          hasMany: true,
          relationTo: 'categories',
        },
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
