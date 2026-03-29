import React, { useState, useRef } from 'react';
import { 
    Calendar, ChevronDown, Layers, BookOpen, 
    CloudUpload, FileSpreadsheet, CheckCircle2, Trash2, Send 
} from 'lucide-react';

export function UploadResultsAdmin() {
    const [formState, setFormState] = useState({
        batch: '',
        year: '',
        semester: '',
        file: null,
        isDragging: false
    });

    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setFormState(prev => ({ ...prev, isDragging: true }));
        } else if (e.type === 'dragleave') {
            setFormState(prev => ({ ...prev, isDragging: false }));
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setFormState(prev => ({ ...prev, isDragging: false }));
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    const processFile = (file) => {
        if (file.type === "text/csv" || file.name.toLowerCase().endsWith('.csv')) {
            setFormState(prev => ({ ...prev, file: file }));
        } else {
            alert('Invalid file format. Please upload a CSV file only.');
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const removeFile = () => {
        setFormState(prev => ({ ...prev, file: null }));
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const getFileSize = (bytes) => {
        const kb = bytes / 1024;
        if (kb > 1024) {
            return (kb / 1024).toFixed(2) + ' MB';
        }
        return kb.toFixed(2) + ' KB';
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitting:", formState);
    };

    return (
        <div className="bg-gray-50 flex flex-col h-dvh overflow-hidden font-body">
            <header className="bg-[#100636] shadow-md h-16 flex items-center px-4 sm:px-8 shrink-0 z-40">
                <div className="flex items-center w-full max-w-5xl">
                    <h1 className="font-heading font-bold text-lg text-white tracking-wide">Upload Results</h1>
                </div>
            </header>

            <main className="flex-1 flex flex-col min-w-0 transition-all duration-300 relative bg-gray-50 overflow-y-auto">
                <div className="p-6 md:p-8 lg:p-10 max-w-5xl mx-auto w-full">
                    
                    <div className="mb-8">
                        <h1 className="text-3xl lg:text-4xl font-heading font-bold tracking-tight text-gray-900">Upload Results</h1>
                        <p className="text-gray-500 mt-2 text-sm sm:text-base font-medium">
                            Upload student examination results via CSV format. Ensure the batch, year, and semester are correctly selected before uploading.
                        </p>
                    </div>

                    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 lg:p-10 relative overflow-hidden">
                        
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-[#e7e5fc] rounded-full blur-3xl opacity-50 z-0 pointer-events-none"></div>

                        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="batch" className="block text-sm font-bold text-gray-700">Batch Year</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Calendar className="w-5 h-5 text-gray-400 group-focus-within:text-[#100636] transition-colors" />
                                        </div>
                                        <select 
                                            id="batch" 
                                            name="batch" 
                                            value={formState.batch}
                                            onChange={handleChange}
                                            className="w-full h-12 pl-11 pr-10 text-sm font-medium bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#100636]/20 focus:border-[#100636] transition-all appearance-none outline-none text-gray-700 cursor-pointer hover:bg-gray-50"
                                        >
                                            <option value="" disabled>Select Batch</option>
                                            <option value="2021">2021</option>
                                            <option value="2022">2022</option>
                                            <option value="2023">2023</option>
                                            <option value="2024">2024</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                            <ChevronDown className="w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="year" className="block text-sm font-bold text-gray-700">Academic Year</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Layers className="w-5 h-5 text-gray-400 group-focus-within:text-[#100636] transition-colors" />
                                        </div>
                                        <select 
                                            id="year" 
                                            name="year" 
                                            value={formState.year}
                                            onChange={handleChange}
                                            className="w-full h-12 pl-11 pr-10 text-sm font-medium bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#100636]/20 focus:border-[#100636] transition-all appearance-none outline-none text-gray-700 cursor-pointer hover:bg-gray-50"
                                        >
                                            <option value="" disabled>Select Year</option>
                                            <option value="1">1st Year</option>
                                            <option value="2">2nd Year</option>
                                            <option value="3">3rd Year</option>
                                            <option value="4">4th Year</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                            <ChevronDown className="w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="semester" className="block text-sm font-bold text-gray-700">Semester</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <BookOpen className="w-5 h-5 text-gray-400 group-focus-within:text-[#100636] transition-colors" />
                                        </div>
                                        <select 
                                            id="semester" 
                                            name="semester" 
                                            value={formState.semester}
                                            onChange={handleChange}
                                            className="w-full h-12 pl-11 pr-10 text-sm font-medium bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#100636]/20 focus:border-[#100636] transition-all appearance-none outline-none text-gray-700 cursor-pointer hover:bg-gray-50"
                                        >
                                            <option value="" disabled>Select Semester</option>
                                            <option value="1">1st Semester</option>
                                            <option value="2">2nd Semester</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                            <ChevronDown className="w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 pt-2">
                                <label className="block text-sm font-bold text-gray-700">Results File</label>
                                
                                {!formState.file ? (
                                    <div 
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                        className={`relative group flex justify-center px-6 py-12 md:py-16 border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden
                                            ${formState.isDragging 
                                                ? 'border-[rgba(16,6,54,0.5)] bg-[#e7e5fc]/30' 
                                                : 'border-gray-300 bg-gray-50/50 hover:bg-[#e7e5fc]/30 hover:border-[#100636]/50'
                                            }`}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <div className="space-y-4 text-center pointer-events-none">
                                            <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 group-hover:scale-110 group-hover:shadow-md transition-all duration-300 relative">
                                                <div className="absolute inset-0 bg-[#e7e5fc] rounded-full animate-ping opacity-0 group-hover:opacity-40 transition-opacity"></div>
                                                <CloudUpload className="w-10 h-10 text-[#100636] group-hover:text-[#1a0b54]" />
                                            </div>
                                            <div className="flex flex-col text-sm text-gray-600 justify-center items-center gap-1">
                                                <div className="relative cursor-pointer bg-transparent rounded-md font-bold text-[#100636] hover:text-[#1a0b54] focus-within:outline-none pointer-events-auto">
                                                    <span className="text-base">Click to browse</span>
                                                    <input 
                                                        ref={fileInputRef}
                                                        id="file-upload" 
                                                        name="file-upload" 
                                                        type="file" 
                                                        accept=".csv" 
                                                        className="sr-only"
                                                        onChange={handleFileSelect}
                                                    />
                                                </div>
                                                <p className="text-gray-500 font-medium tracking-wide">or drag and drop your file here</p>
                                            </div>
                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-500">
                                                <FileSpreadsheet className="w-3.5 h-3.5" />
                                                CSV ONLY (MAX. 10MB)
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between p-4 sm:p-5 bg-linear-to-r from-[#e7e5fc]/30 to-white border border-[#100636]/20 rounded-2xl shadow-sm animate-in fade-in zoom-in-95 duration-300">
                                        <div className="flex items-center gap-4 overflow-hidden">
                                            <div className="w-12 h-12 shrink-0 bg-[#e7e5fc]/50 rounded-xl flex items-center justify-center border border-[#100636]/20">
                                                <FileSpreadsheet className="w-6 h-6 text-[#100636]" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-bold text-gray-900 truncate">{formState.file.name}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                                        {getFileSize(formState.file.size)}
                                                    </span>
                                                    <span className="text-xs font-semibold text-green-600 flex items-center gap-1">
                                                        <CheckCircle2 className="w-3 h-3" /> Ready
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={removeFile}
                                            className="ml-4 shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100 group" 
                                            title="Remove file"
                                        >
                                            <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="pt-8 border-t border-gray-100 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 sm:gap-4">
                                <button type="button" className="w-full sm:w-auto px-6 py-3 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all shadow-sm">
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={!formState.file || !formState.batch || !formState.year || !formState.semester}
                                    className="w-full sm:w-auto px-8 py-3 text-sm font-bold text-white bg-[#100636] border border-transparent rounded-xl hover:bg-[#1a0b54] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#100636] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                                    Submit Results
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}