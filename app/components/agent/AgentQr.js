import React, {Component} from 'react';
import {
    StyleSheet, View, Text, ImageBackground, Image,
    TouchableOpacity, ScrollView, SafeAreaView,
    DeviceEventEmitter, Alert, Button
} from "react-native";
import {
    MainTheme,
    textTitleColor,
    CircleGoldColor,
    theme_color,
    BarBlueColor,
    AgentRedColor,
    AgentBlueColor,
} from "../../utils/AllColor";
import {getStoreData} from "../../http/AsyncStorage";
import TXToastManager from "../../tools/TXToastManager";
import DeviceValue from "../../utils/DeviceValue";
import {MarqueeHorizontal} from "react-native-marquee-ab";
import {CAGENT} from "../../utils/Config";
import http from "../../http/httpFetch";
import AndroidNativeGameActiviy from "../../customizeview/AndroidIosNativeGameActiviy";
import QRCode from 'react-native-qrcode-svg';

let isJoin = false
export default class AgentQr extends Component<Props> {



    constructor(props) {
        super(props);
        this.state = {
            inviteData: null,

        };
    }

    componentDidMount() {
        this.getInviteMethod();
    }

    // componentShouldUpdate

    componentWillUnmount() {
        // 如果存在this.timer，则使用clearTimeout清空。
        // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
        this.timer && clearTimeout(this.timer);
    }

    getInviteMethod = () => {
        http.post('agency/getInviteMethod', null, true).then((res) => {
            if (res.status === 10000) {
                console.log(res)
                if (res.data !== {} || res.data !== null) {
                    this.setState({inviteData: res.data})
                }

            }
        }).catch(err => {
            console.error(err)
        });

    }


    render() {
        console.log('QRCOde render');
        if (this.state.inviteData) {
            let {inviteLink, agencyShare} = this.state.inviteData
        return (
            <View style={{position: 'relative', top: -30,}}>
                <Text style={styles.cotentTitle}>邀请方式</Text>
                <View style={styles.qrView}>
                    <View style={{...styles.qrImageView,height:115,width:115}}>
                        <QRCode
                            getRef={(c) => (this.svg = c)}
                            value={inviteLink} />
                    </View>

                    <View style={{
                        height: 120, flex: 1, marginLeft: 6
                    }}>
                        <TouchableOpacity onPress={() => {
                          //  this.copyText(inviteLink)
                        }}>
                            <Text numberOfLines={1} style={styles.tgText}>推广链接：<Text numberOfLines={1}
                                                                                     style={{color: MainTheme.DarkGrayColor}}>{inviteLink}</Text></Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                           // this.copyText(agencyShare)
                        }}>
                            <Text style={styles.tgwaText}>推广文案：<Text
                                style={{color: MainTheme.DarkGrayColor}}>{agencyShare}</Text></Text>
                        </TouchableOpacity>

                    </View>
                </View>
                <Text
                    style={[styles.textGray, {marginLeft: 15, marginRight: 15}]}>长按二维码可保存邀请图至相册，点击推广链接或推广文案复制到剪贴板</Text>
            </View>)
        }else {
            return null
        }
        
    }
}

const styles = StyleSheet.create({
    cotentTitle: {marginLeft: 12, color: MainTheme.TextTitleColor, marginRight: 12},
    qrView: {
            flexDirection: 'row',
            marginRight: 15,
            marginLeft: 15,
            marginTop: 6,
            marginBottom: 6,
            height: 120
        },
    qrImageView: {
        width: 120, height: 120, borderRadius: 4, padding: 1,
        borderColor: MainTheme.theme_color,
        borderWidth: 0.5, alignItems: 'center', justifyContent: 'center'
    },
    tgText: {
        height: 26,
        borderRadius: 4,
        borderColor: MainTheme.theme_color,
        borderWidth: 0.5,
        justifyContent: 'center',
        padding: 2,
        color: MainTheme.theme_color,
        marginTop: 1

    },
    tgwaText: {
        height: 86,
        width: DeviceValue.windowWidth - 30 - 6 - 4 - 115,
        borderRadius: 4,
        borderColor: MainTheme.theme_color,
        borderWidth: 0.5,
        padding: 2,
        marginTop: 6,
        color: MainTheme.theme_color,
    },
    textGray: {
        color: MainTheme.ThemeEditTextTextColor,
        fontSize: 10
    },
});
