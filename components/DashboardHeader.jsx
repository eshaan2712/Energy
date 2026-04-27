import { BarChart3, TrendingUp, Zap, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function DashboardHeader() {
  const stats = [
    {
      label: 'Current Consumption',
      value: '13.8 GWh',
      change: '+5.2%',
      icon: Zap,
      color: 'text-blue-600'
    },
    {
      label: 'Peak Load',
      value: '6.1 GWh',
      change: '+2.1%',
      icon: TrendingUp,
      color: 'text-red-600'
    },
    {
      label: 'Forecast Accuracy',
      value: '92.3%',
      change: '+1.8%',
      icon: BarChart3,
      color: 'text-green-600'
    },
    {
      label: 'Potential Savings',
      value: '2.07 GWh',
      change: '-12.5%',
      icon: Clock,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <Card key={idx} className="p-6 bg-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
                <p className="text-xs text-green-600 mt-2">{stat.change} from last period</p>
              </div>
              <div className={`${stat.color} p-3 bg-opacity-10 rounded-lg`}>
                <Icon size={24} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
