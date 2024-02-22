import { useEffect, Fragment, useState, SetStateAction } from 'react';
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
import { CreateStocktake, EditStocktake } from '@/services/apis/stocktake.api';

interface Props {
    [key: string]: any;
}

const StocktakeModal = ({ ...props }: Props) => {

    const { t } = useTranslation();
    const router = useRouter();
    const [initialValue, setInitialValue] = useState<any>();
    const [dataWarehouseDropdown, setDataWarehouseDropdown] = useState<any>([]);
    const [dataUserDropdown, setDataUserDropdown] = useState<any>([]);
    const [pageUser, setPageUser] = useState(1);
    const [pageWarehouse, setPageWarehouse] = useState(1);

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
        if (props?.data) {
            EditStocktake({ id: props?.data?.id, ...query }).then(() => {
                props.stocktakeMutate();
                handleCancel();
                showMessage(`${t('edit_success')}`, 'success');
            }).catch((err) => {
                showMessage(`${err?.response?.data?.message}`, 'error');
            });
        } else {
            CreateStocktake(query).then(() => {
                props.stocktakeMutate();
                handleCancel();
                showMessage(`${t('create_success')}`, 'success');
            }).catch((err) => {
                showMessage(`${err?.response?.data?.message[0].error}`, 'error');
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
            participants: props?.data ? props?.data?.participants.map((item: any) => {
                return (
                    {
                        label: item.fullName,
                        value: item.id
                    }
                )
            }) : "",
            warehouseId: props?.data ? {
                value: `${props?.data?.warehouse.id}`,
                label: `${props?.data?.warehouse.name}`
            } : "",
            description: props?.data ? `${props?.data?.description}` : "",
            startDate: props?.data ? moment(`${props?.data?.startDate}`).format("YYYY-MM-DD") : "",
            endDate: props?.data ? moment(`${props?.data?.endDate}`).format("YYYY-MM-DD") : ""
        })
    }, [props?.data, router]);

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
                                    {props.data !== undefined ? t('edit_stocktake') : t('add_stocktake')}
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
                                                            value={values.warehouseId}
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
                                                            value={values.participants}
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

export default StocktakeModal;
