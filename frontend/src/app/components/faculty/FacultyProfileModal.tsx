import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { User, Mail, Shield, Briefcase, Building, Phone, Linkedin, ExternalLink } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface FacultyProfileModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export default function FacultyProfileModal({ open, onOpenChange, onSuccess }: FacultyProfileModalProps) {
    const { user } = useAuth();
    const stella = user?.stellaProfile;

    // Fallback to sessionStorage if AuthContext not available
    const fallbackUser = !user ? JSON.parse(sessionStorage.getItem('user') || '{}') : null;
    const displayUser = user || fallbackUser;
    const displayStella = stella || displayUser?.stellaProfile;

    const hasPhoto = displayStella?.photo_url && displayStella.photo_url.length > 0;
    const hasLinkedin = displayStella?.linkedin && displayStella.linkedin.length > 0;
    const hasPhone = displayStella?.phone && displayStella.phone.length > 3;
    const hasDetailUrl = displayStella?.detail_url && displayStella.detail_url.length > 0;

    const getInitials = (name: string) => {
        if (!name) return 'FM';
        return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden border-none shadow-2xl rounded-2xl">
                {/* Header with gradient */}
                <DialogHeader className="p-8 pb-20 bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 text-white relative overflow-hidden">
                    <div className="absolute right-0 top-0 p-6 opacity-10">
                        <Shield className="w-28 h-28" />
                    </div>
                    <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/5 rounded-full" />
                    <DialogTitle className="text-2xl font-bold mb-1 relative z-10">Faculty Profile</DialogTitle>
                    <DialogDescription className="text-purple-100/90 relative z-10">
                        Your institutional profile from MUJ records
                    </DialogDescription>
                </DialogHeader>

                <div className="p-8 pt-0 space-y-6 bg-white -mt-2 rounded-t-2xl relative">
                    {/* Avatar / Photo */}
                    <div className="flex justify-center -mt-14 relative z-10">
                        {hasPhoto ? (
                            <div className="w-24 h-24 bg-white rounded-full p-1 shadow-xl">
                                <img
                                    src={displayStella.photo_url}
                                    alt={displayUser?.name || 'Faculty'}
                                    className="w-full h-full rounded-full object-cover"
                                    onError={(e) => {
                                        // Fallback to initials on image error
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        const parent = target.parentElement;
                                        if (parent) {
                                            parent.innerHTML = `<div class="w-full h-full bg-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">${getInitials(displayUser?.name || '')}</div>`;
                                        }
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="w-24 h-24 bg-white rounded-full p-1 shadow-xl">
                                <div className="w-full h-full bg-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                                    {getInitials(displayUser?.name || '')}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Name centered */}
                    <div className="text-center mt-3">
                        <h3 className="text-xl font-bold text-gray-900">{displayUser?.name || 'Faculty Member'}</h3>
                        <p className="text-sm text-purple-600 font-medium mt-0.5">
                            {displayStella?.designation || displayUser?.designation || 'Faculty'}
                        </p>
                    </div>

                    {/* Details Grid */}
                    <div className="space-y-4 mt-4">
                        {/* Department */}
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Department</Label>
                            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <Building className="w-4 h-4 text-purple-500 flex-shrink-0" />
                                <span className="font-medium text-gray-900 text-sm">{displayStella?.department || displayUser?.department || 'N/A'}</span>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">College Email</Label>
                            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <Mail className="w-4 h-4 text-purple-500 flex-shrink-0" />
                                <span className="font-medium text-gray-900 text-sm">{displayUser?.email || 'N/A'}</span>
                            </div>
                        </div>

                        {/* Phone & Role Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {hasPhone && (
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone</Label>
                                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                        <Phone className="w-4 h-4 text-purple-500 flex-shrink-0" />
                                        <span className="font-medium text-gray-900 text-sm">{displayStella.phone}</span>
                                    </div>
                                </div>
                            )}
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Role</Label>
                                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-xl border border-purple-100">
                                    <Shield className="w-4 h-4 text-purple-600 flex-shrink-0" />
                                    <span className="font-bold text-purple-700 uppercase text-xs">{displayUser?.role || 'faculty'}</span>
                                </div>
                            </div>
                        </div>

                        {/* LinkedIn */}
                        {hasLinkedin && (
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">LinkedIn</Label>
                                <a
                                    href={displayStella.linkedin!.startsWith('http') ? displayStella.linkedin : `https://${displayStella.linkedin}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors group"
                                >
                                    <Linkedin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                    <span className="font-medium text-blue-700 text-sm truncate group-hover:underline">
                                        {displayStella.linkedin!.replace(/https?:\/\/(www\.)?linkedin\.com\/in\//i, '').replace(/\/$/, '')}
                                    </span>
                                    <ExternalLink className="w-3 h-3 text-blue-400 flex-shrink-0 ml-auto" />
                                </a>
                            </div>
                        )}

                        {/* MUJ Profile Link */}
                        {hasDetailUrl && (
                            <a
                                href={displayStella.detail_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center space-x-2 p-3 bg-orange-50 rounded-xl border border-orange-100 hover:bg-orange-100 transition-colors text-orange-700 text-sm font-semibold"
                            >
                                <ExternalLink className="w-4 h-4" />
                                <span>View Full MUJ Profile</span>
                            </a>
                        )}
                    </div>

                    <DialogFooter className="pt-3 border-t border-gray-100">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="w-full text-gray-500 font-semibold rounded-xl"
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
