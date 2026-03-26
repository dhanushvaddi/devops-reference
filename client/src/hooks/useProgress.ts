import { useState, useEffect, useCallback, useMemo } from 'react';
import { TOOLS } from '../data/tools';

// Granular progress: tracks individual sections and Q&A items
// Keys: "section:toolId:sectionIndex" or "qa:toolId:qaIndex"

export function useProgress() {
  const [done, setDone] = useState<Set<string>>(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem('devops-progress') || '[]'));
    } catch { return new Set(); }
  });

  useEffect(() => {
    localStorage.setItem('devops-progress', JSON.stringify([...done]));
  }, [done]);

  const toggle = useCallback((key: string) => {
    setDone(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }, []);

  const isComplete = useCallback((key: string) => done.has(key), [done]);

  // Helper: section key
  const sectionKey = useCallback((toolId: string, sectionIdx: number) =>
    `section:${toolId}:${sectionIdx}`, []);

  // Helper: qa key
  const qaKey = useCallback((toolId: string, qaIdx: number) =>
    `qa:${toolId}:${qaIdx}`, []);

  // Tool-level stats
  const getToolStats = useCallback((toolId: string) => {
    const tool = TOOLS.find(t => t.id === toolId);
    if (!tool) return { completed: 0, total: 0, percentage: 0 };
    const total = tool.sections.length + tool.qa.length;
    let completed = 0;
    tool.sections.forEach((_, i) => { if (done.has(`section:${toolId}:${i}`)) completed++; });
    tool.qa.forEach((_, i) => { if (done.has(`qa:${toolId}:${i}`)) completed++; });
    return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }, [done]);

  // Global stats
  const globalStats = useMemo(() => {
    let totalItems = 0;
    let completedItems = 0;
    TOOLS.forEach(tool => {
      tool.sections.forEach((_, i) => {
        totalItems++;
        if (done.has(`section:${tool.id}:${i}`)) completedItems++;
      });
      tool.qa.forEach((_, i) => {
        totalItems++;
        if (done.has(`qa:${tool.id}:${i}`)) completedItems++;
      });
    });
    const toolsCompleted = TOOLS.filter(tool => {
      const stats = getToolStats(tool.id);
      return stats.percentage === 100;
    }).length;
    return {
      totalItems,
      completedItems,
      percentage: totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0,
      toolsCompleted,
      totalTools: TOOLS.length,
    };
  }, [done, getToolStats]);

  return { done, toggle, isComplete, sectionKey, qaKey, getToolStats, globalStats };
}
