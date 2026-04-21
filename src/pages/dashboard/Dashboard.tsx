import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { assignmentsService } from '../../services/assignmentsService';
import { topicService } from '../../services/topicsService';
import { materialsService } from '../../services/materialsService';
import { 
  BarChart3, 
  Users, 
  BookOpen, 
  FileText, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  TrendingUp,
  Award
} from 'lucide-react';

const Dashboard: React.FC = () => {
  // Queries
  const { data: popularTrainers, isLoading: loadingTrainers } = useQuery({
    queryKey: ['dashboard', 'popularTrainers'],
    queryFn: assignmentsService.getPopularTrainers,
  });

  const { data: popularTopics, isLoading: loadingTopics } = useQuery({
    queryKey: ['dashboard', 'popularTopics'],
    queryFn: topicService.getPopularTopics,
  });

  const { data: popularMaterials, isLoading: loadingMaterials } = useQuery({
    queryKey: ['dashboard', 'popularMaterials'],
    queryFn: materialsService.getPopularMaterials,
  });

  const { data: draftCount } = useQuery({
    queryKey: ['dashboard', 'count', 'DRAFT'],
    queryFn: () => assignmentsService.getAssignmentsCountByStatus('DRAFT'),
  });

  const { data: publishCount } = useQuery({
    queryKey: ['dashboard', 'count', 'PUBLISH'],
    queryFn: () => assignmentsService.getAssignmentsCountByStatus('PUBLISH'),
  });

  const isLoading = loadingTrainers || loadingTopics || loadingMaterials;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const stats = [
    { label: 'Penugasan Draft', value: draftCount?.data.count || 0, icon: Clock, color: 'text-slate-500', bg: 'bg-slate-100' },
    { label: 'Penugasan Publish', value: publishCount?.data.count || 0, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-100' },
    { label: 'Total Topik', value: popularTopics?.data.length || 0, icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-100' },
    { label: 'Total Materi', value: popularMaterials?.data.length || 0, icon: FileText, color: 'text-amber-500', bg: 'bg-amber-100' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl p-8 text-white shadow-xl">
        <h1 className="text-3xl font-bold">Halo, Admin! 👋</h1>
        <p className="mt-2 text-primary-100">Selamat datang kembali di Learning Management System. Berikut ringkasan aktivitas hari ini.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/60 flex items-center gap-4">
            <div className={`p-3 ${stat.bg} dark:bg-slate-700 rounded-xl`}>
              <stat.icon className={stat.color} size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Popular Trainers */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700/60 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="text-amber-500" size={20} /> Trainer Teraktif
            </h2>
            <TrendingUp size={16} className="text-slate-400" />
          </div>
          <div className="space-y-4">
            {popularTrainers?.data.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold">
                    {item.trainer.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100 line-clamp-1">{item.trainer.name}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">{item.trainer.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-primary-600 dark:text-primary-400">{item.countAssignment}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-tighter">Tugas</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Topics */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700/60 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="text-primary-500" size={20} /> Topik Terpopuler
            </h2>
          </div>
          <div className="space-y-4">
            {popularTopics?.data.map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-700 dark:text-slate-300 line-clamp-1">{item.title}</span>
                  <span className="text-slate-400">{item.countAssignment} Kelas</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-primary-500 h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${Math.min((item.countAssignment / 10) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Materials */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700/60 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="text-emerald-500" size={20} /> Materi Sering Dipakai
            </h2>
          </div>
          <div className="space-y-3">
            {popularMaterials?.data.map((item, i) => (
              <div key={i} className="p-4 border border-slate-100 dark:border-slate-700 rounded-2xl hover:border-primary-200 dark:hover:border-primary-900/30 transition-colors">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 line-clamp-1">{item.title}</h4>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest">{item.countAssignment} Penugasan</span>
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(j => (
                      <div key={j} className="w-5 h-5 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200 dark:bg-slate-700"></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
