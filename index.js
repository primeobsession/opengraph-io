'use strict';

var _ = require('lodash'),
  request = require('request-promise');

module.exports = opengraphio;

function opengraphio (options){
  var Client;



  Client = function(options){

    // Set options for use in all requests
    this.options = _.extend({
      cacheOk: true,
      version: '1.1'
    }, options || {});

    if(!this.options.appId){
      throw 'appId must be supplied when making requests to the API.  Get a free appId by signing up here: https://www.opengraph.io/'
    }

    return this;
  };

  Client.prototype._getSiteInfoUrl = function(url, options){
    var proto = options.appId ? 'https' : 'http';

    var baseUrl = proto + '://opengraph.io/api/' + options.version + '/site/' + encodeURIComponent(url);

    return baseUrl;
  };

  Client.prototype._getSiteInfoQueryParams = function(options){
    var queryStringValues = {};

    if(options.cacheOk === false){
      queryStringValues.cache_ok = 'false';
    }

    if(options.appId){
      queryStringValues.app_id = options.appId;
    }

    return queryStringValues;
  };

  Client.prototype.getSiteInfo = function(url, options, cb){

    var opts = {};
    var callback;

    if(options && typeof(options) !== 'function'){
      opts = options;
    }
    else if(options && typeof(options) === 'function'){
      callback = options;
    }

    if(cb){
      callback = cb;
    };

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
      .then(function(results){
        if(callback){
          callback(null, results);
        }
        else{
          return results;
        }
      })
      .catch(function(err){
        if(callback){
          callback(err);
        }
        else{
          Promise.reject(err);
        }
      });
  };

  return new Client(options);
};



