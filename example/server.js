
var structuredLog = require('structured-log-dev');
var consoleSink = require('structured-log-dev/console-sink');
var httpSink = require('../structured-log-http-sink');

var log = structuredLog.configure()
	.writeTo(httpSink({ url: 'http://localhost:3000/log' }))
    .create();

log.info('Hello this is some information.');

log.warn('This is a warning.');

log.error('This is an error.');

log.flush(function () {
	console.log('Flushed!');
});

console.log('Finished');
