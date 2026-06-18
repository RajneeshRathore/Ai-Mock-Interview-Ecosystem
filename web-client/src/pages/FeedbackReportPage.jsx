import { useEffect, useState, useRef } from 'react';
import { Download } from 'lucide-react';
import { useAuth } from '../app/providers/AuthProvider';
import { getDashboardStats } from '../services/analyticsService';
import { getInterviewById } from '../services/interviewService';
import { ScoreBreakdown } from '../features/reports/components/ScoreBreakdown';
import { FeedbackLists } from '../features/reports/components/FeedbackLists';
import { Button } from '../components/common/Button';
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

import Skeleton from '../components/loaders/Skeleton';

export default function FeedbackReportPage() {
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const reportRef = useRef(null);

  useEffect(() => {
    if (user) {
      getDashboardStats(user.id).then(res => {
        if (res.data && res.data.rawReports && res.data.rawReports.length > 0) {
          const latest = res.data.rawReports[0];
          if (latest.session && latest.session._id) {
            getInterviewById(latest.session._id).then(fullSession => {
              setReport({
                role: latest.session.title || 'Interview',
                date: latest.createdAt,
                score: latest.overallScore,
                sessionDetails: fullSession,
                ...latest
              });
              setLoading(false);
            }).catch(() => {
              setReport({
                role: latest.session.title || 'Interview',
                date: latest.createdAt,
                score: latest.overallScore,
                ...latest
              });
              setLoading(false);
            });
          } else {
            setReport({
              role: 'Interview',
              date: latest.createdAt,
              score: latest.overallScore,
              ...latest
            });
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      });
    }
  }, [user]);

  if (loading) return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div className="space-y-2 w-full">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-4 w-1/3" />
        </div>
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="lg:col-span-2 h-64 w-full rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-80 w-full rounded-2xl" />
        <Skeleton className="h-80 w-full rounded-2xl" />
      </div>
    </div>
  );
  if (!report) return <div className="p-8 text-center text-slate-500">No completed interviews found to generate a report.</div>;

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        windowWidth: reportRef.current.scrollWidth
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`AI_Interview_Report_${new Date(report.date).toISOString().split('T')[0]}.pdf`);
    } catch (e) {
      console.error('PDF generation failed:', e);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6" ref={reportRef}>
       <div className="flex justify-between items-end animate-fade-in-down opacity-0 animate-fill-forwards">
         <div>
           <h2 className="text-2xl font-bold text-slate-900">Feedback Report</h2>
           <p className="text-slate-500 mt-1">{report.role} Interview • {new Date(report.date).toLocaleString()}</p>
         </div>
         <Button 
           variant="secondary" 
           className="text-primary-600 bg-primary-50 hover:bg-primary-100 print:hidden"
           onClick={handleDownloadPDF}
           disabled={downloading}
         >
           {downloading ? 'Generating...' : <><Download size={18} /> Download PDF</>}
         </Button>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center animate-zoom-in opacity-0 animation-delay-100 animate-fill-forwards">
             <h3 className="font-bold text-slate-500 mb-6 uppercase tracking-wider text-sm">Overall Score</h3>
             <div className="text-6xl font-bold text-green-500 mb-4">{report.score}%</div>
             <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-4 py-1.5 rounded-full text-sm font-medium">
                {report.score >= 80 ? '🎉 Great Performance!' : report.score >= 60 ? '👍 Good Effort!' : 'Needs Practice'}
             </div>
          </div>

          <div className="lg:col-span-2 animate-fade-in-up opacity-0 animation-delay-200 animate-fill-forwards">
            <ScoreBreakdown report={report} />
          </div>
       </div>

       <div className="animate-fade-in-up opacity-0 animation-delay-300 animate-fill-forwards">
         <FeedbackLists />
       </div>

       {/* Per-question breakdown */}
       {report.sessionDetails && report.sessionDetails.messages && (
         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 animate-fade-in-up opacity-0 animation-delay-400 animate-fill-forwards print:break-before-page">
           <div className="flex justify-between items-center mb-6">
             <h3 className="font-bold text-xl text-slate-900">Per-Question Breakdown</h3>
             <Link to={`/dashboard/interviews/transcript?id=${report.sessionDetails._id}`} className="text-sm font-medium text-primary-600 hover:text-primary-700 print:hidden">
               View Full Transcript
             </Link>
           </div>
           <div className="space-y-4">
             {(() => {
               const pairs = [];
               const msgs = report.sessionDetails.messages;
               for (let i = 0; i < msgs.length; i++) {
                 if (msgs[i].role === 'ai') {
                   const ans = msgs[i+1]?.role === 'user' ? msgs[i+1] : null;
                   if (ans && ans.score != null) {
                     pairs.push({ q: msgs[i].content, a: ans });
                   }
                 }
               }
               return pairs.length > 0 ? pairs.map((p, i) => (
                 <div key={i} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                   <div className="flex justify-between items-start gap-4 mb-2">
                     <p className="font-semibold text-slate-800 text-sm flex-1"><span className="text-primary-500 mr-2">Q{i+1}.</span>{p.q}</p>
                     <span className={`px-2 py-1 rounded text-xs font-bold whitespace-nowrap ${p.a.score >= 80 ? 'bg-green-100 text-green-700' : p.a.score >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                       Score: {p.a.score}/100
                     </span>
                   </div>
                   {p.a.aiFeedback && <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">{p.a.aiFeedback}</p>}
                 </div>
               )) : <p className="text-slate-500 text-sm">No scored questions found.</p>;
             })()}
           </div>
         </div>
       )}
    </div>
  );
}
