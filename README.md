# SportSee

Frontend app for SportSee built with React and D3 graphs.

## Installation

Git clone this repo, then

```
cd <project_name>
npm i
npm run dev
```

By default, data comes from `mock/server.js` which mocks the Express server responses.

### Setup with Express server

If you need to setup the express server locally, first git clone [this repo](https://github.com/OpenClassrooms-Student-Center/P9-front-end-dashboard) and launch it at `localhost:3000`.

Then you need to give the API url to `UserService` instance in `pages/User.jsx` (in our React app) in order to get data directly from the server.

## JSDoc

```
npm run doc
```

Then you can access the docs generated at http://localhost:5500/docs/index.html
