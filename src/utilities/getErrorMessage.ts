
interface Props {
  label: string
  errorType: string
  locale: string
}

export const getErrorMessage = ({ errorType, label, locale }: Props) => {

  if (errorType === 'required') {
    if (locale === 'ja-jp') {
      return `${label}を入力してください。`
    }

    if (locale === 'en-us') {
      return `This field is required.`
    }
  }

  return ''
}
