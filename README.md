# SportSee

Frontend app for SportSee built with ReactJS.

## Installation

Git clone the repo, then

```
cd <project_name>
npm i
npm run dev
```

By default, the data comes from `api/mockServer.js` which mocks the express server with same response.

If you need to setup the express server in local, first git clone [this repo](https://github.com/OpenClassrooms-Student-Center/P9-front-end-dashboard) and launch it at `localhost:3000`.

Then you need to set `CALL_FROM_API = true` in `api/query.js` in the react app to get real data from the server.

## License

[MIT](https://choosealicense.com/licenses/mit/)
