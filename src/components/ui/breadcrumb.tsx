import { Link } from '@/i18n/routing';
import { Page } from '@/payload-types';

export type BreadCrumbProp = {
  path: string
  jobPage?: string
  breadcrumbs?:
  | {
    doc?: (number | null) | Page;
    url?: string | null;
    label?: string | null;
    id?: string | null;
  }[]
  | null;
}

export default function BreadCrumb({ breadcrumbs, jobPage, path }: BreadCrumbProp) {

  const paths: {
    path?: string,
    label: string
  }[] = [];

  // Pages created in the Payload CMS will have a 'parent' page
  // This creates a custom 'breadcrumbs' property that gets returned in the response
  // If it's a custom page not managed in CMS (pages that make more sense to be managed in he codebase), this function gets called
  // Ideally it would be removed, but because of some limitations of Payload's CMS (lacking tables, etc)
  // Some pages need to be managed in the codebase

  const renderBreadcrumbs = () => {
    return breadcrumbs!!.map(({ url, label }, index) => {
      if (url !== '/home' && url!!.length) {
        url = url!!.replace('/home', '')

        const isLastElement = index + 1 === breadcrumbs!!.length

        return (
          <li key={index}>
            {isLastElement ? <span>{label}</span> : <Link href={url}>{label}</Link>}
          </li>
        )
      }

      return <></>
    })
  }

  return (
    <div className="breadcrumb">
      <ul className="flex justify-start text-center">
        {renderBreadcrumbs()}
        {jobPage && (
          <li>
            <span>{jobPage}</span>
          </li>
        )}
      </ul>
    </div>
  )
}