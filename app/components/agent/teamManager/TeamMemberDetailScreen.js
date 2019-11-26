import React, { Component } from 'react';
import {
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Modal,
    SafeAreaView,
} from "react-native";
import {
    category_group_divide_line_color,
    MainTheme,
} from "../../../utils/AllColor"
import http from "../../../http/httpFetch";
import Toast from "react-native-easy-toast";
import Picker from 'react-native-picker';
import { Calendar, CalendarList, Agenda, LocaleConfig } from 'react-native-calendars';
import deviceValue from "../../../utils/DeviceValue";
import TXTools from '../../../utils/Htools';
import CalendarDialog from "../../../customizeview/CalendarDialog";


let pageSize = 1;
let total = 0;
let oldIndex = 10;
let isStartTag = true;
let selectDetailIndex = -1


export default class TeamMemberDetailScreen extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
            isDialogVisible: false,
            teamPeopleCount:56,
            refreshing: false,
            isLoreMoreing: 'LoreMoreing',
            listPosition: 0,
            data: [],
            total: 0,
            index: 0,
            agencyLevl:'',
            uid:'',
            directUserNum:0,
            totalCommission:0,
        };
    }

    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        return {
            headerTitle: (
                MainTheme.renderCommonTitle(navigation.state.params.data.username)
            ),
            headerLeft: (
                MainTheme.renderCommonBack(navigation)
            )
        };
    };

    componentWillMount() {
        oldIndex = 0
    }

    componentDidMount() {
        let data  = this.props.navigation.state.params.data;

        this.setState({uid:data.uid,agencyLevl:data.agencyTypeName,
            directUserNum:data.directUserNum,totalCommission:data.totalCommission});
        this.refreshData()
    }

    componentWillUnmount() {
    }

    //http://m.txbet1788.com/TXW/User/queryByTreasurePage
    refreshData = () => {
        pageSize = 1;
        this.setState({
            refreshing: true,
            data: []
        });
        this.postList()
    }
    postList = () => {
        let prams = {
            pageNo: pageSize,
            pageSize: 20,
            uid:this.props.navigation.state.params.data.uid,
        };
        let dicountList = [];
        http.get('agency/getCommissionDetails', prams).then(res => {
            console.log(res);
            this.setState({ refreshing: false })
            if (res.status === 10000) {
                total = res.data.total
                this.isLoreMore = false;
                if (pageSize > 1) {
                    if (res.data.list !== null) {
                        let more = this.state.data;
                        console.log("长度 " + res.data.list.length)
                        if (res.data.list.length > 0) {
                            for (var i = 0; i < res.data.list.length; i++) {
                                more.push(res.data.list[i])
                            }
                        }
                        this.setState({
                            data: more,
                        });
                    }

                } else {
                    this.setState({
                        data: res.data.list,
                    });
                }
                console.log("data")
                console.log(res.data.list)
            }
        }).catch(err => {
            console.error(err)
        });
    }

    renderHeader = () => {
        return (
            <View>
                
                <View style={{...styles.recordItemCellContainer}} >
                <View style={{marginLeft:20,marginRight:20,marginTop:10,width:deviceValue.windowWidth - 40,height:60,position:'absolute',backgroundColor:MainTheme.AgentInfoBGColor}}></View>
                    <Image source={require('../../../static/img/administer_icon_date.png')}
                        style={styles.recordItemCellLeftImage} />
                    <View style={styles.recordItemCelCenterPanel}>
                        <Text style={styles.recordItemCellTitle}>日期</Text>
                        <Text style={{...styles.recordItemCellDate,color: MainTheme.DarkGrayColor,marginBottom: 10}}>承担扣除费用</Text>
                    </View>
                    <View style={styles.recordIetmCellRightPanel}>
                        <Text style={{...styles.recordItemCellTitle,color: MainTheme.DarkGrayColor}}>
                            有效投注额汇总
                        </Text>
                        <Text style={{...styles.recordItemCellType,color: MainTheme.DarkGrayColor,marginBottom: 10}}>输赢额汇总</Text>
                    </View>
                    <View style={styles.recordIetmCellDetailPanel}>
                        <Text style={{...styles.recordItemCellTitle,color: MainTheme.DarkGrayColor}}>
                            实际获得佣金
                        </Text>
                        <Text style={{...styles.recordItemCellType,color: MainTheme.DarkGrayColor,marginBottom: 10}}>实际产出佣金</Text>
                    </View>
                </View>
            </View>
            );
    }

    renderFooter = () => {

        if (this.state.data.length > 15 && this.state.isLoreMoreing == 'LoreMoreing') {
            return (
                <View style={{
                    height: 44,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text>{'正在加载....'}</Text>
                </View>
            )
        } else if (this.state.isLoreMoreing == 'LoreMoreEmpty' && this.state.data.length >= 10) {
            return (
                <View style={{
                    height: 44,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text>{'没有更多了'}</Text>
                </View>
            )
        } else {
            return null
        }

    }

    isLoreMore = false;
    LoreMore = () => {
        if (this.isLoreMore == false) {
            if (this.state.data.length >= total) {
                this.setState({
                    isLoreMoreing: 'LoreMoreEmpty'
                })
                return
            }
            this.setState({
                isLoreMoreing: 'LoreMoreing',
            });
            this.isLoreMore = true;
            pageSize++
            console.log("耶稣pageSize=  " + pageSize)
            this.postList()
        }
    }
    /**
     * 渲染每条记录
     */
    renderItem = ({ item, index }) => {
        return (
            <View>
                {/* 上半部分：记录的基本信息 */}
                <TouchableOpacity style={styles.recordItemCellContainer}
                    onPress={() => this.onRecordItemPressed(item, index)} >
                    {/* 最左侧小图标 */}
                    <Image source={this.getIconForItem(item)}
                        style={styles.recordItemCellLeftImage} />
                    {/* 左部分：日期/承担扣除费用 */}
                    <View style={styles.recordItemCelCenterPanel}>
                        <Text style={styles.recordItemCellTitle}> {item.outputCommissionDate} </Text>
                        <Text style={styles.recordItemCellDate}> {item.deductibleExpenses} </Text>
                    </View>
                    {/* 中间：有效投注额汇总/输赢额汇总 */}
                    <View style={styles.recordIetmCellRightPanel}>
                        <Text style={{...styles.recordItemCellTitle, color:MainTheme.DarkGrayColor}}>
                            {item.validBetAmount}
                        </Text>
                        <Text style={{...styles.recordItemCellType,color: this.getAmountColorForItem(item)}}>{item.winLoss}</Text>
                    </View>
                    <View style={styles.recordIetmCellDetailPanel}>
                        <Text style={{...styles.recordItemCellTitle,color: MainTheme.FundGreenColor}}>
                            {TXTools.formatMoneyAmount(item.sumCommission, false,false)}
                        </Text>
                        <Text style={{...styles.recordItemCellType,color: MainTheme.ThemeEditTextTextColor,marginBottom: 10}}>{item.outputCommission}</Text>
                    </View>
                </TouchableOpacity>
                
            </View>
        )
    }

    /*分割线*/
    separatorComponent = () => {
        return <View style={{
            marginLeft: 15,
            marginRight: 15,
            height: 0.5,
            backgroundColor: MainTheme.DivideLineColor
        }} />
    }

    /**
     * 根据记录的会员类型返回对应的图标
     */
    getIconForItem = (item) => {
        return require('../../../static/img/administer_icon_date.png');
    }


    /**
     * 会员累计产出佣金
     */
    getAllMoney = (item) => {
        return TXTools.formatMoneyAmount(item.totalCommission, false);
    }

    /**
     * 根据记录的type及amount返回相应的字体颜色
     */
    getAmountColorForItem = (item) => {

        let status = item.winLoss;
        if (status < 0) {
            return MainTheme.theme_color;
        }
        
        return MainTheme.FundGreenColor;
    }
    /**
     * 响应记录被点击事件
     */
    onRecordItemPressed = (item, index) => {
        let clickData = []
        for (var i = 0; i < this.state.data.length; i++) {
            clickData[i] = this.state.data[i]
            if (i === index) {
                if (clickData[i].select !== undefined) {
                    clickData[i].select = !clickData[i].select;
                } else {
                    var key = "select";
                    var value = true

                    var key2 = "key"
                    var value2 = i
                    clickData[i][key2] = value2;
                    clickData[i][key] = value;
                }

            } else {
                if (clickData[i].select !== undefined) {
                    clickData[i].select = false;
                } else {
                    var key = "select";
                    var value = false

                    var key2 = "key"
                    var value2 = i
                    clickData[i][key2] = value2;
                    clickData[i][key] = value;
                }
            }
        }
        this.setState({ data: clickData });
    }

    onshowTeamList = () => {
        if (this.state.directUserNum > 0) {
            this.props.navigation.navigate('TeamMemberScreen',{data:this.props.navigation.state.params.data});
        }
        
    }

    /**
     * 渲染记录筛选的条件
     */
    renderFilter = () => {
        return (
            <View style={{...styles.betTimeContainer,backgroundColor:MainTheme.theme_color}}>
                <View style={styles.renderFilterView}>
                    <Text style={{color:MainTheme.SubmitTextColor,fontSize:15}}>{this.props.navigation.state.params.data.topUserName}</Text>
                    <View style={{height:10,width:20}}></View>
                    <Text style={{color:MainTheme.AgentLevelTextColor,fontSize:12}}>上级id</Text>
                </View>
                <View style={{...styles.renderFilterView,marginRight:20}}>
                    <Text style={{color:MainTheme.SubmitTextColor,fontSize:15}}>{TXTools.formatMoneyAmount(this.state.totalCommission, false)}</Text>
                    <View style={{height:10,width:20}}></View>
                    <Text style={{color:MainTheme.AgentLevelTextColor,fontSize:12}}>累计提供</Text>
                </View>
            </View>
        );
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.renderFilter()}

                <FlatList
                    numColumns={1}
                    style={{ backgroundColor: 'white' }}
                    data={this.state.data}
                    ListHeaderComponent={this.renderHeader}
                    ListFooterComponent={this.renderFooter}//尾巴
                    keyExtractor={item => item.key}//这里要是使用重复的key出现莫名其妙的错误
                    enableEmptySections={true}//数据可以为空
                    renderItem={this.renderItem}
                    onEndReachedThreshold={0.2}//执行上啦的时候10%执行
                    onEndReached={() => {
                        this.LoreMore()
                    }}
                    ListEmptyComponent={this.emptyComponent()}
                    ItemSeparatorComponent={this.separatorComponent} // 分割线
                    refreshControl={<RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.refreshData}
                        title="Loading..." />}
                />

            </View>
        );
    }

    emptyComponent = () => {
        return <View style={styles.emptyView}>
            <View style={{ alignItems: 'center' }}>
                <Image
                    source={require('../../../static/img/nodata.png')}
                    style={{
                        resizeMode: 'contain',
                        width: deviceValue.windowWidth * 0.4,
                        height: deviceValue.windowWidth * 0.4,
                        marginRight: 6,
                        padding: 3
                    }} />
                <Text style={{
                    fontSize: 16
                }}>暂无数据</Text>
            </View>

        </View>
    }
}

