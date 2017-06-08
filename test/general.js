var
  expect = require('chai').expect,
  ogLib = require('../index'),
  testAppId = process.env.TEST_APP_ID;

describe('OpenGraph.io Client Tests', function(){
  
  describe('Client Setup', function(){

    it('should require app_id and other than that use defaults', function(done){
      try{
        var OG = new ogLib();

        expect(OG.options).to.exist;
        expect(OG.options.version).to.equal('1.1');
        expect(OG.options.cacheOk).to.equal(true);

        done();
      }
      catch (e){
        expect(e).to.contain('appId');
        done();
      };
    });

    it('should initialize with app_id and other than that use defaults', function(done){
      try{
        var OG = new ogLib({appId: testAppId});

        expect(OG.options).to.exist;
        expect(OG.options.version).to.equal('1.1');
        expect(OG.options.cacheOk).to.equal(true);

        done();
      }
      catch (e){
        expect(e).to.contain('appId');
        done();
      };
    });

    it('should allow overriding of defaults', function(done){

      var OG = new ogLib({cacheOk: false, appId: testAppId});
      expect(OG.options.cacheOk).to.equal(false);

      // default unimpacted values should still be there
      expect(OG.options.version).to.equal('1.1');

      done();

    });

    it('should be able to initialize with one line and no options', function(done){

      var OG = require('../index')({cacheOk: false, appId: testAppId});

      expect(OG.options.cacheOk).to.equal(false);

      // default unimpacted values should still be there
      expect(OG.options.version).to.equal('1.1');

      done();

    });

    it('should be able to initialize with one line', function(done){

      var OG = require('../index')({appId: testAppId});

      expect(OG.options.cacheOk).to.equal(true);

      // default unimpacted values should still be there
      expect(OG.options.version).to.equal('1.1');

      done();

    });

  });

  describe('Request Setup', function(){

    it('should create a valid URL with no options', function(done){

      var target = 'http://cnn.com';

      var OG = new ogLib({appId: testAppId});
      var url = OG._getSiteInfoUrl(target, OG.options);

      expect(url).to.equal('https://opengraph.io/api/1.1/site/' + encodeURIComponent(target));
      done();

    });

    it('should use https when using an appId', function(done){

      var target = 'http://cnn.com';

      var OG = new ogLib({appId: '111111111'});
      var url = OG._getSiteInfoUrl(target, OG.options);

      expect(url).to.equal('https://opengraph.io/api/1.1/site/' + encodeURIComponent(target));
      done();

    });

    it('should create a proper query parameters', function(done){

      var appId = 'XXXXXXXXXX';

      var OG = new ogLib({cacheOk: false, appId: appId});
      var params = OG._getSiteInfoQueryParams(OG.options);

      expect(params.cache_ok).to.equal('false');
      expect(params.app_id).to.equal(appId);

      done();

    });

  });

  describe('Full Tests', function(){

    var OG;
    var testUrl ='http://github.com';

    before(function(done){
      OG = new ogLib({appId: testAppId});
      done();
    });

    it('should get results from a site with no option and only a callback', function(done){

      OG.getSiteInfo(testUrl , function(err, result){
        expect(err).to.not.exist;
        expect(result).to.exist;
        expect(result.url).to.equal(testUrl);
        expect(result.openGraph.site_name).to.equal('GitHub');
        done();
      });

    });

    it('should get results from a site with options and a callback', function(done){

      OG.getSiteInfo(testUrl, {}, function(err, result){
        expect(err).to.not.exist;
        expect(result).to.exist;
        expect(result.url).to.equal(testUrl);
        expect(result.openGraph.site_name).to.equal('GitHub');
        done();
      });
    });

    it('should get results from a site with no options returning a promise', function(){
      return OG.getSiteInfo(testUrl)
        .then(function(result){
          expect(result).to.exist;
          expect(result.url).to.equal(testUrl);
          expect(result.openGraph.site_name).to.equal('GitHub');
          return;
        });
    });

    it('should get results from a site with options returning a promise', function(){
      return OG.getSiteInfo(testUrl, {})
        .then(function(result){
          expect(result).to.exist;
          expect(result.url).to.equal(testUrl);
          expect(result.openGraph.site_name).to.equal('GitHub');
          return;
        });
    });

  });

})