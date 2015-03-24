/**
 * Created by jandersen on 3/23/15.
 */
var assert = require("assert");
var StringReplacePlugin = require("./index.js");
var mockConfig = { options: {} };

describe('StringReplacePlugin', function(){
    describe('#replace()', function(){
        it('should throw with invalid options', function(){
            assert.throws(function() {
                StringReplacePlugin.replace({
                    replacements: []
                })
            },
            /Invalid options/);

            assert.throws(function() {
                StringReplacePlugin.replace({})
            },
            /Invalid options/);
        });

        it('should not throw with valid options', function(){
            assert.doesNotThrow(function() {
                    var loaderStr = StringReplacePlugin.replace({
                        replacements: [{
                            pattern: /<!-- @secret (\w*?) -->/ig,
                            replacement: function (match, p1, offset, string) {
                                return secrets.web[p1];
                            }
                        }]
                    });

                    assert.ok(loaderStr.indexOf("!") === -1, 'No chained loaders expected');
                });
        });

        it('should add next loaders', function(){
            var loaderStr = StringReplacePlugin.replace('html-loader', {
                    replacements: [{
                        pattern: /<!-- @secret (\w*?) -->/ig,
                        replacement: function (match, p1, offset, string) {
                            return secrets.web[p1];
                        }
                    }]
                });
            console.log(loaderStr);
            assert.ok(loaderStr !== null);
            assert.ok(loaderStr.indexOf('html-loader!') === 0);
        });
    });

    describe('#apply()', function(){

        it('should set replace options', function(){
            var plugin = new StringReplacePlugin();
            var replInst = {
                replacements: [{
                    pattern: /<!-- @secret (\w*?) -->/ig,
                    replacement: function (match, p1, offset, string) {
                        return secrets.web[p1];
                    }
                }]
            };
            var loaderStr = StringReplacePlugin.replace('html-loader', replInst);
            var matches = loaderStr.match(/id=(\w*)($|!)/);
            assert.ok(matches.length === 3);
            var id = matches[1];

            plugin.apply(mockConfig);

            var replOpts = mockConfig.options[StringReplacePlugin.REPLACE_OPTIONS];
            assert.ok(replOpts !== null, 'replace options should be present');
            assert.ok(replOpts[id] === replInst, 'replace options should contain id from loader');
        });
    })
});