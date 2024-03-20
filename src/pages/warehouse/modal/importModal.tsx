import { useEffect, Fragment, useState, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog, Transition } from '@headlessui/react';

import * as Yup from 'yup';
import { Field, Form, Formik, useFormikContext } from 'formik';
import { showMessage } from '@/@core/utils';
import IconX from '@/components/Icon/IconX';
import { useRouter } from 'next/router';
import Select, { components } from 'react-select';
import { ImportProduct } from '@/services/apis/warehouse.api';
import { DropdownProducts } from '@/services/swr/dropdown.twr';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import moment from 'moment';
import { Checkbox } from '@mantine/core';
interface Props {
    [key: string]: any;
}

const ImportModal = ({ ...props }: Props) => {
    const { t } = useTranslation();
    const [disabled, setDisabled] = useState(false);
    const router = useRouter();
    const [initialValue, setInitialValue] = useState<any>();
    const [dataProductDropdown, setDataProductDropdown] = useState<any>([]);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState();
    const [disable, setDisable] = useState(true);

    const SubmittedForm = Yup.object().shape({
        quantity: Yup.string().required(`${t('please_fill_quantity')}`),
        productId: new Yup.ObjectSchema().required(`${t('please_fill_product')}`)

    });

    //get data
    const { data: productDropdown, pagination: productPagination, isLoading: productLoading } = DropdownProducts({ page: page, search: search });

    const handleImport = (param: any) => {
        const query: any = {
            "id": router.query.id,
            "quantity": Number(param.quantity),
            "errorQuantity": Number(param.errorQuantity),
            "productId": param.productId.value
        }
        if (param.expiredDate) {
            query.expiredDate = moment(param.expiredDate).format("YYYY-MM-DD hh:mm:ss");
        }
        ImportProduct(query).then(() => {
            props.importMutate();
            handleCancel();
            showMessage(`${t('import_success')}`, 'success');
        }).catch((err) => {
            showMessage(`${t('import_error')}`, 'error');
        });
    }

    const handleCancel = () => {
        props.setOpenModal(false);
        setInitialValue({});
        setDisable(!disable);
    };

    useEffect(() => {
        setInitialValue({
            quantity: props?.data ? `${props?.data?.quantity}` : "",
            errorQuantity: props?.data ? `${props?.data?.errorQuantity}` : "",
            productId: props?.data ? {
                value: `${props?.data?.product.id}`,
                label: `${props?.data?.product.name}`
            } : ""
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

    const handleSearch = (e: any) => {
        setSearch(e);
    }

    const handleNoti = () => {
        setDisable(!disable);
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
                            <Dialog.Panel className="panel w-full max-w-lg overflow-hidden rounded-2xl border-0 p-0 text-[#476704] dark:text-white-dark">
                                <button
                                    type="button"
                                    onClick={() => handleCancel()}
                                    className="absolute top-4 ltr:right-4 rtl:left-4 dark:hover:text-gray-600"
                                >
                                    <IconX />
                                </button>
                                <div className="bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pr-5 rtl:pl-[50px] dark:bg-[#121c2c]">
                                    {t('import_product')}
                                </div>
                                <div className="p-5 pl-10 pr-10">
                                    <Formik
                                        initialValues={initialValue}
                                        validationSchema={SubmittedForm}
                                        onSubmit={values => {
                                            handleImport(values);
                                        }}
                                        enableReinitialize
                                    >

                                        {({ errors, values, setFieldValue, submitCount }) => (
                                            <Form className="space-y-5" >
                                                <div className="mb-5 flex justify-between gap-4">
                                                    <div className="flex-1">
                                                        <label htmlFor="productId" > {t('product')} < span style={{ color: 'red' }}>* </span></label >
                                                        <Select
                                                            id='productId'
                                                            name='productId'
                                                            options={dataProductDropdown}
                                                            onInputChange={e => handleSearch(e)}
                                                            onMenuOpen={() => setPage(1)}
                                                            onMenuScrollToBottom={handleMenuScrollToBottom}
                                                            isLoading={productLoading}
                                                            maxMenuHeight={160}
                                                            value={values?.productId}
                                                            onChange={e => {
                                                                setFieldValue('productId', e)
                                                            }}
                                                        />
                                                        {submitCount && errors.productId ? (
                                                            <div className="text-danger mt-1"> {`${errors.productId}`} </div>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="mb-5">
                                                    <label htmlFor="quantity" > {t('quantity')} < span style={{ color: 'red' }}>* </span></label >
                                                    <Field autoComplete="off"
                                                        name="quantity"
                                                        type="text"
                                                        id="quantity"
                                                        placeholder={`${t('enter_quantity_product')}`}
                                                        className="form-input"
                                                    />
                                                    {submitCount && errors.quantity ? (
                                                        <div className="text-danger mt-1"> {`${errors.quantity}`} </div>
                                                    ) : null}
                                                </div>
                                                <div className="mb-5">
                                                    <label htmlFor="errorQuantity" > {t('error_quantity')}</label >
                                                    <Field autoComplete="off"
                                                        name="errorQuantity"
                                                        type="text"
                                                        id="errorQuantity"
                                                        placeholder={`${t('enter_error_quantity_product')}`}
                                                        className="form-input"
                                                    />
                                                    {submitCount && errors.errorQuantity ? (
                                                        <div className="text-danger mt-1"> {`${errors.errorQuantity}`} </div>
                                                    ) : null}
                                                </div>
                                                <div className="mb-5">
                                                    <label htmlFor="expiredDate" className='label'> {t('expired_date')} < span style={{ color: 'red' }}>* </span></label >
                                                    <Field
                                                        autoComplete="off"
                                                        name="expiredDate"
                                                        render={({ field }: any) => (
                                                            <Flatpickr
                                                                data-enable-time
                                                                placeholder={`${t('YYYY-MM-DD')}`}
                                                                options={{
                                                                    enableTime: true,
                                                                    dateFormat: 'Y-m-d'
                                                                }}
                                                                value={field?.value}
                                                                onChange={e => setFieldValue("expiredDate", moment(e[0]).format("YYYY-MM-DD hh:mm"))}
                                                                className={disable ? "form-input bg-[#f2f2f2] calender-input" : "form-input calender-input"}
                                                                disabled={disable}
                                                            />
                                                        )}
                                                    />
                                                    {submitCount && errors.expiredDate ? (
                                                        <div className="text-danger mt-1"> {`${errors.expiredDate}`} </div>
                                                    ) : null}
                                                </div>
                                                <div className="flex justify-between">
                                                    <div className="flex items-center justify-end ltr:text-right rtl:text-left gap-2">
                                                        <Checkbox onClick={e => handleNoti()} />
                                                        <span>{`${t('noti_expired')}`}</span>
                                                    </div>
                                                    <div className="p-[15px] flex items-center justify-end ltr:text-right rtl:text-left">
                                                        <button type="button" className="btn btn-outline-danger cancel-button" onClick={() => handleCancel()}>
                                                            {t('cancel')}
                                                        </button>
                                                        <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4 add-button" disabled={disabled}>
                                                            {props.data !== undefined ? t('update') : t('save')}
                                                        </button>
                                                    </div>
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

export default ImportModal;
