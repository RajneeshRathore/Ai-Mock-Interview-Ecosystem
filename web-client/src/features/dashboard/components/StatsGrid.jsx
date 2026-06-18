import { StatCard } from '../../../components/cards/StatCard';

export function StatsGrid({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard 
        title="Total Interviews" 
        value={stats.totalInterviews} 
        subtext={stats.totalInterviews > 0 ? "+10%" : ""} 
        icon="📋" 
        gradient="stat-gradient-violet"
        index={0}
      />
      <StatCard 
        title="Average Score" 
        value={`${stats.avgScore}%`} 
        icon="🎯" 
        gradient="stat-gradient-emerald"
        index={1}
      />
      <StatCard 
        title="Hours Practiced" 
        value={stats.hoursPracticed} 
        icon="⏱️" 
        gradient="stat-gradient-blue"
        index={2}
      />
      <StatCard 
        title="Badges Earned" 
        value={stats.badgesEarned} 
        icon="🏆" 
        gradient="stat-gradient-amber"
        index={3}
      />
    </div>
  );
}
