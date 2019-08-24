# arbitrage

Project has a server scraping/fetching data from exchanges and a react app that serves a UI.

## Server

### Installation 

```
$ cd arbitrage
$ npm install
```

### Configuration Keys

The server uses a .env file to store keys and other runtime configurations; Store the following in a `.env` file inside the root directory.

```
PORT=9999
BITBNS_API_KEY='<YOUR API KEY FROM BITBNS>'
BITBNS_SECRET_KEY='<YOUR API SECRET FROM BITBNS'
```

### Running the server

```
$ npm run start
```

## UI


### Installation 

```
$ cd arbitrage/ui
$ npm install
```

### Running the server

```
$ npm run start
```
