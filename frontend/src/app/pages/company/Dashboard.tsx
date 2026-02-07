import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  Code2,
  Users,
  FileText,
  Calendar,
  Video,
  TrendingUp,
  CheckCircle,
  Clock,
  Eye,
  Download,
  Filter,
  LogOut,
  Menu,
  X,
  Briefcase
} from 'lucide-react';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import logoImage from '@/assets/image-removebg-preview.png';

export default function CompanyDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const stats = [
    { icon: <Briefcase className="w-6 h-6" />, label: 'Active Drives', value: '3', color: 'bg-blue-500' },
    { icon: <Users className="w-6 h-6" />, label: 'Applicants', value: '1,245', color: 'bg-green-500' },
    { icon: <CheckCircle className="w-6 h-6" />, label: 'Shortlisted', value: '186', color: 'bg-purple-500' },
    { icon: <TrendingUp className="w-6 h-6" />, label: 'Hired (YTD)', value: '52', color: 'bg-[#FF7A00]' },
  ];

  const activeDrives = [
    { title: 'Software Engineer', applicants: 450, shortlisted: 68, status: 'Screening', deadline: '2026-01-25' },
    { title: 'Data Analyst', applicants: 380, shortlisted: 52, status: 'Testing', deadline: '2026-01-28' },
    { title: 'Full Stack Developer', applicants: 415, shortlisted: 66, status: 'Interview', deadline: '2026-02-05' }
  ];

  const recentApplicants = [
    { name: 'John Smith', score: 95, rank: 1, cgpa: 8.9, branch: 'CSE', status: 'Shortlisted' },
    { name: 'Emily Davis', score: 92, rank: 2, cgpa: 8.7, branch: 'CSE', status: 'Shortlisted' },
    { name: 'Michael Chen', score: 88, rank: 3, cgpa: 8.5, branch: 'IT', status: 'Under Review' },
    { name: 'Sarah Williams', score: 85, rank: 4, cgpa: 8.3, branch: 'CSE', status: 'Shortlisted' }
  ];

  const menuItems = [
    { icon: <Briefcase />, label: 'Drive Management' },
    { icon: <FileText />, label: 'Create Assessment' },
    { icon: <Users />, label: 'Candidates' },
    { icon: <BarChart3 />, label: 'Analytics' },
    { icon: <CheckCircle />, label: 'Results' }
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
                <span className="hidden sm:inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold">
                  COMPANY
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-gray-900">Google India</div>
                <div className="text-xs text-gray-500">HR Recruiter</div>
              </div>
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                G
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
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all"
              >
                <div className="text-[#FF7A00]">{item.icon}</div>
                <span className="font-medium">{item.label}</span>
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Dashboard</h1>
                <p className="text-gray-600">Manage recruitment drives and candidates</p>
              </div>
              <Button className="bg-[#FF7A00] hover:bg-[#FF6A00]">
                <Briefcase className="w-4 h-4 mr-2" />
                Create New Drive
              </Button>
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

            {/* Active Drives */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Briefcase className="w-5 h-5 text-[#FF7A00]" />
                  <span>Active Recruitment Drives</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeDrives.map((drive, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{drive.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                          <span className="flex items-center">
                            <Users className="w-4 h-4 mr-1 text-[#FF7A00]" />
                            {drive.applicants} Applicants
                          </span>
                          <span className="flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                            {drive.shortlisted} Shortlisted
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1 text-blue-500" />
                            {drive.deadline}
                          </span>
                        </div>
                      </div>
                      <Badge className={`
                        ${drive.status === 'Screening' ? 'bg-yellow-500' : ''}
                        ${drive.status === 'Testing' ? 'bg-blue-500' : ''}
                        ${drive.status === 'Interview' ? 'bg-purple-500' : ''}
                      `}>
                        {drive.status}
                      </Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-[#FF7A00] hover:bg-[#FF6A00]">
                        View Candidates
                      </Button>
                      <Button size="sm" variant="outline" className="hover:border-[#FF7A00] hover:text-[#FF7A00]">
                        Manage Drive
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Top Applicants */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-[#FF7A00]" />
                    <span>Top Performing Candidates</span>
                  </div>
                  <Button size="sm" variant="outline" className="hover:border-[#FF7A00] hover:text-[#FF7A00]">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentApplicants.map((applicant, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {applicant.rank}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{applicant.name}</p>
                          <div className="flex items-center space-x-3 text-sm text-gray-600">
                            <span>{applicant.branch}</span>
                            <span>•</span>
                            <span>CGPA: {applicant.cgpa}</span>
                            <span>•</span>
                            <span className="text-[#FF7A00] font-semibold">Score: {applicant.score}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={applicant.status === 'Shortlisted' ? 'bg-green-500' : 'bg-yellow-500'}>
                          {applicant.status}
                        </Badge>
                        <Button size="sm" variant="outline" className="hover:border-[#FF7A00] hover:text-[#FF7A00]">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" className="hover:border-[#FF7A00] hover:text-[#FF7A00]">
                          <Download className="w-4 h-4 mr-1" />
                          Resume
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Proctoring Features */}
            <Card className="shadow-md bg-purple-50 border-2 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-purple-500 rounded-lg text-white">
                    <Video className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">Camera Proctoring & Code Playback</h3>
                    <p className="text-gray-700 text-sm mb-3">
                      Review candidate sessions with camera proctoring footage and code playback functionality
                    </p>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• Real-time monitoring during assessments</li>
                      <li>• Code playback for detailed analysis</li>
                      <li>• Automated malpractice detection</li>
                      <li>• Comprehensive scorecards with behavioral insights</li>
                    </ul>
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

function BarChart3({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}