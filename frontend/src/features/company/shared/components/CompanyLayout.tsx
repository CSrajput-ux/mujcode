import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Briefcase,
    FileText,
    Users,
    BarChart3,
    LogOut,
    Menu,
    Bell,
    Search,
    Settings
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/app/components/ui/dropdown-menu';
import logoImage from '@/assets/image-removebg-preview.png';

export default function CompanyLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const menuItems = [
        { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Overview', path: '/company/dashboard' },
        { icon: <Briefcase className="w-5 h-5" />, label: 'Drives', path: '/company/drives' },
        { icon: <FileText className="w-5 h-5" />, label: 'Assessments', path: '/company/assessments' },
        { icon: <Users className="w-5 h-5" />, label: 'Candidates', path: '/company/candidates' },
        { icon: <BarChart3 className="w-5 h-5" />, label: 'Analytics', path: '/company/analytics' },
    ];

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
      `}>
                <div className="h-full flex flex-col">
                    {/* Logo */}
                    <div className="h-16 flex items-center px-6 border-b border-gray-100">
                        <img src={logoImage} alt="MujCode" className="w-8 h-8 mr-3" />
                        <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                            MujCode
                        </span>
                        <span className="ml-2 text-xs font-semibold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                            CORP
                        </span>
                    </div>

                    {/* Nav Items */}
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">
                            Recruitment
                        </div>
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <button
                                    key={item.path}
                                    onClick={() => navigate(item.path)}
                                    className={`
                    w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${isActive
                                            ? 'bg-gray-900 text-white shadow-sm'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
                  `}
                                >
                                    <span className={isActive ? 'text-blue-400' : 'text-gray-400 group-hover:text-gray-500'}>
                                        {item.icon}
                                    </span>
                                    <span>{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>

                    {/* User Profile & Logout */}
                    <div className="p-4 border-t border-gray-100">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left">
                                    <Avatar className="h-9 w-9 border border-gray-200">
                                        <AvatarImage src="" />
                                        <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">GI</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">Google India</p>
                                        <p className="text-xs text-gray-500 truncate">HR Team</p>
                                    </div>
                                    <Settings className="w-4 h-4 text-gray-400" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                                <DropdownMenuItem>Billing</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <header className="lg:hidden bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4">
                    <button onClick={() => setSidebarOpen(true)} className="text-gray-500 hover:text-gray-700">
                        <Menu className="w-6 h-6" />
                    </button>
                    <span className="font-semibold text-gray-900">Dashboard</span>
                    <div className="w-6" /> {/* Spacer */}
                </header>

                {/* Global Header (Desktop) - Optional, can be merged with page headers */}
                <header className="hidden lg:flex bg-white border-b border-gray-200 h-16 items-center justify-between px-8">
                    <div className="w-96 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search candidates, drives..."
                            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </div>
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="icon" className="relative text-gray-500 hover:text-gray-700">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </Button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}
