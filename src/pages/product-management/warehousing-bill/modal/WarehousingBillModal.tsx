import { useEffect, Fragment, useState, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog, Transition } from '@headlessui/react';

import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import { showMessage } from '@/@core/utils';
import IconX from '@/components/Icon/IconX';
import { useRouter } from 'next/router';
import Select, { components } from 'react-select';
import { DropdownOrder, DropdownOrderType, DropdownProposals, DropdownWarehouses, DropdownWarehousingType } from '@/services/swr/dropdown.twr';
import { CreateWarehousingBill, EditWarehousingBill } from '@/services/apis/warehousing-bill.api';

interface Props {
    [key: string]: any;
}

const WarehousingBillModal = ({ ...props }: Props) => {

    const { t } = useTranslation();
    const router = useRouter();
    const [initialValue, setInitialValue] = useState<any>();
    const [proposalStatus, setproposalStatus] = useState(true);
    const [pageProposal, setPageProposal] = useState(1);
    const [pageOder, setPageOrder] = useState(1);
    const [pageWarehouse, setPageWarehouse] = useState(1);
    const [dataProposalDropdown, setDataProposalDropdown] = useState<any>([]);
    const [dataOrderDropdown, setDataOrderDropdown] = useState<any>([]);
    const [dataWarehouseDropdown, setDataWarehouseDropdown] = useState<any>([]);


    const [proposalQuery, setProposalQuery] = useState<any>({ page: pageProposal, status: "APPROVED" });
    const [orderQuery, setOrderQuery] = useState<any>({ page: pageOder, status: "RECEIVED" });

    const SubmittedForm = Yup.object().shape({
        name: Yup.string().required(`${t('please_fill_name')}`),
        type: new Yup.ObjectSchema().required(`${t('please_fill_type')}`),
        proposalId: new Yup.ObjectSchema().required(`${t('please_fill_proposal')}`),
        warehouseId: new Yup.ObjectSchema().required(`${t('please_fill_warehouse')}`),
    });

    const { data: proposals, pagination: proposalPagination, isLoading: proposalLoading } = DropdownProposals(proposalQuery);
    const { data: orders, pagination: orderPagination, isLoading: orderLoading } = DropdownOrder(orderQuery);
    const { data: warehouses, pagination: warehousePagination, isLoading: warehouseLoading } = DropdownWarehouses({ page: pageWarehouse });
    const { data: warehousingBill, pagination: warehousingPagination, isLoading: warehousingLoading } = DropdownWarehousingType({ perPage: 0 });

    const handleWarehousing = (param: any) => {
        const query = {
            proposalId: Number(param.proposalId.value),
            orderId: Number(param.orderId.value),
            warehouseId: Number(param.proposalId.value),
            type: param.type.value,
            note: param.note,
            name: param.name
        };
        if (props?.data) {
            EditWarehousingBill({ id: props?.data?.id, ...query }).then(() => {
                props.warehousingMutate();
                handleCancel();
                showMessage(`${t('edit_success')}`, 'success');
            }).catch((err) => {
                showMessage(`${err?.response?.data?.message}`, 'error');
            });
        } else {
            CreateWarehousingBill(query).then(() => {
                props.warehousingMutate();
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
        setProposalQuery({ ...proposalQuery, type: "" })
    };
    console.log("🚀 ~ handleCancel ~ orderQuery:", proposalQuery)

    useEffect(() => {
        setInitialValue({
            proposalId: props?.data ? {
                value: `${props?.data?.proposal.id}`,
                label: `${props?.data?.proposal.name}`
            } : "",
            orderId: props?.data ? {
                value: `${props?.data?.order.id}`,
                label: `${props?.data?.order.name}`
            } : "",
            warehouseId: props?.data ? {
                value: `${props?.data?.warehouse.id}`,
                label: `${props?.data?.warehouse.name}`
            } : "",
            type: props?.data ? props?.data?.type === "IMPORT" ? {
                value: `${props?.data?.type}`,
                label: `Phiếu nhập kho`
            } : {
                value: `${props?.data?.type}`,
                label: `Phiếu xuất kho`
            } : "",
            note: props?.data ? `${props?.data?.note}` : "",
            name: props?.data ? `${props?.data?.name}` : ""
        })
    }, [props?.data, router]);

    useEffect(() => {
        if (proposalPagination?.page === undefined) return;
        if (proposalPagination?.page === 1) {
            setDataProposalDropdown(proposals?.data)
        } else {
            setDataProposalDropdown([...dataProposalDropdown, ...proposals?.data])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [proposalPagination])

    useEffect(() => {
        if (orderPagination?.page === undefined) return;
        if (orderPagination?.page === 1) {
            setDataOrderDropdown(orders?.data)
        } else {
            setDataOrderDropdown([...dataOrderDropdown, ...orders?.data])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderPagination])

    useEffect(() => {
        if (warehousePagination?.page === undefined) return;
        if (warehousePagination?.page === 1) {
            setDataWarehouseDropdown(warehouses?.data)
        } else {
            setDataWarehouseDropdown([...dataWarehouseDropdown, ...warehouses?.data])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [warehousePagination])

    const handleMenuScrollToBottomProposal = () => {
        setTimeout(() => {
            setPageProposal(proposalPagination?.page + 1);
        }, 1000);
    }

    const handleMenuScrollToBottomOrder = () => {
        setTimeout(() => {
            setPageOrder(orderPagination?.page + 1);
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
                                    {props.data !== undefined ? 'Edit warehousing bill' : 'Add warehousing bill'}
                                </div>
                                <div className="p-5">
                                    <Formik
                                        initialValues={initialValue}
                                        validationSchema={SubmittedForm}
                                        onSubmit={values => {
                                            handleWarehousing(values);
                                        }}
                                        enableReinitialize
                                    >

                                        {({ errors, values, setFieldValue }) => (
                                            <Form className="space-y-5" >
                                                <div className="mb-5">
                                                    <label htmlFor="name" > {t('name')}< span style={{ color: 'red' }}>* </span></label >
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
                                                        <label htmlFor="type" > {t('type')}</label >
                                                        <Select
                                                            id='type'
                                                            name='type'
                                                            options={warehousingBill?.data}
                                                            isLoading={warehousingLoading}
                                                            maxMenuHeight={160}
                                                            value={values.type}
                                                            onChange={e => {
                                                                if (e.value === "IMPORT") {
                                                                    setProposalQuery({ ...proposalQuery, type: "PURCHASE" })
                                                                } else {
                                                                    setProposalQuery({ ...proposalQuery, type: "REPAIR" })
                                                                }
                                                                setproposalStatus(false)
                                                                setFieldValue('type', e)
                                                            }}
                                                        />
                                                        {errors.type ? (
                                                            <div className="text-danger mt-1"> {`${errors.type}`} </div>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="mb-5 flex justify-between gap-4">
                                                    <div className="flex-1">
                                                        <label htmlFor="proposalId" > {t('proposal')} < span style={{ color: 'red' }}>* </span></label >
                                                        <Select
                                                            id='proposalId'
                                                            name='proposalId'
                                                            options={dataProposalDropdown}
                                                            onMenuOpen={() => setPageProposal(1)}
                                                            onMenuScrollToBottom={handleMenuScrollToBottomProposal}
                                                            isLoading={proposalLoading}
                                                            maxMenuHeight={160}
                                                            value={values.proposalId}
                                                            isDisabled={proposalStatus}
                                                            onChange={e => {
                                                                setOrderQuery({ ...orderQuery, proposalId: e.value })
                                                                setFieldValue('proposalId', e)
                                                                setFieldValue('orderId', "")
                                                            }}
                                                        />
                                                        {errors.proposalId ? (
                                                            <div className="text-danger mt-1"> {`${errors.proposalId}`} </div>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                {
                                                    orders?.data.length > 0 && proposalQuery?.type === "PURCHASE" &&
                                                    <div className="mb-5 flex justify-between gap-4">
                                                        <div className="flex-1">
                                                            <label htmlFor="orderId" > {t('order')}</label >
                                                            <Select
                                                                id='orderId'
                                                                name='orderId'
                                                                options={dataOrderDropdown}
                                                                onMenuOpen={() => setPageOrder(1)}
                                                                onMenuScrollToBottom={handleMenuScrollToBottomOrder}
                                                                isLoading={orderLoading}
                                                                maxMenuHeight={160}
                                                                value={values.orderId}
                                                                onChange={e => {
                                                                    setFieldValue('orderId', e)
                                                                }}
                                                            />
                                                            {errors.orderId ? (
                                                                <div className="text-danger mt-1"> {`${errors.orderId}`} </div>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                }
                                                <div className="mb-5 flex justify-between gap-4">
                                                    <div className="flex-1">
                                                        <label htmlFor="warehouseId" > {t('warehouse')}</label >
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
                                                    <label htmlFor="note" > {t('note')}</label >
                                                    <Field
                                                        name="note"
                                                        type="text"
                                                        id="note"
                                                        placeholder={`${t('enter_note')}`}
                                                        className="form-input"
                                                    />
                                                    {errors.note ? (
                                                        <div className="text-danger mt-1"> {`${errors.note}`} </div>
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

export default WarehousingBillModal;
