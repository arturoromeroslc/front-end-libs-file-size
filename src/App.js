import React, { Component } from 'react'
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from 'victory';
import data from './../data.json';


console.log(data);
export default class App extends Component {
	constructor(props) {
		console.log('called', props)
		super(props)
	}

	
	render() {
		return (
			<div>
				<VictoryChart
					theme={VictoryTheme.material}
					domainPadding={20}>
					<VictoryBar
		        data={data.combined}
		        // data accessor for x values
		        x="quarter"
		        // data accessor for y values
		        y="earnings"
		      />
			  </VictoryChart> 
			</div>
		)
	}
}
