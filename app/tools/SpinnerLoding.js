import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Animated,
    Easing,
    ActivityIndicator,
    Modal,
    Text,
    DeviceEventEmitter
} from 'react-native';


export default class Loading extends Component {
    constructor(props) {
        super(props);
        this.doingAnimation = false;
        this.state = {
            rotate_value: new Animated.Value(0),
            show: false,
            showText:'loading',
            startAnimation: false,
        };
    }

    _startAnimation = () => {
        this.doingAnimation = true;
        this.state.rotate_value.setValue(0);
        Animated.timing(this.state.rotate_value, {
            toValue: 1,
            duration: 1000,
            easing: Easing.linear,
        }).start(() => {
            if (this.state.startAnimation) {
                this._startAnimation();
            }
        });
    };

    /**
     * show loading
     * @param isShow
     */
    show(isShow = true) {
        if (isShow) {
            this.setState((state) => {
                state.show = true;
                state.startAnimation = true;
                return state;
            });
            !this.doingAnimation && this._startAnimation();
        }else {
            this.close();
        }
    }

    /**
     * hide loading
     */
    close() {
        this.doingAnimation = false;
        this.setState((state) => {
            state.show = false;
            state.startAnimation = false;
            return state;
        });
    }

    componentDidMount() {
        // 全局监听 Loading标签的显示隐藏
        this.listener = DeviceEventEmitter.addListener('spinnerStatus', (val) => {
            this.setState({show: val.show,showText:val.text})
        });
    }

    componentWillUnmount() {
        this.listener.remove();
    }

    render() {
        const defaultProps = {
            image:            null,
            backgroundColor:  '#ffffffF2',
            borderRadius:     5,
            size:             70,
            imageSize:        40,
            indicatorColor:   'gray',
            loading:          null,
        };
        let { show } = this.state;
        return (
            <Modal transparent = {true}
                   visible = {show}
                   animationType = {'fade'}
            >
                <View style = {styles.loadingView}>
                    <View style = {[styles.loading, {
                        backgroundColor: defaultProps.backgroundColor,
                        borderRadius: defaultProps.borderRadius,
                        width: defaultProps.size,
                        height: defaultProps.size,
                    }]}>
                        {
                            defaultProps.image ?
                                <Animated.Image
                                    style = {{
                                        width: defaultProps.imageSize,
                                        height: defaultProps.imageSize,
                                        transform: [
                                            {
                                                rotateZ: this.state.rotate_value.interpolate({
                                                    inputRange: [0,1],
                                                    outputRange: ['0deg', '360deg'],
                                                }),
                                            },
                                        ],
                                    }}
                                    source = {defaultProps.image}/> :
                                <ActivityIndicator
                                    size = {'large'}
                                    color = {defaultProps.indicatorColor}
                                    animating = {true}/>
                        }
                        <Text style={{fontSize:14}}>{this.state.showText}</Text>
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    loadingView: {
        flex: 1,
        backgroundColor: '#00000033',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loading: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});

