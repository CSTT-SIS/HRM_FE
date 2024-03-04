import { useEffect, Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';

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
import shift from '../shift.json';

interface Props {
    [key: string]: any;
}

const EditShift = ({ ...props }: Props) => {
    const { t } = useTranslation();
    const router = useRouter();
    const [detail, setDetail] = useState<any>();

    const [disabled, setDisabled] = useState(false);
    const [typeShift, setTypeShift] = useState("0"); // 0: time, 1: total hours
    const SubmittedForm = Yup.object().shape({
        name_shift: Yup.object()
            .typeError(`${t('please_fill_name_shift')}`),
        type_shift: Yup.object()
            .typeError(`${t('please_choose_type_shift')}`),
        department_apply: Yup.object()
            .typeError(`${t('please_choose_department_apply')}`),
        time: Yup.date().typeError(`${t('please_choose_from_day')}`),
        from_time: Yup.date().typeError(`${t('please_fill_from_time')}`),
        end_time: Yup.date().typeError(`${t('please_fill_end_time')}`),
        alo: Yup.string().required('alo')
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

    const handleChangeTypeShift = (e: any) => {
        setTypeShift(e);
    }
    useEffect(() => {
        if (Number(router.query.id)) {
            const detailData = shift?.find(d => d.id === Number(router.query.id));
            setDetail(detailData);
        }
    }, [router])
    const handleCancel = () => {
        props.setOpenModal(false);
        props.setData(undefined);
    };
    return (

        <div className="p-5">
            <div className='flex justify-between header-page-bottom pb-4 mb-4'>
                <h1 className='page-title'>{t('edit_shift')}</h1>
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
                    code_shift: detail ? `${detail?.code_shift}` : '',
                    name_shift: detail ? `${detail?.name_shift}` : '',
                    type_shift: detail ? `${detail?.type_shift}` : '',
                    work_coefficient: detail ? `${detail?.work_coefficient}` : '',
                    department_apply: detail ? `${detail?.department_apply}` : '',
                    from_time: detail ? `${detail?.from_time}` : '',
                    end_time: detail ? `${detail?.end_time}` : '',
                    break_from_time: detail ? `${detail?.break_from_time}` : '',
                    break_end_time: detail ? `${detail?.break_end_time}` : '',
                    time: detail ? `${detail?.time}` : '',
                }}
                validationSchema={SubmittedForm}
                onSubmit={(values) => {
                    handleDepartment(values);
                }}
                enableReinitialize
            >
                {({ errors, touched }) => (
                    <Form className="space-y-5">
                        <div className='flex justify-between gap-5'>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="type_shift" className='label'>
                                    {' '}
                                    {t('type_shift')} <span style={{ color: 'red' }}>* </span>
                                </label>
                                <div className="flex" style={{ alignItems: 'center', marginTop: '13px' }}>
                                    <label style={{ marginBottom: 0, marginRight: '10px' }}>
                                        <Field type="radio" name="type_shift" value={0} className="form-checkbox rounded-full" />
                                        Ca theo thời gian
                                    </label>
                                    <label style={{ marginBottom: 0 }}>
                                        <Field type="radio" name="type_shift" value={1} className="form-checkbox rounded-full" />
                                        Ca theo số giờ
                                    </label>
                                </div>
                                {errors.type_shift ? <div className="mt-1 text-danger"> {errors.type_shift} </div> : null}
                            </div>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="code_shift" className='label'>
                                    {' '}
                                    {t('code_shift')} <span style={{ color: 'red' }}>* </span>
                                </label>
                                <Field name="code_shift" type="text" id="code_shift" placeholder={`${t('fill_code_shift')}`} className="form-input" />
                                {errors.code_shift ? <div className="mt-1 text-danger"> {errors.code_shift} </div> : null}
                            </div>
                        </div>
                        <div className='flex justify-between gap-5'>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="name_shift" className='label'>
                                    {' '}
                                    {t('name_shift')} <span style={{ color: 'red' }}>* </span>
                                </label>
                                <Field name="name_shift" type="text" id="name_shift" placeholder={`${t('fill_name_shift')}`} className="form-input" />
                                {errors.name_shift ? <div className="mt-1 text-danger"> {errors.name_shift} </div> : null}
                            </div>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="work_coefficient" className='label'>
                                    {' '}
                                    {t('work_coefficient')} <span style={{ color: 'red' }}>* </span>
                                </label>
                                <Field name="work_coefficient" type="number" id="work_coefficient" placeholder="" className="form-input" />
                                {errors.work_coefficient ? <div className="mt-1 text-danger"> {errors.work_coefficient} </div> : null}
                            </div>
                        </div>
                        {typeShift === "0" && <> <div className='flex justify-between gap-5'>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="from_time" className='label'>
                                    {' '}
                                    {t('from_time')} <span style={{ color: 'red' }}>* </span>
                                </label>
                                <Field
                                    name="from_time"
                                    render={({ field }: any) => (
                                        <Flatpickr
                                            data-enable-time
                                            placeholder={`${t('choose_from_time')}`}
                                            options={{
                                                enableTime: true,
                                                dateFormat: 'H:i'
                                            }}
                                            className="form-input"
                                        />
                                    )}
                                />
                                {errors.from_time ? <div className="mt-1 text-danger"> {errors.from_time} </div> : null}
                            </div>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="end_time" className='label'>
                                    {' '}
                                    {t('end_time')} <span style={{ color: 'red' }}>* </span>
                                </label>
                                <Field
                                    name="end_time"
                                    render={({ field }: any) => (
                                        <Flatpickr
                                            data-enable-time
                                            placeholder={`${t('choose_end_time')}`}
                                            options={{
                                                enableTime: true,
                                                dateFormat: 'Y-m-d H:i'
                                            }}
                                            className="form-input"
                                        />
                                    )}
                                />
                                {errors.end_time ? <div className="mt-1 text-danger"> {errors.end_time} </div> : null}
                            </div>
                        </div>
                            <div className='flex justify-between gap-5'>
                                <div className="mb-5 w-1/2">
                                    <label htmlFor="break_from_time" className='label'>
                                        {' '}
                                        {t('break_from_time')} <span style={{ color: 'red' }}>* </span>
                                    </label>
                                    <Field
                                        name="break_from_time"
                                        render={({ field }: any) => (
                                            <Flatpickr
                                                data-enable-time
                                                placeholder={`${t('choose_break_from_time')}`}
                                                options={{
                                                    enableTime: true,
                                                    dateFormat: 'H:i'
                                                }}
                                                className="form-input"
                                            />
                                        )}
                                    />
                                    {errors.break_from_time ? <div className="mt-1 text-danger"> {errors.break_from_time} </div> : null}
                                </div>
                                <div className="mb-5 w-1/2">
                                    <label htmlFor="break_end_time" className='label'>
                                        {' '}
                                        {t('break_end_time')} <span style={{ color: 'red' }}>* </span>
                                    </label>
                                    <Field
                                        name="break_end_time"
                                        render={({ field }: any) => (
                                            <Flatpickr
                                                data-enable-time
                                                placeholder={`${t('choose_break_end_time')}`}
                                                options={{
                                                    enableTime: true,
                                                    dateFormat: 'Y-m-d H:i'
                                                }}
                                                className="form-input"
                                            />
                                        )}
                                    />
                                    {errors.break_end_time ? <div className="mt-1 text-danger"> {errors.break_end_time} </div> : null}
                                </div>
                            </div>
                        </>}
                        <div className='flex justify-between gap-5'>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="time" className='label'>
                                    {' '}
                                    {t('description')} <span style={{ color: 'red' }}>* </span>
                                </label>
                                <Field disabled name="time" type="text" id="time" placeholder="" className="form-input" />
                                {errors.time ? <div className="mt-1 text-danger"> {errors.time} </div> : null}
                            </div>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="description" className='label'>
                                    {' '}
                                    {t('time_shift')} <span style={{ color: 'red' }}>* </span>
                                </label>
                                <Field disabled name="time" type="text" id="time" placeholder="" className="form-input" />
                                {errors.time ? <div className="mt-1 text-danger"> {errors.time} </div> : null}
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

export default EditShift;