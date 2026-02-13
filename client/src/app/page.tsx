import { Activity, TrendingUp, Users, Server, Zap } from 'lucide-react';

export default function Home() {
  const stats = [
    { label: 'Total Capacity', value: '2.4 TB', icon: Server, gradient: 'from-[#29B5E8] to-[#1E88B5]' },
    { label: 'Active Requests', value: '127', icon: Activity, gradient: 'from-emerald-500 to-teal-600' },
    { label: 'Users', value: '1,234', icon: Users, gradient: 'from-violet-500 to-purple-600' },
    { label: 'Growth', value: '+12.5%', icon: TrendingUp, gradient: 'from-orange-500 to-red-600' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#29B5E8] opacity-10 blur-3xl rounded-full"></div>
        <h1 className="text-5xl font-bold relative z-10">
          <span className="bg-gradient-to-r from-[#29B5E8] via-[#7DD3FC] to-white bg-clip-text text-transparent">
            Snowflake Capacity Platform
          </span>
          </h1>
        <p className="text-gray-400 mt-2 text-lg relative z-10">Welcome to SnowCap - your central platform for managing Snowflake capacity resources.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="group relative bg-[#0a0a0a] rounded-2xl p-6 border border-[#1a1a1a] hover:border-[#29B5E8]/50 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#29B5E8]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">{stat.label}</p>
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-4xl font-bold text-white">{stat.value}</p>
                <div className="mt-3 flex items-center gap-2">
                  <Zap className="w-3 h-3 text-[#29B5E8]" />
                  <span className="text-xs text-gray-600">Real-time</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="relative bg-[#0a0a0a] rounded-2xl p-6 border border-[#1a1a1a] overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#29B5E8] opacity-5 blur-3xl rounded-full"></div>
        <h2 className="text-2xl font-semibold text-white mb-6 relative z-10">Recent Activity</h2>
        <div className="space-y-4 relative z-10">
          {[
            { action: 'New capacity request submitted', time: '2 minutes ago', status: 'pending' },
            { action: 'Quota updated for Team Alpha', time: '1 hour ago', status: 'completed' },
            { action: 'Reservation approved for Project X', time: '3 hours ago', status: 'completed' },
            { action: 'System capacity increased by 500GB', time: '5 hours ago', status: 'completed' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-4 border-b border-[#1a1a1a] last:border-0 hover:bg-[#0a0a0a]/50 px-3 rounded-lg transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${activity.status === 'pending' ? 'bg-yellow-500 shadow-lg shadow-yellow-500/50' : 'bg-[#29B5E8] shadow-lg shadow-[#29B5E8]/50'} animate-pulse`} />
                <span className="text-gray-300">{activity.action}</span>
              </div>
              <span className="text-sm text-gray-600">{activity.time}</span>
        </div>
          ))}
        </div>
      </div>
    </div>
  );
}
