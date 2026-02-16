import { useState, useEffect } from 'react';
import StudentLayout from '@/features/student/shared/components/StudentLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import {
    Briefcase,
    Building2,
    Calendar,
    MapPin,
    ChevronRight,
    Search,
    Filter,
    CheckCircle2,
    Clock,
    AlertCircle
} from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import placementService from '@/app/services/placementService';

interface JobPosting {
    id: number;
    role: string;
    ctc: string;
    locations: string;
    eligibilityCriteria: any;
    status: string;
    PlacementDrive: {
        id: number;
        title: string;
        driveDate: string;
        Company: {
            name: string;
            logoUrl: string;
            industry: string;
        };
    };
}

interface Application {
    id: number;
    jobId: number;
    status: string;
    appliedAt: string;
    JobPosting: JobPosting;
}

export default function JobsPage() {
    const [drives, setDrives] = useState<any[]>([]);
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [applying, setApplying] = useState<number | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [drivesData, appsData] = await Promise.all([
                    placementService.getPlacementDrives(),
                    placementService.getMyApplications()
                ]);
                setDrives(drivesData);
                setApplications(appsData);
            } catch (error) {
                console.error("Error loading placement data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleApply = async (jobId: number) => {
        setApplying(jobId);
        try {
            await placementService.applyForJob(jobId);
            const appsData = await placementService.getMyApplications();
            setApplications(appsData);
            alert("Applied successfully!");
        } catch (error: any) {
            alert(error.response?.data?.message || "Failed to apply");
        } finally {
            setApplying(null);
        }
    };

    const isApplied = (jobId: number) => {
        return applications.some(app => app.jobId === jobId);
    };

    const filteredDrives = drives.filter(drive =>
        drive.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        drive.Company.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <StudentLayout>
            <div className="space-y-8 max-w-7xl mx-auto pb-12">
                {/* Header Section */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-8 md:p-12 text-white shadow-2xl">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Briefcase className="w-48 h-48" />
                    </div>
                    <div className="relative z-10 space-y-4">
                        <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 px-3 py-1 text-sm font-semibold backdrop-blur-md">
                            Campus Recruitment 2026
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                            Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">Career Journey</span>
                        </h1>
                        <p className="text-gray-400 max-w-2xl text-lg font-medium leading-relaxed">
                            Discover premium opportunities from top-tier companies. Track your applications and prepare for the next big milestone.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Content Areas */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Search & Stats */}
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Search companies or roles..."
                                    className="pl-10 h-11 bg-gray-50/50 border-none focus:ring-2 focus:ring-orange-500/20 rounded-xl"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2 w-full md:w-auto">
                                <Button variant="outline" className="flex-1 md:w-auto h-11 border-gray-100 rounded-xl hover:bg-gray-50">
                                    <Filter className="w-4 h-4 mr-2" />
                                    Filter
                                </Button>
                            </div>
                        </div>

                        {/* Drive List */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center px-2">
                                <Clock className="w-5 h-5 mr-2 text-orange-500" />
                                Active Recruitment Drives
                            </h2>

                            {loading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-48 bg-gray-100 rounded-3xl animate-pulse" />
                                    ))}
                                </div>
                            ) : filteredDrives.length > 0 ? (
                                filteredDrives.map((drive) => (
                                    <Card key={drive.id} className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 rounded-3xl bg-white ring-1 ring-gray-100">
                                        <div className="p-1">
                                            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6">
                                                {/* Company info */}
                                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 p-4 shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-300">
                                                    {drive.Company.logoUrl ? (
                                                        <img src={drive.Company.logoUrl} alt={drive.Company.name} className="max-w-full max-h-full object-contain" />
                                                    ) : (
                                                        <Building2 className="w-10 h-10 text-gray-300" />
                                                    )}
                                                </div>

                                                <div className="flex-1 space-y-4">
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">{drive.Company.industry || 'Technology'}</span>
                                                                {isApplied(drive.JobPostings?.[0]?.id) && (
                                                                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-2 py-0">Already Applied</Badge>
                                                                )}
                                                            </div>
                                                            <h3 className="text-2xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{drive.title}</h3>
                                                            <p className="text-gray-500 font-medium">{drive.Company.name}</p>
                                                        </div>
                                                        <div className="text-left md:text-right">
                                                            <div className="text-xl font-bold text-gray-900">{drive.JobPostings?.[0]?.ctc || 'N/A'}</div>
                                                            <div className="text-sm text-gray-500 font-medium">Estimated Package (CTC)</div>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                                                        <div className="flex items-center text-sm text-gray-600 bg-gray-50/80 px-4 py-2 rounded-xl">
                                                            <Calendar className="w-4 h-4 mr-2 text-orange-500" />
                                                            {new Date(drive.driveDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                                        </div>
                                                        <div className="flex items-center text-sm text-gray-600 bg-gray-50/80 px-4 py-2 rounded-xl">
                                                            <MapPin className="w-4 h-4 mr-2 text-orange-500" />
                                                            {drive.JobPostings?.[0]?.locations || 'On-campus'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-gray-50/50 p-4 md:px-8 flex items-center justify-between border-t border-gray-100 group-hover:bg-orange-50/30 transition-colors">
                                                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                                    {drive.JobPostings?.[0]?.role || 'Software Engineer'} Role
                                                </div>
                                                <Button
                                                    disabled={applying === drive.JobPostings?.[0]?.id || isApplied(drive.JobPostings?.[0]?.id)}
                                                    onClick={() => handleApply(drive.JobPostings?.[0]?.id)}
                                                    className={`rounded-2xl px-8 h-10 font-bold transition-all ${isApplied(drive.JobPostings?.[0]?.id)
                                                        ? 'bg-gray-100 text-gray-500 hover:bg-gray-100'
                                                        : 'bg-orange-600 hover:bg-orange-700 text-white shadow-lg hover:shadow-orange-500/20 active:scale-95'
                                                        }`}
                                                >
                                                    {applying === drive.JobPostings?.[0]?.id ? 'Processing...' : isApplied(drive.JobPostings?.[0]?.id) ? 'Application Sent' : 'Fast Apply'}
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))
                            ) : (
                                <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-100">
                                    <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                        <AlertCircle className="w-8 h-8 text-gray-300" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">No matching drives found</h3>
                                    <p className="text-gray-500">Try adjusting your search criteria</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar Area: Applications Stats */}
                    <div className="lg:col-span-4 space-y-6">
                        <Card className="rounded-3xl border-none bg-white shadow-lg overflow-hidden ring-1 ring-gray-100">
                            <CardHeader className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6">
                                <CardTitle className="text-xl">My Applications</CardTitle>
                                <CardDescription className="text-orange-50 font-medium">Tracking {applications.length} recruitment active flows</CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 space-y-3">
                                {applications.length > 0 ? (
                                    applications.map((app) => (
                                        <div key={app.id} className="p-4 rounded-2xl bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 transition-all cursor-pointer group shadow-sm hover:shadow-md">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs font-bold text-orange-600">{app.JobPosting.PlacementDrive.Company.name}</span>
                                                <Badge className={`
                                                    ${app.status === 'Applied' ? 'bg-blue-100 text-blue-700' :
                                                        app.status === 'Shortlisted' ? 'bg-amber-100 text-amber-700' :
                                                            app.status === 'Selected' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}
                                                    border-none px-2 py-0.5 text-[10px]
                                                `}>
                                                    {app.status}
                                                </Badge>
                                            </div>
                                            <div className="font-bold text-gray-900 text-sm group-hover:text-orange-600 transition-colors uppercase">{app.JobPosting.role}</div>
                                            <div className="text-[10px] text-gray-400 mt-1 flex items-center">
                                                <Calendar className="w-3 h-3 mr-1" />
                                                Applied on {new Date(app.appliedAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-12 text-center">
                                        <p className="text-gray-400 text-sm font-medium">No applications found</p>
                                        <p className="text-xs text-gray-300 mt-1">Start by applying for drives on the left</p>
                                    </div>
                                )}
                            </CardContent>
                            {applications.length > 0 && (
                                <CardFooter className="p-4 pt-0">
                                    <Button variant="ghost" className="w-full rounded-xl text-orange-600 hover:text-orange-700 hover:bg-orange-50 font-bold text-sm">
                                        View All Applications
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </CardFooter>
                            )}
                        </Card>

                        {/* T&P Guidelines or Notifications */}
                        <Card className="rounded-3xl border-none bg-[#f8fafc] shadow-sm p-6 space-y-4">
                            <h4 className="font-bold text-gray-900 text-base flex items-center">
                                <AlertCircle className="w-5 h-5 mr-2 text-orange-500" />
                                T&P Guidelines
                            </h4>
                            <ul className="space-y-3 text-sm text-gray-600">
                                <li className="flex items-start">
                                    <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500 shrink-0 mt-0.5" />
                                    Ensure your profile is complete before the drive date.
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500 shrink-0 mt-0.5" />
                                    Drives follow a 'One Student One Offer' policy.
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500 shrink-0 mt-0.5" />
                                    Late applications will not be entertained by the portal.
                                </li>
                            </ul>
                        </Card>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
