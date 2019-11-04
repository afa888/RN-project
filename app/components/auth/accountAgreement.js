import React, {Component} from 'react';
import {
    Modal,
    Text,
    TouchableHighlight,
    View,
    StyleSheet,
    DeviceEventEmitter,
    BackAndroid, TouchableOpacity, Image, ScrollView
} from 'react-native';
import {NavigationActions} from "react-navigation";
import {category_group_divide_line_color, category_tab_checked_bg_color, theme_color} from "../../utils/AllColor";
let Dimensions = require('Dimensions');
let SCREEN_WIDTH = Dimensions.get('window').width;//宽
let SCREEN_HEIGHT = Dimensions.get('window').height;//高


export default class AccountAgreement extends Component<Props> {

    // 构造
    constructor(props) {
        super(props);
        this.state = {
            dialogShow: false
        }
    }

    componentDidMount() {
        this.listener = DeviceEventEmitter.addListener('openDialog', val => {
            this.setState({dialogShow: val})
        })
    }

    componentWillUnmount(){
        this.listener.remove();
    }

    render() {
        // onPress事件直接与父组件传递进来的属性挂接
        return (
            <Modal
                visible={this.state.dialogShow}
                transparent={true}
                onRequestClose={() => {
                }} //如果是Android设备 必须有此方法
            >
                <View style={styles.bg}>
                    <View style={styles.dialog}>
                        <View style={styles.dialogTitleView}>
                            <Text style={styles.dialogTitle}> 通用条款 </Text>
                            <TouchableOpacity onPress={() => { this.setState({dialogShow: false}) }}>
                                <Image source={require('../../static/img/login_x.png')}
                                       style={{
                                           resizeMode: 'contain',
                                           width: 15,
                                           height: 15,
                                           margin: 12
                                       }}/>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.dialogContentView}>
                            <ScrollView style={{flex: 1}}>
                                <View style={styles.dialogContent}>
                                    <Text style={styles.dialog_title}>一、基本条款</Text>
                                    <Text style={styles.dialog_p}>1.为避免于本网站投注时之争议，请会员务必于进入网站前详阅本娱乐场所定之各项规则，客户一经“我同意”进入本网站进行投注时，即被视为已接受本娱乐场的所有协议与规则；</Text>
                                    <Text style={styles.dialog_p}>2.会员有责任确保自己的帐户以及登入资料的保密性，以会员帐号及密码进行的任何网上投注，将被视为有效；敬请不定时做密码变更之动作；若帐号密码被盗用，进行的投注，本公司一概不负赔偿责任；</Text>
                                    <Text style={styles.dialog_p}>3. 本公司保留不定时更改本协定或游戏规则或保密条例，更改之条款将从更改发生后指定之日起生效，并保留一切有争议事项及最后的决策权；</Text>
                                    <Text style={styles.dialog_p}>4. 用户须达到居住地国家法律规定之合法年龄方可使用线上娱乐场或网站；</Text>
                                    <Text style={styles.dialog_p}>5. 网上投注如未能成功提交，投注将被视为无效；</Text>
                                    <Text style={styles.dialog_p}>6. 凡玩家于出牌途中且尚无结果前自动或强制断线时，并不影响比赛之结果；</Text>
                                    <Text style={styles.dialog_p}>7. 如遇发生不可抗拒之灾害，骇客入侵，网络问题造成数据丢失的情况，以本公司公告为最终方案；</Text>
                                    <Text style={styles.dialog_p}>8. 特此声明，本公司将会对所有的电子交易进行记录，如有任何争议，本公司将会以注单记录为准；</Text>
                                    <Text style={styles.dialog_p}>9. 本公司保留更改、修改现有条款或增加任何适当条款的权利，而条款改动后将会在会员端跑马灯上公布；</Text>
                                    <Text style={styles.dialog_p}>10. 无论在任何情况下，本公司具有最终的解释权；</Text>
                                    <Text style={styles.dialog_p}>11. 若经本公司发现会员以不正当手法&lt;利用外挂程式&gt;进行投注或以任何非正常方式进行的个人、团体投注有损公司利益之投注事情发生，本公司保留权利取消该类注单以及注单产生之红利，并停用该会员帐号；</Text>
                                    <Text style={styles.dialog_p}>12. 无风险投注包括在百家乐同时投注的庄闲，单双，大小；龙虎斗中同时投注龙虎，龙双龙单，虎双虎单；在轮盘同时投注黑红，单双，大小等相反的下注，本公司保留权利取消所有优惠、该注单以及单注产生之红利，并停用该会员账号之权利，本公司不承担对此做出任何说明及解释之责任；若本公司发现会员有重复申请帐号行为时，保留取消、收回会员所有优惠红利，以及优惠红利所产生的盈利之权利；每位玩家、每一电子邮箱、每一电话号码、每一收款银行账号，以及共享电脑环境(例如:网吧、其他公共用电脑等)只能够拥有一个会员帐号，各项优惠只适用于每位客户在本公司唯一的帐户。所有澳门金沙的优惠是特别为玩家而设，在玩家注册信息有争议时，为确保双方利益、杜绝身份盗用行为，澳门金沙保留权利要求客户向我们提供充足有效的文件，并以各种方式辨别客户是否符合资格享有我们的任何优惠。澳门金沙赌场是提供互联网投注服务的机构。请会员在注册前参考当地政府的法律，在博彩不被允许的地区，如有会员在澳门金沙注册、下注，为会员个人行为，澳门金沙不负责、承担任何相关责任。无论是个人或是团体，如有任何威胁、滥用澳门金沙优惠的行为，澳门金沙保留杈利取消、收回由优惠产生的红利，并保留权利追讨最高50%手续费。客户一经注册开户，将被视为接受所有颁布在澳门金沙网站上的规则与条例。</Text>
                                    <Text style={styles.dialog_title}>二、真人娱乐条款</Text>
                                    <Text style={styles.dialog_p}>
                                        1. 当您下注后，请等待显示“您共下注XXXX元”，这个讯息在中间的讯息窗口可以看见；
                                    </Text>
                                    <Text style={styles.dialog_p}>
                                        2. 开牌后，若您已有下注，请确认您的输赢金额，这个讯息在中间的讯息窗口可以看见；
                                    </Text>
                                    <Text style={styles.dialog_p}>
                                        3. 您的“总下注金额”及“赢得金额”亦会每局显示于右上角的视窗中，请会员详加确认；
                                    </Text>
                                    <Text style={styles.dialog_p}>
                                        4. 当会员在游戏中途发生网路问题而断线，所有已被确定的投注仍然有效；会员再重新登入时，就可以查询游戏端内的“下注记录”查询发牌结果，会员的额度也会随着当局的输赢增加或减少；
                                    </Text>
                                    <Text style={styles.dialog_p}>
                                        5. 如果您在讯息窗口看到“开牌”的话，而您的游戏画面未显示投注金额，这代表该局您的投注不成功，这有可能下注的时间太迟或是因为网路问题而没有被系统接受；
                                    </Text>
                                    <Text style={styles.dialog_p}>
                                        6. 百家乐游戏在本网内设计为每手牌局前不销牌；
                                    </Text>
                                    <Text style={styles.dialog_p}>
                                        7.
                                        当会员进入游戏，超过5局没下注会有提示；若您连续10局未下注的时候将会被游戏弹出至首页，请会员重新登入；若会员于下注开牌期间强行登出，帐号将被系统锁住三分钟，请会员稍后再重新登入；
                                    </Text>
                                    <Text style={styles.dialog_p}>
                                        8. 本网上游戏是在现场把牌通过扫描后将牌例显示在会员端荧幕上，故若牌没扫描到必将重新扫描一遍，若还是没有感应则把牌翻开由现场公务输入牌卡数码，牌例便会显示在会员端荧幕上；
                                    </Text>
                                    <Text style={styles.dialog_p}>
                                        9. 当荷官不小心同时从牌靴中抽出两张牌，而扫描到的不是按顺序正确的那张牌：（a）若牌局已开牌，而结果不符，系统将根据现况决定牌的先后摆放顺序之开牌结果进行手动开牌，并换上新牌靴开始新局；（b）若牌局未开牌，则由现场公务决定牌的先后摆放顺序，牌局会如常继续;
                                    </Text>
                                    <Text style={styles.dialog_p}>
                                        10. 在洗牌或将牌放入牌靴过程中，有牌不慎曝光，荷官会把牌叠起并重新洗牌，牌局将重新开始；
                                    </Text>
                                    <Text style={styles.dialog_p}>
                                        11. 牌局进行中，未扬牌前(该张牌未于视讯显示点数花色前)，牌不慎离开台面，牌丢落地上，或离开视讯范围，则该牌局予以注销作废，所有下注本金退回；
                                    </Text>
                                    <Text style={styles.dialog_p}>
                                        12. 若该牌已经过扫描且已扬牌后，该牌不慎离开台面，牌丢落地上，或离开视讯范围，因其不影响游戏之正确结果，牌由现场工务摆回后，该牌局正常行其结果仍视为有效；
                                    </Text>
                                    <Text style={styles.dialog_p}>
                                        13.
                                        派错牌例（已不须补牌，荷官仍补牌）现场工务会把多补的那张牌放到牌靴底，牌局结果依视讯显示为准，牌局将如常进行；若该张多补的牌已亮开，公务将在做完以上同样程序后换上新牌靴，牌局会重新开始；
                                    </Text>
                                    <Text style={styles.dialog_p}>
                                        14. 荷官未依闲、庄发牌正确顺序将牌放错位置，由工务将牌依正确顺序摆放回位置后牌局将照常继续；
                                    </Text>
                                    <Text style={styles.dialog_p}>
                                        15.开牌过程中，牌有感应但无显示，荷官已亮牌（如:已派出数张牌，但第一张牌有感应但未显示，至第二、三张牌显示在错误的闲、庄位置上），现场工务会依牌的正确次序输入代码，牌局将如常继续;</Text>
                                    <Text style={styles.dialog_p}>
                                        16. 同一张牌，扫描了一次出现2张（闲、庄位置各一张）（a）若牌局已开牌，而结果不符，系统将根据视讯荷官完成该局之正确结果进行手动开牌，牌局也将在牌路无误的情况下如常继续；（b）若牌局未开牌，荷官避开扫描如常开牌后，工务将输入牌之正确数码，并修正不符那张牌的花色、点数，牌局会如常继续；
                                    </Text>
                                    <Text style={styles.dialog_p}>
                                        17.
                                        电脑、扫描器出现异常、牌局中断、牌无法扫描又无法输入牌卡数码时，那一个牌局便会作废，所有程式将被关闭，并重开程式，牌局将重新开始；但若荷官发牌视讯已有结果，则以视讯开牌为主，会由系统完成开配；
                                    </Text>
                                    <Text style={styles.dialog_p}>
                                        18. 有关例行性维护、网路问题、视讯中断、牌局作废、注销情况等事宜，皆可于会员端左上角处公告栏上得知最新讯息；
                                    </Text>
                                    <Text style={styles.dialog_p}>
                                        19. 发牌视讯仅保留三日，若有异议请于游戏当日起三日内提出，三日后恕不受理；
                                    </Text>
                                    <Text style={styles.dialog_p}>
                                        20. 本娱乐场之视讯为真人直播，故该局游戏若因国际线路传输问题出现争议，将以视讯看到牌局结果决定输赢；
                                    </Text>
                                    <Text style={styles.dialog_p}>
                                        21. 本娱乐场所提供之牌路仅供参考，若因国际线路问题或其他因素造成牌路显示有误，所有游戏结果将以视讯开牌及游戏记录为主；
                                    </Text>
                                    <Text style={styles.dialog_p}>
                                        22. 本公司保留一切有争议事项的修正及最后的决策；
                                    </Text>
                                    <Text style={styles.dialog_p}>
                                        23. 本娱乐场保留随时更改、修订或删除游戏、游戏规则（包括机率及赔率）及协议条款的权利而无须作事先通知；
                                    </Text>
                                    <Text style={styles.dialog_p}>
                                        24. 本娱乐场保留随时修订、撤销或中止任何投注的权利而无须作事先通知，亦无须作任何解释；
                                    </Text>
                                    <Text style={styles.dialog_p}>
                                        25.
                                        本娱乐场记录每一项于本网站伺服器内执行的交易及投注功能；若会员认为向本娱乐场提供的资料与本网站资料库中的资料记录之间出现了任何声称的差异，一切均以本网站资料库的资料为准；
                                    </Text>
                                    <Text style={styles.dialog_p}>
                                        26. 当会员已于本娱乐场之游戏厅内下注，而电脑出现连线异常导致牌局中断时，会员最后押住仍视为有效，本娱乐场将以会员于本网站资料库的交易记录为准；
                                    </Text>
                                    <Text style={styles.dialog_p}>
                                        27. 会员在本娱乐场之游戏厅内任何游戏的押注记录均视为有效，会员需自行承担下注后的风险；若经本公司发现会员以不正当手法&lt;利用外挂程式&gt;进行投注或以任何非正常方式进行的个人、团体投注有损公司利益之投注事情发生，本公司保留取消该类注单之权利。
                                    </Text>
                                    <Text style={styles.dialog_title}>三、彩票类游戏</Text>
                                    <Text style={styles.dialog_p}>
                                        1. 当您在下注之后，请等待显示“下注成功”资讯；
                                    </Text>
                                    <Text style={styles.dialog_p}>
                                        2. 为了避免出现争论，您必须在下注之后检查“下注状况”；
                                    </Text>
                                    <Text style={styles.dialog_p}>
                                        3. 任何的投诉必须在开彩之前提出，本公司不会受理任何开彩之后的投诉；
                                    </Text>
                                    <Text style={styles.dialog_p}>
                                        4. 所有投注项目，公布赔率时出现的任何打字错误或非故意人为失误，本公司保留改正错误和按正确赔率结算投注的权力；
                                    </Text>
                                    <Text style={styles.dialog_p}>
                                        5. 开彩后的投注，将被视为“无效”；所有赔率将不时浮动，派彩时的赔率将以确认投注时之赔率为准；
                                    </Text>
                                    <Text style={styles.dialog_p}>
                                        6. 所有赛果以官方网站公布的结果为依据，若因官网延迟、错误或取消；本公司保留对已下注注单的裁决权；
                                    </Text>
                                    <Text style={styles.dialog_p}>
                                        7. 若发生两颗球同时吸起，将依照在结果区之号码球为主；
                                    </Text>
                                    <Text style={styles.dialog_p}>
                                        8. 在游戏尚未完成开配之前，若因机器问题而导致有结果产生，该局将一律注销；
                                    </Text>
                                    <Text style={styles.dialog_p}>
                                        9. 在下注时间尚未结束之前，若因任何因素导致有结果产生，该局将一律注销；
                                    </Text>
                                    <Text style={styles.dialog_p}>
                                        10. 若该局己有结果但与实际结果不符，系统将根据视讯完成该局之正确结果进行手动开牌；
                                    </Text>
                                    <Text style={styles.dialog_title}>四、电子游艺</Text>
                                    <Text style={styles.dialog_p}>
                                        1. 电子游戏中奖画面与派彩结果不符时，本公司将以资料库最终结果为依据；
                                    </Text>
                                    <Text style={styles.dialog_p}>
                                        2. 彩池金额是以满注中奖结果显示，玩家中奖系以押注比例分配彩池金额；
                                    </Text>
                                    <Text style={styles.dialog_p}>
                                        3. 老虎机游戏过程中如遇断线情况将以资料库最终结果为依据，本公司保留对已下注注单的裁决权；
                                    </Text>
                                    <Text style={styles.dialog_p}>
                                        4. 21点游戏补牌中如遇玩家断线，则视玩家为不补牌；游戏结果将视为有效；
                                    </Text>
                                    <Text style={styles.dialog_p}>
                                        5. 红狗游戏过程中如遇断线情况将视为玩家不加注进行补牌，完成该局游戏结果。
                                    </Text>
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    bg: {  //全屏显示 半透明 可以看到之前的控件但是不能操作了
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: 'rgba(52,52,52,0.5)',  //rgba  a0-1  其余都是16进制数
        justifyContent: 'center',
        alignItems: 'center',
    },
    dialog: {
        backgroundColor: 'white',
        borderRadius: 8,
        paddingVertical:10
    },
    dialogTitleView: {
        width: SCREEN_WIDTH * 0.8,
        height: SCREEN_HEIGHT * 0.04,
        justifyContent: 'space-between',
        flexDirection:'row',
        alignItems: 'center',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8
    },
    dialogTitle: {
        textAlign: 'center',
        fontSize: 14,
        color: '#000000',
        marginLeft:12,
    },
    dialogContentView: {
        width: SCREEN_WIDTH * 0.8,
        height: SCREEN_HEIGHT * 0.7,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dialogContent: {
        textAlign: 'left',
        fontSize: 13,
        margin: 12,
    },
    dialog_title:{
        fontSize:15,
        color: '#000'
    },
    dialog_p:{
        lineHeight:20,
        marginBottom:6
    }
});
