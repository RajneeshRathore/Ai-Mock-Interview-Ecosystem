import api from './api';

export const getDashboardStats = async (userId, timeRange = 'all') => {
  try {
    const response = await api.get('/feedback/my-reports');
    let reports = response.data;
    
    // Apply time range filter
    const now = new Date();
    if (timeRange === 'month') {
      const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      reports = reports.filter(r => new Date(r.createdAt) >= monthAgo);
    } else if (timeRange === '3months') {
      const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
      reports = reports.filter(r => new Date(r.createdAt) >= threeMonthsAgo);
    }
    // 'all' — no filter

    const totalInterviews = reports.length;
    const avgScore = totalInterviews > 0 
      ? Math.round(reports.reduce((acc, curr) => acc + curr.overallScore, 0) / totalInterviews) 
      : 0;
    const hoursPracticed = Math.round((totalInterviews * 15) / 60);
    
    const performanceData = reports.slice(0, 10).reverse().map((r, i) => ({
      name: new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: r.overallScore
    }));
    
    if (performanceData.length === 0) {
      performanceData.push({ name: 'Start', score: 0 });
    }

    // Extract real skills from reports
    const skillMap = {};
    reports.forEach(r => {
      if (r.strengths) {
        r.strengths.forEach(s => {
          skillMap[s] = (skillMap[s] || 80) + 2;
        });
      }
      if (r.weaknesses) {
        r.weaknesses.forEach(w => {
          skillMap[w] = (skillMap[w] || 80) - 2;
        });
      }
    });
    
    const skillData = Object.keys(skillMap).slice(0, 6).map(subject => ({
      subject: subject.length > 15 ? subject.substring(0, 12) + '...' : subject,
      A: Math.min(100, Math.max(0, skillMap[subject])),
      fullMark: 100
    }));

    if (skillData.length === 0) {
      skillData.push(
        { subject: 'Problem Solving', A: 80, fullMark: 100 },
        { subject: 'Communication', A: 85, fullMark: 100 }
      );
    }
    
    const recentInterviews = reports.slice(0, 5).map(r => ({
      id: r._id,
      role: r.session ? r.session.title : 'Interview',
      date: new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      score: r.overallScore,
      color: r.overallScore >= 80 ? 'text-green-500' : (r.overallScore >= 60 ? 'text-yellow-500' : 'text-red-500')
    }));

    return {
      data: {
        totalInterviews,
        avgScore,
        hoursPracticed,
        badgesEarned: Math.floor(totalInterviews / 3),
        performanceData,
        skillData,
        recentInterviews,
        rawReports: reports
      }
    };
  } catch (error) {
    console.error("Failed to fetch analytics:", error);
    return { data: null };
  }
};
