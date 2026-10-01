import { Briefcase, GraduationCap, MapPin, User } from "lucide-react";
import { Panel, SectionHead } from "../ProfileUI";

interface AboutSectionProps {
  aboutMe: string | null;
  school: string | null;
  company: string | null;
  location: string | null;
}

export default function AboutSection({ aboutMe, school, company, location }: AboutSectionProps) {
  if (!aboutMe && !school && !company && !location) return null;

  const chips = [
    { icon: GraduationCap, v: school },
    { icon: Briefcase, v: company },
    { icon: MapPin, v: location },
  ].filter((c) => c.v);

  return (
    <Panel accent="emerald" className="mt-5">
      <SectionHead icon={User} title="About" accent="emerald" />
      {aboutMe && <p className="max-w-2xl text-sm leading-relaxed text-zinc-300">{aboutMe}</p>}
      {chips.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {chips.map(({ icon: Icon, v }) => (
            <span key={v} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-zinc-300">
              <Icon className="h-3.5 w-3.5 text-emerald-400" />
              {v}
            </span>
          ))}
        </div>
      )}
    </Panel>
  );
}