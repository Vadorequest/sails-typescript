# sails-typescript

An example of how to use TypeScript on the server side with Sails.js framework.

Based on EJS view engine *(default Sails view engine)*.

## Compile TS on file change
All TS files in `api/` are compiled through `grunt:ts`.

## Auto route binding from controller to view
By default, a **controller:method** will look for the `views/$controller/$method` used, but it is customizable.

## Multi level controller
It is possible to have subfolders within controllers with auto route binding following the same conventions as previously. Note that you may need to add a custom route as well. (config/routes.js)

## TypeScript documentation
You can generate all documentation based on the TS files by running `grunt typedoc` which will generate a `documentation` folder at the root. Just open the index.html from the browser and enjoy.

## Limitations

1. Generated files are at the same location as source files.
2. The server doesn't restart by itself when changes are made in the api/ folder, I tried using `sails-hook-autoreload` but it didn't work out.
3. This isn't a plugin, it is a whole new way to use controller in a OOP way. You will need to add it manually into your sails project.
4. This isn't done, feel free to propose features, I use it on my own projects and it may eventually end up updated on this repo as well. :)


## Licensing
This relates on a lot of open source node packages and is under MIT license, feel free to use it/modify/sell/whatever.
