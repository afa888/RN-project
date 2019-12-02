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
import QRCode from "react-native-qrcode";

let isJoin = false
export default class AgentStop extends Component<Props> {



    constructor(props) {
        super(props);
        this.state = {
            agentData: {},

        };
    }

    componentWillMount(): void {


    }


    render() {
        let {inviteLink, agencyShare} = this.props.inviteData
        return (
            <View style={{position: 'relative', top: -30,}}>
                <Text style={styles.cotentTitle}>邀请方式</Text>
                <View style={styles.qrView}>
                    <View style={styles.qrImageView}>
                     {/*  <QRCode
                            value={'聚隆科技离开就'}
                            size={115}
                            bgColor="white"
                            fgColor="black"/>*/}
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
    }
}

const styles = StyleSheet.create({


});
