import { useEffect, Fragment, useState, SetStateAction, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { showMessage } from '@/@core/utils';
import { useRouter } from 'next/router';
import { IconLoading } from '@/components/Icon/IconLoading';
import IconPencil from '@/components/Icon/IconPencil';
import { setPageTitle } from '@/store/themeConfigSlice';
import { DataTableSortStatus, DataTable } from 'mantine-datatable';
import { useDispatch } from 'react-redux';
import { WarehousingBillDetail, WarehousingBillListRequest } from '@/services/swr/warehousing-bill.twr';
import { CreateWarehousingBill, EditWarehousingBill, GetWarehousingBill, WarehousingBillAddDetails, WarehousingBillFinish } from '@/services/apis/warehousing-bill.api';
import { Field, Form, Formik } from 'formik';
import AnimateHeight from 'react-animate-height';
import Select from 'react-select';
import * as Yup from 'yup';
import { DropdownOrder, DropdownWarehouses } from '@/services/swr/dropdown.twr';
import IconBackward from '@/components/Icon/IconBackward';
import Link from 'next/link';
import IconCaretDown from '@/components/Icon/IconCaretDown';
import { GetOrder, GetOrderDetail } from '@/services/apis/order.api';
import moment from 'moment';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import IconTrashLines from '@/components/Icon/IconTrashLines';
import Swal from 'sweetalert2';
import DetailModal from '../form/DetailModal';
import IconPlus from '@/components/Icon/IconPlus';

interface Props {
    [key: string]: any;
}

const ExportPage = ({ ...props }: Props) => {

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const router = useRouter();

    const [disable, setDisable] = useState<any>(false);
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

    const handleDelete = ({ id, product }: any) => {
        if (Number(router.query.id)) {
            const swalDeletes = Swal.mixin({
                customClass: {
                    confirmButton: 'btn btn-secondary',
                    cancelButton: 'btn btn-danger ltr:mr-3 rtl:ml-3',
                    popup: 'confirm-delete',
                },
                imageUrl: '/assets/images/delete_popup.png',
                buttonsStyling: false,
            });
            swalDeletes
                .fire({
                    icon: 'question',
                    title: `${t('delete_product')}`,
                    text: `${t('delete')} ${product?.name}`,
                    padding: '2em',
                    showCancelButton: true,
                    cancelButtonText: `${t('cancel')}`,
                    confirmButtonText: `${t('confirm')}`,
                    reverseButtons: true,
                })
                .then((result) => {
                    if (result.value) {
                        // DeleteOrderDetail({ id: router.query.id, itemId: id }).then(() => {
                        //     mutate();
                        //     showMessage(`${t('delete_product_success')}`, 'success');
                        // }).catch((err) => {
                        //     showMessage(`${err?.response?.data?.message}`, 'error');
                        // });
                    }
                });
        } else {
            setListDataDetail(listDataDetail.filter((item: any) => item.id !== id))
        }
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
        { accessor: 'proposalQuantity', title: 'số lượng', sortable: false },
        { accessor: 'note', title: 'Ghi chú', sortable: false },
        {
            accessor: 'action',
            title: 'Thao tác',
            titleClassName: '!text-center',
            render: (records: any) => (
                <div className="flex items-center w-max mx-auto gap-2">
                    {
                        router.query.type === "PENDING" && disable &&
                        <button className='bg-[#C5E7AF] flex justify-between gap-1 p-1 rounded' type="button" onClick={() => handleEdit(records)}>
                            <IconPencil /> <span>{`${t('enter_quantity')}`}</span>
                        </button>
                    }
                    {
                        !disable &&
                        <>
                            <button className='bg-[#9CD3EB] flex justify-between gap-1 p-1 rounded' type="button" onClick={() => handleEdit(records)}>
                                <IconPencil /> <span>{`${t('edit')}`}</span>
                            </button>
                            <button className='bg-[#E43940] flex justify-between gap-1 p-1 rounded text-[#F5F5F5]' type="button" onClick={() => handleDelete(records)}>
                                <IconTrashLines />  <span>{`${t('delete')}`}</span>
                            </button>
                        </>
                    }
                </div>
            ),
        },
    ]
    const handleCancel = () => {
        router.push("/warehouse-process/warehousing-bill/import")
    };

    const handleChangeComplete = () => {
        WarehousingBillFinish({ id: router.query.id }).then(() => {
            router.push("/warehouse-process/warehousing-bill/import")
            showMessage(`${t('update_success')}`, 'success');
        }).catch((err) => {
            showMessage(`${err?.response?.data?.message}`, 'error');
        });
    }

    const [initialValue, setInitialValue] = useState<any>();
    const [pageOder, setPageOrder] = useState(1);
    const [pageWarehouse, setPageWarehouse] = useState(1);
    const [dataOrderDropdown, setDataOrderDropdown] = useState<any>([]);
    const [dataWarehouseDropdown, setDataWarehouseDropdown] = useState<any>([]);
    const [active, setActive] = useState<any>([1, 2]);
    const formRef = useRef<any>();

    const SubmittedForm = Yup.object().shape({
        // name: Yup.string().required(`${t('please_fill_name')}`),
        // type: new Yup.ObjectSchema().required(`${t('please_fill_type')}`),
        // proposalId: new Yup.ObjectSchema().required(`${t('please_fill_proposal')}`),
        warehouseId: new Yup.ObjectSchema().required(`${t('please_fill_warehouse')}`),
    });

    const { data: orders, pagination: orderPagination, isLoading: orderLoading } = DropdownOrder({ page: pageOder });
    const { data: warehouses, pagination: warehousePagination, isLoading: warehouseLoading } = DropdownWarehouses({ page: pageWarehouse });
    const { data: listRequest } = WarehousingBillListRequest({ id: router.query.proposalId });

    useEffect(() => {
        if (router.query.proposalId) {
            setData(listRequest?.data[0]);
            getValueDetail({ type: listRequest?.data[0].entity, value: router.query.proposalId });
        }
    }, [listRequest, router.query.proposalId])

    const handleWarehousing = (param: any) => {
        const query: any = {
            warehouseId: Number(param.warehouseId.value),
            type: "IMPORT",
            note: param.note,
            // name: param.name
        };

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
                handleDetail(res.data.id)
            }).catch((err) => {
                showMessage(`${err?.response?.data?.message}`, 'error');
            });
        }
        handleCancel();
    }
    const handleDetail = (id: any) => {
        WarehousingBillAddDetails({ id: id, details: listDataDetail }).then(() => {
            // handleChangeComplete({ id: id });
            handleCancel();
        }).catch((err) => {
            showMessage(`${err?.response?.data?.message}`, 'error');
        });
    }

    useEffect(() => {
        setInitialValue({
            orderId: data ? {
                value: `${data?.order?.id || data.id}`,
                label: `${data?.order?.name || data.name}`
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

    const getValueDetail = (param: any) => {
        GetOrderDetail({ id: param.value }).then((res) => {
            setListDataDetail(res.data);
        }).catch((err) => {
            showMessage(`${err?.response?.data?.message}`, 'error');
        });
        GetOrder({ id: param.value }).then((res) => {
            param.setFieldValue("createdBy", res.data.createdBy.fullName)
        }).catch((err) => {
            showMessage(`${err?.response?.data?.message}`, 'error');
        });
    }

    const handleSubmit = () => {
        if (formRef.current) {
            formRef.current.handleSubmit()
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
                    <h1 className='page-title'>{t('warehousing_bill_import_text')}</h1>
                    <Link href="/warehouse-process/warehousing-bill/import">
                        <div className="btn btn-primary btn-sm m-1 back-button h-9" >
                            <IconBackward />
                            <span>
                                {t('back')}
                            </span>
                        </div>
                    </Link>
                </div>
                <div className="mb-5">
                    <div className="font-semibold">
                        <div className="rounded">
                            <button
                                type="button"
                                className={`flex w-full items-center p-4 text-white-dark dark:bg-[#1b2e4b] custom-accordion uppercase`}
                                onClick={() => handleActive(1)}
                            >
                                {t('warehousing_bill_import_info')}
                                <div className={`ltr:ml-auto rtl:mr-auto ${active.includes(1) ? 'rotate-180' : ''}`}>
                                    <IconCaretDown />
                                </div>
                            </button>
                            <div className={`mb-2 ${active.includes(1) ? 'custom-content-accordion' : ''}`}>
                                <AnimateHeight duration={300} height={active.includes(1) ? 'auto' : 0}>
                                    <Formik
                                        initialValues={initialValue}
                                        validationSchema={SubmittedForm}
                                        onSubmit={values => {
                                            handleWarehousing(values);
                                        }}
                                        enableReinitialize
                                        innerRef={formRef}
                                    >

                                        {({ errors, values, submitCount, setFieldValue }) => (
                                            <Form className="space-y-5" >
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
                                                                    getValueDetail({ value: e?.value, setFieldValue });
                                                                }}
                                                                isDisabled={disable}
                                                            />
                                                            {submitCount && errors.orderId ? (
                                                                <div className="text-danger mt-1"> {`${errors.orderId}`} </div>
                                                            ) : null}
                                                        </div>
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
                                            </Form>
                                        )}
                                    </Formik >
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
                                            <div className="flex items-center flex-wrap">
                                                {
                                                    !disable &&
                                                    <button type="button" onClick={(e) => setOpenModal(true)} className="btn btn-primary btn-sm m-1 custom-button" >
                                                        <IconPlus className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                                        {t('add_product_list')}
                                                    </button>
                                                }
                                            </div>

                                            {/* <input type="text" className="form-input w-auto" placeholder={`${t('search')}`} onChange={(e) => handleSearch(e.target.value)} /> */}
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
                                    <DetailModal
                                        openModal={openModal}
                                        setOpenModal={setOpenModal}
                                        data={dataDetail}
                                        setData={setDataDetail}
                                        orderDetailMutate={mutate}
                                        listData={listDataDetail}
                                        setListData={setListDataDetail}
                                    />
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
                                    <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4 add-button" onClick={() => handleSubmit()}>
                                        {router.query.id !== "create" ? t('update') : t('save')}
                                    </button>
                                </>
                            }
                            {
                                router.query.type === "PENDING" &&
                                <button type="button" onClick={e => handleChangeComplete()} className="btn btn-primary ltr:ml-4 rtl:mr-4 add-button">
                                    {t('complete')}
                                </button>
                            }
                        </div>
                    </div>

                </div >
            </div >
        </>
    );
};
export default ExportPage;
