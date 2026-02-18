'use client';

import { Clock, CheckCircle, XCircle, Search } from 'lucide-react';
import { STATUS_BADGE_STYLES } from '../constants';

const allRequests = [
  { id: 'REQ-001', title: 'Additional Storage for Data Lake', requester: 'John Doe', date: '2026-02-10', status: 'pending', amount: '500 GB', team: 'Engineering' },
  { id: 'REQ-002', title: 'Compute Resources for ML Training', requester: 'Jane Smith', date: '2026-02-09', status: 'approved', amount: '2 TB', team: 'Data Science' },
  { id: 'REQ-003', title: 'Database Expansion', requester: 'Mike Johnson', date: '2026-02-08', status: 'rejected', amount: '1 TB', team: 'Engineering' },
  { id: 'REQ-004', title: 'Archive Storage', requester: 'Sarah Williams', date: '2026-02-07', status: 'pending', amount: '5 TB', team: 'Operations' },
  { id: 'REQ-005', title: 'Development Environment Setup', requester: 'Tom Brown', date: '2026-02-06', status: 'approved', amount: '300 GB', team: 'Product' },
  { id: 'REQ-006', title: 'Analytics Data Warehouse', requester: 'Lisa Chen', date: '2026-02-05', status: 'approved', amount: '3 TB', team: 'Data Science' },
  { id: 'REQ-007', title: 'CI/CD Pipeline Storage', requester: 'Dave Park', date: '2026-02-04', status: 'pending', amount: '200 GB', team: 'Engineering' },
];

function getStatusIcon(status: string) {
  switch (status) {
    case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />;
    case 'approved': return <CheckCircle className="w-5 h-5 text-[#29B5E8]" />;
    case 'rejected': return <XCircle className="w-5 h-5 text-red-500" />;
    default: return null;
  }
}

export default function ViewRequestsTab() {
  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="bg-[#0a0a0a] rounded-2xl p-6 border border-[#1a1a1a]">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <h2 className="text-xl font-semibold text-white">All Requests</h2>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search all requests..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#29B5E8] text-white placeholder-gray-600"
            />
          </div>
        </div>
      </div>

      {/* All Requests Table */}
      <div className="bg-[#0a0a0a] rounded-2xl border border-[#1a1a1a] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/50 border-b border-[#1a1a1a]">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Request ID</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Title</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Requester</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Team</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]">
              {allRequests.map((request) => (
                <tr key={request.id} className="table-row-hover">
                  <td className="px-6 py-4 text-sm font-medium text-[#29B5E8]">{request.id}</td>
                  <td className="px-6 py-4 text-sm text-white">{request.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{request.requester}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#1a1a1a] text-gray-300 border border-[#2a2a2a]">
                      {request.team}
                    </span>
                  </td>
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
