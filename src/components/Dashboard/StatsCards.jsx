const StatsCards = ({ passwords }) => {
  const total = passwords.length;
  const strong = passwords.filter((p) => p.strength === "strong").length;
  const medium = passwords.filter((p) => p.strength === "medium").length;
  const weak = passwords.filter((p) => p.strength === "weak").length;

  const percent = (count) => (total ? Math.round((count / total) * 100) : 0);

  const StatCard = ({ title, percentage, color, borderColor, bgColor }) => (
    <div className={`p-6 bg-white rounded-2xl shadow-lg border-l-4 ${borderColor} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <div className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center`}>
          <span className="text-white font-bold text-sm">{percentage}%</span>
        </div>
      </div>
      
      {/* <p className="text-3xl font-bold text-gray-800 mb-2">{count}</p> */}
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Progress</span>
          <span className="font-medium text-gray-700">{percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div
            className={`h-2 rounded-full transition-all duration-700 ease-out ${color}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Passwords"
        count={total}
        percentage={100}
        color="bg-blue-900"
        borderColor="border-blue-500"
        bgColor="bg-blue-900"
      />

      <StatCard
        title="Strong"
        count={strong}
        percentage={percent(strong)}
        color="bg-emerald-500"
        borderColor="border-emerald-500"
        bgColor="bg-emerald-500"
      />

      <StatCard
        title="Medium"
        count={medium}
        percentage={percent(medium)}
        color="bg-amber-400"
        borderColor="border-amber-500"
        bgColor="bg-amber-500"
      />

      <StatCard
        title="Weak"
        count={weak}
        percentage={percent(weak)}
        color="bg-red-500"
        borderColor="border-red-500"
        bgColor="bg-red-500"
      />
    </div>
  );
};

export default StatsCards;