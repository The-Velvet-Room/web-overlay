web-overlay
===========

OBS's built-in overlay tools are too easy, so why not run a node.js app?

For best results, use with the [CLR Browser Source plugin](https://obsproject.com/forum/resources/clr-browser-source-plugin.22/) for OBS.

How to run
==========
1. Make sure you have [node.js](http://nodejs.org/) and [Redis](http://redis.io) installed. Windows users will probably want to download it from [MSOpenTech](https://github.com/MSOpenTech/redis/releases) and follow [these steps](http://stackoverflow.com/questions/6476945/how-do-i-run-redis-on-windows/24046565#24046565).

2. Clone the repo change directory to the repo's root.

3. Run `npm install`.

4a. Mac/Linux: Run `DEBUG=web-overlay bin/www` to start the project. 

4b. Windows: Download the latest version at https://github.com/rgl/redis/downloads. You will have to start the service manually the first time, but it will start up on boot afterward. 