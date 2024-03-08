import { useEffect, Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog, Transition } from '@headlessui/react';

import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import Swal from 'sweetalert2';
import { showMessage } from '@/@core/utils';
import IconX from '@/components/Icon/IconX';
import { CreateProductCategory, EditProductCategory, GetProductCategory } from '@/services/apis/product.api';
import Link from 'next/link';
import IconBackward from '@/components/Icon/IconBackward';
import { useRouter } from 'next/router';
import Select, { components } from 'react-select';
import { DropdownWarehouses } from '@/services/swr/dropdown.twr';

interface Props {
    [key: string]: any;
}

const CategoryModal = ({ ...props }: Props) => {

    const router = useRouter();
    const { t } = useTranslation();
    const [disabled, setDisabled] = useState(false);
    const [data, setData] = useState<any>();
    const [dataWarehouseDropdown, setDataWarehouseDropdown] = useState<any>([]);
    const [pageWarehouse, setPageWarehouse] = useState(1);

    const SubmittedForm = Yup.object().shape({
        name: Yup.string().min(2, 'Too Short!').required(`${t('please_fill_name')}`),
        warehouseId: new Yup.ObjectSchema().required(`${t('please_fill_warehouse')}`)
    });

    const { data: warehouseDropdown, pagination: warehousePagination, isLoading: warehouseLoading } = DropdownWarehouses({ page: pageWarehouse });

    const handleCategory = (param: any) => {
        const query = {
            "name": param.name,
            "description": param.description,
            "warehouseId": param.warehouseId.value
        }

        if (data) {
            EditProductCategory({ id: data.id, ...query }).then(() => {
                handleCancel();
                showMessage(`${t('edit_category_success')}`, 'success');
            }).catch((err) => {
                showMessage(`${t('edit_category_error')}`, 'error');
            });
        } else {
            CreateProductCategory(query).then(() => {
                handleCancel();
                showMessage(`${t('create_category_success')}`, 'success');
            }).catch((err) => {
                showMessage(`${t('create_category_error')}`, 'error');
            });
        }
    }

    const handleCancel = () => {
        router.push('/warehouse/product/category')
    };

    useEffect(() => {
        if (Number(router.query.id)) {
            GetProductCategory({ id: Number(router.query.id) }).then((res) => {
                setData(res.data)
            }).catch((err) => {
                showMessage(`${err?.response?.data?.message}`, 'error');
            })
        }
    }, [router]);

    useEffect(() => {
        if (warehousePagination?.page === undefined) return;
        if (warehousePagination?.page === 1) {
            setDataWarehouseDropdown(warehouseDropdown?.data)
        } else {
            setDataWarehouseDropdown([...dataWarehouseDropdown, ...warehouseDropdown?.data])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [warehousePagination]);

    const handleMenuScrollToBottomWarehouse = () => {
        setTimeout(() => {
            setPageWarehouse(warehousePagination?.page + 1);
        }, 1000);
    }

    return (
        <div>
            <div className='flex justify-between header-page-bottom pb-4 mb-4'>
                <h1 className='page-title'>{data !== undefined ? t('edit_category') : t('add_category')}</h1>
                <Link href="/warehouse/product/category">
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
                            name: data ? `${data?.name}` : "",
                            description: data ? `${data?.description}` : "",
                            warehouseId: data ? {
                                value: `${data?.warehouse?.id}`,
                                label: `${data?.warehouse?.name}`
                            } : ""
                        }
                    }
                    validationSchema={SubmittedForm}
                    onSubmit={values => {
                        handleCategory(values);
                    }}
                    enableReinitialize
                >

                    {({ values, setFieldValue, errors, submitCount }) => (
                        <Form className="space-y-5" >
                            <div className='flex justify-between gap-5'>
                                <div className="w-1/2">
                                    <label htmlFor="name" > {t('name_category')} < span style={{ color: 'red' }}>* </span></label >
                                    <Field name="name" type="text" id="name" placeholder={`${t('enter_name')}`} className="form-input" />
                                    {submitCount && errors.name ? (
                                        <div className="text-danger mt-1"> {errors.name} </div>
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
                            <div className="">
                                <label htmlFor="description" > {t('description')} </label >
                                <Field name="description" type="text" id="description" placeholder={`${t('enter_description')}`} className="form-input" />
                                {submitCount && errors.description ? (
                                    <div className="text-danger mt-1"> {errors.description} </div>
                                ) : null}
                            </div>
                            <div className="mt-8 flex items-center justify-end ltr:text-right rtl:text-left">
                                <button type="button" className="btn btn-outline-danger cancel-button" onClick={() => handleCancel()}>
                                    {t('cancel')}
                                </button>
                                <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4 add-button" disabled={disabled}>
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

export default CategoryModal;
