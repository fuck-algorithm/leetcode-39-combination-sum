import { useAlgorithm } from '../hooks/useAlgorithm';
import { CodeLine } from '../types';
import './CodePanel.css';

// 语法高亮token类型
type TokenType = 'keyword' | 'type' | 'number' | 'string' | 'comment' | 'method' | 'variable' | 'operator' | 'bracket' | 'plain';

interface Token {
  type: TokenType;
  text: string;
}

// Java关键字
const KEYWORDS = ['public', 'void', 'if', 'return', 'new', 'int'];
const TYPES = ['List', 'Integer', 'ArrayList'];

// 简单的Java语法高亮tokenizer
function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  
  while (i < code.length) {
    // 跳过空格
    if (code[i] === ' ') {
      let spaces = '';
      while (i < code.length && code[i] === ' ') {
        spaces += ' ';
        i++;
      }
      tokens.push({ type: 'plain', text: spaces });
      continue;
    }
    
    // 注释
    if (code.slice(i, i + 2) === '//') {
      tokens.push({ type: 'comment', text: code.slice(i) });
      break;
    }
    
    // 数字
    if (/\d/.test(code[i])) {
      let num = '';
      while (i < code.length && /\d/.test(code[i])) {
        num += code[i];
        i++;
      }
      tokens.push({ type: 'number', text: num });
      continue;
    }
    
    // 标识符或关键字
    if (/[a-zA-Z_]/.test(code[i])) {
      let word = '';
      while (i < code.length && /[a-zA-Z_\d]/.test(code[i])) {
        word += code[i];
        i++;
      }
      
      if (KEYWORDS.includes(word)) {
        tokens.push({ type: 'keyword', text: word });
      } else if (TYPES.includes(word)) {
        tokens.push({ type: 'type', text: word });
      } else if (i < code.length && code[i] === '(') {
        tokens.push({ type: 'method', text: word });
      } else {
        tokens.push({ type: 'variable', text: word });
      }
      continue;
    }
    
    // 运算符
    if ('+-*/%=<>!&|'.includes(code[i])) {
      let op = code[i];
      i++;
      if (i < code.length && '=&|'.includes(code[i])) {
        op += code[i];
        i++;
      }
      tokens.push({ type: 'operator', text: op });
      continue;
    }
    
    // 括号
    if ('()[]{}<>'.includes(code[i])) {
      tokens.push({ type: 'bracket', text: code[i] });
      i++;
      continue;
    }
    
    // 其他字符
    tokens.push({ type: 'plain', text: code[i] });
    i++;
  }
  
  return tokens;
}

// 渲染高亮的代码
function HighlightedCode({ code }: { code: string }) {
  const tokens = tokenize(code);
  
  return (
    <code>
      {tokens.map((token, idx) => (
        <span key={idx} className={`token-${token.type}`}>
          {token.text}
        </span>
      ))}
    </code>
  );
}

// 获取当前步骤的变量值显示
function getVariableAnnotation(
  lineType: CodeLine,
  currentPath: number[],
  remainingSum: number,
  currentCandidate: number | null,
  candidateIndex: number,
  stepType: string | undefined
): string | null {
  // 根据代码行类型和当前步骤显示相关变量值
  switch (lineType) {
    case CodeLine.BASE_CASE_FAIL:
      if (stepType === 'prune' || stepType === 'backtrack') {
        return `idx=${candidateIndex}`;
      }
      break;
    case CodeLine.BASE_CASE_SUCCESS:
      if (stepType === 'found') {
        return `target=0, combine=[${currentPath.join(',')}]`;
      }
      if (remainingSum === 0) {
        return `target=${remainingSum}`;
      }
      break;
    case CodeLine.CHOOSE:
      if (stepType === 'choose' && currentCandidate !== null) {
        return `candidates[${candidateIndex}]=${currentCandidate}`;
      }
      break;
    case CodeLine.RECURSE:
      if (stepType === 'recurse') {
        return `target=${remainingSum}, idx=${candidateIndex}`;
      }
      break;
    case CodeLine.UNCHOOSE:
      if (stepType === 'backtrack') {
        return `combine=[${currentPath.join(',')}]`;
      }
      break;
    case CodeLine.PRUNE:
      if (currentCandidate !== null) {
        const diff = remainingSum - currentCandidate;
        return `${remainingSum}-${currentCandidate}=${diff}`;
      }
      break;
  }
  return null;
}

/**
 * LeetCode 39题 官方题解 Java代码
 * https://leetcode.cn/problems/combination-sum/solutions/406516/zu-he-zong-he-by-leetcode-solution/
 */
const javaCode = [
  { line: CodeLine.FUNCTION_START, code: 'public void dfs(int[] candidates, int target,' },
  { line: CodeLine.FUNCTION_START, code: '    List<List<Integer>> ans, List<Integer> combine, int idx) {' },
  { line: CodeLine.BASE_CASE_FAIL, code: '  if (idx == candidates.length) {' },
  { line: CodeLine.BASE_CASE_FAIL, code: '    return;' },
  { line: CodeLine.BASE_CASE_FAIL, code: '  }' },
  { line: CodeLine.BASE_CASE_SUCCESS, code: '  if (target == 0) {' },
  { line: CodeLine.BASE_CASE_SUCCESS, code: '    ans.add(new ArrayList<Integer>(combine));' },
  { line: CodeLine.BASE_CASE_SUCCESS, code: '    return;' },
  { line: CodeLine.BASE_CASE_SUCCESS, code: '  }' },
  { line: CodeLine.SKIP, code: '  // 直接跳过' },
  { line: CodeLine.SKIP, code: '  dfs(candidates, target, ans, combine, idx + 1);' },
  { line: CodeLine.PRUNE, code: '  // 选择当前数' },
  { line: CodeLine.PRUNE, code: '  if (target - candidates[idx] >= 0) {' },
  { line: CodeLine.CHOOSE, code: '    combine.add(candidates[idx]);' },
  { line: CodeLine.RECURSE, code: '    dfs(candidates, target - candidates[idx],' },
  { line: CodeLine.RECURSE, code: '        ans, combine, idx);' },
  { line: CodeLine.UNCHOOSE, code: '    combine.remove(combine.size() - 1);' },
  { line: CodeLine.PRUNE, code: '  }' },
  { line: CodeLine.RETURN, code: '}' },
];

export function CodePanel() {
  const { currentStep } = useAlgorithm();
  const currentLine = currentStep?.codeLine ?? null;

  return (
    <div className="code-panel">
      <h3>LeetCode官方题解 - Java</h3>
      <pre className="code-block">
        {javaCode.map((item, index) => {
          const isHighlighted = item.line === currentLine;
          const annotation = currentStep && isHighlighted
            ? getVariableAnnotation(
                item.line,
                currentStep.currentPath,
                currentStep.remainingSum,
                currentStep.currentCandidate,
                currentStep.candidateIndex,
                currentStep.type
              )
            : null;

          return (
            <div
              key={index}
              className={`code-line ${isHighlighted ? 'highlighted' : ''}`}
            >
              <span className="line-number">{index + 1}</span>
              <HighlightedCode code={item.code} />
              {annotation && (
                <span className="variable-annotation">{annotation}</span>
              )}
            </div>
          );
        })}
      </pre>
      {currentStep && (
        <div className="step-info">
          <div className="step-description">{currentStep.description}</div>
        </div>
      )}
    </div>
  );
}
