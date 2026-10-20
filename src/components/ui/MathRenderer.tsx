"use client";

import React, { useState, useEffect, useMemo } from "react";
import type KaTeXType from "katex";

interface MathRendererProps {
  content?: string;
  displayMode?: boolean;
  className?: string;
}

// Module-level cache for KaTeX instance to avoid re-importing
let cachedKatex: typeof KaTeXType | null = null;
let katexPromise: Promise<typeof KaTeXType> | null = null;

function loadKaTeX(): Promise<typeof KaTeXType> {
  if (cachedKatex) return Promise.resolve(cachedKatex);
  if (!katexPromise) {
    katexPromise = import("katex").then((mod) => {
      cachedKatex = (mod as any).default || mod;
      return cachedKatex!;
    });
  }
  return katexPromise;
}

// Formula HTML cache to prevent re-parsing identical expressions
const formulaCache = new Map<string, string>();

/**
 * Safely renders a LaTeX formula to an HTML string using KaTeX.
 */
function renderKaTeX(katexInstance: typeof KaTeXType, formula: string, displayMode: boolean): string {
  const cacheKey = `${displayMode ? "D" : "I"}:${formula.trim()}`;
  const cached = formulaCache.get(cacheKey);
  if (cached) return cached;

  try {
    const html = katexInstance.renderToString(formula.trim(), {
      displayMode,
      throwOnError: false,
      output: "htmlAndMathml",
      strict: false,
    });
    formulaCache.set(cacheKey, html);
    return html;
  } catch (err) {
    console.warn("KaTeX rendering warning for formula:", formula, err);
    return `<span class="text-rose-600 font-mono text-xs">${formula}</span>`;
  }
}

/**
 * MathRenderer: Universal KaTeX math and formula renderer with lazy-loaded bundle.
 * Only loads the heavy KaTeX engine when LaTeX delimiters or math syntax are detected.
 */
export const MathRenderer: React.FC<MathRendererProps> = ({
  content = "",
  displayMode = false,
  className = "",
}) => {
  const hasMath = useMemo(() => {
    if (!content) return false;
    return (
      content.includes("$") ||
      (displayMode &&
        (content.includes("\\") || content.includes("^") || content.includes("_") || content.includes("=")))
    );
  }, [content, displayMode]);

  const [isReady, setIsReady] = useState<boolean>(() => Boolean(cachedKatex) || !hasMath);

  useEffect(() => {
    if (hasMath && !cachedKatex) {
      loadKaTeX().then(() => setIsReady(true));
    }
  }, [hasMath]);
  // Memoize rendered parts to ensure high-performance rendering during lists
  const renderedElements = useMemo(() => {
    if (!content) return null;

    // Fast-path: If content has no math, return plain text without touching KaTeX
    if (!hasMath) {
      return <span>{content}</span>;
    }

    // Check if the entire content is intended as a single formula without delimiters
    if (
      displayMode &&
      !content.includes("$") &&
      (content.includes("\\") || content.includes("^") || content.includes("_") || content.includes("="))
    ) {
      if (!cachedKatex) {
        return <span className="block my-1.5 py-1 text-center font-mono text-sm opacity-60">{content}</span>;
      }
      const html = renderKaTeX(cachedKatex, content, true);
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
        if (!cachedKatex) {
          elements.push(
            <span key={`math-block-${match.index}`} className="block my-2 py-1 text-center font-mono text-sm opacity-60">
              {formula}
            </span>
          );
        } else {
          const html = renderKaTeX(cachedKatex, formula, true);
          elements.push(
            <span
              key={`math-block-${match.index}`}
              className="block overflow-x-auto overflow-y-hidden max-w-full my-2 py-1 text-center scrollbar-thin select-text"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        }
      } else {
        if (!cachedKatex) {
          elements.push(
            <span key={`math-inline-${match.index}`} className="inline px-0.5 font-mono text-xs opacity-75">
              {formula}
            </span>
          );
        } else {
          const html = renderKaTeX(cachedKatex, formula, false);
          elements.push(
            <span
              key={`math-inline-${match.index}`}
              className="inline-math inline px-0.5 select-text"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        }
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
  }, [content, displayMode, hasMath, isReady]);

  return <span className={`math-renderer-root ${className}`}>{renderedElements}</span>;
};

export default MathRenderer;
