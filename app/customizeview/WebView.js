
import {
    requireNativeComponent,
    View,

} from 'react-native';
import PropTypes from 'prop-types';

let iface = {
    name: 'WebView',
    propTypes: {
        url: PropTypes.string,
        html: PropTypes.string,
        ...View.propTypes // 包含默认的View的属性
    }
};

module.exports = requireNativeComponent('WebView', iface);
