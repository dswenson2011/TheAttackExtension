# The Attack Chrome Extension

## Information
This chrome extension was reworked by me (nexhunter) to turn into a more ES6 instead of ES5 version.

Webpack is being used to bundle up the resources for distribution.

Originally created by the folks over at [SixtySixten](https://sixysixten.com)

This code isn't release quality and has not been double checked by another human.

Do NOT distribute to wider masses without running through a QA process and doing full day check to ensure no memory leakage, and proper event firing during any event.

## Prerequisites
 - Node
 - NPM


## Setup Environment
In the project directory after ensuring Node and NPM are installed run `npm install` 


## Configure
In `js/config.js` extension configuration exists and should be modified to match the needs
```
const SCHEDULE_URL = 'https://sixtysixten.com/jsonData/theAttackSchedule.json';
const VOD_URL = 'https://sixtysixten.com/jsonData/theAttackVOD.json';
const GOOGLE_ANALYTIC_ID = 'UA-96454610-1';
```


## Build
Now we want to build after configuring the extension.

Run `./node_modules/.bin/webpack --config webpack.config.js` and a new directory called dist will be created with the built extension.
