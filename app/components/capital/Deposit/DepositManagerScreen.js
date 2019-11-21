import React, {Component} from 'react';
import {SafeAreaView,Platform,TouchableOpacity, StyleSheet, Text, View, Button, Alert, Image,StatusBar} from 'react-native';
import Dimensions from 'Dimensions'
import { ImageBackground,Swiper,ActivityIndicator,FlatList,ScrollView,RefreshControl} from 'react-native';
import TXInput from "../../../tools/TXInput"
import FastImage from 'react-native-fast-image'
import SegmentedControlTab from 'react-native-segmented-control-tab'
import DepositPayCommonView from './DepositPayCommonView';
import PayBank from './DepositPayBankView';
import PayScan from './DepositPayScanView';
import httpBaseManager from '../../../http/httpBaseManager'
import {BASE_URL, CAGENT} from "../../../utils/Config";
import http from '../../../http/httpFetch'
import {Reg_chineseName_validate,money_validate} from "../../../utils/Validate";
import {TXAlert} from "../../../tools/TXAlert"
import { NavigationActions } from 'react-navigation';
import TXToastManager from "../../../tools/TXToastManager"
import Picker from 'react-native-picker';
import MainTheme from "../../../utils/AllColor"
import {ThemeEditTextTextColor} from "../../../utils/AllColor"
import Tips from './DepositTipsView'

var payTypeList = [
    "网银转账", "支付宝", "财付通", "微信", "ATM自动柜员机", "ATM现金入款", "银行柜台"
]

