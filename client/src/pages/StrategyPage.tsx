export default function StrategyPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-border">
        <h1 className="text-xl font-bold text-text mb-1">Interview Strategy</h1>
        <p className="text-sm text-text-muted">Frameworks and templates for answering DevOps/SRE interview questions</p>
      </div>

      {/* Answer Template */}
      <div className="bg-white rounded-xl p-5 border border-border">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-4 pb-2 border-b border-border">
          Answer Template (STAR-like for DevOps)
        </h3>
        <div className="bg-code-bg rounded-lg p-5 text-code-text text-[13px] leading-loose italic border-l-4 border-[#6A9955]">
          <p><span className="text-[#DCDCAA] not-italic font-semibold">1. What it is:</span> "X is a tool/concept that..."</p>
          <p><span className="text-[#DCDCAA] not-italic font-semibold">2. How it works:</span> "Under the hood, it..."</p>
          <p><span className="text-[#DCDCAA] not-italic font-semibold">3. Real usage:</span> "In my last project, we used it to..."</p>
          <p><span className="text-[#DCDCAA] not-italic font-semibold">4. Tradeoffs:</span> "The downside is X, but we mitigated with Y..."</p>
        </div>
      </div>

      {/* Deployment Strategies */}
      <div className="bg-white rounded-xl p-5 border border-border">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-4 pb-2 border-b border-border">
          Deployment Strategies Comparison
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] border-collapse">
            <thead>
              <tr className="bg-primary text-white">
                <th className="px-4 py-3 text-left text-xs font-semibold">Strategy</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">How it works</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Rollback</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Risk</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Cost</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Rolling', 'Replace pods gradually', 'Re-deploy old version', 'Medium', 'Low'],
                ['Blue-Green', 'Full duplicate env, LB switch', 'Instant (switch back)', 'Low', 'High (2x infra)'],
                ['Canary', 'Route 5%→25%→100% traffic', 'Route back to old', 'Very low', 'Medium'],
                ['Recreate', 'Kill all old, start all new', 'Re-deploy', 'High (downtime)', 'Low'],
                ['A/B Testing', 'Route by user segment', 'Remove segment routing', 'Low', 'Medium'],
              ].map(([strategy, how, rollback, risk, cost], i) => (
                <tr key={i} className={`${i % 2 === 0 ? '' : 'bg-surface-secondary'} border-b border-border`}>
                  <td className="px-4 py-3 font-semibold text-text">{strategy}</td>
                  <td className="px-4 py-3 text-text-muted">{how}</td>
                  <td className="px-4 py-3 text-text-muted">{rollback}</td>
                  <td className="px-4 py-3 text-text-muted">{risk}</td>
                  <td className="px-4 py-3 text-text-muted">{cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SLI/SLO/SLA */}
      <div className="bg-white rounded-xl p-5 border border-border">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-4 pb-2 border-b border-border">
          SLI / SLO / SLA Quick Reference
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] border-collapse">
            <thead>
              <tr className="bg-primary text-white">
                <th className="px-4 py-3 text-left text-xs font-semibold">Term</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Definition</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Example</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Audience</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['SLI', 'Service Level Indicator \u2014 what you measure', '99.95% requests return 200', 'Engineering'],
                ['SLO', 'Service Level Objective \u2014 internal target', 'Maintain 99.9% success rate', 'Engineering + PM'],
                ['SLA', 'Service Level Agreement \u2014 contract', 'Guarantee 99.5% uptime, credits if breached', 'Customer-facing'],
                ['Error Budget', '1 \u2212 SLO = allowed failure quota', '0.1% = 43.8 min/month downtime', 'Engineering'],
              ].map(([term, def, example, audience], i) => (
                <tr key={i} className={`${i % 2 === 0 ? '' : 'bg-surface-secondary'} border-b border-border`}>
                  <td className="px-4 py-3 font-bold text-primary">{term}</td>
                  <td className="px-4 py-3 text-text">{def}</td>
                  <td className="px-4 py-3 text-text-muted">{example}</td>
                  <td className="px-4 py-3 text-text-muted">{audience}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Tips */}
      <div className="bg-white rounded-xl p-5 border border-border">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-4 pb-2 border-b border-border">
          General Interview Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Show depth, not breadth', desc: 'Better to know 3 tools deeply than 10 superficially. Mention trade-offs and real-world experience.' },
            { title: 'Use the right vocabulary', desc: 'Say "declarative pipeline", not "Jenkins script". Say "GitOps reconciliation", not "auto-deploy".' },
            { title: 'Structure your answers', desc: 'What \u2192 How \u2192 Why \u2192 Trade-offs. Start with definition, end with real experience.' },
            { title: 'Know the "why not"', desc: 'For every tool, know when NOT to use it. "Helm adds complexity for simple one-off deployments."' },
            { title: 'Connect tools together', desc: 'Show how tools integrate: "Jenkins builds, pushes to Artifactory, ArgoCD deploys from there."' },
            { title: 'Quantify impact', desc: '"Reduced deployment time from 45min to 5min by implementing Helm + ArgoCD GitOps pipeline."' },
          ].map((tip, i) => (
            <div key={i} className="p-4 bg-surface-secondary rounded-lg border border-border-light">
              <h4 className="text-sm font-bold text-text mb-1">{tip.title}</h4>
              <p className="text-xs text-text-muted leading-relaxed">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
