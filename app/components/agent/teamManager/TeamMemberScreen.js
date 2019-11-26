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

import { Calendar, CalendarList, Agenda, LocaleConfig } from 'react-native-calendars';
import deviceValue from "../../../utils/DeviceValue";
import TXTools from '../../../utils/Htools';
import CalendarDialog from "../../../customizeview/CalendarDialog";



let pageSize = 1;
let total = 0;
let oldIndex = 10;
let isStartTag = true;
let selectDetailIndex = -1


export default class TeamMemberScreen extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
            teamPeopleCount:56,
            refreshing: false,
            isLoreMoreing: 'LoreMoreing',
            listPosition: 0,
            data: [],
            total: 0,
            index: 0,
        };
    }

    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        return {
            headerTitle: (
                MainTheme.renderCommonTitle('旗下会员')
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
            isTeamMember: '1',
            uid:this.props.navigation.state.params.data.uid,
        };
        let dicountList = [];
        http.post('agency/getTeamManagementInfo', prams).then(res => {
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
                    <Image source={require('../../../static/img/administer_icon_zshy.png')}
                        style={styles.recordItemCellLeftImage} />
                    <View style={styles.recordItemCelCenterPanel}>
                        <Text style={styles.recordItemCellTitle}>会员id</Text>
                        <Text style={{...styles.recordItemCellDate,color: MainTheme.DarkGrayColor,marginBottom: 10}}>代理关系</Text>
                    </View>
                    <View style={styles.recordIetmCellRightPanel}>
                        <Text style={{...styles.recordItemCellTitle,color: MainTheme.DarkGrayColor}}>
                            旗下会员/上级id
                        </Text>
                        <Text style={{...styles.recordItemCellType,color: MainTheme.DarkGrayColor,marginBottom: 10}}>累计提供佣金</Text>
                    </View>
                    <View style={styles.recordIetmCellDetailPanel}>
                        <Text style={{textAlign:'right',color: MainTheme.DarkGrayColor}}>查看佣金详情 ></Text>
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
                    {/* 左部分：会员ID/代理关系 */}
                    <View style={styles.recordItemCelCenterPanel}>
                        <Text style={styles.recordItemCellTitle}> {item.username} </Text>
                        <Text style={styles.recordItemCellDate}> {item.cagencyLevel} </Text>
                    </View>
                    {/* 中间：旗下会员/上级id 累计产出佣金 */}
                    <View style={styles.recordIetmCellRightPanel}>
                        <Text style={{...styles.recordItemCellTitle, color: this.getAmountColorForItem(item) }}>
                            {this.getTeamInfo(item)}
                        </Text>
                        <Text style={{...styles.recordItemCellType,color:MainTheme.theme_color}}>{this.getAllMoney(item)}</Text>
                    </View>
                    <View style={styles.recordIetmCellDetailPanel}>
                        <Text style={{textAlign:'right',color:MainTheme.theme_color}}>详情 ></Text>
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
        let status = item.cagencyLevel;
        if (status.indexOf('直属') != -1) {
            return require('../../../static/img/administer_icon_zshy.png');
        }
        else if (status.indexOf('团队') != -1) {
            return require('../../../static/img/administer_icon_tdhy.png');
        }

        return require('../../../static/img/administer_icon_tdhy.png');
    }

    /**
     * 根据记录的cagencyLevel 旗下会员/上级ID
     */
    getTeamInfo = (item) => {
        let status = item.cagencyLevel;
        if (status.indexOf('直属') != -1) {
            if (item.isAgency === 1) {
                //已经开通代理
                return item.directUserNum;
            }else {
                return '未开通代理';
            }
        }
        else if (status.indexOf('团队') != -1) {
            return item.topUserName;
        }
    }

    /**
     * 会员累计产出佣金
     */
    getAllMoney = (item) => {
        return TXTools.formatMoneyAmount(item.totalCommission, false);;
    }

    /**
     * 根据记录的type及amount返回相应的字体颜色
     */
    getAmountColorForItem = (item) => {

        let status = item.cagencyLevel;
        if (status.indexOf('直属') != -1) {
            if (item.isAgency === 1) {
                //已经开通代理
                return MainTheme.theme_color;
            }else {
                return MainTheme.GrayColor;
            }
        }
        else if (status.indexOf('团队') != -1) {
            return MainTheme.GrayColor;
        }
        
        return MainTheme.GrayColor;
    }
    /**
     * 响应记录被点击事件
     */
    onRecordItemPressed = (item, index) => {
        let model = this.state.data[index];

        this.props.navigation.navigate('TeamMemberDetailScreen',{data:model});
    }


    render() {
        return (
            <View style={{ flex: 1 }}>

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
        height: deviceValue.windowWidth / 8,
        alignItems: 'center',
        marginTop: 10,
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: MainTheme.BackgroundColor,
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
        width: deviceValue.windowWidth / 2 -60,
    },

    recordIetmCellRightPanel: {
        flex: 1,
        width: deviceValue.windowWidth / 3 + 20,
    },

    recordIetmCellDetailPanel: {
        width: deviceValue.windowWidth - 20 - (deviceValue.windowWidth / 2 - 80) - (deviceValue.windowWidth / 3),
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

