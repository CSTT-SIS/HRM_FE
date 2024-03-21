import { useEffect, Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog, Transition } from '@headlessui/react';

import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import Swal from 'sweetalert2';
import { showMessage } from '@/@core/utils';
import IconX from '@/components/Icon/IconX';

interface Props {
    [key: string]: any;
}

const TimekeepingModal = ({ ...props }: Props) => {

    const { t } = useTranslation();
    const [disabled, setDisabled] = useState(false);

    const SubmittedForm = Yup.object().shape({
        name: Yup.string().min(2, 'Too Short!').required(`${t('please_fill_name_timekeeping')}`),
        code: Yup.string().min(2, 'Too Short!').required(`${t('please_fill_timekeepingCode')}`),
    });

    const handleDepartment = (value: any) => {
        if (props?.data) {
            const reNew = props.totalData.filter((item: any) => item.id !== props.data.id);
            reNew.push({
                id: props.data.id,
                name: value.name,
                code: value.code,
            });
            localStorage.setItem('timekeepingList', JSON.stringify(reNew));
            props.setGetStorge(reNew);
            props.setOpenModal(false);
            props.setData(undefined);
            showMessage(`${t('edit_timekeeping_success')}`, 'success');
        } else {
            const reNew = props.totalData;
            reNew.push({
                id: Number(props?.totalData[props?.totalData?.length - 1].id) + 1,
                name: value.name,
                code: value.code,
                status: value.status
            })
            localStorage.setItem('timekeepingList', JSON.stringify(reNew));
            props.setGetStorge(props.totalData);
            props.setOpenModal(false);
            props.setData(undefined);
            showMessage(`${t('add_timekeeping_success')}`, 'success')
        }
    }

    const handleCancel = () => {
        props.setOpenModal(false);
        props.setData(undefined);
    };

    const handleDelete = () => {
        const swalDeletes = Swal.mixin({
			customClass: {
				confirmButton: 'btn btn-secondary',
				cancelButton: 'btn btn-danger ltr:mr-3 rtl:ml-3',
				popup: 'confirm-delete',
			},
            imageUrl: '/assets/images/delete_popup.png',
			buttonsStyling: false,
		});
        swalDeletes
            .fire({
                title: `${t('delete_timekeeping')}`,
                padding: '2em',
                showCancelButton: true,
                cancelButtonText: `${t('cancel')}`,
                confirmButtonText: `${t('confirm')}`,
				reverseButtons: true,
            })
            .then((result) => {
                if (result.value) {

                }
            });
    };
    return (
        <Transition appear show={props.openModal ?? false} as={Fragment}>
            <Dialog as="div" open={props.openModal} onClose={() => props.setOpenModal(false)} className="relative z-50">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-[black]/60" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center px-4 py-8">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="panel w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                <button
                                    type="button"
                                    onClick={() => handleCancel()}
                                    className="absolute top-4 text-gray-400 outline-none hover:text-gray-800 ltr:right-4 rtl:left-4 dark:hover:text-gray-600"
                                >
                                    <IconX />
                                </button>
                                <div className="bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pr-5 rtl:pl-[50px] dark:bg-[#121c2c]">
                                    {props.data !== undefined ? `${t('edit_timekeeping')} ngày` : `${t('add_timekeeping')} ngày`}
                                </div>
                                <div className="p-5">
                                    <Formik
                                        initialValues={
                                            {
                                                name: props?.data ? `${props?.data?.name}` : "",
                                                code: props?.data ? `${props?.data?.code}` : "",
                                            }
                                        }
                                        validationSchema={SubmittedForm}
                                        onSubmit={values => {
                                            handleDepartment(values);
                                        }}
                                    >

                                        {({ errors, touched }) => (
                                            <Form className="space-y-5" >
                                                <div className="mb-5">
                                                    <label htmlFor="name">Số công hưởng lương <span style={{ color: 'red' }}>* </span></label >
                                                    <Field autoComplete="off" name="name" type="number" id="name" placeholder="Nhập số công hưởng lương" className="form-input" />
                                                    {errors.name ? (
                                                        <div className="text-danger mt-1"> {errors.name} </div>
                                                    ) : null}
                                                </div>
                                                <div className="mb-5">
                                                    <label htmlFor="code" >Số công đi làm thực tế < span style={{ color: 'red' }}>* </span></label >
                                                    <Field autoComplete="off" name="" type="number" id="code" placeholder="Nhập số công đi làm thực tế" className="form-input" />
                                                    {errors.code ? (
                                                        <div className="text-danger mt-1"> {errors.code} </div>
                                                    ) : null}
                                                </div>
                                                <div className="mb-5">
                                                    <label htmlFor="code" >Giờ vào < span style={{ color: 'red' }}>* </span></label >
                                                    <Field autoComplete="off" name="code" type="time" id="code" placeholder={`${t('enter_code_timekeeping')}`} className="form-input" />
                                                    {errors.code ? (
                                                        <div className="text-danger mt-1"> {errors.code} </div>
                                                    ) : null}
                                                </div>
                                                <div className="mb-5">
                                                    <label htmlFor="code" >Giờ ra < span style={{ color: 'red' }}>* </span></label >
                                                    <Field autoComplete="off" name="code" type="time" id="code" placeholder={`${t('enter_code_timekeeping')}`} className="form-input" />
                                                    {errors.code ? (
                                                        <div className="text-danger mt-1"> {errors.code} </div>
                                                    ) : null}
                                                </div>
                                                <div className="mb-5">
                                                    <label htmlFor="code" >Đi muộn (phút) < span style={{ color: 'red' }}>* </span></label >
                                                    <Field autoComplete="off" name="" type="number" id="code" placeholder="" className="form-input" />
                                                    {errors.code ? (
                                                        <div className="text-danger mt-1"> {errors.code} </div>
                                                    ) : null}
                                                </div>
                                                <div className="mb-5">
                                                    <label htmlFor="code" >Đi sớm (phút) < span style={{ color: 'red' }}>* </span></label >
                                                    <Field autoComplete="off" name="" type="number" id="code" placeholder="" className="form-input" />
                                                    {errors.code ? (
                                                        <div className="text-danger mt-1"> {errors.code} </div>
                                                    ) : null}
                                                </div>
                                                <div className="mt-8 flex items-center justify-end ltr:text-right rtl:text-left">
                                                    {props.data === undefined ?  <button type="button" className="btn btn-outline-danger" onClick={() => handleCancel()}>
                                                        {t('cancel')}
                                                    </button> :  <button type="button" className="btn btn-outline-danger" onClick={() => handleDelete()}>
                                                        {t('delete')}
                                                    </button>}
                                                    <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4" disabled={disabled}>
                                                        {props.data !== undefined ? `${t('update')}` : `${t('add')}`}
                                                    </button>
                                                </div>

                                            </Form>
                                        )}
                                    </Formik>

                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default TimekeepingModal;
