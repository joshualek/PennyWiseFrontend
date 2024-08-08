import React, { PureComponent } from 'react';
import { PieChart, Pie, Cell, Text } from 'recharts';

const COLORS = ['#1a6299', '#7DBDDD'];

class Piechart extends PureComponent {
  renderCustomLabel = ({ x, y, name, value, cx, cy, midAngle, outerRadius }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 50; // Increase the radius to add more padding
    const xOffset = cx + radius * Math.cos(-midAngle * RADIAN);
    const yOffset = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <Text
        x={xOffset}
        y={yOffset}
        fill="hsl(var(--text))"
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontSize: 'var(--fs-300)', fontWeight: '400' }}
      >
        {`${name}: $${value}`}
      </Text>
    );
  };

  render() {
    const { data } = this.props;
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width:'100%', height: '100%' }}>
        <PieChart width={500} height={400}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={120}
            fill="#8884d8"
            paddingAngle={1.5}
            dataKey="value"
            label={this.renderCustomLabel}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </div>
    );
  }
}

export default Piechart;