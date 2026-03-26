import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wrench, ShieldCheck, BarChart3, Cloud, ClipboardCheck, Lightbulb, MessageSquare } from 'lucide-react';
import { TOOLS, CAT_MAP } from '../data/tools';
import { useProgress } from '../hooks/useProgress';
import ToolIcon from '../components/ToolIcon';

const categories = [
  { key: 'core', Icon: Wrench },
  { key: 'security', Icon: ShieldCheck },
  { key: 'obs', Icon: BarChart3 },
  { key: 'cloud', Icon: Cloud },
] as const;

export default function HomePage() {
  const { getToolStats, globalStats } = useProgress();
  const [expandedCat, setExpandedCat] = useState<string | null>('core');

  return (
    <div className="space-y-6">
      {/* Hero Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-5 border border-border col-span-2 lg:col-span-1">
          <div className="text-[11px] text-text-muted font-medium uppercase tracking-wider mb-2">Overall Progress</div>
          <div className="text-4xl font-extrabold text-text">{globalStats.percentage}<span className="text-lg text-text-muted">%</span></div>
          <div className="mt-3">
            <div className="bg-border rounded-full h-2">
              <div className="bg-success h-2 rounded-full transition-all duration-700" style={{ width: `${globalStats.percentage}%` }} />
            </div>
          </div>
          <div className="text-[11px] text-text-muted mt-2">{globalStats.completedItems} / {globalStats.totalItems} items</div>
        </div>
        <StatCard label="Total Tools" value={String(TOOLS.length)} sub="DevOps & SRE" />
        <StatCard label="Topics Covered" value={String(TOOLS.reduce((s, t) => s + t.sections.length, 0))} sub="Concept sections" />
        <StatCard label="Interview Q&A" value={String(TOOLS.reduce((s, t) => s + t.qa.length, 0))} sub="Practice questions" />
        <StatCard label="Tools Mastered" value={String(globalStats.toolsCompleted)} sub={`of ${globalStats.totalTools} total`} color="text-success" />
      </div>

      {/* Expandable Category Sections */}
      <div className="space-y-3">
        {categories.map(({ key, Icon }) => {
          const catTools = TOOLS.filter(t => t.cat === key);
          const isExpanded = expandedCat === key;
          const catCompleted = catTools.reduce((sum, t) => sum + getToolStats(t.id).completed, 0);
          const catTotal = catTools.reduce((sum, t) => sum + getToolStats(t.id).total, 0);
          const catPct = catTotal > 0 ? Math.round((catCompleted / catTotal) * 100) : 0;

          return (
            <div key={key} className="bg-white rounded-xl border border-border overflow-hidden">
              <button
                onClick={() => setExpandedCat(isExpanded ? null : key)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-surface-secondary transition-colors cursor-pointer border-0 bg-transparent text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-surface-secondary flex items-center justify-center">
                    <Icon size={18} className="text-text-muted" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-text">{CAT_MAP[key]}</div>
                    <div className="text-[11px] text-text-muted">{catTools.length} tools &middot; {catTotal} items</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center gap-2">
                    <div className="w-24 bg-border rounded-full h-1.5">
                      <div className="bg-success h-1.5 rounded-full transition-all" style={{ width: `${catPct}%` }} />
                    </div>
                    <span className="text-[11px] font-semibold text-text-muted w-8">{catPct}%</span>
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${catCompleted === catTotal && catTotal > 0 ? 'bg-success-light text-success-dark' : 'bg-surface-secondary text-text-muted'}`}>
                    {catCompleted}/{catTotal}
                  </span>
                  <svg className={`w-4 h-4 text-text-muted transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-border">
                  <div className="grid grid-cols-12 px-5 py-2 bg-surface-secondary text-[10px] font-bold uppercase tracking-wider text-text-muted border-b border-border">
                    <div className="col-span-1">Status</div>
                    <div className="col-span-5">Tool</div>
                    <div className="col-span-2 text-center">Sections</div>
                    <div className="col-span-2 text-center">Q&A</div>
                    <div className="col-span-2 text-center">Progress</div>
                  </div>
                  {catTools.map(tool => {
                    const stats = getToolStats(tool.id);
                    return (
                      <Link
                        key={tool.id}
                        to={`/tool/${tool.id}`}
                        className="grid grid-cols-12 items-center px-5 py-3 hover:bg-surface-secondary transition-colors border-b border-border last:border-0 no-underline group"
                      >
                        <div className="col-span-1">
                          {stats.percentage === 100 ? (
                            <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          ) : stats.percentage > 0 ? (
                            <div className="w-5 h-5 rounded-full border-2 border-warning flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-warning" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-border" />
                          )}
                        </div>
                        <div className="col-span-5 flex items-center gap-2.5">
                          <ToolIcon toolId={tool.id} size={16} className="text-text-muted" />
                          <span className="text-sm font-semibold text-text group-hover:text-primary transition-colors">{tool.name}</span>
                        </div>
                        <div className="col-span-2 text-center text-xs text-text-muted">{tool.sections.length}</div>
                        <div className="col-span-2 text-center text-xs text-text-muted">{tool.qa.length}</div>
                        <div className="col-span-2 flex items-center justify-center gap-2">
                          <div className="w-16 bg-border rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full transition-all ${stats.percentage === 100 ? 'bg-success' : stats.percentage > 0 ? 'bg-warning' : 'bg-border'}`} style={{ width: `${stats.percentage}%` }} />
                          </div>
                          <span className="text-[11px] font-semibold text-text-muted w-8">{stats.percentage}%</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/tracker" className="bg-white rounded-xl p-5 border border-border hover:border-primary hover:shadow-md transition-all no-underline group">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-surface-secondary flex items-center justify-center">
              <ClipboardCheck size={18} className="text-text-muted" />
            </div>
            <div>
              <div className="text-sm font-bold text-text group-hover:text-primary transition-colors">Progress Tracker</div>
              <div className="text-[11px] text-text-muted">Detailed view of all topics</div>
            </div>
          </div>
        </Link>
        <Link to="/strategy" className="bg-white rounded-xl p-5 border border-border hover:border-primary hover:shadow-md transition-all no-underline group">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-surface-secondary flex items-center justify-center">
              <Lightbulb size={18} className="text-text-muted" />
            </div>
            <div>
              <div className="text-sm font-bold text-text group-hover:text-primary transition-colors">Interview Strategy</div>
              <div className="text-[11px] text-text-muted">Answer frameworks & tips</div>
            </div>
          </div>
        </Link>
        <div className="bg-white rounded-xl p-5 border border-border border-dashed opacity-60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-surface-secondary flex items-center justify-center">
              <MessageSquare size={18} className="text-text-muted" />
            </div>
            <div>
              <div className="text-sm font-bold text-text">AI Interview Coach</div>
              <div className="text-[11px] text-text-muted">Coming soon</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, color }: { label: string; value: string; sub: string; color?: string }) {
  return (
    <div className="bg-white rounded-xl p-5 border border-border">
      <div className="text-[11px] text-text-muted font-medium uppercase tracking-wider mb-2">{label}</div>
      <div className={`text-3xl font-extrabold ${color || 'text-text'}`}>{value}</div>
      <div className="text-[11px] text-text-muted mt-1">{sub}</div>
    </div>
  );
}
