import { useState, useRef } from 'react';
import { File, X, CheckCircle } from 'lucide-react';
import api from '../services/api';
import { ResumeUploader } from '../features/resume/components/ResumeUploader';
import { AnalysisResult } from '../features/resume/components/AnalysisResult';
import { Button } from '../components/common/Button';

export default function ResumeAnalyzerPage() {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [customSkills, setCustomSkills] = useState([]);
  const [addingSkill, setAddingSkill] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setAnalysisResult(null); // Reset previous result
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setAnalysisResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAnalysisResult(response.data.analysis);
    } catch (error) {
      console.error('Failed to analyze resume:', error);
      alert('Failed to analyze resume. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setAnalysisResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
       <div className="animate-fade-in-down opacity-0 animate-fill-forwards">
         <h2 className="text-2xl font-bold text-slate-900">Resume Analyzer</h2>
         <p className="text-slate-500">Upload your resume and get AI-powered analysis.</p>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-12 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center animate-fade-in-up opacity-0 animation-delay-100 animate-fill-forwards">
             {!file && !analysisResult ? (
               <ResumeUploader 
                 file={file}
                 isUploading={isUploading}
                 handleDragOver={handleDragOver}
                 handleDrop={handleDrop}
                 fileInputRef={fileInputRef}
                 handleFileChange={handleFileChange}
               />
             ) : isUploading ? (
               <ResumeUploader isUploading={true} />
             ) : (
               <div className="w-full">
                 <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex items-center justify-between mb-8">
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center">
                       <File size={24} />
                     </div>
                     <div className="text-left">
                       <p className="font-bold text-slate-900">{file.name}</p>
                       <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                     </div>
                   </div>
                   {!analysisResult && (
                     <button onClick={resetUpload} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                       <X size={20} />
                     </button>
                   )}
                 </div>
                 
                 {!analysisResult ? (
                   <Button 
                     onClick={handleAnalyze} 
                     className="w-full"
                   >
                     Start Analysis
                   </Button>
                 ) : (
                   <div className="flex items-center justify-center gap-2 text-green-600 font-bold bg-green-50 py-3 rounded-lg border border-green-200">
                     <CheckCircle size={20} />
                     Analysis Complete
                   </div>
                 )}
               </div>
             )}
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col relative overflow-hidden animate-fade-in-up opacity-0 animation-delay-200 animate-fill-forwards">
             <AnalysisResult result={analysisResult} />
          </div>
       </div>

       <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden animate-fade-in-up opacity-0 animation-delay-300 animate-fill-forwards">
          {!analysisResult && (
             <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center"></div>
          )}
          <h3 className="font-bold text-lg text-slate-900 mb-6">Skills Detected</h3>
          <div className="flex flex-wrap gap-3">
             {(analysisResult?.detectedSkills || ['JavaScript', 'HTML']).map((skill, i) => (
               <span key={i} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700">
                 {skill}
               </span>
             ))}
             {customSkills.map((skill, i) => (
               <span key={`custom-${i}`} className="px-4 py-2 bg-primary-50 border border-primary-200 rounded-lg text-sm font-medium text-primary-700 flex items-center gap-2">
                 {skill}
                 <button onClick={() => setCustomSkills(prev => prev.filter((_, idx) => idx !== i))} className="text-primary-400 hover:text-red-500 text-xs font-bold">×</button>
               </span>
             ))}
             {addingSkill ? (
               <form onSubmit={(e) => { e.preventDefault(); const val = e.target.elements.skill.value.trim(); if (val) { setCustomSkills(prev => [...prev, val]); setAddingSkill(false); } }} className="flex items-center gap-2">
                 <input name="skill" autoFocus placeholder="e.g. Python" className="px-3 py-2 border border-primary-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 w-32" />
                 <button type="submit" className="px-3 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700">Add</button>
                 <button type="button" onClick={() => setAddingSkill(false)} className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm">Cancel</button>
               </form>
             ) : (
               <button onClick={() => setAddingSkill(true)} className="px-4 py-2 bg-primary-50 text-primary-600 rounded-lg text-sm font-medium border border-primary-100 hover:bg-primary-100 transition-colors">
                 + Add Skill
               </button>
             )}
          </div>
       </div>
    </div>
  );
}
