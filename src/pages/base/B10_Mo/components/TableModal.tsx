import React from 'react';
import { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { editB10 } from '../api';
import storageUtils from '@/utils/storageUtils';
import { commonResult } from '@/utils/resultUtils';
import { formatparams } from '@/utils/utils';
import { dataStorage, inputIntl, Line, moinfoIntl, moIntl, moTypeIntl } from '@/utils/intl';
import { useIntl } from 'umi';
import { Descriptions } from 'antd';

interface TableModal {
  visible: { visible: Boolean; setVisible: Function };
  editRow: any;
  tabRef: any;
}
const option={
  "01":"正常",
  "03":"重工"
}

export default (props: TableModal) => {
  const intl = useIntl();
  const { visible, editRow, tabRef } = props;
  return (
    <div>
      <ModalForm<{
        id: string;
        line: string;
        createuser: string;
      }>
        title={intl.formatMessage(dataStorage)}
        width={500}
        initialValues={editRow}
        //layout='horizontal'
        visible={visible.visible}
        modalProps={{
          onCancel: () => {
            visible.setVisible(false);
          },
          destroyOnClose: true,
        }}
        onFinish={async (values) => {
          values.createuser = storageUtils.getUser().name;
          values = formatparams(values);
          console.log(values)
          commonResult(await editB10({ data: values }));
          visible.setVisible(false);
          tabRef.current.reload();
          return true;
        }}
      >
        <ProFormText name="id" hidden/>
        <Descriptions  >
      <Descriptions.Item label={intl.formatMessage(moIntl)+"："} span={1} style={{width:"328px",height:'33px',fontWeight:"bold"}} >{editRow.mo}</Descriptions.Item>
        </Descriptions>
        <ProFormText width="md" name="moinfo" label={intl.formatMessage(moinfoIntl)} />
        <ProFormSelect width="md" name="mfgmotype" label={intl.formatMessage(moTypeIntl)} valueEnum ={option}/>
      </ModalForm>
    </div>
  );
};
