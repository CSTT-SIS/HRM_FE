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
import { DropdownProducts, DropdownWarehouses } from '@/services/swr/dropdown.twr';
import Link from 'next/link';
import IconBackward from '@/components/Icon/IconBackward';

interface Props {
    [key: string]: any;
}

const ImportModal = ({ ...props }: Props) => {
    const { t } = useTranslation();
    const [disabled, setDisabled] = useState(false);
    const router = useRouter();
    const [initialValue, setInitialValue] = useState<any>();
    const [dataProductDropdown, setDataProductDropdown] = useState<any>([]);
    const [dataWarehouseDropdown, setDataWarehouseDropdown] = useState<any>([]);
    const [page, setPage] = useState(1);
    const [pageWarehouse, setPageWarehouse] = useState(1);

    const SubmittedForm = Yup.object().shape({
        quantity: Yup.string().required(`${t('please_fill_quantity')}`),
        productId: new Yup.ObjectSchema().required(`${t('please_fill_product')}`)

    });

    //get data
    const { data: productDropdown, pagination: productPagination, isLoading: productLoading } = DropdownProducts({ page: page });
    const { data: warehouseDropdown, pagination: warehousePagination, isLoading: warehouseLoading } = DropdownWarehouses({ page: pageWarehouse });
    const handleImport = (param: any) => {
        const query = {
            "id": router.query.warehouseId,
            "quantity": Number(param.quantity),
            "errorQuantity": Number(param.errorQuantity),
            "productId": param.productId.value,
            "warehouseId": param.warehouseId.value
        }
        ImportProduct(query).then(() => {
            handleCancel();
            showMessage(`${t('import_success')}`, 'success');
        }).catch((err) => {
            showMessage(`${t('import_error')}`, 'error');
        });
    }

    const handleCancel = () => {
        router.push(`/warehouse/${router.query.warehouseId}`);
    };

    useEffect(() => {
        setInitialValue({
            quantity: props?.data ? `${props?.data?.quantity}` : "",
            errorQuantity: props?.data ? `${props?.data?.errorQuantity}` : "",
            productId: props?.data ? {
                value: `${props?.data?.product.id}`,
                label: `${props?.data?.product.name}`
            } : "",
            warehouseId: props?.data ? {
                value: `${props?.data?.product.id}`,
                label: `${props?.data?.product.name}`
            } : "",
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

    useEffect(() => {
        if (warehousePagination?.page === undefined) return;
        if (warehousePagination?.page === 1) {
            setDataWarehouseDropdown(warehouseDropdown?.data)
        } else {
            setDataWarehouseDropdown([...dataWarehouseDropdown, ...warehouseDropdown?.data])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [warehousePagination])

    const handleMenuScrollToBottom = () => {
        setTimeout(() => {
            setPage(productPagination?.page + 1);
        }, 1000);
    }

    const handleMenuScrollToBottomWarehouse = () => {
        setTimeout(() => {
            setPage(warehousePagination?.page + 1);
        }, 1000);
    }

    return (
        <div className="p-5">
            <div className='flex justify-between header-page-bottom pb-4 mb-4'>
                <h1 className='page-title'>{t('product')}</h1>
                <Link href={`/warehouse/${router.query.warehouseId}`}>
                    <div className="btn btn-primary btn-sm m-1 back-button h-9" >
                        <IconBackward />
                        <span>
                            {t('back')}
                        </span>
                    </div>
                </Link>
            </div>
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
                            <div className="w-1/2">
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
                                {submitCount && errors.productId ? (
                                    <div className="text-danger mt-1"> {`${errors.productId}`} </div>
                                ) : null}
                            </div>
                            <div className="w-1/2">
                                <label htmlFor="warehouseId" > {t('warehouse')} < span style={{ color: 'red' }}>* </span></label >
                                <Select
                                    id='warehouseId'
                                    name='warehouseId'
                                    options={dataWarehouseDropdown}
                                    onMenuOpen={() => setPageWarehouse(1)}
                                    onMenuScrollToBottom={handleMenuScrollToBottomWarehouse}
                                    isLoading={warehouseLoading}
                                    maxMenuHeight={160}
                                    value={values?.warehouseId}
                                    onChange={e => {
                                        setFieldValue('warehouseId', e)
                                    }}
                                />
                                {submitCount && errors.warehouseId ? (
                                    <div className="text-danger mt-1"> {`${errors.warehouseId}`} </div>
                                ) : null}
                            </div>
                        </div>
                        <div className="mb-5 flex justify-between gap-4">
                            <div className="w-1/2">
                                <label htmlFor="quantity" > {t('quantity')} < span style={{ color: 'red' }}>* </span></label >
                                <Field
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
                            <div className="w-1/2">
                                <label htmlFor="errorQuantity" > {t('error_quantity')}</label >
                                <Field
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
                        </div>
                        <div className="mt-8 flex items-center justify-end ltr:text-right rtl:text-left">
                            <button type="button" className="btn btn-outline-danger cancel-button" onClick={() => handleCancel()}>
                                {t('cancel')}
                            </button>
                            <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4 add-button" disabled={disabled}>
                                {props.data !== undefined ? t('update') : t('add')}
                            </button>
                        </div>

                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default ImportModal;
