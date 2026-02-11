import { Database, Users, TrendingUp, Settings, Zap } from 'lucide-react';

export default function Quota() {
  const quotas = [
    { team: 'Engineering Team', allocated: 5000, used: 3750, unit: 'GB', members: 45, trend: '+5%' },
    { team: 'Data Science Team', allocated: 8000, used: 7200, unit: 'GB', members: 28, trend: '+12%' },
    { team: 'Marketing Team', allocated: 2000, used: 1200, unit: 'GB', members: 32, trend: '+3%' },
    { team: 'Product Team', allocated: 3500, used: 2100, unit: 'GB', members: 38, trend: '+8%' },
    { team: 'Operations Team', allocated: 4000, used: 2800, unit: 'GB', members: 22, trend: '+6%' },
  ];

  const getUsagePercentage = (used: number, allocated: number) => {
    return Math.round((used / allocated) * 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'from-red-500 to-red-600';
    if (percentage >= 75) return 'from-yellow-500 to-orange-500';
    return 'from-[#29B5E8] to-[#56C9F5]';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-bold">
            <span className="bg-gradient-to-r from-[#29B5E8] via-[#7DD3FC] to-white bg-clip-text text-transparent">
              Quota Management
            </span>
          </h1>
          <p className="text-gray-400 mt-2 text-lg">Allocate and monitor team resource quotas</p>
        </div>
        <button className="group relative bg-gradient-to-r from-[#29B5E8] to-[#1E88B5] text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-[#29B5E8]/50 transition-all duration-300 font-medium flex items-center gap-2">
          <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          Adjust Quotas
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative group bg-[#0a0a0a] rounded-2xl p-6 border border-[#1a1a1a] hover:border-[#29B5E8]/50 transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#29B5E8]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#29B5E8] to-[#1E88B5] shadow-lg shadow-[#29B5E8]/30">
                <Database className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Total Allocated</h3>
            </div>
            <p className="text-4xl font-bold text-white">22.5 TB</p>
            <p className="text-sm text-gray-500 mt-2">Across all teams</p>
          </div>
        </div>

        <div className="relative group bg-[#0a0a0a] rounded-2xl p-6 border border-[#1a1a1a] hover:border-emerald-500/50 transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Total Teams</h3>
            </div>
            <p className="text-4xl font-bold text-white">5</p>
            <p className="text-sm text-gray-500 mt-2">Active teams</p>
          </div>
        </div>

        <div className="relative group bg-[#0a0a0a] rounded-2xl p-6 border border-[#1a1a1a] hover:border-violet-500/50 transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/30">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Avg. Usage</h3>
            </div>
            <p className="text-4xl font-bold text-white">75.3%</p>
            <p className="text-sm text-gray-500 mt-2">Utilization rate</p>
          </div>
        </div>
      </div>

      {/* Team Quotas */}
      <div className="relative bg-[#0a0a0a] rounded-2xl p-6 border border-[#1a1a1a] overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#29B5E8] opacity-5 blur-3xl rounded-full"></div>
        <h2 className="text-2xl font-semibold text-white mb-6 relative z-10">Team Quotas</h2>
        <div className="space-y-6 relative z-10">
          {quotas.map((quota, index) => {
            const percentage = getUsagePercentage(quota.used, quota.allocated);
            return (
              <div key={index} className="group relative bg-black/50 border border-[#1a1a1a] rounded-2xl p-6 hover:border-[#29B5E8]/30 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#29B5E8]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{quota.team}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2 bg-[#1a1a1a] px-3 py-1.5 rounded-lg">
                          <Users className="w-4 h-4 text-[#29B5E8]" />
                          <span className="text-gray-400">{quota.members} members</span>
                        </div>
                        <div className="flex items-center gap-2 bg-[#1a1a1a] px-3 py-1.5 rounded-lg">
                          <TrendingUp className="w-4 h-4 text-emerald-500" />
                          <span className="text-gray-400">{quota.trend} growth</span>
                        </div>
                      </div>
                    </div>
                    <button className="text-[#29B5E8] hover:text-[#56C9F5] font-medium text-sm transition-colors bg-[#29B5E8]/10 px-4 py-2 rounded-lg hover:bg-[#29B5E8]/20">
                      Edit Quota
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">
                        {quota.used} {quota.unit} used of {quota.allocated} {quota.unit}
                      </span>
                      <span className="font-semibold text-white bg-[#1a1a1a] px-3 py-1 rounded-lg">{percentage}%</span>
                    </div>
                    <div className="relative w-full bg-[#1a1a1a] rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 bg-gradient-to-r ${getUsageColor(percentage)} shadow-lg`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#1a1a1a] flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-[#29B5E8]" />
                      <span className="text-gray-400">
                        Available: <span className="text-white font-medium">{quota.allocated - quota.used} {quota.unit}</span>
                      </span>
                    </div>
                    {percentage >= 90 && (
                      <span className="text-red-400 font-medium flex items-center gap-1 bg-red-500/10 px-3 py-1 rounded-lg">
                        ⚠️ Quota nearly exhausted
                      </span>
                    )}
                    {percentage >= 75 && percentage < 90 && (
                      <span className="text-yellow-400 font-medium flex items-center gap-1 bg-yellow-500/10 px-3 py-1 rounded-lg">
                        ⚠️ High usage
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative group bg-gradient-to-br from-[#29B5E8]/10 to-transparent rounded-2xl p-6 border border-[#29B5E8]/30 overflow-hidden hover:border-[#29B5E8]/50 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#29B5E8] opacity-10 blur-2xl rounded-full"></div>
          <h3 className="text-xl font-semibold text-white mb-2 relative z-10">Bulk Quota Update</h3>
          <p className="text-gray-400 text-sm mb-4 relative z-10">Update quotas for multiple teams at once</p>
          <button className="relative z-10 bg-gradient-to-r from-[#29B5E8] to-[#1E88B5] text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-[#29B5E8]/50 transition-all text-sm font-medium">
            Start Bulk Update
          </button>
        </div>

        <div className="relative group bg-gradient-to-br from-violet-500/10 to-transparent rounded-2xl p-6 border border-violet-500/30 overflow-hidden hover:border-violet-500/50 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500 opacity-10 blur-2xl rounded-full"></div>
          <h3 className="text-xl font-semibold text-white mb-2 relative z-10">Usage Analytics</h3>
          <p className="text-gray-400 text-sm mb-4 relative z-10">View detailed usage patterns and trends</p>
          <button className="relative z-10 bg-gradient-to-r from-violet-500 to-purple-600 text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-violet-500/50 transition-all text-sm font-medium">
            View Analytics
          </button>
        </div>
      </div>
    </div>
  );
}
