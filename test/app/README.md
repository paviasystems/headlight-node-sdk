# Headlight Node SDK Sample

This is a sample app using the Headlight Node SDK.

The folder `headlight-app` is all that is required to create a simple plug-in App for Headlight.  A small set of templates are used to manage content in the page.

### Getting Started

1. Check out the repository (e.g. with `git clone https://github.com/paviasystems/headlight-node-sdk-sample`)
2. Make sure you have the dependency libraries installed, and a recent version of node (4.x + please)
3. Go to the folder you checked this out in
4. Install the dependencies (by running `npm install` from the project folder)
5. Build the staged site and assets (by running `gulp build-debug`)
6. Run the server (by running `npm start`)

You can keep running `gulp build-debug` while the server is running to rebuild the site.  The changes are live as soon as you run that command.

### Setting up your Node environment to run this

The build chain requires a global module to be installed, gulp.  You can do this by running:

```npm install gulp```

### If you are running this in Cloud9

Remember to set your node enviroment to a modern version of node.  You can do this by running the following in the terminal:

```
nvm use 5.8
nvm alias default 5.8
```

*It is important that you do this before* installing the global node modules or the local node modules.