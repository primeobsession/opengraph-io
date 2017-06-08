# OpenGraph ( Node Client 1.0.0 )

[![Build Status](https://travis-ci.org/primeobsession/opengraph-io.svg?branch=master)](https://travis-ci.org/primeobsession/opengraph-io)
[![Coverage Status](https://coveralls.io/repos/github/primeobsession/opengraph-io/badge.svg)](https://coveralls.io/github/primeobsession/opengraph-io)

[OpenGraph.io](https://www.opengraph.io/) client library for [nodejs](http://nodejs.org/).   Given a URL, the client 
will make a HTTP request to OpenGraph.io which will scrape the site for OpenGraph tags.  If tags exist the tags will
be returned to you.  

Often times the appropriate tags will not exist and this is where OpenGraph.io shines.  It will
infer what the OpenGraph tags probably would be an return them to you as ```hybridGraph```.  

The ```hybridGraph``` results will always default to any OpenGraph tags that were found on the page.  If only some tags
were found, or none were, the missing tags will be inferred from the content on the page. 

For most uses, the OpenGraph.io API is free. To get a free forever key, signup at [OpenGraph.io](https://www.opengraph.io/).  

If you end up having very heavy useage, the vast majority of projects will
be totally covered using one of our inexpensive plans.  Dedicated plans are also available upon request.

**NOTE** Our free plan previously required no `appId` but was unfortunately abused.  The free plan still exists and is free forever, you will just have to create an account on [OpenGraph.io](https://www.opengraph.io/) 

## Installation

To install the OpenGraph.io client...

1. Install the NPM package

        npm install opengraph-io --save
        

## Usage

The client can be used with callbacks or promises.  Either way, to initialize the client, add the following line to top
of your code:

```js
var opengraph = require('opengraph-io')({appId: 'xxxxxx'});

// OR - supply options

var opengraph = require('opengraph-io')({appId: 'xxxxxx', cacheOk: false});

```

The options supplied to the constructor above will be applied to any requests made by the library but can be overriden 
by supplying parameters at the time of calling ``getSiteInfo``.
        
#### Using Callbacks
To get site information using callbacks, the following will work

```js

opengraph.getSiteInfo('http://news.com' , function(err, result){
   console.log('Site title is', result.hybridGraph.title);
});

// OR, with custom options for the request

opengraph.getSiteInfo('http://news.com', {cacheOk: false}, function(err, result){
   console.log('Site title is', result.hybridGraph.title);
});

```

#### Using Promises
If you are using promises, the same call will behave very similarly
 
 ```js

opengraph.getSiteInfo('http://news.com')
    .then(function(result){
      console.log('Site title is', result.hybridGraph.title);
    });

// OR, with custom options for the request

opengraph.getSiteInfo('http://news.com', {cacheOk: false})
    .then(function(result){
      console.log('Site title is', result.hybridGraph.title);
    });

```

## Support

Feel free to reach out at any time with questions or suggestions by adding to the issues for this repo or if you'd 
prefer, head over to [https://www.opengraph.io/support/](https://www.opengraph.io/support/) and drop us a line!

## License

MIT License

Copyright (c)  Opengraph.io

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.