import { ctmfgprocesstypeIntl, dutytypeIntl, selectIntl } from '@/utils/intl'
import { ProFormSelect } from '@ant-design/pro-form'
import React from 'react'
import { useIntl } from 'umi'


/**
 * 站点选择框
 */
export  function Selectmfgprocesstype(props?:any) {
    const intl = useIntl()
    return (
        <>
            <ProFormSelect
                name={props.currentName?props.currentName:"mfgprocesstype"}
                width="md"
                label={props.lable?null:intl.formatMessage(ctmfgprocesstypeIntl)}
                valueEnum={{
                    BE: 'BE',
                    CA: 'CA',
                }}
                placeholder={intl.formatMessage(selectIntl)}
            />
        </>
    )
}


/**
 * 责别选择框
 */
export  function Selectdutytype(props?:any) {
    const intl = useIntl()
    return (
        <>
            <ProFormSelect
                name="dutytype"
                width="md"
                label={props.lable?null:intl.formatMessage(dutytypeIntl)}
                valueEnum={{
                    '客責': '客責',
                    '我責': '我責',
                }}
                placeholder={intl.formatMessage(selectIntl)}
            />
        </>
    )
}