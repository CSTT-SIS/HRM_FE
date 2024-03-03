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
import { ProductCategorys, Providers } from '@/services/swr/product.twr';
import IconBack from '@/components/Icon/IconBack';

interface Props {
    [key: string]: any;
}

const AddNewDepartment = ({ ...props }: Props) => {
    const { t } = useTranslation();
    const [disabled, setDisabled] = useState(false);
    const [query, setQuery] = useState<any>();

    const [typeShift, setTypeShift] = useState("0"); // 0: time, 1: total hours
    const { data: departmentparents } = ProductCategorys(query);
    const { data: manages } = Providers(query);
    const departmentparent = departmentparents?.data.filter((item: any) => {
        return (
            item.value = item.id,
            item.label = item.name,
            delete item.createdAt
        )
    })

    const manage = manages?.data.filter((item: any) => {
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
        abbreviated: Yup.string()
            .min(2, 'Too Short!')
            .required(`${t('please_fill_abbreviated_name')}`),
    });
    const handleSearch = (param: any) => {
        setQuery({ search: param });
    }
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
                    abbreviated: props?.data ? `${props?.data?.abbreviated}` : '',
                    manageId: props?.data ? {
                        value: `${props?.data?.manage.id}`,
                        label: `${props?.data?.manage.name}`
                    } : "",
                    departmentparentId: props?.data ? {
                        value: `${props?.data?.departmentparent.id}`,
                        label: `${props?.data?.departmentparent.name}`
                    } : "",
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
                            <Field name="name" type="text" id="name" placeholder={`${t('enter_name_department')}`} className="form-input" />
                            {submitCount ? errors.name ? <div className="mt-1 text-danger"> {errors.name} </div> : null : ''}
                        </div>
                        <div className='flex justify-between gap-5'>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="code" className='label'>
                                    {' '}
                                    {t('code_department')} <span style={{ color: 'red' }}>* </span>
                                </label>
                                <Field name="code" type="text" id="code" placeholder={`${t('enter_code_department')}`} className="form-input" />
                                {submitCount ? errors.code ? <div className="mt-1 text-danger"> {errors.code} </div> : null : ''}
                            </div>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="code" className='label'>
                                    {' '}
                                    {t('Abbreviated_name')} <span style={{ color: 'red' }}>* </span>
                                </label>
                                <Field name="abbreviated" type="text" id="abbreviated" placeholder={`${t('enter_abbreviated_name')}`} className="form-input" />
                                {submitCount ? errors.abbreviated ? <div className="mt-1 text-danger"> {errors.abbreviated} </div> : null : ''}
                            </div>

                        </div>


                        <div className="flex justify-between gap-5">
                            <div className="mb-5 w-1/2">
                                <label htmlFor="departmentparentId" className='label'> {t('Department_Parent')} < span style={{ color: 'red' }}>* </span></label >
                                <Select
                                    id='unidepartmentparentIdtId'
                                    name='departmentparentId'
                                    placeholder={t('select_departmentparent')}
                                    onInputChange={e => handleSearch(e)}
                                    options={departmentparent}
                                    maxMenuHeight={160}
                                    value={values.departmentparentId}
                                    onChange={e => {
                                        setFieldValue('departmentparentId', e)
                                    }}
                                />
                                {submitCount ? errors.departmentparentId ? (
                                    <div className="text-danger mt-1"> {errors.departmentparentId} </div>
                                ) : null : ''}
                            </div>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="manageId" className='label'> {t('Manager')} < span style={{ color: 'red' }}>* </span></label >
                                <Select
                                    id='manageId'
                                    name='manageId'
                                    placeholder={t('select_manager')}
                                    onInputChange={e => handleSearch(e)}
                                    options={manage}
                                    maxMenuHeight={160}
                                    value={values.manageId}
                                    onChange={e => {
                                        setFieldValue('manageId', e)
                                    }}
                                />
                                {submitCount ? errors.manageId ? (
                                    <div className="text-danger mt-1"> {errors.manageId} </div>
                                ) : null : ''}
                            </div>


                        </div>
                        <div className="mb-5">
                            <label htmlFor="name" className='label'>
                                {' '}
                                {t('description')}
                            </label>
                            <Field name="name"  as="textarea" id="name" placeholder={`${t('enter_description')}`} className="form-input" />
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
