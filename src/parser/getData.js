import { getVersions, getStatistics } from "./utils";
import shell from "shelljs";
import ora from "ora";
import _ from "lodash";
import fs from "fs";


/**
 * creates a folder to store the files in.
 * @param  {String} folder folder name to create
 */
export function createFolder(folder) {
  shell.exec(`mkdir ${ folder }`, { silent: true });
}

/**
 * call getVersions with the specific library name
 * @param  {String} libName lib name
 * @return {Promise} promise from opeing Url
 */
export function getAllVersions(libName) {
  return getVersions(`https://cdnjs.com/libraries/${libName}`);
}

/**
 * get the specifics for the library name, which means open the cdn link.
 * @param  {String} libName libName to search for
 * @param  {Array} versions Array of versions
 * @param  {[type]} spinner library Object
 * @return {Promise} call all and return promise
 */
export function getAllStats(libName, versions, spinner) {
	let me = getStatistics(libName, versions, spinner);
	console.log(me)
  return Promise.all([
    getStatistics(libName, versions, spinner)
  ])
}

/**
 * map the stats of the library into a json object.
 * @param  {String} libName [description]
 * @param  {Array} versions [description]
 * @param  {Array} reactStats the .js and .min.js versions
 * @param  {Null} reactDomStats I don't know what this does
 * @return {Object} the object that will be save to the file for that specific library
 */
export function mapStats(libName, versions, reactStats, reactDomStats) {
  return versions.map(version => {
    let libNameGz = `${libName}gz`;
    let libNameMin = `${libName}Min`;
    let libNameMinGz = `${libName}MinGz`;
    const react = _.find(reactStats, {
      version,
      name: `${libName}.js`
    });
    const reactMinified = _.find(reactStats, {
      version,
      name: `${libName}.min.js`
    });
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
  });
}

/**
 * write the json file
 * @param  {String} path name of the json file
 * @param  {Object} data the only property is combined which had the object created in mapStats function
 */
export function writeFile(path, data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2), "utf8");
}

/**
 * Start node script
 * @param  {String} libName Name of library to start searching for
 */
export function bootstrap(libName) {
  createFolder("vendor");

  const spinner = ora("Getting list of available react versions from cdnjs.com...").start();

  /*  */
  return getAllVersions(libName).then(versions => {
    spinner.text = "Getting statistics for libs...";
    getAllStats(libName, versions, spinner).then(([reactStats, reactDomStats]) => {
      spinner.text = "Finished getting statistics for libs";
      const data = mapStats(libName, versions, reactStats, reactDomStats);
      spinner.text = "Writing data.json with updated statistics for libs";
      writeFile(`data${libName}.json`, {
        combined: data
      });
      spinner.succeed();
    }).catch(error => {
      spinner.text = `Houston, we have a problem: ${ error.message }`;
      spinner.fail();
    });
  }).catch(error => {
    spinner.text = `Houston, we have a problem: ${ error.message }`;
    spinner.fail();
  });
};

var arrayOfLibs = ['ember.js', 'backbone.js', 'angular.js', 'react', 'preact', 'inferno'];
arrayOfLibs.forEach(function(libName) {
  bootstrap(libName);
})
