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
import AnimateHeight from 'react-animate-height';
import IconCaretDown from '@/components/Icon/IconCaretDown';
import IconBack from '@/components/Icon/IconBack';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import { Departments } from '@/services/swr/department.twr';
import { Humans } from '@/services/swr/human.twr';
import { Positions } from '@/services/swr/position.twr';
import { createHuman } from '@/services/apis/human.api';

interface Props {
    [key: string]: any;
}

const AddNewPersonel = ({ ...props }: Props) => {
    const { t } = useTranslation();
    const [disabled, setDisabled] = useState(false);
    const [query, setQuery] = useState<any>();
    const [images, setImages] = useState<any>([]);
    const onChange = (imageList: ImageListType, addUpdateIndex: number[] | undefined) => {
        setImages(imageList as never[]);
    };
    const maxNumber = 69;

    const { data: departmentparents } = Departments(query);
    const { data: manages } = Humans(query);
    const { data: positions } = Positions(query);

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
    const position = positions?.data.filter((item: any) => {
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
            .required(`${t('please_fill_code')}`),
    });
    const handleSearch = (param: any) => {
        setQuery({ search: param });
    }
    const handleWarehouse = (value: any) => {
       
        createHuman(value).then(() => {
            showMessage(`${t('add_staff_success')}`, 'success');
        }).catch((err) => {
            showMessage(`${t('add_staff_error')}`, 'error');
        });
    };
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
                    code: props?.data ? `${props?.data?.code}` : '',
                    fullName: props?.data ? `${props?.data?.fullName}` : '',
                    surname: props?.data ? `${props?.data?.surname}` : '',
                    email: props?.data ? `${props?.data?.email}` : '',
                    phoneNumber: props?.data ? `${props?.data?.phoneNumber}` : '',
                    anotherName: props?.data ? `${props?.data?.anotherName}` : '',
                    birthDay: props?.data ? `${props?.data?.birthDay}` : '',
                    sex: props?.data ? props?.data?.sex : null,
                    identityNumber: props?.data ? `${props?.data?.identityNumber}` : '',
                    identityDate: props?.data ? `${props?.data?.identityDate}` : '',
                    identityPlace: props?.data ? `${props?.data?.identityPlace}` : '',
                    passportNumber: props?.data ? `${props?.data?.passportNumber}` : '',
                    passportDate: props?.data ? `${props?.data?.passportDate}` : '',
                    passportExpired: props?.data ? `${props?.data?.passportExpired}` : '',
                    passportPlace: props?.data ? `${props?.data?.passportPlace}` : '',
                    placeOfBirth: props?.data ? `${props?.data?.placeOfBirth}` : '',
                    nation: props?.data ? `${props?.data?.nation}` : '',
                    provice: props?.data ? props?.data?.provice : null,
                    religion: props?.data ? `${props?.data?.religion}` : '',
                    maritalStatus: props?.data ? `${props?.data?.maritalStatus}` : '',
                    departmentId: props?.data ? props?.data?.departmentId : null,
                    positionId: props?.data ? props?.data?.positionId : null,
                    indirectSuperior: props?.data ? props?.data?.indirectSuperior : null,
                    directSuperior: props?.data ? props?.data?.directSuperior : null,
                    dateOfJoin: props?.data ? props?.data?.dateOfJoin : null,
                    taxCode: props?.data ? `${props?.data?.taxCode}` : '',
                    bankAccount: props?.data ? `${props?.data?.bankAccount}` : '',
                    bankName: props?.data ? `${props?.data?.bankName}` : '',
                    bankBranch: props?.data ? `${props?.data?.bankBranch}` : '',
                    othername: props?.data ? `${props?.data?.othername}` : '',

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
                                    <div className={`custom-content-accordion`}>

                                        <AnimateHeight duration={300} height={'auto'}>
                                            <div className="space-y-2 border-[#d3d3d3] p-4 text-[13px] text-white-dark dark:border-[#1b2e4b]">
                                                <div className='flex justify-between gap-5'>
                                                    <div className="mb-5 w-1/2">
                                                        <div className="custom-file-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} data-upload-id="myFirstImage">
                                                            <div className="label-container" style={{ marginBottom: '0', marginRight: '20px' }}>
                                                                <label style={{ color: '#476704', fontSize: '14px', marginBottom: '0' }}> {t('update_avatar')} </label>
                                                            </div>
                                                            <ImageUploading value={images} onChange={onChange} maxNumber={maxNumber}>
                                                                {({ imageList, onImageUpload, onImageRemoveAll, onImageUpdate, onImageRemove, isDragging, dragProps }) => (
                                                                    <div className="upload__image-wrapper">

                                                                        <div className="custom-uploadfile" style={{ cursor: 'pointer' }} onClick={onImageUpload}>
                                                                            <div className='upfile_content' style={{ marginTop: imageList.length !== 0 ? '-1px' : '20px' }}>
                                                                                {
                                                                                    imageList.length === 0 ? <>
                                                                                        <img src='/assets/images/uploadfile.png' className='icon_upload'></img>
                                                                                        Tải lên</> : <></>
                                                                                }

                                                                                {imageList.map((image, index) => (
                                                                                    <img src={image.dataURL} alt="img" className="m-auto" style={{ width: '80px', height: '80px', borderRadius: '50px' }} />
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                        &nbsp;
                                                                    </div>
                                                                )}
                                                            </ImageUploading>
                                                        </div>

                                                    </div>
                                                    <div className="mb-5 w-1/2">
                                                        <label htmlFor="code" className='label'>
                                                            {' '}
                                                            {t('code_staff')} <span style={{ color: 'red' }}>* </span>
                                                        </label>
                                                        <Field autoComplete="off" name="code" type="text" id="code" placeholder={`${t('enter_code_staff')}`} className="form-input" />
                                                        {submitCount ? errors.code ? <div className="mt-1 text-danger"> {errors.code} </div> : null : ''}
                                                    </div>

                                                </div>
                                                <div className='flex justify-between gap-5'>
                                                    <div className="mb-5 w-1/2">
                                                        <label htmlFor="surname" className='label'>
                                                            {' '}
                                                            {t('surname_middle')}
                                                        </label>
                                                        <Field autoComplete="off" name="surname" type="text" id="surname" placeholder={t('enter_surname_middle')} className="form-input" />
                                                    </div>
                                                    <div className="mb-5 w-1/2">
                                                        <label htmlFor="fullName" className='label'>
                                                            {' '}
                                                            {t('name_staff')} <span style={{ color: 'red' }}>* </span>
                                                        </label>
                                                        <Field autoComplete="off" name="fullName " type="text" id="fullName " placeholder={`${t('enter_name_staff')}`} className="form-input" />
                                                        {submitCount ? errors.fullName ? <div className="mt-1 text-danger"> {errors.fullName} </div> : null : ''}
                                                    </div>
                                                </div>
                                                <div className='flex justify-between gap-5'>
                                                    <div className="mb-5 w-1/2">
                                                        <label htmlFor="email" className='label'>
                                                            {' '}
                                                            Email
                                                        </label>
                                                        <Field autoComplete="off" name="email" type="text" id="email" placeholder={t('enter_email')} className="form-input" />
                                                    </div>
                                                    <div className="mb-5 w-1/2">
                                                        <label htmlFor="phone" className='label'>
                                                            {' '}
                                                            {t('phone_number')}
                                                        </label>
                                                        <Field autoComplete="off" name="phone" type="text" id="phone" placeholder={t('enter_phone_number')} className="form-input" />
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
                                    <div className={`custom-content-accordion`}>

                                        <AnimateHeight duration={300} height={'auto'}>
                                            <div className="space-y-2 border-t border-[#d3d3d3] p-4 text-[13px] text-white-dark dark:border-[#1b2e4b]">
                                                <div className='flex justify-between gap-5'>
                                                    <div className="mb-5 w-1/2">
                                                        <label htmlFor="othername" className='label'>
                                                            {' '}
                                                            {t('other_name')}
                                                        </label>
                                                        <Field autoComplete="off" name="othername" type="text" id="othername" placeholder={t('enter_other_name')} className="form-input" />
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
                                                            value={values.birthDay}
                                                            className="form-input calender-input"
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
                                                                label: 'Nam'
                                                            }, {
                                                                label: 'Nữ'
                                                            }]}
                                                            value={values.sex}
                                                            placeholder={'Chọn giới tính'}
                                                            maxMenuHeight={160}
                                                            onChange={e => {
                                                                setFieldValue('sex', e)
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="mb-5 w-1/2">
                                                        <label htmlFor="identityNumber" className='label'>
                                                            {' '}
                                                            {t('id_number')}
                                                        </label>
                                                        <Field autoComplete="off" name="identityNumber" type="text" id="identityNumber" placeholder={t('enter_id_number')} className="form-input" />
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
                                                            value={values.identityDate}
                                                            className="form-input calender-input"
                                                            placeholder={`${t('enter_date_of_issue')}`}
                                                        />

                                                    </div>
                                                    <div className="mb-5 w-1/2">
                                                        <label htmlFor="identityPlace" className='label'>
                                                            {' '}
                                                            {t('address_issue')}
                                                        </label>
                                                        <Field autoComplete="off" name="identityPlace" type="text" id="identityPlace" placeholder={t('enter_address_issue')} className="form-input" />
                                                    </div>
                                                </div>
                                                <div className='flex justify-between gap-5'>
                                                    <div className="mb-5 w-1/2">
                                                        <label htmlFor="passportNumber" className='label'>
                                                            {' '}
                                                            {t('id_passport')}
                                                        </label>
                                                        <Field autoComplete="off" name="passportNumber" type="text" id="passportNumber" placeholder={t('enter_id_passport')} className="form-input" />
                                                    </div>
                                                    <div className="mb-5 w-1/2">
                                                        <label htmlFor="dateissuepassport" className='label'>
                                                            {' '}
                                                            {t('date_of_issue_passport')}
                                                        </label>
                                                        <Flatpickr
                                                            options={{
                                                                dateFormat: 'Y-m-d',
                                                                position: 'auto left',
                                                            }}
                                                            value={values.passportDate}
                                                            className="form-input calender-input"
                                                            placeholder={`${t('enter_date_of_issue_passport')}`}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='flex justify-between gap-5'>
                                                    <div className="mb-5 w-1/2">
                                                        <label htmlFor="passportPlace" className='label'>
                                                            {' '}
                                                            {t('address_issue_passport')}
                                                        </label>
                                                        <Field autoComplete="off" name="passportPlace" type="text" id="passportPlace" placeholder={t('enter_address_issue_passport')} className="form-input" />
                                                    </div>
                                                    <div className="mb-5 w-1/2">
                                                        <label htmlFor="dateendpassport" className='label'>
                                                            {' '}
                                                            {t('date_end_passport')}
                                                        </label>
                                                        <Flatpickr
                                                            options={{
                                                                dateFormat: 'Y-m-d',
                                                                position: 'auto left',
                                                            }}
                                                            value={values.passportExpired}
                                                            className="form-input calender-input"
                                                            placeholder={`${t('enter_date_end_passport')}`}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='flex justify-between gap-5'>
                                                    <div className="mb-5 w-1/2">
                                                        <label htmlFor="placeOfBirth" className='label'>
                                                            {' '}
                                                            {t('place_of_birth')}
                                                        </label>
                                                        <Field autoComplete="off" name="placeOfBirth" type="text" id="placeOfBirth" placeholder={t('enter_place_of_birth')} className="form-input" />
                                                    </div>
                                                    <div className="mb-5 w-1/2">
                                                        <label htmlFor="nation" className='label'>
                                                            {' '}
                                                            {t('nation')}
                                                        </label>
                                                        <Field autoComplete="off" name="nation" type="text" id="nation" placeholder={t('enter_nation')} className="form-input" />
                                                    </div>
                                                </div>
                                                <div className='flex justify-between gap-5'>
                                                    <div className="mb-5 w-1/2">
                                                        <label htmlFor="province" className='label'>
                                                            {' '}
                                                            {t('province')}
                                                        </label>
                                                        <Select
                                                            id='province'
                                                            name='province'
                                                            onInputChange={e => handleSearch(e)}
                                                            options={[{
                                                                label: 'Hà Nội'
                                                            },
                                                            {
                                                                label: 'Vĩnh Phúc'
                                                            }, {
                                                                label: 'Bắc Ninh'
                                                            }, {
                                                                label: 'Quảng Ninh'
                                                            }, {
                                                                label: 'Hải Dương'
                                                            }, {
                                                                label: 'Hải Phòng'
                                                            }, {
                                                                label: 'Hưng Yên'
                                                            }, {
                                                                label: 'Thái Bình'
                                                            }, {
                                                                label: 'Hà Nam'
                                                            }, {
                                                                label: 'Nam Định'
                                                            }, {
                                                                label: 'Ninh Bình'
                                                            }]}
                                                            value={values.provice}
                                                            placeholder={t('enter_province')}
                                                            maxMenuHeight={160}
                                                            onChange={e => {
                                                                setFieldValue('province', e)
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="mb-5 w-1/2">
                                                        <label htmlFor="religion" className='label'>
                                                            {' '}
                                                            {t('religion')}
                                                        </label>
                                                        <Field autoComplete="off" name="religion" type="text" id="religion" placeholder={t('enter_religion')} className="form-input" />
                                                    </div>
                                                </div>
                                                <div className="mb-5 w-1/2">
                                                    <label htmlFor="maritalStatus" className='label'>
                                                        {' '}
                                                        {t('marital_status')}
                                                    </label>
                                                    <Field autoComplete="off" name="maritalStatus" type="text" id="maritalStatus" placeholder={t('enter_marital_status')} className="form-input" />
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
                                    <div className={`custom-content-accordion`}>
                                        <AnimateHeight duration={300} height={'auto'}>
                                            <div className="space-y-2 border-t border-[#d3d3d3] p-4 text-[13px] text-white-dark dark:border-[#1b2e4b]">
                                                <div className='flex justify-between gap-5'>
                                                    <div className="mb-5 w-1/2">
                                                        <label htmlFor="departmentparentId" className='label'> {t('Department_Parent')}</label >
                                                        <Select
                                                            id='departmentparentId'
                                                            name='departmentparentId'
                                                            placeholder={t('select_departmentparent')}
                                                            onInputChange={e => handleSearch(e)}
                                                            options={departmentparent}
                                                            maxMenuHeight={160}
                                                            value={values.departmentId}
                                                            onChange={e => {
                                                                setFieldValue('directSuperior', e)
                                                            }}
                                                        />

                                                    </div>
                                                    <div className="mb-5 w-1/2">
                                                        <label htmlFor="positionId" className='label'> {t('duty')}</label >
                                                        <Select
                                                            id='positionId'
                                                            name='positionId'
                                                            placeholder={t('select_duty')}

                                                            onInputChange={e => handleSearch(e)}
                                                            options={position}
                                                            maxMenuHeight={160}
                                                            value={values.positionId}
                                                            onChange={e => {
                                                                setFieldValue('positionId', e)
                                                            }}
                                                        />

                                                    </div>
                                                </div>
                                                <div className='flex justify-between gap-5'>
                                                    <div className="mb-5 w-1/2">
                                                        <label htmlFor="directSuperior" className='label'> {t('Manager')} </label >
                                                        <Select
                                                            id='directSuperior'
                                                            name='directSuperior'
                                                            onInputChange={e => handleSearch(e)}
                                                            options={manage}
                                                            placeholder={t('select_manager')}
                                                            maxMenuHeight={160}
                                                            value={values.directSuperior}
                                                            onChange={e => {
                                                                setFieldValue('directSuperior', e)
                                                            }}
                                                        />

                                                    </div>
                                                    <div className="mb-5 w-1/2">
                                                        <label htmlFor="indirectSuperior" className='label'> {t('Manager_2')} </label >
                                                        <Select
                                                            id='indirectSuperior'
                                                            name='indirectSuperior'
                                                            onInputChange={e => handleSearch(e)}
                                                            options={manage}
                                                            maxMenuHeight={160}
                                                            value={values.indirectSuperior}
                                                            placeholder={t('select_manager_2')}
                                                            onChange={e => {
                                                                setFieldValue('indirectSuperior', e)
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
                                                        <Field autoComplete="off" name="approver" type="text" id="approver" placeholder={t('enter_approver')} className="form-input " />
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
                                                            value={values.dateOfJoin}
                                                            className="form-input calender-input"
                                                            placeholder={`${t('enter_date_join')}`}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='flex justify-between gap-5'>
                                                    <div className="mb-5 w-1/2">
                                                        <label htmlFor="taxCode" className='label'>
                                                            {' '}
                                                            {t('tax_code')}
                                                        </label>
                                                        <Field autoComplete="off" name="taxCode" type="text" id="taxCode" placeholder={t('enter_tax_code')} className="form-input" />
                                                    </div>
                                                    <div className="mb-5 w-1/2">
                                                        <label htmlFor="bankAccount" className='label'>
                                                            {' '}
                                                            {t('bank_number')}
                                                        </label>
                                                        <Field autoComplete="off" name="bankAccount" type="text" id="bankAccount" placeholder={t('enter_bank_number')} className="form-input" />
                                                    </div>
                                                </div>
                                                <div className='flex justify-between gap-5'>
                                                    <div className="mb-5 w-1/2">
                                                        <label htmlFor="bankName" className='label'>
                                                            {' '}
                                                            {t('bank')}
                                                        </label>
                                                        <Field autoComplete="off" name="bankName" type="text" id="bankName" placeholder={t('enter_bank')} className="form-input" />
                                                    </div>
                                                    <div className="mb-5 w-1/2">
                                                        <label htmlFor="bankBranch" className='label'>
                                                            {' '}
                                                            {t('branch')}
                                                        </label>
                                                        <Field autoComplete="off" name="bankBranch" type="text" id="bankBranch" placeholder={t('enter_branch')} className="form-input" />
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
