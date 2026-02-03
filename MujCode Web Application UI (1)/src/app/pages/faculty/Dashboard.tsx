import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import {
  Code2,
  Users,
  FileText,
  ClipboardList,
  Settings,
  BarChart3,
  CheckCircle,
  Clock,
  BookOpen,
  Award,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import logoImage from '../../../assets/image-removebg-preview.png';

export default function FacultyDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const stats = [
    { icon: <FileText className="w-6 h-6" />, label: 'Tests Created', value: '28', color: 'bg-blue-500' },
    { icon: <Users className="w-6 h-6" />, label: 'Students', value: '150', color: 'bg-green-500' },
    { icon: <BookOpen className="w-6 h-6" />, label: 'Sections', value: '3', color: 'bg-purple-500' },
    { icon: <Award className="w-6 h-6" />, label: 'Dept', value: 'CSE', color: 'bg-[#FF7A00]' },
  ];

  const menuItems = [
    { icon: <Settings />, label: 'Permissions', description: 'Manage student access' },
    { icon: <FileText />, label: 'Tests & Quiz', description: 'Create and manage tests' },
    { icon: <BarChart3 />, label: 'Activity', description: 'Create questions and communities' },
    { icon: <ClipboardList />, label: 'Assignments', description: 'Manage submissions' },
    { icon: <Users />, label: 'Reports', description: 'Student performance' }
  ];

  const recentActivities = [
    { action: 'Created test', item: 'Data Structures Final', time: '2 hours ago' },
    { action: 'Approved access', item: '15 students for Quiz Module', time: '5 hours ago' },
    { action: 'Graded assignment', item: 'Database Lab 3', time: '1 day ago' }
  ];

  const pendingApprovals = [
    { student: 'John Smith', request: 'Course Access: Advanced Algorithms', time: '10 min ago' },
    { student: 'Emily Davis', request: 'Test Access: Midterm Exam', time: '1 hour ago' },
    { student: 'Michael Chen', request: 'Course Access: Machine Learning', time: '2 hours ago' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-gray-600 hover:text-[#FF7A00]"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div className="flex items-center space-x-2">
                <img src={logoImage} alt="MujCode Logo" className="w-8 h-8" />
                <span className="text-2xl font-bold text-gray-900">MujCode</span>
                <span className="hidden sm:inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-semibold">
                  FACULTY
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-gray-900">Dr. Sarah Johnson</div>
                <div className="text-xs text-gray-500">Computer Science Dept</div>
              </div>
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                SJ
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] 
          w-64 bg-white shadow-lg transition-transform duration-300 z-30
          overflow-y-auto
        `}>
          <nav className="p-4 space-y-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                className="w-full flex items-start space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all"
              >
                <div className="text-[#FF7A00] mt-1">{item.icon}</div>
                <div className="text-left">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </div>
              </button>
            ))}

            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={() => navigate('/')}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
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
                  {pendingApprovals.map((approval, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-gray-900">{approval.student}</p>
                          <p className="text-sm text-gray-600">{approval.request}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{approval.time}</span>
                        <div className="flex space-x-2">
                          <Button size="sm" className="bg-green-500 hover:bg-green-600">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Approve
                          </Button>
                          <Button size="sm" variant="outline">Deny</Button>
                        </div>
                      </div>
                    </div>
                  ))}
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

            {/* Quick Actions */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="h-24 flex flex-col items-center justify-center bg-[#FF7A00] hover:bg-[#FF6A00]">
                    <FileText className="w-8 h-8 mb-2" />
                    <span>Create New Test</span>
                  </Button>
                  <Button className="h-24 flex flex-col items-center justify-center bg-blue-500 hover:bg-blue-600">
                    <ClipboardList className="w-8 h-8 mb-2" />
                    <span>Create Assignment</span>
                  </Button>
                  <Button className="h-24 flex flex-col items-center justify-center bg-green-500 hover:bg-green-600">
                    <Users className="w-8 h-8 mb-2" />
                    <span>View Student Reports</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}