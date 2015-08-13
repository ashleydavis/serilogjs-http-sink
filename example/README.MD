# structured-log NodeJS HTTP Sink Example

This examples shows usage of the structured-log NodeJS http sink.

To run you first need to have [NodeJS](https://nodejs.org/) installed.

To check the output of this sink you'll need to have a HTTP server running to accept the logs via HTTP POST. You can either roll your own or maybe use [this one](https://github.com/Real-Serious-Games/LogServer) as a starting point.

The change directory to where the example is (where this *readme* is): 

	cd example

You may have to npm install dependencies:

	npm install	

Then run the script using NodeJS:

	node server.js

Now check your log server or log viewer for logs!