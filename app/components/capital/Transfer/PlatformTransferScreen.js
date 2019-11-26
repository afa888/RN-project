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
import MainTheme from "../../../utils/AllColor"
import {ThemeEditTextTextColor} from "../../../utils/AllColor"
import {money_validate} from "../../../utils/Validate";
import TXToastManager from "../../../tools/TXToastManager"

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
        this.state = {platFrom:'',platFromMoney:'',platTo:'',platToMoney:'',money:'',gameList:[],platTitle:[]};
    }

    componentDidMount () {
        //监听键盘弹起
        this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardWillShow.bind(this))
        //获取游戏列表
        this._gameList('true');
    }

    componentWillUnmount() {
        this.keyboardWillShowListener.remove();//删除订阅
    };

    _keyboardWillShow = (e) => {
        Picker.hide()
    }

    _gameList = (needNetStatus) => {
        let status = true;
        if (needNetStatus === 'false') {
            status = false;
        }
        http.get('transfer/transferGameList', null,status).then((res) => {
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
                    let from = '钱包余额';
                    let fromMoney = '￥' + balance;

                    let fromAll = '钱包余额(￥' + balance + ')';
                    titleArr.splice(0,0,fromAll);//第一个位置插入一条数据
                    let modelItem = modelArr[1];
                    let to = modelItem.title;
                    let toMoney ='￥' + modelItem.subTitle;
                    this.setState({gameList:modelArr,platFrom:from,platFromMoney:fromMoney,platTo:to,platToMoney:toMoney,platTitle:titleArr});
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

    _onChangePlatFromTo = () => {
        let from = this.state.platFrom;
        let fromMoney = this.state.platFromMoney;
        let to = this.state.platTo;
        let toMoney = this.state.platToMoney;

        this.setState({platFrom:to,platFromMoney:toMoney,platTo:from,platToMoney:fromMoney});
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
                        to = modelItem.title;
                        let toMoney = '￥' + modelItem.subTitle;

                        let fromAll = data['0'];
                        let fromTitle = fromAll.substring(0,fromAll.indexOf('(￥'));
                        let fromMoney = fromAll.substring(fromAll.indexOf('(￥')+1);
                        fromMoney = fromMoney.substring(0,fromMoney.length - 1);

                        this.setState({platFrom:fromTitle,platFromMoney:fromMoney,platTo:to,platToMoney:toMoney});

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
                        from = modelItem.title;
                        let fromMoney = '￥' + modelItem.subTitle;

                        let toAll = data['0'];
                        let toTitle = toAll.substring(0,toAll.indexOf('(￥'));
                        let toMoney = toAll.substring(toAll.indexOf('(￥')+1);
                        toMoney = toMoney.substring(0,toMoney.length - 1);

                        this.setState({platFrom:from,platFromMoney:fromMoney,platTo:toTitle,platToMoney:toMoney});
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

    /**
     * 一键回收
     */
    _receiveAll(){
        http.post('transfer/oneclickrecycling',null,true).then(res => {
            if(res.status === 10000){
                this._gameList('false');//重新获取资金数据
                // 更新本地缓存
                mergeStoreData('userInfoState',
                    { balance: wallet }).then(() => {
                    DeviceEventEmitter.emit('bindSuccess','更新钱包余额');
                });
            }
            TXToastManager.show(res.msg);
        })
    }

    /**
     * 转账
     */
    _onCommitTransfer (data){
        if (this.state.platFrom.length == 0) {
            Alert.alert('请选择转出平台');
        }else if(this.state.platTo.length == 0){
            Alert.alert('请选择转入平台');
        }else if(this.state.money.length == 0){
            Alert.alert('请输入转入金额');
        }else if(!money_validate(this.state.money)){
            TXToastManager.show('平台转账金额只能为数字');
        }
        else if (parseInt(this.state.money)<1 || parseInt(this.state.money) > 100000) {
            Alert.alert('输入金额范围1~100000元');
        }else {
            console.log('验证完成，调用接口');
            let url;

            let modelIndex;
            if (this.state.platTo.indexOf('钱包余额') != -1) {
                url = 'transfer/TransferFrom';//转账到平台
                let fromAll = this.state.platFrom + '(' + this.state.platFromMoney + ')';
                modelIndex = this.state.platTitle.indexOf(fromAll);
            }else {
                url = 'transfer/TransferTo';//转账到游戏
                let toAll = this.state.platTo + '(' + this.state.platToMoney + ')';
                modelIndex = this.state.platTitle.indexOf(toAll);
            }
            let modelItem = this.state.gameList[modelIndex];
            var inputMoney = this.state.money.replace(/a/g, ' ');//替换输入空格
            let params = {credit:inputMoney,isImgCode:'0',platCode:modelItem.btType,imgCode:''};

            http.post(url, params,true).then((res) => {
                if (res && res.status === 10000) {
                    
                    this.dealWithData(res.data);
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

    dealWithData = (oData) => {
        let fromBalance = transferMoneyFamat(oData.balance);
        let toBalance = transferMoneyFamat(oData.wallet);
        //修改本地数据金额
        let gameListArr = this.state.gameList;
        let titleArr = this.state.platTitle.slice(0);
        if (this.state.platTo.indexOf('钱包余额') != -1) {
            //传入平台为平台
            //转账户
            let allFrom = this.state.platFrom + '(' + this.state.platFromMoney + ')';
            let transIndex1 = titleArr.indexOf(allFrom);
            let modelTransItem = gameListArr[transIndex1];
            modelTransItem.subTitle = fromBalance;
            gameListArr.splice(transIndex1,1,modelTransItem);

            //主账户
            let allTo = this.state.platTo + '(' + this.state.platToMoney + ')';
            let transIndex2 = titleArr.indexOf(allTo);
            let mainModel = gameListArr[transIndex2];
            mainModel.subTitle = toBalance;
            gameListArr.splice(transIndex2,1,mainModel);

            let fromAll = modelTransItem.title + '(￥' + modelTransItem.subTitle + ')';
            let ToAll = mainModel.title + '(￥' + mainModel.subTitle + ')';


            let from = modelTransItem.title;
            let fromMoney ='￥' + modelTransItem.subTitle;

            let To = mainModel.title ;

            let ToMoney = '￥' + mainModel.subTitle;

            titleArr.splice(transIndex1,1,fromAll);
            titleArr.splice(transIndex2,1,ToAll);
            //保存数据变化 并 清空输入金额
            this.setState({money:'',gameList:gameListArr,platFrom:from,platFromMoney:fromMoney,platTo:To,platToMoney:ToMoney,platTitle:titleArr});

        }else {
            //转账到游戏

            //转账户
            let allTo = this.state.platTo + '(' + this.state.platToMoney + ')';
            let transIndex2 = titleArr.indexOf(allTo);
            let modelTransItem = gameListArr[transIndex2];
            modelTransItem.subTitle = fromBalance;
            gameListArr.splice(transIndex2,1,modelTransItem);

            //主账户
            let allFrom = this.state.platFrom + '(' + this.state.platFromMoney + ')';
            let transIndex1 = titleArr.indexOf(allFrom);
            let mainModel = gameListArr[transIndex1];
            mainModel.subTitle = toBalance;
            gameListArr.splice(transIndex1,1,mainModel);

            let fromAll = mainModel.title + '(￥' + mainModel.subTitle + ')';
            let ToAll = modelTransItem.title + '(￥' + modelTransItem.subTitle + ')';


            let from = mainModel.title ;
            let fromMoney = '￥' + mainModel.subTitle;
            let To = modelTransItem.title;
            let ToMoney = '￥' + modelTransItem.subTitle;

            titleArr.splice(transIndex1,1,fromAll);
            titleArr.splice(transIndex2,1,ToAll);
            //保存数据变化 并 清空输入金额
            this.setState({money:'',gameList:gameListArr,platFrom:from,platFromMoney:fromMoney,platTo:To,platToMoney:ToMoney,platTitle:titleArr});
        }
    }

    render() {
        return (
            <View style={{height:Dimensions.get('window').height,alignItems: 'center',backgroundColor:MainTheme.backgroundColor}}>
                <View style={{paddingTop:10,height:20,width:Dimensions.get('window').width}}>
                    
                </View>
                <View style={{height:35,width:Dimensions.get('window').width,flexDirection:'row',alignItems:'center'}}>
                    
                    <TouchableOpacity onPress={() => {
                        this._onChoosePlatFrom();
                    }}>
                        <View style={{paddingTop:10,height:35,marginLeft:10,borderBottomWidth: 0.5,borderBottomColor: MainTheme.lineBottomColor,width:Dimensions.get('window').width / 2 -27.5}}>
                            <Text>{this.state.platFrom}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        this._onChangePlatFromTo();
                    }}>
                        <Image source={require('../../../static/img/icon_hz.png')}
                               style={{
                                   resizeMode: 'contain',
                                   width: 35,
                                   height: 35,
                               }}/>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        this._onChoosePlatTo();
                    }}>
                        <View style={{paddingTop:10,height:35,marginRight:10,borderBottomWidth: 0.5,borderBottomColor: MainTheme.lineBottomColor,width:Dimensions.get('window').width / 2 -37.5}}>
                            <Text style={{textAlign:'right'}}>{this.state.platTo}</Text>
                        </View>
                    </TouchableOpacity>
                    
                </View>
                <View style={{marginTop:10,height:25,width:Dimensions.get('window').width,flexDirection:'row',alignItems:'center'}}>
                    
                    <View style={{height:25,marginLeft:10,width:Dimensions.get('window').width / 2 - 10}}>
                        <Text style={{color:MainTheme.DarkGrayColor}}>{this.state.platFromMoney}</Text>
                    </View>

                    <View style={{height:25,marginRight:10,width:Dimensions.get('window').width / 2 -20}}>
                        <Text style={{color:MainTheme.DarkGrayColor,textAlign:'right'}}>{this.state.platToMoney}</Text>
                    </View>
                    
                </View>
                <TXInput label="￥" forbiddenDot={true} onFocus={(e)=>{Picker.hide()}} labelTextStyle={{fontSize:17,color:specialTextColor}} keyboardType = 'numeric' placeholder="请至少输入1元整数" textAlign='right' onChange={(value) => this._onChange('money', value)} value={this.state.money || ''}/>
                <View style={{paddingTop:10,paddingLeft:10,flexDirection: 'row',justifyContent:'flex-start',height:50,width:Dimensions.get('window').width}}>
                    <View style={{flexDirection: 'row',width:Dimensions.get('window').width / 2}}>
                        <Text style={{fontSize:12,color:'#8B8B8B'}}>平台转账必须为</Text>
                        <Text style={{fontSize:12,color:'#D62F27'}}>整数</Text>
                    </View>
                    <View style={{flexDirection: 'row',justifyContent:'flex-end',width:Dimensions.get('window').width / 2 - 20}}>
                        <TouchableOpacity onPress={() => {
                            let transMoney = this.state.platFromMoney;
                            transMoney = transMoney.substring(1);
                            this.setState({money:transMoney});
                        }}>
                            <View style={{paddingRight:10}}>
                                <Text style={{fontSize:12,color:MainTheme.commonButtonBGColor}}>全部</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                

                {MainTheme.renderCommonSubmitButton(this._onCommitTransfer.bind(this,this.state),'立即转账')}

                {MainTheme.renderCommonCancelButton(this._receiveAll.bind(this),'一键回收')}
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
