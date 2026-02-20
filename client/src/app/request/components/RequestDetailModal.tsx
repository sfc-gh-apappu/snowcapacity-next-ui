'use client';

import { useState, useEffect } from 'react';
import { X, CheckCircle, Clock, XCircle, AlertCircle, MessageSquare, Send, User, ChevronRight } from 'lucide-react';

export interface RequestSummary {
  id: string;
  title: string;
  date: string;
  status: string;
  amount?: string;
  requester?: string;
  team?: string;
}

interface TimelineEvent {
  status: string;
  label: string;
  actor: string;
  timestamp: string;
  note?: string;
}

interface ActivityMessage {
  id: string;
  author: string;
  timestamp: string;
  text: string;
  isSystem?: boolean;
}

interface Props {
  request: RequestSummary;
  onClose: () => void;
}

const MOCK_TIMELINE: Record<string, TimelineEvent[]> = {
  pending: [
    { status: 'done', label: 'Submitted', actor: 'You', timestamp: '2026-02-10 09:15 AM', note: 'Request created' },
    { status: 'current', label: 'Under Review', actor: 'Capacity Team', timestamp: '2026-02-10 10:30 AM' },
    { status: 'upcoming', label: 'Finance Approval', actor: '—', timestamp: '' },
    { status: 'upcoming', label: 'Completed', actor: '—', timestamp: '' },
  ],
  approved: [
    { status: 'done', label: 'Submitted', actor: 'You', timestamp: '2026-02-09 11:00 AM', note: 'Request created' },
    { status: 'done', label: 'Under Review', actor: 'Capacity Team', timestamp: '2026-02-09 02:15 PM', note: 'Reviewed and forwarded' },
    { status: 'done', label: 'Finance Approval', actor: 'Finance Team', timestamp: '2026-02-09 04:45 PM', note: 'Approved by Sarah W.' },
    { status: 'done', label: 'Completed', actor: 'System', timestamp: '2026-02-09 05:00 PM', note: 'Resources provisioned' },
  ],
  rejected: [
    { status: 'done', label: 'Submitted', actor: 'You', timestamp: '2026-02-08 08:30 AM', note: 'Request created' },
    { status: 'done', label: 'Under Review', actor: 'Capacity Team', timestamp: '2026-02-08 11:00 AM' },
    { status: 'rejected', label: 'Rejected', actor: 'Finance Team', timestamp: '2026-02-08 03:30 PM', note: 'Insufficient budget allocation' },
  ],
};

function getMockActivity(reqId: string): ActivityMessage[] {
  return [
    { id: '1', author: 'System', timestamp: '2026-02-10 09:15 AM', text: `Request ${reqId} created.`, isSystem: true },
    { id: '2', author: 'Capacity Team', timestamp: '2026-02-10 10:30 AM', text: 'We\'ve started reviewing your request. Might need clarification on the region preference.' },
    { id: '3', author: 'You', timestamp: '2026-02-10 11:05 AM', text: 'Sure — us-east-1 is strongly preferred due to data residency requirements.' },
    { id: '4', author: 'Capacity Team', timestamp: '2026-02-10 11:20 AM', text: 'Got it, thanks. We\'ll proceed with us-east-1.' },
  ];
}

