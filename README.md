# OpenGraph ( Node Client 1.0.0 )

[OpenGraph.io](https://www.opengraph.io/) client library for [nodejs](http://nodejs.org/).   Given a URL, the client 
will make a HTTP request to OpenGraph.io which will scrape the site for OpenGraph tags.  If tags exist the tags will
be returned to you.  

Often times the appropriate tags will not exist and this is where OpenGraph.io shines.  It will
infer what the OpenGraph tags probably would be an return them to you as ```hybridGraph```.  

The ```hybridGraph``` results will always default to any OpenGraph tags that were found on the page.  If only some tags
were found, or none were, the missing tags will be inferred from the content on the page. 

For most uses, the OpenGraph.io API is free.  If you end up having very heavy useage, the vast majority of projects will
be totally covered using one of our inexpensive plans.  Dedicated plans are also available upon request.

## Installation

To install the OpenGraph.io client...

1. Install the NPM package

        npm install opengraph-io --save
        

## Usage

The client can be used with callbacks or promises.  Either way, to initialize the client, add the following line to top
of your code:

```js
var opengraph = require('opengraph-io')();

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
