import { useEffect, Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog, Transition } from '@headlessui/react';

import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import { showMessage } from '@/@core/utils';
import IconX from '@/components/Icon/IconX';
import { useRouter } from 'next/router';
import Select, { components } from 'react-select';
import { DropdownUsers, DropdownWarehouses } from '@/services/swr/dropdown.twr';
import moment from 'moment';
import { CreateStocktake, EditStocktake, GetStocktake } from '@/services/apis/stocktake.api';

interface Props {
    [key: string]: any;
}

const StocktakeForm = ({ ...props }: Props) => {

    const { t } = useTranslation();
    const router = useRouter();
    const [initialValue, setInitialValue] = useState<any>();
    const [dataWarehouseDropdown, setDataWarehouseDropdown] = useState<any>([]);
    const [dataUserDropdown, setDataUserDropdown] = useState<any>([]);
    const [pageUser, setPageUser] = useState(1);
    const [pageWarehouse, setPageWarehouse] = useState(1);
    const [data, setData] = useState<any>();

    const SubmittedForm = Yup.object().shape({
        name: Yup.string().required(`${t('please_fill_name')}`),
        participants: new Yup.ArraySchema().required(`${t('please_fill_proposal')}`),
        warehouseId: new Yup.ObjectSchema().required(`${t('please_fill_provider')}`),
        startDate: Yup.string().required(`${t('please_fill_date')}`),
        endDate: Yup.string().required(`${t('please_fill_date')}`)

    });

    const { data: users, pagination: paginationUser, isLoading: userLoading } = DropdownUsers({ page: pageUser });
    const { data: warehouses, pagination: warehousePagination, isLoading: warehouseLoading } = DropdownWarehouses({ page: pageWarehouse });

    const handleStocktake = (param: any) => {
        const query = {
            name: param.name,
            warehouseId: Number(param.warehouseId.value),
            description: param.description,
            startDate: param.startDate,
            endDate: param.endDate,
            participants: param.participants.map((item: any) => { return (item.value) })
        };
        if (data) {
            EditStocktake({ id: router.query?.id, ...query }).then(() => {
                getData();
                showMessage(`${t('edit_success')}`, 'success');
            }).catch((err) => {
                showMessage(`${err?.response?.data?.message}`, 'error');
            });
        } else {
            CreateStocktake(query).then((res) => {
                router.push({
                    pathname: `/warehouse-management/stocktake/${res.data.id}`,
                    query: {
                        status: res.data.status
                    }
                })
                showMessage(`${t('create_success')}`, 'success');
            }).catch((err) => {
                showMessage(`${err?.response?.data?.message[0].error}`, 'error');
            });
        }
    }
    
    const getData = () => {
        GetStocktake({ id: router.query.id }).then((res) => {
            setData(res.data);
            router.push({
                pathname: `/warehouse-management/stocktake/${res.data.id}`,
                query: {
                    status: res.data.status
                }
            })
        }).catch((err) => {
            showMessage(`${err?.response?.data?.message}`, 'error');
        });
    }

    const handleCancel = () => {
        router.push('/warehouse-management/stocktake');
    };

    useEffect(() => {
        if (Number(router.query.id)) {
            getData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.query.id])


    useEffect(() => {
        setInitialValue({
            name: data ? `${data?.name}` : "",
            participants: data ? data?.participants.map((item: any) => {
                return (
                    {
                        label: item.fullName,
                        value: item.id
                    }
                )
            }) : "",
            warehouseId: data ? {
                value: `${data?.warehouse.id}`,
                label: `${data?.warehouse.name}`
            } : "",
            description: data ? `${data?.description}` : "",
            startDate: data ? moment(`${data?.startDate}`).format("YYYY-MM-DD") : "",
            endDate: data ? moment(`${data?.endDate}`).format("YYYY-MM-DD") : ""
        })
    }, [data]);

    useEffect(() => {
        if (paginationUser?.page === undefined) return;
        if (paginationUser?.page === 1) {
            setDataUserDropdown(users?.data)
        } else {
            setDataUserDropdown([...dataUserDropdown, ...users?.data])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paginationUser])

    useEffect(() => {
        if (warehousePagination?.page === undefined) return;
        if (warehousePagination?.page === 1) {
            setDataWarehouseDropdown(warehouses?.data)
        } else {
            setDataWarehouseDropdown([...dataWarehouseDropdown, ...warehouses?.data])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [warehousePagination])

    const handleMenuScrollToBottomUser = () => {
        setTimeout(() => {
            setPageUser(paginationUser?.page + 1);
        }, 1000);
    }

    const handleMenuScrollToBottomWarehouse = () => {
        setTimeout(() => {
            setPageWarehouse(warehousePagination?.page + 1);
        }, 1000);
    }

    return (
        <div className='panel'>
            <div className="bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pr-5 rtl:pl-[50px] dark:bg-[#121c2c]">
                {t('stocktake')}
            </div>
            <div className="p-5">
                <Formik
                    initialValues={initialValue}
                    validationSchema={SubmittedForm}
                    onSubmit={values => {
                        handleStocktake(values);
                    }}
                    enableReinitialize
                >
                    {({ errors, values, setFieldValue }) => (
                        <Form className="space-y-5" >
                            <div className="mb-5">
                                <label htmlFor="name" > {t('name')} < span style={{ color: 'red' }}>* </span></label >
                                <Field
                                    name="name"
                                    type="text"
                                    id="name"
                                    placeholder={`${t('enter_name')}`}
                                    className="form-input"
                                />
                                {errors.name ? (
                                    <div className="text-danger mt-1"> {`${errors.name}`} </div>
                                ) : null}
                            </div>
                            <div className="mb-5 flex justify-between gap-4">
                                <div className="flex-1">
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
                                    {errors.warehouseId ? (
                                        <div className="text-danger mt-1"> {`${errors.warehouseId}`} </div>
                                    ) : null}
                                </div>
                            </div>
                            <div className="mb-5">
                                <label htmlFor="startDate" > {t('start_date')} < span style={{ color: 'red' }}>* </span></label >
                                <Field
                                    name="startDate"
                                    type="date"
                                    id="startDate"
                                    className="form-input"
                                />
                                {errors.startDate ? (
                                    <div className="text-danger mt-1"> {`${errors.startDate}`} </div>
                                ) : null}
                            </div>
                            <div className="mb-5">
                                <label htmlFor="endDate" > {t('end_date')} < span style={{ color: 'red' }}>* </span></label >
                                <Field
                                    name="endDate"
                                    type="date"
                                    id="endDate"
                                    className="form-input"
                                />
                                {errors.endDate ? (
                                    <div className="text-danger mt-1"> {`${errors.endDate}`} </div>
                                ) : null}
                            </div>
                            <div className="mb-5">
                                <label htmlFor="description" > {t('description')} < span style={{ color: 'red' }}>* </span></label >
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
                            <div className="mb-5 flex justify-between gap-4">
                                <div className="flex-1">
                                    <label htmlFor="participants" > {t('participant')} < span style={{ color: 'red' }}>* </span></label >
                                    <Select
                                        id='participants'
                                        name='participants'
                                        options={dataUserDropdown}
                                        maxMenuHeight={160}
                                        onMenuOpen={() => setPageUser(1)}
                                        onMenuScrollToBottom={handleMenuScrollToBottomUser}
                                        isLoading={userLoading}
                                        isMulti
                                        value={values?.participants}
                                        onChange={e => {
                                            setFieldValue('participants', e)
                                        }}
                                    />
                                    {errors.participants ? (
                                        <div className="text-danger mt-1"> {`${errors.participants}`} </div>
                                    ) : null}
                                </div>
                            </div>
                            <div className="mt-8 flex items-center justify-end ltr:text-right rtl:text-left">
                                <button type="button" className="btn btn-outline-danger" onClick={() => handleCancel()}>
                                    {t('cancel')}
                                </button>
                                <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4">
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

export default StocktakeForm;
