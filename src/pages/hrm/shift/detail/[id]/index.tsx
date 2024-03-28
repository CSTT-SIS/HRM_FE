import { useEffect, Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog, Transition } from '@headlessui/react';
import { useRouter } from 'next/router';
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
import shift from '../../shift.json';
import Personnel from '../../personnel';
import { detailShift } from '@/services/apis/shift.api';

interface Props {
    [key: string]: any;
}

const AddNewShift = ({ ...props }: Props) => {
    const { t } = useTranslation();
    const [disabled, setDisabled] = useState(false);
    const router = useRouter();
    const [detail, setDetail] = useState<any>();
    const [typeShift, setTypeShift] = useState(1); // 0: time, 1: total hours
    useEffect(() => {
        const id = router.query.id
        if (id) {
            detailShift(id).then((res) => {
                console.log(res);
                setDetail(res?.data)
                setTypeShift(res?.data?.type)
            }).catch((err: any) => {
                console.log(err)
            });
        }
    }, [router])

    const handleChangeTypeShift = (e: any, type: number) => {
        console.log(e.target.checked);
        if (e) {
            setTypeShift(type)
        }
        // setTypeShift(e);
    }
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

    return (

        <div className="p-5">
            <div className='flex justify-between header-page-bottom pb-4 mb-4'>
                <h1 className='page-title'>{t('detail_shift')}</h1>
                <Link href="/hrm/shift">
                    <button type="button" className="btn btn-primary btn-sm m-1 back-button" >
                        <IconBack className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                        <span>
                            {t('back')}
                        </span>
                    </button>
                </Link>
            </div>
            <div className='header-page-bottom pb-4 mb-4'>

            <Formik
                initialValues={{
                    code: detail?.code,
                    name: detail?.name,
                    type: detail?.type,
                    wageRate: detail?.wageRate,
                    startTime: detail?.startTime,
                    endTime: detail?.endTime,
                    breakFrom: detail?.breakFrom,
                    breakTo: detail?.breakTo,
                    totalHours: detail?.totalHours,
                    note: detail?.note,
                    isActive: detail?.isActive,
                    description: detail?.description
                }}
                enableReinitialize
                validationSchema={SubmittedForm}
                onSubmit={() => {

                }}
            >
                {({ errors, touched, submitCount }) => (
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
                                            checked={detail?.type === 1}
                                            className="form-checkbox rounded-full" />
                                        {t('shift_base_time')}
                                    </label>
                                    <label style={{ marginBottom: 0 }}>
                                        <Field autoComplete="off" disabled type="radio" name="type" value={0}
                                        checked={typeShift === 0}
                                        className="form-checkbox rounded-full" />
                                        {t('shift_base_total_time')}
                                    </label>
                                </div>
                            </div>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="code" className='label'>
                                    {' '}
                                    {t('code_shift')} <span style={{ color: 'red' }}>* </span>
                                </label>
                                <Field autoComplete="off" disabled name="code" type="text" id="code" placeholder={`${t('fill_code_shift')}`} className="form-input" />
                            </div>

                        </div>
                        <div className='flex justify-between gap-5'>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="name" className='label'>
                                    {' '}
                                    {t('name_shift')} <span style={{ color: 'red' }}>* </span>
                                </label>
                                <Field autoComplete="off" disabled name="name" type="text" id="name" placeholder={`${t('fill_name_shift')}`} className="form-input" />
                            </div>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="wageRate" className='label'>
                                    {' '}
                                    {t('work_coefficient')} <span style={{ color: 'red' }}>* </span>
                                </label>
                                <Field autoComplete="off" disabled name="wageRate" type="number" id="wageRate" placeholder="" className="form-input" />
                            </div>
                        </div>
                        {typeShift === 0 && <> <div className='flex justify-between gap-5'>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="startTime" className='label'>
                                    {' '}
                                    {t('from_time')} <span style={{ color: 'red' }}>* </span>
                                </label>
                                <Field autoComplete="off" disabled
                                    name="startTime"
                                    type="time"
                                    className="form-input"
                                />
                            </div>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="endTime" className='label'>
                                    {' '}
                                    {t('end_time')} <span style={{ color: 'red' }}>* </span>
                                </label>
                                <Field autoComplete="off" disabled
                                    name="endTime"
                                    type="time"
                                    className="form-input"
                                />
                            </div>
                        </div>
                            <div className='flex justify-between gap-5'>
                                <div className="mb-5 w-1/2">
                                    <label htmlFor="breakFrom" className='label'>
                                        {' '}
                                        {t('break_from_time')} <span style={{ color: 'red' }}>* </span>
                                    </label>
                                    <Field autoComplete="off" disabled
                                        name="breakFrom"
                                        type="time"
                                        className="form-input"
                                    />
                                </div>
                                <div className="mb-5 w-1/2">
                                    <label htmlFor="breakTo" className='label'>
                                        {' '}
                                        {t('break_end_time')} <span style={{ color: 'red' }}>* </span>
                                    </label>
                                    <Field autoComplete="off" disabled
                                        name="breakTo"
                                        type="time"
                                    className="form-input"
                                    />
                                </div>
                            </div>
                        </>}
                        <div className='flex justify-between gap-5'>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="description" className='label'>
                                    {' '}
                                    {t('description')} <span style={{ color: 'red' }}>* </span>
                                </label>
                                <Field autoComplete="off" disabled name="description" as="textarea" id="description" placeholder={t('fill_description')} className="form-input" />
                                {submitCount ? errors?.description ? <div className="mt-1 text-danger">
                                {`${errors?.description}`}
                                    </div> : null : ''}
                            </div>

                            <div className="mb-5 w-1/2">
                                <label htmlFor="note" className='label'>
                                    {' '}
                                    {t('note')}
                                </label>
                                <Field autoComplete="off" disabled name="note" as="textarea" id="note" placeholder={t('fill_note')} className="form-input" />
                            </div>
                        </div>
                        <div className='flex justify-between gap-5'>
                        <div className="mb-5 w-1/2">
                                <label htmlFor="totalHours" className='label'>
                                    {' '}
                                    {t('time_shift')} <span style={{ color: 'red' }}>* </span>
                                </label>
                                <Field autoComplete="off" disabled name="totalHours" type="number" id="totalHours" placeholder={t('fill_total_time')} className="form-input" />
                            </div>
                        <div className="mb-5 w-1/2">
                                <label htmlFor="isActive" className='label'> {t('status')} < span style={{ color: 'red' }}>* </span></label >
                                <div className="flex" style={{ alignItems: 'center', marginTop: '13px' }}>
                                    <label style={{ marginBottom: 0, marginRight: '10px' }}>
                                        <Field autoComplete="off" disabled type="radio" name="isActive" value={true} className="form-checkbox rounded-full"/>
                                        {t('active')}
                                    </label>
                                    <label style={{ marginBottom: 0 }}>
                                        <Field autoComplete="off" disabled type="radio" name="isActive" value={false} className="form-checkbox rounded-full" />
                                        {t('inactive')}
                                    </label>
                                </div>
                            </div>


                        </div>
                        {/* <div className="mt-8 flex items-center justify-end ltr:text-right rtl:text-left gap-8">
                            <button type="button" className="btn btn-outline-dark cancel-button" onClick={() => handleCancel()}>
                                {t('cancel')}
                            </button>
                            <button type="submit" className="btn :ml-4 rtl:mr-4 add-button" disabled={disabled}>
                                {t('update')}
                            </button>
                        </div> */}
                    </Form>
                )}
            </Formik>
            </div>
            <div>
            <h1 className='page-title'>{t('list_staff_by_shift')}</h1>
            <Personnel id={router.query.id}/>
            </div>
        </div>

    );
};

export default AddNewShift;
