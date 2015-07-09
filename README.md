# sails-typescript

An example of how to use TypeScript on the server side with Sails.js framework.

Based on EJS view engine *(default Sails view engine)*.

## Getting started

Assuming node, npm, sails are installed.
*You may need to install `npm install -g tsd`*

1. Clone the repo
2. Run `npm install`
3. Run `grunt` (will generate all .js file from ts, you can't start up sails before doing that)
4. Run `sails lift`
5. Go to `http://localhost:1337/`

http://localhost:1337/

http://localhost:1337/help

http://localhost:1337/dashboard

http://localhost:1337/dashboard/user

## Features

### Compile TS on file change
All TS files in `api/` are compiled through `grunt:ts`. Just run `grunt` will launch a TS watcher.

### Following Rails's way for method names
By default several actions are available for all controllers:

- index
- show
- new
- edit


- create
- edit
- update
- destroy

These actions are automatically available from the browser without any configuration. But if you want to add more you'll have to explicitely export them. See `Home.ts:help` action.

The initial goal was to avoid sharing protected/private methods with the client.

By default, all these listed methods are available but aren't implemented and will throw a 404 if called. :)

### Auto route binding from controller to view
By default, a **controller:method** will look for the `views/$controller/$method` used, but it is customizable.

### Multi level controller
It is possible to have subfolders within controllers with auto route binding following the same conventions as previously. Note that you may need to add a custom route as well. (config/routes.js)

### Flash messages from controller
It is possible to send flash messages (messages that will be displayed only once) from any controller using `req.flash('messages', 'Your message');`. It is really simple yet, but you could send an object rather than a simple message to configure Materialize.Toast options.
(it relies on Materialize.Toast for now, but use what you want)

### TypeScript documentation
You can generate all documentation based on the TS files by running `grunt typedoc` which will generate a `documentation` folder at the root. Just open the index.html from the browser and enjoy.

## Limitations

1. Generated files are at the same location as source files.
2. The server doesn't restart by itself when changes are made in the api/ folder, I tried using `sails-hook-autoreload` but it didn't work out.
3. This isn't a plugin, it is a whole new way to use controller in a OOP way. You will need to add it manually into your sails project.
4. This isn't done, feel free to propose features, I use it on my own projects and it may eventually end up updated on this repo as well. :)


## Licensing
This relates on a lot of open source node packages and is under MIT license, feel free to use it/modify/sell/whatever.
