import React, {Component} from 'react';
import {TouchableOpacity,ImageBackground,Linking,ActivityIndicator,Platform,FlatList,RefreshControl, StyleSheet, Text, View, Button, Alert, Image,StatusBar,TouchableHighlight} from 'react-native';
import Dimensions from 'Dimensions'
import Toast, {DURATION} from 'react-native-easy-toast'
import {CAGENT,WEBNUM} from "../../utils/Config";
import http from "../../http/httpFetch";
import TXToastManager from "../../tools/TXToastManager"
import { NavigationActions,StackActions } from 'react-navigation';
import deviceValue from "../../utils/DeviceValue"
import MainTheme from "../../utils/AllColor"

import loadingImage from '../../static/img/zx.gif'

export default class CustomerServiceScreen extends Component<Props> {
    
    static navigationOptions = ({ navigation }) => {

        return {
            title: '在线客服',
            headerTitleStyle:{flex:1, textAlign: 'center'},//解决android 标题不居中问题
            headerLeft: (
                    <TouchableOpacity onPress={() => {
                            navigation.dispatch(NavigationActions.back());
                        }}>
                            <Image source={require('../../static/img/titlebar_back_normal.png')}
                                   style={{
                                       resizeMode: 'contain',
                                       width: 20,
                                       height: 20,
                                       margin: 12
                                   }}/>
                        </TouchableOpacity>
                ),
            headerBackTitle:null,
        };
      };

    constructor(props) {
        super(props);
        this.state = {dataList:[],isLoading: true,isRefreshing:false};
    }

    componentDidMount () {
        this.getCustomerList();
    }

    getCustomerList = () => {
        let params = {cagent:CAGENT,website:WEBNUM};
        http.post('webContactInfo',params,true).then(res => {
            if(res.status === 10000){
                let oData = res.data;//联系方式数组
                // oData.splice(0,0,{'name':'联系方式'});//手动添加第一行

                this.setState({dataList:oData,isLoading: false,
                        isRefreshing:false});
            }
        });
    }

    //此函数用于为给定的item生成一个不重复的key
    _keyExtractor = (item, index) => index;

    //下拉刷新
    handleRefresh = () => {
        this.setState({
            isRefreshing:true,//tag,下拉刷新中，加载完全，就设置成flase
            dataList:[]
        });
        this.getCustomerList()
    }

    //加载等待页
    renderLoadingView() {
        return (
            <View style={styles.container}>
                <ActivityIndicator
                    animating={true}
                    color='gray'
                    size="small"
                />
            </View>
        );
    }

    //加载失败view
    renderErrorView() {
        return (
            <View style={styles.container}>
                <Text>
                    {this.state.errorInfo}
                </Text>
            </View>
        );
    }

    //点击列表点击每一行
    clickItem(item,index) {
        if (item.isjump === 0) {
            return;
        }
        if (item.type ==1) {
            //在线客服
            this.props.navigation.navigate('CommonWebviewScreen',{url:item.value,title:'在线客服'});
        }else if(item.type == 2){
            // QQ
            Linking.canOpenURL('mqq://').then(supported => {
                if (supported) {
                    let url = 'mqq://im/chat?chat_type=wpa&uin=' + item.value +'&version=1&src_type=web'
                    Linking.openURL(url);
                } else {
                    TXToastManager.show('请安装QQ');
                }
            });

        } else if(item.type == 7){
            // public QQ
            Linking.canOpenURL('mqq://').then(supported => {
                if (supported) {
                    let url = 'mqq://im/chat?chat_type=crm&uin=' + item.value +'&version=1&src_type=web&web_src=http:://wpa.b.qq.com'
                    Linking.openURL(url);
                } else {
                    TXToastManager.show('请安装QQ');
                }
            });
        }
    }


    //列表的每一行
    renderItem({item,index}) {

        let nameString;
        if (item.prefix && item.prefix.length > 0) {
            if (item.type == 1) {
                nameString = item.prefix.replace(':','');
            }else {
                nameString = item.value;//item.prefix + item.value; // 只显示配置值
            }
            
        }else {
            nameString = item.value;
        }
        let iconView;
        if (item.type == 1) {
            iconView =
                <Image style={styles.iconImage}
                    source={require('../../static/img/icon-kefu.png')} />
        }else if(item.type == 2){
            iconView = <Image style={styles.iconImage}
                    source={require('../../static/img/icon-qq.png')} />
        }else if(item.type == 3){
            iconView = <Image style={styles.iconImage}
                    source={require('../../static/img/icon-wx.png')} />
        }else if(item.type == 4){
            iconView = <Image style={styles.iconImage}
                    source={require('../../static/img/icon-email.png')} />
        }else if(item.type == 5){
            iconView = <Image style={styles.iconImage}
                    source={require('../../static/img/icon-ddkf.png')} />
        }else if(item.type == 6){
            iconView = <Image style={styles.iconImage}
                    source={require('../../static/img/icon-phone.png')} />
        }else if(item.type == 7){
            iconView = <Image style={styles.iconImage}
                    source={require('../../static/img/icon-qq.png')} />
        }else if(item.type == 8){
            iconView = <Image style={styles.iconImage}
                    source={require('../../static/img/icon_skype.png')} />
        }

        return (
            <View style={{padding:1,alignItems:'center',height: 65}}>
                {
                    <ImageBackground source={require('../../static/img/zxkf_bg.png')} resizeMode='cover' style={{width:335,height:63}}>
                    <TouchableOpacity
                        onPress={() => this.clickItem(item,index)}>
                        <View style={{paddingLeft:30,width:Dimensions.get('window').width - 80,height:63,flexDirection:'row',alignItems:'center',justifyContent:'center'
                        }}>
                            {iconView}
                            {
                             <Text style={{flex:1,color:'#000000',paddingLeft:10}}>{nameString}</Text>
                            }

                        </View>
                    </TouchableOpacity>
                    </ImageBackground>
                }

            </View>
        )
    }

    renderData() {
        let height = this.state.dataList.length * 50 ;
        let top = 20;
        return (
            <View style={{paddingTop:top,flex: 1,alignItems:'center',justifyContent:'center',backgroundColor:MainTheme.backgroundColor}}>
                <View style={{paddingBottom:20,height:168,width:deviceValue.windowWidth,justifyContent:'center',alignItems:'center'}}>
                    <Image style={{width:148,height:148}}
                        source={require('../../static/img/icon_service.png')} />
                </View>
                <FlatList
                        numColumns={1}
                        style={[styles.flatListStyle,{height:height,width:335}]}
                        data={this.state.dataList}
                        renderItem={this.renderItem.bind(this)}
                        keyExtractor={this._keyExtractor}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={this.handleRefresh.bind(this)}//因为涉及到this.state
                                colors={['#ff0000', '#00ff00','#0000ff','#3ad564']}
                                progressBackgroundColor="#ffffff"
                            />
                        }
                    />
            </View>
        );
    }

    render() {
        //第一次加载等待的view
        if (this.state.isLoading && !this.state.error) {
            return this.renderLoadingView();
        } else if (this.state.error) {
            //请求失败view
            return this.renderErrorView();
        }
        //加载数据
        return this.renderData();
    }
}

const styles = StyleSheet.create({
    header_img: {
        flex: 1,
        resizeMode:'cover',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    },
    flatListStyle:{
        color:'red',
        fontSize:16,
        backgroundColor:MainTheme.backgroundColor,
    },
    iconImage:{
        width:20,
        height:20
    },
    loadingImage: {
        width: 80,
        height: 40,
    },
});
