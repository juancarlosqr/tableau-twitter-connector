# Tableau Twitter Web Data Connector

## Web Data Connector

> With the Web Data Connector SDK, you can unlock a world of data that's available over the web. In addition to using the dozens of data connectors that are already available in Tableau, you can now create your own web data connector (WDC) that reads data from virtually any site that publishes data in JSON, XML, or HTML.

## How to use it

### Configuration

- Create a config.js file like this

```js
module.exports = {
  title: '[your_tableau_web_data_connector_title]',
  host: '[host]',    // For local environment could be '127.0.0.1'
  port: [port],    // For local environment could be 3000
  logger_env: '[morgan_logger_env]',    // For local environment is 'dev'
  session_key: '[node_session_key]',    // A very_secret_key string
  consumer_key: '[your_twitter_app_consumer_key]',
  consumer_secret: '[your_twitter_app_consumer_secret]'
}
```

### Run the server (Development)

- Run the following in the command line

```
npm install
npm run watch
```

### Tableau's Web Data Connector

- Open [http://127.0.0.1:3000](http://127.0.0.1:3000) (update this to use your config) in the Tableau's Web Data Connector

## Resources

- [https://community.tableau.com/community/developers/web-data-connectors](https://community.tableau.com/community/developers/web-data-connectors)
- [https://github.com/tableau/webdataconnector](https://github.com/tableau/webdataconnector)
- [https://dev.twitter.com/rest/reference/get/followers/list](https://dev.twitter.com/rest/reference/get/followers/list)
- [https://scotch.io/tutorials/implement-oauth-into-your-express-koa-or-hapi-applications-using-grant](https://scotch.io/tutorials/implement-oauth-into-your-express-koa-or-hapi-applications-using-grant)
- [https://scotch.io/tutorials/use-ejs-to-template-your-node-application](https://scotch.io/tutorials/use-ejs-to-template-your-node-application)
- [https://codeforgeek.com/2014/09/manage-session-using-node-js-express-4/](https://codeforgeek.com/2014/09/manage-session-using-node-js-express-4/)
- [http://css3buttongenerator.com/](http://css3buttongenerator.com/)
