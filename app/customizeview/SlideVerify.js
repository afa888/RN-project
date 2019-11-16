import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Image, PanResponder } from "react-native";
import MainTheme from '../utils/AllColor';
import Device from '../utils/DeviceValue';
import TXToastManager from '../tools/TXToastManager';

export default class SlideVerify extends Component<Props> {
    constructor(props) {
        super(props);

        this.state = {
            opacity: 0.0,
            positionX: 0,
            validate:false,
        }
    }

    componentWillMount() {
        this.panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: this._handlePanResponderMove,
            onStartShouldSetPanResponder: () => this._handleStartShouldSetPanResponder(),
            onPanResponderGrant: this._handlePanResponderGrant,
            onPanResponderMove: this._handlePanResponderMove,
            onPanResponderRelease: this._handlePanResponderRelease,
            onPanResponderTerminate: this._handlePanResponderTerminate,
        });
    }

    _handlePanResponderMove = () => {
        console.log('onMoveShouldSetPanResponder');
        return !this.state.validate;
    }

    _handleStartShouldSetPanResponder = () => {
        console.log('onStartShouldSetPanResponder');
        return !this.state.validate;
    }

    _handlePanResponderGrant = () => {
        console.log('onPanResponderGrant');
        this.setState({ opacity: 1.0 });
    }

    _handlePanResponderMove = (e, gestureState) => {
        if (this.state.validate) {
            return;
        }

        let evt = e.nativeEvent;

        console.log('position:' + evt.locationX + ',' + evt.locationY + ')  +  <'
            + gestureState.dx + "," + gestureState.dy + '>');
        
        let px = gestureState.dx;
        if (px < 0) {
            px = 0;
        }
        else if (px > Device.windowWidth - 100) {
            px = Device.windowWidth - 100;
        }

        if (px >= 200 && px <= 210) {
            this.setState({
                validate:true,
            });
            TXToastManager.show('验证成功！');
        }
        else {
            this.setState({ positionX: px });
        }
    }

    _handlePanResponderRelease = () => {
        this.setState({
            positionX: 0,
            opacity: 0.0,
        });
    }

    _handlePanResponderTerminate = () => {
        this.setState({
            positionX: 0,
            opacity: 0.0,
        });
    }

    render() {
        return (
            <View style={{
                backgroundColor: 'white',
                margin: 10,
                borderColor: MainTheme.DarkGrayColor,
                borderWidth: 0.5,
                height: 60,
            }}>
                <View style={{
                    backgroundColor: 'blue',
                    height: (Device.windowWidth - 40) * 0.5,
                    width: Device.windowWidth - 40,
                    opacity: this.state.opacity,
                    position: 'absolute',
                    top: -(Device.windowWidth - 40) * 0.5,
                    left: 0,
                    zIndex:2,
                }}>
                    <View style={{
                        backgroundColor: MainTheme.SpecialColor,
                        marginLeft: this.state.positionX,
                        height: 60,
                        width: 60,
                        marginTop: 40,
                        borderWidth: 0.5,
                        borderRadius: 30,
                        
                    }} />
                </View>

                <View style={{
                    flex: 1,
                    backgroundColor: 'green',
                    width: Device.windowWidth - 40,
                }}
                    {...this.panResponder.panHandlers}>
                    <View style={{
                        flex:1,
                        backgroundColor: 'red',
                        width: 60,
                        marginLeft: this.state.positionX,
                    }} />
                </View>
            </View>
        )
    }
}