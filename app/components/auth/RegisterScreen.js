import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import QuickRegister from "./quickReg";
import PhoneRegister from "./phoneReg";
import AccountAgreement from "./accountAgreement";
import MainTheme from "../../utils/AllColor";

export default class registerScreen extends Component<Props> {
    static navigationOptions = {
        header: null,  //隐藏顶部导航栏
    };
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            quickReg: true, //是否为快速注册
        }
    }
    onTab(boolean) {
        this.setState({ quickReg: boolean })
    }
    render() {
        const { quickReg } = this.state;
        const { navigation } = this.props;
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1, margin: 10, backgroundColor: 'white' }}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Home')}>
                        <Image source={require('../../static/img/login_back.png')}
                            style={styles.header_img} />
                    </TouchableOpacity>

                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <Image source={require('../../static/img/login_banner_01.png')}
                            style={styles.logo_img} />
                        <View style={{flexDirection:"row",marginBottom:20,alignItems:'center'}}>
                            <Text style={styles.logo_text}>注册</Text>
                            <TouchableOpacity onPress={() => this.setState({ quickReg: !quickReg })}
                                style={{
                                    flexDirection: "row",
                                    justifyContent: 'flex-end',
                                    marginRight: 10
                                }}>
                                <Text style={{
                                    fontSize: 14,
                                    color: "#666666",
                                    marginTop: 50,
                                    marginRight: 5
                                }}>
                                    {quickReg ? '手机注册' : '快速注册'}
                                </Text>
                                <Image source={require('../../static/img/arrow_more.png')}
                                style={{ marginTop: 50, width:8,height:14}} />
                            </TouchableOpacity>
                        </View>

                        {quickReg ? <QuickRegister router={navigation} /> : <PhoneRegister router={navigation} />}

                        <AccountAgreement />
                    </View>

                </View>
            </SafeAreaView>

        );
    }
}

const styles = StyleSheet.create({
    header_img: {
        resizeMode: 'cover',
        width: 15,
        height: 15,
        margin: 10
    },
    tabContain: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20
    },
    logo_img: {
        width: 200,
        height: 60,
        resizeMode: 'contain',
        marginTop: 20,
    },
    logo_text: {
        flex:1,
        fontWeight: 'bold',
        fontSize: 25,
        color: "black",
        marginTop: 40,
        textAlign: "left",
        marginLeft:25,
    },
});
