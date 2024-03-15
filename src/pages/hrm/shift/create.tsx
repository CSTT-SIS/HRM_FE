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

interface Props {
    [key: string]: any;
}

const AddNewShift = ({ ...props }: Props) => {
    const { t } = useTranslation();
    const [disabled, setDisabled] = useState(false);
    const [typeShift, setTypeShift] = useState("0"); // 0: time, 1: total hours
    const SubmittedForm = Yup.object().shape({
        code_shift: Yup.string().required(`${t('please_fill_code_shift')}`),
        name_shift: Yup.string()
            .required(`${t('please_fill_name_shift')}`),
        type_shift: Yup.string(),
        work_coefficient: Yup.number().typeError(`${t('please_fill_work_coefficient')}`),
        time: Yup.number().typeError(`${t('please_fill_total_time')}`),
        from_time: typeShift === "0" ? Yup.date().typeError(`${t('please_fill_from_time')}`) : Yup.date(),
        end_time: typeShift === "0" ? Yup.date().typeError(`${t('please_fill_end_time')}`) : Yup.date(),
        break_from_time: typeShift === "0" ? Yup.date().typeError(`${t('please_fill_break_from_time')}`) : Yup.date(),
        break_end_time: typeShift === "0" ? Yup.date().typeError(`${t('please_fill_break_end_time')}`) : Yup.date(),
        description: Yup.string().required(`${t('please_fill_description')}`),
        note: Yup.string(),
        status: Yup.string().required(`${t('please_fill_status')}`)
    });

    const handleDepartment = (value: any) => {
        if (props?.data) {
            const reNew = props.totalData.filter((item: any) => item.id !== props.data.id);
            reNew.push({
                id: props.data.id,
                name: value.name,
                code: value.code,
            });
            localStorage.setItem('departmentList', JSON.stringify(reNew));
            props.setGetStorge(reNew);
            props.setOpenModal(false);
            props.setData(undefined);
            showMessage(`${t('edit_department_success')}`, 'success');
        } else {
            const reNew = props.totalData;
            reNew.push({
                id: Number(props?.totalData[props?.totalData?.length - 1].id) + 1,
                name: value.name,
                code: value.code,
                status: value.status,
            });
            localStorage.setItem('departmentList', JSON.stringify(reNew));
            props.setGetStorge(props.totalData);
            props.setOpenModal(false);
            props.setData(undefined);
            showMessage(`${t('add_department_success')}`, 'success');
        }
    };

    const handleChangeTypeShift = (e: any, type: string) => {
        console.log(e.target.checked);
        if (e) {
            setTypeShift(type)
        }
        // setTypeShift(e);
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
                    code_shift: '',
                    name_shift: '',
                    type_shift: "Ca theo thời gian",
                    work_coefficient: null,
                    from_time: null,
                    end_time: null,
                    break_from_time: null,
                    break_end_time: null,
                    time: null,
                    note: "",
                    status: "active",
                    description: ""
                }}
                validationSchema={SubmittedForm}
                onSubmit={(values) => {
                    handleDepartment(values);
                }}
            >
                {({ errors, touched, submitCount }) => (
                    <Form className="space-y-5">
                        <div className='flex justify-between gap-5'>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="type_shift" className='label'>
                                    {' '}
                                    {t('type_shift')} <span style={{ color: 'red' }}>* </span>
                                </label>
                                <div className="flex" style={{ alignItems: 'center', marginTop: '13px' }}>
                                    <label style={{ marginBottom: 0, marginRight: '10px' }}>
                                        <Field type="radio" name="type_shift" value="Ca theo thời gian"
                                            checked={typeShift === "0"}
                                            onChange={(e: any) => handleChangeTypeShift(e, "0")}
                                            className="form-checkbox rounded-full" />
                                        {t('shift_base_time')}
                                    </label>
                                    <label style={{ marginBottom: 0 }}>
                                        <Field type="radio" name="type_shift" value="Ca theo tổng số giờ"
                                            checked={typeShift === "1"}
                                            onChange={(e: any) => handleChangeTypeShift(e, "1")}
                                            className="form-checkbox rounded-full" />
                                        {t('shift_base_total_time')}
                                    </label>
                                </div>
                                {submitCount ? errors.type_shift ? <div className="mt-1 text-danger"> {errors.type_shift} </div> : null : ''}
                            </div>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="code_shift" className='label'>
                                    {' '}
                                    {t('code_shift')} <span style={{ color: 'red' }}>* </span>
                                </label>
                                <Field name="code_shift" type="text" id="code_shift" placeholder={`${t('fill_code_shift')}`} className="form-input" />
                                {submitCount ? errors.code_shift ? <div className="mt-1 text-danger"> {errors.code_shift} </div> : null : ''}
                            </div>

                        </div>
                        <div className='flex justify-between gap-5'>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="name_shift" className='label'>
                                    {' '}
                                    {t('name_shift')} <span style={{ color: 'red' }}>* </span>
                                </label>
                                <Field name="name_shift" type="text" id="name_shift" placeholder={`${t('fill_name_shift')}`} className="form-input" />
                                {submitCount ? errors.name_shift ? <div className="mt-1 text-danger"> {errors.name_shift} </div> : null : ''}
                            </div>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="work_coefficient" className='label'>
                                    {' '}
                                    {t('work_coefficient')} <span style={{ color: 'red' }}>* </span>
                                </label>
                                <Field name="work_coefficient" type="number" id="work_coefficient" placeholder="" className="form-input" />
                                {submitCount ? errors.work_coefficient ? <div className="mt-1 text-danger"> {errors.work_coefficient} </div> : null : ""}
                            </div>
                        </div>
                        {typeShift === "0" && <> <div className='flex justify-between gap-5'>
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
                                    className="form-input calender-input"
                                />
                                {submitCount ? errors.from_time ? <div className="mt-1 text-danger"> {errors.from_time} </div> : null : ''}
                            </div>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="end_time" className='label'>
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
                                    className="form-input calender-input"
                                />
                                {submitCount ? errors.end_time ? <div className="mt-1 text-danger"> {errors.end_time} </div> : null : ''}
                            </div>
                        </div>
                            <div className='flex justify-between gap-5'>
                                <div className="mb-5 w-1/2">
                                    <label htmlFor="break_from_time" className='label'>
                                        {' '}
                                        {t('break_from_time')} <span style={{ color: 'red' }}>* </span>
                                    </label>
                                    <Flatpickr
                                        options={{
                                            enableTime: true,
                                            noCalendar: true,
                                            dateFormat: "H:i",
                                            time_24hr: true
                                        }}
                                        className="form-input calender-input"
                                    />
                                    {submitCount ? errors.break_from_time ? <div className="mt-1 text-danger"> {errors.break_from_time} </div> : null : ''}
                                </div>
                                <div className="mb-5 w-1/2">
                                    <label htmlFor="break_end_time" className='label'>
                                        {' '}
                                        {t('break_end_time')} <span style={{ color: 'red' }}>* </span>
                                    </label>
                                    <Flatpickr
                                        options={{
                                            enableTime: true,
                                            noCalendar: true,
                                            dateFormat: "H:i",
                                            time_24hr: true
                                        }}
                                        className="form-input calender-input"
                                    />
                                    {submitCount ? errors.break_end_time ? <div className="mt-1 text-danger"> {errors.break_end_time} </div> : null : ''}
                                </div>
                            </div>
                        </>}
                        <div className='flex justify-between gap-5'>

                            <div className="mb-5 w-1/2">
                                <label htmlFor="time" className='label'>
                                    {' '}
                                    {t('description')} <span style={{ color: 'red' }}>* </span>
                                </label>
                                <Field name="description" as="textarea" id="description" placeholder={t('fill_description')} className="form-input" />
                                {submitCount ? errors.description ? <div className="mt-1 text-danger"> {errors.description} </div> : null : ''}
                            </div>

                            <div className="mb-5 w-1/2">
                                <label htmlFor="note" className='label'>
                                    {' '}
                                    {t('note')}
                                </label>
                                <Field name="note" as="textarea" id="note" placeholder={t('fill_note')} className="form-input" />
                                {errors.note ? <div className="mt-1 text-danger"> {errors.note} </div> : null}
                            </div>
                        </div>
                        <div className='flex justify-between gap-5'>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="description" className='label'>
                                    {' '}
                                    {t('time_shift')} <span style={{ color: 'red' }}>* </span>
                                </label>
                                <Field name="time" type="number" id="time" placeholder={t('fill_total_time')} className="form-input" />
                                {submitCount ? errors.time ? <div className="mt-1 text-danger"> {errors.time} </div> : null : ''}
                            </div>

                            <div className="mb-5 w-1/2">
                                <label htmlFor="status" className='label'> {t('status')} < span style={{ color: 'red' }}>* </span></label >
                                <div className="flex" style={{ alignItems: 'center', marginTop: '13px' }}>
                                    <label style={{ marginBottom: 0, marginRight: '10px' }}>
                                        <Field type="radio" name="status" value="active" className="form-checkbox rounded-full" />
                                        {t('active')}
                                    </label>
                                    <label style={{ marginBottom: 0 }}>
                                        <Field type="radio" name="status" value="inactive" className="form-checkbox rounded-full" />
                                        {t('inactive')}
                                    </label>
                                </div>

                                {submitCount ? errors.status ? (
                                    <div className="text-danger mt-1"> {errors.status} </div>
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
