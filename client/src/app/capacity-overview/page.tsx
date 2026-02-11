import { BarChart3, HardDrive, TrendingUp, AlertCircle, Sparkles } from 'lucide-react';

export default function CapacityOverview() {
  const capacityData = [
    { name: 'Storage Pool A', used: 75, total: 100, unit: 'TB', status: 'healthy' },
    { name: 'Storage Pool B', used: 45, total: 80, unit: 'TB', status: 'healthy' },
    { name: 'Storage Pool C', used: 92, total: 100, unit: 'TB', status: 'warning' },
    { name: 'Storage Pool D', used: 30, total: 120, unit: 'TB', status: 'healthy' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-[#29B5E8]';
      case 'warning':
        return 'bg-yellow-500';
      case 'critical':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getUsagePercentage = (used: number, total: number) => {
    return Math.round((used / total) * 100);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-bold">
            <span className="bg-gradient-to-r from-[#29B5E8] via-[#7DD3FC] to-white bg-clip-text text-transparent">
              Capacity Overview
            </span>
          </h1>
          <p className="text-gray-400 mt-2 text-lg">Monitor and analyze storage capacity across all pools</p>
        </div>
        <button className="group relative bg-gradient-to-r from-[#29B5E8] to-[#1E88B5] text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-[#29B5E8]/50 transition-all duration-300 font-medium">
          <span className="relative z-10 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Generate Report
          </span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative group bg-[#0a0a0a] rounded-2xl p-6 border border-[#1a1a1a] hover:border-[#29B5E8]/50 transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#29B5E8]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#29B5E8] to-[#1E88B5] shadow-lg shadow-[#29B5E8]/30">
                <HardDrive className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Total Capacity</h3>
            </div>
            <p className="text-4xl font-bold text-white">400 TB</p>
            <p className="text-sm text-gray-500 mt-2">Across all pools</p>
          </div>
        </div>

        <div className="relative group bg-[#0a0a0a] rounded-2xl p-6 border border-[#1a1a1a] hover:border-emerald-500/50 transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Used Capacity</h3>
            </div>
            <p className="text-4xl font-bold text-white">242 TB</p>
            <p className="text-sm text-gray-500 mt-2">60.5% utilized</p>
          </div>
        </div>

        <div className="relative group bg-[#0a0a0a] rounded-2xl p-6 border border-[#1a1a1a] hover:border-violet-500/50 transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/30">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Growth Rate</h3>
            </div>
            <p className="text-4xl font-bold text-white">+8.2%</p>
            <p className="text-sm text-gray-500 mt-2">Last 30 days</p>
          </div>
        </div>
      </div>

      {/* Storage Pools */}
      <div className="relative bg-[#0a0a0a] rounded-2xl p-6 border border-[#1a1a1a] overflow-hidden">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#29B5E8] opacity-5 blur-3xl rounded-full"></div>
        <h2 className="text-2xl font-semibold text-white mb-6 relative z-10">Storage Pools</h2>
        <div className="space-y-6 relative z-10">
          {capacityData.map((pool, index) => {
            const percentage = getUsagePercentage(pool.used, pool.total);
            return (
              <div key={index} className="space-y-3 p-4 rounded-xl bg-black/50 border border-[#1a1a1a] hover:border-[#29B5E8]/30 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(pool.status)} shadow-lg ${pool.status === 'healthy' ? 'shadow-[#29B5E8]/50' : 'shadow-yellow-500/50'} animate-pulse`} />
                    <span className="font-semibold text-white">{pool.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400">
                      {pool.used} / {pool.total} {pool.unit}
                    </span>
                    <span className="text-sm font-semibold text-[#29B5E8] w-12 text-right">
                      {percentage}%
                    </span>
                  </div>
                </div>
                <div className="relative w-full bg-[#1a1a1a] rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      percentage >= 90 
                        ? 'bg-gradient-to-r from-red-500 to-red-600 shadow-lg shadow-red-500/50' 
                        : percentage >= 75 
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg shadow-yellow-500/50' 
                        : 'bg-gradient-to-r from-[#29B5E8] to-[#56C9F5] shadow-lg shadow-[#29B5E8]/50'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Alerts */}
      <div className="relative bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl p-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500 opacity-5 blur-3xl rounded-full"></div>
        <div className="flex items-start gap-4 relative z-10">
          <div className="p-3 rounded-xl bg-yellow-500/20 border border-yellow-500/30">
            <AlertCircle className="w-6 h-6 text-yellow-500 flex-shrink-0" />
          </div>
          <div>
            <h3 className="font-semibold text-yellow-400 mb-2 text-lg">Capacity Warning</h3>
            <p className="text-gray-300">
              Storage Pool C is at 92% capacity. Consider expanding or reallocating resources.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
