import { useEffect, Fragment, useState, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog, Transition } from '@headlessui/react';

import * as Yup from 'yup';
import { Field, Form, Formik, useFormikContext } from 'formik';
import Swal from 'sweetalert2';
import { showMessage } from '@/@core/utils';
import IconX from '@/components/Icon/IconX';
import { useRouter } from 'next/router';
import Select, { components } from 'react-select';
import { Products } from '@/services/swr/product.twr';
import { ImportProduct } from '@/services/apis/warehouse.api';

interface Props {
    [key: string]: any;
}

const ImportModal = ({ ...props }: Props) => {
    const { t } = useTranslation();
    const [disabled, setDisabled] = useState(false);
    const router = useRouter();
    const [initialValue, setInitialValue] = useState<any>();
    const [dataSelect, setDataSelect] = useState<any>();
    const [query, setQuery] = useState<any>();


    const SubmittedForm = Yup.object().shape({
        quantity: Yup.string().required(`${t('please_fill_quantity')}`),
        productId: new Yup.ObjectSchema().required(`${t('please_fill_product')}`)

    });

    //get data
    const { data: products } = Products(query);

    const handleImport = (param: any) => {
        const query = {
            "id": router.query.id,
            "quantity": Number(param.quantity),
            "errorQuantity": Number(param.errorQuantity),
            "productId": param.productId.id
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

    const handleSearch = (param: any) => {
        setQuery({ search: param });
    }

    const product = products?.data.filter((item: any) => {
        return (
            item.value = item.id,
            item.label = item.name
        )
    })

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
                                    {props.data !== undefined ? 'Edit Import' : 'Add Import'}
                                </div>
                                <div className="p-5">
                                    <Formik
                                        initialValues={initialValue}
                                        validationSchema={SubmittedForm}
                                        onSubmit={values => {
                                            handleImport(values);
                                        }}
                                        enableReinitialize
                                    >

                                        {({ errors, values, setFieldValue }) => (
                                            <Form className="space-y-5" >
                                                <div className="mb-5 flex justify-between gap-4">
                                                    <div className="flex-1">
                                                        <label htmlFor="productId" > {t('product')} < span style={{ color: 'red' }}>* </span></label >
                                                        <Select
                                                            id='productId'
                                                            name='productId'
                                                            onInputChange={e => handleSearch(e)}
                                                            options={product}
                                                            maxMenuHeight={160}
                                                            value={values.productId}
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
                                                        type="text"
                                                        id="quantity"
                                                        placeholder={`${t('enter_quantity_product')}`}
                                                        className="form-input"
                                                    />
                                                    {errors.quantity ? (
                                                        <div className="text-danger mt-1"> {`${errors.quantity}`} </div>
                                                    ) : null}
                                                </div>
                                                <div className="mb-5">
                                                    <label htmlFor="errorQuantity" > {t('error_quantity')}</label >
                                                    <Field
                                                        name="errorQuantity"
                                                        type="text"
                                                        id="errorQuantity"
                                                        placeholder={`${t('enter_error_quantity_product')}`}
                                                        className="form-input"
                                                    />
                                                    {errors.errorQuantity ? (
                                                        <div className="text-danger mt-1"> {`${errors.errorQuantity}`} </div>
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

export default ImportModal;
