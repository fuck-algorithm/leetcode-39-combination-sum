import type { AlgorithmStep, TreeNode, NodeStatus } from '../types';
import { CodeLine } from '../types';

let nodeIdCounter = 0;

function createNode(
  value: number,
  remaining: number,
  depth: number,
  pathFromRoot: number[],
  status: NodeStatus = 'idle'
): TreeNode {
  return {
    id: depth === 0 ? 'root' : `node-${nodeIdCounter++}`,
    value,
    remaining,
    status,
    children: [],
    depth,
    pathFromRoot: [...pathFromRoot],
  };
}

function cloneTree(node: TreeNode): TreeNode {
  return {
    ...node,
    pathFromRoot: [...node.pathFromRoot],
    children: node.children.map(cloneTree),
  };
}

export function findNode(root: TreeNode, nodeId: string): TreeNode | null {
  if (root.id === nodeId) return root;
  for (const child of root.children) {
    const found = findNode(child, nodeId);
    if (found) return found;
  }
  return null;
}

export function generateSteps(candidates: number[], target: number): AlgorithmStep[] {
  nodeIdCounter = 0;
  const steps: AlgorithmStep[] = [];
  const combinations: number[][] = [];
  
  const root = createNode(0, target, 0, []);
  root.status = 'exploring';

  steps.push({
    type: 'start',
    nodeId: root.id,
    currentPath: [],
    remainingSum: target,
    currentCandidate: null,
    candidateIndex: 0,
    codeLine: CodeLine.FUNCTION_START,
    treeSnapshot: cloneTree(root),
    description: `调用 dfs(${target}, [], 0)`,
  });

  function dfs(currentNode: TreeNode, combine: number[], remaining: number, idx: number): void {
    if (idx === candidates.length) {
      steps.push({
        type: 'backtrack',
        nodeId: currentNode.id,
        currentPath: [...combine],
        remainingSum: remaining,
        currentCandidate: null,
        candidateIndex: idx,
        codeLine: CodeLine.BASE_CASE_FAIL,
        treeSnapshot: cloneTree(root),
        description: `idx=${idx} 到达数组末尾`,
      });
      return;
    }

    if (remaining === 0) {
      currentNode.status = 'success';
      const combination = [...combine];
      combinations.push(combination);
      steps.push({
        type: 'found',
        nodeId: currentNode.id,
        currentPath: [...combine],
        remainingSum: 0,
        currentCandidate: combine[combine.length - 1] ?? null,
        candidateIndex: idx,
        codeLine: CodeLine.BASE_CASE_SUCCESS,
        treeSnapshot: cloneTree(root),
        foundCombination: combination,
        description: `找到组合: [${combination.join(', ')}]`,
      });
      return;
    }

    const candidate = candidates[idx];

    steps.push({
      type: 'recurse',
      nodeId: currentNode.id,
      currentPath: [...combine],
      remainingSum: remaining,
      currentCandidate: candidate,
      candidateIndex: idx,
      codeLine: CodeLine.SKIP,
      treeSnapshot: cloneTree(root),
      description: `跳过 ${candidate}`,
    });

    dfs(currentNode, combine, remaining, idx + 1);

    const newRemaining = remaining - candidate;
    
    if (newRemaining >= 0) {
      const childNode = createNode(candidate, newRemaining, currentNode.depth + 1, [...combine, candidate]);
      childNode.status = 'exploring';
      currentNode.children.push(childNode);

      combine.push(candidate);
      
      steps.push({
        type: 'choose',
        nodeId: childNode.id,
        currentPath: [...combine],
        remainingSum: newRemaining,
        currentCandidate: candidate,
        candidateIndex: idx,
        codeLine: CodeLine.CHOOSE,
        treeSnapshot: cloneTree(root),
        description: `选择 ${candidate}`,
      });

      steps.push({
        type: 'recurse',
        nodeId: childNode.id,
        currentPath: [...combine],
        remainingSum: newRemaining,
        currentCandidate: candidate,
        candidateIndex: idx,
        codeLine: CodeLine.RECURSE,
        treeSnapshot: cloneTree(root),
        description: `递归 dfs(${newRemaining}, [${combine.join(',')}], ${idx})`,
      });

      dfs(childNode, combine, newRemaining, idx);

      combine.pop();
      
      if ((childNode.status as NodeStatus) !== 'success') {
        childNode.status = 'backtracked';
      }
      
      steps.push({
        type: 'backtrack',
        nodeId: childNode.id,
        currentPath: [...combine],
        remainingSum: remaining,
        currentCandidate: candidate,
        candidateIndex: idx,
        codeLine: CodeLine.UNCHOOSE,
        treeSnapshot: cloneTree(root),
        description: `回溯 ${candidate}`,
      });
    } else {
      const prunedNode = createNode(candidate, newRemaining, currentNode.depth + 1, [...combine, candidate]);
      prunedNode.status = 'pruned';
      currentNode.children.push(prunedNode);

      steps.push({
        type: 'prune',
        nodeId: prunedNode.id,
        currentPath: [...combine, candidate],
        remainingSum: newRemaining,
        currentCandidate: candidate,
        candidateIndex: idx,
        codeLine: CodeLine.PRUNE,
        treeSnapshot: cloneTree(root),
        description: `剪枝 ${candidate}`,
      });
    }
  }

  dfs(root, [], target, 0);

  root.status = 'idle';
  steps.push({
    type: 'complete',
    nodeId: root.id,
    currentPath: [],
    remainingSum: target,
    currentCandidate: null,
    candidateIndex: -1,
    codeLine: CodeLine.RETURN,
    treeSnapshot: cloneTree(root),
    description: `完成，找到 ${combinations.length} 个组合`,
  });

  return steps;
}

export const BacktrackingEngine = { generateSteps };
