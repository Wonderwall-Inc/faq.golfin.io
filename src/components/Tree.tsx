'use client'

import { Page } from "@/payload-types";
import Box from '@mui/material/Box';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { forwardRef } from "react";
import '../app/_css/tree.css'
import { TreeItem2, TreeItem2Props } from "@mui/x-tree-view/TreeItem2";
import Link from "next/link";
import clsx from "clsx";


export type TreePage = Page & { name: string }

interface TreeNode {
  id: string
  name: string
  slug: any
  children?: TreePage[]
}

const CustomTreeItem = forwardRef(function CustomTreeItem(
  props: TreeItem2Props,
  ref: React.Ref<HTMLLIElement>,
) {
  const renderLabel = () => {
    if (props.children) {
      return props.label
    }

    return <Link href={props.itemId}>{props.label}</Link>
  }

  return (
    <TreeItem2
      className={clsx(props.children && 'navigation-tree')}
      {...props}
      ref={ref}
      label={renderLabel()}
    >
      {props.children}
    </TreeItem2>
  );
});

export const TreeComponent = ({ nodes }: { nodes: TreeNode[] }) => {
  return (
    <Box sx={{ padding: '15px', minHeight: 352, minWidth: 300, maxWidth: 300 }}>
      <RichTreeView autoFocus items={nodes} slots={{ item: CustomTreeItem }} />
    </Box>
  )
}