'use strict';

var _ = require('lodash'),
  request = require('request-promise');

module.exports = opengraphio;

function opengraphio(options) {
  var Client;

  /**
   * @typedef RequestOptionsExtended
   * @inheritDoc RequestOptionsSingle
   * @property {Array<RequestOptions>} [retryStrategies]
   */

  /**
   * @typedef RequestOptions
   * @property {boolean} cacheOk
   * @property {boolean} useProxy
   * @property {boolean} fullRender
   * @property {number} maxCacheAge
   * @property {boolean} acceptLang
   * @property {Array<string>} [requires] Required values to be considered successful (Only Used when you are using `retryStrategies`)
   */

  /**
   * Generate a new instance of the opengraphio class.
   *
   * @param {RequestOptions} options Options that can be forwarded to the API. All sub-requests will inherit these options.
   * @return {Object} Returns this instance of the opengraphio class.
   */
  Client = function (options) {

    // Set options for use in all requests
    this.options = _.extend({
      cacheOk: true,
      version: '1.1'
    }, options || {});

    if (!this.options.appId) {
      throw 'appId must be supplied when making requests to the API.  Get a free appId by signing up here: https://www.opengraph.io/'
    }

    return this;
  };

  /**
   * Generate the URL Required to complete the request.
   *
   * @param {string} url The URL that should be scraped.
   * @param {Object} options Options that can be forwarded to the API
   * @return {Object} Options Processed.
   */
  Client.prototype._getSiteInfoUrl = function (url, options) {
    var proto = options.appId ? 'https' : 'http';

    var baseUrl = proto + '://opengraph.io/api/' + options.version + '/site/' + encodeURIComponent(url);

    return baseUrl;
  };

  Client.prototype._getSiteInfoQueryParams = function (options) {
    var queryStringValues = {};

    // Default options
    queryStringValues.cache_ok = 'true';
    queryStringValues.use_proxy = 'false';

    if (options.cacheOk === false) {
      queryStringValues.cache_ok = 'false';
    }

    if (options.useProxy === true) {
      queryStringValues.use_proxy = 'true';
    }

    if (options.appId) {
      queryStringValues.app_id = options.appId;
    }

    if (options.fullRender === true) {
      queryStringValues.full_render = 'true'
    }

    if (options.maxCacheAge) {
      queryStringValues.max_cache_age = options.maxCacheAge;
    }


    if (options.acceptLang) {
      queryStringValues.accept_lang = options.acceptLang;
    }

    return queryStringValues;
  };

  /**
   * Connect to API and Request for only the body and the headers of the page.
   *
   * @param {String} url Website URL to Scrape
   * @param {RequestOptionsExtended} options Object list of the Options to pass to the API
   * @param {function} cb Callback to Provide the Result to the Request.
   * @return {Promise} Return from the Promise generated by Request
   */
  Client.prototype.getSiteInfo = function (url, options = {}, cb = null) {

    var opts = {};
    var callback;

    if (options && typeof (options) !== 'function') {
      opts = options;
    } else if (options && typeof (options) === 'function') {
      callback = options;
    }

    if (cb) {
      callback = cb;
    }

    if (options.retryStrategies && options.retryStrategies.length !== 0) {

      var retryStrategies = options.retryStrategies;
      var defaultOptions = _.clone(options);
      delete defaultOptions.retryStrategies;

      return retryStrategies.reduce((resultPromise, strategyOptions) => {
        var strategyOptionsCompiled = _.extend(strategyOptions, defaultOptions);

        var requires = strategyOptionsCompiled.requires;
        var retryOptions = _.clone(strategyOptionsCompiled);
        delete defaultOptions.requires;

        return resultPromise.then(state => {
          // Previous Output is a good response, skip other strategies.
          if (Object.keys(state).length > 1) {
            return state;
          }

          return this.getSiteInfo(url, retryOptions)
            .then(result => {
              // Check the requirements
              if (_.every(requires, _.partial(_.has, result))) {
                // Return the value if it matches
                return Promise.resolve(Object.assign(result, {
                  allRequests: state.allRequests
                }));
              }

              var returnData = {
                allRequests: state.allRequests
              };
              returnData.allRequests.push({
                requires,
                request: retryOptions,
                response: result
              })
              return Promise.resolve(Object.assign(state, returnData));
            })
            .catch(err => {
              var returnData = {
                allRequests: state.allRequests
              };
              returnData.allRequests.push({
                requires,
                request: retryOptions,
                response: err
              })
              return Promise.resolve(Object.assign(state, returnData));
            })

        })
      }, Promise.resolve({allRequests: []}))
        .then(results => {
          if (callback) {
            return callback(null, results);
          } else {
            return results;
          }
        });
    }

    var requestOptions = _.extend(this.options, opts);

    var baseUrl = this._getSiteInfoUrl(url, requestOptions);
    var queryStringValues = this._getSiteInfoQueryParams(requestOptions);

    var params = {
      method: 'GET',
      uri: baseUrl,
      qs: queryStringValues,
      json: true
    };

    return request(params)
      .then(function (results) {
        if (callback) {
          return callback(null, results);
        } else {
          return results;
        }
      })
      .catch(function (err) {
        if (callback) {
          return callback(err);
        } else {
          return Promise.reject(err);
        }
      });
  };

  return new Client(options);
}



