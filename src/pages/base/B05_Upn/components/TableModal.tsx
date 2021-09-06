import React, { useEffect, useState } from 'react';
import { ModalForm, ProFormRadio, ProFormText } from '@ant-design/pro-form';

import { useIntl } from 'umi';
import {
  Customer,
  CustomerExplain,
  dataStorage,
  inputIntl,
  Model,
  oqcknotquantityIntl,
  packingquantityIntl,
  Upn,
} from '@/utils/intl';
import { Selectmfgprocesstype } from '@/components/FormItem';
import storageUtils from '@/utils/storageUtils';
import { updateupn } from '../api';
import { commonResult } from '@/utils/resultUtils';
import { formatparams } from '@/utils/utils';

interface TableModal {
  visible: { visible: Boolean; setVisible: Function };
  editRow: any;
  tabRef: any;
}

export default (props: TableModal) => {
  const intl = useIntl();
  const { visible, editRow, tabRef } = props;

  let flag = editRow != null && editRow.infotype == 'PCS';

  const [heid, setHeid] = useState<boolean>(!flag);
  useEffect(() => {
    console.log(flag);
    setHeid(!flag);
  }, [editRow]);

  //propos
  return (
    <div>
      <ModalForm<{
        upn?: string;
        mfgprocesstype?: string;
        model?: string;
        customerupn?: string;
        customerupndesc?: string;
        oqcqty?: number;
        cartonqty?: number;
        createuser?: string;
        infotype?: string;
        lotqty?: number;
      }>
        title={intl.formatMessage(dataStorage)}
        width={500}
        initialValues={editRow}
        //layout='horizontal'

        visible={visible.visible}
        modalProps={{
          onCancel: () => {
            tabRef.current.reload();
            visible.setVisible(false);
          },
          destroyOnClose: true,
        }}
        onFinish={async (values) => {
          if (values.infotype === undefined) {
            values.infotype = 'LOT';
          }
          if (values.infotype === 'PCS') {
            values.lotqty = 1;
          }
          values.createuser = storageUtils.getUser().name;
          values = formatparams(values);

          commonResult(await updateupn({ data: values }));
          visible.setVisible(false);
          tabRef.current.reload();
          return true;
        }}
      >
        <ProFormRadio.Group
          fieldProps={{
            defaultValue: 'LOT',
            style: { alignSelf: 'baseline', width: '315px' },
          }}
          name="infotype"
          options={[
            {
              label: 'LOT',
              value: 'LOT',
              onChange: () => {
                setHeid(true);
                ('LOT');
              },
            },
            {
              label: 'PCS',
              value: 'PCS',
              onChange: () => {
                setHeid(false);
              },
            },
            {
              label: 'LPS',
              value: 'LPS',
              onChange: () => {
                setHeid(true);
              },
            },
          ]}
        />
        {heid ? (
          <ProFormText
            width="md"
            name="lotqty"
            label="Runcard最大數量"
            placeholder={intl.formatMessage(inputIntl)}
            rules={[{ required: true }]}
          />
        ) : (
          <></>
        )}
        {/* 
        <ProFormText
          width="md"
          name="lotqty"
          label="Runcard最大數量"
          disabled={editRow.infotype != 'PCS' ? false : true}
          placeholder={intl.formatMessage(inputIntl)}
        /> */}

        <ProFormText width="md" name="id" hidden />
        <ProFormText
          width="md"
          name="upn"
          label={intl.formatMessage(Upn)}
          placeholder={intl.formatMessage(inputIntl)}
          rules={[{ required: true }]}
        />
        <Selectmfgprocesstype />
        <ProFormText
          width="md"
          name="model"
          label={intl.formatMessage(Model)}
          placeholder={intl.formatMessage(inputIntl)}
          rules={[{ required: true }]}
        />
        <ProFormText
          width="md"
          name="customerupn"
          label={intl.formatMessage(Customer)}
          placeholder={intl.formatMessage(inputIntl)}
          rules={[{ required: true }]}
        />
        <ProFormText
          width="md"
          name="customerupndesc"
          label={intl.formatMessage(CustomerExplain)}
          placeholder={intl.formatMessage(inputIntl)}
          rules={[{ required: true }]}
        />
        <ProFormText
          width="md"
          name="oqcqty"
          label={intl.formatMessage(oqcknotquantityIntl)}
          placeholder={intl.formatMessage(inputIntl)}
          rules={[{ required: true }]}
        />
        <ProFormText
          width="md"
          name="cartonqty"
          label={intl.formatMessage(packingquantityIntl)}
          placeholder={intl.formatMessage(inputIntl)}
          rules={[{ required: true }]}
        />
      </ModalForm>
    </div>
  );
};
