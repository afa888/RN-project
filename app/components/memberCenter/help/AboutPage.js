import React, { Component } from 'react';

import {
    View, Text, Image, SafeAreaView, StyleSheet,
} from "react-native";
import MainTheme from '../../../utils/AllColor';

export default class AboutPage extends Component<Props> {
    static navigationOptions = ({ navigation }) => {
        return {
            title: '关于',
            headerTitleStyle: { flex: 1, textAlign: 'center' },//解决android 标题不居中问题
            headerLeft: (
                <TouchableOpacity onPress={() => { navigation.goBack() }}>
                    <Image source={require('../../../static/img/titlebar_back_normal.png')}
                        style={styles.backItem} />
                </TouchableOpacity>
            )
        };
    };

    constructor(props) {
        super(props);

        this.setState({
            content: '\t业精于专，功成于勤！天下网络集团，专业系统提供商、支付快充系统及API游戏供应商。 ' +
                '我司秉承诚信、专业、勤奋、责任的企业文化，坚持技术创新、稳健务实，300+技术开发工程师致力' +
                '于产品的创新与提升，协助客户从品牌价值出发，立足网络，将产品定位于国际市场，' +
                '同时接入全球众多知名品牌博娱产品，为客户提供高效、稳定的系统和游戏产品。 ' +
                '此外我们拥有最专业的技术团队为您保驾护航，让您在运营中体验到专业、稳定的天下管理系' +
                '统及高效、贴心的售后服务。',
        });

    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Image style={styles.logoImage}
                    source={require('../../../static/img/UserCenter/userCenter_about_logo.png')} />
                <Image style={styles.centerImage}
                    source={require('../../../static/img/UserCenter/userCenter_about_content.png')}/>
                <Text style={styles.bottomText}>{this.state.content}</Text>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    backItem: {
        resizeMode: 'contain',
        width: 20,
        height: 20,
        margin: 12,
    },

    container: {
        flex: 1,
        backgroundColor: MainTheme.BackgroundColor,
        justifyContent: 'center',
    },

    logoImage: {

    },

    centerImage: {

    },

    bottomText: {

    },

});