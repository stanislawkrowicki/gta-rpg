# GTA-RPG

## Current stack: 
[`NodeJS`](https://nodejs.org/en/), 
[`TypeScript`](https://www.typescriptlang.org/), 
[`Svelte`](https://svelte.dev/), 
[`Docker`](https://www.docker.com/), 
[`MongoDB`](https://www.mongodb.com/), 
[`Redis`](https://redis.io/), 
[`Elastic Stack`](https://www.elastic.co/elastic-stack/), 
[`RabbitMQ`](https://www.rabbitmq.com/)

## How to run?
### Clone the repository:
```shell
git clone git@github.com:stanislawkrowicki/gta-rpg.git
```

### First, you need to download all of alt:V files. To do that, you need to first install all dependencies:
```shell
pnpm i
```
#### If you don't have pnpm installed, click [here](https://pnpm.io/).

### Then, run the download task
```shell
npx gulp download
```

### Now, create an `.env` file in the root of the project and fill it in the manner of provided `.env.example`

### Run the docker containers with 
```shell
docker-compose up
```
#### If you don't have Docker installed, click [here](https://docs.docker.com/engine/install/).

### You will need to create new user for MongoDB. Get into `mongosh` with Docker Desktop or docker exec and run:
```shell
use admin
db.auth('root', 'root')
db.createUser({user: "dev", pwd: "dev", roles: [{ role: "readWrite", db: "rpg" }]})
```

### Run the watchers
```shell
npx gulp
```

### Or build the resources manually
```shell
npx gulp build
```

### Checking queues
Go to `localhost:15672` to see RabbitMQ panel. In dev mode credentials are login `guest` and password `guest`

### Checking Kibana
Go to `localhost:5601` to open Kibana panel. Then go to `Discovery` tab and create views.

### Running log consumer
Log consumer does not run with gulp. You need to start it yourself via 
```shell
node ./dist/logs-consumer/consumer.js
```