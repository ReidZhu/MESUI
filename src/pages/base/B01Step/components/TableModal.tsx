import React from 'react';
import {  message } from 'antd';
import ProForm, {
  ModalForm,
  ProFormText,
} from '@ant-design/pro-form';
import {saveData} from '../api';
import { commonResult } from '@/utils/resultUtils';
import storageUtils from '@/utils/storageUtils';
import {Selectmfgprocesstype} from '@/components/FormItem'
import { useIntl } from 'umi';
import { descriptionIntl, inputIntl, stageIntl } from '@/utils/intl';

interface TableModal{
  visible:{
    visible:Boolean,
    setVisible:Function
  }
  editRow:any
  tabRef:any
}

export default (props:TableModal) => {
  const intl = useIntl();
  const {visible,editRow,tabRef} = props
  return (
    <div >
      <ModalForm<any>
        title="数据保存"
        width={500}
        initialValues={editRow}
        //layout='horizontal'
        visible={visible.visible}
        modalProps={{
          onCancel: () =>{ 
            visible.setVisible(false)
          },
          destroyOnClose: true,
        }}
        onFinish={async (values) => {
          if(values.id==null||values.id==''||values.id==undefined){
            const user = storageUtils.getUser();
            console.log(user)
            values.createuser = user.name;
          }
          commonResult(await saveData({data:values}));
          tabRef.current.reload()
          visible.setVisible(false)
          return true;
        }}
      >
          <ProFormText width="md" name="id" hidden label="id" placeholder={intl.formatMessage(inputIntl)} />
          <ProFormText width="md" name="stage" label={intl.formatMessage(stageIntl)} placeholder={intl.formatMessage(inputIntl)} disabled={editRow.stage}/>
          <Selectmfgprocesstype/>
          <ProFormText width="md" name="description" label={intl.formatMessage(descriptionIntl)} placeholder={intl.formatMessage(inputIntl)} />
      </ModalForm>
    </div>
  );
};