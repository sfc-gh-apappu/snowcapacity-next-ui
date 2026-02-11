import { Calendar, Clock, CheckCircle, AlertCircle, Plus, Sparkles } from 'lucide-react';

export default function Reservation() {
  const reservations = [
    {
      id: 'RES-001',
      project: 'Q1 Data Migration',
      resource: 'Storage Pool A',
      amount: '2 TB',
      startDate: '2026-02-15',
      endDate: '2026-03-15',
      status: 'active',
      owner: 'John Doe',
    },
    {
      id: 'RES-002',
      project: 'ML Model Training',
      resource: 'Compute Cluster B',
      amount: '4 TB',
      startDate: '2026-02-12',
      endDate: '2026-02-20',
      status: 'active',
      owner: 'Jane Smith',
    },
    {
      id: 'RES-003',
      project: 'Archive Migration',
      resource: 'Storage Pool C',
      amount: '10 TB',
      startDate: '2026-02-20',
      endDate: '2026-04-20',
      status: 'scheduled',
      owner: 'Mike Johnson',
    },
    {
      id: 'RES-004',
      project: 'Development Testing',
      resource: 'Storage Pool D',
      amount: '500 GB',
      startDate: '2026-02-01',
      endDate: '2026-02-10',
      status: 'completed',
      owner: 'Sarah Williams',
    },
    {
      id: 'RES-005',
      project: 'Analytics Pipeline',
      resource: 'Storage Pool A',
      amount: '1.5 TB',
      startDate: '2026-02-18',
      endDate: '2026-03-18',
      status: 'scheduled',
      owner: 'Tom Brown',
    },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-[#29B5E8]/10 text-[#29B5E8] border-[#29B5E8]/30',
      scheduled: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
      completed: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
      expired: 'bg-red-500/10 text-red-400 border-red-500/30',
    };
    return styles[status as keyof typeof styles] || 'bg-gray-500/10 text-gray-400';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-[#29B5E8]" />;
      case 'scheduled':
        return <Clock className="w-5 h-5 text-violet-400" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-gray-500" />;
      case 'expired':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const activeCount = reservations.filter(r => r.status === 'active').length;
  const scheduledCount = reservations.filter(r => r.status === 'scheduled').length;
  const completedCount = reservations.filter(r => r.status === 'completed').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-bold">
            <span className="bg-gradient-to-r from-[#29B5E8] via-[#7DD3FC] to-white bg-clip-text text-transparent">
              Reservations
            </span>
          </h1>
          <p className="text-gray-400 mt-2 text-lg">Schedule and manage resource reservations</p>
        </div>
        <button className="group relative bg-gradient-to-r from-[#29B5E8] to-[#1E88B5] text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-[#29B5E8]/50 transition-all duration-300 font-medium flex items-center gap-2">
          <Plus className="w-5 h-5" />
          New Reservation
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="relative group bg-[#0a0a0a] rounded-2xl p-6 border border-[#1a1a1a] hover:border-[#29B5E8]/50 transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#29B5E8]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#29B5E8]/20 border border-[#29B5E8]/30">
              <CheckCircle className="w-8 h-8 text-[#29B5E8]" />
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider">Active</p>
              <p className="text-3xl font-bold text-white mt-1">{activeCount}</p>
            </div>
          </div>
        </div>
        <div className="relative group bg-[#0a0a0a] rounded-2xl p-6 border border-[#1a1a1a] hover:border-violet-500/50 transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-violet-500/20 border border-violet-500/30">
              <Clock className="w-8 h-8 text-violet-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider">Scheduled</p>
              <p className="text-3xl font-bold text-white mt-1">{scheduledCount}</p>
            </div>
          </div>
        </div>
        <div className="relative group bg-[#0a0a0a] rounded-2xl p-6 border border-[#1a1a1a] hover:border-gray-500/50 transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gray-500/20 border border-gray-500/30">
              <CheckCircle className="w-8 h-8 text-gray-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider">Completed</p>
              <p className="text-3xl font-bold text-white mt-1">{completedCount}</p>
            </div>
          </div>
        </div>
        <div className="relative group bg-[#0a0a0a] rounded-2xl p-6 border border-[#1a1a1a] hover:border-purple-500/50 transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-500/20 border border-purple-500/30">
              <Calendar className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider">Total</p>
              <p className="text-3xl font-bold text-white mt-1">{reservations.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar View Placeholder */}
      <div className="relative bg-[#0a0a0a] rounded-2xl p-6 border border-[#1a1a1a] overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#29B5E8] opacity-5 blur-3xl rounded-full"></div>
        <div className="flex items-center justify-between mb-6 relative z-10">
          <h2 className="text-2xl font-semibold text-white">Reservation Timeline</h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-[#1a1a1a] text-gray-400 rounded-xl hover:bg-[#1a1a1a]/80 hover:text-white transition-all text-sm font-medium">
              Week
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-[#29B5E8] to-[#1E88B5] text-white rounded-xl shadow-lg shadow-[#29B5E8]/30 transition-all text-sm font-medium">
              Month
            </button>
            <button className="px-4 py-2 bg-[#1a1a1a] text-gray-400 rounded-xl hover:bg-[#1a1a1a]/80 hover:text-white transition-all text-sm font-medium">
              Year
            </button>
          </div>
        </div>
        <div className="relative z-10 bg-black/50 rounded-2xl p-12 text-center border-2 border-dashed border-[#1a1a1a] hover:border-[#29B5E8]/30 transition-all group">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#29B5E8]/20 to-transparent border border-[#29B5E8]/30 group-hover:scale-110 transition-transform">
              <Calendar className="w-16 h-16 text-[#29B5E8]" />
            </div>
          </div>
          <p className="text-gray-300 font-semibold text-lg mb-2">Calendar view coming soon</p>
          <p className="text-gray-500">Visual timeline of all reservations</p>
        </div>
      </div>

      {/* Reservations List */}
      <div className="bg-[#0a0a0a] rounded-2xl border border-[#1a1a1a] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#1a1a1a] bg-black/50">
          <h2 className="text-2xl font-semibold text-white">All Reservations</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/50 border-b border-[#1a1a1a]">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">ID</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Project</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Resource</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Start Date</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">End Date</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Owner</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]">
              {reservations.map((reservation) => (
                <tr key={reservation.id} className="hover:bg-[#0a0a0a]/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-[#29B5E8]">{reservation.id}</td>
                  <td className="px-6 py-4 text-sm text-white">{reservation.project}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{reservation.resource}</td>
                  <td className="px-6 py-4 text-sm font-medium text-white">{reservation.amount}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{reservation.startDate}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{reservation.endDate}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{reservation.owner}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(reservation.status)}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(reservation.status)}`}>
                        {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-[#29B5E8] hover:text-[#56C9F5] font-medium text-sm transition-colors">
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upcoming Reservations Alert */}
      <div className="relative bg-gradient-to-r from-[#29B5E8]/10 to-violet-500/10 border border-[#29B5E8]/30 rounded-2xl p-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#29B5E8] opacity-10 blur-3xl rounded-full"></div>
        <div className="flex items-start gap-4 relative z-10">
          <div className="p-3 rounded-xl bg-[#29B5E8]/20 border border-[#29B5E8]/30">
            <Sparkles className="w-6 h-6 text-[#29B5E8] flex-shrink-0" />
          </div>
          <div>
            <h3 className="font-semibold text-white mb-2 text-lg">Upcoming Reservations</h3>
            <p className="text-gray-300">
              You have <span className="text-[#29B5E8] font-semibold">{scheduledCount} scheduled reservations</span> starting within the next 7 days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
