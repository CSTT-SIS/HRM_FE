import { useEffect, Fragment, useState, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

import { showMessage } from '@/@core/utils';
import { useRouter } from 'next/router';
import { IconLoading } from '@/components/Icon/IconLoading';
import IconPencil from '@/components/Icon/IconPencil';
import { setPageTitle } from '@/store/themeConfigSlice';
import Tippy from '@tippyjs/react';
import { DataTableSortStatus, DataTable } from 'mantine-datatable';
import { useDispatch } from 'react-redux';
import HandleDetailModal from '../form/HandleDetailModal';
import { WarehousingBillDetail, WarehousingBillListRequest } from '@/services/swr/warehousing-bill.twr';
import { CreateWarehousingBill, EditWarehousingBill, GetWarehousingBill, WarehousingBillFinish } from '@/services/apis/warehousing-bill.api';
import DetailPage from '../form/WarehousingBillForm';
import { Field, Form, Formik } from 'formik';
import AnimateHeight from 'react-animate-height';
import Select from 'react-select';
import * as Yup from 'yup';
import { DropdownOrder, DropdownProposals, DropdownRepair, DropdownWarehouses } from '@/services/swr/dropdown.twr';
import IconBackward from '@/components/Icon/IconBackward';
import Link from 'next/link';
import IconCaretDown from '@/components/Icon/IconCaretDown';
import IconPlus from '@/components/Icon/IconPlus';
import { GetProposalDetail } from '@/services/apis/proposal.api';
import { GetRepairDetail } from '@/services/apis/repair.api';
import { GetOrderDetail } from '@/services/apis/order.api';

interface Props {
    [key: string]: any;
}

const DetailModal = ({ ...props }: Props) => {

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const router = useRouter();

    const [data, setData] = useState<any>();
    const [dataDetail, setDataDetail] = useState<any>();
    const [listDataDetail, setListDataDetail] = useState<any>([]);
    const [openModal, setOpenModal] = useState(false);
    const [query, setQuery] = useState<any>();

    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'desc' });

    // get data
    const { data: warehousingBillDetail, pagination, mutate, isLoading } = WarehousingBillDetail({ ...query });
    useEffect(() => {
        if (Number(router.query.id)) {
            setListDataDetail(warehousingBillDetail?.data);
        }
    }, [router.query.id, warehousingBillDetail?.data]);

    useEffect(() => {
        dispatch(setPageTitle(`${t('proposal')}`));
    });

    useEffect(() => {
        if (Number(router.query.id)) {
            setQuery({ id: router.query.id, ...router.query })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.query.id]);

    const handleEdit = (data: any) => {
        setOpenModal(true);
        setDataDetail(data);
    };

    const handleSearch = (param: any) => {
        router.replace(
            {
                pathname: router.pathname,
                query: {
                    ...router.query,
                    search: param
                },
            }
        );
    }

    const handleChangePage = (page: number, pageSize: number) => {
        router.replace(
            {
                pathname: router.pathname,
                query: {
                    ...router.query,
                    page: page,
                    perPage: pageSize,
                },
            },
            undefined,
            { shallow: true },
        );
        return pageSize;
    };

    const columns = [
        {
            accessor: 'id',
            title: '#',
            render: (records: any, index: any) => <span>{index + 1}</span>,
        },
        {
            accessor: 'name',
            title: 'Tên sản phẩm',
            render: ({ product, replacementPart }: any) => <span>{product?.name || replacementPart?.name}</span>,
            sortable: false
        },
        {
            accessor: 'action',
            title: 'Thao tác',
            titleClassName: '!text-center',
            render: (records: any) => (
                <div className="flex items-center w-max mx-auto gap-2">
                    {
                        router.query.id !== "create" &&
                        <Tippy content={`${t('enter_quantity')}`}>
                            <button type="button" onClick={() => handleEdit(records)}>
                                <IconPencil />
                            </button>
                        </Tippy>
                    }
                </div>
            ),
        },
    ]

    const handleCancel = () => {
        router.push("/warehouse-process/warehousing-bill")
    };

    const handleChangeComplete = () => {
        WarehousingBillFinish({ id: router.query.id }).then(() => {
            router.push("/warehouse-process/warehousing-bill")
            showMessage(`${t('update_success')}`, 'success');
        }).catch((err) => {
            showMessage(`${err?.response?.data?.message}`, 'error');
        });
    }

    const [initialValue, setInitialValue] = useState<any>();
    const [pageProposal, setPageProposal] = useState(1);
    const [pageOder, setPageOrder] = useState(1);
    const [pageWarehouse, setPageWarehouse] = useState(1);
    const [dataProposalDropdown, setDataProposalDropdown] = useState<any>([]);
    const [dataOrderDropdown, setDataOrderDropdown] = useState<any>([]);
    const [dataWarehouseDropdown, setDataWarehouseDropdown] = useState<any>([]);
    const [active, setActive] = useState<any>([1, 2]);

    const [pageRepair, setPageRepair] = useState<any>(1);
    const [dataRepairDropdown, setDataRepairDropdown] = useState<any>([]);
    const [entity, setEntity] = useState<any>("");

    const SubmittedForm = Yup.object().shape({
        name: Yup.string().required(`${t('please_fill_name')}`),
        type: new Yup.ObjectSchema().required(`${t('please_fill_type')}`),
        // proposalId: new Yup.ObjectSchema().required(`${t('please_fill_proposal')}`),
        warehouseId: new Yup.ObjectSchema().required(`${t('please_fill_warehouse')}`),
    });

    const { data: proposals, pagination: proposalPagination, isLoading: proposalLoading } = DropdownProposals({ page: pageProposal, type: "SUPPLY" });
    const { data: orders, pagination: orderPagination, isLoading: orderLoading } = DropdownOrder({ page: pageOder, status: "RECEIVED" });
    const { data: warehouses, pagination: warehousePagination, isLoading: warehouseLoading } = DropdownWarehouses({ page: pageWarehouse });
    const { data: listRequest } = WarehousingBillListRequest({ id: router.query.proposalId });
    const { data: dropdownRepair, pagination: repairPagination, isLoading: repairLoading } = DropdownRepair({ page: pageRepair })

    useEffect(() => {
        if (router.query.proposalId) {
            setData(listRequest?.data[0]);
            getValueDetail({ type: listRequest?.data[0].entity, value: router.query.proposalId });
        }
    }, [listRequest, router.query.proposalId])

    const handleWarehousing = (param: any) => {
        const query: any = {
            warehouseId: Number(param.warehouseId.value),
            type: param.type.value,
            note: param.note,
            name: param.name
        };
        if (param.proposalId) {
            query.proposalId = Number(param.proposalId.value)
        }
        if (param.repairRequestId) {
            query.repairRequestId = Number(param.repairRequestId.value)
        }
        if (param.orderId) {
            query.orderId = Number(param.orderId.value)
        }
        if (data) {
            EditWarehousingBill({ id: router.query?.id, ...query }).then(() => {
                showMessage(`${t('edit_success')}`, 'success');
            }).catch((err) => {
                showMessage(`${err?.response?.data?.message}`, 'error');
            });
        } else {
            CreateWarehousingBill(query).then((res) => {
                showMessage(`${t('create_success')}`, 'success');
            }).catch((err) => {
                showMessage(`${err?.response?.data?.message}`, 'error');
            });
        }
    }

    useEffect(() => {
        setInitialValue({
            proposalId: data ? {
                value: `${data?.proposal?.id || data.id}`,
                label: `${data?.proposal?.name || data?.name}`
            } : "",
            repairRequestId: data ? {
                value: `${data?.repairRequest?.id || data.id}`,
                label: `${data?.repairRequest?.name || data?.name}`
            } : "",
            orderId: data ? {
                value: `${data?.order?.id || data.id}`,
                label: `${data?.order?.name || data.id}`
            } : "",
            warehouseId: data?.warehouse ? {
                value: `${data?.warehouse?.id}`,
                label: `${data?.warehouse?.name}`
            } : "",
            type: data ? data?.entity === "repairRequest" || (data?.type === "EXPORT" && data.repairRequestId !== null) ? {
                value: "EXPORT",
                label: `Phiếu xuất kho (sửa chữa)`
            } : data?.entity === "proposal" || (data?.type === "EXPORT" && data.proposalId !== null) ? {
                value: "EXPORT1",
                label: `Phiếu xuất kho (mìn)`
            } : {
                value: "IMPORT",
                label: `Phiếu nhập kho`
            } : "",
            note: data?.note ? `${data?.note}` : "",
            name: router.query.proposalId ? "" : data?.name ? `${data?.name}` : ""
        })
        setEntity(
            data?.entity === "repairRequest" || (data?.type === "EXPORT" && data.repairRequestId !== null) ?
                "repairRequest" :
                data?.entity === "proposal" || (data?.type === "EXPORT" && data.proposalId !== null) ?
                    "proposal" : ""
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const getData = () => {
        GetWarehousingBill({ id: router.query.id }).then((res) => {
            setData(res.data);
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

    const handleActive = (value: any) => {
        if (active.includes(value)) {
            setActive(active.filter((item: any) => item !== value));
        } else {
            setActive([value, ...active]);
        }
    }

    const warehousingBill: any = [
        {
            value: "IMPORT",
            label: "Phiếu nhập kho"
        },
        {
            value: "EXPORT",
            label: "Phiếu xuất kho (sửa chữa)"
        },
        {
            value: "EXPORT1",
            label: "Phiếu xuất kho (mìn)"
        }
    ];

    useEffect(() => {
        if (repairPagination?.page === undefined) return;
        if (repairPagination?.page === 1) {
            setDataRepairDropdown(dropdownRepair?.data)
        } else {
            setDataRepairDropdown([...dataRepairDropdown, ...dropdownRepair?.data])
        }
    }, [dataRepairDropdown, dropdownRepair, repairPagination]);

    const handleMenuScrollToBottomRepair = () => {
        setTimeout(() => {
            setPageRepair(repairPagination?.page + 1);
        }, 1000);
    }

    const getValueDetail = (param: any) => {
        switch (param.type) {
            case "proposal":
                GetProposalDetail({ id: param.value }).then((res) => {
                    return setListDataDetail(res.data)
                }).catch((err) => {
                    showMessage(`${err?.response?.data?.message}`, 'error');
                });
                break;
            case "repairRequest":
                GetRepairDetail({ id: param.value }).then((res) => {
                    setListDataDetail(res.data)
                }).catch((err) => {
                    showMessage(`${err?.response?.data?.message}`, 'error');
                });
                break;
            default:
                GetOrderDetail({ id: param.value }).then((res) => {
                    return setListDataDetail(res.data);
                }).catch((err) => {
                    showMessage(`${err?.response?.data?.message}`, 'error');
                });
                break;
        }

    }

    return (
        <>
            <div>
                {isLoading && (
                    <div className="screen_loader fixed inset-0 bg-[#fafafa] dark:bg-[#060818] z-[60] grid place-content-center animate__animated">
                        <IconLoading />
                    </div>
                )}
                <div className='flex justify-between header-page-bottom pb-4 mb-4'>
                    <h1 className='page-title'>{t('warehousing_bill')}</h1>
                    <Link href="/warehouse-process/warehousing-bill">
                        <div className="btn btn-primary btn-sm m-1 back-button h-9" >
                            <IconBackward />
                            <span>
                                {t('back')}
                            </span>
                        </div>
                    </Link>
                </div>
                <div className="mb-5">
                    <Formik
                        initialValues={initialValue}
                        validationSchema={SubmittedForm}
                        onSubmit={values => {
                            handleWarehousing(values);
                        }}
                        enableReinitialize
                    >

                        {({ errors, values, submitCount, setFieldValue }) => (
                            <Form className="space-y-5" >
                                <div className="font-semibold">
                                    <div className="rounded">
                                        <button
                                            type="button"
                                            className={`flex w-full items-center p-4 text-white-dark dark:bg-[#1b2e4b] custom-accordion uppercase`}
                                            onClick={() => handleActive(1)}
                                        >
                                            {t('warehousing_bill_info')}
                                            <div className={`ltr:ml-auto rtl:mr-auto ${active.includes(1) ? 'rotate-180' : ''}`}>
                                                <IconCaretDown />
                                            </div>
                                        </button>
                                        <div className={`mb-2 ${active.includes(1) ? 'custom-content-accordion' : ''}`}>
                                            <AnimateHeight duration={300} height={active.includes(1) ? 'auto' : 0}>
                                                <div className='p-4'>
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
                                                    <div className='flex justify-between gap-5 mt-5 mb-5'>
                                                        <div className="w-1/2">
                                                            <label htmlFor="type" className='label'> < span style={{ color: 'red' }}>* </span>{t('type')}</label >
                                                            <Select
                                                                id='type'
                                                                name='type'
                                                                options={warehousingBill}
                                                                maxMenuHeight={160}
                                                                value={values?.type}
                                                                onChange={e => {
                                                                    if (e.value === "EXPORT") {
                                                                        setEntity("repairRequest");
                                                                    } else if (e.value === "EXPORT1") {
                                                                        setEntity("proposal");
                                                                    } else {
                                                                        setEntity("");
                                                                    }
                                                                    setFieldValue('type', e)
                                                                }}
                                                            />
                                                            {errors.type ? (
                                                                <div className="text-danger mt-1"> {`${errors.type}`} </div>
                                                            ) : null}
                                                        </div>
                                                        {
                                                            entity === "repairRequest" ?
                                                                <div className="w-1/2">
                                                                    <label htmlFor="repairRequestId" className='label'> {t('repair_request')} < span style={{ color: 'red' }}>* </span></label >
                                                                    <Select
                                                                        id='repairRequestId'
                                                                        name='repairRequestId'
                                                                        options={dataRepairDropdown}
                                                                        onMenuOpen={() => setPageRepair(1)}
                                                                        onMenuScrollToBottom={handleMenuScrollToBottomRepair}
                                                                        isLoading={repairLoading}
                                                                        maxMenuHeight={160}
                                                                        value={values?.repairRequestId}
                                                                        onChange={e => {
                                                                            setFieldValue('repairRequestId', e);
                                                                            getValueDetail({ value: e?.value, type: "repairRequest" });
                                                                        }}
                                                                    />
                                                                    {errors.repairRequestId ? (
                                                                        <div className="text-danger mt-1"> {`${errors.repairRequestId}`} </div>
                                                                    ) : null}
                                                                </div> :
                                                                entity === "proposal" ?
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
                                                                            onChange={e => {
                                                                                setFieldValue('proposalId', e)
                                                                                getValueDetail({ value: e?.value, type: "proposal" });
                                                                            }}
                                                                        />
                                                                        {errors.proposalId ? (
                                                                            <div className="text-danger mt-1"> {`${errors.proposalId}`} </div>
                                                                        ) : null}
                                                                    </div> :
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
                                                                            value={values?.orderId}
                                                                            onChange={e => {
                                                                                setFieldValue('orderId', e)
                                                                                getValueDetail({ value: e?.value, type: "order" });
                                                                            }}
                                                                        />
                                                                        {errors.orderId ? (
                                                                            <div className="text-danger mt-1"> {`${errors.orderId}`} </div>
                                                                        ) : null}
                                                                    </div>
                                                        }
                                                    </div>
                                                    <div className="mb-5 flex justify-between gap-4">
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
                                                </div>
                                            </AnimateHeight>
                                        </div>
                                    </div>
                                    <div className="rounded">
                                        <button
                                            type="button"
                                            className={`flex w-full items-center p-4 text-white-dark dark:bg-[#1b2e4b] custom-accordion uppercase`}
                                            onClick={() => handleActive(2)}
                                        >
                                            {t('warehousing_detail')}
                                            <div className={`ltr:ml-auto rtl:mr-auto ${active.includes(2) ? 'rotate-180' : ''}`}>
                                                <IconCaretDown />
                                            </div>
                                        </button>
                                        <div className={`${active.includes(2) ? 'custom-content-accordion' : ''}`}>
                                            <AnimateHeight duration={300} height={active.includes(2) ? 'auto' : 0}>
                                                <div className='p-4'>
                                                    <div className="flex md:items-center justify-between md:flex-row flex-col mb-4.5 gap-5">
                                                    </div>
                                                    <div className="datatables">
                                                        <DataTable
                                                            highlightOnHover
                                                            className="whitespace-nowrap table-hover"
                                                            records={listDataDetail}
                                                            columns={columns}
                                                            sortStatus={sortStatus}
                                                            onSortStatusChange={setSortStatus}
                                                            minHeight={200}
                                                        />
                                                    </div>
                                                </div>
                                                <HandleDetailModal
                                                    openModal={openModal}
                                                    setOpenModal={setOpenModal}
                                                    dataDetail={dataDetail}
                                                    orderDetailMutate={mutate}
                                                />
                                            </AnimateHeight>
                                        </div>
                                    </div>
                                    <div className="mt-8 flex items-center justify-end ltr:text-right rtl:text-left">
                                        <button type="button" className="btn btn-outline-danger cancel-button" onClick={() => handleCancel()}>
                                            {t('cancel')}
                                        </button>
                                        <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4 add-button">
                                            {router.query.id !== "create" ? t('update') : t('add')}
                                        </button>
                                        <button type="button" onClick={e => handleChangeComplete()} className="btn btn-primary ltr:ml-4 rtl:mr-4 add-button">
                                            {router.query.id !== "create" && t('complete')}
                                        </button>
                                    </div>
                                </div>
                            </Form>
                        )
                        }
                    </Formik >
                </div >
            </div >
        </>
    );
};
export default DetailModal;
