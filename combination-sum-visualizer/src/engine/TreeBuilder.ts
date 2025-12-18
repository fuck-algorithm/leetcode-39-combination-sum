import type { TreeNode, NodeStatus } from '../types';

let nodeIdCounter = 0;

export class TreeBuilder {
  private root: TreeNode | null = null;

  resetCounter(): void {
    nodeIdCounter = 0;
  }

  createRootNode(target: number): TreeNode {
    this.resetCounter();
    this.root = {
      id: 'root',
      value: 0,
      remaining: target,
      status: 'exploring',
      children: [],
      depth: 0,
      pathFromRoot: [],
    };
    return this.root;
  }

  addChildNode(
    parent: TreeNode,
    value: number,
    pathFromRoot: number[]
  ): TreeNode {
    const remaining = parent.remaining - value;
    const child: TreeNode = {
      id: `node-${++nodeIdCounter}`,
      value,
      remaining,
      status: 'idle',
      children: [],
      depth: parent.depth + 1,
      pathFromRoot: [...pathFromRoot],
    };
    parent.children.push(child);
    return child;
  }

  updateNodeStatus(node: TreeNode, status: NodeStatus): void {
    node.status = status;
  }

  findNodeById(nodeId: string): TreeNode | null {
    if (!this.root) return null;
    return this.findNodeRecursive(this.root, nodeId);
  }

  private findNodeRecursive(node: TreeNode, nodeId: string): TreeNode | null {
    if (node.id === nodeId) return node;
    for (const child of node.children) {
      const found = this.findNodeRecursive(child, nodeId);
      if (found) return found;
    }
    return null;
  }

  cloneTree(node: TreeNode): TreeNode {
    return {
      ...node,
      pathFromRoot: [...node.pathFromRoot],
      children: node.children.map((child) => this.cloneTree(child)),
    };
  }

  getRoot(): TreeNode | null {
    return this.root;
  }
}

export const treeBuilder = new TreeBuilder();
