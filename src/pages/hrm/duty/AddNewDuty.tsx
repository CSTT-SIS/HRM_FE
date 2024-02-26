import { useEffect, Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { Dialog, Transition } from '@headlessui/react';

import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import Swal from 'sweetalert2';
import { showMessage } from '@/@core/utils';
import IconX from '@/components/Icon/IconX';
import IconArrowLeft from '@/components/Icon/IconArrowLeft';
import IconArrowBackward from '@/components/Icon/IconArrowBackward';

interface Props {
    [key: string]: any;
}

const AddNewDuty = ({ ...props }: Props) => {

    const { t } = useTranslation();
    const [disabled, setDisabled] = useState(false);

    const SubmittedForm = Yup.object().shape({
        name: Yup.string().min(2, 'Too Short!').required(`${t('please_fill_name_duty')}`),
        code: Yup.string().min(2, 'Too Short!').required(`${t('please_fill_dutyCode')}`),
        status: Yup.string().required(`${t('please_fill_status')}`)
    });

    const handleDuty = (value: any) => {
        if (props?.data) {
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
    return (
        <div className="p-5">
            <div className='flex justify-between header-page-bottom pb-4 mb-4'>
                <h1 className='page-title'>{t('add_duty')}</h1>
                <Link href="/hrm/duty">
                        <button type="button" className="btn btn-primary btn-sm m-1 back-button" >
                                    <IconArrowBackward className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                                    <span>
                                                    {t('back')}
                                                        </span>
                                    </button>
                        </Link>
            </div>
                                    <Formik
                                        initialValues={
                                            {
                                                name: props?.data ? `${props?.data?.name}` : "",
                                                code: props?.data ? `${props?.data?.code}` : "",
                                                status: props?.data ? `${props?.data?.status}` : "",
                                                duty_group: props?.data ? `${props?.data?.duty_group}` : "",
                                                description: props?.data ? `${props?.data?.description}` : ""
                                            }
                                        }
                                        validationSchema={SubmittedForm}
                                        onSubmit={values => {
                                            handleDuty(values);
                                        }}
                                    >

                                        {({ errors, touched }) => (
                                            <Form className="space-y-5" >
                                                <div className="mb-5">
                                                    <label htmlFor="name" className='label'> {t('name_duty')} < span style={{ color: 'red' }}>* </span></label >
                                                    <Field name="name" type="text" id="name" placeholder={`${t('enter_name_duty')}`} className="form-input" />
                                                    {errors.name ? (
                                                        <div className="text-danger mt-1"> {errors.name} </div>
                                                    ) : null}
                                                </div>
                                                <div className="mb-5">
                                                    <label htmlFor="code" className='label'> {t('code_duty')} < span style={{ color: 'red' }}>* </span></label >
                                                    <Field name="code" type="text" id="code" placeholder={`${t('enter_code_duty')}`} className="form-input" />
                                                    {errors.code ? (
                                                        <div className="text-danger mt-1"> {errors.code} </div>
                                                    ) : null}
                                                </div>
                                                <div className="mb-5 flex justify-between gap-4">
                                                    <div className="flex-1">
                                                        <label htmlFor="duty_group" className='label'> {t('duty_group')} < span style={{ color: 'red' }}>* </span></label >
                                                        <Field as="select" name="duty_group" id="duty_group" className="form-input">
                                                            <option value="active">Quản lý</option>
                                                            <option value="inActive">Nhân viên</option>
                                                        </Field>
                                                        {errors.duty_group ? (
                                                            <div className="text-danger mt-1"> {errors.duty_group} </div>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="mb-5 flex justify-between gap-4">
                                                    <div className="flex-1">
                                                        <label htmlFor="status" className='label'> {t('status')} < span style={{ color: 'red' }}>* </span></label >
                                                        <Field as="select" name="status" id="status"
                                                        placeholder={t('enter_duty_status')}
                                                        className="form-input">
                                                            <option value="active">{t('active')}</option>
                                                            <option value="inActive">{t('inactive')}</option>
                                                        </Field>
                                                        {errors.status ? (
                                                            <div className="text-danger mt-1"> {errors.status} </div>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="mb-5">
                                                    <label htmlFor="description" className='label'> {t('description')}</label >
                                                    <Field name="duty_description" type="text" id="duty_description" placeholder={`${t('enter_description')}`} className="form-input" />
                                                    {errors.description ? (
                                                        <div className="text-danger mt-1"> {errors.description} </div>
                                                    ) : null}
                                                </div>
                                                <div className="mt-8 flex items-center justify-end ltr:text-right rtl:text-left gap-8">
                                                    <button type="button" className="btn btn-outline-dark cancel-button" onClick={() => handleCancel()}>
                                                        {t('cancel')}
                                                    </button>
                                                    <button type="submit" className="btn :ml-4 rtl:mr-4 add-button" disabled={disabled}>
                                                        {props.data !== undefined ? t('update') : t('add')}
                                                    </button>
                                                </div>

                                            </Form>
                                        )}
                                    </Formik>

                                </div>
    );
};

export default AddNewDuty;
