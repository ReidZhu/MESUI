import React from 'react';
import ProForm, {
  ModalForm,
  ProFormText,
} from '@ant-design/pro-form';
import {edit, add} from '../api';
import { commonResult } from '@/utils/resultUtils';
import { useIntl } from 'umi';
import {  inputIntl } from '@/utils/intl';

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
          if(editRow.tag)
            commonResult(await edit({data:values}));
          else
            commonResult(await add({data:values}));
          tabRef.current.reload()
          visible.setVisible(false)
          return true;
        }}
      >
          <ProFormText width="md" name="tag" label='tag' placeholder={intl.formatMessage(inputIntl)} />
          <ProFormText width="md" name="cn" label='cn' placeholder={intl.formatMessage(inputIntl)} />
          <ProFormText width="md" name="hk" label='hk' placeholder={intl.formatMessage(inputIntl)} />
          <ProFormText width="md" name="us" label='us' placeholder={intl.formatMessage(inputIntl)} />
        </ModalForm>
    </div>
  );
};