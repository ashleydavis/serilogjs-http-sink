'use strict';

// Copyright 2014 Structured-Log Contributors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// UMD bolierplate based on https://github.com/umdjs/umd/blob/master/returnExports.js
// Supports node.js, AMD and the browser.
//
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.structuredLog.sink.http = factory();
    }
}(this, function() {

    var HttpSink = function (options) {

        // Argument checking.
        if (!options) {
            throw new Error("'options' parameter is required.");
        }

        if (!options.url) {
            throw new Error("'options.url' parameter is required.");
        }

        var self = this;

        var request = require('request');
        var E = require('linq');

        self.toString = function() { return 'HttpSink'; };

        self.emit = function(evts, done) {

            var processedEvents = evts
                .map(function (evt) {

                    var renderedMsg = evt.messageTemplate.render(evt.properties);

                    // Convert to properties format expected by log server.
                    var properties = E.from(Object.keys(evt.properties))
                        .select(function (propertyName) {
                            return { 
                                propertyName: propertyName,
                                propertyValue: evt.properties[propertyName],
                            };
                        })
                        .toObject(
                            function (property) {
                                return property.propertyName;
                            },
                            function (property) {
                                return {
                                    Value: property.propertyValue,
                                };
                            }
                        );

                    return {
                        Timestamp: evt.timestamp,
                        Level: evt.level,
                        MessageTemplate: evt.messageTemplate.raw,
                        RenderedMessage: renderedMsg,
                        Properties: properties,
                    };
                });

            var body = {
                Logs: processedEvents,
            };

            var requestOptions = {
                url: options.url,
                method: 'POST',
                json: body,
            };

            request(requestOptions, function (err, response, body) {
                if (err) {
                    console.error('Error posting log message');
                    console.error(err);
                }
                else {
                    console.log('Posted log message');
                    console.log(response.statusCode);
                }
                done(err);
            });

        };
    }

    return function(options) { 
        return new HttpSink(options); 
    };
}));
