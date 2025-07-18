'use client'

import type { StaticImageData } from 'next/image'

import { cn } from 'src/utilities/cn'
import NextImage from 'next/image'
import React from 'react'

import type { Props as MediaProps } from '../types'

import cssVariables from '@/cssVariables'

const { breakpoints } = cssVariables

interface ImageMediaProps extends MediaProps {
  maxWidth?: string
  maxHeight?: string
}

export const ImageMedia: React.FC<ImageMediaProps> = (props) => {
  const {
    alt: altFromProps,
    fill,
    imgClassName,
    onClick,
    onLoad: onLoadFromProps,
    priority,
    resource,
    size: sizeFromProps,
    src: srcFromProps,
    placeholder,
    blurDataSrc,
    maxHeight,
    maxWidth
  } = props

  // const [isLoading, setIsLoading] = React.useState(true)

  let width: number | undefined
  let height: number | undefined
  let blurDataUrl: string | undefined
  let alt = altFromProps
  let src: StaticImageData | string = srcFromProps || ''

  if (!src && resource && typeof resource === 'object') {
    const {
      alt: altFromResource,
      filename: fullFilename,
      height: fullHeight,
      url,
      width: fullWidth,
    } = resource

    width = fullWidth!
    height = fullHeight!
    alt = altFromResource

    // setblurDataSrc(resource.url!!)
    src = process.env.NODE_ENV === 'development' ? `${process.env.NEXT_PUBLIC_SERVER_URL}${url}` : `${url}`
  }

  // NOTE: this is used by the browser to determine which image to download at different screen sizes
  const sizes = sizeFromProps
    ? sizeFromProps
    : Object.entries(breakpoints)
      .map(([, value]) => `(max-width: ${value}px) ${value}px`)
      .join(', ')

  return (
    <NextImage
      alt={alt || ''}
      className={`${cn(imgClassName)}, next-responsive-image`}
      onClick={onClick}
      onLoad={() => {
        // setIsLoading(false)
        if (typeof onLoadFromProps === 'function') {
          onLoadFromProps()
        }
      }}
      priority={priority}
      quality={90}
      blurDataURL={blurDataSrc}
      placeholder={placeholder}
      sizes={sizes}
      src={src}
      width={0}
      height={0}
      style={{
        width: fill ? '100%' : width,
        height: fill ? 'auto' : height,
        maxWidth: props.maxWidth,
        maxHeight: props.maxHeight
      }}
    />
  )
}
