const assert = require('assert');

describe('webpack.base.js test case', () => {
    const baseConfig = require('../../lib/webpack.base');

    it('entry', () => {
        assert.equal(baseConfig.entry.index, '/Users/keilingzhuang/Desktop/mybuilder-webpack/test/smoke/template/src/index/index.js');
        assert.equal(baseConfig.entry.search, '/Users/keilingzhuang/Desktop/mybuilder-webpack/test/smoke/template/src/search/index.js');
    });
});

