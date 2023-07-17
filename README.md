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

- A small web application to create workouts based on your available equipment and the muscles you want to train.

## Link

- You can self-host the project or use the web app on [workout.lol](https://workout.lol).

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

## Steps to run it with docker
1. Clone the repository to your local machine <br>
   `git clone https://github.com/Vincenius/workout-lol.git`
2. Copy the `.env.docker` file to `.env` and set environment variables as described in the file (do not modify the `MONGODB_URI` if you wish to use the mongodb container) <br>
3. Run the docker compose file at the root of the project <br>
   `docker compose -f docker/docker-compose.yml up -d --build`
4. Wait for the applications to be up (`docker ps` to get the status) <br>
5. Open your browser to http://localhost:3000

## Contributors

[![wweb_dev](https://github-production-user-asset-6210df.s3.amazonaws.com/43953403/248202602-f81b0cf6-1394-4ab8-8ddf-4352bd8dbe7d.jpg)](https://twitter.com/wweb_dev)
[![BradiceanuM](https://github-production-user-asset-6210df.s3.amazonaws.com/43953403/248202501-4d5ae3c3-b83b-4a2c-b7e2-0e38705f5487.jpg)](https://twitter.com/BradiceanuM)
[![ngthuongdoan](https://github-production-user-asset-6210df.s3.amazonaws.com/43953403/251365548-f713917f-93f9-416b-af75-24bfed8dd2f5.jpg)](https://github.com/ngthuongdoan)

## Supporters

| [![medecau](https://github-production-user-asset-6210df.s3.amazonaws.com/43953403/252555917-a6ef8d46-c9ec-46c9-9fff-bdbf3653ddaa.png)](https://ko-fi.com/C1C7RPVB) | [![EL](https://github-production-user-asset-6210df.s3.amazonaws.com/43953403/252555938-e0cd7e03-27da-4b10-8e68-e1060dd05e02.jpg)](https://ko-fi.com/S6S3169OG) | ![alvaro](https://github.com/Vincenius/workout-lol/assets/43953403/f476691e-3739-4a22-8692-a9b33a92a94a) | [![devjev](https://github-production-user-asset-6210df.s3.amazonaws.com/43953403/252653717-455dc7f8-e5c7-448d-835e-f87c27f0423c.png)](https://github.com/devjev) |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| medecau                                                                                                                                                            | EL                                                                                                                                                             | alvaro                                                                                                   | devjev                                                                                                                                                           |

Become a supporter by donating on Ko-Fi:

[https://ko-fi.com/workout_lol](https://ko-fi.com/workout_lol)

## Public Metrics

💸 [Cost Breakdown](https://docs.google.com/spreadsheets/d/1BeSvsyMg2c1Fz7RAyO2AC3g_12JAGNLaepGFbN_aYOo/edit#gid=0)

📈 [Analytics](https://analytics.vincentwill.com/share/js1wXvxU/Workout.lol)

## License

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
