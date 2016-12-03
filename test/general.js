var
  expect = require('chai').expect,
  ogLib = require('../index');

describe('OpenGraph.io Client Tests', function(){
  
  describe('Client Setup', function(){

    it('should require no options and use defaults', function(done){
      try{
        var OG = new ogLib();

        expect(OG.options).to.exist;
        expect(OG.options.version).to.equal('1.0');
        expect(OG.options.cacheOk).to.equal(true);

        done();
      }
      catch (e){
        expect(e).to.not.exist;
        done();
      };
    });

    it('should allow overriding of defaults', function(done){

      var OG = new ogLib({cacheOk: false});
      expect(OG.options.cacheOk).to.equal(false);

      // default unimpacted values should still be there
      expect(OG.options.version).to.equal('1.0');

      done();

    });

    it('should be able to initialize with one line and no options', function(done){

      var OG = require('../index')({cacheOk: false});

      expect(OG.options.cacheOk).to.equal(false);

      // default unimpacted values should still be there
      expect(OG.options.version).to.equal('1.0');

      done();

    });

    it('should be able to initialize with one line', function(done){

      var OG = require('../index')();

      expect(OG.options.cacheOk).to.equal(true);

      // default unimpacted values should still be there
      expect(OG.options.version).to.equal('1.0');

      done();

    });

  });

  describe('Request Setup', function(){

    it('should create a valid URL with no options', function(done){

      var target = 'http://cnn.com';

      var OG = new ogLib();
      var url = OG._getSiteInfoUrl(target, OG.options);

      expect(url).to.equal('http://opengraph.io/api/1.0/site/' + encodeURIComponent(target));
      done();

    });

    it('should use https when using an appId', function(done){

      var target = 'http://cnn.com';

      var OG = new ogLib({appId: '111111111'});
      var url = OG._getSiteInfoUrl(target, OG.options);

      expect(url).to.equal('https://opengraph.io/api/1.0/site/' + encodeURIComponent(target));
      done();

    });

    it('should create a valid URL when forcing cache', function(done){

      var target = 'http://cnn.com';

      var OG = new ogLib({cacheOk: false});
      var params = OG._getSiteInfoQueryParams(OG.options);

      expect(params.cache_ok).to.equal('false');

      done();

    });

  });

  describe('Full Tests', function(){

    var OG;
    var testUrl ='http://github.com';

    before(function(done){
      OG = new ogLib();
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