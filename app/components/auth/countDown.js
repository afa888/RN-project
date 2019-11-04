import React, {Component} from 'react';
import {Text} from "react-native";
export default class CountDown extends Component<Props> {
    constructor(props){
        super(props);
        this.state = {
            time:60
        }
    }
    componentDidMount(){
        this.timer = setInterval(() => {
            this.setState((preState) =>({
                time: preState.time - 1,
            }),() => {
                if(this.state.time <= 0){
                    this.props._openSendCode();
                    clearInterval(this.timer);
                }
            });
        }, 1000)
    }
    componentWillUnmount(){
        clearTimeout(this.timer);
    }
    render(){
        return(
            <Text style={{ color: '#fff' }}>剩余{this.state.time}秒</Text>
        )
    }
}