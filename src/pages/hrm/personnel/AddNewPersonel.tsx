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
import AnimateHeight from 'react-animate-height';
import IconCaretDown from '@/components/Icon/IconCaretDown';
import IconBack from '@/components/Icon/IconBack';

interface Props {
    [key: string]: any;
}

const AddNewPersonel = ({ ...props }: Props) => {
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
            .required(`${t('please_fill_name_staff')}`),
        code: Yup.string()
            .min(2, 'Too Short!')
            .required(`${t('please_fill_staff_code')}`),
        surname: Yup.string()
            .min(2, 'Too Short!')
            .required(`${t('please_fill_surname_name')}`),
        email: Yup.string()
            .min(2, 'Too Short!')
            .required(`${t('please_fill_email')}`),
        phone: Yup.string()
            .min(2, 'Too Short!')
            .required(`${t('please_fill_phone')}`),
        userName: Yup.string()
            .min(2, 'Too Short!')
            .required(`${t('please_fill_username')}`),
    });
    const handleSearch = (param: any) => {
        setQuery({ search: param });
    }
    const handleWarehouse = (value: any) => {
        if (props?.data) {
            const reNew = props.totalData.filter((item: any) => item.id !== props.data.id);
            reNew.push({
                id: props.data.id,
                name: value.name,
                code: value.code,
                status: value.status,
            });
            localStorage.setItem('staffList', JSON.stringify(reNew));
            props.setGetStorge(reNew);
            props.setOpenModal(false);
            props.setData(undefined);
            showMessage(`${t('edit_staff_success')}`, 'success');
        } else {
            const reNew = props.totalData;
            reNew.push({
                id: Number(props?.totalData[props?.totalData?.length - 1].id) + 1,
                name: value.name,
                code: value.code,
                status: value.status,
            });
            localStorage.setItem('staffList', JSON.stringify(reNew));
            props.setGetStorge(props.totalData);
            props.setOpenModal(false);
            props.setData(undefined);
            showMessage(`${t('add_staff_success')}`, 'success');
        }
    };

    const handleChangeTypeShift = (e: any) => {
        setTypeShift(e);
    }
    const [active, setActive] = useState<string>('1');
    const togglePara = (value: string) => {
        setActive((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };
    const handleCancel = () => {
        props.setOpenModal(false);
        props.setData(undefined);
    };
    return (

        <div className="p-5">
            <div className='flex justify-between header-page-bottom pb-4 mb-4'>
                <h1 className='page-title'>{t('add_staff')}</h1>
                <Link href="/hrm/personnel">
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
                    surname: props?.data ? `${props?.data?.surname}` : '',
                    email: props?.data ? `${props?.data?.email}` : '',
                    phone: props?.data ? `${props?.data?.phone}` : '',
                    userName: props?.data ? `${props?.data?.userName}` : '',
                    othername: props?.data ? `${props?.data?.othername}` : '',
                    dateofbirth: props?.data ? `${props?.data?.dateofbirth}` : '',
                    sex: props?.data ? {
                        value: `${props?.data?.sex.id}`,
                        label: `${props?.data?.sex.name}`
                    } : "",
                    IDnumber: props?.data ? `${props?.data?.IDnumber}` : '',
                    dateissue: props?.data ? `${props?.data?.dateissue}` : '',
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
                onSubmit={() => { }}

            >
                {({ errors, touched, values, setFieldValue, submitCount }) => (
                    <Form className="space-y-5">
                        <div className="mb-5">
                            <div className="space-y-2 font-semibold">
                                <div className="rounded">
                                    <button
                                        type="button"
                                        className={`flex w-full items-center p-4 text-white-dark dark:bg-[#1b2e4b] custom-accordion`}
                                        onClick={() => togglePara('1')}
                                    >
                                        {t('general_infomation')}                                        <div className={`ltr:ml-auto rtl:mr-auto ${active === '1' ? 'rotate-180' : ''}`}>
                                            <IconCaretDown />
                                        </div>
                                    </button>
                                    <div className={`${active === '1' ? 'custom-content-accordion' : ''}`}>
                                        <AnimateHeight duration={300} height={active === '1' ? 'auto' : 0}>
                                            <div className="space-y-2 border-[#d3d3d3] p-4 text-[13px] text-white-dark dark:border-[#1b2e4b]">
                                                <div className='flex justify-between gap-5'>
                                                    <div className="mb-5 w-1/2">
                                                        <label htmlFor="code" className='label'>
                                                            {' '}
                                                            {t('code_staff')} <span style={{ color: 'red' }}>* </span>
                                                        </label>
                                                        <Field name="code" type="text" id="code" placeholder={`${t('enter_code_staff')}`} className="form-input" />
                                                        {submitCount ? errors.code ? <div className="mt-1 text-danger"> {errors.code} </div> : null : ''}
                                                    </div>
                                                    <div className="mb-5 w-1/2">
                                                        <label htmlFor="name" className='label'>
                                                            {' '}
                                                            {t('name_staff')} <span style={{ color: 'red' }}>* </span>
                                                        </label>
                                                        <Field name="name" type="text" id="name" placeholder={`${t('enter_name_staff')}`} className="form-input" />
                                                        {submitCount ? errors.name ? <div className="mt-1 text-danger"> {errors.name} </div> : null : ''}
                                                    </div>
                                                </div>
                                                <div className='flex justify-between gap-5'>
                                                    <div className="mb-5 w-1/2">
                                                        <label htmlFor="surname" className='label'>
                                                            {' '}
                                                            {t('surname_middle')} <span style={{ color: 'red' }}>* </span>
                                                        </label>
                                                        <Field name="surname" type="text" id="surname" placeholder={t('enter_surname_middle')} className="form-input" />
                                                        {submitCount ? errors.surname ? <div className="mt-1 text-danger"> {errors.surname} </div> : null : ''}
                                                    </div>
                                                    <div className="mb-5 w-1/2">
                                                        <label htmlFor="email" className='label'>
                                                            {' '}
                                                            Email <span style={{ color: 'red' }}>* </span>
                                                        </label>
                                                        <Field name="email" type="text" id="email" placeholder={t('enter_email')} className="form-input" />
                                                        {submitCount ? errors.email ? <div className="mt-1 text-danger"> {errors.email} </div> : null : ''}
                                                    </div>
                                                </div>
                                                <div className='flex justify-between gap-5'>
                                                    <div className="mb-5 w-1/2">
                                                        <label htmlFor="phone" className='label'>
                                                            {' '}
                                                            {t('phone_number')} <span style={{ color: 'red' }}>* </span>
                                                        </label>
                                                        <Field name="phone" type="text" id="phone" placeholder={t('enter_phone_number')} className="form-input" />
                                                        {submitCount ? errors.phone ? <div className="mt-1 text-danger"> {errors.phone} </div> : null : ''}
                                                    </div>
                                                    <div className="mb-5 w-1/2">
                                                        <label htmlFor="userName" className='label'>
                                                            {' '}
                                                            {t('username')}<span style={{ color: 'red' }}>* </span>
                                                        </label>
                                                        <Field name="userName" type="text" id="userName" placeholder={t('enter_user_name')} className="form-input" />
                                                        {submitCount ? errors.userName ? <div className="mt-1 text-danger"> {errors.userName} </div> : null : ''}
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <button type="button" className="btn btn-outline-danger" onClick={() => handleCancel()}>
																		{t('reset_password')}
																	</button> */}
                                        </AnimateHeight>
                                    </div>
                                </div>
                                <div className="rounded">
                                    <button
                                        type="button"
                                        className={`flex w-full items-center p-4 text-white-dark dark:bg-[#1b2e4b] custom-accordion`}
                                        onClick={() => togglePara('2')}
                                    >
                                        {t('personal_information')}
                                        <div className={`ltr:ml-auto rtl:mr-auto ${active === '2' ? 'rotate-180' : ''}`}>
                                            <IconCaretDown />
                                        </div>
                                    </button>
                                    <div className={`${active === '2' ? 'custom-content-accordion' : ''}`}>
                                        <AnimateHeight duration={300} height={active === '2' ? 'auto' : 0}>
                                            <div className="space-y-2 border-t border-[#d3d3d3] p-4 text-[13px] text-white-dark dark:border-[#1b2e4b]">
                                                <div className='flex justify-between gap-5'>
                                                    <div className="mb-5 w-1/2">
                                                        <label htmlFor="othername" className='label'>
                                                            {' '}
                                                            {t('other_name')}
                                                        </label>
                                                        <Field name="othername" type="text" id="othername" placeholder={t('enter_other_name')} className="form-input" />
                                                    </div>
                                                    <div className="mb-5 w-1/2">
                                                        <label htmlFor="dateofbirth" className='label'>
                                                            {' '}
                                                            {t('date_of_birth')}
                                                        </label>
                                                        <Flatpickr
                                                            options={{
                                                                dateFormat: 'Y-m-d',
                                                                position: 'auto left',
                                                            }}
                                                            className="form-input"
                                                            placeholder={`${t('enter_date_of_birth')}`}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='flex justify-between gap-5'>
                                                    <div className="mb-5 w-1/2">
                                                        <label htmlFor="sex" className='label'>
                                                            {' '}
                                                            {t('gender')}
                                                        </label>
                                                        <Select
                                                            id='sex'
                                                            name='sex'
                                                            options={[{
                                                                value: 1,
                                                                label: 'Nam'
                                                            }, {
                                                                value: 0,
                                                                label: 'Nữ'
                                                            }]}
                                                            placeholder={'Chọn giới tính'}
                                                            maxMenuHeight={160}
                                                            onChange={e => {
                                                                setFieldValue('sex', e)
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="mb-5 w-1/2">
                                                        <label htmlFor="IDnumber" className='label'>
                                                            {' '}
                                                            {t('id_number')}
                                                        </label>
                                                        <Field name="IDnumber" type="text" id="IDnumber" placeholder={t('enter_id_number')} className="form-input" />
                                                    </div>
                                                </div>
                                                <div className='flex justify-between gap-5'>
                                                    <div className="mb-5 w-1/2">
                                                        <label htmlFor="dateissue" className='label'>
                                                            {' '}
                                                            {t('date_of_issue')}
                                                        </label>
                                                        <Flatpickr
                                                            options={{
                                                                dateFormat: 'Y-m-d',
                                                                position: 'auto left',
                                                            }}
                                                            className="form-input"
                                                            placeholder={`${t('enter_date_of_issue')}`}
                                                        />
                                                    </div>
                                                    <div className="mb-5 w-1/2">
                                                        <label htmlFor="IDnumber" className='label'>
                                                            {' '}
                                                            {t('address_issue')}
                                                        </label>
                                                        <Field name="IDnumber" type="text" id="IDnumber" placeholder={t('enter_address_issue')} className="form-input" />
                                                    </div>
                                                </div>
                                            </div>
                                        </AnimateHeight>
                                    </div>
                                </div>
                                <div className="rounded">
                                    <button
                                        type="button"
                                        className={`flex w-full items-center p-4 text-white-dark dark:bg-[#1b2e4b] custom-accordion`}
                                        onClick={() => togglePara('3')}
                                    >
                                        {t('other_information')}
                                        <div className={`ltr:ml-auto rtl:mr-auto ${active === '3' ? 'rotate-180' : ''}`}>
                                            <IconCaretDown />
                                        </div>
                                    </button>
                                    <div className={`${active === '3' ? 'custom-content-accordion' : ''}`}>
                                        <AnimateHeight duration={300} height={active === '3' ? 'auto' : 0}>
                                            <div className="space-y-2 border-t border-[#d3d3d3] p-4 text-[13px] text-white-dark dark:border-[#1b2e4b]">
                                                <div className='flex justify-between gap-5'>
                                                    <div className="mb-5 w-1/2">
                                                        <label htmlFor="departmentparentId" className='label'> {t('Department_Parent')}</label >
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

                                                    </div>
                                                    <div className="mb-5 w-1/2">
                                                        <label htmlFor="manageId" className='label'> {t('duty')}</label >
                                                        <Select
                                                            id='manageId'
                                                            name='manageId'
                                                            placeholder={t('select_duty')}

                                                            onInputChange={e => handleSearch(e)}
                                                            options={[]}
                                                            maxMenuHeight={160}
                                                            value={values.manageId}
                                                            onChange={e => {
                                                                setFieldValue('manageId', e)
                                                            }}
                                                        />

                                                    </div>
                                                </div>
                                                <div className='flex justify-between gap-5'>
                                                    <div className="mb-5 w-1/2">
                                                        <label htmlFor="manageId" className='label'> {t('Manager')} </label >
                                                        <Select
                                                            id='manageId'
                                                            name='manageId'
                                                            onInputChange={e => handleSearch(e)}
                                                            options={manage}
                                                            placeholder={t('select_manager')}
                                                            maxMenuHeight={160}
                                                            value={values.manageId}
                                                            onChange={e => {
                                                                setFieldValue('manageId', e)
                                                            }}
                                                        />

                                                    </div>
                                                    <div className="mb-5 w-1/2">
                                                        <label htmlFor="manageId" className='label'> {t('Manager_2')} </label >
                                                        <Select
                                                            id='manageId'
                                                            name='manageId'
                                                            onInputChange={e => handleSearch(e)}
                                                            options={manage}
                                                            maxMenuHeight={160}
                                                            value={values.manageId}
                                                            placeholder={t('select_manager_2')}
                                                            onChange={e => {
                                                                setFieldValue('manageId', e)
                                                            }}
                                                        />

                                                    </div>
                                                </div>
                                                <div className='flex justify-between gap-5'>
                                                    <div className="mb-5 w-1/2">
                                                        <label htmlFor="approver" className='label'>
                                                            {' '}
                                                            {t('approver')}
                                                        </label>
                                                        <Field name="approver" type="text" id="approver" placeholder={t('enter_approver')} className="form-input" />
                                                    </div>
                                                    <div className="mb-5 w-1/2">
                                                        <label htmlFor="date_join" className='label'>
                                                            {' '}
                                                            {t('date_join')}
                                                        </label>
                                                        <Flatpickr
                                                            options={{
                                                                dateFormat: 'Y-m-d',
                                                                position: 'auto left',
                                                            }}
                                                            className="form-input"
                                                            placeholder={`${t('enter_date_join')}`}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='flex justify-between gap-5'>
                                                    <div className="mb-5 w-1/2">
                                                        <label htmlFor="tax_code" className='label'>
                                                            {' '}
                                                            {t('tax_code')}
                                                        </label>
                                                        <Field name="tax_code" type="text" id="tax_code" placeholder={t('enter_tax_code')} className="form-input" />
                                                    </div>
                                                    <div className="mb-5 w-1/2">
                                                        <label htmlFor="bank_number" className='label'>
                                                            {' '}
                                                            {t('bank_number')}
                                                        </label>
                                                        <Field name="bank_number" type="text" id="bank_number" placeholder={t('enter_bank_number')} className="form-input" />
                                                    </div>
                                                </div>
                                                <div className='flex justify-between gap-5'>
                                                    <div className="mb-5 w-1/2">
                                                        <label htmlFor="bank" className='label'>
                                                            {' '}
                                                            {t('bank')}
                                                        </label>
                                                        <Field name="bank" type="text" id="bank" placeholder={t('enter_bank')} className="form-input" />
                                                    </div>
                                                    <div className="mb-5 w-1/2">
                                                        <label htmlFor="branch" className='label'>
                                                            {' '}
                                                            {t('branch')}
                                                        </label>
                                                        <Field name="branch" type="text" id="branch" placeholder={t('enter_branch')} className="form-input" />
                                                    </div>
                                                </div>
                                            </div>
                                        </AnimateHeight>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex items-center justify-end ltr:text-right rtl:text-left gap-8">
                            <button type="button" className="btn btn-outline-dark cancel-button" onClick={() => handleCancel()}>
                                {t('cancel')}
                            </button>
                            <button type="submit" className="btn :ml-4 rtl:mr-4 add-button" disabled={disabled} onClick={() => {
                                if (Object.keys(touched).length !== 0 && Object.keys(errors).length === 0) {
                                    handleWarehouse(values);
                                }
                            }}>
                                {props.data !== undefined ? t('update') : t('add')}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>

        </div>

    );
};

export default AddNewPersonel;
