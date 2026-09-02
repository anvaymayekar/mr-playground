import type { ReactNode } from 'react';

const modifiers = new Set(['he', 'te', 'maze', 'sthir', 'sarve', 'lahan', 'maha', 'uch', 'ahe']);
const types = new Set(['ank', 'akshar', 'bhagank', 'purnank', 'vidhan', 'nirank']);
const controls = new Set(['jar', 'nahitar', 'anyatha', 'jovar', 'pratyek', 'thamba', 'pudhe', 'partav']);
const functions = new Set(['leeh', 'shevti', 'karya']);
const booleans = new Set(['khare', 'khote']);
const operators = /^(?:==|!=|<=|>=|<<|>>|\+\+|--|&&|\|\||[+\-*/%&|^~!<>=])$/;

function wordClass(word: string, afterWord: string) {
  if (modifiers.has(word)) return 'syntax-modifier';
  if (types.has(word)) return 'syntax-type';
  if (controls.has(word)) return 'syntax-control';
  if (functions.has(word) || /^\s*\(/.test(afterWord)) return 'syntax-function';
  if (booleans.has(word)) return 'syntax-boolean';
  return 'syntax-variable';
}

export function tokenizeLine(line: string): ReactNode[] {
  const result: ReactNode[] = [];
  const matcher = /\/\/.*$|\/\*.*?\*\/|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|(?:\d+\.\d+|\d+)|==|!=|<=|>=|<<|>>|\+\+|--|&&|\|\||[+\-*/%&|^~!<>=]|[A-Za-z_][A-Za-z0-9_]*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = matcher.exec(line))) {
    if (match.index > lastIndex) result.push(line.slice(lastIndex, match.index));
    const value = match[0];
    let className = 'syntax-punctuation';
    if (value.startsWith('//') || value.startsWith('/*')) className = 'syntax-comment';
    else if (value.startsWith('"') || value.startsWith("'")) className = 'syntax-string';
    else if (/^\d/.test(value)) className = 'syntax-number';
    else if (operators.test(value)) className = 'syntax-operator';
    else if (/^[A-Za-z_]/.test(value)) className = wordClass(value, line.slice(match.index + value.length));
    result.push(<span key={`${match.index}-${value}`} className={className}>{value}</span>);
    lastIndex = match.index + value.length;
  }
  if (lastIndex < line.length) result.push(line.slice(lastIndex));
  return result;
}

export function HighlightedCode({ code, className = '' }: { code: string; className?: string }) {
  return (
    <code className={className}>
      {code.split('\n').map((line, index) => (
        <div key={`${index}-${line}`}>{tokenizeLine(line)}{line === '' ? ' ' : null}</div>
      ))}
    </code>
  );
}