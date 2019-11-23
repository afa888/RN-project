import React, {Component} from 'react';
import {
    StyleSheet, View, Text, ImageBackground, Image,
    TouchableOpacity, ScrollView, SafeAreaView,
    DeviceEventEmitter, Alert, Button
} from "react-native";
import {MainTheme, textTitleColor, CircleGoldColor, theme_color, BarBlueColor} from "../../utils/AllColor";
import {getStoreData} from "../../http/AsyncStorage";
import TXToastManager from "../../tools/TXToastManager";
import DeviceValue from "../../utils/DeviceValue";
import QRCode from 'react-native-qrcode';
import {Rect, Polygon, Circle, Ellipse, Radar, Pie, Line, Bar, Scatter, Funnel} from 'react-native-tcharts'
import {MarqueeVertical} from "react-native-marquee-ab";

export default class AgenJoinBefore extends Component<Props> {

    static navigationOptions = ({navigation}) => {
        return {
            header: null
        };
    };

    constructor(props) {
        super(props);
        this.state = {noticeData: [{label: 0, value: '空间立刻聚隆科技立刻就立刻'}, {label: 1, value: '监考老师江东父老开始减肥了快速减肥了快速的绝佳'}]};
    }


    componentWillUnmount() {
    };


    render() {

        return (<SafeAreaView style={{flex: 1}}>
                <ScrollView style={{flex: 1, backgroundColor: MainTheme.BackgroundColor}}>
                    <ImageBackground source={require('../../static/img/agent/wxdl_banner.png')}
                                     resizeMode='cover' style={styles.bgImagbg}>
                        <View style={styles.noticeView}>
                            <Image source={require('../../static/img/agent/wxdl_icon_gg.png')}
                                   style={{
                                       resizeMode: 'contain',
                                       width: 16,
                                       height: 16,
                                       marginLeft: 6,
                                   }}/>
                            {this.state.noticeData.length > 0 && <MarqueeVertical
                                textList={this.state.noticeData}
                                width={DeviceValue.windowWidth - 30 - 40}
                                height={25}
                                delay={3000}
                                direction={'up'}
                                numberOfLines={1}
                                reverse={false}
                                bgContainerStyle={{backgroundColor: 'transparent'}}
                                textStyle={{fontSize: 12, marginLeft: 12, color: textTitleColor}}
                                style={{marginLeft: 12}}
                                onTextClick={(item) => {
                                    if (this.state.noticeData.length > 0) {
                                        //  this.props.showDialog(true, this.state.noticeData)
                                    }
                                }}/>}

                        </View>

                    </ImageBackground>

                    <ImageBackground source={require('../../static/img/agent/wxdlbg.webp')}
                                     resizeMode='cover' style={styles.bgImg}>
                        <TouchableOpacity onPress={this.componentWillUnmount()}>
                            <View style={{
                                width: 130,
                                height: 30,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: BarBlueColor,
                                marginTop:DeviceValue.windowWidth * (3023 / 1125)*(1/9)
                            }}>

                                <Text style={{color: MainTheme.commonButtonTitleColor}}>立即加入</Text>
                            </View>
                        </TouchableOpacity>

                    </ImageBackground>

                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    bgImagbg: {
        width: DeviceValue.windowWidth,
        height: DeviceValue.windowWidth * (705 / 1125),


    },
    bgImg: {
        width: DeviceValue.windowWidth,
        height: DeviceValue.windowWidth * (3023 / 1125),
        alignItems:'center'
    },
    noticeView: {
        backgroundColor: 'rgba(178,178,178,0.5)',
        height: 25,
        flexDirection: 'row',
        alignItems: 'center',
        width: DeviceValue.windowWidth,
        paddingLeft: 18,
        paddingRight: 18
    },
});
