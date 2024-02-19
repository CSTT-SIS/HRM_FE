import { useEffect, Fragment, useState, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog, Transition } from '@headlessui/react';

import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import { showMessage } from '@/@core/utils';
import IconX from '@/components/Icon/IconX';
import { useRouter } from 'next/router';
import Select, { components } from 'react-select';
import { DropdownProducts } from '@/services/swr/dropdown.twr';
import { AddRepairDetail, EditRepairDetail } from '@/services/apis/repair.api';

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
        replacementPartId: new Yup.ObjectSchema().required(`${t('please_fill_product')}`),
        quantity: Yup.string().required(`${t('please_fill_quantity')}`),
    });

    const { data: productDropdown, pagination: productPagination, isLoading: productLoading } = DropdownProducts({ page: page });


    const handleRepairDetail = (param: any) => {
        const query = {
            replacementPartId: Number(param.replacementPartId.value),
            quantity: Number(param.quantity),
            brokenPart: param.brokenPart,
            description: param.description
        };
        if (props?.data) {
            EditRepairDetail({ id: props.idDetail, detailId: props?.data?.id, ...query }).then(() => {
                props.orderDetailMutate();
                handleCancel();
                showMessage(`${t('edit_success')}`, 'success');
            }).catch((err) => {
                showMessage(`${err?.response?.data?.message}`, 'error');
            });
        } else {
            AddRepairDetail({ id: props.idDetail, ...query }).then(() => {
                props.orderDetailMutate();
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
            quantity: props?.data ? `${props?.data?.quantity}` : "",
            replacementPartId: props?.data ? {
                value: `${props?.data?.replacementPart?.id}`,
                label: `${props?.data?.replacementPart?.name}`
            } : "",
            brokenPart: props?.data ? props?.data.brokenPart : "",
            description: props?.data ? props?.data.description : ""
        })
    }, [props?.data, router]);

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
                                <div className="bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pr-5 rtl:pl-[50px] dark:bg-[#121c2c]">
                                    {'Add repair detail'}
                                </div>
                                <div className="p-5">
                                    <Formik
                                        initialValues={initialValue}
                                        validationSchema={SubmittedForm}
                                        onSubmit={values => {
                                            handleRepairDetail(values);
                                        }}
                                        enableReinitialize
                                    >
                                        {({ errors, values, setFieldValue }) => (
                                            <Form className="space-y-5" >
                                                <div className="mb-5 flex justify-between gap-4">
                                                    <div className="flex-1">
                                                        <label htmlFor="replacementPartId" > {t('product')} < span style={{ color: 'red' }}>* </span></label >
                                                        <Select
                                                            id='replacementPartId'
                                                            name='replacementPartId'
                                                            options={dataProductDropdown}
                                                            onMenuOpen={() => setPage(1)}
                                                            onMenuScrollToBottom={handleMenuScrollToBottom}
                                                            isLoading={productLoading}
                                                            maxMenuHeight={160}
                                                            value={values.replacementPartId}
                                                            onChange={e => {
                                                                setFieldValue('replacementPartId', e)
                                                            }}
                                                        />
                                                        {errors.replacementPartId ? (
                                                            <div className="text-danger mt-1"> {`${errors.replacementPartId}`} </div>
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
                                                <div className="mb-5">
                                                    <label htmlFor="brokenPart" > {t('broken_part')} </label >
                                                    <Field
                                                        name="brokenPart"
                                                        type="text"
                                                        id="brokenPart"
                                                        placeholder={`${t('enter_broken_part')}`}
                                                        className="form-input"
                                                    />
                                                    {errors.brokenPart ? (
                                                        <div className="text-danger mt-1"> {`${errors.brokenPart}`} </div>
                                                    ) : null}
                                                </div>
                                                <div className="mb-5">
                                                    <label htmlFor="description" > {t('description')}</label >
                                                    <Field
                                                        name="description"
                                                        type="text"
                                                        id="description"
                                                        placeholder={`${t('enter_description')}`}
                                                        className="form-input"
                                                    />
                                                    {errors.description ? (
                                                        <div className="text-danger mt-1"> {`${errors.description}`} </div>
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
export default HandleDetailModal;