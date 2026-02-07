import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { toast } from 'sonner';

interface CreateTestModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CreateTestModal({ open, onOpenChange }: CreateTestModalProps) {
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            onOpenChange(false);
            toast.success("Test created successfully!");
        }, 1000);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Create New Test / Quiz</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Academic Year</Label>
                            <Select>
                                <SelectTrigger><SelectValue placeholder="Select Year" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">1st Year</SelectItem>
                                    <SelectItem value="2">2nd Year</SelectItem>
                                    <SelectItem value="3">3rd Year</SelectItem>
                                    <SelectItem value="4">4th Year</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Branch</Label>
                            <Select>
                                <SelectTrigger><SelectValue placeholder="Select Branch" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cse">CSE</SelectItem>
                                    <SelectItem value="it">IT</SelectItem>
                                    <SelectItem value="ece">ECE</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Section</Label>
                            <Select>
                                <SelectTrigger><SelectValue placeholder="Select Section" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="a">Section A</SelectItem>
                                    <SelectItem value="b">Section B</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Type</Label>
                            <Select defaultValue="test">
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="test">Coding Test</SelectItem>
                                    <SelectItem value="quiz">Quiz (MCQ)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Subject / Course</Label>
                        <Input placeholder="e.g. Data Structures" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Total Marks</Label>
                            <Input type="number" placeholder="100" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Duration (mins)</Label>
                            <Input type="number" placeholder="60" />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label>Schedule Date & Time</Label>
                        <Input type="datetime-local" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button className="bg-[#FF7A00] hover:bg-[#FF6A00]" onClick={handleCreate} disabled={loading}>
                        {loading ? 'Creating...' : 'Create & Publish'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
