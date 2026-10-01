import { CalendarCheck, Eye, Star, Trophy } from "lucide-react";
import { Panel, StatTile } from "../ProfileUI";

interface LeetCodeSummaryProps {
  ranking: number;
  activeDays: number;
  reputation: number;
  profileViews: number;
}

export default function LeetCodeSummary({ ranking, activeDays, reputation, profileViews }: LeetCodeSummaryProps) {
  return (
    <Panel accent="emerald" className="mt-5">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <StatTile icon={Trophy} label="Global ranking" value={ranking || "N/A"} accent="amber" />
        <StatTile icon={CalendarCheck} label="Active days" value={activeDays} accent="emerald" />
        <StatTile icon={Star} label="Reputation" value={reputation} accent="violet" />
        <StatTile icon={Eye} label="Profile views" value={profileViews} accent="sky" />
      </div>
    </Panel>
  );
}