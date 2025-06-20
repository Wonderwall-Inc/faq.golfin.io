"use client"

import { RenderBlocks } from "@/blocks/RenderBlocks";
import { Category, ContentBlock } from "@/payload-types";
import { useState } from "react"

export interface GolfinGameFaq {
  categories?: (number | Category)[] | null;
  title: string;
  layout?: ContentBlock[] | null;
  id?: string | null;
}

export const FAQListItem = ({ faq }: { faq: GolfinGameFaq }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <li onClick={() => setIsOpen(!isOpen)}>
        {faq.title}
      </li>
      {isOpen && (
        <RenderBlocks isFaqTestPage blocks={faq.layout as any} />
      )}
    </>
  )
}
