import { useEffect, Fragment, useState, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog, Transition } from '@headlessui/react';

import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import { showMessage } from '@/@core/utils';
import IconX from '@/components/Icon/IconX';
import { useRouter } from 'next/router';
import Select, { components } from 'react-select';
import { DropdownOrderType, DropdownProposals, DropdownProviders } from '@/services/swr/dropdown.twr';
import { CreateOrder, EditOrder } from '@/services/apis/order.api';
import moment from 'moment';

interface Props {
    [key: string]: any;
}

const OrderModal = ({ ...props }: Props) => {

    const { t } = useTranslation();
    const router = useRouter();
    const [initialValue, setInitialValue] = useState<any>();

    const SubmittedForm = Yup.object().shape({
        name: Yup.string().required(`${t('please_fill_name')}`),
        type: new Yup.ObjectSchema().required(`${t('please_fill_type')}`),
        code: Yup.string().required(`${t('please_fill_code')}`),
        proposalId: new Yup.ObjectSchema().required(`${t('please_fill_proposal')}`),
        estimatedDeliveryDate: Yup.string().required(`${t('please_fill_date')}`),

    });

    const { data: proposals } = DropdownProposals({ perPage: 0, type: "PURCHASE" });
    const { data: orderTypes } = DropdownOrderType({ perPage: 0 });
    const { data: providers } = DropdownProviders({ perPage: 0 });

    const handleOrder = (param: any) => {
        const query = {
            name: param.name,
            proposalId: Number(param.proposalId.value),
            type: param.type,
            code: param.code,
            estimatedDeliveryDate: param.estimatedDeliveryDate,
            providerId: Number(param.providerId.value)
        };
        if (props?.data) {
            EditOrder({ id: props?.data?.id, ...query }).then(() => {
                props.orderMutate();
                handleCancel();
                showMessage(`${t('edit_success')}`, 'success');
            }).catch((err) => {
                showMessage(`${err?.response?.data?.message}`, 'error');
            });
        } else {
            CreateOrder(query).then(() => {
                props.orderMutate();
                handleCancel();
                showMessage(`${t('create_success')}`, 'success');
            }).catch((err) => {
                showMessage(`${err?.response?.data?.message}`, 'error');
            });
        }
    }

    const handleCancel = () => {
        props.setOpenModal(false);
        props.setData();
        setInitialValue({});
    };

    useEffect(() => {
        setInitialValue({
            name: props?.data ? `${props?.data?.name}` : "",
            proposalId: props?.data ? {
                value: `${props?.data?.proposal.id}`,
                label: `${props?.data?.proposal.name}`
            } : "",
            type: props?.data ? props?.data?.type === "PURCHASE" ? {
                value: `${props?.data?.type}`,
                label: `Đơn hàng mua`
            } : {
                value: `${props?.data?.type}`,
                label: `Đơn hàng bán`
            } : "",
            code: props?.data ? `${props?.data?.code}` : "",
            estimatedDeliveryDate: props?.data ? moment(`${props?.data?.estimatedDeliveryDate}`).format("YYYY-MM-DD") : "",
            providerId: props?.data ? {
                value: `${props?.data?.provider?.id}`,
                label: `${props?.data?.provider?.name}`
            } : "",
        })
    }, [props?.data, router]);

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
                                    {props.data !== undefined ? 'Edit order' : 'Add order'}
                                </div>
                                <div className="p-5">
                                    <Formik
                                        initialValues={initialValue}
                                        validationSchema={SubmittedForm}
                                        onSubmit={values => {
                                            handleOrder(values);
                                        }}
                                        enableReinitialize
                                    >

                                        {({ errors, values, setFieldValue }) => (
                                            <Form className="space-y-5" >
                                                <div className="mb-5">
                                                    <label htmlFor="name" > {t('name_order')} < span style={{ color: 'red' }}>* </span></label >
                                                    <Field
                                                        name="name"
                                                        type="text"
                                                        id="name"
                                                        placeholder={`${t('enter_name_order')}`}
                                                        className="form-input"
                                                    />
                                                    {errors.name ? (
                                                        <div className="text-danger mt-1"> {`${errors.name}`} </div>
                                                    ) : null}
                                                </div>
                                                <div className="mb-5 flex justify-between gap-4">
                                                    <div className="flex-1">
                                                        <label htmlFor="proposalId" > {t('proposal')} < span style={{ color: 'red' }}>* </span></label >
                                                        <Select
                                                            id='proposalId'
                                                            name='proposalId'
                                                            options={proposals?.data}
                                                            maxMenuHeight={160}
                                                            value={values.proposalId}
                                                            onChange={e => {
                                                                setFieldValue('proposalId', e)
                                                            }}
                                                        />
                                                        {errors.proposalId ? (
                                                            <div className="text-danger mt-1"> {`${errors.proposalId}`} </div>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="mb-5 flex justify-between gap-4">
                                                    <div className="flex-1">
                                                        <label htmlFor="type" > {t('type')} < span style={{ color: 'red' }}>* </span></label >
                                                        <Select
                                                            id='type'
                                                            name='type'
                                                            options={orderTypes?.data}
                                                            maxMenuHeight={160}
                                                            value={values.type}
                                                            onChange={e => {
                                                                setFieldValue('type', e)
                                                            }}
                                                        />
                                                        {errors.type ? (
                                                            <div className="text-danger mt-1"> {`${errors.type}`} </div>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="mb-5 flex justify-between gap-4">
                                                    <div className="flex-1">
                                                        <label htmlFor="providerId" > {t('provider')}</label >
                                                        <Select
                                                            id='providerId'
                                                            name='providerId'
                                                            options={providers?.data}
                                                            maxMenuHeight={160}
                                                            value={values.providerId}
                                                            onChange={e => {
                                                                setFieldValue('providerId', e)
                                                            }}
                                                        />
                                                        {errors.providerId ? (
                                                            <div className="text-danger mt-1"> {`${errors.providerId}`} </div>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="mb-5">
                                                    <label htmlFor="code" > {t('code')} < span style={{ color: 'red' }}>* </span></label >
                                                    <Field
                                                        name="code"
                                                        type="text"
                                                        id="code"
                                                        placeholder={`${t('enter_code')}`}
                                                        className="form-input"
                                                    />
                                                    {errors.code ? (
                                                        <div className="text-danger mt-1"> {`${errors.code}`} </div>
                                                    ) : null}
                                                </div>
                                                <div className="mb-5">
                                                    <label htmlFor="estimatedDeliveryDate" > {t('estimated_delivery_date')} < span style={{ color: 'red' }}>* </span></label >
                                                    <Field
                                                        name="estimatedDeliveryDate"
                                                        type="date"
                                                        id="estimatedDeliveryDate"
                                                        className="form-input"
                                                    />
                                                    {errors.estimatedDeliveryDate ? (
                                                        <div className="text-danger mt-1"> {`${errors.estimatedDeliveryDate}`} </div>
                                                    ) : null}
                                                </div>
                                                <div className="mt-8 flex items-center justify-end ltr:text-right rtl:text-left">
                                                    <button type="button" className="btn btn-outline-danger" onClick={() => handleCancel()}>
                                                        Cancel
                                                    </button>
                                                    <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4">
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

export default OrderModal;
