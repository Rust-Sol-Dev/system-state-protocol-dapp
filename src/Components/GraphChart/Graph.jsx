import React, { useContext } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import './Graph.css'
import { themeContext } from '../../App';
import '../../Utils/Theme.css'


const Graph = ({ data }) => {

    const { theme } = useContext(themeContext);
    // const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    const COLORS = [ '#41b8d5','#6ce5e8', '#2d8bba','#2f5f98'];

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius)+10;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
        
        return (
            <text 
            x={x} 
            y={y} 
            fill={`${theme === 'lightTheme' && '#212121' || theme === 'dimTheme' && '#fff' || theme == 'darkTheme' && '#fff'}`}
            textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${data[index].name} ${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };
    console.log('-----', `${theme === 'lightTheme' && '#212121' || theme === 'dimTheme' && '#fff' || theme == 'darkTheme' && '#fff'}`)

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart width={400} height={400}>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                    stroke='0'
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );
};

export default Graph;
