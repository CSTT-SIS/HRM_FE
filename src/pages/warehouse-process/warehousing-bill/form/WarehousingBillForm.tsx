import { useEffect, Fragment, useState, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog, Transition } from '@headlessui/react';

import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import { showMessage } from '@/@core/utils';
import IconX from '@/components/Icon/IconX';
import { useRouter } from 'next/router';
import Select, { components } from 'react-select';
import { DropdownOrder, DropdownProposals, DropdownWarehouses, DropdownWarehousingType } from '@/services/swr/dropdown.twr';
import { CreateWarehousingBill, EditWarehousingBill, GetWarehousingBill } from '@/services/apis/warehousing-bill.api';
import Link from 'next/link';
import IconBackward from '@/components/Icon/IconBackward';
import IconBack from '@/components/Icon/IconBack';

interface Props {
    [key: string]: any;
}

const DetailPage = ({ ...props }: Props) => {

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
    const [data, setData] = useState<any>();

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
            warehouseId: Number(param.warehouseId.value),
            type: param.type.value,
            note: param.note,
            name: param.name
        };
        if (data) {
            EditWarehousingBill({ id: router.query?.id, ...query }).then(() => {
                props.mutate();
                showMessage(`${t('edit_success')}`, 'success');
            }).catch((err) => {
                showMessage(`${err?.response?.data?.message}`, 'error');
            });
        } else {
            CreateWarehousingBill(query).then((res) => {
                showMessage(`${t('create_success')}`, 'success');
                props.mutate();
                router.push({
                    pathname: `/warehouse-process/warehousing-bill/${res.data.id}`,
                    query: {
                        status: res.data.status
                    }
                })
            }).catch((err) => {
                showMessage(`${err?.response?.data?.message}`, 'error');
            });
        }
    }

    const handleCancel = () => {
        setProposalQuery({ ...proposalQuery, type: "" });
        router.push("/warehouse-process/warehousing-bill");
    };

    useEffect(() => {
        setInitialValue({
            proposalId: data ? {
                value: `${data?.proposal.id}`,
                label: `${data?.proposal.name}`
            } : "",
            orderId: data ? {
                value: `${data?.order?.id}`,
                label: `${data?.order?.name}`
            } : "",
            warehouseId: data ? {
                value: `${data?.warehouse.id}`,
                label: `${data?.warehouse.name}`
            } : "",
            type: data ? data?.type === "IMPORT" ? {
                value: `${data?.type}`,
                label: `Phiếu nhập kho`
            } : {
                value: `${data?.type}`,
                label: `Phiếu xuất kho`
            } : "",
            note: data ? `${data?.note}` : "",
            name: data ? `${data?.name}` : ""
        })
    }, [data]);

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
    }, [warehousePagination]);

    useEffect(() => {
        if (Number(router.query.id)) {
            getData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.query.id]);

    useEffect(() => {
        if (data?.type === "IMPORT") {
            setProposalQuery({ ...proposalQuery, type: "PURCHASE" })
        } else {
            setProposalQuery({ ...proposalQuery, type: "REPAIR" })
        }
        setproposalStatus(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    const getData = () => {
        GetWarehousingBill({ id: router.query.id }).then((res) => {
            setData(res.data);
            router.push({
                pathname: `/warehouse-process/warehousing-bill/${res.data.id}`,
                query: {
                    status: res.data.status
                }
            })
        }).catch((err) => {
            showMessage(`${err?.response?.data?.message}`, 'error');
        });
    }

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
        <div className="p-5">
            <div className='flex justify-between header-page-bottom pb-4 mb-4'>
                <h1 className='page-title'>{t('warehousing_bill')}</h1>
                <Link href="/warehouse-process/warehousing-bill">
                    <div className="btn btn-primary btn-sm m-1 back-button h-9" >
                        <IconBack />
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
                    handleWarehousing(values);
                }}
                enableReinitialize
            >

                {({ errors, values, setFieldValue }) => (
                    <Form className="space-y-5" >
                        <div className='flex justify-between gap-5'>
                            <div className="w-1/2">
                                <label htmlFor="name" className='label'> {t('name')}< span style={{ color: 'red' }}>* </span></label >
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
                            <div className="w-1/2">
                                <label htmlFor="type" className='label'> < span style={{ color: 'red' }}>* </span>{t('type')}</label >
                                <Select
                                    id='type'
                                    name='type'
                                    options={warehousingBill?.data}
                                    isLoading={warehousingLoading}
                                    maxMenuHeight={160}
                                    value={values?.type}
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
                        <div className='flex justify-between gap-5'>
                            <div className="w-1/2">
                                <label htmlFor="proposalId" className='label'> {t('proposal')} < span style={{ color: 'red' }}>* </span></label >
                                <Select
                                    id='proposalId'
                                    name='proposalId'
                                    options={dataProposalDropdown}
                                    onMenuOpen={() => setPageProposal(1)}
                                    onMenuScrollToBottom={handleMenuScrollToBottomProposal}
                                    isLoading={proposalLoading}
                                    maxMenuHeight={160}
                                    value={values?.proposalId}
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
                            <div className="w-1/2">
                                <label htmlFor="warehouseId" className='label'>< span style={{ color: 'red' }}>* </span> {t('warehouse')}</label >
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
                        <div className="mb-5 flex justify-between gap-4">
                            {
                                proposalQuery?.type === "PURCHASE" &&
                                <div className="w-1/2">
                                    <label htmlFor="orderId" className='label'> {t('order')}</label >
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
                            }
                            <div className="w-1/2">
                                <label htmlFor="note" className='label'> {t('notes')}</label >
                                <Field
                                    name="note"
                                    as="textarea"
                                    id="note"
                                    placeholder={`${t('enter_note')}`}
                                    className="form-input"
                                />
                                {errors.note ? (
                                    <div className="text-danger mt-1"> {`${errors.note}`} </div>
                                ) : null}
                            </div>
                        </div>


                        <div className="mt-8 flex items-center justify-end ltr:text-right rtl:text-left">
                            <button type="button" className="btn btn-outline-danger cancel-buttom" onClick={() => handleCancel()}>
                                {t('cancel')}
                            </button>
                            <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4 add-button">
                                {data !== undefined ? t('update') : t('add')}
                            </button>
                        </div>

                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default DetailPage;
