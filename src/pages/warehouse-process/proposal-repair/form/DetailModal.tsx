import { useEffect, Fragment, useState, SetStateAction, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog, Transition } from '@headlessui/react';

import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import { showMessage } from '@/@core/utils';
import IconX from '@/components/Icon/IconX';
import { useRouter } from 'next/router';
import Select, { components } from 'react-select';
import { AddProposalDetail, EditProposalDetail } from '@/services/apis/proposal.api';
import { DropdownProducts } from '@/services/swr/dropdown.twr';

interface Props {
    [key: string]: any;
}

const HandleDetailModal = ({ ...props }: Props) => {
    const { t } = useTranslation();
    const router = useRouter();
    const [initialValue, setInitialValue] = useState<any>();
    const [dataProductDropdown, setDataProductDropdown] = useState<any>([]);
    const [page, setPage] = useState(1);

    const SubmittedForm = Yup.object().shape({
        productId: new Yup.ObjectSchema().required(`${t('please_fill_product')}`),
        quantity: Yup.string().required(`${t('please_fill_quantity')}`),
    });

    const { data: productDropdown, pagination: productPagination, isLoading: productLoading } = DropdownProducts({ page: page });

    const handleProposal = (param: any) => {
        const query = {
            productId: Number(param.productId.value),
            quantity: Number(param.quantity),
            note: param.note,
            price: param?.price ? param?.price : 0
        };
        if (props?.data) {
            EditProposalDetail({ id: router.query.id, detailId: props?.data?.id, ...query }).then(() => {
                handleCancel();
                showMessage(`${t('edit_success')}`, 'success');
            }).catch((err) => {
                showMessage(`${err?.response?.data?.message}`, 'error');
            });
        } else {
            AddProposalDetail({ id: router.query.id, ...query }).then(() => {
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
        props.proposalDetailMutate();
        setInitialValue({});
    };

    useEffect(() => {
        setInitialValue({
            quantity: props?.data ? `${props?.data?.quantity}` : "",
            productId: props?.data ? {
                value: `${props?.data?.product?.id}`,
                label: `${props?.data?.product?.name}`
            } : "",
            note: props?.data ? `${props?.data?.note}` : "",
            price: props?.data ? props?.data.price : ""
        })
    }, [props?.data]);


    useEffect(() => {
        if (productPagination?.page === undefined) return;
        if (productPagination?.page === 1) {
            setDataProductDropdown(productDropdown?.data)
        } else {
            setDataProductDropdown([...dataProductDropdown, ...productDropdown?.data])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productPagination])

    const handleMenuScrollToBottom = () => {
        setTimeout(() => {
            setPage(productPagination?.page + 1);
        }, 1000);
    }

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
                                <div className="bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pr-5 rtl:pl-[50px] dark:bg-[#121c2c] custom-button">
                                    {props.data === undefined ? t('add_detail') : t('edit_detail')}
                                </div>
                                <div>
                                    <div className="p-5">
                                        <Formik
                                            initialValues={initialValue}
                                            validationSchema={SubmittedForm}
                                            onSubmit={async (values, { resetForm }) => {
                                                await handleProposal(values)
                                                resetForm()
                                            }}
                                            enableReinitialize
                                        >
                                            {({ errors, values, setFieldValue }) => (
                                                <Form className="space-y-5" >
                                                    <div className="mb-5 flex justify-between gap-4" >
                                                        <div className="flex-1" >
                                                            <label htmlFor="productId" > {t('product')} < span style={{ color: 'red' }}>* </span></label >
                                                            <Select
                                                                id='productId'
                                                                name='productId'
                                                                options={dataProductDropdown}
                                                                onMenuOpen={() => setPage(1)}
                                                                onMenuScrollToBottom={handleMenuScrollToBottom}
                                                                isLoading={productLoading}
                                                                maxMenuHeight={160}
                                                                value={values?.productId}
                                                                onChange={e => {
                                                                    setFieldValue('productId', e)
                                                                }}
                                                            />
                                                            {errors.productId ? (
                                                                <div className="text-danger mt-1"> {`${errors.productId}`} </div>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                    <div className="mb-5">
                                                        <label htmlFor="quantity" > {t('quantity')} < span style={{ color: 'red' }}>* </span></label >
                                                        <Field
                                                            name="quantity"
                                                            type="number"
                                                            id="quantity"
                                                            placeholder={`${t('enter_quantity')}`}
                                                            className="form-input"
                                                        />
                                                        {errors.quantity ? (
                                                            <div className="text-danger mt-1"> {`${errors.quantity}`} </div>
                                                        ) : null}
                                                    </div>
                                                    {
                                                        router.query.type === "PURCHASE" &&
                                                        <div className="mb-5">
                                                            <label htmlFor="price" > {t('price')} < span style={{ color: 'red' }}>* </span></label >
                                                            <Field name="price" type="number" id="price" placeholder={`${t('enter_price')}`} className="form-input" />
                                                            {errors.price ? (
                                                                <div className="text-danger mt-1"> {`${errors.price}`} </div>
                                                            ) : null}
                                                        </div>
                                                    }
                                                    <div className="mb-5">
                                                        <label htmlFor="note" > {t('description')} </label >
                                                        <Field
                                                            name="note"
                                                            type="text"
                                                            id="note"
                                                            placeholder={`${t('enter_description')}`}
                                                            className="form-input"
                                                        />
                                                        {errors.note ? (
                                                            <div className="text-danger mt-1"> {`${errors.note}`} </div>
                                                        ) : null}
                                                    </div>
                                                    <div className="mt-8 flex items-center justify-end ltr:text-right rtl:text-left">
                                                        <button type="button" className="btn btn-outline-danger cancel-button" onClick={() => handleCancel()}>
                                                            {t('cancel')}
                                                        </button>
                                                        <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4 add-button">
                                                            {props.data !== undefined ? t('update') : t('add')}
                                                        </button>
                                                    </div>
                                                </Form>
                                            )}
                                        </Formik>

                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};
export default HandleDetailModal;
