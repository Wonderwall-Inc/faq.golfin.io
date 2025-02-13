import type { TextField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Label } from '@/components/ui/label'
import { Textarea as TextAreaComponent } from '@/components/ui/textarea'
import React from 'react'

import { Error } from '../Error'
import { Width } from '../Width'
import { useLocale } from 'next-intl'

export const Textarea: React.FC<
  TextField & {
    errors: Partial<
      FieldErrorsImpl<{
        [x: string]: any
      }>
    >
    register: UseFormRegister<FieldValues>
    rows?: number
  }
> = ({
  name,
  defaultValue,
  errors,
  label,
  register,
  required: requiredFromProps,
  rows = 9,
  width,
}) => {
    const locale = useLocale()
    return (
      <Width width={width}>
        <div className='flex mb-2 gap-[5px]'>
          <Label htmlFor={name}>{label}</Label>
          {requiredFromProps && errors[name] && label &&
            <Error customError={{ errorType: 'required', label, locale }} />
          }
        </div>

        <TextAreaComponent
          defaultValue={defaultValue}
          id={name}
          rows={rows}
          {...register(name, { required: requiredFromProps })}
        />

      </Width>
    )
  }