const styles = StyleSheet.create({
    betTimeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 70,
        alignItems: 'center',
        marginTop: 5,
        backgroundColor: MainTheme.theme_color,
    },

    renderFilterView:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'column',
        marginLeft:20,
        borderWidth:0.5,
        borderRadius:4,
        height:50,
        borderColor:MainTheme.SubmitTextColor
    },

    timeTextContainer: {
        backgroundColor: '#EEEEEE',
        borderColor: '#EEEEEE',
        borderWidth: 0.5,
        borderRadius: 4,
    },

    timeText: {
        color: MainTheme.DarkGrayColor,
        fontSize: 12,
        padding: 6,
        marginLeft: 12,
        marginRight: 12,
    },

    timeSelectContainer: {
        backgroundColor: MainTheme.SpecialColor,
        borderColor: MainTheme.SpecialColor,
        borderWidth: 0.5,
        borderRadius: 4,
    },

    timeSelectText: {
        color: MainTheme.SubmitTextColor,
        fontSize: 12,
        fontWeight: 'bold',
        padding: 6,
        marginLeft: 12,
        marginRight: 12,
    },

    timeDividerView: { backgroundColor: category_group_divide_line_color, height: 1, width: deviceValue.windowWidth },
    choiceTimeDividerView: { backgroundColor: 'white', height: 1, width: deviceValue.windowWidth * 0.6, marginRight: 12 },
    right_item_view: {
        height: 85,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginLeft: 12
    },
    itemTextRemark: { marginRight: 6, color: 'black', padding: 3, fontSize: 12, height: 25 },
    emptyView: {
        flex: 1,
        width: deviceValue.windowWidth,
        height: deviceValue.windowHeight * 0.6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    recordItemCellContainer: {
        width: deviceValue.windowWidth,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: MainTheme.BackgroundColor,
        alignItems: 'center',
        padding: 3
    },

    recordItemCellLeftImage: {
        marginLeft: 20,
        marginTop: 10,
        marginRight: 5,
        alignSelf: 'flex-start',
    },

    

    recordItemCellTitle: {
        color: MainTheme.DarkGrayColor,
        marginTop: 10,
        marginBottom: 10,
        fontSize: 12,
    },

    recordItemCellDate: {
        fontSize: 12,
        color: MainTheme.GrayColor,
        marginBottom: 5,
    },

    recordItemCelCenterPanel: {
        flex: 1,
        width: (deviceValue.windowWidth - 40) / 3 - 60,
    },

    recordIetmCellRightPanel: {
        flex: 1,
        width: (deviceValue.windowWidth- 40) / 3 + 20,
    },

    recordIetmCellDetailPanel: {
        width: (deviceValue.windowWidth- 40) / 3 - 20,
        marginRight:20,
    },

    recordItemCellAmount: {
        fontSize: 12,
    },

    recordItemCellType: {
        fontSize: 12,
    },
    // 记录的下半部分（详细信息)的背景
    recordItemCellDetailsPanel: {
        backgroundColor: MainTheme.LightGrayColor,
        padding: 6,
        marginLeft: 15,
        marginRight: 15,
    },

    modalRightContainer: {
        flex: 7,
        backgroundColor: MainTheme.BackgroundColor,
        alignItems: 'flex-start',
    },

    modalRightTitle: {
        marginTop: 20,
        marginLeft: 10,
        fontSize: 15,
        color: MainTheme.DarkGrayColor,
    },

    modalRightSubtitle: {
        fontSize: 14,
        color: MainTheme.DarkGrayColor,
    },

    modalTimePeriodContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 15,
        marginLeft: 10,
    },

    modalFilterOptionContainer: {
        width: deviceValue.windowWidth * 0.2,
        marginRight: 5,
        marginLeft:5,
        marginBottom: 10,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius:4,
    },

    modalFilterViewStyle: {
        width: deviceValue.windowWidth * 0.2,
        alignItems:'center',
        height:30,
        justifyContent:'center',
        backgroundColor: '#EEEEEE',
    },
    modalFilterSelectedViewStyle: {
        width: deviceValue.windowWidth * 0.2,
        alignItems:'center',
        height:30,
        backgroundColor:MainTheme.SpecialColor,
        justifyContent:'center',
    },

    modalFilterOptionText: {
        
        color: MainTheme.DarkGrayColor,
    },

    modalFilterOptionTextHighlighted: {
        color: MainTheme.SubmitTextColor,
    },

    modalFilterOrderOptionContainer: {
        width: deviceValue.windowWidth * 0.3,
        marginRight: 5,
        marginLeft:5,
        marginBottom: 10,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius:4,
    },
    modalOrderFilterViewStyle: {
        width: deviceValue.windowWidth * 0.3,
        alignItems:'center',
        height:30,
        justifyContent:'center',
        backgroundColor: '#EEEEEE',
    },
    modalOrderFilterSelectedViewStyle: {
        width: deviceValue.windowWidth * 0.3,
        alignItems:'center',
        height:30,
        backgroundColor:MainTheme.SpecialColor,
        justifyContent:'center',
    },

    modalFilterCancelButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
        marginRight: 5,
        backgroundColor: MainTheme.BackgroundColor,
        borderColor: MainTheme.SpecialColor,
        borderWidth: 0.5,
        paddingTop: 10,
        paddingBottom: 10,
    },

    modalFilterSubmitButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: MainTheme.SpecialColor,
        paddingTop: 10,
        paddingBottom: 10,
        marginLeft: 5,
        marginRight: 10,
    }

});

