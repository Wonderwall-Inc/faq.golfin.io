import { Page } from "@/payload-types"


// Loop through all pages and determine if a page has a parent node
// If it does, find the parent page and add the current page as a child to the parent page
const addChildPagesToParentPage = (pages: Page[]) => {
  pages.forEach(pageX => {
    if (pageX.parent !== null) {
      pages.forEach(pageY => {
        if (pageY.title === (pageX.parent as any).title) {
          // Initialize children array if it doesn't exist
          // @ts-ignore
          pageY.children = pageY.children || [];

          // Check for duplicate children based on `slug`
          // @ts-ignore
          if (!pageY.children.some(child => child.slug === pageX.slug)) {
            // @ts-ignore
            pageY.children.push(pageX); // Add only if not already present
          }
        }
      });
    }
  });
};

// Loop through the children property and modify some properties
// Convert id to string and add 'name' property to allow the Tree library to render the data
const updateTreeChildrenValues = (treeNode) => {
  for (let childNode of treeNode) {
    childNode.id = childNode.slug
    childNode.label = childNode.title

    if (childNode.children && Array.isArray(childNode.children) && childNode.children.length > 0) {
      updateTreeChildrenValues(childNode.children)
    }
  }

  return treeNode
};

// Create the tree/tree nodes for the sidebar
export const createTreeNodes = (pages: Page[]) => {
  addChildPagesToParentPage(pages);

  const nodes: any[] = [];
  pages.forEach(({ parent, title, slug, ...page }) => {
    if (slug !== 'privacy-policy' && slug !== 'terms-of-use') {

      if (parent === null) {
        const treeNode = {
          id: slug, // Use unique slug
          label: title,
          // @ts-ignore
          ...(page.children?.length >= 1 && { children: updateTreeChildrenValues(page.children) }),
        };
        nodes.push(treeNode);
      }
    }
  });

  return { treeNodes: nodes };
};
