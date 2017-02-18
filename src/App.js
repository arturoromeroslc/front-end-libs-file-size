import React, { Component } from 'react'
import { VictoryGroup, VictoryChart, VictoryAxis, VictoryTheme, VictoryBar } from 'victory';
import {BarChart} from 'react-d3-components';
import data from './../data.json';


console.log(BarChart);
export default class App extends Component {
	constructor(props) {
		console.log('called', props)
		super(props)
	}
	
	render() {
		return (
			<div>
				<BarChart
          groupedBars
          data={data.combined}
          width={400}
          height={400}
          margin={{top: 10, bottom: 50, left: 50, right: 10}}
        />
				<VictoryChart>
					<VictoryGroup>
					  <VictoryBar name="bar-1"
					    data={[{x: data.combined[0].values[0].x, y: data.combined[0].values[0].y}, {x: data.combined[1].values[0].x, y: data.combined[1].values[0].y}, {x: data.combined[2].values[0].x, y: data.combined[2].values[0].y}]}
					  />
					  <VictoryBar name="bar-2"
					    data={[{x: data.combined[0].values[1].x, y: data.combined[0].values[1].y}, {x: data.combined[1].values[1].x, y: data.combined[1].values[1].y}, {x: data.combined[2].values[1].x, y: data.combined[2].values[1].y}]}
					  />
					  <VictoryBar name="bar-3"
					    data={[{x: data.combined[0].values[3].x, y: data.combined[0].values[3].y}, {x: data.combined[1].values[3].x, y: data.combined[1].values[3].y}, {x: data.combined[2].values[3].x, y: data.combined[2].values[3].y}]}
					  />
					</VictoryGroup>
				</VictoryChart>
			</div>
		)
	}
}
