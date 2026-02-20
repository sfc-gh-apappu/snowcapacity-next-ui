'use client';

import { useState, useMemo } from 'react';
import { Clock, CheckCircle, XCircle, Search, Cloud } from 'lucide-react';
import { STATUS_BADGE_STYLES } from '../constants';
import RequestDetailModal, { type RequestSummary } from './RequestDetailModal';

const CLOUDS = ['all', 'aws', 'azure', 'gcp'] as const;
const STATUSES = ['all', 'pending', 'approved', 'rejected'] as const;

const CLOUD_LABELS: Record<string, { label: string; color: string }> = {
  aws:   { label: 'AWS',   color: '#F59E0B' },
  azure: { label: 'Azure', color: '#3B82F6' },
  gcp:   { label: 'GCP',   color: '#EF4444' },
};

const allRequests = [
  { id: 'REQ-001', title: 'Additional Storage for Data Lake', requester: 'John Doe', date: '2026-02-10', status: 'pending', amount: '500 GB', team: 'Engineering', cloud: 'aws' },
  { id: 'REQ-002', title: 'Compute Resources for ML Training', requester: 'Jane Smith', date: '2026-02-09', status: 'approved', amount: '2 TB', team: 'Data Science', cloud: 'azure' },
  { id: 'REQ-003', title: 'Database Expansion', requester: 'Mike Johnson', date: '2026-02-08', status: 'rejected', amount: '1 TB', team: 'Engineering', cloud: 'aws' },
  { id: 'REQ-004', title: 'Archive Storage', requester: 'Sarah Williams', date: '2026-02-07', status: 'pending', amount: '5 TB', team: 'Operations', cloud: 'azure' },
  { id: 'REQ-005', title: 'Development Environment Setup', requester: 'Tom Brown', date: '2026-02-06', status: 'approved', amount: '300 GB', team: 'Product', cloud: 'gcp' },
  { id: 'REQ-006', title: 'Analytics Data Warehouse', requester: 'Lisa Chen', date: '2026-02-05', status: 'approved', amount: '3 TB', team: 'Data Science', cloud: 'azure' },
  { id: 'REQ-007', title: 'CI/CD Pipeline Storage', requester: 'Dave Park', date: '2026-02-04', status: 'pending', amount: '200 GB', team: 'Engineering', cloud: 'gcp' },
  { id: 'REQ-008', title: 'GPU Instances for Inference', requester: 'Amy Liu', date: '2026-02-03', status: 'pending', amount: '4 Instances', team: 'ML Platform', cloud: 'aws' },
  { id: 'REQ-009', title: 'Blob Storage Expansion', requester: 'Raj Patel', date: '2026-02-02', status: 'approved', amount: '10 TB', team: 'Data Science', cloud: 'azure' },
  { id: 'REQ-010', title: 'BigQuery Slot Reservation', requester: 'Chris Nguyen', date: '2026-02-01', status: 'pending', amount: '500 Slots', team: 'Analytics', cloud: 'gcp' },
];

function getStatusIcon(status: string) {
  switch (status) {
    case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />;
    case 'approved': return <CheckCircle className="w-5 h-5 text-[#29B5E8]" />;
    case 'rejected': return <XCircle className="w-5 h-5 text-red-500" />;
    default: return null;
  }
}

interface ViewRequestsTabProps {
  initialCloud?: string;
  initialStatus?: string;
}

export default function ViewRequestsTab({ initialCloud = 'all', initialStatus = 'all' }: ViewRequestsTabProps) {
  const [selectedRequest, setSelectedRequest] = useState<RequestSummary | null>(null);
  const [cloudFilter, setCloudFilter] = useState(initialCloud);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [search, setSearch] = useState('');

  const filteredRequests = useMemo(() => {
    return allRequests.filter((r) => {
      if (cloudFilter !== 'all' && r.cloud !== cloudFilter) return false;
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return r.id.toLowerCase().includes(q) || r.title.toLowerCase().includes(q) || r.requester.toLowerCase().includes(q) || r.team.toLowerCase().includes(q);
      }
      return true;
    });
  }, [cloudFilter, statusFilter, search]);

  return (
    <div className="space-y-6">
      {/* Filters + Search */}
      <div className="bg-[#0a0a0a] rounded-2xl p-6 border border-[#1a1a1a] space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <h2 className="text-xl font-semibold text-white">All Requests</h2>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search all requests..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#29B5E8] text-white placeholder-gray-600"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Cloud filter */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Cloud Provider</span>
            <div className="flex gap-1.5">
              {CLOUDS.map((c) => (
                <button
                  key={c}
                  onClick={() => setCloudFilter(c)}
                  className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 ${
                    cloudFilter === c
                      ? 'bg-gradient-to-r from-[#29B5E8] to-[#1E88B5] text-white shadow-lg shadow-[#29B5E8]/30'
                      : 'bg-[#1a1a1a] text-gray-400 hover:text-white hover:bg-[#222]'
                  }`}
                >
                  {c === 'all' ? 'All' : c.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Status filter */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Status</span>
            <div className="flex gap-1.5">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 ${
                    statusFilter === s
                      ? 'bg-gradient-to-r from-[#29B5E8] to-[#1E88B5] text-white shadow-lg shadow-[#29B5E8]/30'
                      : 'bg-[#1a1a1a] text-gray-400 hover:text-white hover:bg-[#222]'
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500">
        Showing <span className="text-white font-medium">{filteredRequests.length}</span> of {allRequests.length} requests
      </p>

      {/* All Requests Table */}
      <div className="bg-[#0a0a0a] rounded-2xl border border-[#1a1a1a] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/50 border-b border-[#1a1a1a]">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Request ID</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Title</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Cloud</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Requester</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Team</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                    No requests match the current filters.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request) => {
                  const cloudInfo = CLOUD_LABELS[request.cloud];
                  return (
                    <tr key={request.id} className="table-row-hover">
                      <td className="px-6 py-4 text-sm font-medium text-[#29B5E8]">{request.id}</td>
                      <td className="px-6 py-4 text-sm text-white">{request.title}</td>
                      <td className="px-6 py-4">
                        <span
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border"
                          style={{ borderColor: `${cloudInfo.color}40`, backgroundColor: `${cloudInfo.color}10`, color: cloudInfo.color }}
                        >
                          <Cloud className="w-3 h-3" />
                          {cloudInfo.label}
                        </span>
                      </td>
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
                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="text-[#29B5E8] hover:text-[#56C9F5] font-medium text-sm transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedRequest && (
        <RequestDetailModal request={selectedRequest} onClose={() => setSelectedRequest(null)} />
      )}
    </div>
  );
}
