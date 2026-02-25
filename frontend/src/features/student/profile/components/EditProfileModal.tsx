import { API_URL, API_BASE_URL, UPLOADS_URL } from '@/shared/config/apiConfig';
import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { User, Building2, Lock, Save, GraduationCap, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface EditProfileModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export default function EditProfileModal({ open, onOpenChange, onSuccess }: EditProfileModalProps) {
    const { user, refreshUser } = useAuth();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        year: '',
        semester: '',
        section: '',
    });

    useEffect(() => {
        if (user && open) {
            setFormData({
                year: user.year ? user.year.toString() : '',
                semester: user.semester ? user.semester.toString() : '',
                section: user.section && user.section !== '---' ? user.section : '',
            });
        }
    }, [user, open]);

    // Determine lock status
    const isYearLocked = !!user?.year;
    const isSemesterLocked = !!user?.semester;
    const isSectionLocked = !!user?.section && user?.section !== '---';

    // Extract College ID from email
    const getCollegeId = (email: string | undefined) => {
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
            const res = await fetch(`${API_URL}/student/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            if (res.ok) {
                await refreshUser();
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
            <DialogContent className="w-[95vw] sm:max-w-[450px] p-0 overflow-hidden border-none max-h-[90vh] flex flex-col shadow-2xl">
                <DialogHeader className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white shrink-0 relative overflow-hidden">
                    <div className="absolute -right-6 -bottom-6 opacity-10">
                        <GraduationCap className="w-32 h-32" />
                    </div>
                    <div className="flex items-center space-x-4 relative z-10">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold backdrop-blur-md shadow-inner border border-white/30">
                            {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-bold">{user?.name || 'Student Profile'}</DialogTitle>
                            <DialogDescription className="text-orange-50/90 text-sm font-medium">
                                Academic Profile Record
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                    <div className="p-6 space-y-6 bg-white overflow-y-auto flex-1">
                        {/* Static Info Section */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center">
                                <User className="w-3 h-3 mr-2" />
                                Personal info
                            </h4>
                            <div className="grid grid-cols-1 gap-3">
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 overflow-hidden">
                                    <Label className="text-[10px] uppercase text-gray-400 font-bold mb-1 block">College Email</Label>
                                    <div className="text-gray-900 font-semibold flex items-center text-sm truncate">
                                        <Mail className="w-3 h-3 mr-2 text-orange-500" />
                                        {user?.email || '---'}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <Label className="text-[10px] uppercase text-gray-400 font-bold mb-1 block">Registration ID</Label>
                                        <div className="text-gray-900 font-bold font-mono text-orange-600 text-sm">{getCollegeId(user?.email)}</div>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 overflow-hidden">
                                        <Label className="text-[10px] uppercase text-gray-400 font-bold mb-1 block">Department</Label>
                                        <div className="text-gray-900 font-semibold text-sm truncate">{user?.department || 'CSE'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Academic Section */}
                        <div className="space-y-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center">
                                    <Building2 className="w-3 h-3 mr-2" />
                                    Academic Details
                                </h4>
                                {(isYearLocked && isSemesterLocked && isSectionLocked) && (
                                    <div className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                                        <Lock className="w-3 h-3" />
                                        LOCKED
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

                        {!(isYearLocked && isSemesterLocked && isSectionLocked) && (
                            <div className="p-3 bg-amber-50 text-amber-700 text-[11px] rounded-xl border border-amber-100 flex gap-2">
                                <div className="shrink-0 mt-0.5 font-bold">⚠️ NOTE:</div>
                                <div>Academic details (Year, Semester, Section) can only be set ONE TIME.</div>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="p-4 bg-gray-50 border-t border-gray-100 gap-2 shrink-0">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="text-gray-500 hover:bg-gray-200 font-bold"
                        >
                            Close
                        </Button>
                        {!(isYearLocked && isSemesterLocked && isSectionLocked) && (
                            <Button
                                type="submit"
                                disabled={loading}
                                className="bg-orange-600 hover:bg-orange-700 text-white px-6 font-bold shadow-lg shadow-orange-200"
                            >
                                {loading ? 'Saving...' : 'Save & Lock'}
                                <Save className="w-4 h-4 ml-2" />
                            </Button>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

