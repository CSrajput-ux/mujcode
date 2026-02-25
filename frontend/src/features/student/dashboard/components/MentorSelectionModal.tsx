import { API_URL, API_BASE_URL, UPLOADS_URL } from '@/shared/config/apiConfig';
import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Search, MapPin, CheckCircle2, UserCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Faculty {
    _id: string;
    userId: string;
    name: string;
    department: string;
    designation: string;
}

interface MentorSelectionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export const MentorSelectionModal: React.FC<MentorSelectionModalProps> = ({
    open,
    onOpenChange,
    onSuccess,
}) => {
    const [faculty, setFaculty] = useState<Faculty[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (open) {
            fetchFaculty();
        }
    }, [open]);

    const fetchFaculty = async () => {
        try {
            setLoading(true);
            const token = sessionStorage.getItem('token');
            const res = await fetch('${API_URL}/faculty', {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : ''
                },
                credentials: 'include'
            });
            if (!res.ok) throw new Error('Failed to fetch faculty');
            const data = await res.json();
            setFaculty(data);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const filteredFaculty = faculty.filter(
        (f) =>
            f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.department.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleSelection = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleConfirm = async () => {
        if (selectedIds.length === 0) {
            toast.error('Please select at least one mentor');
            return;
        }

        try {
            setIsSubmitting(true);
            const token = sessionStorage.getItem('token');
            const res = await fetch('${API_URL}/student/request-mentor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                },
                body: JSON.stringify({ facultyIds: selectedIds }),
                credentials: 'include'
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to request mentor');
            }

            toast.success('Mentor requests sent successfully! Pending faculty approval.');
            onSuccess();
            onOpenChange(false);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px] max-h-[80vh] flex flex-col p-6">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <UserCircle className="w-6 h-6 text-purple-600" />
                        Select Faculty Mentors
                    </DialogTitle>
                    <p className="text-sm text-gray-500">
                        Search and select faculty members as your mentors. These requests will be sent for approval.
                    </p>
                </DialogHeader>

                <div className="relative my-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search by name or department..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {loading ? (
                        <div className="space-y-2">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="h-16 bg-gray-50 rounded-lg animate-pulse" />
                            ))}
                        </div>
                    ) : filteredFaculty.length > 0 ? (
                        filteredFaculty.map((f) => (
                            <div
                                key={f._id}
                                onClick={() => toggleSelection(f._id)}
                                className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer group ${selectedIds.includes(f._id)
                                    ? 'border-purple-500 bg-purple-50/50'
                                    : 'border-gray-100 bg-white hover:border-purple-200 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm transition-transform group-hover:scale-105 ${selectedIds.includes(f._id) ? 'bg-purple-600' : 'bg-gray-400'
                                        }`}>
                                        {f.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 text-sm">{f.name}</h4>
                                        <div className="flex items-center gap-1 text-[11px] text-gray-500 uppercase font-medium">
                                            <MapPin className="w-3 h-3" />
                                            {f.department}
                                        </div>
                                        <p className="text-[10px] text-purple-600 mt-0.5">{f.designation}</p>
                                    </div>
                                </div>
                                {selectedIds.includes(f._id) && (
                                    <CheckCircle2 className="w-5 h-5 text-purple-600" />
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 text-gray-400 italic text-sm">
                            No faculty found matching your search.
                        </div>
                    )}
                </div>

                <DialogFooter className="mt-6 flex items-center justify-between gap-4">
                    <div className="text-sm font-medium text-gray-600">
                        Selected: <span className="text-purple-600 font-bold">{selectedIds.length}</span>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                            onClick={handleConfirm}
                            disabled={isSubmitting || selectedIds.length === 0}
                        >
                            {isSubmitting ? 'Confirming...' : 'Confirm Selection'}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

