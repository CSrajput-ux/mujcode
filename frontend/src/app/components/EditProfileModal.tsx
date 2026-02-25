import { API_URL, API_BASE_URL, UPLOADS_URL } from '@/shared/config/apiConfig';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { User, Building2, Lock, Save } from 'lucide-react';
import { toast } from 'sonner';

interface EditProfileModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export default function EditProfileModal({ open, onOpenChange, onSuccess }: EditProfileModalProps) {
    const [loading, setLoading] = useState(false);
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');

    const [formData, setFormData] = useState({
        year: user.year ? user.year.toString() : '',
        semester: user.semester ? user.semester.toString() : '',
        section: user.section && user.section !== '---' ? user.section : '',
    });

    // Determine lock status
    const isYearLocked = !!user.year;
    const isSemesterLocked = !!user.semester;
    const isSectionLocked = !!user.section && user.section !== '---';

    // Extract College ID from email
    const getCollegeId = (email: string) => {
        if (!email) return '---';
        const match = email.match(/\.(\d+)@/);
        return match ? match[1] : '---';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.year || !formData.semester || !formData.section) {
            toast.error('Please fill in all academic details');
            return;
        }

        setLoading(true);

        try {
            const token = sessionStorage.getItem('token');
            const res = await fetch(`${API_URL}/student/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            if (res.ok) {
                const data = await res.json();
                const updatedUser = { ...user, ...data.profile };
                sessionStorage.setItem('user', JSON.stringify(updatedUser));

                toast.success('Academic profile updated and locked!');
                window.dispatchEvent(new Event('profileUpdated'));

                onSuccess();
                onOpenChange(false);
            } else {
                const errorData = await res.json();
                toast.error(errorData.error || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Error connecting to server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none max-h-[90vh] flex flex-col shadow-2xl">
                <DialogHeader className="p-6 bg-gradient-to-r from-orange-500 to-rose-600 text-white shrink-0 relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Building2 className="w-24 h-24" />
                    </div>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <User className="w-6 h-6" />
                        Student Profile
                    </DialogTitle>
                    <DialogDescription className="text-orange-50/90 text-sm mt-1">
                        Please verify and complete your academic record.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                    <div className="p-6 space-y-6 bg-white overflow-y-auto custom-scrollbar flex-1">
                        {/* Static Info Section */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Basic Information</h4>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold shrink-0">
                                        {user.name ? user.name[0] : 'S'}
                                    </div>
                                    <div className="overflow-hidden">
                                        <div className="text-xs text-gray-500 font-medium">Full Name</div>
                                        <div className="text-sm font-bold text-gray-900 truncate">{user.name}</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl overflow-hidden">
                                        <div className="text-xs text-gray-500 font-medium">Registration ID</div>
                                        <div className="text-sm font-bold text-gray-900 font-mono">{getCollegeId(user.email)}</div>
                                    </div>
                                    <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl overflow-hidden">
                                        <div className="text-xs text-gray-500 font-medium">Branch</div>
                                        <div className="text-sm font-bold text-gray-900 truncate">{user.branch || 'CSE'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Editable/Locked Academic Section */}
                        <div className="space-y-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Academic Records</h4>
                                {(isYearLocked && isSemesterLocked && isSectionLocked) && (
                                    <div className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                                        <Lock className="w-3 h-3" />
                                        VERIFIED & LOCKED
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold text-gray-700">Academic Year</Label>
                                    <Select
                                        disabled={isYearLocked || loading}
                                        value={formData.year}
                                        onValueChange={(v) => setFormData(p => ({ ...p, year: v }))}
                                    >
                                        <SelectTrigger className="h-10 bg-white border-gray-200">
                                            <SelectValue placeholder="Select Year" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">1st Year</SelectItem>
                                            <SelectItem value="2">2nd Year</SelectItem>
                                            <SelectItem value="3">3rd Year</SelectItem>
                                            <SelectItem value="4">4th Year</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold text-gray-700">Semester</Label>
                                    <Select
                                        disabled={isSemesterLocked || loading}
                                        value={formData.semester}
                                        onValueChange={(v) => setFormData(p => ({ ...p, semester: v }))}
                                    >
                                        <SelectTrigger className="h-10 bg-white border-gray-200">
                                            <SelectValue placeholder="Select Sem" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                                                <SelectItem key={s} value={s.toString()}>Semester {s}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2 col-span-2">
                                    <Label className="text-xs font-semibold text-gray-700">Section</Label>
                                    <div className="relative">
                                        <Input
                                            placeholder="Enter Section (e.g. A, B, C)"
                                            disabled={isSectionLocked || loading}
                                            value={formData.section}
                                            onChange={(e) => setFormData(p => ({ ...p, section: e.target.value.toUpperCase() }))}
                                            className="h-10 bg-white border-gray-200 pr-10"
                                            maxLength={2}
                                        />
                                        {isSectionLocked && (
                                            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {!(isYearLocked && isSemesterLocked && isSectionLocked) ? (
                            <div className="p-3 bg-amber-50 text-amber-700 text-[11px] rounded-xl border border-amber-100 flex gap-2">
                                <div className="shrink-0 mt-0.5 font-bold">⚠️ NOTE:</div>
                                <div>These details can only be set ONE TIME. Please ensure the information is correct before saving.</div>
                            </div>
                        ) : (
                            <div className="p-3 bg-blue-50 text-blue-700 text-[11px] rounded-xl border border-blue-100 italic">
                                Academic records are verified by the registry. Contact administration for correction.
                            </div>
                        )}
                    </div>

                    <DialogFooter className="p-4 bg-gray-50 border-t border-gray-100 gap-2 shrink-0">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="text-gray-500 hover:bg-gray-200"
                        >
                            Cancel
                        </Button>
                        {!(isYearLocked && isSemesterLocked && isSectionLocked) && (
                            <Button
                                type="submit"
                                disabled={loading}
                                className="bg-orange-600 hover:bg-orange-700 text-white px-6 font-bold shadow-lg shadow-orange-200"
                            >
                                {loading ? 'Saving...' : 'Save & Lock Profile'}
                                <Save className="w-4 h-4 ml-2" />
                            </Button>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}


