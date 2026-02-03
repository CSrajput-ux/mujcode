import StudentLayout from '../../components/StudentLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Code2, FileText, Zap, Building2, Video, Calendar, Clock, Play } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

export default function Tests() {
  const upcomingTests = [
    { title: 'Data Structures Final Test', type: 'Coding', date: '2026-01-15', time: '10:00 AM', duration: '120 min', proctored: true },
    { title: 'Database Lab Assessment', type: 'Lab', date: '2026-01-18', time: '2:00 PM', duration: '90 min', proctored: false },
    { title: 'Algorithm Quiz', type: 'Quiz', date: '2026-01-20', time: '11:00 AM', duration: '30 min', proctored: false },
    { title: 'TCS Placement Test', type: 'Company', date: '2026-01-25', time: '9:00 AM', duration: '180 min', proctored: true }
  ];

  const liveTests = [
    { title: 'Python Programming Test', type: 'Coding', timeLeft: '45 min', participants: 120 }
  ];

  const completedTests = [
    { title: 'C Programming Final', type: 'Coding', date: '2025-12-20', score: 92, maxScore: 100 },
    { title: 'Java OOP Quiz', type: 'Quiz', date: '2025-12-15', score: 88, maxScore: 100 },
    { title: 'Web Dev Lab Test', type: 'Lab', date: '2025-12-10', score: 95, maxScore: 100 }
  ];

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'Coding': return <Code2 className="w-5 h-5" />;
      case 'Lab': return <FileText className="w-5 h-5" />;
      case 'Quiz': return <Zap className="w-5 h-5" />;
      case 'Company': return <Building2 className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'Coding': return 'bg-blue-500';
      case 'Lab': return 'bg-purple-500';
      case 'Quiz': return 'bg-green-500';
      case 'Company': return 'bg-[#FF7A00]';
      default: return 'bg-gray-500';
    }
  };

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tests & Assessments</h1>
          <p className="text-gray-600">Manage your scheduled and completed tests</p>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="bg-gray-100">
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-[#FF7A00] data-[state=active]:text-white">
              Upcoming ({upcomingTests.length})
            </TabsTrigger>
            <TabsTrigger value="live" className="data-[state=active]:bg-[#FF7A00] data-[state=active]:text-white">
              Live ({liveTests.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-[#FF7A00] data-[state=active]:text-white">
              Completed ({completedTests.length})
            </TabsTrigger>
          </TabsList>

          {/* Upcoming Tests */}
          <TabsContent value="upcoming" className="space-y-4">
            {upcomingTests.map((test, index) => (
              <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={`${getTypeColor(test.type)} p-3 rounded-lg text-white`}>
                        {getTypeIcon(test.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{test.title}</h3>
                          {test.proctored && (
                            <Badge className="bg-red-500">
                              <Video className="w-3 h-3 mr-1" />
                              Camera Proctored
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1 text-[#FF7A00]" />
                            {test.date}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1 text-[#FF7A00]" />
                            {test.time}
                          </span>
                          <span>Duration: {test.duration}</span>
                        </div>
                      </div>
                    </div>
                    <Button className="bg-[#FF7A00] hover:bg-[#FF6A00]">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Live Tests */}
          <TabsContent value="live" className="space-y-4">
            {liveTests.map((test, index) => (
              <Card key={index} className="shadow-md border-2 border-[#FF7A00] animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="bg-red-500 p-3 rounded-lg text-white relative">
                        {getTypeIcon(test.type)}
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{test.title}</h3>
                        <div className="flex items-center space-x-4 text-sm">
                          <Badge className="bg-red-500">LIVE NOW</Badge>
                          <span className="text-gray-600">Time Left: {test.timeLeft}</span>
                          <span className="text-gray-600">{test.participants} participants</span>
                        </div>
                      </div>
                    </div>
                    <Button className="bg-[#FF7A00] hover:bg-[#FF6A00]">
                      <Play className="w-4 h-4 mr-2" />
                      Join Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Completed Tests */}
          <TabsContent value="completed" className="space-y-4">
            {completedTests.map((test, index) => (
              <Card key={index} className="shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={`${getTypeColor(test.type)} p-3 rounded-lg text-white`}>
                        {getTypeIcon(test.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{test.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Completed on {test.date}</span>
                          <span className="text-[#FF7A00] font-semibold">
                            Score: {test.score}/{test.maxScore}
                          </span>
                          <Badge className={test.score >= 90 ? 'bg-green-500' : test.score >= 75 ? 'bg-yellow-500' : 'bg-red-500'}>
                            {test.score >= 90 ? 'Excellent' : test.score >= 75 ? 'Good' : 'Needs Improvement'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" className="hover:border-[#FF7A00] hover:text-[#FF7A00]">
                      View Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </StudentLayout>
  );
}
