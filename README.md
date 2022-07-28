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

### Run the watchers
```shell
npx gulp
```

### Or build the resources manually
```shell
npx gulp build
```
