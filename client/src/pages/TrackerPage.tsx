import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TOOLS, CAT_MAP } from '../data/tools';
import { useProgress } from '../hooks/useProgress';
import ToolIcon from '../components/ToolIcon';

const categories = ['core', 'security', 'obs', 'cloud'] as const;

export default function TrackerPage() {
  const { isComplete, toggle, sectionKey, qaKey, getToolStats, globalStats } = useProgress();
  const [expandedTool, setExpandedTool] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-white rounded-xl p-6 border border-border">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-xl font-bold text-text mb-1">Progress Tracker</h1>
            <p className="text-sm text-text-muted">Granular tracking across all sections and Q&A items</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${globalStats.percentage === 100 ? 'bg-success text-white' : 'bg-success-light text-success-dark'}`}>
              {globalStats.completedItems} / {globalStats.totalItems} items completed
            </span>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-text-muted">Overall Progress</span>
            <span className="text-xs font-bold text-success">{globalStats.percentage}%</span>
          </div>
          <div className="bg-border rounded-full h-2.5">
            <div className="bg-success h-2.5 rounded-full transition-all duration-700" style={{ width: `${globalStats.percentage}%` }} />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-border text-center">
          <div className="text-2xl font-bold text-success">{globalStats.toolsCompleted}</div>
          <div className="text-[11px] text-text-muted mt-0.5">Tools Mastered</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-border text-center">
          <div className="text-2xl font-bold text-warning">{globalStats.totalTools - globalStats.toolsCompleted}</div>
          <div className="text-[11px] text-text-muted mt-0.5">In Progress</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-border text-center">
          <div className="text-2xl font-bold text-text">{globalStats.completedItems}</div>
          <div className="text-[11px] text-text-muted mt-0.5">Items Done</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-border text-center">
          <div className="text-2xl font-bold text-text">{globalStats.totalItems - globalStats.completedItems}</div>
          <div className="text-[11px] text-text-muted mt-0.5">Remaining</div>
        </div>
      </div>

      {/* Category Sections */}
      {categories.map(cat => {
        const tools = TOOLS.filter(t => t.cat === cat);
        const catCompleted = tools.reduce((sum, t) => sum + getToolStats(t.id).completed, 0);
        const catTotal = tools.reduce((sum, t) => sum + getToolStats(t.id).total, 0);

        return (
          <div key={cat} className="bg-white rounded-xl border border-border overflow-hidden">
            <div className="px-5 py-3 bg-surface-secondary border-b border-border flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted">{CAT_MAP[cat]}</h2>
              <span className="text-[11px] font-semibold text-text-muted">{catCompleted}/{catTotal}</span>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-12 px-5 py-2 text-[10px] font-bold uppercase tracking-wider text-text-muted border-b border-border bg-white">
              <div className="col-span-1"></div>
              <div className="col-span-4">Tool</div>
              <div className="col-span-2 text-center">Sections</div>
              <div className="col-span-2 text-center">Q&A</div>
              <div className="col-span-2 text-center">Progress</div>
              <div className="col-span-1 text-center">Detail</div>
            </div>

            {tools.map(tool => {
              const stats = getToolStats(tool.id);
              const isExpanded = expandedTool === tool.id;
              const sectionsDone = tool.sections.filter((_, i) => isComplete(sectionKey(tool.id, i))).length;
              const qaDone = tool.qa.filter((_, i) => isComplete(qaKey(tool.id, i))).length;

              return (
                <div key={tool.id} className="border-b border-border last:border-0">
                  {/* Tool Row */}
                  <div className="grid grid-cols-12 items-center px-5 py-3 hover:bg-surface-secondary transition-colors">
                    <div className="col-span-1">
                      {stats.percentage === 100 ? (
                        <span className="inline-flex w-5 h-5 rounded-full bg-success items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        </span>
                      ) : stats.percentage > 0 ? (
                        <span className="inline-flex w-5 h-5 rounded-full border-2 border-warning items-center justify-center"><span className="w-2 h-2 rounded-full bg-warning" /></span>
                      ) : (
                        <span className="inline-flex w-5 h-5 rounded-full border-2 border-border" />
                      )}
                    </div>
                    <div className="col-span-4">
                      <Link to={`/tool/${tool.id}`} className="flex items-center gap-2 no-underline">
                        <ToolIcon toolId={tool.id} size={16} className="text-text-muted" />
                        <span className="text-sm font-semibold text-text hover:text-primary transition-colors">{tool.name}</span>
                      </Link>
                    </div>
                    <div className="col-span-2 text-center">
                      <span className={`text-xs font-semibold ${sectionsDone === tool.sections.length && tool.sections.length > 0 ? 'text-success' : 'text-text-muted'}`}>
                        {sectionsDone}/{tool.sections.length}
                      </span>
                    </div>
                    <div className="col-span-2 text-center">
                      <span className={`text-xs font-semibold ${qaDone === tool.qa.length && tool.qa.length > 0 ? 'text-success' : 'text-text-muted'}`}>
                        {qaDone}/{tool.qa.length}
                      </span>
                    </div>
                    <div className="col-span-2 flex items-center justify-center gap-1.5">
                      <div className="w-16 bg-border rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full transition-all ${stats.percentage === 100 ? 'bg-success' : stats.percentage > 0 ? 'bg-warning' : 'bg-border'}`} style={{ width: `${stats.percentage}%` }} />
                      </div>
                      <span className="text-[11px] font-bold text-text-muted w-7">{stats.percentage}%</span>
                    </div>
                    <div className="col-span-1 text-center">
                      <button
                        onClick={() => setExpandedTool(isExpanded ? null : tool.id)}
                        className="w-6 h-6 rounded flex items-center justify-center text-text-muted hover:bg-surface-secondary transition-colors cursor-pointer bg-transparent border-0"
                      >
                        <svg className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Expanded Detail */}
                  {isExpanded && (
                    <div className="bg-surface-secondary px-5 py-3 border-t border-border">
                      {/* Sections */}
                      <div className="mb-3">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-2">Sections</div>
                        {tool.sections.map((section, i) => {
                          const key = sectionKey(tool.id, i);
                          const done = isComplete(key);
                          return (
                            <div key={i} className="flex items-center gap-2 py-1.5">
                              <button
                                onClick={() => toggle(key)}
                                className={`w-4 h-4 rounded shrink-0 border-2 flex items-center justify-center transition-all cursor-pointer ${
                                  done ? 'bg-success border-success text-white' : 'border-border hover:border-success bg-transparent'
                                }`}
                              >
                                {done && <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                              </button>
                              <span className={`text-xs ${done ? 'text-success-dark line-through opacity-60' : 'text-text'}`}>{section.title}</span>
                            </div>
                          );
                        })}
                      </div>
                      {/* Q&A */}
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-2">Interview Q&A</div>
                        {tool.qa.map((item, i) => {
                          const key = qaKey(tool.id, i);
                          const done = isComplete(key);
                          return (
                            <div key={i} className="flex items-center gap-2 py-1.5">
                              <button
                                onClick={() => toggle(key)}
                                className={`w-4 h-4 rounded shrink-0 border-2 flex items-center justify-center transition-all cursor-pointer ${
                                  done ? 'bg-success border-success text-white' : 'border-border hover:border-success bg-transparent'
                                }`}
                              >
                                {done && <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                              </button>
                              <span className={`text-xs ${done ? 'text-success-dark line-through opacity-60' : 'text-text'}`}>{item.q}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
