import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/app/components/ui/dialog';
import { Label } from '@/app/components/ui/label';
import { User, Mail, Building2, GraduationCap, MapPin, Hash } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface StudentProfileModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function StudentProfileModal({ open, onOpenChange }: StudentProfileModalProps) {
    const { user } = useAuth();

    // Extract College ID from email
    const getCollegeId = (email: string | undefined) => {
        if (!email) return '---';
        const match = email.match(/\.(\d+)@/);
        return match ? match[1] : '---';
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

                <div className="p-6 space-y-6 bg-white overflow-y-auto">
                    {/* Account Info Section */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center">
                            <User className="w-3 h-3 mr-2" />
                            Personal Information
                        </h4>

                        <div className="grid grid-cols-1 gap-4">
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <Label className="text-[10px] uppercase text-gray-400 font-bold mb-1 block">Full Name</Label>
                                <div className="text-gray-900 font-semibold flex items-center">
                                    {user?.name || '---'}
                                </div>
                            </div>

                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <Label className="text-[10px] uppercase text-gray-400 font-bold mb-1 block">Institutional Email</Label>
                                <div className="text-gray-900 font-semibold flex items-center truncate">
                                    <Mail className="w-3 h-3 mr-2 text-orange-500" />
                                    {user?.email || '---'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Academic Details Section */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center">
                            <Building2 className="w-3 h-3 mr-2" />
                            Academic Records
                        </h4>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 col-span-2">
                                <Label className="text-[10px] uppercase text-gray-400 font-bold mb-1 block">School / Faculty</Label>
                                <div className="text-gray-900 font-semibold">{user?.school || 'Faculty of Engineering'}</div>
                            </div>

                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <Label className="text-[10px] uppercase text-gray-400 font-bold mb-1 block">Registration ID</Label>
                                <div className="text-gray-900 font-bold font-mono text-orange-600">{getCollegeId(user?.email)}</div>
                            </div>

                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <Label className="text-[10px] uppercase text-gray-400 font-bold mb-1 block">Department</Label>
                                <div className="text-gray-900 font-semibold">{user?.department || 'CSE'}</div>
                            </div>

                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <Label className="text-[10px] uppercase text-gray-400 font-bold mb-1 block">Course</Label>
                                <div className="text-gray-900 font-semibold">{user?.course || 'B.Tech'}</div>
                            </div>

                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <Label className="text-[10px] uppercase text-gray-400 font-bold mb-1 block">Branch</Label>
                                <div className="text-gray-900 font-semibold">{user?.branch || '---'}</div>
                            </div>

                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <Label className="text-[10px] uppercase text-gray-400 font-bold mb-1 block">Section</Label>
                                <div className="text-gray-900 font-semibold flex items-center">
                                    <Hash className="w-3 h-3 mr-1 text-gray-400" />
                                    {user?.section || '---'}
                                </div>
                            </div>

                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <Label className="text-[10px] uppercase text-gray-400 font-bold mb-1 block">Year</Label>
                                <div className="text-gray-900 font-semibold text-sm">
                                    {user?.year ? `${user.year}${['st', 'nd', 'rd'][user.year - 1] || 'th'} Year` : '---'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex items-start space-x-3">
                        <Shield className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                        <p className="text-[11px] text-orange-800 leading-relaxed font-medium">
                            This profile is verified by the registrar's office. If any details are incorrect, please contact the administration for correction.
                        </p>
                    </div>
                </div>

                <div className="p-4 bg-gray-50 flex justify-end shrink-0 border-t border-gray-100">
                    <button
                        onClick={() => onOpenChange(false)}
                        className="px-6 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg font-bold text-sm transition-all active:scale-95 shadow-sm"
                    >
                        Close
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

const Shield = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);
