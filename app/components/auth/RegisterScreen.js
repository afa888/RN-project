import React, {Component} from 'react';
import {SafeAreaView, StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import QuickRegister from "./quickReg";
import PhoneRegister from "./phoneReg";
import AccountAgreement from "./accountAgreement";

export default class registerScreen extends Component<Props> {
    static navigationOptions = {
        header: null,  //隐藏顶部导航栏
    };
    constructor(props){
        super(props);
        this.state = {
            modalVisible: false,
            quickReg: true, //是否为快速注册
        }
    }
    onTab(boolean){
        this.setState({ quickReg: boolean })
    }
    render() {
        const { quickReg } = this.state;
        const { navigation } = this.props;
        return (
            <SafeAreaView style={{flex:1}}>
                <View style={{flex: 1, margin:10, backgroundColor: 'white'}}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Home')}>
                    <Image source={require('../../static/img/login_back.png')}
                           style={styles.header_img}/>
                </TouchableOpacity>
                <View style={styles.tabContain}>
                    <TouchableOpacity onPress={() => this.onTab(true)}>
                        <View style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            width:110,
                            height:34,
                            borderWidth: 1,
                            borderColor: quickReg ? '#cda469' : '#d3d3d3',
                            borderTopLeftRadius:20,
                            borderBottomLeftRadius:20,
                            backgroundColor: quickReg ? '#cda469' : '#fff'
                            }}>
                            <Text style={{color: quickReg ? '#fff' : '#cda469'}}>快速注册</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.onTab(false)}>
                        <View style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            width:110,
                            height:34,
                            borderWidth: 1,
                            borderColor: quickReg ? '#d3d3d3' : '#cda469',
                            borderLeftWidth:0,
                            borderTopRightRadius:20,
                            borderBottomRightRadius:20,
                            backgroundColor: quickReg ? '#fff' : '#cda469'
                            }}>
                            <Text style={{color: quickReg ? '#cda469' : '#fff'}}>手机注册</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                { quickReg ? <QuickRegister router={ navigation }/> : <PhoneRegister router={ navigation }/>}
                <AccountAgreement/>
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
    tabContain:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical:20
    }
});