export default class DepositManagerScreen extends Component<Props> {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
          title: '充值',
          headerBackTitle:null,
          headerTitleStyle:{flex:1, textAlign: 'center'},//解决android 标题不居中问题
          headerLeft: (

            <TouchableOpacity onPress={() => {
                    Picker.hide()
                    if (params.hasOwnProperty('isNotFromHome')) {
                        //来自个人中心或者取款界面
                        navigation.dispatch(NavigationActions.back());
                    }else {
                        navigation.navigate('Home')//从 底部点击 第一层级
                    }

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
          headerRight: (
            <View style={{width:70,flexDirection:'row',alignItems:'center'}}>
                <TouchableOpacity onPress={() => {
                    Picker.hide()
                    navigation.navigate('FundRecord')
                }}>
                    <View style={{alignItems:'center',width:30}}>
                        <Image source={require('../../../static/img/nav_icon_jilu_nor.png')}
                           style={{
                               width: 20,
                               height: 20,
                           }}/>
                        <Text style={{fontSize:10,color:ThemeEditTextTextColor}}>记录</Text>
                    </View>
                    
                </TouchableOpacity>
                <View style={{width:5}}></View>
                <TouchableOpacity onPress={() => {
                    Picker.hide()
                    navigation.navigate('CustomerService')
                }}>
                    <View style={{alignItems:'center',width:30}}>
                        <Image source={require('../../../static/img/nav_icon_kefu_nor.png')}
                           style={{
                               width: 20,
                               height: 20,
                           }}/>
                        <Text style={{fontSize:10,color:ThemeEditTextTextColor}}>客服</Text>
                    </View>
                    
                </TouchableOpacity>
            </View>
            
          ),
        };
      };

    constructor(props){
        super(props);
        this.state = {isLoading: true,isRefreshing:false,selectedIndex:0,scanSelectedIndex:0,payTypeSelectedIndex:0,orderNum:'',payType:'bank',data:[],method:payTypeList[0],money:'',name:'',handsel:0};
    }

    componentWillMount () {


    }
    //获取支付渠道
    getPaymentChannel () {
        http.get('deposit/getPaymentChannelList/1', null).then((res) => {
            console.log('加载完成');
            if (res.status === 10000) {
                let dataArr = res.data;
                if (dataArr && dataArr.length > 0) {
                    this.setState({
                    //复制数据源
                  //  dataArray:this.state.dataArray.concat( responseData.results),
                        data:dataArr,
                        isLoading: false,
                        isRefreshing:false,
                        currentPayModel:dataArr[0]
                    });
                    this.clickItem(dataArr[0],0);
                }else {
                    TXAlert('没有配置支付渠道，请联系客服');
                }


            }else {
                if (!res) {
                    TXAlert('网络异常，请稍后重试');
                }else {
                    TXAlert(res.msg);
                }
            }
        }).catch(err => {
            console.error(err)
        });
    }

    componentDidMount () {
        this.getPaymentChannel();
        httpBaseManager.baseRequest();
    }

    _onChange = (label, value) => {
        this.setState({ [label]: value });
    };

    _showAddBank () {
        alert('开发中');
    }

    //付款成功
    _onDrawFeeAlert = (showMeg) => {
        Alert.alert('温馨提示', showMeg, [{
                        text: '联系在线客服', onPress: () => {
                            this._onShowCustomer();
                        }
                    },{
                        text: '知道了', onPress: () => {

                        }
                    }], {cancelable: false});
    }

    //操作数据还原
    _onClearInput = ()=> {
        this.setState({money:'',name:'',orderNum:'',scanSelectedIndex:0,payTypeSelectedIndex:0});
    }

    //下拉刷新
    handleRefresh = () => {
        this.setState({
            isRefreshing:true,//tag,下拉刷新中，加载完全，就设置成flase
            data:[]
        });
        this.getPaymentChannel()
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

    //提交支付请求
    _onCommitWithdrawal = () => {
        if (this.state.payType == 'bank') {
            //银行汇款
            let cagentBankCardEntity = this.state.currentPayModel.cagentBankCardEntity;
            if (this.state.name.length < 2 || this.state.name.length > 10) {
                TXToastManager.show('请输入付款人真实姓名');
            }else if(!Reg_chineseName_validate(this.state.name)){
                TXToastManager.show('真实姓名只能为中文');
            }else if(this.state.money.length ==0){
                TXToastManager.show('请输入存款金额');
            }else if(!money_validate(this.state.money)){
                TXToastManager.show('存款金额只能为数字');
            }
            else if(cagentBankCardEntity.hasOwnProperty('minquota') && (parseInt(this.state.money) < parseInt(cagentBankCardEntity.minquota) || parseInt(this.state.money) > parseInt(cagentBankCardEntity.maxquota))){
                TXToastManager.show('单笔限额为'+ cagentBankCardEntity.minquota +'~'+ cagentBankCardEntity.maxquota +'元');
            }else {
                //验证通过 调用提交银行汇款接口
                this._onRequestWithBank();
            }


        }else if(this.state.payType == 'scan') {
            let payModel = this.state.currentPayModel.cagentPayerPOList[this.state.scanSelectedIndex];
            let money = this.state.money;
            if (this.state.orderNum.length == 0) {
                TXToastManager.show('请输入订单号');
            }else if(this.state.orderNum.length != 4){
                TXToastManager.show('请输入订单号后四位');
            }else if(money.length ==0) {
                TXToastManager.show('请输入存款金额');
            }else if(!money_validate(this.state.money)){
                TXToastManager.show('存款金额只能为数字');
            }else if(parseInt(money) < parseInt(payModel.minquota) || parseInt(money) > parseInt(payModel.maxquota)){
                TXToastManager.show('单笔限额为'+ payModel.minquota +'~'+ payModel.maxquota +'元');
            }else {
                //验证通过 调用提交扫码支付接口
                this._onRequestWithScan();
            }
        }else if(this.state.payType == 'commonpay'){
            if (this.state.currentPayModel.cagentPayerPOList.length > 0) {
                //有支付通道
                let payModel = this.state.currentPayModel.cagentPayerPOList[this.state.payTypeSelectedIndex];
                let money = this.state.money;
                if (this.state.money.length == 0) {
                    let msg;
                    if (payModel.amounts && payModel.amounts.length > 0) {
                        msg = '请选择存款金额';
                    }else {
                        msg = '请输入存款金额';
                    }
                    TXToastManager.show(msg);

                }else if(!money_validate(this.state.money)){
                    TXToastManager.show('存款金额只能为数字');
                }else if(payModel.hasOwnProperty('minquota') && (parseInt(money) < parseInt(payModel.minquota) || parseInt(money) > parseInt(payModel.maxquota))){
                    TXToastManager.show('单笔限额为'+ payModel.minquota +'~'+ payModel.maxquota +'元');
                }else {
                    //调用通用支付渠道付款接口
                    this._onRequestWithCommonPay();
                }
            }
        }
    };

    //常规支付
    _onRequestWithCommonPay = () => {
        //
        let payModel = this.state.currentPayModel.cagentPayerPOList[this.state.payTypeSelectedIndex];

        let prams = {
                payId : payModel.payId,
                scancode : this.state.currentPayModel.code,
                acounmt : this.state.money,
                terminalType : '1'
            };

        http.post('deposit/scanPay', prams, true).then(res => {
            if(res.status === 10000){
                let oData = res.data;
                /*oData = {resType:'2',data:'https://github.com/cssivision/react-native-qrcode',
                    amount:'1009',orderNo:'RNX01231231233221',userName:'TXWyuhe001'
                };*/
                this.props.navigation.navigate('DepositPayResultScreen',{title:this.state.method,data:oData});

                this._onClearInput();
            }else {
                //异常提示
                let msg = res.msg ? res.msg : '支付失败';
                TXAlert(msg);
            }
        });
    }

    //扫码支付
    _onRequestWithScan = () => {

        let payModel = this.state.currentPayModel.cagentPayerPOList[this.state.scanSelectedIndex];

        let prams = {
                id : payModel.id,
                orderNum : this.state.orderNum,
                amount : this.state.money,
                paymentName : payModel.paymentName
            };

        http.post('deposit/qrCodeOrder', prams, true).then(res => {
            if(res.status === 10000){
                setTimeout(() =>{
                    this._onDrawFeeAlert('提交成功！如有疑问，请及时联系在线客服确认存款信息，谢谢！');
                },600)
                // this._onClearInput();
                this.setState({money:'',name:'',orderNum:'',payTypeSelectedIndex:0});//
            }else {
                //异常提示
                TXAlert(res.msg);
            }
        });
    }

    //银行汇款支付
    _onRequestWithBank = () => {
        let bankInfo = this.state.currentPayModel.cagentBankCardEntity;
        if (!bankInfo || bankInfo.length ==0) {
            Alert.alert('未获取到网银银行卡信息');
        }else {

            let payTypeList = ["网银转账", "支付宝", "财付通", "微信", "ATM自动柜员机", "ATM现金入款", "银行柜台"];
            let typeIndex = payTypeList.indexOf(this.state.method);

            let prams = {
                cagent: CAGENT,
                id : bankInfo.id,
                name : this.state.name,
                amount : this.state.money,
                type : String(typeIndex + 1),
                handsel : String(this.state.handsel)
            };

            http.post('deposit/outlineBankPay', prams, true).then(res => {
            if(res.status === 10000){
                let oData = res.data;
                this.props.navigation.navigate('DepositBankTransferScreen',
                {transferType:this.state.method,transferAmount:this.state.money,orderNumber:oData.orderNo,
                orderTime:this.getmyDate(),
                cagentBankCardEntity:{bankname:bankInfo.bankname,cardno:bankInfo.cardno,
                realname:bankInfo.realname,bankaddress:bankInfo.bankaddress}});
                this._onClearInput();
            }else {
                //异常提示
                let msg = res.msg ? res.msg : '支付失败';
                TXAlert(msg);
            }
        });
        }
    }

    getmyDate() {
        var date = new Date();

        var year = date.getFullYear().toString();
        var month = (date.getMonth()+1).toString();
        var day = date.getDate().toString();
        var hour =  date.getHours().toString();
        var minute = date.getMinutes().toString();

        return year+'-'+month+'-'+day+' '+' '+hour+':'+minute;
    };

    _onChangePayMethod = (index,value) => {
        let payMethod;
        let isPayBank = false;
        let payName = value.name;
        if (value.code == "obank") { //网银
            payMethod = 'bank';
            isPayBank = true;
        }else if (value.code == "scan") {//扫码支付
            payMethod = 'scan';
        }else if (value.code =="ysfscan") { //云闪付扫码
            payMethod = 'scan';
        }else {
            payMethod = 'commonpay';
        }

        if (value.code == 'ali') {
            payName = '支付宝支付';//支付宝支付 在结果页面有特殊处理
        }

        if (isPayBank) {
            this.setState({'payType':payMethod,method:payTypeList[0]});
        }else {
            this.setState({'payType':payMethod,method:payName});
        }

    }

     _onShowCustomer = () => {
        this.props.navigation.navigate('CustomerService')
        
    }

    _onShowHelpPage = () => {
        this.props.navigation.navigate('HelpScreen')
    }

    //不同支付类型显示不同操作方式
    renderFooter = () => {
        if (this.state.payType == 'bank') {
            return (
                <View style={{paddingTop:10}}>
                    <PayBank payModel={this.state.currentPayModel.cagentBankCardEntity} onShowCustomer={this._onShowCustomer} onShowHelp = {this._onShowHelpPage} onChange={this._onChange} params={this.state} />
                </View>
            );
        }else if(this.state.payType == 'scan') {
            return (
                <View style={{paddingTop:10}}>
                    <PayScan onShowCustomer={this._onShowCustomer} onShowHelp = {this._onShowHelpPage} onChange={this._onChange} params={this.state} />
                </View>
            );
        }else {
            return (
                <View style={{paddingTop:10}}>
                     <DepositPayCommonView onShowCustomer={this._onShowCustomer} onShowHelp = {this._onShowHelpPage} onChange={this._onChange} params={this.state} />
                </View>
            );
        }
    }

    renderData() {
        return (
        <View style={{flex: 1}}>
            <ScrollView style={{height:Dimensions.get('window').height - 200,backgroundColor:MainTheme.backgroundViewColor}}>

                <View style={{alignItems: 'center',backgroundColor:MainTheme.backgroundViewColor}}>
                    <View style={{paddingTop:15,height:35,width:Dimensions.get('window').width}}>
                        <Text style={{paddingLeft:10}}>支付方式</Text>
                    </View>

                    <FlatList
                        // numColumns={2}
                        style={[styles.flatListStyle]}
                        data={this.state.data}
                        renderItem={this.renderItem.bind(this)}
                        keyExtractor={this._keyExtractor}
                        // ListFooterComponent={this.renderFooter}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
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
                <View style={{height:10,width:Dimensions.get('window').width}}></View>
                {this.renderFooter()}
                
                
            </ScrollView>

                <View style={{ position:'absolute',bottom: 0}}>
                    
                    {MainTheme.renderCommonBottomSubmitButton(this._onCommitWithdrawal)}
                </View>
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

    //此函数用于为给定的item生成一个不重复的key
    _keyExtractor = (item, index) => index;

    //列表的头部
    ListHeaderComponent() {
        return (
            <View></View>
        )
    }

    //获取不同支付渠道图片

    gerChannelPic = (item) => {
        if (item.code === 'bank') {
            //网银
            return require('../../../static/img/recharge_icon_wy.png');
        }else if(item.code === 'yl'){
            //银联扫码
            return require('../../../static/img/recharge_icon_ylsm.png');
        }else if(item.code === 'wx'){
            //微信
            return require('../../../static/img/recharge_icon_wx.png');
        }else if(item.code === 'ali'){
            //支付宝
            return require('../../../static/img/recharge_icon_aply.png');
        }else if(item.code === 'cft'){
            //财付通
            return require('../../../static/img/recharge_icon_cftzf.png');
        }else if(item.code === 'jd'){
            //京东
            return require('../../../static/img/recharge_icon_jdzf.png');
        }else if(item.code === 'scan'){
            //扫码支付
            return require('../../../static/img/recharge_icon_sm.png');
        }else if(item.code === 'obank'){
            //银行汇款
            return require('../../../static/img/recharge_icon_yhhk.png');
        }else if(item.code === 'kj'){
            //快捷
            return require('../../../static/img/recharge_icon_kjzf.png');
        }else if(item.code === 'ysf'){
            //云闪付
            return require('../../../static/img/recharge_icon_ysf.png');
        }else if(item.code === 'ysfscan'){
            //云闪付扫码
            return require('../../../static/img/recharge_icon_ysfsm.png');
        }else if(item.code === 'btb'){
            //比特不支付
            return require('../../../static/img/recharge_icon_btb.png');
        }
    }

    //列表的每一行
    renderItem({item,index}) {
        const bdColor = index == this.state.selectedIndex ?  '#CFA359' : '#8B8B8B'
        let imgUrl = this.gerChannelPic(item,index);
        var data={src:imgUrl}
        return (
            <View style={{width: 110,
                backgroundColor: MainTheme.backgroundViewColor,alignItems: 'center',
                height: 60}}>
                <TouchableOpacity
                    onPress={() => this.clickItem(item,index)}>
                        <View style={{width: 110,height:60,flexDirection:'row'}}>
                            
                            <Image 
                            source={data.src} 
                            style={{
                                    marginLeft: 0,
                                    marginTop:8,
                                    width: 100,
                                    height: 52
                                }} 
                            />
                            <View style={{marginLeft:89,position: 'absolute',color:'red',width:21,height:21,justifyContent:'flex-end'}}>{index == this.state.selectedIndex ? <Image source={require('../../../static/img/icon_xuanze.png')} style={{width: 21,height: 21,alignItems:'flex-end'}} /> : null}</View>
                        </View>
                    
                </TouchableOpacity>
            </View>
        )
    }
    //绘制列表的分割线
    renderItemSeparator(){

    }

    //点击列表点击每一行
    clickItem(item,index) {
        this.setState({selectedIndex:index,currentPayModel:this.state.data[index],
            money:'',payTypeSelectedIndex:0,scanSelectedIndex:0,orderNum:'',name:''
        });
        /*this.setState({currentPayModel:this.state.data[index]});

        this.setState({'money':''});//清空选择/输入的金额
        this.setState({payTypeSelectedIndex:0});//充值默认选择的支付方式*/

        this._onChangePayMethod(index,item);
    }

    _onEndReached(){
        //如果是正在加载中或没有更多数据了，则返回
    }


}

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 0,
    flex:1
  },
  container: {
    alignItems: 'center',
    justifyContent:'center',

  },
  flatListStyle:{
    color:'red',
    fontSize:16,
    paddingTop:5,
  }
});


