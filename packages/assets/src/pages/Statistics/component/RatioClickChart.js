import {useMemo} from 'react';
import {Cell, Pie, PieChart, ResponsiveContainer} from 'recharts';
import {Text} from '@shopify/polaris';

export const RatioClickChart = ({totalClicks, totalImpressions, ctr}) => {
  const pieData = useMemo(
    () => [
      {name: 'Clicks', value: totalClicks || 0, color: '#008060'},
      {
        name: 'No Click',
        value: Math.max(0, (totalImpressions || 0) - (totalClicks || 0)),
        color: '#E1E3E5'
      }
    ],
    [totalClicks, totalImpressions]
  );

  return (
    <div style={{display: 'flex', justifyContent: 'center', width: '100%'}}>
      <div style={{width: '140px', height: '140px', position: 'relative'}}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              innerRadius={45}
              outerRadius={60}
              stroke="none"
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}
        >
          <Text variant="headingMd" fontWeight="bold" as="dd">
            {ctr}%
          </Text>
          <Text variant="bodyXs" color="subdued">
            Ratio
          </Text>
        </div>
      </div>
    </div>
  );
};
