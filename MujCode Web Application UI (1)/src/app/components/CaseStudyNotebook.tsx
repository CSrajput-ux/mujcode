import { useState } from 'react';
import {
    X, Maximize2, Type, AlignLeft, AlignCenter, AlignRight,
    List, ListOrdered, CheckSquare, Link as LinkIcon, Image,
    Paperclip, MoreHorizontal, ArrowLeft, Clock, Save
} from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent } from './ui/dialog';

interface CaseStudyNotebookProps {
    open: boolean;
    onClose: () => void;
    caseStudyTitle: string;
}

export default function CaseStudyNotebook({ open, onClose, caseStudyTitle }: CaseStudyNotebookProps) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSave = () => {
        // Logic to save/submit would go here
        console.log('Submitting:', { title, content });
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-[95vw] h-[90vh] p-0 border-none bg-[#F4E04D] shadow-2xl flex flex-col overflow-hidden rounded-xl">
                {/* Header / Top Bar */}
                <div className="flex items-center justify-between px-6 py-4 bg-[#F4E04D]/50 backdrop-blur-sm">
                    <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-black/10 rounded-full">
                        <Maximize2 className="w-5 h-5 text-gray-800" />
                    </Button>

                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="bg-transparent text-center text-xl font-bold text-gray-800 placeholder-gray-500/70 focus:outline-none flex-1 mx-4"
                    />

                    <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-black/10 rounded-full">
                        <X className="w-6 h-6 text-gray-800" />
                    </Button>
                </div>

                {/* Toolbar */}
                <div className="flex items-center justify-center gap-6 py-2 border-b border-black/5 bg-[#F4E04D]/30">
                    <div className="flex items-center gap-4 text-gray-700">
                        <Type className="w-5 h-5 cursor-pointer hover:text-black" />
                        <AlignLeft className="w-5 h-5 cursor-pointer hover:text-black" />
                        <div className="flex gap-2 border-l border-black/10 pl-4">
                            <List className="w-5 h-5 cursor-pointer hover:text-black" />
                            <ListOrdered className="w-5 h-5 cursor-pointer hover:text-black" />
                        </div>
                        <div className="flex gap-4 border-l border-black/10 pl-4">
                            <CheckSquare className="w-5 h-5 cursor-pointer hover:text-black" />
                            <LinkIcon className="w-5 h-5 cursor-pointer hover:text-black" />
                            <Image className="w-5 h-5 cursor-pointer hover:text-black" />
                            <Paperclip className="w-5 h-5 cursor-pointer hover:text-black" />
                        </div>
                        <div className="flex gap-2 border-l border-black/10 pl-4">
                            <AlignLeft className="w-5 h-5 cursor-pointer hover:text-black" />
                            <MoreHorizontal className="w-5 h-5 cursor-pointer hover:text-black" />
                        </div>
                    </div>
                </div>

                {/* Content Area (Paper) */}
                <div className="flex-1 p-8 overflow-y-auto cursor-text" onClick={() => document.getElementById('notebook-content')?.focus()}>
                    <textarea
                        id="notebook-content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Start writing your analysis here..."
                        className="w-full h-full bg-transparent resize-none focus:outline-none text-gray-800 text-lg leading-relaxed placeholder-gray-500/60 font-medium"
                    />
                </div>

                {/* Floating Action Button (Save) */}
                <div className="absolute bottom-6 right-6">
                    <Button onClick={handleSave} className="bg-white text-black hover:bg-gray-100 shadow-lg rounded-full w-14 h-14 p-0">
                        <Save className="w-6 h-6" />
                    </Button>
                </div>

                {/* Footer Info */}
                <div className="absolute bottom-4 left-6 text-xs font-medium text-gray-600 opacity-60 flex items-center gap-2 pointer-events-none">
                    <Clock className="w-3 h-3" />
                    <span>Reference: {caseStudyTitle}</span>
                </div>
            </DialogContent>
        </Dialog>
    );
}
