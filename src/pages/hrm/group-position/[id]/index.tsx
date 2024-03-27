import { useEffect, Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { Dialog, Transition } from '@headlessui/react';
import { useRouter } from 'next/router';

import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import Swal from 'sweetalert2';
import { showMessage } from '@/@core/utils';
import IconX from '@/components/Icon/IconX';
import IconArrowLeft from '@/components/Icon/IconArrowLeft';
import IconArrowBackward from '@/components/Icon/IconArrowBackward';
import IconBack from '@/components/Icon/IconBack';
import duty_list from '../duty_list.json';
import Select from "react-select";
import { C } from '@fullcalendar/core/internal-common';
interface Props {
    [key: string]: any;
}

const list_duty_type = [
    {
        value: '1',
        label: 'Quản lý'
    },
    {
        value: '2',
        label: 'Nhân viên'
    }
]

const DetailDuty = ({ ...props }: Props) => {
    const router = useRouter();
    const [detail, setDetail] = useState<any>();
    const id = Number(router.query.id);
    const { t } = useTranslation();
    const [disabled, setDisabled] = useState(false);

    const SubmittedForm = Yup.object().shape({
        name: Yup.string().min(2, 'Too Short!').required(`${t('please_fill_name_duty')}`),
        code: Yup.string().min(2, 'Too Short!').required(`${t('please_fill_dutyCode')}`),
        status: Yup.string().required(`${t('please_fill_status')}`)
    });

    useEffect(() => {
        if (Number(router.query.id)) {
            const detailData = duty_list?.find(d => d.id === Number(router.query.id));
            setDetail(detailData);
        }
    }, [router])

    const handleDuty = (value: any) => {
        if (detail) {
            const reNew = props.totalData.filter((item: any) => item.id !== props.data.id);
            reNew.push({
                id: props.data.id,
                name: value.name,
                code: value.code,
                status: value.status
            });
            localStorage.setItem('dutyList', JSON.stringify(reNew));
            props.setGetStorge(reNew);
            props.setOpenModal(false);
            props.setData(undefined);
            showMessage(`${t('edit_duty_success')}`, 'success');
        } else {
            const reNew = props.totalData;
            reNew.push({
                id: Number(props?.totalData[props?.totalData?.length - 1].id) + 1,
                name: value.name,
                code: value.code,
                status: value.status
            })
            localStorage.setItem('dutyList', JSON.stringify(reNew));
            props.setGetStorge(props.totalData);
            props.setOpenModal(false);
            props.setData(undefined);
            showMessage(`${t('create_duty_success')}`, 'success')
        }
    }

    const handleCancel = () => {
        props.setOpenModal(false);
        props.setData(undefined);
    };

    console.log(list_duty_type?.find((e: any) => e.label === detail?.duty_group))
    return (
        <div className="p-5">
            <div className='flex justify-between header-page-bottom pb-4 mb-4'>
                <h1 className='page-title'>{t('edit_duty')}</h1>
                <Link href="/hrm/duty">
                    <button type="button" className="btn btn-primary btn-sm m-1 back-button" >
                        <IconBack className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                        <span>
                            {t('back')}
                        </span>
                    </button>
                </Link>
            </div>
            <Formik
                initialValues={
                    {
                        name: detail ? `${detail?.name}` : "",
                        code: detail ? `${detail?.code}` : "",
                        status: detail ? `${detail?.status}` : "",
                        duty_group: detail ? {
                            value: detail?.duty_group,
                            label: list_duty_type?.find((e: any) => e.label === detail?.duty_group)?.label
                        } : null,
                        description: detail ? `${detail?.description}` : ""
                    }
                }
                validationSchema={SubmittedForm}
                onSubmit={values => {
                    handleDuty(values);
                }}
                enableReinitialize
            >
                {({ errors, touched, submitCount, values, setFieldValue }) => (
                    <Form className="space-y-5" >
                        <div className="flex justify-between gap-5">
                            <div className="mb-5 w-1/2">
                                <label htmlFor="name" className='label'> {t('name_duty')} < span style={{ color: 'red' }}>* </span></label >
                                <Field autoComplete="off" name="name" type="text" id="name" placeholder={`${t('enter_name_duty')}`} className="form-input" />
                                {submitCount ? errors.name ? (
                                    <div className="text-danger mt-1"> {errors.name} </div>
                                ) : null : ''}
                            </div>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="code" className='label'> {t('code_duty')} < span style={{ color: 'red' }}>* </span></label >
                                <Field autoComplete="off" name="code" type="text" id="code" placeholder={`${t('enter_code_duty')}`} className="form-input" />
                                {submitCount ? errors.code ? (
                                    <div className="text-danger mt-1"> {errors.code} </div>
                                ) : null : ''}
                            </div>
                        </div>
                        <div className="flex justify-between gap-5">
                            <div className="mb-5 w-1/2">
                                <label htmlFor="duty_group" className='label'> {t('duty_group')} < span style={{ color: 'red' }}>* </span></label >

                                                                <Select
                                                                id='duty_group'
                                                                name='duty_group'
                                                                    value={values?.duty_group}
                                                                    options={list_duty_type}
                                                                    placeholder={`${t('choose_group_duty')}`}
                                                                    onChange={e => {
                                                                        setFieldValue('duty_group', e)
                                                                    }}
                                                                    />

                                                        {submitCount ? errors.duty_group ? (
                                    <div className="text-danger mt-1"> {errors.duty_group} </div>
                                ) : null : ''}
                            </div>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="status" className='label'> {t('status')} < span style={{ color: 'red' }}>* </span></label >
                                <div className="flex" style={{ alignItems: 'center', marginTop: '13px' }}>
                                    <label style={{ marginBottom: 0, marginRight: '10px' }}>
                                        <Field autoComplete="off" type="radio" name="status" value="active" className="form-checkbox rounded-full" />
                                        {t('active')}
                                    </label>
                                    <label style={{ marginBottom: 0 }}>
                                        <Field autoComplete="off" type="radio" name="status" value="inactive" className="form-checkbox rounded-full" />
                                        {t('inactive')}
                                    </label>
                                </div>

                                {submitCount ? errors.status ? (
                                    <div className="text-danger mt-1"> {errors.status} </div>
                                ) : null : ''}
                            </div>
                        </div>
                        <div className="mb-5">
                            <label htmlFor="description" className='label'> {t('description')}</label >
                            <Field autoComplete="off" name="duty_description" as="textarea" id="duty_description" placeholder={`${t('enter_description')}`} className="form-input" />
                            {submitCount ? errors.description ? (
                                <div className="text-danger mt-1"> {errors.description} </div>
                            ) : null : ''}
                        </div>
                        <div className="mt-8 flex items-center justify-end ltr:text-right rtl:text-left gap-8">
                            <button type="button" className="btn btn-outline-dark cancel-button" onClick={() => handleCancel()}>
                                {t('cancel')}
                            </button>
                            <button type="submit" className="btn :ml-4 rtl:mr-4 add-button" disabled={disabled}>
                                {t('update')}
                            </button>
                        </div>

                    </Form>
                )}
            </Formik>

        </div>
    );
};

export default DetailDuty;
