<div align="center">
<img src="https://github.com/Vincenius/workout-lol/blob/main/public/logo.png?raw=true" width=25% height=25% />
<h1>Workout.lol</h1>
<h3><em>The easiest way to create a workout routine</em></h3>
<p>
<img src="https://img.shields.io/github/contributors/Vincenius/workout-lol?style=plastic" alt="Contributors">
<img src="https://img.shields.io/github/forks/Vincenius/workout-lol" alt="Forks">
<img src="https://img.shields.io/github/stars/Vincenius/workout-lol" alt="Stars">
<!-- <img src="https://img.shields.io/github/license/Vincenius/workout-lol" alt="Licence"> -->
<img src="https://img.shields.io/github/issues/Vincenius/workout-lol" alt="Issues">
<img src="https://img.shields.io/github/languages/count/Vincenius/workout-lol" alt="Languages">
<img src="https://img.shields.io/github/repo-size/Vincenius/workout-lol" alt="Repository Size">
</p>
</div>

## About
+ A small web application to create workouts based on your available equipment and the muscles you want to train.

## Link
+ You can self-host the project or use the web app on [workout.lol](https://workout.lol).

## Steps to run it locally
1. Clone the repository to your local machine <br>
   `git clone https://github.com/Vincenius/workout-lol.git`
2. Navigate to the app directory <br>
   `cd workout-lol`
3. Install the necessary dependencies <br>
   `yarn`
4. Initialize the Mongo DB by importing the dump files from `lib/dump/prod`:

   4.1 For the <COLLECTION>.metadata.json, you'll have to do this :

   `mongoimport --uri mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER_NUMBER>.<URI>.mongodb.net/<DATABASE> --collection <COLLECTION> --type json --file <FILEPATH>`

   4.2 For the <COLLECTION>.bson, you'll have to do this : 
   `mongorestore --uri mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER_NUMBER>.<URI>.mongodb.net/<DATABASE> --collection <COLLECTION> <FILEPATH>`
   
5. copy the `.env.dist` file to `.env` and set environment variables as described in the file<br>
6. Start the local development server <br>
   `npm run dev`
7. Open your browser to http://localhost:3000

## Created By
<!-- [Vincent Will](https://twitter.com/wweb_dev) -->

### Vincent Will : ![Twitter Follow](https://img.shields.io/twitter/follow/wweb_dev?style=social)
## License
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

