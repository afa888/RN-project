import React, {Component} from 'react';
import {Text, View, Button, Alert,UIManager,findNodeHandle} from 'react-native';
import WebView from '../../customizeview/WebView'
import Dimensions from 'Dimensions'

let gameUrl
export default class GameScreen extends Component<Props> {
    static navigationOptions = {
        header: null,  //隐藏顶部导航栏
    };

    constructor(props) {
        super(props);
        let {navigation} = this.props;
        gameUrl = navigation.getParam('gameUrl', '');
        this._onChange = this._onChange.bind(this);
    }

    _onChange(event: Event) {
        console.log(event.nativeEvent.message)
        if (!this.props.onChangeMessage) {
            return;
        }
        //   this.props.onChangeMessage(event.nativeEvent.message);

    }
    componentWillMount(){
        Alert.alert("width="+Dimensions.get('window').width+"   height= "+Dimensions.get('window').height)
    }

    componentWillUnmount() {
        this.destroy("destroy")
    }

//这里的函数名可以随意取
    destroy = (name) => {
        //向native层发送命令
        UIManager.dispatchViewManagerCommand(
            findNodeHandle(this.refs['WebView']),
            UIManager.WebView.Commands.destry,//Commands.hello与native层定义的COMMAND_HELLO_NAME一致
            [name]//命令携带的参数数据,数据形如：["第一个参数","第二个参数",3]
        );
    }

    render() {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <WebView
                    ref='WebView'
                    url={gameUrl}
                    onChange={this._onChange}
                    style={{
                        width: Dimensions.get('window').width,
                        height: Dimensions.get('window').height,
                    }}/>

            </View>
        );
    }
}
