'use client'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

interface FAQItem {
  title: string;
}

export const RowLabel: React.FC<RowLabelProps> = (props) => {
  const data = useRowLabel<NonNullable<FAQItem>>()

  const label = data?.data?.title
    ? `${data?.data?.title}`
    : 'Row'

  return <div>{label}</div>
}