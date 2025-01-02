### Setup

```
cd backend
npm install
```

`npm run build` to build the project.

`npm run start` to start the server from build, i.e from `dist` folder.

`npm run dev` to start the server with `ts-node-dev`, which watches over the `src` directory and has hot-reloading, it builds the project once when you run the command but if you save any changes in `server.ts` it'll not run the build again, it will only watch for new changes.
