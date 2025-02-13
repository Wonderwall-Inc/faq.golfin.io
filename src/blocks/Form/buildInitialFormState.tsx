import type { FormFieldBlock } from '@payloadcms/plugin-form-builder/types'

export const buildInitialFormState = (fields: FormFieldBlock[]) => fields?.reduce((initialSchema, field) => {
  switch (field.blockType) {
    case 'checkbox':
      return {
        ...initialSchema,
        [field.name]: field.defaultValue,
      }
    case 'message':
      return {
        ...initialSchema,
        [field.message as string]: '',
      }
    default:
      return {
        ...initialSchema,
        [field.name]: ''
      }
  }
}, {})
