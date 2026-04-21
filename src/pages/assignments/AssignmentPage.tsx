import React from "react";
import { AssignmentList } from "../../features/assignments/components/AssignmentList";

const AssignmentPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      {/* <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/60 flex items-center gap-4">
        <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl text-primary-600 dark:text-primary-400">
          <CalendarRange size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Manajemen Penugasan</h1>
          <p className="text-slate-500 dark:text-slate-400">Alokasikan trainer ke modul pelatihan dan atur jadwal kelas.</p>
        </div>
      </div> */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Manajemen Penugasan
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Alokasikan trainer ke modul pelatihan dan atur jadwal kelas.
        </p>
      </div>

      {/* Konten Utama */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/60">
        <AssignmentList />
      </div>
    </div>
  );
};

export default AssignmentPage;
