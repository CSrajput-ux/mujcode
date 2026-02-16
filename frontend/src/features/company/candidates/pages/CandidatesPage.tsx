import { Search, Download, Eye } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent } from '@/app/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';

export default function CompanyCandidates() {

    const candidates = [
        {
            id: 1,
            name: 'Aditi Kishore',
            role: 'Software Engineer',
            email: 'aditi.kishore@example.com',
            phone: '+91 98765 43210',
            location: 'Jaipur, India',
            status: 'Shortlisted',
            score: 92,
            skills: ['React', 'Node.js', 'Python'],
            applied: '2 days ago'
        },
        {
            id: 2,
            name: 'Rohan Sharma',
            role: 'Data Analyst',
            email: 'rohan.sharma@example.com',
            phone: '+91 98765 43211',
            location: 'Delhi, India',
            status: 'Screening',
            score: 85,
            skills: ['SQL', 'Tableau', 'Excel'],
            applied: '1 week ago'
        },
        {
            id: 3,
            name: 'Priya Patel',
            role: 'Product Designer',
            email: 'priya.patel@example.com',
            phone: '+91 98765 43212',
            location: 'Mumbai, India',
            status: 'Rejected',
            score: 65,
            skills: ['Figma', 'Sketch', 'Adobe XD'],
            applied: '3 days ago'
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
                    <p className="text-gray-500">View and manage candidate applications</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input placeholder="Search by name, email, or role..." className="pl-10 border-none bg-gray-50 focus-visible:ring-0" />
                </div>
                <div className="flex gap-2 border-l pl-4 border-gray-200">
                    <select className="bg-transparent text-sm font-medium text-gray-600 focus:outline-none cursor-pointer">
                        <option>All Status</option>
                        <option>Shortlisted</option>
                        <option>Screening</option>
                        <option>Rejected</option>
                    </select>
                </div>
            </div>

            <div className="grid gap-4">
                {candidates.map((candidate) => (
                    <Card key={candidate.id} className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                                <div className="flex gap-4 items-center">
                                    <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${candidate.name}`} />
                                        <AvatarFallback>{candidate.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
                                        <p className="text-sm text-gray-500">{candidate.role}</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {candidate.skills.map((skill, i) => (
                                        <Badge key={i} variant="secondary" className="bg-gray-100 text-gray-600 font-normal">
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-sm font-medium text-gray-900">Score: {candidate.score}</p>
                                        <p className="text-xs text-gray-400">Applied {candidate.applied}</p>
                                    </div>
                                    <Badge variant={
                                        candidate.status === 'Shortlisted' ? 'default' :
                                            candidate.status === 'Rejected' ? 'destructive' : 'secondary'
                                    } className={
                                        candidate.status === 'Shortlisted' ? 'bg-green-100 text-green-700 hover:bg-green-200' : ''
                                    }>
                                        {candidate.status}
                                    </Badge>
                                    <Button size="icon" variant="ghost" className="text-gray-400 hover:text-blue-600">
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
