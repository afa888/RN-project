import React, {Component} from 'react';
import {Platform,Keyboard,TouchableOpacity, StyleSheet, Text, View, Button, Alert, Image,StatusBar} from 'react-native';
import Dimensions from 'Dimensions'
import TXInput from "../../../tools/TXInput"
import {TXAlert} from "../../../tools/TXAlert"
import http from '../../../http/httpFetch'
import {getStoreData,mergeStoreData} from "../../../http/AsyncStorage";
import { NavigationActions } from 'react-navigation';
import httpBaseManager from '../../../http/httpBaseManager'
import { transferMoneyFamat } from "../../../utils/Htools"
import Picker from 'react-native-picker';
import {specialTextColor} from "../../../utils/AllColor"

export default class PlatformTransfer extends Component<Props> {
    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
          title: '转账',
          headerBackTitle:null,
          headerTitleStyle:{flex:1, textAlign: 'center'},//解决android 标题不居中问题
          headerLeft: (
            <TouchableOpacity onPress={() => {
                    Picker.hide()
                    navigation.dispatch(NavigationActions.back());
                }}>
                    <Image source={require('../../../static/img/titlebar_back_normal.png')}
                           style={{
                               resizeMode: 'contain',
                               width: 20,
                               height: 20,
                               margin: 12
                           }}/>
                </TouchableOpacity>
          ),
        };
      };

    constructor(props){
        super(props);
        this.state = {platFrom:'',platTo:'',money:'',gameList:[],platTitle:[]};
    }

    componentDidMount () {
        //监听键盘弹起
        this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardWillShow.bind(this))
        //获取游戏列表
        this._gameList();
    }

    componentWillUnmount() {
        this.keyboardWillShowListener.remove();//删除订阅
    };

    _keyboardWillShow = (e) => {
        Picker.hide()
    }

    _gameList () {
        http.get('transfer/transferGameList', null,true).then((res) => {
            if (res && res.status === 10000) {
                let oData = res.data;
                this._handleTransferGameList(oData);
            }else {
                if (!res) {
                    TXAlert('网络异常，请稍后重试');
                }else {
                    TXAlert(res.msg);
                }
                this.props.navigation.dispatch(NavigationActions.back());
            }
        }).catch(err => {
            console.error(err)
        });
    }

    _handleTransferGameList = (gameInfo) => {
        let listArr = gameInfo.list;
        if (listArr && listArr.length > 0) {
            let modelArr = [];
            let titleArr = [];
            listArr.map(item => {
                let platImg = item.platImg;
                if (platImg.length >4) {
                    let prefix = platImg.substring(0,5);
                    if (platImg.indexOf('http') == -1) {
                        //没有http 前缀
                        if (prefix.indexOf('://') != -1) {
                            platImg = 'http' + platImg;
                        }else if(prefix.indexOf('//') != -1){
                            platImg = 'http:' + platImg;
                        }
                    }
                }

                let platName = item.platName;
                let balance = item.balance;
                let platCode = item.platCode;
                let money = String(item.balance);
                if (!money) {
                    money = '加载中...';
                }

                let stringMoney = transferMoneyFamat(money);
                let isSelected = false;
                if (stringMoney == '--' || stringMoney == '维护中' || stringMoney == '加载中...') {
                    isSelected = true;
                }

                modelArr.push({icon:platImg,title:platName,subTitle:stringMoney,
                    btType:platCode,selected:isSelected});

                let titleStr = platName + '(￥' + stringMoney + ')';
                titleArr.push(titleStr);

            });

            if (gameInfo.hasOwnProperty('wallet')) {
                let wallet = gameInfo.wallet;
                let balance =  transferMoneyFamat(String(wallet));

                getStoreData('userInfoState').then(userInfo => {
                    if (userInfo.balance != balance) {
                        mergeStoreData('userInfoState',
                        {
                            balance: balance
                        });
                    }
                    //插入主账户信息
                    modelArr.splice(0,0,{icon:'logoicon',title:'钱包余额',subTitle:balance,
                    btType:'WALLET',selected:false});
                    let from = '钱包余额(￥' + balance + ')';
                    titleArr.splice(0,0,from);//第一个位置插入一条数据
                    let modelItem = modelArr[1];
                    let to = modelItem.title + '(￥' + modelItem.subTitle + ')';
                    this.setState({gameList:modelArr,platFrom:from,platTo:to,platTitle:titleArr});
                });
            }else {
                getStoreData('userInfoState').then(userInfo => {
                    //插入主账户信息
                    modelArr.splice(0,0,{icon:'logoicon',title:'钱包余额',subTitle:userInfo.balance,
                    btType:'WALLET',selected:false});

                    let from = '钱包余额(￥' + userInfo.balance + ')';
                    titleArr.splice(0,0,from);//第一个位置插入一条数据

                    let modelItem = modelArr[1];
                    let to = modelItem.title + '(￥' + modelItem.subTitle + ')';

                    this.setState({gameList:modelArr,platFrom:from,platTo:to,platTitle:titleArr});
                });
            }

        }
    }

    _onChoosePlatFrom () {
        this._onChoosePlat('from');
    }

    _onChoosePlatTo () {
        this._onChoosePlat('to');
    }

    _onChoosePlat = (type) => {
        Keyboard.dismiss();
        if (this.state.gameList.length >0) {
            console.log('转账游戏');
            Picker.init({
                pickerData: this.state.platTitle,
                pickerConfirmBtnColor:[55,55,55,1],
                pickerCancelBtnColor:[88,88,88,1],
                pickerCancelBtnText:'',
                pickerConfirmBtnText:'确定',
                pickerTitleText:'转账游戏',
                pickerTextEllipsisLen:20,
                onPickerConfirm: data => {
                    console.log(data);
                    if (type == 'from') {
                        let from = data['0'];
                        let to;
                        let toIndex
                        if (from.indexOf('钱包余额') != -1) {
                            //选择钱包转出
                            toIndex = 1;
                        }else {
                            toIndex = 0;
                        }

                        let modelItem = this.state.gameList[toIndex];
                        to = modelItem.title + '(￥' + modelItem.subTitle + ')';

                        this.setState({platFrom:data['0'],platTo:to});

                    }else {
                        let to = data['0'];
                        let from;
                        let fromIndex
                        if (to.indexOf('钱包余额') != -1) {
                            //选择钱包转出
                            fromIndex = 1;
                        }else {
                            fromIndex = 0;
                        }

                        let modelItem = this.state.gameList[fromIndex];
                        from = modelItem.title + '(￥' + modelItem.subTitle + ')';

                        this.setState({platFrom:from,platTo:data['0']});
                    }

                },
                onPickerCancel: data => {
                    console.log(data);
                },
                onPickerSelect: data => {
                    console.log(data);

                }
            });
            Picker.show();
        }
    }

    _onChange = (label, value) => {
        this.setState({ [label]: value });
    };

    _onCommitTransfer (){
        if (this.state.platFrom.length == 0) {
            Alert.alert('请选择转出平台');
        }else if(this.state.platTo.length == 0){
            Alert.alert('请选择转入平台');
        }else if(this.state.money.length == 0){
            Alert.alert('请输入转入金额');
        }
        else if (parseInt(this.state.money)<1 || parseInt(this.state.money) > 10000) {
            Alert.alert('输入金额范围1~100000元');
        }else {
            console.log('验证完成，调用接口');
            let url;

            let modelIndex;
            if (this.state.platTo.indexOf('钱包余额') != -1) {
                url = 'transfer/TransferFrom';//转账到平台
                modelIndex = this.state.platTitle.indexOf(this.state.platFrom);
            }else {
                url = 'transfer/TransferTo';//转账到游戏
                modelIndex = this.state.platTitle.indexOf(this.state.platTo);
            }
            let modelItem = this.state.gameList[modelIndex];
            var inputMoney = this.state.money.replace(/a/g, ' ');//替换输入空格
            let params = {credit:inputMoney,isImgCode:'0',platCode:modelItem.btType,imgCode:''};

            http.post(url, params,true).then((res) => {
                if (res && res.status === 10000) {
                    let oData = res.data;
                    let fromBalance = transferMoneyFamat(oData.balance);
                    let toBalance = transferMoneyFamat(oData.wallet);
                    //修改本地数据金额
                    let gameListArr = this.state.gameList;
                    let titleArr = this.state.platTitle.slice(0);
                    if (this.state.platTo.indexOf('钱包余额') != -1) {
                        //传入平台为平台
                        //转账户
                        let transIndex1 = titleArr.indexOf(this.state.platFrom);
                        let modelTransItem = gameListArr[transIndex1];
                        modelTransItem.subTitle = fromBalance;
                        gameListArr.splice(transIndex1,1,modelTransItem);

                        //主账户
                        let transIndex2 = titleArr.indexOf(this.state.platTo);
                        let mainModel = gameListArr[transIndex2];
                        mainModel.subTitle = toBalance;
                        gameListArr.splice(transIndex2,1,mainModel);

                        let from = modelTransItem.title + '(￥' + modelTransItem.subTitle + ')';
                        let To = mainModel.title + '(￥' + mainModel.subTitle + ')';


                        titleArr.splice(transIndex1,1,from);
                        titleArr.splice(transIndex2,1,To);
                        //保存数据变化 并 清空输入金额
                        this.setState({money:'',gameList:gameListArr,platFrom:from,platTo:To,platTitle:titleArr});

                    }else {
                        //转账到游戏

                        //转账户
                        let transIndex2 = titleArr.indexOf(this.state.platTo);
                        let modelTransItem = gameListArr[transIndex2];
                        modelTransItem.subTitle = fromBalance;
                        gameListArr.splice(transIndex2,1,modelTransItem);

                        //主账户
                        let transIndex1 = titleArr.indexOf(this.state.platFrom);
                        let mainModel = gameListArr[transIndex1];
                        mainModel.subTitle = toBalance;
                        gameListArr.splice(transIndex1,1,mainModel);

                        let from = mainModel.title + '(￥' + mainModel.subTitle + ')';
                        let To = modelTransItem.title + '(￥' + modelTransItem.subTitle + ')';

                        titleArr.splice(transIndex1,1,from);
                        titleArr.splice(transIndex2,1,To);
                        //保存数据变化 并 清空输入金额
                        this.setState({money:'',gameList:gameListArr,platFrom:from,platTo:To,platTitle:titleArr});
                    }

                    TXAlert('转账成功！');
                }else {
                    if (res && res.msg) {
                        TXAlert(res.msg);
                    }else {
                        TXAlert('网络异常，请稍后重试');
                    }
                }
            }).catch(err => {
                console.error(err)
            });
        }
    };

    render() {
        return (
            <View style={{height:Dimensions.get('window').height,alignItems: 'center',backgroundColor:'#efeff4'}}>
                <View style={{paddingTop:10,height:35,width:Dimensions.get('window').width}}>
                    <Text style={{paddingLeft:10}}>平台选择</Text>
                </View>
                <TXInput label="转出平台" isUpdate={false} onClick={this._onChoosePlatFrom.bind(this)} showDetail={true} buttonFontSize={10} textAlign='right' onChange={(value) => this._onChange('platFrom', value)} value={this.state.platFrom || ''}/>
                <TXInput label="转入平台" isUpdate={false} onClick={this._onChoosePlatTo.bind(this)} showDetail={true} textAlign='right' onChange={(value) => this._onChange('platTo', value)} value={this.state.platTo || ''}/>
                <View style={{paddingTop:10,height:35,width:Dimensions.get('window').width}}>
                    <Text style={{paddingLeft:10}}>转账金额</Text>
                </View>
                <TXInput label="￥" forbiddenDot={true} onFocus={(e)=>{Picker.hide()}} labelTextStyle={{color:specialTextColor}} keyboardType = 'numeric' placeholder="请至少输入1元整数" textAlign='right' onChange={(value) => this._onChange('money', value)} value={this.state.money || ''}/>
                <View style={{paddingTop:20,alignItems: 'center'}}>
                    <TouchableOpacity  onPress={() => this._onCommitTransfer()}  activeOpacity={0.2} focusedOpacity={0.5}>
                     <View style=  {{borderRadius:10,borderWidth:1,borderColor:'#CFA359',borderStyle: 'solid',justifyContent:'center',alignItems:'center',width:Dimensions.get('window').width - 100,height:40,backgroundColor:'#CFA359'}}>

                        <Text style={{color:'#ffffff',fontSize:17}}>确认转账</Text>
                     </View>
                </TouchableOpacity>
                </View>
                <View style={{paddingTop:15,paddingLeft:10,flexDirection: 'column',justifyContent:'center',height:50,width:Dimensions.get('window').width}}>
                    <Text style={{fontSize:12,color:'#D62F27'}}>温馨提示</Text>
                    <Text style={{fontSize:10,color:'#8B8B8B'}}>平台转账只允许输入整数金额</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    Iuput_stype: {
        height: 100,
        backgroundColor:'#ffffff'
    },
});
