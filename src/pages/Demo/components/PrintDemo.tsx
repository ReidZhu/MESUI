import { RocketTwoTone } from '@ant-design/icons'
import React,{Component} from 'react'

const icons:any=[]
for(let i = 0; i < 1000; i++){
    icons.push(<RocketTwoTone key={i}/>)
}
class PrintDemo extends Component {
    render() {
        return (
            <div >
                {icons }
            </div>
        );
    }
}

export default PrintDemo;



