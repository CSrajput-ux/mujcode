import { Plus, Search, Filter, MoreHorizontal, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent } from '@/app/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';

export default function CompanyDrives() {

    const drives = [
        {
            id: 1,
            title: 'Senior Software Engineer',
            type: 'Full Time',
            location: 'Bangalore (Hybrid)',
            posted: '2 days ago',
            status: 'Live',
            applicants: 452,
            shortlisted: 68,
            interviewed: 12
        },
        {
            id: 2,
            title: 'Product Designer',
            type: 'Full Time',
            location: 'Remote',
            posted: '5 days ago',
            status: 'Interviewing',
            applicants: 128,
            shortlisted: 24,
            interviewed: 8
        },
        {
            id: 3,
            title: 'Data Analyst Intern',
            type: 'Internship',
            location: 'Gurugram',
            posted: '1 week ago',
            status: 'Closed',
            applicants: 850,
            shortlisted: 45,
            interviewed: 0
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Recruitment Drives</h1>
                    <p className="text-gray-500">Manage your active job postings and applications</p>
                </div>
                <Button className="bg-[#FF7A00] hover:bg-[#FF6A00]">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Drive
                </Button>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input placeholder="Search drives..." className="pl-10" />
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="flex gap-2">
                        <Filter className="w-4 h-4" />
                        Filter
                    </Button>
                </div>
            </div>

            {/* Drives List */}
            <div className="grid gap-4">
                {drives.map((drive) => (
                    <Card key={drive.id} className="group hover:shadow-md transition-all border-gray-100">
                        <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row gap-6 lg:items-center justify-between">
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                            {drive.title}
                                        </h3>
                                        <Badge variant={
                                            drive.status === 'Live' ? 'default' :
                                                drive.status === 'Closed' ? 'secondary' : 'outline'
                                        } className={
                                            drive.status === 'Live' ? 'bg-green-100 text-green-700 hover:bg-green-200' :
                                                drive.status === 'Interviewing' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : ''
                                        }>
                                            {drive.status}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span>{drive.type}</span>
                                        <span>•</span>
                                        <span>{drive.location}</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" /> {drive.posted}
                                        </span>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="flex items-center gap-8 border-t lg:border-t-0 pt-4 lg:pt-0 border-gray-100">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-gray-900">{drive.applicants}</p>
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Applicants</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-gray-900">{drive.shortlisted}</p>
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Shortlisted</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-gray-900">{drive.interviewed}</p>
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Interviews</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 border-t lg:border-t-0 pt-4 lg:pt-0 border-gray-100">
                                    <Button variant="outline" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                        View Candidates <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="w-4 h-4 text-gray-500" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>Edit Drive</DropdownMenuItem>
                                            <DropdownMenuItem>Pause Accepting</DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-600">Close Drive</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
