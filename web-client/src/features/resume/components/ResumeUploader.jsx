import { UploadCloud, Loader2 } from 'lucide-react';

export function ResumeUploader({ file, isUploading, handleDragOver, handleDrop, fileInputRef, handleFileChange }) {
  if (isUploading) {
    return (
      <div className="w-full py-12 flex flex-col items-center">
        <Loader2 size={48} className="text-primary-600 animate-spin mb-4" />
        <h3 className="text-lg font-bold text-slate-900 mb-2">Analyzing your resume...</h3>
        <p className="text-slate-500">Our AI is extracting skills and formatting.</p>
      </div>
    );
  }

  return (
    <div 
      className="w-full flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl py-12 hover:border-primary-500 hover:bg-slate-50 transition-colors cursor-pointer"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <div className="w-20 h-20 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center mb-6">
         <UploadCloud size={40} />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">Drag & drop your resume here</h3>
      <p className="text-slate-500 mb-6">or click to browse</p>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept=".pdf,.doc,.docx" 
        className="hidden" 
      />
      <p className="text-xs text-slate-400 mt-6">Supported formats: PDF, DOCX (Max 5MB)</p>
    </div>
  );
}
