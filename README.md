# OpenGraph ( Node Client 3.1.0 )

[![Build Status](https://travis-ci.org/primeobsession/opengraph-io.svg?branch=master)](https://travis-ci.org/primeobsession/opengraph-io)
[![Coverage Status](https://coveralls.io/repos/github/primeobsession/opengraph-io/badge.svg)](https://coveralls.io/github/primeobsession/opengraph-io)

[OpenGraph.io](https://www.opengraph.io/) client library for [nodejs](http://nodejs.org/). Given a URL, the client 
will make a HTTP request to OpenGraph.io which will scrape the site for OpenGraph tags. If tags exist the tags will
be returned to you. 


If some tags are missing, the client will attempt to infer them from the content on the page, and these inferred tags will be returned as part of the  ```hybridGraph```. 

The ```hybridGraph``` results will always default to any OpenGraph tags that were found on the page.  If only some tags
were found, or none were, the missing tags will be inferred from the content on the page. 

To get a free forever key, signup at [OpenGraph.io](https://www.opengraph.io/).  

The vast majority of projects will be totally covered using one of our inexpensive plans.  
Dedicated plans are also available upon request.


## Installation

To install the OpenGraph.io client...

1. Install the NPM package

        npm install opengraph-io --save
        

## Usage

The library provides an OpenGraphIO class that you can instantiate with the required options. Here's an example:

```js
// With Require
const { OpenGraphIO } = require('opengraph-io');
// Or with Import
import { OpenGraphIO } from 'opengraph-io';

const options = {
  appId: 'YOUR_APP_ID', // This is your OpenGraph.io App ID and Required.  Sign up for a free one at https://www.opengraph.io/
  autoProxy: true, // Defaulted to true, OpenGraph.io keeps a list of sites that require a proxy to be accessed. This will automatically route those requests through the necessary proxy. 
  service: 'site', // We currently have three services: site, extract, and scrape. Site will be the default
  cacheOk: true, // If a cached result is available, use it for quickness
  useProxy: false,  // Proxies help avoid being blocked and can bypass capchas
  maxCacheAge: 432000000, // The maximum cache age to accept
  acceptLang: 'en-US,en;q=0.9', // Language to present to the site. 
  fullRender: false // This will cause JS to execute when rendering to deal with JS dependant sites
};

const ogClient = new OpenGraphIO(options);

```
The options shown above are the default options.  To understand more about these parameters, please view our documentation at: https://www.opengraph.io/documentation/ 

The options supplied to the constructor above will be applied to any requests made by the library but can be overridden 
by supplying parameters at the time of calling ``getSiteInfo``.
        
### Retrieving Open Graph Data
To retrieve Open Graph data for a specific URL, you can use the getSiteInfo method. It returns a Promise that resolves to the Open Graph data.

```js

const url = 'https://www.example.com';

ogClient.getSiteInfo(url)
  .then((data) => {
    // Handle the Open Graph data
    console.log(data);
  })
  .catch((error) => {
    // Handle errors
    console.error(error);
  });


```

#### Using Async Await
If you are using async await, the same call will behave very similarly
 
 ```js

async function fetchOpenGraphData(url) {
  try {
    const data = await ogClient.getSiteInfo(url);
    // Handle the Open Graph data
    console.log(data);
  } catch (error) {
    // Handle errors
    console.error(error);
  }
}

// OR, with custom options for the request

async function fetchOpenGraphDataWithProxy(url) {
  const options = {
    useProxy: true,
    cacheOk: false
  }
    try {
        const data = await ogClient.getSiteInfo(url, options);
        // Handle the Open Graph data
        console.log(data);
    } catch (error) {
        // Handle errors
        console.error(error);
    }
}

```

### OpenGraphIO Services
Service Options: `site`, `extract`, `scrape`

#### Site Service
Unleash the power of our Unfurling API to effortlessly extract Open Graph tags from any URL.

##### Options

| Parameter   | Required | Example             | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
|-------------|----------|---------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| appId       | yes      | -                   | The API key for registered users. Create an account (no cc ever required) to receive your `app_id`.                                                                                                                                                                                                                                                                                                                                                                                                                         |
| cacheOk     | no       | false               | This will force our servers to pull a fresh version of the site being requested. By default, this value is true.                                                                                                                                                                                                                                                                                                                                                                                                            |
| autoProxy   | no       | true                |  OpenGraph.io keeps a list of sites that require a proxy to be accessed. This will automatically route those requests through the necessary proxy.                                                                                                                                                                                                                                                                                                                                                                          |
| fullRender  | no       | false               | This will fully render the site using a chrome browser before parsing its contents. This is especially helpful for single page applications and JS redirects. This will slow down the time it takes to get a response by around 1.5 seconds.                                                                                                                                                                                                                                                                                |
| useProxy    | no       | false               | Route your request through residential and mobile proxies to avoid bot detection. This will slow down requests 3-10 seconds and can cause requests to time out. NOTE: Proxies are a limited resource and expensive for our team maintain. Free accounts share a small pool of proxies. If you plan on using proxies often, paid accounts provide dedicated concurrent proxies for your account.                                                                                                                             |
| maxCacheAge | no       | 432000000           | This specifies the maximum age in milliseconds that a cached response should be. If not specified, the value is set to 5 days. (5 days * 24 hours * 60 minutes * 60 seconds * 1000ms = 432,000,000 ms)                                                                                                                                                                                                                                                                                                                      |
| acceptLang  | no       | en-US,en;q=0.9 auto | This specifies the request language sent when requesting the URL. This is useful if you want to get the site for languages other than English. The default setting for this will return an English version of a page if it exists. Note: if you specify the value auto, the API will use the same language settings as your current request. For more information on what to supply for this field, please see: [Accept-Language - MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language) |


#### Extract Service
The extract endpoint enables you to extract information from any website by providing its URL. With this endpoint, you can extract any element you need from the website, including but not limited to the title, header elements (h1 to h5), and paragraph elements (p).

##### Options

| Parameter     | Required | Example             | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
|---------------|----------|---------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| appId         | yes      | -                   | The API key for registered users. Create an account (no cc ever required) to receive your `app_id`.                                                                                                                                                                                                                                                                                                                                                                                    |
| htmlElements  | no       | h1,h2,p             | This is an optional parameter and specifies the HTML elements you want to extract from the website. The value should be a comma-separated list of HTML element names. If this parameter is not supplied, the default elements that will be extracted are h1, h2, h3, h4, h5, p, and title.                                                                                                                                                                                             |
| autoProxy     | no       | true                |  OpenGraph.io keeps a list of sites that require a proxy to be accessed. This will automatically route those requests through the necessary proxy.                                                                                                                                                                                                                                                                                                                                     |
| cacheOk       | no       | false               | This will force our servers to pull a fresh version of the site being requested. By default, this value is true.                                                                                                                                                                                                                                                                                                                                                                       |
| fullRender    | no       | false               | This will fully render the site using a chrome browser before parsing its contents. This is especially helpful for single page applications and JS redirects. This will slow down the time it takes to get a response by around 1.5 seconds.                                                                                                                                                                                                                                           |
| useProxy      | no       | false               | Route your request through residential and mobile proxies to avoid bot detection. This will slow down requests 3-10 seconds and can cause requests to time out. NOTE: Proxies are a limited resource and expensive for our team maintain. Free accounts share a small pool of proxies. If you plan on using proxies often, paid accounts provide dedicated concurrent proxies for your account.                                                                                        |
| maxCacheAge   | no       | 432000000           | This specifies the maximum age in milliseconds that a cached response should be. If not specified, the value is set to 5 days. (5 days * 24 hours * 60 minutes * 60 seconds * 1000ms = 432,000,000 ms)                                                                                                                                                                                                                                                                                 |
| acceptLang    | no       | en-US,en;q=0.9 auto | This specifies the request language sent when requesting the URL. This is useful if you want to get the site for languages other than English. The default setting for this will return an English version of a page if it exists. Note: if you specify the value auto, the API will use the same language settings as your current request. For more information on what to supply for this field, please see: [Accept-Language - MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language) |


#### Scrape Service

Just need the raw HTML?
The Scrape Site endpoint is used to scrape the HTML of a website given its URL

##### Options

| Parameter     | Required | Example             | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
|---------------|----------|---------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| appId         | yes      | -                   | The API key for registered users. Create an account (no cc ever required) to receive your `app_id`.                                                                                                                                                                                                                                                                                                                                                                                    |
| cacheOk       | no       | false               | This will force our servers to pull a fresh version of the site being requested. By default, this value is true.                                                                                                                                                                                                                                                                                                                                                                       |
| autoProxy     | no       | true                |  OpenGraph.io keeps a list of sites that require a proxy to be accessed. This will automatically route those requests through the necessary proxy.                                                                                                                                                                                                                                                                                                                                     |
| fullRender    | no       | false               | This will fully render the site using a chrome browser before parsing its contents. This is especially helpful for single page applications and JS redirects. This will slow down the time it takes to get a response by around 1.5 seconds.                                                                                                                                                                                                                                           |
| useProxy      | no       | false               | Route your request through residential and mobile proxies to avoid bot detection. This will slow down requests 3-10 seconds and can cause requests to time out. NOTE: Proxies are a limited resource and expensive for our team maintain. Free accounts share a small pool of proxies. If you plan on using proxies often, paid accounts provide dedicated concurrent proxies for your account.                                                                                        |
| maxCacheAge   | no       | 432000000           | This specifies the maximum age in milliseconds that a cached response should be. If not specified, the value is set to 5 days. (5 days * 24 hours * 60 minutes * 60 seconds * 1000ms = 432,000,000 ms)                                                                                                                                                                                                                                                                                 |
| acceptLang    | no       | en-US,en;q=0.9 auto | This specifies the request language sent when requesting the URL. This is useful if you want to get the site for languages other than English. The default setting for this will return an English version of a page if it exists. Note: if you specify the value auto, the API will use the same language settings as your current request. For more information on what to supply for this field, please see: [Accept-Language - MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language) |

### Using Retry Strategies

*NOTE: each retry will be counted as an additional request based on the paramters for that request*

With retry strategies you can define properties you require to be populated (e.g. title or description) and also provide the strategies in the order you would like them to be attempted.
The client will work through the strategies until the `requires`
parameter list is satisfied. 

Key points to know is this is a
- Note that all requests made are returned using an element of *result* named `allRequests`.
- You must provide `requires` as a parameter of *option*, it's used to define what values you want back to consider it a "good" response.

The example below will execute as follows:
- Make a normal request for this url.
- If the previous request did not return the `openGraph.title` field, it will make a request using full javascript rendering
- If the previous request did not return the `openGraph.title` field, it will make a request using our proxy service

If all retry strategies have failed the requirements specified in `requires` then it will return the last  
 request made.

```js
const options = {
  appId: 'YOUR_APP_ID', // This is your OpenGraph.io App ID and Required.  Sign up for a free one at https://www.opengraph.io/
  cacheOk: false,
  retryStrategies: [
    {
      // Requests using the default options.
      requires: ["openGraph.title"]
    },
    {
      // Make a full request to full render
      fullRender: true,
      requires: ["openGraph.title"]
    },
    {
      // Make a request using the proxy
      useProxy: true,
      requires: ["openGraph.title"]
    }
  ]
};

const ogClient = new OpenGraphIO(options);

opengraph.getSiteInfo('https://www.newegg.com/Product/Product.aspx?Item=N82E16813157762')
    .then(function(result){
      console.log('Site title is', result.hybridGraph.title);
    });
````

If you only need retry strategies for a single request, you can also pass them in as a parameter to the request.

```js
const options = {
  appId: 'YOUR_APP_ID', // This is your OpenGraph.io App ID and Required.  Sign up for a free one at https://www.opengraph.io/
  cacheOk: false,
};

const ogClient = new OpenGraphIO(options);

const retryStrategies =  [
  {
    // Requests using the default options.
    requires: ["hybridGraph.title"]
  },
  {
    // Make a full request to full render
    fullRender: true,
    requires: ["hybridGraph.title"]
  },
  {
    // Make a request using the proxy
    useProxy: true,
    requires: ["hybridGraph.title"]
  }
]

opengraph.getSiteInfo('https://www.newegg.com/Product/Product.aspx?Item=N82E16813157762', { retryStrategies })
    .then(function(result){
      console.log('Site title is', result.hybridGraph.title);
    });
````



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
