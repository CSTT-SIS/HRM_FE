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
import { Humans } from '@/services/swr/human.twr';
import { Departments } from '@/services/swr/department.twr';

import IconBack from '@/components/Icon/IconBack';
import { createDepartment } from '@/services/apis/department.api';


interface Props {
    [key: string]: any;
}

const AddNewDepartment = ({ ...props }: Props) => {
    const { t } = useTranslation();
    const [disabled, setDisabled] = useState(false);
    const [query, setQuery] = useState<any>();

    const [typeShift, setTypeShift] = useState("0"); // 0: time, 1: total hours
    const { data: departmentparents } = Departments(query);
    const { data: manages } = Humans(query);
    
   

    const manage = manages?.data.filter((item: any) => {
        return (
            item.value = item.id,
            item.label = item.fullName
        )
    })
    const departmentparent = departmentparents?.data.filter((item: any) => {
        return (
            item.value = item.id,
            item.label = item.name
        )
    })
    const SubmittedForm = Yup.object().shape({
        name: Yup.string()
            .min(2, 'Too Short!')
            .required(`${t('please_fill_name_department')}`),
        code: Yup.string()
            .min(2, 'Too Short!')
            .required(`${t('please_fill_departmentCode')}`),
            abbreviation: Yup.string()
            .min(2, 'Too Short!')
            .required(`${t('please_fill_abbreviated_name')}`),
    });
    const handleSearch = (param: any) => {
        setQuery({ search: param });
    }
    const handleDepartment = (value: any) => {
       
        createDepartment(value).then(() => {
            showMessage(`${t('add_department_success')}`, 'success');
        }).catch((err) => {
            showMessage(`${t('add_department_error')}`, 'error');
        });
    };

    const handleChangeTypeShift = (e: any) => {
        setTypeShift(e);
    }

    const handleCancel = () => {
        props.setOpenModal(false);
        props.setData(undefined);
    };
    return (

        <div className="p-5">
            <div className='flex justify-between header-page-bottom pb-4 mb-4'>
                <h1 className='page-title'>{t('add_department')}</h1>
                <Link href="/hrm/department">
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
                    name: props?.data ? `${props?.data?.name}` : '',
                    code: props?.data ? `${props?.data?.code}` : '',
                    description: props?.data ? `${props?.data?.description}` : '',
                    abbreviation: props?.data ? `${props?.data?.abbreviation}` : '',
                    headOfDepartmentId: props?.data ? props?.data?.headOfDepartmentId : null,
                    parentId: props?.data ? props?.data?.parentId : null,
                }}
                validationSchema={SubmittedForm}
                onSubmit={(values) => {
                    handleDepartment(values);
                }}
            >
                {({ errors, values, setFieldValue, submitCount }) => (
                    <Form className="space-y-5">
                        <div className="mb-5">
                            <label htmlFor="name" className='label'>
                                {' '}
                                {t('name_department')} <span style={{ color: 'red' }}>* </span>
                            </label>
                            <Field autoComplete="off" name="name" type="text" id="name" placeholder={`${t('enter_name_department')}`} className="form-input" />
                            {submitCount ? errors.name ? <div className="mt-1 text-danger"> {errors.name} </div> : null : ''}
                        </div>
                        <div className='flex justify-between gap-5'>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="code" className='label'>
                                    {' '}
                                    {t('code_department')} <span style={{ color: 'red' }}>* </span>
                                </label>
                                <Field autoComplete="off" name="code" type="text" id="code" placeholder={`${t('enter_code_department')}`} className="form-input" />
                                {submitCount ? errors.code ? <div className="mt-1 text-danger"> {errors.code} </div> : null : ''}
                            </div>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="abbreviation" className='label'>
                                    {' '}
                                    {t('Abbreviated_name')} <span style={{ color: 'red' }}>* </span>
                                </label>
                                <Field autoComplete="off" name="abbreviation" type="text" id="abbreviation" placeholder={`${t('enter_abbreviated_name')}`} className="form-input" />
                                {submitCount ? errors.abbreviation ? <div className="mt-1 text-danger"> {errors.abbreviation} </div> : null : ''}
                            </div>

                        </div>


                        <div className="flex justify-between gap-5">
                            <div className="mb-5 w-1/2">
                                <label htmlFor="parentId" className='label'> {t('Department_Parent')} < span style={{ color: 'red' }}>* </span></label >
                                <Select
                                    id='parentId'
                                    name='parentId'
                                    placeholder={t('select_departmentparent')}
                                    onInputChange={e => handleSearch(e)}
                                    options={departmentparent}
                                    maxMenuHeight={160}
                                    value={values.parentId}
                                    onChange={e => {
                                        setFieldValue('parentId', e)
                                    }}
                                />
                                {submitCount ? errors.parentId ? (
                                    <div className="text-danger mt-1"> {`${errors.parentId}`} </div>
                                ) : null : ''}
                            </div>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="headOfDepartmentId" className='label'> {t('Manager')} < span style={{ color: 'red' }}>* </span></label >
                                <Select
                                    id='headOfDepartmentId'
                                    name='headOfDepartmentId'
                                    placeholder={t('select_manager')}
                                    onInputChange={e => handleSearch(e)}
                                    options={manage}
                                    maxMenuHeight={160}
                                    value={values.headOfDepartmentId}
                                    onChange={e => {
                                        setFieldValue('headOfDepartmentId', e)
                                    }}
                                />
                                {submitCount ? errors.headOfDepartmentId ? (
                                    <div className="text-danger mt-1">  {`${errors.headOfDepartmentId}`} </div>
                                ) : null : ''}
                            </div>


                        </div>
                        <div className="mb-5">
                            <label htmlFor="description" className='label'>
                                {' '}
                                {t('description')}
                            </label>
                            <Field autoComplete="off" name="description"  as="textarea" id="description" placeholder={`${t('enter_description')}`} className="form-input" />
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

export default AddNewDepartment;
