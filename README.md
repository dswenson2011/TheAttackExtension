# The Attack Chrome Extension
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
const GOOGLE_ANALYTIC_ID = '';
const TWITCH_ID = 'iy3jp26zt4mxzihp5m5dxxzc4c198q';
```


## Build
Now we want to build after configuring the extension.
Run `./node_modules/.bin/webpack --config webpack.config.js` and a new directory called dist will be created with the built extension.
