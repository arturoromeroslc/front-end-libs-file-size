import { getVersions, getStatistics } from "./utils";
import shell from "shelljs";
import ora from "ora";
import _ from "lodash";
import fs from "fs";

export function createFolder( folder ) {
	shell.exec( `mkdir ${ folder }`, { silent: true } );
}

export function getAllReactVersions(libName) {
	return getVersions( `https://cdnjs.com/libraries/${libName}` );
}

export function getAllStats( libName, versions, spinner ) {
	return Promise.all( [
		getStatistics( libName, versions, spinner )/*,
		getStatistics( "react-dom", versions, spinner )*/
	] )
}

export function mapStats( libName, versions, reactStats, reactDomStats ) {
	return versions.map( version => {
		let libNameGz = `${libName}gz`;
		let libNameMin = `${libName}Min`;
		let libNameMinGz = `${libName}MinGz`;
		const react = _.find( reactStats, { version, name: `${libName}.js` } );
		const reactMinified = _.find( reactStats, { version, name: `${libName}.min.js` } );
		/*const reactDom = _.find( reactDomStats, { version, name: "react-dom.js" } );*/
		/*const reactDomMinified = _.find( reactDomStats, { version, name: "react-dom.min.js" } );*/
		return {
			version,
			[libName]: react.size ? react.size : 0,
			[libNameGz]: react.sizeGzipped ? react.sizeGzipped : 0,
			[libNameMin]: reactMinified ? reactMinified.size : 0,
			[libNameMinGz]: reactMinified ? reactMinified.sizeGzipped : 0,
			// reactDom: reactDom ? reactDom.size : 0,
			// reactDomMin: reactDomMinified ? reactDomMinified.size : 0
		};
	} );
}

export function writeFile( path, data ) {
	fs.writeFileSync( path, JSON.stringify( data, null, 2 ), "utf8" );
}

export function bootstrap(libName) {
	/* Creates vendor folder */
	createFolder( "vendor" );

	const spinner = ora( "Getting list of available react versions from cdnjs.com..." ).start();
	
	/* calls get React Versions, which calls getVersions which opens the url and wraps it in cherrio it then gets all 
	of the versions of react */
	return getAllReactVersions(libName).then( versions => {
		spinner.text = "Getting statistics for libs...";
		getAllStats( libName, versions, spinner ).then( ( [ reactStats, reactDomStats ] ) => {
			spinner.text = "Finished getting statistics for libs";
			const data = mapStats( libName, versions, reactStats, reactDomStats );
			spinner.text = "Writing data.json with updated statistics for libs";
			writeFile( `data${libName}.json`, { combined: data } );
			spinner.succeed();
		} ).catch( error => {
			spinner.text = `Houston, we have a problem: ${ error.message }`;
			spinner.fail();
		} );
	} ).catch( error => {
		spinner.text = `Houston, we have a problem: ${ error.message }`;
		spinner.fail();
	} );
};

var arrayOfLibs = ['ember.js', 'backbone.js', 'angular.js', 'react', 'preact', 'inferno'];
arrayOfLibs.forEach(function(libName) {
	bootstrap(libName);
})
