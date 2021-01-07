const path = require('path');
const webpack = require('webpack');
const rimraf =  require('rimraf');
const Mocha = require('mocha');

const mocha = new Mocha({
    timeout: '10000ms'
});

process.chdir(path.join(__dirname, 'template')); // 指定执行目录，这里我们的测试模版挟杂template（类似执行了一次 cd ./template）

rimraf('./dist', () => {
    const proConfig = require('../../lib/webpack.prod.js');
    webpack(proConfig, (err, stats) => {
        if (err) {
            console.err(err);
            process.exit(2);
        } 
        console.log(stats.toString({
            colors: true,
            modules: false,
            children: false
        }));

        mocha.addFile(path.join(__dirname, 'css-js-test.js')); // 将测试用例添加 mocha 对象
        mocha.addFile(path.join(__dirname, 'html-test.js')); // 将测试用例添加 mocha 对象
        mocha.run(); // 执行测试用例
    })
})