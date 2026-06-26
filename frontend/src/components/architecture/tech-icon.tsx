import type { ComponentType } from "react";
import {
  SiAnthropic,
  SiApacheairflow,
  SiDocker,
  SiFastapi,
  SiGithubactions,
  SiNextdotjs,
  SiPandas,
  SiPostgresql,
  SiPython,
  SiReact,
  SiRedis,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
} from "react-icons/si";
import {
  Archive,
  Drama,
  FileText,
  ImageIcon,
  Landmark,
  MonitorSmartphone,
  Soup,
  UserRoundCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

type IconComponent = ComponentType<{ className?: string }>;

interface TechDef {
  name: string;
  /** Brand colour applied via currentColor (ignored when multicolor). */
  color: string;
  Icon: IconComponent;
  /** True for icons that carry their own fills (e.g. the AWS mark). */
  multicolor?: boolean;
}

/** Hand-authored AWS mark — Simple Icons dropped the trademarked logo. */
function AwsLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 40"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="AWS"
    >
      <text
        x="24"
        y="22"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="700"
        fontSize="18"
        fill="#232F3E"
      >
        aws
      </text>
      <path
        d="M9 30 Q24 40 39 30"
        fill="none"
        stroke="#FF9900"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M39 30 l-1.4 4.2 l4.4 -1.6 z" fill="#FF9900" />
    </svg>
  );
}

export const TECH: Record<string, TechDef> = {
  // Frontend
  nextjs: { name: "Next.js", color: "#000000", Icon: SiNextdotjs },
  react: { name: "React", color: "#149ECA", Icon: SiReact },
  typescript: { name: "TypeScript", color: "#3178C6", Icon: SiTypescript },
  tailwind: { name: "Tailwind CSS", color: "#06B6D4", Icon: SiTailwindcss },
  vercel: { name: "Vercel", color: "#000000", Icon: SiVercel },

  // Backend
  python: { name: "Python", color: "#3776AB", Icon: SiPython },
  fastapi: { name: "FastAPI", color: "#009688", Icon: SiFastapi },
  docker: { name: "Docker", color: "#2496ED", Icon: SiDocker },
  aws: { name: "AWS", color: "#FF9900", Icon: AwsLogo, multicolor: true },

  // Data & storage
  postgresql: { name: "PostgreSQL", color: "#4169E1", Icon: SiPostgresql },
  redis: { name: "Redis", color: "#DC382D", Icon: SiRedis },
  pandas: { name: "pandas", color: "#150458", Icon: SiPandas },
  s3: { name: "Amazon S3", color: "#E2761B", Icon: Archive },

  // Ingestion & AI
  playwright: { name: "Playwright", color: "#2EAD33", Icon: Drama },
  beautifulsoup: { name: "BeautifulSoup", color: "#7C9A52", Icon: Soup },
  airflow: { name: "Apache Airflow", color: "#017CEE", Icon: SiApacheairflow },
  anthropic: { name: "Claude (LLM)", color: "#D97757", Icon: SiAnthropic },

  // DevOps
  githubactions: { name: "GitHub Actions", color: "#2088FF", Icon: SiGithubactions },

  // Non-branded concept nodes
  banksite: { name: "Bank websites", color: "#475569", Icon: Landmark },
  pdf: { name: "PDF offers", color: "#DC2626", Icon: FileText },
  image: { name: "Offer images", color: "#7C3AED", Icon: ImageIcon },
  review: { name: "Human review", color: "#059669", Icon: UserRoundCheck },
  user: { name: "Shoppers", color: "#475569", Icon: MonitorSmartphone },
};

export function techName(tech: string): string {
  return TECH[tech]?.name ?? tech;
}

export function TechIcon({
  tech,
  className = "h-6 w-6",
}: {
  tech: string;
  className?: string;
}) {
  const def = TECH[tech];
  if (!def) return null;
  const { Icon, color, multicolor } = def;
  return (
    <span
      className={cn("inline-flex shrink-0", className)}
      style={multicolor ? undefined : { color }}
    >
      <Icon className="h-full w-full" />
    </span>
  );
}
