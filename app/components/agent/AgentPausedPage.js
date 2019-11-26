import React, { Component } from 'react';
import { navigation } from "react-navigation";
import {
    SafeAreaView, Text,
    Image, View,
    TouchableOpacity, StyleSheet
} from "react-native";

import MainTheme from '../../utils/AllColor';

export default class HelpScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: (
                MainTheme.renderCommonTitle('代理停用')
            ),
            headerLeft: (
                MainTheme.renderCommonBack(navigation)
            ),
            headerRight: (
                <View />
            )
        };
    };

    constructor(props) {
        super(props);
    }

    /**
     * 查看代理规则
     */
    checkRules = () => {
        const { navigation } = this.props;
        navigation.navigate('AgenJoinBefore');
    }

    /**
    * 咨询在线客服
    */
    onlineSupport = () => {
        const { navigation } = this.props;
        navigation.navigate('CustomerService');
    }

    render() {
        const icon = require('../../static/img/agent/wxdl_agency_paused.png');
        return (
            <SafeAreaView style={styles.mainContainer}>
                <Text style={styles.stopText}>代理已停用</Text>
                <Text style={styles.sorryText}>很抱歉，您的代理功能已被停用</Text>
                <Text style={styles.connectText}>如有任何疑问，请联系平台客服</Text>
                <Image style={styles.imageStyle} source={icon} />
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={this.checkRules}
                        style={styles.firstButtonPanel}>
                        <Text style={styles.firstButton}>查看规则</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.onlineSupport}
                        style={styles.secondButtonPanel}>
                        <Text style={styles.secondButton}>咨询客服</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    stopText: {
        color: MainTheme.DarkGrayColor,
        fontSize: 30,
        fontWeight: 'bold',
    },

    sorryText: {
        color: '#666666',
        fontSize: 16,
        marginTop: 15,
        fontWeight: 'bold',
    },

    connectText: {
        color: MainTheme.GrayColor,
        fontSize: 14,
        marginTop: 6,
    },

    imageStyle: {
        marginTop: 15,
    },

    buttonContainer: {
        marginTop: 60,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '100%',
    },

    firstButtonPanel: {
        backgroundColor: MainTheme.BackgroundColor,
        borderColor: MainTheme.SpecialColor,
        borderWidth: 0.5,
        padding: 15,
        paddingLeft: 30,
        paddingRight: 30,
    },

    firstButton: {
        color: MainTheme.SpecialColor,
    },

    secondButtonPanel: {
        backgroundColor: MainTheme.SpecialColor,
        padding: 15,
        paddingLeft: 30,
        paddingRight: 30,
    },

    secondButton: {
        color: MainTheme.SubmitTextColor,
    },
});

