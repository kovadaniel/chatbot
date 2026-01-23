import React from "react";

type MarkdownPart = {
  type: "text" | "bold" | "code" | "codeBlock";
  content: string;
};

export function parseMarkdown(text: string): MarkdownPart[] {
  const parts: MarkdownPart[] = [];

  const codeBlockRegex = /```([\s\S]*?)```/g;
  let codeBlockMatch: RegExpExecArray | null;

  const codeBlockIndices: Array<{ start: number; end: number; content: string }> = [];
  while ((codeBlockMatch = codeBlockRegex.exec(text)) !== null) {
    codeBlockIndices.push({
      start: codeBlockMatch.index,
      end: codeBlockMatch.index + codeBlockMatch[0].length,
      content: codeBlockMatch[1],
    });
  }

  let lastIndex = 0;
  for (const codeBlock of codeBlockIndices) {
    if (codeBlock.start > lastIndex) {
      const beforeText = text.substring(lastIndex, codeBlock.start);
      parts.push(...parseInlineMarkdown(beforeText));
    }

    parts.push({
      type: "codeBlock",
      content: codeBlock.content,
    });

    lastIndex = codeBlock.end;
  }

  if (lastIndex < text.length) {
    const remainingText = text.substring(lastIndex);
    parts.push(...parseInlineMarkdown(remainingText));
  }

  if (codeBlockIndices.length === 0) {
    return parseInlineMarkdown(text);
  }

  return parts;
}

function parseInlineMarkdown(text: string): MarkdownPart[] {
  const parts: MarkdownPart[] = [];
  let currentIndex = 0;

  const regex = /(\*\*|__)(.*?)\1|`([^`]+)`/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > currentIndex) {
      const beforeText = text.substring(currentIndex, match.index);
      if (beforeText) {
        parts.push({ type: "text", content: beforeText });
      }
    }

    if (match[1]) {
      parts.push({ type: "bold", content: match[2] });
    } else if (match[3]) {
      parts.push({ type: "code", content: match[3] });
    }

    currentIndex = match.index + match[0].length;
  }

  if (currentIndex < text.length) {
    const remainingText = text.substring(currentIndex);
    if (remainingText) {
      parts.push({ type: "text", content: remainingText });
    }
  }

  if (parts.length === 0) {
    return [{ type: "text", content: text }];
  }

  return parts;
}

export function renderMarkdown(text: string): React.ReactNode {
  const parts = parseMarkdown(text);

  return (
    <>
      {parts.map((part, index) => {
        switch (part.type) {
          case "bold":
            return (
              <strong key={index} className="font-semibold">
                {part.content}
              </strong>
            );
          case "code":
            return (
              <code
                key={index}
                className="bg-slate-600 px-1.5 py-0.5 rounded text-xs font-mono"
              >
                {part.content}
              </code>
            );
          case "codeBlock":
            return (
              <pre
                key={index}
                className="bg-slate-600 p-2 rounded text-xs font-mono whitespace-pre-wrap my-1 block "
              >
                <code>{part.content}</code>
              </pre>
            );
          default:
            return <span key={index}>{part.content}</span>;
        }
      })}
    </>
  );
}
