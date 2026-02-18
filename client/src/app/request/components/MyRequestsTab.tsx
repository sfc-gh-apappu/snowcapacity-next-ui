'use client';

import { Clock, CheckCircle, XCircle, Search } from 'lucide-react';
import CountUp from '@/components/CountUp';
import { STATUS_BADGE_STYLES } from '../constants';

interface MyRequestsTabProps {
  filter: string;
  setFilter: (f: string) => void;
}

const myRequests = [
  { id: 'REQ-001', title: 'Additional Storage for Data Lake', date: '2026-02-10', status: 'pending', amount: '500 GB' },
  { id: 'REQ-004', title: 'Archive Storage', date: '2026-02-07', status: 'pending', amount: '5 TB' },
  { id: 'REQ-002', title: 'Compute Resources for ML Training', date: '2026-02-09', status: 'approved', amount: '2 TB' },
  { id: 'REQ-005', title: 'Development Environment Setup', date: '2026-02-06', status: 'approved', amount: '300 GB' },
  { id: 'REQ-003', title: 'Database Expansion', date: '2026-02-08', status: 'rejected', amount: '1 TB' },
];

function getStatusIcon(status: string) {
  switch (status) {
    case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />;
    case 'approved': return <CheckCircle className="w-5 h-5 text-[#29B5E8]" />;
    case 'rejected': return <XCircle className="w-5 h-5 text-red-500" />;
    default: return null;
  }
}

export default function MyRequestsTab({ filter, setFilter }: MyRequestsTabProps) {
  const filteredRequests = filter === 'all' ? myRequests : myRequests.filter(req => req.status === filter);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative group bg-[#0a0a0a] rounded-2xl p-6 border border-[#1a1a1a] hover:border-yellow-500/50 transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-yellow-500/20 border border-yellow-500/30">
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider">Pending</p>
              <p className="text-3xl font-bold text-white mt-1"><CountUp end={2} /></p>
            </div>
          </div>
        </div>
        <div className="relative group bg-[#0a0a0a] rounded-2xl p-6 border border-[#1a1a1a] hover:border-[#29B5E8]/50 transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#29B5E8]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#29B5E8]/20 border border-[#29B5E8]/30">
              <CheckCircle className="w-8 h-8 text-[#29B5E8]" />
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider">Approved</p>
              <p className="text-3xl font-bold text-white mt-1"><CountUp end={2} /></p>
            </div>
          </div>
        </div>
        <div className="relative group bg-[#0a0a0a] rounded-2xl p-6 border border-[#1a1a1a] hover:border-red-500/50 transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider">Rejected</p>
              <p className="text-3xl font-bold text-white mt-1"><CountUp end={1} /></p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-[#0a0a0a] rounded-2xl p-6 border border-[#1a1a1a]">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex gap-2">
            {['all', 'pending', 'approved', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
                  filter === status
                    ? 'bg-gradient-to-r from-[#29B5E8] to-[#1E88B5] text-white shadow-lg shadow-[#29B5E8]/30'
                    : 'bg-[#1a1a1a] text-gray-400 hover:text-white hover:bg-[#1a1a1a]/80'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search my requests..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#29B5E8] text-white placeholder-gray-600"
            />
          </div>
        </div>
      </div>

      {/* My Requests Table */}
      <div className="bg-[#0a0a0a] rounded-2xl border border-[#1a1a1a] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/50 border-b border-[#1a1a1a]">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Request ID</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Title</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]">
              {filteredRequests.map((request) => (
                <tr key={request.id} className="table-row-hover">
                  <td className="px-6 py-4 text-sm font-medium text-[#29B5E8]">{request.id}</td>
                  <td className="px-6 py-4 text-sm text-white">{request.title}</td>
                  <td className="px-6 py-4 text-sm font-medium text-white">{request.amount}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{request.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(request.status)}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${STATUS_BADGE_STYLES[request.status] || 'bg-gray-500/10 text-gray-400'}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-[#29B5E8] hover:text-[#56C9F5] font-medium text-sm transition-colors">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
