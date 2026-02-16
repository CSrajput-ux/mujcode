import { useNavigate } from 'react-router-dom';
import { Users, Briefcase, CheckCircle, TrendingUp, ArrowRight, UserPlus, FileText } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';

export default function CompanyDashboard() {
    const navigate = useNavigate();

    const stats = [
        { label: 'Active Drives', value: '3', change: '+1 this week', icon: <Briefcase className="w-5 h-5" />, color: 'bg-blue-50 text-blue-600' },
        { label: 'Total Applicants', value: '1,245', change: '+12% vs last month', icon: <Users className="w-5 h-5" />, color: 'bg-green-50 text-green-600' },
        { label: 'Shortlisted', value: '186', change: '15% conversion rate', icon: <CheckCircle className="w-5 h-5" />, color: 'bg-purple-50 text-purple-600' },
        { label: 'Hired', value: '52', change: 'Year to date', icon: <TrendingUp className="w-5 h-5" />, color: 'bg-orange-50 text-orange-600' },
    ];

    const recentActivities = [
        { user: 'Snedon Aubrey', action: 'applied for', job: 'Software Engineer', time: '2 mins ago' },
        { user: 'Aditi Kishore', action: 'completed assessment', job: 'Data Analyst', time: '15 mins ago' },
        { user: 'Krish Ajmera', action: 'accepted offer', job: 'Product Designer', time: '1 hour ago' },
    ];

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500">Welcome back, Google India Team</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => navigate('/company/assessments')}>
                        <FileText className="w-4 h-4 mr-2" />
                        Create Assessment
                    </Button>
                    <Button className="bg-[#FF7A00] hover:bg-[#FF6A00]" onClick={() => navigate('/company/drives')}>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Post New Job
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow duration-200">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-2 rounded-lg ${stat.color}`}>
                                    {stat.icon}
                                </div>
                                <Badge variant="outline" className="text-xs font-normal bg-gray-50 text-gray-600 border-gray-100">
                                    {stat.change}
                                </Badge>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Active Drives */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-900">Active Recruitment Drives</h2>
                        <Button variant="ghost" className="text-sm text-blue-600 hover:text-blue-700" onClick={() => navigate('/company/drives')}>
                            View All <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {[1, 2].map((_, i) => (
                            <Card key={i} className="group border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                                                    {i === 0 ? 'Senior Software Engineer' : 'Data Analyst'}
                                                </h3>
                                                <Badge className={`${i === 0 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'} hover:bg-opacity-80`}>
                                                    {i === 0 ? 'Live' : 'Screening'}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <span>Full Time</span>
                                                <span>•</span>
                                                <span>Bangalore (Hybrid)</span>
                                                <span>•</span>
                                                <span>Posted 2 days ago</span>
                                            </div>
                                        </div>
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3, 4].map(n => (
                                                <div key={n} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                                                    {String.fromCharCode(64 + n)}
                                                </div>
                                            ))}
                                            <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs text-gray-600">
                                                +42
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between text-sm">
                                        <div className="flex gap-6">
                                            <div>
                                                <span className="block font-semibold text-gray-900">450</span>
                                                <span className="text-gray-500">Applicants</span>
                                            </div>
                                            <div>
                                                <span className="block font-semibold text-gray-900">12</span>
                                                <span className="text-gray-500">Interviews</span>
                                            </div>
                                        </div>
                                        <div className="h-2 w-24 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500 rounded-full" style={{ width: '60%' }}></div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                    <Card className="border-none shadow-sm bg-white">
                        <CardContent className="p-0">
                            <div className="divide-y divide-gray-50">
                                {recentActivities.map((activity, index) => (
                                    <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex gap-3">
                                            <div className="mt-1 w-2 h-2 rounded-full bg-blue-500"></div>
                                            <div>
                                                <p className="text-sm text-gray-900">
                                                    <span className="font-medium">{activity.user}</span> {activity.action} <span className="font-medium">{activity.job}</span>
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button variant="ghost" className="w-full text-sm text-gray-500 hover:text-gray-900 py-4">
                                View All Activity
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Quick Action Card (Proctoring) */}
                    <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none shadow-lg">
                        <CardContent className="p-6">
                            <h3 className="font-semibold text-lg mb-2">Proctoring Active</h3>
                            <p className="text-indigo-100 text-sm mb-4">
                                Usage is high today. Check live sessions for ongoing assessments.
                            </p>
                            <Button size="sm" variant="secondary" className="w-full text-indigo-700 font-medium">
                                Monitor Sessions
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
