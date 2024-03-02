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
import { ProductCategorys, Providers } from '@/services/swr/product.twr';
import IconBack from '@/components/Icon/IconBack';
import department_list from '../department_list.json';

interface Props {
    [key: string]: any;
}

const EditDepartment = ({ ...props }: Props) => {
    const router = useRouter();

    const { t } = useTranslation();
    const [disabled, setDisabled] = useState(false);
    const [query, setQuery] = useState<any>();
    const [detail, setDetail] = useState<any>();

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
    useEffect(() => {
        if (Number(router.query.id)) {
            const detailData = department_list?.find(d => d.id === Number(router.query.id));
            setDetail(detailData);
        }
    }, [router])

    return (

        <div className="p-5">
            <div className='flex justify-between header-page-bottom pb-4 mb-4'>
                <h1 className='page-title'>{t('edit_department')}</h1>
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
                    name: detail ? `${detail?.name}` : '',
                    code: detail ? `${detail?.code}` : '',
                    abbreviated: detail ? `${detail?.abbreviated}` : '',
                    manageId: detail ? {
                        value: `${detail?.manage?.id}`,
                        label: `${detail?.manage?.name}`
                    } : "",
                    departmentparentId: detail ? {
                        value: `${detail?.departmentparent?.id}`,
                        label: `${detail?.departmentparent?.name}`
                    } : "",
                }}
                validationSchema={SubmittedForm}
                onSubmit={(values) => {
                    handleDepartment(values);
                }}
                enableReinitialize
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

export default EditDepartment;
