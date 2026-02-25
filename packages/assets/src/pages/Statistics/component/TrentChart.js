import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';

export const TrendChart = ({data}) => {
  return (
    <div style={{width: '100%', height: 350}}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{fontSize: 10, fill: '#333'}}
            dy={10}
          />
          <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#333'}} />
          <Tooltip />
          <Line
            name="Impressions"
            type="monotone"
            dataKey="impressions"
            stroke="#333"
            strokeWidth={1}
            strokeDasharray="5 5"
            dot={false}
          />
          <Line
            name="Clicks"
            type="monotone"
            dataKey="clicks"
            stroke="#008060"
            strokeWidth={3}
            dot={{r: 4, fill: '#008060'}}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
