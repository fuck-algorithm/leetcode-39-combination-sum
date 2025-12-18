// Node status in the backtracking tree
export type NodeStatus = 'exploring' | 'success' | 'pruned' | 'backtracked' | 'idle';

// Tree node representing a state in the backtracking process
export interface TreeNode {
  id: string;
  value: number;           // Selected candidate number (0 for root)
  remaining: number;       // Remaining sum at this node
  status: NodeStatus;
  children: TreeNode[];
  depth: number;
  pathFromRoot: number[];  // Path from root to this node
}

// Code line mapping for pseudocode highlighting
// 对应LeetCode官方题解的代码结构
export const CodeLine = {
  FUNCTION_START: 1,    // 函数定义
  BASE_CASE_FAIL: 2,    // idx == candidates.length 返回
  BASE_CASE_SUCCESS: 3, // target == 0 找到组合
  SKIP: 4,              // 跳过当前数字 dfs(target, combine, idx+1)
  PRUNE: 5,             // 剪枝判断 target - candidates[idx] >= 0
  CHOOSE: 6,            // 选择当前数字 combine.add(candidates[idx])
  RECURSE: 7,           // 递归调用 dfs(target-candidates[idx], combine, idx)
  UNCHOOSE: 8,          // 回溯撤销 combine.pop()
  RETURN: 9,            // 函数返回
} as const;

export type CodeLine = typeof CodeLine[keyof typeof CodeLine];

// Step types in the algorithm
export type StepType =
  | 'start'
  | 'choose'
  | 'recurse'
  | 'found'
  | 'prune'
  | 'backtrack'
  | 'complete';

// A single step in the algorithm visualization
export interface AlgorithmStep {
  type: StepType;
  nodeId: string;
  currentPath: number[];
  remainingSum: number;
  currentCandidate: number | null;
  candidateIndex: number;
  codeLine: CodeLine;
  treeSnapshot: TreeNode;
  foundCombination?: number[];
  description: string;
}

// Validation result for input
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Algorithm state managed by context
export interface AlgorithmState {
  candidates: number[];
  target: number;
  steps: AlgorithmStep[];
  currentStepIndex: number;
  isPlaying: boolean;
  speed: number;
  combinations: number[][];
  treeData: TreeNode | null;
  highlightedPath: number[] | null;  // 点击组合时高亮的路径
}

// Actions for the algorithm reducer
export type AlgorithmAction =
  | { type: 'START'; candidates: number[]; target: number; steps: AlgorithmStep[] }
  | { type: 'STEP_FORWARD' }
  | { type: 'STEP_BACKWARD' }
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'RESET' }
  | { type: 'SET_SPEED'; speed: number }
  | { type: 'HIGHLIGHT_PATH'; path: number[] | null };
