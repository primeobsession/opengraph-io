import OpenGraphIO from '../dist';

describe('OpenGraph.io Client Tests', () => {
  let testAppId;

  beforeAll(() => {
    testAppId = process.env.TEST_APP_ID;
  });

  describe('Client Setup', () => {
    it('should require app_id and use defaults', () => {
      expect(() => {
        const OG = new OpenGraphIO();
        expect(OG.options).toBeDefined();
        expect(OG.options.version).toBe('1.1');
        expect(OG.options.cacheOk).toBe(true);
      }).toThrowError('appId');
    });

    it('should initialize with app_id and use defaults', () => {
      const OG = new OpenGraphIO({ appId: testAppId });
      expect(OG.options).toBeDefined();
      expect(OG.options.version).toBe('1.1');
      expect(OG.options.cacheOk).toBe(true);
    });

    it('should allow overriding of defaults', () => {
      const OG = new OpenGraphIO({ cacheOk: false, appId: testAppId });
      expect(OG.options.cacheOk).toBe(false);
      expect(OG.options.version).toBe('1.1');
    });

    it('should be able to initialize with one line and no options', () => {
      const OG = new OpenGraphIO({ cacheOk: false, appId: testAppId });
      expect(OG.options.cacheOk).toBe(false);
      expect(OG.options.version).toBe('1.1');
    });

    it('should be able to initialize with one line', () => {
      const OG = new OpenGraphIO({ appId: testAppId });
      expect(OG.options.cacheOk).toBe(true);
      expect(OG.options.version).toBe('1.1');
    });

    it('should default to use cache and not use proxy', () => {
      const OG = new OpenGraphIO({ appId: testAppId });
      const params = OG.getSiteInfoQueryParams(OG.options);
      expect(params.cache_ok).toBe('true');
      expect(params.use_proxy).toBe('false');
      expect(params.max_cache_age).toBeUndefined();
      expect(params.accept_lang).toBeUndefined();
      expect(params.full_render).toBeUndefined();
    });

    it('should support set use proxy parameter', () => {
      const OG = new OpenGraphIO({ appId: testAppId, useProxy: true });
      const params = OG.getSiteInfoQueryParams(OG.options);
      expect(params.cache_ok).toBe('true');
      expect(params.use_proxy).toBe('true');
    });

    it('should support set max cache age parameter', () => {
      const OG = new OpenGraphIO({ appId: testAppId, maxCacheAge: 100000 });
      const params = OG.getSiteInfoQueryParams(OG.options);
      expect(params.max_cache_age).toBe(100000);
    });

    it('should support set accept lang parameter', () => {
      const OG = new OpenGraphIO({ appId: testAppId, acceptLang: 'en-us' });
      const params = OG.getSiteInfoQueryParams(OG.options);
      expect(params.accept_lang).toBe('en-us');
    });

    it('should support set full render parameter', () => {
      const OG = new OpenGraphIO({ appId: testAppId, fullRender: true });
      const params = OG.getSiteInfoQueryParams(OG.options);
      expect(params.full_render).toBe('true');
    });
  });

  describe('Request Setup', () => {
    it('should create a valid URL with no options', () => {
      const target = 'http://cnn.com';
      const OG = new OpenGraphIO({ appId: testAppId });
      const url = OG.getSiteInfoUrl(target);
      expect(url).toBe('https://opengraph.io/api/1.1/site/' + encodeURIComponent(target));
    });


    it('should create proper query parameters', () => {
      const appId = 'XXXXXXXXXX';
      const OG = new OpenGraphIO({ cacheOk: false, appId: appId });
      const params = OG.getSiteInfoQueryParams(OG.options);
      expect(params.cache_ok).toBe('false');
      expect(params.app_id).toBe(appId);
    });

    it('should properly set the service when including an option', () => {
      const OG = new OpenGraphIO({ appId: testAppId, service: 'extract' });

      expect(OG.options.service).toBe('extract');
    });

    it('should default service to site when not including an option', () => {
      const OG = new OpenGraphIO({ appId: testAppId });

      expect(OG.options.service).toBe('site');
    });

    it('should should set the autoProxy to false', () => {
      const OG = new OpenGraphIO({ appId: testAppId, autoProxy: false });

      expect(OG.options.autoProxy).toBe(false);
    });
  });

  describe('Full Tests', () => {
    let OG;
    const testUrl = 'http://github.com/';

    beforeAll(() => {
      OG = new OpenGraphIO({appId: testAppId});
    });

    it('should get results from a site with no option', async () => {
      const result = await OG.getSiteInfo(testUrl);
      expect(result).toBeDefined();
      expect(result.url).toBe(testUrl);
      expect(result.openGraph.site_name).toBe('GitHub');
    }, 10000);

    it('should get results from a site with options', async () => {
      const options = {
        cacheOk: false,
        full_render: true,
      }
      const result = await OG.getSiteInfo(testUrl, options);
      expect(result).toBeDefined();
      expect(result.url).toBe(testUrl);
      expect(result.openGraph.site_name).toBe('GitHub');
    }, 10000);

    it('should get results from a site with retryStrategies', async () => {
      const retryUrl = 'https://dev.to/koolkishan/build-a-whatsapp-clone-realtime-chat-using-nextjs-socketio-tailwind-css-nodejs-express-and-prisma-1j0k';
      OG.options.cacheOk = false;
      const retryStrategies = [
        {
          requires: ['openGraph.title'],
        },
        {
          fullRender: true,
          requires: ['openGraph.title'],
        },
        {
          use_proxy: true,
          requires: ['openGraph.title'],
        },
      ]

      const result = await OG.getSiteInfo(retryUrl, {retryStrategies})
      expect(result).toBeDefined();
      expect(result.url).toBe(retryUrl);
      expect(result.allRequests.length).toBe(1);
      expect(result.hybridGraph.title).toBeDefined();
    }, 10000);

    it('should get results from a site with .then', async () => {
      const url = 'https://www.cybergrx.com/resources/how-to-create-a-barebones-production-ready-npm-package-with-babel-7';

      return OG.getSiteInfo(url).then((result) => {
        expect(result).toBeDefined();
        expect(result.hybridGraph.title).toBe('How To Create A Barebones Production Ready NPM Package With Babel 7');
      });
    }, 25000);

    it('should get results from a site with retryStrategies and async/await', async () => {
      const retryUrl = 'https://frankspeech.com/video/10923-rev-paul-burke-adult-and-teen-challenge-brooklyn';
      OG.options.cacheOk = false;
      const retryStrategies = [
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
          requires: ["hybridGraph.title"]
        }
      ]
      const result = await OG.getSiteInfo(retryUrl, {retryStrategies})
      expect(result).toBeDefined();
      expect(result.url).toBe(retryUrl);
      expect(result.allRequests.length).toBe(2);
      expect(result.hybridGraph.title).toBeDefined();
    }, 10000);
  });

  describe('Extract Service Tests', () => {
    let OG;
    const testUrl = 'https://medium.com/blog/new-partner-program-incentives-focus-on-high-quality-human-writing-7335f8557f6e/'

    beforeAll(() => {
      OG = new OpenGraphIO({ appId: testAppId, service: 'extract' });
    })

    it('should get extract results with default html_elements', async () => {
      const result = await OG.getSiteInfo(testUrl);
      expect(result).toBeDefined();
    }, 10000)

    it('should get extract results with custom html_elements', async () => {
      OG.options.htmlElements = 'h1'
      const result = await OG.getSiteInfo(testUrl)
      expect(result).toBeDefined();
    }, 10000)
  })

  describe('Scrape Service Tests', () => {
    let OG;
    const testUrl = 'https://medium.com/blog/new-partner-program-incentives-focus-on-high-quality-human-writing-7335f8557f6e/'

    beforeAll(() => {
      OG = new OpenGraphIO({ appId: testAppId, service: 'extract' });
    })

    it('should get scrape results with', async () => {
      const result = await OG.getSiteInfo(testUrl);
      expect(result).toBeDefined();
    })
  })

});
