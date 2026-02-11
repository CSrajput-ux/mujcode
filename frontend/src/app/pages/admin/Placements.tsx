import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { getPlacements } from '../../services/adminService';
import { toast } from 'sonner';
import { Plus, ArrowLeft, Briefcase } from 'lucide-react';

export default function Placements() {
    const navigate = useNavigate();
    const [placements, setPlacements] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        pages: 0
    });

    useEffect(() => {
        fetchPlacements();
    }, [pagination.page, statusFilter]);

    const fetchPlacements = async () => {
        try {
            setLoading(true);
            const data = await getPlacements({
                page: pagination.page,
                limit: pagination.limit,
                status: statusFilter
            });
            setPlacements(data.placements);
            setPagination(data.pagination);
        } catch (error) {
            console.error('Error fetching placements:', error);
            toast.error('Failed to load placements');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        setPagination({ ...pagination, page: newPage });
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatSalary = (salary: any) => {
        if (!salary) return 'Not disclosed';
        if (salary.min && salary.max) {
            return `₹${salary.min} - ₹${salary.max} LPA`;
        }
        return 'Not disclosed';
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/admin/dashboard')}
                        className="mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Button>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Placement Drives</h1>
                            <p className="text-gray-600 mt-1">Manage all placement opportunities</p>
                        </div>
                        <Button onClick={() => navigate('/admin/placements/add')}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Placement
                        </Button>
                    </div>
                </div>

                <Card className="mb-6">
                    <CardContent className="p-4">
                        <div className="flex gap-4">
                            <select
                                className="px-3 py-2 border rounded-md"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="closed">Closed</option>
                                <option value="upcoming">Upcoming</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Placements List ({pagination.total} total)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-32 bg-gray-100 rounded animate-pulse" />
                                ))}
                            </div>
                        ) : placements.length === 0 ? (
                            <div className="text-center py-12">
                                <Briefcase className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                                <p className="text-gray-500 text-lg">No placement drives found</p>
                                <Button onClick={() => navigate('/admin/placements/add')} className="mt-4">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create First Placement
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-4">
                                    {placements.map((placement) => (
                                        <Card key={placement._id} className="hover:shadow-md transition-shadow">
                                            <CardContent className="p-4">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h3 className="font-semibold text-lg text-gray-900">
                                                                {placement.role}
                                                            </h3>
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${placement.status === 'active'
                                                                ? 'bg-green-100 text-green-800'
                                                                : placement.status === 'closed'
                                                                    ? 'bg-red-100 text-red-800'
                                                                    : 'bg-blue-100 text-blue-800'
                                                                }`}>
                                                                {placement.status}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm font-medium text-gray-700 mb-2">
                                                            {placement.companyId?.name || 'Company'}
                                                        </p>
                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                                            <div>
                                                                <p className="font-medium">Industry</p>
                                                                <p>{placement.companyId?.industry || 'N/A'}</p>
                                                            </div>
                                                            <div>
                                                                <p className="font-medium">Salary</p>
                                                                <p>{formatSalary(placement.salary)}</p>
                                                            </div>
                                                            <div>
                                                                <p className="font-medium">Deadline</p>
                                                                <p>{formatDate(placement.deadline)}</p>
                                                            </div>
                                                            <div>
                                                                <p className="font-medium">Applicants</p>
                                                                <p>{placement.applicants?.length || 0} students</p>
                                                            </div>
                                                        </div>
                                                        {placement.eligibilityCriteria?.minCGPA && (
                                                            <p className="mt-2 text-sm text-gray-600">
                                                                Min CGPA: {placement.eligibilityCriteria.minCGPA}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                <div className="mt-6 flex items-center justify-between">
                                    <p className="text-sm text-gray-600">
                                        Showing page {pagination.page} of {pagination.pages}
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={pagination.page === 1}
                                            onClick={() => handlePageChange(pagination.page - 1)}
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={pagination.page >= pagination.pages}
                                            onClick={() => handlePageChange(pagination.page + 1)}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