function getStatusColor(status: string) {
  switch (status) {
    case 'done': return 'bg-emerald-500';
    case 'current': return 'bg-[#29B5E8] animate-pulse';
    case 'rejected': return 'bg-red-500';
    default: return 'bg-[#2a2a2a]';
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'pending': return { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30' };
    case 'approved': return { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };
    case 'rejected': return { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' };
    default: return { icon: AlertCircle, color: 'text-gray-400', bg: 'bg-gray-500/10 border-gray-500/30' };
  }
}

export default function RequestDetailModal({ request, onClose }: Props) {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<ActivityMessage[]>([]);
  const [activeSection, setActiveSection] = useState<'timeline' | 'activity'>('timeline');

  useEffect(() => {
    setMessages(getMockActivity(request.id));
  }, [request.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const timeline = MOCK_TIMELINE[request.status] || MOCK_TIMELINE.pending;
  const badge = getStatusBadge(request.status);
  const BadgeIcon = badge.icon;

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setMessages(prev => [...prev, {
      id: crypto.randomUUID(),
      author: 'You',
      timestamp: new Date().toLocaleString(),
      text: newMessage.trim(),
    }]);
    setNewMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1a1a1a] bg-black/50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold text-[#29B5E8] font-mono">{request.id}</span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${badge.bg}`}>
              <BadgeIcon className={`w-3.5 h-3.5 ${badge.color}`} />
              <span className={badge.color}>{request.status.charAt(0).toUpperCase() + request.status.slice(1)}</span>
            </span>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-[#1a1a1a] transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
          {/* Request summary */}
          <div className="bg-black/50 rounded-xl border border-[#1a1a1a] p-5 space-y-3">
            <h3 className="text-white font-semibold">{request.title}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <SummaryField label="Date" value={request.date} />
              {request.amount && <SummaryField label="Amount" value={request.amount} />}
              {request.requester && <SummaryField label="Requester" value={request.requester} />}
              {request.team && <SummaryField label="Team" value={request.team} />}
            </div>
          </div>

          {/* Section toggle */}
          <div className="flex gap-1 bg-[#111] rounded-xl p-1">
            {(['timeline', 'activity'] as const).map(s => (
              <button
                key={s}
                onClick={() => setActiveSection(s)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeSection === s
                    ? 'bg-[#1a1a1a] text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {s === 'timeline' ? <ChevronRight className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                {s === 'timeline' ? 'Approval Timeline' : 'Activity'}
              </button>
            ))}
          </div>

          {/* Approval Timeline */}
          {activeSection === 'timeline' && (
            <div className="space-y-0">
              {timeline.map((event, idx) => {
                const isLast = idx === timeline.length - 1;
                return (
                  <div key={idx} className="flex gap-4">
                    {/* Vertical connector */}
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${getStatusColor(event.status)} ring-4 ring-[#0a0a0a]`} />
                      {!isLast && (
                        <div className={`w-0.5 flex-1 min-h-[40px] ${event.status === 'done' ? 'bg-emerald-500/40' : 'bg-[#1a1a1a]'}`} />
                      )}
                    </div>
                    {/* Content */}
                    <div className={`pb-6 ${isLast ? 'pb-0' : ''}`}>
                      <p className={`text-sm font-medium ${
                        event.status === 'done' ? 'text-white' :
                        event.status === 'current' ? 'text-[#29B5E8]' :
                        event.status === 'rejected' ? 'text-red-400' :
                        'text-gray-500'
                      }`}>{event.label}</p>
                      {event.timestamp && (
                        <p className="text-xs text-gray-500 mt-0.5">{event.actor} · {event.timestamp}</p>
                      )}
                      {event.note && (
                        <p className="text-xs text-gray-400 mt-1 pl-3 border-l-2 border-[#1a1a1a]">{event.note}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Activity Thread */}
          {activeSection === 'activity' && (
            <div className="space-y-3">
              {messages.map(msg => (
                <div key={msg.id} className={`flex gap-3 ${msg.isSystem ? 'opacity-60' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.author === 'You' ? 'bg-[#29B5E8]/20' :
                    msg.isSystem ? 'bg-[#1a1a1a]' :
                    'bg-violet-500/20'
                  }`}>
                    <User className={`w-4 h-4 ${
                      msg.author === 'You' ? 'text-[#29B5E8]' :
                      msg.isSystem ? 'text-gray-500' :
                      'text-violet-400'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className={`text-sm font-medium ${msg.author === 'You' ? 'text-[#29B5E8]' : 'text-white'}`}>{msg.author}</span>
                      <span className="text-[10px] text-gray-600">{msg.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-300 mt-0.5">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message input — always visible when on activity */}
        {activeSection === 'activity' && (
          <div className="flex-shrink-0 border-t border-[#1a1a1a] px-6 py-4 bg-black/50">
            <div className="flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2.5 bg-[#111] border border-[#1a1a1a] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#29B5E8] focus:border-transparent transition-all text-sm"
              />
              <button
                onClick={handleSend}
                disabled={!newMessage.trim()}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#29B5E8] to-[#1E88B5] text-white font-medium text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#29B5E8]/30 transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-gray-600 mt-2">Messages are visible to all participants. Press Enter to send.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-gray-500 uppercase tracking-wider">{label}</p>
      <p className="text-sm text-white font-medium mt-0.5">{value}</p>
    </div>
  );
}
