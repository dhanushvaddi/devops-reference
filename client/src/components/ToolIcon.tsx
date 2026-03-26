import {
  Terminal,
  GitBranch,
  Workflow,
  HardHat,
  Hammer,
  Container,
  Network,
  Ship,
  RefreshCw,
  Search,
  Shield,
  Package,
  BarChart3,
  LineChart,
  Telescope,
  Cloud,
  Hexagon,
  Target,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  linux: Terminal,
  git: GitBranch,
  gha: Workflow,
  jenkins: HardHat,
  build: Hammer,
  docker: Container,
  k8s: Network,
  helm: Ship,
  argocd: RefreshCw,
  sonar: Search,
  owasp: Shield,
  jfrog: Package,
  prom: BarChart3,
  grafana: LineChart,
  splunk: Telescope,
  aws: Cloud,
  azure: Hexagon,
  sre: Target,
};

interface Props {
  toolId: string;
  size?: number;
  className?: string;
}

export default function ToolIcon({ toolId, size = 20, className = '' }: Props) {
  const Icon = iconMap[toolId];
  if (!Icon) return <span className={className}>?</span>;
  return <Icon size={size} className={className} />;
}
