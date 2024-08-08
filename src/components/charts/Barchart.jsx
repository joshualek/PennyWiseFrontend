import React, { PureComponent } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CustomLabel = ({ x, y, width, value }) => {
    return (
        <text x={x + width / 2} y={y} dy={-4} fill="#1a6299" fontSize={'var(--fs-100)'} textAnchor="middle">
            ${value}
        </text>
    );
};

class Barchart extends PureComponent {
    render() {
        const { data } = this.props;

        return (
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                    barSize={40}
                >
                    <XAxis dataKey="name" tick={{ fontSize: 20 }} />
                    <YAxis tick={{ fontSize: 20 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#1a6299" name="Category" label={<CustomLabel />} />
                </BarChart>
            </ResponsiveContainer>
        );
    }
}

export default Barchart;