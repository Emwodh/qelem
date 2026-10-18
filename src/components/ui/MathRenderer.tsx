"use client";

import React, { useMemo } from "react";
import katex from "katex";

interface MathRendererProps {
  content?: string;
  displayMode?: boolean;
  className?: string;
}

/**
 * Safely renders a LaTeX formula to an HTML string using KaTeX.
 */
function renderKaTeX(formula: string, displayMode: boolean): string {
  try {
    return katex.renderToString(formula.trim(), {
      displayMode,
      throwOnError: false,
      output: "htmlAndMathml",
      strict: false,
    });
  } catch (err) {
    console.warn("KaTeX rendering warning for formula:", formula, err);
    return `<span class="text-rose-600 font-mono text-xs">${formula}</span>`;
  }
}

/**
 * MathRenderer: Universal KaTeX math and formula renderer.
 * Handles mixed text containing inline ($...$) and block ($$...$$) LaTeX expressions,
 * or direct formula strings.
 */
export const MathRenderer: React.FC<MathRendererProps> = ({
  content = "",
  displayMode = false,
  className = "",
}) => {
  // Memoize rendered parts to ensure high-performance rendering during lists
  const renderedElements = useMemo(() => {
    if (!content) return null;

    // Check if the entire content is intended as a single formula without delimiters
    if (
      displayMode &&
      !content.includes("$") &&
      (content.includes("\\") || content.includes("^") || content.includes("_") || content.includes("="))
    ) {
      const html = renderKaTeX(content, true);
      return (
        <span
          className="block overflow-x-auto overflow-y-hidden max-w-full my-1.5 py-1 text-center scrollbar-thin select-text"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    }

    // Split text by $$...$$ and $...$ delimiters
    // Group 1: Display math ($$...$$)
    // Group 2: Inline math ($...$)
    const regex = /\$\$([\s\S]+?)\$\$|\$([^\$\n]+?)\$/g;
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(content)) !== null) {
      // 1. Text prior to the LaTeX match
      if (match.index > lastIndex) {
        elements.push(
          <span key={`text-${lastIndex}`}>{content.substring(lastIndex, match.index)}</span>
        );
      }

      const isBlock = Boolean(match[1]);
      const formula = match[1] || match[2] || "";

      if (isBlock) {
        const html = renderKaTeX(formula, true);
        elements.push(
          <span
            key={`math-block-${match.index}`}
            className="block overflow-x-auto overflow-y-hidden max-w-full my-2 py-1 text-center scrollbar-thin select-text"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } else {
        const html = renderKaTeX(formula, false);
        elements.push(
          <span
            key={`math-inline-${match.index}`}
            className="inline-math inline px-0.5 select-text"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      }

      lastIndex = regex.lastIndex;
    }

    // 2. Trailing text after the last match
    if (lastIndex < content.length) {
      elements.push(
        <span key={`text-tail-${lastIndex}`}>{content.substring(lastIndex)}</span>
      );
    }

    // If no delimiters were matched, return plain text
    if (elements.length === 0) {
      return <span>{content}</span>;
    }

    return elements;
  }, [content, displayMode]);

  return <span className={`math-renderer-root ${className}`}>{renderedElements}</span>;
};

export default MathRenderer;
