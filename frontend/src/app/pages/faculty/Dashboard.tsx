import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import {
  Users,
  FileText,
  BarChart3,
  Clock,
  BookOpen,
  Award,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { getMentorRequests, approveMentorRequest, rejectMentorRequest, MentorRequest } from '../../../shared/services/api/facultyMentorService';
import { formatDistanceToNow } from 'date-fns';

export default function FacultyDashboard() {
  const [requests, setRequests] = useState<MentorRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await getMentorRequests();
      setRequests(data);
    } catch (error) {
      console.error('Failed to fetch requests', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (requestId: string) => {
    try {
      setActionLoading(requestId);
      await approveMentorRequest(requestId);
      setRequests(prev => prev.filter(r => r._id !== requestId));
    } catch (error) {
      alert('Failed to approve request');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      setActionLoading(requestId);
      await rejectMentorRequest(requestId);
      setRequests(prev => prev.filter(r => r._id !== requestId));
    } catch (error) {
      alert('Failed to reject request');
    } finally {
      setActionLoading(null);
    }
  };

  const stats = [
    { icon: <FileText className="w-6 h-6" />, label: 'Tests Created', value: '28', color: 'bg-blue-500' },
    { icon: <Users className="w-6 h-6" />, label: 'Students', value: '150', color: 'bg-green-500' },
    { icon: <BookOpen className="w-6 h-6" />, label: 'Sections', value: '3', color: 'bg-purple-500' },
    { icon: <Award className="w-6 h-6" />, label: 'Dept', value: 'CSE', color: 'bg-[#FF7A00]' },
  ];

  const recentActivities = [
    { action: 'Created test', item: 'Data Structures Final', time: '2 hours ago' },
    { action: 'Approved access', item: '15 students for Quiz Module', time: '5 hours ago' },
    { action: 'Graded assignment', item: 'Database Lab 3', time: '1 day ago' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Faculty Dashboard</h1>
        <p className="text-gray-600">Manage your courses, students, and assessments</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border-none shadow-md">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg text-white`}>
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-[#FF7A00]" />
              <span>Pending Approvals</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="flex items-center justify-center py-8 text-gray-500">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                Loading requests...
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="w-10 h-10 mx-auto mb-2 opacity-20" />
                <p>No pending mentor requests</p>
              </div>
            ) : (
              requests.map((request) => (
                <div key={request._id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 transition-all hover:bg-gray-100">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-bold text-gray-900">{request.studentName}</p>
                      <p className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-1">
                        Reg ID: {request.registrationId} • Section {request.section}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Mentor Request: {request.academicYear} • {request.semester}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                    <span className="text-xs text-gray-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                    </span>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 h-8"
                        onClick={() => handleApprove(request._id)}
                        disabled={actionLoading === request._id}
                      >
                        {actionLoading === request._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3 mr-1" />}
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8"
                        onClick={() => handleReject(request._id)}
                        disabled={actionLoading === request._id}
                      >
                        <XCircle className="w-3 h-3 mr-1" />
                        Deny
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-[#FF7A00]" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-[#FF7A00] rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.action}</span>
                    <span className="text-gray-600">: {activity.item}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}