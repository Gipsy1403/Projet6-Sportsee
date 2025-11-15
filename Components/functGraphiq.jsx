// const { dataMocks } = require("@/src/mocks/users");

// export function dateAndDistanceExtraction(){
// 	return dataMocks[0].runningData.map(activity=>({
// 		date:activity.date,
// 		distance : activity.distance
// 	}));
// }

// #region Sample data
// import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts';

// const data = [
//   {
//     name: 'Page A',
//     uv: 400,
//     pv: 2400,
//     amt: 2400,
//   },
//   {
//     name: 'Page B',
//     uv: 300,
//     pv: 4567,
//     amt: 2400,
//   },
//   {
//     name: 'Page C',
//     uv: 300,
//     pv: 1398,
//     amt: 2400,
//   },
//   {
//     name: 'Page D',
//     uv: 200,
//     pv: 9800,
//     amt: 2400,
//   },
//   {
//     name: 'Page E',
//     uv: 278,
//     pv: 3908,
//     amt: 2400,
//   },
//   {
//     name: 'Page F',
//     uv: 189,
//     pv: 4800,
//     amt: 2400,
//   },
// ];

// const margin = {
//   top: 20,
//   right: 30,
//   left: 20,
//   bottom: 5,
// };
// // #endregion

// export default function CustomizeLegendAndTooltipStyle() {
//   return (
//     <BarChart width={600} height={300} data={data} margin={margin}>
//       <XAxis dataKey="name" stroke="#8884d8" />
//       <YAxis />
//       <Tooltip wrapperStyle={{ width: 100, backgroundColor: '#ccc' }} />
//       <Legend
//         width={100}
//         wrapperStyle={{
//           top: 40,
//           right: 20,
//           backgroundColor: '#f5f5f5',
//           border: '1px solid #d5d5d5',
//           borderRadius: 3,
//           lineHeight: '40px',
//         }}
//       />
//       <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
//       <Bar dataKey="uv" fill="#8884d8" barSize={30} />
//     </BarChart>
//   );
// }
// // ***********************************************************************************************
// export function extractionBpm(){
// 	const activities=dataMocks[0].runningData;
// 	const bpmData = activities.map(activity => ({
// 	date: activity.date,
// 	min: activity.heartRate.min,
// 	max: activity.heartRate.max,
// 	average: activity.heartRate.average,
// 	}));

// 	return bpmData
// }

// import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// // #region Sample data
// const data = [
//   {
//     name: 'Page A',
//     uv: 4000,
//     pv: 2400,
//     amt: 2400,
//   },
//   {
//     name: 'Page B',
//     uv: 3000,
//     pv: 1398,
//     amt: 2210,
//   },
//   {
//     name: 'Page C',
//     uv: 2000,
//     pv: 9800,
//     amt: 2290,
//   },
//   {
//     name: 'Page D',
//     uv: 2780,
//     pv: 3908,
//     amt: 2000,
//   },
//   {
//     name: 'Page E',
//     uv: 1890,
//     pv: 4800,
//     amt: 2181,
//   },
//   {
//     name: 'Page F',
//     uv: 2390,
//     pv: 3800,
//     amt: 2500,
//   },
//   {
//     name: 'Page G',
//     uv: 3490,
//     pv: 4300,
//     amt: 2100,
//   },
// ];

// // #endregion
// const SimpleBarChart = () => {
//   return (
//     <BarChart
//       style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }}
//       responsive
//       data={data}
//       margin={{
//         top: 5,
//         right: 0,
//         left: 0,
//         bottom: 5,
//       }}
//     >
//       <CartesianGrid strokeDasharray="3 3" />
//       <XAxis dataKey="name" />
//       <YAxis width="auto" />
//       <Tooltip />
//       <Legend />
//       <Bar dataKey="pv" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
//       <Bar dataKey="uv" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
//     </BarChart>
//   );
// };

