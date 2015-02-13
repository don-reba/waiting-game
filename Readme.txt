The Waiting Game Source Code
============================

File structure
--------------

The thing to keep in mind is that the same repository is used to work on the code and upload to Heroku. This has several implications:

* There is a number of files that exist solely for Heroku, namely: Gemfile, Gemfile.lock, Procfile, and web/server/main.rb.
* The compiled TypeScript is stored in the repository at web/js/game.js. This has the added benefit of the game being usable right away.

The game code is written in TypeScript with compiler version 1.4. The source code is stored in web/src; additional libraries live in web/js; TypeScript type information can be found in web/dts. The recommended build method is using MSbuild. BuildAll.proj contains the target definitions. Building can be done from the command prompt like this:

  cd "The Walking Game"
  msbuild

Architecture
------------

Code is organized after the model-view-presenter (MVP) pattern. Generally,

* models manage persistent data,
* views present data in the most straightforward way,
* and presenters mediate between the two.

Presenters depend on models and views, but models do not depend on presenters or views, and views do not depend on presenters or models. Views and models are exposed to the presenters in a controlled way using presenters. This will also allow us to add unit tests easily, if needed.

Coding Conventions
------------------

We largely follow the .NET guidelines: https://msdn.microsoft.com/en-us/library/ms229042.aspx . Tabs shall be used for indentation.
