import { cancelReason, currentStageIntl, inputIntl, lotNoIntl, lotNoNumberIntl, moIntl, operuserIntl, previousStageIntl, resetIntl, submitIntl } from '@/utils/intl';
import { commonResult } from '@/utils/resultUtils';
import storageUtils from '@/utils/storageUtils';
import { formatparams } from '@/utils/utils';
import ProForm, { ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { Button, Card, Divider, Form } from 'antd';
import React from 'react';
import { Access, useAccess, useIntl } from 'umi';
import { addU01, getDataU01 } from './api';

const index = () => {
    const [form] = Form.useForm();
     //权限验证
  const access = useAccess();
    const intl = useIntl()
    return (
        <Card style={{height:'100%',fontWeight:'bold'}}>
            {/* <span style={{color:'red'}}>
                {`${intl.formatMessage(operuserIntl)}：${storageUtils.getUser().name}，IP：${storageUtils.getUser().ip}`}
            </span> */}
            
            <Divider />
            <ProForm 
                layout ='horizontal'
                labelCol= {{ span: 2 }}
                wrapperCol= {{ span: 5 }}
                onFinish={async(values)=>{
                    if(!values.mo) return false
                    commonResult(await addU01(values),()=>{
                        form.resetFields();
                    })
                    
                    return true
                }}
                form={form}
                submitter={{
                    // 完全自定义整个区域
                    render: (props, doms) => {
                        return [
                        <Access accessible={access.lableFilter("exceptioncenter:U01:canceljob")} >
                        <Button  key="rest" style={{marginLeft:'40px'}} onClick={() => props.form?.resetFields()}>
                           {intl.formatMessage(resetIntl)}
                        </Button></Access>,
                        <Access accessible={access.lableFilter("exceptioncenter:U01:canceljob")} >
                        <Button type="primary"   key="submit" onClick={() => props.form?.submit?.()}>
                            {intl.formatMessage(submitIntl)}
                        </Button></Access>,
                        ];
                    }
                }}
                
            >
                <ProFormText 
                name="infoid" 
                label={intl.formatMessage(lotNoIntl)} 
                rules={[{required:true}]} 
                style={{display:'none'}}
                
                fieldProps={{
                    onPressEnter:async(e:any)=>{
                        if(e.target.value.length && !form.getFieldValue("mo"))
                        commonResult(await getDataU01(formatparams(e.target.value)),(data:any)=>{
                            form.setFieldsValue(data)
                        },false)
                    }
                }}
             />
                <ProFormText  name="mo" label={intl.formatMessage(moIntl)}  readonly />
                <ProFormText  name="infoqty" label={intl.formatMessage(lotNoNumberIntl)}  readonly />
                <ProFormText  name="routehis" label={intl.formatMessage(previousStageIntl)}  readonly />
                <ProFormText  name="stage" label={intl.formatMessage(currentStageIntl)}  readonly />
                <ProFormTextArea name="remark" label={intl.formatMessage(cancelReason)} rules={[{required:true}]} />
                <ProFormText hidden name="upn"/>
                <ProFormText hidden name="model"/>
            </ProForm>
        </Card>
    );
}

export default index;
