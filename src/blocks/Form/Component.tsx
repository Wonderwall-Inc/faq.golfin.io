'use client'
import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'

import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import RichText from '@/components/RichText'
import { Button } from '@/components/ui/button'

import { buildInitialFormState } from './buildInitialFormState'
import { fields } from './fields'
import { SerializedEditorState } from 'lexical'

export type Value = unknown

export interface Property {
  [key: string]: Value
}

export interface Data {
  [key: string]: Property | Property[]
}

export type FormBlockType = {
  blockName?: string
  blockType?: 'formBlock'
  enableIntro: boolean
  form: FormType
  introContent?: SerializedEditorState
}

interface DataToSend {
  field: string
  value: Property | Property[]
}

interface FormValues {
  name: string | null
  email: string | null
  message: string | null
}

const sendToPayloadFormSubmission = async (formID: string | undefined, dataToSend: DataToSend[]) => {
  return fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/form-submissions`, {
    body: JSON.stringify({
      form: formID,
      submissionData: dataToSend,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })
}

const sendToWonderWall = async (formValues: FormValues) => {
  return fetch('/api/email', {
    body: JSON.stringify({
      name: formValues['name'],
      email: formValues['email'],
      message: formValues['message']
    }),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
  });
}

export const FormBlock: React.FC<
  {
    id?: string
  } & FormBlockType
> = (props) => {
  const {
    enableIntro,
    form: formFromProps,
    form: { id: formID, confirmationMessage, confirmationType, redirect, submitButtonLabel } = {},
    introContent,
  } = props

  const formMethods = useForm({
    defaultValues: buildInitialFormState(formFromProps.fields),
  })
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = formMethods

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>()
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()
  const router = useRouter()

  const onSubmit = useCallback(
    (data: Data) => {
      let loadingTimerID: ReturnType<typeof setTimeout>
      const submitForm = async () => {
        setError(undefined)

        const dataToSend = Object.entries(data).map(([name, value]) => ({
          field: name,
          value,
        }))

        // delay loading indicator by 1s
        loadingTimerID = setTimeout(() => {
          setIsLoading(true)
        }, 1000)

        try {
          let req
          let formValues: FormValues = {
            name: null,
            email: null,
            message: null
          }

          if (process.env.NODE_ENV !== 'production') {
            dataToSend.forEach(data => {
              if (data.field === 'name' || data.field === 'email' || data.field === 'message') {
                formValues = { ...formValues, [data.field]: data.value }
              }
            }
            )

            if (!formValues['name'] || !formValues['email'] || !formValues['message']) {
              console.error(`Contact form was missing a name, email, or message field. Submitting to form-submissions. Payload: ${formValues}`)
              req = await sendToPayloadFormSubmission(formID, dataToSend)
            } else {
              req = await sendToWonderWall(formValues)
            }
          } else {
            req = await sendToPayloadFormSubmission(formID, dataToSend)
          }

          const res = await req.json()

          clearTimeout(loadingTimerID)

          if (res.status >= 400) {
            setIsLoading(false)

            setError({
              message: res.errors?.[0]?.message || 'Internal Server Error.',
              status: res.status,
            })

            return
          }

          setIsLoading(false)
          setHasSubmitted(true)

          if (confirmationType === 'redirect' && redirect) {
            const { url } = redirect
            const redirectUrl = url
            if (redirectUrl) router.push(redirectUrl)
          }
        } catch (err) {
          console.warn(err)
          setIsLoading(false)
          setError({ message: 'Something went wrong.', })
        }
      }

      void submitForm()
    },
    [router, formID, redirect, confirmationType],
  )

  return (
    <div className="container lg:max-w-[48rem] pb-20">
      {enableIntro && introContent && !hasSubmitted && (
        <RichText className="mb-8" data={introContent} enableGutter={false} />
      )}
      <FormProvider {...formMethods}>
        {!isLoading && hasSubmitted && confirmationType === 'message' && (
          <RichText data={confirmationMessage} />
        )}
        {isLoading && !hasSubmitted && <p>Loading, please wait...</p>}
        {error && <div style={{ color: 'red' }}>{`${error.status || '500'}: ${error.message || ''}`}</div>}
        {!hasSubmitted && (
          <form id={formID} onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4 last:mb-0">
              {formFromProps.fields?.map((field, index) => {
                const Field: React.FC<any> = fields?.[field.blockType]
                if (Field) {
                  return (
                    <div className="mb-6 last:mb-0" key={index}>
                      <Field
                        form={formFromProps}
                        {...field}
                        {...formMethods}
                        control={control}
                        errors={errors}
                        register={register}
                      />
                    </div>
                  )
                }
                return null
              })}
            </div>

            <Button form={formID} type="submit" variant="default">
              {submitButtonLabel}
            </Button>
          </form>
        )}
      </FormProvider>
    </div>
  )
}
