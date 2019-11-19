import React, {Component} from 'react';
import {Text} from "react-native";
export default class PhoneCodeCountDown extends Component<Props> {
    constructor(props){
        super(props);
        this.state = {
            time:60
        }
    }
    componentDidMount(){
        
    }
    componentWillUnmount(){
        clearTimeout(this.timer);
    }

    sendValidateCode = () => {
        if (self.state.time == 60) {
            this.props._openSendCode();
            this.timer = setInterval(() => {
            this.setState((preState) =>({
                time: preState.time - 1,
            }),() => {
                if(this.state.time <= 0){
                    clearInterval(this.timer);
                }
            });
        }, 1000)
        }
    }

    render(){
        let time = this.state.time;
        let title = time == 60 ? '发送验证码' : {time} + '秒后重新获取';
        return(
            <TouchableOpacity onPress={() => {
                                        //
                                        // sendValidateCode();
                                        
                                    }}>

               <View style={{alignItems:'center',justifyContent:'center'}}>
                    <Text style={{ color: '#fff' }}>title</Text>
               </View>
                                        
            </TouchableOpacity>
            
        )
    }
}