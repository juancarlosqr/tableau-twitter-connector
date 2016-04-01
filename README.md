# Tableau Twitter Web Data Connector

## Web Data Connector

> With the Web Data Connector SDK, you can unlock a world of data that's available over the web. In addition to using the dozens of data connectors that are already available in Tableau, you can now create your own web data connector (WDC) that reads data from virtually any site that publishes data in JSON, XML, or HTML.

## Running scripts

- Create a config.js file like this

```js
module.exports = {
  host: '127.0.0.1',
  port: 3000,
  logger_env: '[logger_env]',
  session_key: '[session_key]',
  consumer_key: '[consumer_key]',
  consumer_secret: '[consumer_secret]',
  screen_name: '[screen_name]',
  access_token: '[access_token]',
  access_secret: '[access_secret]'
}
```

### How to run the server

- Run the following in the command line

```
npm install
npm start
```

- Open [http://127.0.0.1:3000](http://127.0.0.1:3000) in the browser

### How to run the social query

- Run the following in the command line

```
npm install
npm run social
```

## Resources

- [https://community.tableau.com/community/developers/web-data-connectors](https://community.tableau.com/community/developers/web-data-connectors)
- [https://github.com/tableau/webdataconnector](https://github.com/tableau/webdataconnector)
- [https://dev.twitter.com/rest/reference/get/followers/list](https://dev.twitter.com/rest/reference/get/followers/list)
- [https://scotch.io/tutorials/implement-oauth-into-your-express-koa-or-hapi-applications-using-grant](https://scotch.io/tutorials/implement-oauth-into-your-express-koa-or-hapi-applications-using-grant)
