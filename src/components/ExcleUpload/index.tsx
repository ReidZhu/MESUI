import { downloadtemplateIotl, templateuploadIotl } from '@/utils/intl';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Steps,Upload } from 'antd'
import React from 'react'
import { useState } from 'react';
import { useIntl } from 'umi';
const { Step } = Steps;
export default function index(props:{current:1,downloadModel:any,uploadModel:any}) {
    const [current, setCurrent] = useState(0);
      //國際化
  const intl = useIntl();
    return (
        <div>


            <Steps  direction="vertical" current={current} >
                <Step title={intl.formatMessage(downloadtemplateIotl)} description={
                    <Button type="primary" shape="round" icon={<DownloadOutlined />} style={{margin:'10px 0'}}  size="small" onClick={()=>{
                        setCurrent(props.downloadModel)
                    }}>
                        Download
                    </Button>
                } />
                <Step title={intl.formatMessage(templateuploadIotl)} description={
                    <Upload
                        listType="picture"
                        maxCount={1}
                        onChange={e=>{props.uploadModel(e)}}
                        >
                        <Button icon={<UploadOutlined />} shape="round" type="primary" style={{margin:'10px 0'}}  size="small">
                            Upload (Max: 1)
                        </Button>
                    </Upload>
                } 
                />
            </Steps>
            
           
        </div>
    )
}
