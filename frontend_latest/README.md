# Otwarte Dane 2025 Frontend App

## Installation

Recommended node and npm versions 
- node > 20.10.0
- npm > 10.9.2

Main installation script is simply `npm install`. Other commands are optional, in case you need 
Angular CLI for code generation or your Node Package Manager is outdated. Check your version 
with `npm --version` command.  

```shell
# Global installations are optional
npm install -g npm@latest
npm install -g @angular/cli
 
npm install
./create-env.sh
```

### Start application locally

If you run application for the first time you need to build the app.

```shell
npm run build
```

To run your application locally, all you need to run is npm script. Script definition can be 
found inside `package.json`.

```shell
npm run start-local
```

### Building application for production 

There are multiple scripts that builds frontend application, however only one of them creates 
final production release code.    

```shell
npm run build:prod
```


### API Proxy settings

Local frontend application does not serve API. Instead, frontend uses proxy to redirect request to running API instance. 
Proxy settings are stored in `proxy.conf.json` file. This file is used when frontend is run on localhost with `npm run start`. 
Change the `target` path if you want services to refer to different API address. You can copy, rename and change `proxy.conf.json` file contents according to your needs.

Usage:
Run local environment with local backend
```shell
npm run start-local 
```
Run local environment with dev backend
```shell
npm run start-dev
```
Run local environment with int backend
```shell
npm run start-int
```
Run local environment with preprod backend
```shell
npm run start-preprod
```

Proxy options:
- `target` - what is the target domain for that path
- `pathRewrite` - this option allows you to change parts of your local url to match API urls
- `secure` - determines if https requests are secure and signed with known authority, leave `false` for self-signed ssl certificates
- `logLevel` - verbosity of proxy server in your command line tool
- `changeOrigin` - important setting for cross origin calls, needs to stay `true` unless frontend and backend are served on the same domain

for example if your API stands on ```localhost:8000```, you need change `target` for `/api` in `proxy.conf.json` file, for your cms you need 
do the same; change `target` for `/cms` (in this example is `localhost:8001`).

Example `proxy.conf.json` file:
```shell
{
    "/api/**": {
        "target": "http://localhost:8000",
        "secure": false,
        "pathRewrite": {
            "^/api": ""
        },
        "logLevel": "debug",
        "changeOrigin": true
    },
    "/media": {
        "target": "http://localhost:8000",
        "secure": false,
        "logLevel": "debug",
        "changeOrigin": true
    },
    "/flags": {
        "target": "https://dane.gov.pl/",
        "secure": false,
        "logLevel": "debug",
        "changeOrigin": true
    },
    "/cms": {
        "target": "https://localhost:8001",
        "secure": false,
        "logLevel": "debug",
        "changeOrigin": true,
        "pathRewrite": {
            "^/cms": ""
        }
    }
}
```

### Creating environment file

Environment file contains information about last build and last commit hash number, 
and looks like this:

**env.json**
```json
{
    "COMMIT_HASH":"826df9e2",
    "COMMIT_DATE":"10-10-2018 10:10:10"
}

```

You can create this file manually or simply run following script:

```shell
# Linux only command 
chmod +x create_env.sh

# Linux or Git Bash
./create-env.sh

# Windows CMD or PowerShell (double click might not work)
create-env.bat
```

If you want to get last commits hash, you can also run 
```
git rev-parse --short=8 HEAD
```
