import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Code2,
  BarChart3,
  FileText,
  GraduationCap,
  ClipboardList,
  LogOut,
  Menu,
  X,
  Shield,
  Ticket
} from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import CompleteProfileDialog from './CompleteProfileDialog';
import logoImage from '../../assets/image-removebg-preview.png';

interface StudentLayoutProps {
  children: ReactNode;
}

export default function StudentLayout({ children }: StudentLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(JSON.parse(localStorage.getItem('user') || '{}'));

  const refreshProfile = () => {
    setUserProfile(JSON.parse(localStorage.getItem('user') || '{}'));
  };

  const menuItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', path: '/student/dashboard' },
    { icon: <BookOpen className="w-5 h-5" />, label: 'Courses', path: '/student/courses' },
    { icon: <Code2 className="w-5 h-5" />, label: 'Problems', path: '/student/problems' },
    { icon: <BarChart3 className="w-5 h-5" />, label: 'Analytics', path: '/student/analytics' },
    { icon: <FileText className="w-5 h-5" />, label: 'Tests', path: '/student/tests' },
    { icon: <GraduationCap className="w-5 h-5" />, label: 'Learning', path: '/student/learning' },
    { icon: <ClipboardList className="w-5 h-5" />, label: 'Assignments', path: '/student/assignments' },
  ];
  const getFirstName = (fullName: string) => {
    return fullName.split(' ')[0];
  };

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
              </div>
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <div className="flex items-center space-x-4 cursor-pointer hover:opacity-80 transition-opacity">
                  <div className="text-right hidden sm:block">
                    <div className="text-sm font-medium text-gray-900">
                      {JSON.parse(localStorage.getItem('user') || '{}').name?.split(' ')[0] || 'Student'}
                    </div>
                    <div className="text-xs text-gray-500">
                      ID: {(() => {
                        const email = JSON.parse(localStorage.getItem('user') || '{}').email || '';
                        const match = email.match(/\.(\d+)@/);
                        return match ? match[1] : '---';
                      })()}
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-[#FF7A00] rounded-full flex items-center justify-center text-white font-semibold">
                    {JSON.parse(localStorage.getItem('user') || '{}').name ? JSON.parse(localStorage.getItem('user') || '{}').name.split(' ')[0].charAt(0).toUpperCase() : 'U'}
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 mr-4" align="end">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#FF7A00] to-[#FF5500] p-6 text-white rounded-t-md">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold backdrop-blur-sm">
                      {JSON.parse(localStorage.getItem('user') || '{}').name ? JSON.parse(localStorage.getItem('user') || '{}').name.split(' ')[0].charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="font-semibold text-lg truncate">{JSON.parse(localStorage.getItem('user') || '{}').name?.split(' ')[0] || 'Student'}</h3>
                      <p className="text-white/80 text-xs truncate">{JSON.parse(localStorage.getItem('user') || '{}').email || 'No Email'}</p>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-sm p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3 text-gray-600">
                      <Shield className="w-4 h-4" />
                      <span>Role</span>
                    </div>
                    <span className="font-medium capitalize bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs">
                      {JSON.parse(localStorage.getItem('user') || '{}').role || 'Student'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3 text-gray-600">
                      <Ticket className="w-4 h-4" />
                      <span>College ID</span>
                    </div>
                    <span className="font-mono text-gray-900 text-xs">
                      {(() => {
                        const email = JSON.parse(localStorage.getItem('user') || '{}').email || '';
                        const match = email.match(/\.(\d+)@/);
                        return match ? match[1] : '---';
                      })()}
                    </span>
                  </div>

                  {/* Profile Info Section */}
                  {userProfile.section && (
                    <div className="px-4 py-2 space-y-2 border-t  border-gray-100">
                      <div className="flex items-center justify-between text-xs p-2 hover:bg-gray-50 rounded-lg">
                        <span className="text-gray-600">Branch</span>
                        <span className="font-medium text-gray-900">{userProfile.branch || '---'}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs p-2 hover:bg-gray-50 rounded-lg">
                        <span className="text-gray-600">Section</span>
                        <span className="font-medium text-gray-900">{userProfile.section || '---'}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs p-2 hover:bg-gray-50 rounded-lg">
                        <span className="text-gray-600">Year</span>
                        <span className="font-medium text-gray-900">{userProfile.year ? `${userProfile.year}${userProfile.year === '1' ? 'st' : userProfile.year === '2' ? 'nd' : userProfile.year === '3' ? 'rd' : 'th'} Year` : '---'}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-2 space-y-1">
                  {!userProfile.section && (
                    <button
                      onClick={() => setProfileDialogOpen(true)}
                      className="w-full flex items-center justify-center space-x-2 bg-[#FF7A00] text-white hover:bg-[#E66D00] py-2.5 rounded-lg transition-colors text-sm font-medium"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Complete Profile</span>
                    </button>
                  )}
                  <button
                    onClick={() => navigate('/')}
                    className="w-full flex items-center justify-center space-x-2 text-red-600 hover:bg-red-50 py-2.5 rounded-lg transition-colors text-sm font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          fixed top-16 left-0 h-[calc(100vh-4rem)] 
          w-64 bg-white shadow-lg transition-transform duration-300 z-30
          overflow-y-auto
        `}>
          <nav className="p-4 space-y-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all
                  ${location.pathname === item.path
                    ? 'bg-[#FF7A00] text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                {item.icon}
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
        <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-64">
          {children}
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Complete Profile Dialog */}
      <CompleteProfileDialog
        open={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
        onSuccess={refreshProfile}
      />
    </div>
  );
}