import { useEffect, Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog, Transition } from '@headlessui/react';

import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import Swal from 'sweetalert2';
import { showMessage } from '@/@core/utils';
import IconX from '@/components/Icon/IconX';
import Select, { components } from 'react-select';
import { DropdownProductCategorys, DropdownUnits } from '@/services/swr/dropdown.twr';
import { CreateProduct, EditProduct, GetProduct } from '@/services/apis/product.api';
import Link from 'next/link';
import IconBackward from '@/components/Icon/IconBackward';
import { useRouter } from 'next/router';

interface Props {
    [key: string]: any;
}

const ProductModal = ({ ...props }: Props) => {
    const router = useRouter();
    const { t } = useTranslation();
    const [disabled, setDisabled] = useState(false);
    const [pageCategory, setSizeCategory] = useState<any>(1);
    const [pageUnit, setSizeUnit] = useState<any>(1);
    const [data, setData] = useState<any>();
    const [dataCategoryDropdown, setDataCategoryDropdown] = useState<any>([]);
    const [dataUnitDropdown, setDataUnitDropdown] = useState<any>([]);

    //get data
    const { data: categorys, pagination: paginationCategory, isLoading: CategoryLoading } = DropdownProductCategorys({ page: pageCategory });
    const { data: units, pagination: paginationUnit, isLoading: UnitLoading } = DropdownUnits({ page: pageUnit });

    const SubmittedForm = Yup.object().shape({
        name: Yup.string()
            .min(2, 'Too Short!')
            .required(`${t('please_fill_name_product')}`),
        code: Yup.string()
            .min(2, 'Too Short!')
            .required(`${t('please_fill_productCode')}`),
        unitId: new Yup.ObjectSchema().required(`${t('please_fill_unit')}`),
        categoryId: new Yup.ObjectSchema().required(`${t('please_fill_category')}`),
    });
    const handleProduct = (param: any) => {
        const query = {
            name: param.name,
            code: param.code,
            unitId: Number(param.unitId.value),
            description: param.description,
            categoryId: Number(param.categoryId.value),
            minQuantity: Number(param.minQuantity),
            maxQuantity: Number(param.maxQuantity)
        };
        if (data) {
            EditProduct({ id: data.id, ...query })
                .then(() => {
                    handleCancel();
                    showMessage(`${t('edit_product_success')}`, 'success');
                })
                .catch((err) => {
                    showMessage(`${err?.response?.data?.message}`, 'error');
                });
        } else {
            CreateProduct(query)
                .then(() => {
                    handleCancel();
                    showMessage(`${t('create_product_success')}`, 'success');
                })
                .catch((err) => {
                    showMessage(`${err?.response?.data?.message}`, 'error');
                });
        }
    };

    const handleCancel = () => {
        router.push('/warehouse/product/list');
    };

    useEffect(() => {
        if (paginationCategory?.page === undefined) return;
        if (paginationCategory?.page === 1) {
            setDataCategoryDropdown(categorys?.data);
        } else {
            setDataCategoryDropdown([...dataCategoryDropdown, ...categorys?.data]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paginationCategory]);

    useEffect(() => {
        if (paginationUnit?.page === undefined) return;
        if (paginationUnit?.page === 1) {
            setDataUnitDropdown(units?.data);
        } else {
            setDataUnitDropdown([...dataUnitDropdown, ...units?.data]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paginationUnit]);

    const handleMenuScrollToBottomCategory = () => {
        setTimeout(() => {
            setSizeCategory(paginationCategory?.page + 1);
        }, 1000);
    };

    const handleMenuScrollToBottomUnit = () => {
        setTimeout(() => {
            setSizeUnit(paginationUnit?.page + 1);
        }, 1000);
    };

    useEffect(() => {
        if (Number(router.query.id)) {
            GetProduct({ id: Number(router.query.id) })
                .then((res) => {
                    setData(res.data);
                })
                .catch((err) => {
                    showMessage(`${err?.response?.data?.message}`, 'error');
                });
        }
    }, [router]);

    return (
        <div>
            <div className="header-page-bottom mb-4 flex justify-between pb-4">
                <h1 className="page-title">{data !== undefined ? t('edit_product') : t('add_product')}</h1>
                <Link href="/warehouse/product/list">
                    <div className="btn btn-primary btn-sm back-button m-1 h-9">
                        <IconBackward />
                        <span>{t('back')}</span>
                    </div>
                </Link>
            </div>
            <div className="p-5">
                <Formik
                    initialValues={{
                        name: data ? `${data?.name}` : '',
                        code: data ? `${data?.code}` : '',
                        unitId: data?.unit
                            ? {
                                value: `${data?.unit?.id}`,
                                label: `${data?.unit?.name}`,
                            }
                            : '',
                        description: data ? `${data?.description}` : '',
                        categoryId: data?.category
                            ? {
                                value: `${data?.category?.id}`,
                                label: `${data?.category?.name}`,
                            }
                            : '',
                        minQuantity: data ? `${data?.minQuantity}` : '',
                        maxQuantity: data ? `${data?.maxQuantity}` : '',
                        barCode: data?.barCode ? `${data?.barCode}` : ''
                    }}
                    validationSchema={SubmittedForm}
                    onSubmit={(values) => {
                        handleProduct(values);
                    }}
                    enableReinitialize
                >
                    {({ errors, values, setFieldValue, submitCount }) => (
                        <Form className="space-y-5">
                            <div className="flex justify-between gap-5">
                                <div className="w-1/2">
                                    <label htmlFor="name" data-testid={'name'}>
                                        {' '}
                                        {t('name_product')} <span style={{ color: 'red' }}>* </span>
                                    </label>
                                    <Field name="name" type="text" id="name" placeholder={`${t('enter_name')}`} className="form-input" />
                                    {submitCount && errors.name ? <div className="mt-1 text-danger"> {errors.name} </div> : null}
                                </div>
                                <div className="w-1/2">
                                    <label htmlFor="code" data-testid={'code'}>
                                        {' '}
                                        {t('code_product')} <span style={{ color: 'red' }}>* </span>
                                    </label>
                                    <Field name="code" type="text" id="code" placeholder={`${t('enter_code')}`} className="form-input" />
                                    {submitCount && errors.code ? <div className="mt-1 text-danger"> {errors.code} </div> : null}
                                </div>
                            </div>
                            <div className="flex justify-between gap-5">
                                <div className="w-1/2">
                                    <label htmlFor="unitId" data-testid={'unitId'}>
                                        {' '}
                                        {t('unit')} <span style={{ color: 'red' }}>* </span>
                                    </label>
                                    <Select
                                        id="unitId"
                                        name="unitId"
                                        options={dataUnitDropdown}
                                        onMenuOpen={() => setSizeUnit(1)}
                                        onMenuScrollToBottom={handleMenuScrollToBottomUnit}
                                        maxMenuHeight={160}
                                        value={values.unitId}
                                        isLoading={UnitLoading}
                                        onChange={(e) => {
                                            setFieldValue('unitId', e);
                                        }}
                                    />
                                    {submitCount && errors.unitId ? <div className="mt-1 text-danger"> {errors.code} </div> : null}
                                </div>
                                <div className="w-1/2">
                                    <label htmlFor="categoryId">
                                        {' '}
                                        {t('category')} <span style={{ color: 'red' }}>* </span>
                                    </label>
                                    <Select
                                        id="categoryId"
                                        name="categoryId"
                                        options={dataCategoryDropdown}
                                        onMenuOpen={() => setSizeCategory(1)}
                                        onMenuScrollToBottom={handleMenuScrollToBottomCategory}
                                        isLoading={CategoryLoading}
                                        maxMenuHeight={160}
                                        value={values.categoryId}
                                        onChange={(e) => {
                                            setFieldValue('categoryId', e);
                                        }}
                                    />
                                    {submitCount && errors.categoryId ? <div className="mt-1 text-danger"> {errors.categoryId} </div> : null}
                                </div>
                            </div>
                            <div className="flex justify-between gap-5">
                                <div className="w-1/2">
                                    <label htmlFor="minQuantity" > {t('min_quantity')} < span style={{ color: 'red' }}>* </span></label >
                                    <Field name="minQuantity" type="number" id="minQuantity" placeholder={`${t('enter_min_quantity')}`} className="form-input" />
                                    {errors.minQuantity ? (
                                        <div className="text-danger mt-1"> {errors.minQuantity} </div>
                                    ) : null}
                                </div>
                                <div className="w-1/2">
                                    <label htmlFor="maxQuantity" > {t('max_quantity')} < span style={{ color: 'red' }}>* </span></label >
                                    <Field name="maxQuantity" type="number" id="maxQuantity" placeholder={`${t('enter_max_quantity')}`} className="form-input" />
                                    {errors.maxQuantity ? (
                                        <div className="text-danger mt-1"> {errors.maxQuantity} </div>
                                    ) : null}
                                </div>
                            </div>
                            <div className="flex justify-between gap-5">
                                <div className="w-1/2">
                                    <label htmlFor="barCode">
                                        {' '}
                                        {t('Barcode')}{' '}
                                    </label>
                                    <Field name="barCode" type="text" id="barCode" placeholder={`${t('')}`} className="form-input" />
                                    {submitCount && errors.barCode ? <div className="mt-1 text-danger"> {errors.barCode} </div> : null}
                                </div>
                                <div className='w-1/2'>
                                    <div className="mt-6 flex items-center justify-start gap-2">
                                        <button type="submit" className="btn btn-primary add-button w-[200px]" disabled={disabled}>
                                            {t('Tạo mã barcode')}
                                        </button>
                                        <button type="submit" className="btn btn-primary add-button w-[150px]" disabled={disabled}>
                                            {t('In mã barcode')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="">
                                <label htmlFor="description" data-testid={'description'}>
                                    {' '}
                                    {t('description')}{' '}
                                </label>
                                <Field name="description" type="text" id="description" placeholder={`${t('enter_description')}`} className="form-input" />
                                {submitCount && errors.description ? <div className="mt-1 text-danger"> {errors.description} </div> : null}
                            </div>
                            <div className="mt-8 flex items-center justify-end ltr:text-right rtl:text-left">
                                <button data-testid={'cancel-btn'} type="button" className="btn btn-outline-danger cancel-button" onClick={() => handleCancel()}>
                                    {t('cancel')}
                                </button>
                                <button data-testid={'submit-btn'} type="submit" className="btn btn-primary add-button ltr:ml-4 rtl:mr-4" disabled={disabled}>
                                    {data !== undefined ? t('update') : t('add')}
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
