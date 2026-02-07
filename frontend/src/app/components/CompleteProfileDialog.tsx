import { useState, useEffect } from 'react';
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

interface CompleteProfileDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export default function CompleteProfileDialog({ open, onOpenChange, onSuccess }: CompleteProfileDialogProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        section: '',
        branch: '',
        year: '',
        course: '',
        department: ''
    });

    // Fetch existing profile data when dialog opens
    useEffect(() => {
        if (open) {
            const fetchProfile = async () => {
                try {
                    const user = JSON.parse(localStorage.getItem('user') || '{}');
                    const userId = user.id;

                    if (!userId) return;

                    const res = await fetch(`http://localhost:5000/api/student/profile/${userId}`);
                    if (res.ok) {
                        const data = await res.json();
                        if (data.profile) {
                            setFormData({
                                section: data.profile.section || '',
                                branch: data.profile.branch || '',
                                year: data.profile.year ? data.profile.year.toString() : '',
                                course: data.profile.course || '',
                                department: data.profile.department || ''
                            });
                        }
                    }
                } catch (error) {
                    console.error('Error fetching profile:', error);
                }
            };
            fetchProfile();
        }
    }, [open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const userId = user.id;

            const res = await fetch(`http://localhost:5000/api/student/profile/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                // Update local storage with new profile data
                const updatedUser = { ...user, ...formData };
                localStorage.setItem('user', JSON.stringify(updatedUser));

                onSuccess();
                onOpenChange(false);
            } else {
                alert('Failed to update profile');
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
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Complete Your Profile</DialogTitle>
                    <DialogDescription>
                        Please provide your academic details to complete your profile.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        {/* Branch */}
                        <div className="grid gap-2">
                            <Label htmlFor="branch">Branch</Label>
                            <Select value={formData.branch} onValueChange={(value) => setFormData({ ...formData, branch: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select branch" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CSE">Computer Science Engineering</SelectItem>
                                    <SelectItem value="ECE">Electronics & Communication</SelectItem>
                                    <SelectItem value="ME">Mechanical Engineering</SelectItem>
                                    <SelectItem value="CE">Civil Engineering</SelectItem>
                                    <SelectItem value="EE">Electrical Engineering</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Section */}
                        <div className="grid gap-2">
                            <Label htmlFor="section">Section</Label>
                            <Select value={formData.section} onValueChange={(value) => setFormData({ ...formData, section: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select section" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="A">Section A</SelectItem>
                                    <SelectItem value="B">Section B</SelectItem>
                                    <SelectItem value="C">Section C</SelectItem>
                                    <SelectItem value="D">Section D</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Year */}
                        <div className="grid gap-2">
                            <Label htmlFor="year">Year</Label>
                            <Select value={formData.year} onValueChange={(value) => setFormData({ ...formData, year: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select year" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">1st Year</SelectItem>
                                    <SelectItem value="2">2nd Year</SelectItem>
                                    <SelectItem value="3">3rd Year</SelectItem>
                                    <SelectItem value="4">4th Year</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Course */}
                        <div className="grid gap-2">
                            <Label htmlFor="course">Course</Label>
                            <Input
                                id="course"
                                value={formData.course}
                                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                                placeholder="e.g., B.Tech"
                            />
                        </div>

                        {/* Department */}
                        <div className="grid gap-2">
                            <Label htmlFor="department">Department</Label>
                            <Input
                                id="department"
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                placeholder="e.g., School of Computing"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="bg-[#FF7A00] hover:bg-[#E66D00]">
                            {loading ? 'Saving...' : 'Save Profile'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
