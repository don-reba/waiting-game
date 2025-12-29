# The Waiting Game Source Code

The game can be played at https://waiting-game.herokuapp.com/.

## File structure

The thing to keep in mind is that the same repository is used to work on the code and upload to Heroku. This has several implications:

* There is a number of files that exist solely for Heroku, namely: Gemfile, Gemfile.lock, Procfile, and web/server/main.rb.
* The compiled TypeScript is stored in the repository at web/js/game.js. This has the added benefit of the game being usable right away.

The game code is written in TypeScript with compiler version 1.4. The source code is stored in web/src; additional libraries live in web/js; TypeScript type information can be found in web/dts. The recommended build method is using MSbuild. BuildAll.proj contains the target definitions. Building can be done from the command prompt like this:

  cd "The Walking Game"
  msbuild

## Architecture

Code is organized after the model-view-presenter (MVP) pattern. Generally:

- models manage persistent data,
- views present data in the most straightforward way,
- and presenters mediate between the two.

Presenters depend on models and views, but models do not depend on presenters or views, and views do not depend on presenters or models. Views and models are exposed to the presenters in a controlled way using interfaces.

## Coding Conventions

The coding convention largely follows the [.NET guidelines](https://msdn.microsoft.com/en-us/library/ms229042.aspx). Tabs are used for indentation.

## Running offline

The game can run completely offline — all you need is a local server. Some simple ways are to use Ruby or Python.

Once you start the local server, go to `http://127.0.0.1:8080` in your browser, and you should see the game.

### Ruby

```cmd
:: Install webrick — only needs to be done once:
gem install webrick

:: Go to the game's web folder:
cd web

:: Run the local server:
ruby ruby -run -e httpd
```

### Python

```cmd
:: Go to the game's web folder:
cd web

:: Run the local server:
py -m http.server
```
