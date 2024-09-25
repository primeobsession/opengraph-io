import _ from 'lodash';
import axios from 'axios';

export class OpenGraphIO {
  constructor(options) {
    this.options = _.extend(
      {
        cacheOk: true,
        service: 'site',
        version: '1.1',
        autoProxy: true,
      },
      options || {}
    );

    if (!this.options.appId) {
      throw new Error(
        'appId must be supplied when making requests to the API. Get a free appId by signing up here: https://www.opengraph.io/'
      );
    }
  }

  getSiteInfoUrl(url) {
    const proto = this.options.appId ? 'https' : 'http';

    return `${proto}://opengraph.io/api/${this.options.version}/${this.options.service}/${encodeURIComponent(url)}`
  }

  getSiteInfoQueryParams(options) {
    const queryStringValues = {};

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
      queryStringValues.full_render = 'true';
    }

    if (options.maxCacheAge) {
      queryStringValues.max_cache_age = options.maxCacheAge;
    }

    if (options.acceptLang) {
      queryStringValues.accept_lang = options.acceptLang;
    }

    if (options.htmlElements) {
      queryStringValues.html_elements = options.htmlElements;
    }

    return queryStringValues;
  }

  async getSiteInfo(url, options = {}) {
    // Check if retryStrategies are provided in the options
    if (options.retryStrategies && options.retryStrategies.length !== 0) {
      const retryStrategies = options.retryStrategies;

      // Clone the default options and remove the retryStrategies property
      const defaultOptions = _.clone(this.options);
      delete defaultOptions.retryStrategies;

      // Set the max number of retry attempts to the number of retry strategies provided
      const maxRetryAttempts = retryStrategies.length;

      try {
        let results = { allRequests: [] };
        let retryAttempts = 0;

        // Loop through the retry strategies and attempt to get the site info
        for (const strategyOptions of retryStrategies) {
          if (retryAttempts >= maxRetryAttempts) {
            break; // Terminate the retry loop if the maximum attempts are reached
          }

          // Merge the strategy options with the default options and the provided options
          const strategyOptionsCompiled = _.extend({}, defaultOptions, this.options, options, strategyOptions);

          // Get the requires property from the strategy options and remove it from the retry options
          const requires = strategyOptionsCompiled.requires;
          const retryOptions = _.clone(strategyOptionsCompiled);
          delete retryOptions.requires;
          delete retryOptions.retryStrategies;

          // Set state to be the results if there are more than one results,
          // otherwise, make a request to get the site info with the current retry options
          const state = Object.keys(results).length > 1 ? results : await this.getSiteInfo(url, retryOptions);

          const returnData = {
            allRequests: results.allRequests,
          };
          returnData.allRequests.push({
            requires,
            request: retryOptions,
            response: state,
          });

          // Check if the state has all the required properties
          if (_.every(requires, _.partial(_.has, state))) {
            // If all required properties are present, add the current request details to allRequests
            return Object.assign(state, returnData);
          }

          retryAttempts++;
        }

        const totalRequests = results.allRequests.length;
        const lastRequest = results.allRequests[totalRequests - 1];
        // results.allRequests.pop();
        results = Object.assign(lastRequest.response, results);

        return results;
      } catch (error) {
        throw error;
      }
    }

    // If no retry strategies are provided, proceed with the regular API request

    // Get the base URL for the API request
    const baseUrl = this.getSiteInfoUrl(url);

    // Merge the default options with the provided options
    const requestOptions = _.extend({}, this.options, options);

    // Get the query string values for the API request
    const queryStringValues = this.getSiteInfoQueryParams(requestOptions);

    const config = {
      method: 'GET',
      url: baseUrl,
      params: queryStringValues,
      responseType: 'json',
    };

    try {
      // Make the API request using axios
      const response = await axios(config);
      const results = response.data;

      return results;
    } catch (error) {
      throw error;
    }
  }

}

export default OpenGraphIO;
