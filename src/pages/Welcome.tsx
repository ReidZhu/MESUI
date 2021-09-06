import React,{useState} from 'react';
import QueueAnim from 'rc-queue-anim';
import Texty from 'rc-texty';
import 'rc-texty/assets/index.css';
import { Card, Carousel, Image,Row,Col} from 'antd';
import { useModel } from 'umi';

export default (): React.ReactNode => {
  const { initialState } = useModel('@@initialState');
  const [show,setShow] = useState<any>(true);
  return (
    
      <Card>
        <Carousel autoplay beforeChange={()=>{setShow(false);setShow(true)}} >
        <div>
              <Image
                width="100%"
                height={400}
                src="http://10.52.242.7:8081/amm/img/homebg.jpg"
              />
            </div>
            <div>
              <Image
                width="100%"
                height={400}
                src="http://10.52.242.7:8081/amm/img/homebg2.jpg"
              />
            </div>
            <div>
              <Image
                width="100%"
                height={400}
                src="http://10.52.242.7:8081/amm/img/homebg3.jpg"
              />
            </div>
        </Carousel>


            <div className="texty-demo" style={{ margin: 16 ,textAlign:'center',fontSize:'xx-large',color:'steelblue'}}>
            <Texty>{show && '数位转型 | 引领未来' }</Texty>
          </div>


          <QueueAnim  >
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                <Image
                    width="100%"
                    height={300}
                    src="http://10.52.242.7:8081/amm/img/homeimg111.jpeg"
                  />
              </Col>
              <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                <Image
                    width="100%"
                    height={300}
                    src="http://10.52.242.7:8081/amm/img/homeimg12.jpg"
                  />
              </Col>
              <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                <Image
                    width="100%"
                    height={300}
                    src="http://10.52.242.7:8081/amm/img/homeimg13.jpg"
                  />
              </Col>
            </Row>
          </QueueAnim>
      </Card>
    
  );
};
