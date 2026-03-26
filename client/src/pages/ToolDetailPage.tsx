import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { TOOLS, CAT_MAP, CAT_COLORS } from '../data/tools';
import { useProgress } from '../hooks/useProgress';
import CodeBlock from '../components/CodeBlock';
import ToolIcon from '../components/ToolIcon';

export default function ToolDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const tool = TOOLS.find(t => t.id === slug);
  const { isComplete, toggle, sectionKey, qaKey, getToolStats } = useProgress();
  const [openQA, setOpenQA] = useState<Set<number>>(new Set());

  if (!tool) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-text mb-2">Tool not found</h2>
        <Link to="/" className="text-primary text-sm hover:underline">Back to Home</Link>
      </div>
    );
  }

  const cat = CAT_COLORS[tool.cat];
  const stats = getToolStats(tool.id);

  const toggleQA = (idx: number) => {
    setOpenQA(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  };

  // Find prev/next tool for navigation
  const currentIdx = TOOLS.findIndex(t => t.id === tool.id);
  const prevTool = currentIdx > 0 ? TOOLS[currentIdx - 1] : null;
  const nextTool = currentIdx < TOOLS.length - 1 ? TOOLS[currentIdx + 1] : null;

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-text-muted">
        <Link to="/" className="hover:text-primary no-underline text-text-muted">Home</Link>
        <span>/</span>
        <span className="text-text font-medium">{tool.name}</span>
      </div>

      {/* Header Card - Ghost Style */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className={`h-1 ${cat.bg}`} style={{ background: `var(--color-${tool.cat === 'core' ? 'primary' : tool.cat === 'security' ? 'orange' : tool.cat === 'obs' ? 'success' : 'purple'})` }} />
        <div className="p-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface-secondary flex items-center justify-center">
                <ToolIcon toolId={tool.id} size={24} className="text-text-muted" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-text">{tool.name}</h1>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${cat.bg} ${cat.text}`}>
                    {CAT_MAP[tool.cat]}
                  </span>
                </div>
                <p className="text-sm text-text-muted leading-relaxed max-w-2xl">{tool.overview}</p>
              </div>
            </div>
            {/* Progress Ring */}
            <div className="flex items-center gap-3">
              <div className="text-center">
                <div className="relative w-16 h-16">
                  <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                    <path className="text-border" stroke="currentColor" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="text-success" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray={`${stats.percentage}, 100`} strokeLinecap="round" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-text">{stats.percentage}%</span>
                  </div>
                </div>
                <div className="text-[10px] text-text-muted mt-1">{stats.completed}/{stats.total}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sections with Checkboxes */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-3 bg-surface-secondary border-b border-border flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted">Concept Sections</h2>
          <span className="text-[11px] text-text-muted">
            {tool.sections.filter((_, i) => isComplete(sectionKey(tool.id, i))).length}/{tool.sections.length} completed
          </span>
        </div>
        {tool.sections.map((section, i) => {
          const key = sectionKey(tool.id, i);
          const done = isComplete(key);
          return (
            <div key={i} className="border-b border-border last:border-0">
              {/* Section Header Row */}
              <div className="flex items-center gap-3 px-5 py-4">
                <button
                  onClick={() => toggle(key)}
                  className={`w-5 h-5 rounded shrink-0 border-2 flex items-center justify-center transition-all cursor-pointer ${
                    done ? 'bg-success border-success text-white' : 'border-border hover:border-success bg-transparent'
                  }`}
                >
                  {done && (
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <h3 className={`text-sm font-semibold flex-1 ${done ? 'text-success-dark line-through opacity-60' : 'text-text'}`}>
                  {section.title}
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${done ? 'bg-success-light text-success-dark' : 'bg-surface-secondary text-text-muted'}`}>
                  {done ? 'Done' : `${section.bullets.length} points`}
                </span>
              </div>
              {/* Section Content */}
              <div className="px-5 pb-4 pl-13">
                <ul className="space-y-0 ml-8">
                  {section.bullets.map((bullet, j) => (
                    <li key={j} className="flex items-start gap-2 py-1.5 text-[13px] text-text leading-relaxed border-b border-border-light last:border-0">
                      <span className="text-primary text-[11px] mt-0.5 shrink-0">{'\u25B8'}</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
                {section.code && (
                  <div className="ml-8">
                    <CodeBlock code={section.code} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Q&A Section with Checkboxes */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-3 bg-surface-secondary border-b border-border flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted">Interview Q&A</h2>
          <span className="text-[11px] text-text-muted">
            {tool.qa.filter((_, i) => isComplete(qaKey(tool.id, i))).length}/{tool.qa.length} completed
          </span>
        </div>
        {tool.qa.map((item, i) => {
          const key = qaKey(tool.id, i);
          const done = isComplete(key);
          const isOpen = openQA.has(i);
          return (
            <div key={i} className="border-b border-border last:border-0">
              <div className="flex items-center gap-3 px-5 py-3">
                {/* Checkbox */}
                <button
                  onClick={(e) => { e.stopPropagation(); toggle(key); }}
                  className={`w-5 h-5 rounded shrink-0 border-2 flex items-center justify-center transition-all cursor-pointer ${
                    done ? 'bg-success border-success text-white' : 'border-border hover:border-success bg-transparent'
                  }`}
                >
                  {done && (
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                {/* Question - Clickable to expand */}
                <button
                  onClick={() => toggleQA(i)}
                  className={`flex-1 text-left text-[13px] font-semibold cursor-pointer bg-transparent border-0 p-0 ${
                    done ? 'text-success-dark line-through opacity-60' : 'text-primary'
                  }`}
                >
                  {item.q}
                </button>
                <div className="flex items-center gap-2">
                  {done && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-success-light text-success-dark">Done</span>
                  )}
                  <svg className={`w-4 h-4 text-text-muted transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {isOpen && (
                <div className="px-5 pb-4 pl-13 ml-8 text-[13px] text-text leading-relaxed bg-surface-secondary mx-5 mb-3 rounded-lg p-4">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Tip Box */}
      {tool.tip && (
        <div className="bg-success-light border-l-4 border-success rounded-r-xl p-5">
          <div className="flex items-start gap-3">
            <span className="text-lg">💡</span>
            <div>
              <div className="text-xs font-bold text-success-dark mb-1 uppercase tracking-wider">Interview Tip</div>
              <p className="text-[13px] text-[#1a4a3a] leading-relaxed">{tool.tip}</p>
            </div>
          </div>
        </div>
      )}

      {/* Prev/Next Navigation */}
      <div className="grid grid-cols-2 gap-4">
        {prevTool ? (
          <Link to={`/tool/${prevTool.id}`} className="bg-white rounded-xl p-4 border border-border hover:border-primary transition-all no-underline group">
            <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1">&larr; Previous</div>
            <div className="text-sm font-semibold text-text group-hover:text-primary transition-colors flex items-center gap-1.5"><ToolIcon toolId={prevTool.id} size={14} className="text-text-muted" /> {prevTool.name}</div>
          </Link>
        ) : <div />}
        {nextTool ? (
          <Link to={`/tool/${nextTool.id}`} className="bg-white rounded-xl p-4 border border-border hover:border-primary transition-all no-underline group text-right">
            <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Next &rarr;</div>
            <div className="text-sm font-semibold text-text group-hover:text-primary transition-colors flex items-center justify-end gap-1.5">{nextTool.name} <ToolIcon toolId={nextTool.id} size={14} className="text-text-muted" /></div>
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
