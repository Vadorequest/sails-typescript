# sails-typescript

An example of how to use TypeScript on the server side with Sails.js framework.

Based on EJS view engine *(default Sails view engine)*.

## Compile TS on file change
All TS files in `api/` are compiled through `grunt:ts`.

## Auto route binding from controller to view
By default, a **controller:method** will look for the

## TypeScript documentation
You can generate all documentation based on the TS files by running `grunt typedoc` which will generate a `documentation` folder at the root.

## Limitations

1. Generated files are at the same location as source files.
2. The server doesn't restart by itself when changes are made in the api/ folder, I tried using `sails-hook-autoreload` but it didn't work out.
