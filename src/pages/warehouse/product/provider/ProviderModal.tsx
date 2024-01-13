import { useEffect, Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog, Transition } from '@headlessui/react';

import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import Swal from 'sweetalert2';
import { showMessage } from '@/@core/utils';
import IconX from '@/components/Icon/IconX';
import { CreateProvider, EditProvider } from '@/services/apis/product.api';

interface Props {
    [key: string]: any;
}

const ProviderModal = ({ ...props }: Props) => {

    const { t } = useTranslation();
    const [disabled, setDisabled] = useState(false);

    const SubmittedForm = Yup.object().shape({
        name: Yup.string().min(2, 'Too Short!').required(`${t('please_fill_name_provider')}`),
        address: Yup.string().min(2, 'Too Short!').required(`${t('please_fill_add')}`),
        phone: Yup.string().required(`${t('please_fill_phone')}`),
        email: Yup.string().required(`${t('please_fill_email')}`),
    });

    const handleProvider = (param: any) => {
        if (props?.data) {
            EditProvider({ id: props.data.id, ...param }).then(() => {
                props.providerMutate();
                handleCancel();
                showMessage(`${t('edit_provider_success')}`, 'success');
            }).catch((err) => {
                showMessage(`${t('edit_provider_error')}`, 'error');
            });
        } else {
            CreateProvider(param).then(() => {
                props.providerMutate();
                handleCancel();
                showMessage(`${t('create_provider_success')}`, 'success');
            }).catch((err) => {
                showMessage(`${t('create_provider_error')}`, 'error');
            });
        }
    }

    const handleCancel = () => {
        props.setOpenModal(false);
        props.setData(undefined);
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
                                    {props.data !== undefined ? 'Edit provider' : 'Add provider'}
                                </div>
                                <div className="p-5">
                                    <Formik
                                        initialValues={
                                            {
                                                name: props?.data ? `${props?.data?.name}` : "",
                                                address: props?.data ? `${props?.data?.address}` : "",
                                                phone: props?.data ? `${props?.data?.phone}` : "",
                                                email: props?.data ? `${props?.data?.email}` : "",
                                                description: props?.data ? `${props?.data?.description}` : ""

                                            }
                                        }
                                        validationSchema={SubmittedForm}
                                        onSubmit={values => {
                                            handleProvider(values);
                                        }}
                                    >

                                        {({ errors, touched }) => (
                                            <Form className="space-y-5" >
                                                <div className="mb-5">
                                                    <label htmlFor="name" > {t('name_provider')} < span style={{ color: 'red' }}>* </span></label >
                                                    <Field name="name" type="text" id="name" placeholder={`${t('enter_name_provider')}`} className="form-input" />
                                                    {errors.name ? (
                                                        <div className="text-danger mt-1"> {errors.name} </div>
                                                    ) : null}
                                                </div>
                                                <div className="mb-5">
                                                    <label htmlFor="address" > {t('address')} < span style={{ color: 'red' }}>* </span></label >
                                                    <Field name="address" type="text" id="address" placeholder={`${t('enter_address')}`} className="form-input" />
                                                    {errors.address ? (
                                                        <div className="text-danger mt-1"> {errors.address} </div>
                                                    ) : null}
                                                </div>
                                                <div className="mb-5">
                                                    <label htmlFor="phone" > {t('phone')} < span style={{ color: 'red' }}>* </span></label >
                                                    <Field name="phone" type="text" id="phone" placeholder={`${t('enter_phone')}`} className="form-input" />
                                                    {errors.phone ? (
                                                        <div className="text-danger mt-1"> {errors.phone} </div>
                                                    ) : null}
                                                </div>
                                                <div className="mb-5">
                                                    <label htmlFor="email" > {t('email')} < span style={{ color: 'red' }}>* </span></label >
                                                    <Field name="email" type="text" id="email" placeholder={`${t('enter_email')}`} className="form-input" />
                                                    {errors.email ? (
                                                        <div className="text-danger mt-1"> {errors.email} </div>
                                                    ) : null}
                                                </div>
                                                <div className="mb-5">
                                                    <label htmlFor="description" > {t('description')} </label >
                                                    <Field name="description" type="text" id="description" placeholder={`${t('enter_description')}`} className="form-input" />
                                                    {errors.description ? (
                                                        <div className="text-danger mt-1"> {errors.description} </div>
                                                    ) : null}
                                                </div>
                                                <div className="mt-8 flex items-center justify-end ltr:text-right rtl:text-left">
                                                    <button type="button" className="btn btn-outline-danger" onClick={() => handleCancel()}>
                                                        Cancel
                                                    </button>
                                                    <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4" disabled={disabled}>
                                                        {props.data !== undefined ? 'Update' : 'Add'}
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

export default ProviderModal;
