'use strict'

import React from 'react'
import ReactDom from 'react-dom'
import './search.css'
import './search.less'
import ImgLogo from './logo.png'
import test from '../../common/utils'
const largeNumberx = require('large-numberx')

const aaa = 'xxx'
class Search extends React.Component {
    constructor() {
        super(...arguments);

        this.state = {
            Text: null
        };
    }
    loadComponent() {
        import('./text.js').then((Text) => {
            this.setState({
                Text: Text.default
            });
        });
    }
    render() {
        const { Text } = this.state;
        return <div className="search-text">
            {
                Text ? <Text /> : null
            }
            Search 小肥居 老猪肥 666<br/>
            <img src={ ImgLogo }/>
            <a className="search-a" onClick={ this.loadComponent.bind(this) }>xxxx{largeNumberx('1','1')}</a>
        </div>;
    }
}

ReactDom.render( 
    <Search /> ,
    document.getElementById('root')
);