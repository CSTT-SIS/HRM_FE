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
import { WarehousingBillDetail, WarehousingBillListRequest } from '@/services/swr/warehousing-bill.twr';
import { CreateWarehousingBill, EditWarehousingBill, GetWarehousingBill, WarehousingBillFinish } from '@/services/apis/warehousing-bill.api';
import { Field, Form, Formik } from 'formik';
import AnimateHeight from 'react-animate-height';
import Select from 'react-select';
import * as Yup from 'yup';
import { DropdownOrder, DropdownProposals, DropdownRepair, DropdownWarehouses } from '@/services/swr/dropdown.twr';
import IconBackward from '@/components/Icon/IconBackward';
import Link from 'next/link';
import IconCaretDown from '@/components/Icon/IconCaretDown';
import { GetProposal, GetProposalDetail } from '@/services/apis/proposal.api';
import { GetRepair, GetRepairDetail } from '@/services/apis/repair.api';
import { GetOrder, GetOrderDetail } from '@/services/apis/order.api';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import moment from 'moment';
import HandleDetailForm from '../form/HandleDetailForm';

interface Props {
    [key: string]: any;
}

const DetailModal = ({ ...props }: Props) => {

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const router = useRouter();

    const [disable, setDisable] = useState<any>(false);
    const [data, setData] = useState<any>();
    const [dataDetail, setDataDetail] = useState<any>();
    const [listDataDetail, setListDataDetail] = useState<any>([]);
    const [openModal, setOpenModal] = useState(false);
    const [query, setQuery] = useState<any>();
    const [createBy, setCreateBy] = useState<any>();

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
        setDisable(router.query.status === "true" ? true : false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.query]);

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
            render: ({ product }: any) => <span>{product?.name}</span>,
            sortable: false
        },
        { accessor: 'quantity', title: 'số lượng', sortable: false },
        { accessor: 'note', title: 'Ghi chú', sortable: false },
        {
            accessor: 'action',
            title: 'Thao tác',
            titleClassName: '!text-center',
            render: (records: any) => (
                <div className="flex items-center w-max mx-auto gap-2">
                    {
                        router.query.id !== "create" && !disable &&
                        <button className='bg-[#C5E7AF] flex justify-between gap-1 p-1 rounded' type="button" onClick={() => handleEdit(records)}>
                            <IconPencil /> <span>{`${t('enter_quantity')}`}</span>
                        </button>
                    }
                </div>
            ),
        },
    ]
    const handleCancel = () => {
        router.push("/warehouse-process/warehousing-bill/export")
    };

    const handleChangeComplete = () => {
        WarehousingBillFinish({ id: router.query.id }).then(() => {
            router.push("/warehouse-process/warehousing-bill/export")
            showMessage(`${t('update_success')}`, 'success');
        }).catch((err) => {
            showMessage(`${err?.response?.data?.message}`, 'error');
        });
    }

    const [initialValue, setInitialValue] = useState<any>();
    const [pageProposal, setPageProposal] = useState(1);
    const [pageWarehouse, setPageWarehouse] = useState(1);
    const [dataProposalDropdown, setDataProposalDropdown] = useState<any>([]);
    const [dataWarehouseDropdown, setDataWarehouseDropdown] = useState<any>([]);
    const [active, setActive] = useState<any>([1, 2]);

    const [pageRepair, setPageRepair] = useState<any>(1);
    const [dataRepairDropdown, setDataRepairDropdown] = useState<any>([]);
    const [entity, setEntity] = useState<any>("");

    const SubmittedForm = Yup.object().shape({
        // name: Yup.string().required(`${t('please_fill_name')}`),
        type: new Yup.ObjectSchema().required(`${t('please_fill_type')}`),
        // proposalId: new Yup.ObjectSchema().required(`${t('please_fill_proposal')}`),
        warehouseId: new Yup.ObjectSchema().required(`${t('please_fill_warehouse')}`),
    });

    const { data: proposals, pagination: proposalPagination, isLoading: proposalLoading } = DropdownProposals({ page: pageProposal, type: "SUPPLY" });
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
            // name: param.name
        };
        if (param.proposalId) {
            query.proposalId = Number(param.proposalId.value)
        }
        if (param.repairRequestId) {
            query.repairRequestId = Number(param.repairRequestId.value)
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
            warehouseId: data?.warehouse ? {
                value: `${data?.warehouse?.id}`,
                label: `${data?.warehouse?.name}`
            } : "",
            note: data?.note ? `${data?.note}` : "",
            name: router.query.proposalId ? "" : data?.name ? `${data?.name}` : "",
            createdBy: data?.createdBy ? data?.createdBy.fullName + " " + (data.department || "") : "",
            personRequest: JSON.parse(localStorage.getItem('profile') || "").fullName
        })
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
                GetProposal({ id: param.value }).then((res) => {
                    setListDataDetail(res.data.details);
                    param.setFieldValue("createdBy", res.data.createdBy.fullName)
                }).catch((err) => {
                    showMessage(`${err?.response?.data?.message}`, 'error');
                });
                break;
            case "repairRequest":
                GetRepair({ id: param.value }).then((res) => {
                    setListDataDetail(res.data.details);
                    param.setFieldValue("createdBy", res.data.createdBy.fullName)
                }).catch((err) => {
                    showMessage(`${err?.response?.data?.message}`, 'error');
                });
                break;
            default:
                GetOrder({ id: param.value }).then((res) => {
                    setListDataDetail(res.data.details);
                    param.setFieldValue("createdBy", res.data.createdBy.fullName)
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
                    <h1 className='page-title'>{t('warehousing_bill_export_text')}</h1>
                    <Link href="/warehouse-process/warehousing-bill/export">
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
                                            {t('warehousing_bill_export_info')}
                                            <div className={`ltr:ml-auto rtl:mr-auto ${active.includes(1) ? 'rotate-180' : ''}`}>
                                                <IconCaretDown />
                                            </div>
                                        </button>
                                        <div className={`mb-2 ${active.includes(1) ? 'custom-content-accordion' : ''}`}>
                                            <AnimateHeight duration={300} height={active.includes(1) ? 'auto' : 0}>
                                                <div className='p-4'>
                                                    <div className='flex justify-between gap-5 mt-5 mb-5'>
                                                        <div className="w-1/2">
                                                            <label htmlFor="personRequest" className='label'> {t('person_request')} < span style={{ color: 'red' }}>* </span></label >
                                                            <Field
                                                                name="personRequest"
                                                                type="text"
                                                                id="personRequest"
                                                                placeholder={`${t('enter_code')}`}
                                                                className={true ? "form-input bg-[#f2f2f2]" : "form-input"}
                                                                disabled={true}
                                                            />
                                                            {submitCount && errors.personRequest ? (
                                                                <div className="text-danger mt-1"> {`${errors.personRequest}`} </div>
                                                            ) : null}
                                                        </div>
                                                        <div className="w-1/2">
                                                            <label htmlFor="timeRequest" className='label'> {t('time_request')} < span style={{ color: 'red' }}>* </span></label >
                                                            <Field
                                                                name="timeRequest"
                                                                render={({ field }: any) => (
                                                                    <Flatpickr
                                                                        data-enable-time
                                                                        placeholder={`${t('choose_break_end_time')}`}
                                                                        options={{
                                                                            enableTime: true,
                                                                            dateFormat: 'Y-m-d H:i'
                                                                        }}
                                                                        value={moment().format("DD/MM/YYYY hh:mm")}
                                                                        onChange={e => setFieldValue("estimatedDeliveryDate", moment(e[0]).format("YYYY-MM-DD hh:mm"))}
                                                                        className={true ? "form-input bg-[#f2f2f2]" : "form-input"}
                                                                        disabled={true}
                                                                    />
                                                                )}
                                                            />
                                                            {submitCount && errors.estimatedDeliveryDate ? (
                                                                <div className="text-danger mt-1"> {`${errors.estimatedDeliveryDate}`} </div>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                    <div className='flex justify-between gap-5 mt-5'>
                                                        {/* <div className="w-1/2">
                                                            <label htmlFor="type" className='label'> < span style={{ color: 'red' }}>* </span>{t('type_proposal')}</label >
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
                                                                isDisabled={disable}
                                                            />
                                                            {submitCount && errors.type ? (
                                                                <div className="text-danger mt-1"> {`${errors.type}`} </div>
                                                            ) : null}
                                                        </div> */}
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
                                                                isDisabled={disable}
                                                            />
                                                            {submitCount && errors.warehouseId ? (
                                                                <div className="text-danger mt-1"> {`${errors.warehouseId}`} </div>
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
                                                                            getValueDetail({ value: e?.value, type: "repairRequest", setFieldValue });
                                                                        }}
                                                                        isDisabled={disable}
                                                                    />
                                                                    {submitCount && errors.repairRequestId ? (
                                                                        <div className="text-danger mt-1"> {`${errors.repairRequestId}`} </div>
                                                                    ) : null}
                                                                </div> :
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
                                                                            getValueDetail({ value: e?.value, type: "proposal", setFieldValue });
                                                                        }}
                                                                        isDisabled={disable}
                                                                    />
                                                                    {submitCount && errors.proposalId ? (
                                                                        <div className="text-danger mt-1"> {`${errors.proposalId}`} </div>
                                                                    ) : null}
                                                                </div>
                                                        }
                                                    </div>
                                                    <div className='flex justify-between gap-5 mt-5 mb-5'>
                                                        <div className="w-1/2">
                                                            <label htmlFor="createdBy" className='label'>< span style={{ color: 'red' }}>* </span> {t('proposal_by')}</label >
                                                            <Field
                                                                name="createdBy"
                                                                id="createdBy"
                                                                type="text"
                                                                className={true ? "form-input bg-[#f2f2f2] text-[#797979]" : "form-input"}
                                                                disabled={true}
                                                            />
                                                            {submitCount && errors.createdBy ? (
                                                                <div className="text-danger mt-1"> {`${errors.createdBy}`} </div>
                                                            ) : null}
                                                        </div>
                                                        <div className='w-1/2'></div>
                                                    </div>
                                                    <div className="mt-5">
                                                        <label htmlFor="note" className='label'> {t('notes')}</label >
                                                        <Field
                                                            name="note"
                                                            as="textarea"
                                                            id="note"
                                                            placeholder={`${t('enter_note')}`}
                                                            className={disable ? "form-input bg-[#f2f2f2]" : "form-input"}
                                                            disabled={disable}
                                                        />
                                                        {submitCount && errors.note ? (
                                                            <div className="text-danger mt-1"> {`${errors.note}`} </div>
                                                        ) : null}
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
                                                    <HandleDetailForm
                                                        data={dataDetail}
                                                        setData={setDataDetail}
                                                        listData={listDataDetail}
                                                        setListData={setListDataDetail}
                                                        orderDetailMutate={mutate}
                                                    />
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
                                            </AnimateHeight>
                                        </div>
                                    </div>
                                    <div className="mt-8 flex items-center justify-end ltr:text-right rtl:text-left">
                                        {
                                            !disable &&
                                            <>
                                                <button type="button" className="btn btn-outline-danger cancel-button" onClick={() => handleCancel()}>
                                                    {t('cancel')}
                                                </button>
                                                <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4 add-button">
                                                    {router.query.id !== "create" ? t('update') : t('add')}
                                                </button>
                                            </>
                                        }
                                        {
                                            router.query.id !== "create" && !disable &&
                                            <button type="button" onClick={e => handleChangeComplete()} className="btn btn-primary ltr:ml-4 rtl:mr-4 add-button">
                                                {t('complete')}
                                            </button>
                                        }
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
