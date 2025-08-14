## code flow showd in graph

- https://app.eraser.io/workspace/kiTRUaytr8fJjmfPj3PQ

## setup backend

- install package.json file : npm init -y
- correction or add & update these things in package.json

```json
{
  "main": "src/server.js",
  "scripts": {
    "dev": "nodemon src/server.js"
  },
  "dependencies": {
    "bcryptjs": "^3.0.2",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.5",
    "dotenv": "^16.5.0",
    "express": "^4.21.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.13.2",
    "stream-chat": "^8.60.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.9"
  }
}
```

- npm install : install all dependencies, devDependencies which we include in json file
- backend > src > server.js : create src folder inside backend folder and create server.js file inside src folder as we mention in package.json file entry point will be src/server.js

- setup express app :
  [Doc](https://expressjs.com/)

- setUp mongodb

```
mongoose docs: https://mongoosejs.com/
mongodb atlas : platform to store data on cloud
```

- optimize our code base file
- setup stream : `set stream_api_key and stream_server_key to .env file that's it in setuping stream this will get when we login in or sign in stream platform and createt our project`

- etc
