import { getErrorMessage } from '@/utilities/getErrorMessage'
import * as React from 'react'

interface Props {
  customError?: {
    errorType: string
    label: string
    locale: string
  }
  message?: string
}



export const Error: React.FC<Props> = ({ customError, message }) => {
  let errorMessage: string | null = customError ? getErrorMessage(customError) : message ?? ''
  return <div className="leading-none text-red-500 font-bold text-sm">{errorMessage}</div>
}
