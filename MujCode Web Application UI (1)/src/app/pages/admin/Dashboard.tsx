import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import {
  Code2,
  Users,
  Building2,
  FileText,
  BarChart3,
  Shield,
  Upload,
  Settings,
  BookOpen,
  Award,
  TrendingUp,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import logoImage from '../../../assets/image-removebg-preview.png';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const stats = [
    { icon: <Users className="w-6 h-6" />, label: 'Total Students', value: '8,245', color: 'bg-blue-500' },
    { icon: <Users className="w-6 h-6" />, label: 'Faculty Members', value: '185', color: 'bg-green-500' },
    { icon: <Building2 className="w-6 h-6" />, label: 'Partner Companies', value: '156', color: 'bg-purple-500' },
    { icon: <Award className="w-6 h-6" />, label: 'Placements (2026)', value: '2,145', color: 'bg-[#FF7A00]' },
  ];

  const menuSections = [
    {
      title: 'User Management',
      items: [
        { icon: <Upload />, label: 'Bulk Student Upload' },
        { icon: <Users />, label: 'Faculty Assignment' },
        { icon: <Building2 />, label: 'Company Accounts' }
      ]
    },
    {
      title: 'Content Management',
      items: [
        { icon: <FileText />, label: 'Question Bank Approval' },
        { icon: <BookOpen />, label: 'Course Management' },
        { icon: <Settings />, label: 'Syllabus Configuration' }
      ]
    },
    {
      title: 'Placement Management',
      items: [
        { icon: <TrendingUp />, label: 'Drive Monitoring' },
        { icon: <Shield />, label: 'Eligibility Criteria' },
        { icon: <Award />, label: 'Offer Management' }
      ]
    }
  ];

  const recentActivities = [
    { action: 'Bulk Upload', detail: '150 students added to CSE Batch 2024', time: '1 hour ago' },
    { action: 'Company Onboarded', detail: 'Google added as recruitment partner', time: '3 hours ago' },
    { action: 'Drive Scheduled', detail: 'Amazon Campus Placement on Jan 28', time: '5 hours ago' }
  ];

  const pendingApprovals = [
    { type: 'Question Bank', item: '25 new questions for Data Structures', count: 25 },
    { type: 'Course Access', item: '48 students requesting Advanced ML', count: 48 },
    { type: 'Faculty Request', item: '3 new test creation requests', count: 3 }
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
                <span className="hidden sm:inline-block px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-semibold">
                  ADMIN
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-gray-900">System Administrator</div>
                <div className="text-xs text-gray-500">Full Access</div>
              </div>
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-semibold">
                AD
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
          <nav className="p-4 space-y-6">
            {menuSections.map((section, sIdx) => (
              <div key={sIdx}>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-4">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item, iIdx) => (
                    <button
                      key={iIdx}
                      className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-all"
                    >
                      <div className="text-[#FF7A00]">{item.icon}</div>
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">System-wide control and monitoring</p>
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
                    <Shield className="w-5 h-5 text-[#FF7A00]" />
                    <span>Pending Approvals</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {pendingApprovals.map((approval, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="px-2 py-1 bg-[#FF7A00] text-white text-xs rounded-full">
                            {approval.type}
                          </span>
                          <p className="text-sm text-gray-900 mt-2">{approval.item}</p>
                        </div>
                        <span className="text-2xl font-bold text-[#FF7A00]">{approval.count}</span>
                      </div>
                      <Button size="sm" className="w-full bg-[#FF7A00] hover:bg-[#FF6A00]">
                        Review & Approve
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-[#FF7A00]" />
                    <span>Recent System Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-[#FF7A00] rounded-full mt-2" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{activity.action}</span>
                        </p>
                        <p className="text-sm text-gray-600 mt-1">{activity.detail}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* System Analytics */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Platform Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-500 mb-1">15,420</div>
                    <div className="text-sm text-gray-600">Total Tests Conducted</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-500 mb-1">92%</div>
                    <div className="text-sm text-gray-600">System Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-500 mb-1">1.2M</div>
                    <div className="text-sm text-gray-600">Questions Solved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#FF7A00] mb-1">4,580</div>
                    <div className="text-sm text-gray-600">Active Sessions</div>
                  </div>
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