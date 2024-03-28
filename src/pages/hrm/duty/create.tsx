import { useEffect, Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { Dialog, Transition } from '@headlessui/react';

import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import Swal from 'sweetalert2';
import { showMessage } from '@/@core/utils';
import IconBack from '@/components/Icon/IconBack';
import Select from "react-select";
import { createPosition } from '@/services/apis/position.api';
import { listAllGroupPositon } from '@/services/apis/group-position.api';
import { GroupPositions } from '@/services/swr/group-position.twr';
interface Props {
    [key: string]: any;
}

const AddNewDuty = ({ ...props }: Props) => {

    const { t } = useTranslation();
    const [disabled, setDisabled] = useState(false);
    const SubmittedForm = Yup.object().shape({
        name: Yup.string().min(2, 'Too Short!').required(`${t('please_fill_name_duty')}`),
        code: Yup.string().min(2, 'Too Short!').required(`${t('please_fill_dutyCode')}`),
        isActive: Yup.string().required(`${t('please_fill_status')}`),
        groupPosition: Yup.string().required(`${t('please_fill_status')}`)
    });
    const { data: group_position, pagination: pagination1, mutate: mutate1 } = GroupPositions({ sortBy: 'id.ASC' });

    const options = group_position?.data?.map((item: any) => ({ value: item.id, label: item.name })) || [];
    const handleDuty = (value: any) => {
    
        createPosition({
            ...value,
            positionGroupId: value?.groupPosition?.value
        }).then(() => {
                showMessage(`${t('create_duty_success')}`, 'success');
            }).catch((err) => {
                showMessage(`${t('create_duty_error')}`, 'error');
            });
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
                        name: props?.data ? `${props?.data?.name}` : "",
                        code: props?.data ? `${props?.data?.code}` : "",
                        isActive: props?.data ? `${props?.data?.isActive}` : true,
                        groupPosition: props?.data ? `${props?.data?.groupPosition}` : "",
                        description: props?.data ? `${props?.data?.description}` : ""
                    }
                }
                validationSchema={SubmittedForm}
                onSubmit={values => {
                    handleDuty(values);
                }}
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
                                <label htmlFor="groupPosition" className='label'> {t('group_position')} < span style={{ color: 'red' }}>* </span></label >
                                <Field autoComplete="off"
                                                        name="groupPosition"
                                                        render={({ field }: any) => (
                                                            <>
                                                               <Select
                                                                   id='groupPosition'
                                                                   name='groupPosition'
                                                                   options={options}
                                                                   placeholder={`${t('choose_group_duty')}`}
                                                                   onChange={(newValue: any, actionMeta: any) => {
                                                                       setFieldValue('groupPosition', newValue ? newValue.value : null);
                                                                   }}
                                                                />
                                                                </>
                                                            )}
                                                        />
                                {submitCount ? errors.groupPosition ? (
                                    <div className="text-danger mt-1"> {errors.groupPosition} </div>
                                ) : null : ''}
                            </div>
                           
                            <div className="mb-5 w-1/2">
                                    <label htmlFor="isActive" className='label'> {t('isActive')} < span style={{ color: 'red' }}>* </span></label >
                                    <div className="flex" style={{ alignItems: 'center', marginTop: '13px' }}>
                                        <label style={{ marginBottom: 0, marginRight: '10px' }}>
                                            <Field autoComplete="off" type="radio" name="isActive"  value={true} checked={values.isActive === true} className="form-checkbox rounded-full"  onChange={() => setFieldValue('isActive', true)}/>
                                            {t('active')}
                                        </label>
                                        <label style={{ marginBottom: 0 }}>
                                            <Field autoComplete="off" type="radio" name="isActive" value={false} checked={values.isActive === false} className="form-checkbox rounded-full" onChange={() => setFieldValue('isActive', false)}/>
                                            {t('inactive')}
                                        </label>
                                    </div>
                                    {/* {submitCount && errors.isActive && typeof errors.isActive === 'string' && (
                                        <div className="text-danger mt-1">{errors.isActive ? "" : ""}</div>
                                    )} */}
                            </div>
                            </div>
                            
                        <div className="mb-5">
                            <label htmlFor="description" className='label'> {t('description')}</label >
                            <Field autoComplete="off" name="description" as="textarea" id="description" placeholder={`${t('enter_description')}`} className="form-input" />
                            {submitCount ? errors.description ? (
                                <div className="text-danger mt-1"> {errors.description} </div>
                            ) : null : ''}
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
