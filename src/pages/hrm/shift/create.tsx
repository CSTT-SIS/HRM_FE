import { useEffect, Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog, Transition } from '@headlessui/react';

import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import Swal from 'sweetalert2';
import { showMessage } from '@/@core/utils';
import IconX from '@/components/Icon/IconX';

import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Select from 'react-select';
import Link from 'next/link';
import IconArrowBackward from '@/components/Icon/IconArrowBackward';
import IconBack from '@/components/Icon/IconBack';
import dayjs from 'dayjs';
import { removeNullProperties } from '@/utils/commons';
import { createShift } from '@/services/apis/shift.api';

interface Props {
    [key: string]: any;
}

const AddNewShift = ({ ...props }: Props) => {
    const { t } = useTranslation();
    const [disabled, setDisabled] = useState(false);
    const [typeShift, setTypeShift] = useState(1); // 1: time, 0: total hours
   const baseSchema = {
    code: Yup.string().required(`${t('please_fill_code_shift')}`),
    name: Yup.string().required(`${t('please_fill_name_shift')}`),
    type: Yup.string(),
    wageRate: Yup.number().typeError(`${t('please_fill_wageRate')}`),
    totalHours: Yup.number().typeError(`${t('please_fill_total_time')}`),
    description: Yup.string().required(`${t('please_fill_description')}`),
    note: Yup.string(),
    isActive: Yup.bool().required(`${t('please_fill_status')}`)
    };

    const extendedSchema = typeShift === 0 ? {
    ...baseSchema,
    startTime: Yup.string().required(`${t('please_fill_from_time')}`),
    endTime: Yup.string().required(`${t('please_fill_end_time')}`),
    breakFrom: Yup.string().required(`${t('please_fill_break_from_time')}`),
    breakTo: Yup.string().required(`${t('please_fill_break_end_time')}`)
    } : baseSchema;

    const SubmittedForm = Yup.object().shape(extendedSchema);
    const handleAddShift = (value: any) => {
        removeNullProperties(value);
        let dataSubmit
        if (typeShift === 1) {
            dataSubmit = {
                code: value.code,
                name: value.name,
                type: value.type,
                wageRate: value.wageRate,
                totalHours: value.totalHours,
                description: value.description,
                note: value.note,
                isActive: value.isActive
            }
        } else {
             dataSubmit = {
                code: value.code,
                name: value.name,
                type: value.type,
                wageRate: value.wageRate,
                totalHours: value.totalHours,
                description: value.description,
                note: value.note,
                isActive: value.isActive,
                startTime: value.startTime,
                endTime: value.endTime,
                breakFrom: value.breakFrom,
                breakTo: value.breakTo
            }
        }
        createShift(dataSubmit).then(() => {
            showMessage(`${t('add_shift_success')}`, 'success');
        }).catch(() => {
            showMessage(`${t('add_shift_error')}`, 'error');
        })
    };

    const handleChangeTypeShift = (e: any, type: number) => {
        if (e) {
            setTypeShift(type)
        }
    }

    const handleCancel = () => {
        props.setOpenModal(false);
        props.setData(undefined);
    };
    return (

        <div className="p-5">
            <div className='flex justify-between header-page-bottom pb-4 mb-4'>
                <h1 className='page-title'>{t('add_shift')}</h1>
                <Link href="/hrm/shift">
                    <button type="button" className="btn btn-primary btn-sm m-1 back-button" >
                        <IconBack className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                        <span>
                            {t('back')}
                        </span>
                    </button>
                </Link>
            </div>
            <Formik
                initialValues={{
                    code: '',
                    name: '',
                    type: 1,
                    wageRate: null,
                    startTime: "",
                    endTime: "",
                    breakFrom: "",
                    breakTo: "",
                    totalHours: null,
                    note: "",
                    isActive: true,
                    description: ""
                }}
                validationSchema={SubmittedForm}
                onSubmit={(values) => {
                    handleAddShift(values);
                }}
            >
                {({ errors, touched, submitCount, setFieldValue }) => (
                    <Form className="space-y-5">
                        <div className='flex justify-between gap-5'>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="type" className='label'>
                                    {' '}
                                    {t('type_shift')} <span style={{ color: 'red' }}>* </span>
                                </label>
                                <div className="flex" style={{ alignItems: 'center', marginTop: '13px' }}>
                                    <label style={{ marginBottom: 0, marginRight: '10px' }}>
                                        <Field autoComplete="off" type="radio" name="type" value={1}
                                            checked={typeShift === 1}
                                            onChange={(e: any) => handleChangeTypeShift(e, 1)}
                                            className="form-checkbox rounded-full" />
                                        {t('shift_base_time')}
                                    </label>
                                    <label style={{ marginBottom: 0 }}>
                                        <Field autoComplete="off" type="radio" name="type" value={0}
                                            checked={typeShift === 0}
                                            onChange={(e: any) => handleChangeTypeShift(e, 0)}
                                            className="form-checkbox rounded-full" />
                                        {t('shift_base_total_time')}
                                    </label>
                                </div>
                                {submitCount ? errors.type ? <div className="mt-1 text-danger"> {errors.type} </div> : null : ''}
                            </div>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="code" className='label'>
                                    {' '}
                                    {t('code_shift')} <span style={{ color: 'red' }}>* </span>
                                </label>
                                <Field autoComplete="off" name="code" type="text" id="code_shift" placeholder={`${t('fill_code_shift')}`} className="form-input" />
                                {submitCount ? errors.code ? <div className="mt-1 text-danger"> {errors.code} </div> : null : ''}
                            </div>

                        </div>
                        <div className='flex justify-between gap-5'>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="name" className='label'>
                                    {' '}
                                    {t('name_shift')} <span style={{ color: 'red' }}>* </span>
                                </label>
                                <Field autoComplete="off" name="name" type="text" id="name" placeholder={`${t('fill_name_shift')}`} className="form-input" />
                                {submitCount ? errors.name ? <div className="mt-1 text-danger"> {errors.name} </div> : null : ''}
                            </div>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="wageRate" className='label'>
                                    {' '}
                                    {t('wageRate')}
                                </label>
                                <Field autoComplete="off" name="wageRate" type="number" id="wageRate" placeholder={t('fill_wage_rate')} className="form-input" />
                            </div>
                        </div>
                        {typeShift === 0 && <> <div className='flex justify-between gap-5'>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="from_time" className='label'>
                                    {' '}
                                    {t('from_time')} <span style={{ color: 'red' }}>* </span>
                                </label>
                                <Flatpickr
                                    options={{
                                        enableTime: true,
                                        noCalendar: true,
                                        dateFormat: "H:i",
                                        time_24hr: true
                                    }}
                                    onChange={e => {
                                        if (e.length > 0) {
                                            setFieldValue('startTime', dayjs(e[0]).format('HH:mm'));
                                        }
                                    }}
                                    className="form-input calender-input"
                                    placeholder={`${t('choose_from_time')}`}

                                />
                                {submitCount ? errors.startTime ? <div className="mt-1 text-danger"> {errors.startTime} </div> : null : ''}
                            </div>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="endTime" className='label'>
                                    {' '}
                                    {t('end_time')} <span style={{ color: 'red' }}>* </span>
                                </label>
                                <Flatpickr
                                    options={{
                                        enableTime: true,
                                        noCalendar: true,
                                        dateFormat: "H:i",
                                        time_24hr: true
                                    }}
                                    placeholder={`${t('choose_end_time')}`}
                                    onChange={e => {
                                        if (e.length > 0) {
                                            setFieldValue('endTime', dayjs(e[0]).format('HH:mm'));
                                        }
                                    }}
                                    className="form-input calender-input"
                                />
                                {submitCount ? errors.endTime ? <div className="mt-1 text-danger"> {errors.endTime} </div> : null : ''}
                            </div>
                        </div>
                            <div className='flex justify-between gap-5'>
                                <div className="mb-5 w-1/2">
                                    <label htmlFor="breakFrom" className='label'>
                                        {' '}
                                        {t('break_from_time')}
                                    </label>
                                    <Flatpickr
                                        options={{
                                            enableTime: true,
                                            noCalendar: true,
                                            dateFormat: "H:i",
                                            time_24hr: true
                                        }}
                                        placeholder={`${t('choose_break_from_time')}`}
                                        onChange={e => {
                                        if (e.length > 0) {
                                            setFieldValue('breakFrom', dayjs(e[0]).format('HH:mm'));
                                        }
                                    }}
                                        className="form-input calender-input"
                                    />
                                    {submitCount ? errors.breakFrom ? <div className="mt-1 text-danger"> {errors.breakFrom} </div> : null : ''}
                                </div>
                                <div className="mb-5 w-1/2">
                                    <label htmlFor="breakTo" className='label'>
                                        {' '}
                                        {t('break_end_time')}
                                    </label>
                                    <Flatpickr
                                        options={{
                                            enableTime: true,
                                            noCalendar: true,
                                            dateFormat: "H:i",
                                            time_24hr: true
                                        }}
                                        onChange={e => {
                                        if (e.length > 0) {
                                            setFieldValue('breakTo', dayjs(e[0]).format('HH:mm'));
                                        }
                                    }}
                                        placeholder={`${t('choose_break_end_time')}`}
                                        className="form-input calender-input"
                                    />
                                     {submitCount ? errors.breakTo ? <div className="mt-1 text-danger"> {errors.breakTo} </div> : null : ''}
                                </div>
                            </div>
                        </>}
                        <div className='flex justify-between gap-5'>

                            <div className="mb-5 w-1/2">
                                <label htmlFor="time" className='label'>
                                    {' '}
                                    {t('description')}
                                </label>
                                <Field autoComplete="off" name="description" as="textarea" id="description" placeholder={t('fill_description')} className="form-input" />
                            </div>

                            <div className="mb-5 w-1/2">
                                <label htmlFor="note" className='label'>
                                    {' '}
                                    {t('note')}
                                </label>
                                <Field autoComplete="off" name="note" as="textarea" id="note" placeholder={t('fill_note')} className="form-input" />
                                {errors.note ? <div className="mt-1 text-danger"> {errors.note} </div> : null}
                            </div>
                        </div>
                        <div className='flex justify-between gap-5'>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="description" className='label'>
                                    {' '}
                                    {t('time_shift')} <span style={{ color: 'red' }}>* </span>
                                </label>
                                <Field autoComplete="off" name="totalHours" type="number" id="totalHours" placeholder={t('fill_total_time')} className="form-input" />
                                {submitCount ? errors.totalHours ? <div className="mt-1 text-danger"> {errors.totalHours} </div> : null : ''}
                            </div>

                            <div className="mb-5 w-1/2">
                                <label htmlFor="status" className='label'> {t('status')} < span style={{ color: 'red' }}>* </span></label >
                                <div className="flex" style={{ alignItems: 'center', marginTop: '13px' }}>
                                    <label style={{ marginBottom: 0, marginRight: '10px' }}>
                                        <Field type="radio" name="isActive" value={true} className="form-checkbox rounded-full" />
                                        {t('active')}
                                    </label>
                                    <label style={{ marginBottom: 0 }}>
                                        <Field type="radio" name="isActive" value={false} className="form-checkbox rounded-full" />
                                        {t('inactive')}
                                    </label>
                                </div>

                                {submitCount ? errors.isActive ? (
                                    <div className="text-danger mt-1"> {errors.isActive} </div>
                                ) : null : ''}
                            </div>


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

export default AddNewShift;