// export default SimpleBarChart;
// // ******************************************************************************
// export function extractionWeeklyGoal(){
// 	const activities=dataMocks[0].runningData;
// 	const objective = dataMocks[0].weeklyGoal;
// 	const weekObjective=
// 	activities.map(activity => ({
// 	date: activity.date,
// 	objective:objective
// 	}));

// 	return weekObjective
// }

// import { Pie, PieChart, Sector, SectorProps, Tooltip } from 'recharts';
// import { TooltipIndex } from 'recharts/types/state/tooltipSlice';

// type Coordinate = {
//   x: number;
//   y: number;
// };

// type PieSectorData = {
//   percent?: number;
//   name?: string | number;
//   midAngle?: number;
//   middleRadius?: number;
//   tooltipPosition?: Coordinate;
//   value?: number;
//   paddingAngle?: number;
//   dataKey?: string;
//   payload?: any;
// };

// type PieSectorDataItem = React.SVGProps<SVGPathElement> & Partial<SectorProps> & PieSectorData;

// // #region Sample data
// const data = [
//   { name: 'Group A', value: 400 },
//   { name: 'Group B', value: 300 },
//   { name: 'Group C', value: 300 },
//   { name: 'Group D', value: 200 },
// ];

// // #endregion
// const renderActiveShape = ({
//   cx,
//   cy,
//   midAngle,
//   innerRadius,
//   outerRadius,
//   startAngle,
//   endAngle,
//   fill,
//   payload,
//   percent,
//   value,
// }: PieSectorDataItem) => {
//   const RADIAN = Math.PI / 180;
//   const sin = Math.sin(-RADIAN * (midAngle ?? 1));
//   const cos = Math.cos(-RADIAN * (midAngle ?? 1));
//   const sx = (cx ?? 0) + ((outerRadius ?? 0) + 10) * cos;
//   const sy = (cy ?? 0) + ((outerRadius ?? 0) + 10) * sin;
//   const mx = (cx ?? 0) + ((outerRadius ?? 0) + 30) * cos;
//   const my = (cy ?? 0) + ((outerRadius ?? 0) + 30) * sin;
//   const ex = mx + (cos >= 0 ? 1 : -1) * 22;
//   const ey = my;
//   const textAnchor = cos >= 0 ? 'start' : 'end';

//   return (
//     <g>
//       <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
//         {payload.name}
//       </text>
//       <Sector
//         cx={cx}
//         cy={cy}
//         innerRadius={innerRadius}
//         outerRadius={outerRadius}
//         startAngle={startAngle}
//         endAngle={endAngle}
//         fill={fill}
//       />
//       <Sector
//         cx={cx}
//         cy={cy}
//         startAngle={startAngle}
//         endAngle={endAngle}
//         innerRadius={(outerRadius ?? 0) + 6}
//         outerRadius={(outerRadius ?? 0) + 10}
//         fill={fill}
//       />
//       <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
//       <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
//       <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`PV ${value}`}</text>
//       <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
//         {`(Rate ${((percent ?? 1) * 100).toFixed(2)}%)`}
//       </text>
//     </g>
//   );
// };

// export default function CustomActiveShapePieChart({
//   isAnimationActive = true,
//   defaultIndex = undefined,
// }: {
//   isAnimationActive?: boolean;
//   defaultIndex?: TooltipIndex;
// }) {
//   return (
//     <PieChart
//       style={{ width: '100%', maxWidth: '500px', maxHeight: '80vh', aspectRatio: 1 }}
//       responsive
//       margin={{
//         top: 50,
//         right: 120,
//         bottom: 0,
//         left: 120,
//       }}
//     >
//       <Pie
//         activeShape={renderActiveShape}
//         data={data}
//         cx="50%"
//         cy="50%"
//         innerRadius="60%"
//         outerRadius="80%"
//         fill="#8884d8"
//         dataKey="value"
//         isAnimationActive={isAnimationActive}
//       />
//       <Tooltip content={() => null} defaultIndex={defaultIndex} />
//     </PieChart>
//   );
// }