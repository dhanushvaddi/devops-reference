import { Link } from 'react-router-dom';
import { type Tool, CAT_MAP, CAT_COLORS } from '../data/tools';

interface Props {
  tool: Tool;
  isComplete?: boolean;
}

export default function ToolCard({ tool, isComplete }: Props) {
  const cat = CAT_COLORS[tool.cat];
  return (
    <Link
      to={`/tool/${tool.id}`}
      className="group bg-white rounded-xl p-5 border border-border hover:border-primary hover:shadow-lg transition-all no-underline block relative"
    >
      {isComplete && (
        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-success flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
      <div className="text-3xl mb-3">{tool.icon}</div>
      <div className="text-sm font-bold text-text mb-1 group-hover:text-primary transition-colors">{tool.name}</div>
      <div className="text-xs text-text-muted mb-2">{tool.sections.length} sections &middot; {tool.qa.length} Q&A</div>
      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${cat.bg} ${cat.text}`}>
        {CAT_MAP[tool.cat]}
      </span>
    </Link>
  );
}
