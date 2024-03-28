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
import { removeNullProperties } from '@/utils/commons';
import { C } from '@fullcalendar/core/internal-common';
import { Positions } from '@/services/swr/position.twr';
import { detailPosition, updatePosition } from '@/services/apis/position.api';
import { GroupPositions } from '@/services/swr/group-position.twr';
interface Props {
    [key: string]: any;
}

const DetailDuty = ({ ...props }: Props) => {
    const router = useRouter();
    const [detail, setDetail] = useState<any>();
    const id = Number(router.query.id);
    const { t } = useTranslation();
    const [disabled, setDisabled] = useState(false);
    // const { data: position, pagination, mutate } = Positions({
    //     sortBy: 'id.ASC',
    //     ...router.query
    // });
    const SubmittedForm = Yup.object().shape({
        name: Yup.string().min(2, 'Too Short!').required(`${t('please_fill_name_duty')}`),
        code: Yup.string().min(2, 'Too Short!').required(`${t('please_fill_dutyCode')}`),
        positionGroupId: Yup.string().required(`${t('please_fill_group_position')}`),
        isActive: Yup.bool().required(`${t('please_fill_status')}`),
        description: Yup.string()
    });
    useEffect(() => {
        const id = router.query.id
        if (id) {
            detailPosition(id).then((res) => {
                setDetail(res?.data)
            }).catch((err: any) => {
                console.log(err)
            });
        }
    }, [router])
    const { data: group_position, pagination: pagination1, mutate: mutate1 } = GroupPositions({ sortBy: 'id.ASC', ...router.query });

    const options = group_position?.data?.map((item: any) => ({ value: item.id, label: item.name })) || [];
    const defaultGroup = options.find((i: { value: string }) => i && i.value === detail?.positionGroupId);
    const handleDuty = (value: any) => {
        removeNullProperties(value);
        let dataSubmit
            dataSubmit = {
                name: value.name,
                description: value.description,
                isActive: value.isActive,
                positionGroupId: parseInt(value.positionGroupId),
                code: value.code
            }
        updatePosition(detail?.id, dataSubmit).then(() => {
            showMessage(`${t('update_group_position_success')}`, 'success');
            mutate1();
        }).catch(() => {
            showMessage(`${t('update_group_position_error')}`, 'error');
        })
    }

    const handleCancel = () => {
        props.setOpenModal(false);
        props.setData(undefined);
    };
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
            { detail?.id !== undefined && <Formik
                initialValues={
                    {
                        name: detail ? `${detail?.name}` : "",
                        code: detail ? `${detail?.code}` : "",
                        isActive: detail ? detail?.isActive : true,
                        positionGroupId: detail ? `${detail?.positionGroupId}` : "",
                        description: detail ? detail?.description : ""
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
                            <label htmlFor="positionGroupId" className='label'> {t('duty_group')} < span style={{ color: 'red' }}>* </span></label >
                            <Select
                                defaultValue={defaultGroup}
                                id='positionGroupId'
                                name='positionGroupId'
                                options={options}
                                placeholder={`${t('choose_group_duty')}`}
                                onChange={(newValue: any, actionMeta: any) => {
                                    setFieldValue('positionGroupId', newValue ? newValue.value : null);
                                }}
                            />
                            {submitCount ? errors.positionGroupId ? (
                                <div className="text-danger mt-1">{errors.positionGroupId}</div>
                            ) : null : ''}

                            </div>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="isActive" className='label'> {t('status')} <span style={{ color: 'red' }}>*</span></label>
                                <div className="flex" style={{ alignItems: 'center', marginTop: '13px' }}>
                                    <label style={{ marginBottom: 0, marginRight: '10px' }}>
                                        <Field
                                            autoComplete="off"
                                            type="radio"
                                            name="isActive"
                                            value={true}
                                            checked={values.isActive === true}
                                            className="form-checkbox rounded-full"
                                            onChange={() => setFieldValue('isActive', true)}
                                        />
                                        {t('active')}
                                    </label>
                                    <label style={{ marginBottom: 0 }}>
                                        <Field
                                            autoComplete="off"
                                            type="radio"
                                            name="isActive"
                                            value={false}
                                            checked={values.isActive === false}
                                            className="form-checkbox rounded-full"
                                            onChange={() => setFieldValue('isActive', false)}
                                        />
                                        {t('inactive')}
                                    </label>
                                </div>
                                {/* {submitCount && errors.isActive && typeof errors.isActive === 'string' && (
                                        <div className="text-danger mt-1">{errors.isActive}</div>
                                    )} */}

                            </div>

                        </div>
                        <div className="mb-5">
                            <label htmlFor="description" className='label'> {t('description')}</label >
                            <Field autoComplete="off" name="description" as="textarea" id="description" placeholder={`${t('enter_description')}`} className="form-input" />
                            {submitCount ? errors.description ? (
                                <div className="text-danger mt-1"> {`${errors.description}`} </div>
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
            </Formik>}

        </div>
    );
};

export default DetailDuty;
