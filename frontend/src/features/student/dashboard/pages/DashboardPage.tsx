import { API_URL, API_BASE_URL, UPLOADS_URL } from '@/shared/config/apiConfig';
import StudentLayout from '../../shared/components/StudentLayout';
import YearlyActivity from '@/app/components/YearlyActivity';
import StudentStats from '../../dashboard/components/StudentStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import {
  Trophy,
  Users,
  Calendar,
  Clock,
  Plus,
  Lock
} from 'lucide-react';
import { useState, useEffect } from 'react';

import { useAuth } from '@/contexts/AuthContext';
import { MentorSelectionModal } from '../components/MentorSelectionModal';

export default function Dashboard() {
  const { user } = useAuth();
  const [ranks, setRanks] = useState([
    { label: 'College Rank', value: '#-', total: '/ -' },
    { label: 'Branch Rank', value: '#-', total: '/ -' },
    { label: 'Section Rank', value: '#-', total: '/ -' }
  ]);
  const [mentors, setMentors] = useState<{ name: string, subject?: string, avatar: string, department: string, id: string, status?: 'pending' | 'approved' }[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [loadingMentors, setLoadingMentors] = useState(true);
  const [mentorModalOpen, setMentorModalOpen] = useState(false);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        if (!user?.id) return;

        const token = sessionStorage.getItem('token');
        const res = await fetch(`${API_URL}/student/rankings/${user.id}`, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : ''
          },
          credentials: 'include'
        });
        const data = await res.json();
        if (res.ok && data.ranks) {
          setRanks(data.ranks);
        }
      } catch (error) {
        console.error('Error fetching rankings:', error);
      }
    };

    const fetchMentorStatus = async () => {
      try {
        if (!user) return;
        setLoadingMentors(true);

        const token = sessionStorage.getItem('token');
        const res = await fetch('${API_URL}/student/mentor-status', {
          headers: {
            'Authorization': token ? `Bearer ${token}` : ''
          },
          credentials: 'include'
        });
        const data = await res.json();

        if (res.ok) {
          const allMentors: any[] = [];

          // 1. Approved Mentors
          if (data.selectedMentors && data.selectedMentors.length > 0) {
            allMentors.push(...data.selectedMentors.map((f: any) => ({
              id: f._id,
              name: f.name,
              avatar: f.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2),
              department: f.department,
              status: 'approved'
            })));
          }

          // 2. Pending Requests
          if (data.requests && data.requests.length > 0) {
            const pending = data.requests
              .filter((r: any) => r.status === 'pending')
              .map((r: any) => ({
                id: r.facultyId?._id,
                name: r.facultyId?.name || 'Unknown Faculty',
                avatar: (r.facultyId?.name || 'U').split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2),
                department: r.facultyId?.department || '---',
                status: 'pending'
              }));

            pending.forEach((p: any) => {
              if (!allMentors.some(m => m.id === p.id)) {
                allMentors.push(p);
              }
            });
          }

          if (allMentors.length > 0) {
            setMentors(allMentors);
            setIsLocked(data.mentorSelectionLocked);
            setLoadingMentors(false);
          } else {
            fetchTeachingMap();
          }
        } else {
          fetchTeachingMap();
        }
      } catch (error) {
        console.error('Error fetching mentor status:', error);
        fetchTeachingMap();
      }
    };

    const fetchTeachingMap = async () => {
      try {
        const semester = user?.semester || 'Semester 1';
        const section = user?.section || 'A';
        const branch = user?.branch || 'CSE';

        const res = await fetch(`${API_URL}/faculty/teaching-map?semester=${semester}&section=${section}&branch=${branch}`);
        const data = await res.json();

        if (res.ok && Array.isArray(data)) {
          const mappedMentors = data.map((f: any) => ({
            id: f.facultyId,
            name: f.facultyName,
            subject: f.subjects.join(', '),
            avatar: f.facultyName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2),
            department: f.department
          }));
          setMentors(mappedMentors);
        }
        setLoadingMentors(false);
      } catch (error) {
        console.error('Error fetching teaching map:', error);
        setLoadingMentors(false);
      }
    };

    if (user) {
      fetchRankings();
      fetchMentorStatus();
    }
  }, [user]);

  const upcomingTests = [
    { title: 'Data Structures Final Test', date: '2026-01-15', time: '10:00 AM', type: 'Coding' },
    { title: 'Database Lab Test', date: '2026-01-18', time: '2:00 PM', type: 'Lab' },
    { title: 'Algorithm Quiz', date: '2026-01-20', time: '11:00 AM', type: 'Quiz' }
  ];

  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name?.split(' ')[0] || 'Student'} 👋
            </h1>
            <p className="text-gray-600">Here's your learning progress overview</p>
          </div>
        </div>

        {/* New LeetCode-style Stats & Badges */}
        <StudentStats />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ranks */}
          <Card className="shadow-md border-t-4 border-t-[#FF7A00]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-[#FF7A00]" />
                <span className="text-lg">Your Rankings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {ranks.map((rank, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-orange-50/50 rounded-lg border border-orange-100/50">
                  <span className="text-gray-700 font-medium">{rank.label}</span>
                  <div className="text-right">
                    <span className="text-xl font-bold text-[#FF7A00]">{rank.value}</span>
                    <span className="text-sm text-gray-500 ml-1">{rank.total}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Faculty Mentors */}
          <Card className="shadow-md border-t-4 border-t-purple-500 relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span className="text-lg">Faculty Mentors</span>
              </CardTitle>
              {!isLocked && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 p-2"
                  onClick={() => setMentorModalOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Select
                </Button>
              )}
              {isLocked && (
                <div className="flex items-center text-[10px] font-bold text-white bg-green-500 px-2 py-0.5 rounded-full shadow-sm animate-in fade-in zoom-in duration-300">
                  <Lock className="w-3 h-3 mr-1" />
                  LOCKED
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="max-h-[300px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {loadingMentors ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-16 bg-gray-50 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : mentors.length > 0 ? (
                  mentors.map((mentor, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-purple-50/50 rounded-lg border border-purple-100/50 hover:bg-purple-100 transition-colors group relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping" />
                      </div>
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm transition-transform group-hover:scale-110">
                        {mentor.avatar}
                      </div>
                      <div className="overflow-hidden flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-bold text-gray-900 truncate text-sm">{mentor.name}</p>
                          {mentor.status === 'pending' && (
                            <span className="text-[9px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded font-bold animate-pulse">PENDING</span>
                          )}
                          {mentor.status === 'approved' && (
                            <span className="text-[9px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded font-bold">APPROVED</span>
                          )}
                        </div>
                        <p className="text-[11px] text-purple-600 font-semibold truncate uppercase">
                          {mentor.subject || mentor.department}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 italic text-sm border-2 border-dashed border-gray-100 rounded-xl p-6 flex flex-col items-center">
                      <Users className="w-8 h-8 text-gray-200 mb-2" />
                      <p>No mentors assigned yet.</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4 border-purple-200 text-purple-600 hover:bg-purple-50"
                        onClick={() => setMentorModalOpen(true)}
                      >
                        Choose Mentors
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>

            <MentorSelectionModal
              open={mentorModalOpen}
              onOpenChange={setMentorModalOpen}
              onSuccess={() => window.location.reload()} // Refresh to update lock status and mentors
            />
          </Card>

          {/* Upcoming Tests */}
          <Card className="shadow-md border-t-4 border-t-[#FF7A00]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-[#FF7A00]" />
                <span className="text-lg">Upcoming Tests</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingTests.map((test, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-bold text-gray-900 text-sm truncate pr-2">{test.title}</p>
                    <span className="px-2 py-0.5 bg-[#FF7A00] text-white text-[10px] rounded-full font-bold">
                      {test.type}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-[11px] text-gray-500 font-medium">
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1 text-[#FF7A00]" />
                      {test.date}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1 text-[#FF7A00]" />
                      {test.time}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Activity Heat Map */}
        <YearlyActivity />
      </div>
    </StudentLayout>
  );
}

