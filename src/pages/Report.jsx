import { TrendingUp, TrendingDown, BarChart3, Users } from 'lucide-react';

export default function Report() {
  const metrics = [
    { label: 'Average Price', value: 'NPR 45,00,000', change: '+5.2%', isPositive: true, icon: TrendingUp },
    { label: 'Total Listings', value: '2,500+', change: '+12.3%', isPositive: true, icon: BarChart3 },
    { label: 'Active Users', value: '10,000+', change: '+8.1%', isPositive: true, icon: Users },
    { label: 'Market Volatility', value: '-2.4%', change: '-2.4%', isPositive: false, icon: TrendingDown },
  ];

  const cityData = [
    { city: 'Kathmandu', listings: 850, avgPrice: 'NPR 50,00,000' },
    { city: 'Lalitpur', listings: 620, avgPrice: 'NPR 42,00,000' },
    { city: 'Bhaktapur', listings: 450, avgPrice: 'NPR 38,00,000' },
    { city: 'Pokhara', listings: 380, avgPrice: 'NPR 32,00,000' },
    { city: 'Biratnagar', listings: 200, avgPrice: 'NPR 28,00,000' },
  ];

  const categoryData = [
    { category: 'Residential', percentage: 55, count: 1375 },
    { category: 'Commercial', percentage: 25, count: 625 },
    { category: 'Land', percentage: 15, count: 375 },
    { category: 'Office', percentage: 5, count: 125 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/10 to-accent/5 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Market Report</h1>
          <p className="text-muted-foreground">Nepal's Real Estate Market Insights</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.label} className="bg-card border border-border rounded-lg p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <Icon className="w-8 h-8 text-primary" />
                  <span className={`text-sm font-semibold ${metric.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.change}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">{metric.label}</p>
                <p className="text-2xl font-bold text-foreground">{metric.value}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Top Cities */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">Top Cities by Listings</h2>
            <div className="space-y-4">
              {cityData.map((item, idx) => (
                <div key={item.city} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-foreground">{item.city}</span>
                    <span className="text-sm text-muted-foreground">{item.listings} listings</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary to-accent h-full transition-all"
                      style={{ width: `${(item.listings / 850) * 100}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">{item.avgPrice} avg</p>
                </div>
              ))}
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">Property Distribution</h2>
            <div className="space-y-4">
              {categoryData.map((item) => (
                <div key={item.category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-foreground">{item.category}</span>
                    <span className="text-sm text-muted-foreground">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-accent to-primary h-full transition-all"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">{item.count} properties</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Market Insights */}
        <div className="bg-gradient-to-br from-card to-muted border border-border rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Market Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full" />
                Current Trends
              </h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Increasing demand for residential properties in Kathmandu valley</li>
                <li>• Growing interest in commercial spaces post-pandemic</li>
                <li>• Rising prices in premium locations</li>
                <li>• More first-time homebuyers entering the market</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full" />
                Recommendations
              </h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Best time to invest in secondary markets</li>
                <li>• Monitor price trends before major decisions</li>
                <li>• Consider location carefully for resale value</li>
                <li>• Consult with experienced agents for guidance</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
