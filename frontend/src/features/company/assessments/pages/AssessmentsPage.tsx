import { Plus, Clock, FileText, BarChart, MoreVertical } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Progress } from '@/app/components/ui/progress';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { Badge } from '@/app/components/ui/badge';

export default function CompanyAssessments() {
    const assessments = [
        {
            id: 1,
            title: 'Technical Round 1 - Coding',
            role: 'Software Engineer',
            duration: '90 mins',
            questions: 3,
            candidates: 156,
            completed: 142,
            avgScore: 78,
            status: 'Active'
        },
        {
            id: 2,
            title: 'Aptitude & Reasoning',
            role: 'Data Analyst',
            duration: '60 mins',
            questions: 50,
            candidates: 89,
            completed: 85,
            avgScore: 65,
            status: 'Draft'
        },
        {
            id: 3,
            title: 'System Design',
            role: 'Senior Engineer',
            duration: '45 mins',
            questions: 1,
            candidates: 45,
            completed: 12,
            avgScore: 0,
            status: 'Scheduled'
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Assessments</h1>
                    <p className="text-gray-500">Create and manage technical assessments</p>
                </div>
                <Button className="bg-[#FF7A00] hover:bg-[#FF6A00]">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Assessment
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assessments.map((assessment) => (
                    <Card key={assessment.id} className="hover:shadow-lg transition-shadow border-t-4 border-t-blue-500">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <Badge className={`
                              ${assessment.status === 'Active' ? 'bg-green-100 text-green-700' :
                                        assessment.status === 'Draft' ? 'bg-gray-100 text-gray-700' : 'bg-blue-100 text-blue-700'}
                          `}>{assessment.status}</Badge>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <MoreVertical className="w-4 h-4 text-gray-400" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <CardTitle className="text-lg mt-2">{assessment.title}</CardTitle>
                            <CardDescription>{assessment.role}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    {assessment.duration}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <FileText className="w-4 h-4 text-gray-400" />
                                    {assessment.questions} Qs
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Completion Rate</span>
                                    <span className="font-medium text-gray-900">{Math.round((assessment.completed / assessment.candidates) * 100)}%</span>
                                </div>
                                <Progress value={(assessment.completed / assessment.candidates) * 100} className="h-2" />
                                <p className="text-xs text-gray-400 text-right">{assessment.completed}/{assessment.candidates} Candidates</p>
                            </div>

                            <Button variant="outline" className="w-full mt-6">
                                <BarChart className="w-4 h-4 mr-2" /> View Analytics
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
