export const getScoreColor = (pct: number) => {
        if (pct >= 75) return { text: 'text-emerald-400', stroke: 'stroke-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/50' };
        if (pct >= 50) return { text: 'text-yellow-400', stroke: 'stroke-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/50' };
        if (pct >= 25) return { text: 'text-orange-400', stroke: 'stroke-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/50' };
        return { text: 'text-red-400', stroke: 'stroke-red-500', bg: 'bg-red-500/10', border: 'border-red-500/50' };
    };
