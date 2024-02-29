import { useEffect, Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog, Transition } from '@headlessui/react';

import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import Swal from 'sweetalert2';
import { showMessage } from '@/@core/utils';
import IconX from '@/components/Icon/IconX';
import Select, { components } from 'react-select';
import { DropdownProductCategorys, DropdownProviders, DropdownUnits, DropdownWarehouses } from '@/services/swr/dropdown.twr';
import { CreateProduct, EditProduct } from '@/services/apis/product.api';
import Link from 'next/link';
import IconBackward from '@/components/Icon/IconBackward';

interface Props {
    [key: string]: any;
}

const ProductModal = ({ ...props }: Props) => {

    const { t } = useTranslation();
    const [disabled, setDisabled] = useState(false);
    const [pageCategory, setSizeCategory] = useState<any>(1);
    const [pageUnit, setSizeUnit] = useState<any>(1);
    const [dataCategoryDropdown, setDataCategoryDropdown] = useState<any>([]);
    const [dataUnitDropdown, setDataUnitDropdown] = useState<any>([]);
    const [dataWarehouseDropdown, setDataWarehouseDropdown] = useState<any>([]);
    const [pageWarehouse, setPageWarehouse] = useState(1);
    const [page, setPage] = useState(1);

    //get data
    const { data: categorys, pagination: paginationCategory, isLoading: CategoryLoading } = DropdownProductCategorys({ page: pageCategory });
    const { data: units, pagination: paginationUnit, isLoading: UnitLoading } = DropdownUnits({ page: pageUnit });
    const { data: warehouseDropdown, pagination: warehousePagination, isLoading: warehouseLoading } = DropdownWarehouses({ page: pageWarehouse });

    const SubmittedForm = Yup.object().shape({
        name: Yup.string().min(2, 'Too Short!').required(`${t('please_fill_name_product')}`),
        code: Yup.string().min(2, 'Too Short!').required(`${t('please_fill_productCode')}`),
        unitId: new Yup.ObjectSchema().required(`${t('please_fill_unit')}`),
        providerId: new Yup.ObjectSchema().required(`${t('please_fill_provider')}`),
        categoryId: new Yup.ObjectSchema().required(`${t('please_fill_category')}`)
    });
    const handleProduct = (param: any) => {
        const query = {
            "name": param.name,
            "code": param.code,
            "unitId": param.unitId.value,
            "description": param.description,
            "categoryId": param.categoryId.value,
            "warehouseId": param.warehouseId.value
        }
        if (props?.data) {
            EditProduct({ id: props.data.id, ...query }).then(() => {
                props.productMutate();
                handleCancel();
                showMessage(`${t('edit_product_success')}`, 'success');
            }).catch((err) => {
                showMessage(`${err?.response?.data?.message}`, 'error');
            });
        } else {
            CreateProduct(query).then(() => {
                props.productMutate();
                handleCancel();
                showMessage(`${t('create_product_success')}`, 'success');
            }).catch((err) => {
                showMessage(`${err?.response?.data?.message}`, 'error');
            });
        }
    }

    const handleCancel = () => {
        props.setOpenModal(false);
        props.setData(undefined);
    };
    useEffect(() => {
        if (paginationCategory?.page === undefined) return;
        if (paginationCategory?.page === 1) {
            setDataCategoryDropdown(categorys?.data)
        } else {
            setDataCategoryDropdown([...dataCategoryDropdown, ...categorys?.data])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paginationCategory])

    useEffect(() => {
        if (paginationUnit?.page === undefined) return;
        if (paginationUnit?.page === 1) {
            setDataUnitDropdown(units?.data)
        } else {
            setDataUnitDropdown([...dataUnitDropdown, ...units?.data])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paginationUnit]);

    useEffect(() => {
        if (warehousePagination?.page === undefined) return;
        if (warehousePagination?.page === 1) {
            setDataWarehouseDropdown(warehouseDropdown?.data)
        } else {
            setDataWarehouseDropdown([...dataWarehouseDropdown, ...warehouseDropdown?.data])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [warehousePagination])

    const handleMenuScrollToBottomCategory = () => {
        setTimeout(() => {
            setSizeCategory(paginationCategory?.page + 1);
        }, 1000);
    }

    const handleMenuScrollToBottomUnit = () => {
        setTimeout(() => {
            setSizeUnit(paginationUnit?.page + 1);
        }, 1000);
    }

    const handleMenuScrollToBottomWarehouse = () => {
        setTimeout(() => {
            setPage(warehousePagination?.page + 1);
        }, 1000);
    }

    return (
        <div>
            <div className='flex justify-between header-page-bottom pb-4 mb-4'>
                <h1 className='page-title'>{props.data !== undefined ? t('edit_product') : t('add_product')}</h1>
                <Link href="/warehouse/product/list">
                    <div className="btn btn-primary btn-sm m-1 back-button h-9" >
                        <IconBackward />
                        <span>
                            {t('back')}
                        </span>
                    </div>
                </Link>
            </div>
            <div className="p-5">
                <Formik
                    initialValues={
                        {
                            name: props?.data ? `${props?.data?.name}` : "",
                            code: props?.data ? `${props?.data?.code}` : "",
                            unitId: props?.data ? {
                                value: `${props?.data?.unit.id}`,
                                label: `${props?.data?.unit.name}`
                            } : "",
                            description: props?.data ? `${props?.data?.description}` : "",
                            categoryId: props?.data ? {
                                value: `${props?.data?.category.id}`,
                                label: `${props?.data?.category.name}`
                            } : "",
                            providerId: props?.data ? {
                                value: `${props?.data?.provider?.id}`,
                                label: `${props?.data?.provider?.name}`
                            } : "",
                            warehouseId: props?.data ? {
                                value: `${props?.data?.product.id}`,
                                label: `${props?.data?.product.name}`
                            } : "",
                        }
                    }
                    validationSchema={SubmittedForm}
                    onSubmit={values => {
                        handleProduct(values);
                    }}
                >

                    {({ errors, values, setFieldValue, submitCount }) => (
                        <Form className="space-y-5" >
                            <div className='flex justify-between gap-5'>
                                <div className="w-1/2">
                                    <label htmlFor="name" > {t('name')} < span style={{ color: 'red' }}>* </span></label >
                                    <Field name="name" type="text" id="name" placeholder={`${t('enter_name')}`} className="form-input" />
                                    {submitCount && errors.name ? (
                                        <div className="text-danger mt-1"> {errors.name} </div>
                                    ) : null}
                                </div>
                                <div className="w-1/2">
                                    <label htmlFor="code" > {t('code')} < span style={{ color: 'red' }}>* </span></label >
                                    <Field name="code" type="text" id="code" placeholder={`${t('enter_code')}`} className="form-input" />
                                    {submitCount && errors.code ? (
                                        <div className="text-danger mt-1"> {errors.code} </div>
                                    ) : null}
                                </div>
                            </div>
                            <div className='flex justify-between gap-5'>
                                <div className="w-1/2">
                                    <label htmlFor="unitId" > {t('unit')} < span style={{ color: 'red' }}>* </span></label >
                                    <Select
                                        id='unitId'
                                        name='unitId'
                                        options={dataUnitDropdown}
                                        onMenuOpen={() => setSizeUnit(1)}
                                        onMenuScrollToBottom={handleMenuScrollToBottomUnit}
                                        maxMenuHeight={160}
                                        value={values.unitId}
                                        isLoading={UnitLoading}
                                        onChange={e => {
                                            setFieldValue('unitId', e)
                                        }}
                                    />
                                    {submitCount && errors.unitId ? (
                                        <div className="text-danger mt-1"> {errors.code} </div>
                                    ) : null}
                                </div>
                                <div className="w-1/2">
                                    <label htmlFor="categoryId" > {t('category')} < span style={{ color: 'red' }}>* </span></label >
                                    <Select
                                        id='categoryId'
                                        name='categoryId'
                                        options={dataCategoryDropdown}
                                        onMenuOpen={() => setSizeCategory(1)}
                                        onMenuScrollToBottom={handleMenuScrollToBottomCategory}
                                        isLoading={CategoryLoading}
                                        maxMenuHeight={160}
                                        value={values.categoryId}
                                        onChange={e => {
                                            setFieldValue('categoryId', e)
                                        }}
                                    />
                                    {submitCount && errors.categoryId ? (
                                        <div className="text-danger mt-1"> {errors.categoryId} </div>
                                    ) : null}
                                </div>
                            </div>
                            <div className='flex justify-between gap-5'>
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
                                <div className="w-1/2">
                                    <label htmlFor="description" > {t('description')} </label >
                                    <Field name="description" type="text" id="description" placeholder={`${t('enter_description')}`} className="form-input" />
                                    {submitCount && errors.description ? (
                                        <div className="text-danger mt-1"> {errors.description} </div>
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
        </div>
    );
};

export default ProductModal;
