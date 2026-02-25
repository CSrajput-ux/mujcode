import { API_URL, API_BASE_URL, UPLOADS_URL } from '@/shared/config/apiConfig';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { User, Building2, Lock, Save, GraduationCap } from 'lucide-react';

interface CompleteProfileDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export default function CompleteProfileDialog({ open, onOpenChange, onSuccess }: CompleteProfileDialogProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        year: '',
        semester: '',
        section: '',
        branch: 'CSE', // Default for now
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.year || !formData.semester || !formData.section) {
            return;
        }

        setLoading(true);

        try {
            const token = sessionStorage.getItem('token') || localStorage.getItem('token');
            const user = JSON.parse(sessionStorage.getItem('user') || localStorage.getItem('user') || '{}');

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
                localStorage.setItem('user', JSON.stringify(updatedUser));

                window.dispatchEvent(new Event('profileUpdated'));

                onSuccess();
                onOpenChange(false);
            } else {
                const errorData = await res.json();
                alert(errorData.error || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none max-h-[90vh] flex flex-col shadow-2xl">
                <DialogHeader className="p-6 bg-gradient-to-r from-orange-500 to-rose-600 text-white shrink-0 relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <GraduationCap className="w-24 h-24" />
                    </div>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <User className="w-6 h-6" />
                        Complete Profile
                    </DialogTitle>
                    <DialogDescription className="text-orange-50/90 text-sm mt-1">
                        Please set your academic records to access all features.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                    <div className="p-6 space-y-6 bg-white overflow-y-auto flex-1">
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Academic Records</h4>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold text-gray-700">Academic Year</Label>
                                    <Select
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
                                    <Input
                                        placeholder="Enter Section (e.g. A, B, C)"
                                        value={formData.section}
                                        onChange={(e) => setFormData(p => ({ ...p, section: e.target.value.toUpperCase() }))}
                                        className="h-10 bg-white border-gray-200"
                                        maxLength={2}
                                    />
                                </div>

                                <div className="space-y-2 col-span-2">
                                    <Label className="text-xs font-semibold text-gray-700">Branch</Label>
                                    <Input
                                        value={formData.branch}
                                        disabled
                                        className="h-10 bg-gray-50 border-gray-200 text-gray-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-3 bg-amber-50 text-amber-700 text-[11px] rounded-xl border border-amber-100 flex gap-2">
                            <div className="shrink-0 mt-0.5 font-bold">⚠️ NOTE:</div>
                            <div>These records can ONLY be set once. Please ensure they are correct.</div>
                        </div>
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
                        <Button
                            type="submit"
                            disabled={loading || !formData.year || !formData.semester || !formData.section}
                            className="bg-orange-600 hover:bg-orange-700 text-white px-6 font-bold shadow-lg shadow-orange-200"
                        >
                            {loading ? 'Saving...' : 'Set & Lock Profile'}
                            <Save className="w-4 h-4 ml-2" />
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

