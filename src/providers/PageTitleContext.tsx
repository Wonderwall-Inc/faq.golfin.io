
'use client'
import React, { PropsWithChildren, useState } from 'react';

export interface PageTitleContextTypes {
  pageTitle: string;
  setPageTitle: (pageTitle: string) => void;
}

const PageTitleContext = React.createContext<PageTitleContextTypes>({} as PageTitleContextTypes);

export const PageTitleProvider: React.FC<PropsWithChildren> = (props) => {
  const [pageTitle, setPageTitle] = useState<string>();

  if (!pageTitle) return null;

  return (
    <PageTitleContext.Provider value={{ pageTitle, setPageTitle }}>
      {props.children}
    </PageTitleContext.Provider>
  );
};

export const usePageTitleContext = () => React.useContext(PageTitleContext);