import { TourItem } from '@app/shared/tour/Tour';

/**
 * Tour Item node
 */
export class TourItemTreeNode {
  private parent: TourItemTreeNode | null;
  private children: Array<TourItemTreeNode> = [];
  private data: TourItem;

  /**
   * @param data
   * @param document
   */
  constructor(data: any = null, private readonly document: Document) {
    this.data = data;
  }

  /**
   * Converts tour items array to tree structure
   * @param array
   * @param document
   * @returns {TourItemTreeNode}
   */
  static fromArray(array: Array<TourItem>, document: Document): TourItemTreeNode {
    const rootNode = new TourItemTreeNode(null, document);
    let parentNode: TourItemTreeNode;
    for (let i = 0; i < array.length; i++) {
      const step = array[i];
      const previousStep = i > 0 && array[i - 1];
      if (!step.is_optional) {
        parentNode = rootNode.insert(new TourItemTreeNode(step, document));
        continue;
      }
      if (!!!parentNode) {
        parentNode = rootNode;
      }
      if (step.is_optional && step.is_clickable && step.is_expandable && document.querySelector(step.css_selector) === null) {
        continue;
      }
      if (step.is_optional && (step.is_clickable || step.is_expandable)) {
        if (
          previousStep.is_optional &&
          (previousStep?.is_clickable || previousStep?.is_expandable) &&
          !(previousStep.is_clickable && previousStep.is_expandable)
        ) {
          if (document.querySelector(previousStep.css_selector) === null && !!!parentNode?.parent) {
            continue;
          }
          const newNode = new TourItemTreeNode(step, document);
          parentNode.insert(newNode);
          parentNode = newNode;
          continue;
        }
        parentNode = rootNode.insert(new TourItemTreeNode(step, document));
        continue;
      }

      if (step.is_optional && !previousStep.is_optional && !previousStep.is_clickable && !previousStep.is_expandable) {
        parentNode = rootNode.insert(new TourItemTreeNode(step, document));
        continue;
      }

      parentNode.insert(new TourItemTreeNode(step, document));
    }
    return rootNode;
  }

  /**
   * Finds node that has provided selector
   * @param element
   * @param cssSelector
   * @returns {any}
   */
  static findBySelector(element: TourItemTreeNode, cssSelector: string): TourItemTreeNode | null {
    if (element?.data?.css_selector === cssSelector) {
      return element;
    } else if (element.hasChildren()) {
      let result = null;
      for (let i = 0; result == null && i < element.children.length; i++) {
        result = this.findBySelector(element.children[i], cssSelector);
      }
      return result;
    }
    return null;
  }

  /**
   * Finds visible parents with their children
   * @returns {Array<TourItem>}
   */
  findVisibleItems(): TourItem[] {
    const visibleItemsWithChildren: Array<TourItem> = [];
    this.children.forEach(child => {
      if (this.document.querySelector(child.data.css_selector) !== null) {
        this.appendChildTilLastChild(child, visibleItemsWithChildren);
      }
    });
    return visibleItemsWithChildren;
  }

  /**
   * Finds items that should be clicked
   * @param cssSelector
   * @returns {TourItem[]}
   */
  findTourItemsToClick(cssSelector: string): TourItem[] {
    const selectorsToClick: Array<TourItem> = [];
    const element = TourItemTreeNode.findBySelector(this, cssSelector);
    if (element !== null) {
      this.appendChildTilRoot(element, selectorsToClick);
    }
    return selectorsToClick.reverse();
  }

  /**
   * Insert tree node
   * @param node
   * @returns {TourItemTreeNode}
   */
  insert(node: TourItemTreeNode): TourItemTreeNode {
    node.parent = this;
    this.children.push(node);
    return node;
  }

  /**
   * Checks if node has children
   * @returns {boolean}
   */
  hasChildren(): boolean {
    return !!this.children.length;
  }

  /**
   * Appends child till root
   * @param element
   * @param selectorsToClick
   * @returns {any}
   */
  private appendChildTilRoot(element: TourItemTreeNode, selectorsToClick: Array<TourItem>): any {
    if (element.parent) {
      if (element.data.is_clickable || element.data.is_expandable) {
        selectorsToClick.push(element.data);
      }
      return this.appendChildTilRoot(element.parent, selectorsToClick);
    }
  }

  /**
   * Appends child till last child
   * @param element
   * @param selectorsToClick
   * @returns {any}
   */
  private appendChildTilLastChild(element: TourItemTreeNode, selectorsToClick: Array<TourItem>): any {
    if (this.document.querySelector(element.data.css_selector) !== null) {
      selectorsToClick.push(element.data);
    }
    if (element.hasChildren()) {
      let result = null;
      for (let i = 0; result == null && i < element.children.length; i++) {
        result = this.appendChildTilLastChild(element.children[i], selectorsToClick);
      }
      return result;
    }
  }
}
