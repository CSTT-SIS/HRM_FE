import { useEffect, Fragment, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
// Third party libs
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import Swal from 'sweetalert2';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useTranslation } from 'react-i18next';
// API
import { Orders } from '@/services/swr/order.twr';
import { DeleteOrder, OrderCancel, OrderReceive, OrderShipping } from '@/services/apis/order.api';
// constants
import { PAGE_SIZES } from '@/utils/constants';
// helper
import { showMessage } from '@/@core/utils';
// icons
import { IconLoading } from '@/components/Icon/IconLoading';
import IconPlus from '@/components/Icon/IconPlus';
import IconPencil from '@/components/Icon/IconPencil';
import IconTrashLines from '@/components/Icon/IconTrashLines';
import IconXCircle from '@/components/Icon/IconXCircle';
import { IconCartCheck } from '@/components/Icon/IconCartCheck';
import { IconShipping } from '@/components/Icon/IconShipping';
import moment from 'moment';
import IconEye from '@/components/Icon/IconEye';
import { IconFilter } from '@/components/Icon/IconFilter';
import IconNewTrash from '@/components/Icon/IconNewTrash';
import IconNewEdit from '@/components/Icon/IconNewEdit';
import IconNewEye from '@/components/Icon/IconNewEye';
import Link from 'next/link';
import IconNewPlus from '@/components/Icon/IconNewPlus';
import { DropdownWarehouses } from '@/services/swr/dropdown.twr';

interface Props {
    [key: string]: any;
}

const OrderForm = ({ ...props }: Props) => {

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const router = useRouter();
    const [active, setActive] = useState<any>([1]);

    const [showLoader, setShowLoader] = useState(true);

    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'desc' });


    // get data
    const { data: orders, pagination, mutate } = Orders({ ...router.query, warehouseId: active.includes(0) ? "" : active, sortBy: "id.DESC" });
    const { data: warehouses, pagination: warehousePagination, isLoading: warehouseLoading } = DropdownWarehouses({});
    useEffect(() => {
        dispatch(setPageTitle(`${t('Order')}`));
    });

    useEffect(() => {
        setShowLoader(false);
    }, [orders])

    const handleDelete = ({ id, name }: any) => {
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
                title: `${t('delete_order')}`,
                text: `${t('delete')} ${name}`,
                padding: '2em',
                showCancelButton: true,
                cancelButtonText: `${t('cancel')}`,
                confirmButtonText: `${t('confirm')}`,
                reverseButtons: true,
            })
            .then((result) => {
                if (result.value) {
                    DeleteOrder({ id }).then(() => {
                        mutate();
                        showMessage(`${t('delete_success')}`, 'success');
                    }).catch((err) => {
                        showMessage(`${err?.response?.data?.message}`, 'error');
                    });
                }
            });
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

    const handleDetail = (value: any) => {
        router.push(`/warehouse-process/order/${value.id}?status=${value.status}`)
    }

    const handleShipping = ({ id }: any) => {
        OrderShipping({ id }).then(() => {
            mutate();
            showMessage(`${t('update_success')}`, 'success');
        }).catch((err) => {
            showMessage(`${err?.response?.data?.message}`, 'error');
        });
    }

    const handleCancel = ({ id }: any) => {
        OrderCancel({ id }).then(() => {
            mutate();
            showMessage(`${t('update_success')}`, 'success');
        }).catch((err) => {
            showMessage(`${err?.response?.data?.message}`, 'error');
        });
    }

    const handleReceive = ({ id }: any) => {
        OrderReceive({ id }).then(() => {
            mutate();
            showMessage(`${t('update_success')}`, 'success');
        }).catch((err) => {
            showMessage(`${err?.response?.data?.message}`, 'error');
        });
    }

    const columns = [
        {
            accessor: 'id',
            title: '#',
            render: (records: any, index: any) => <span>{(pagination?.page - 1) * pagination?.perPage + index + 1}</span>,
        },
        { accessor: 'code', title: 'Mã đơn hàng', sortable: false },
        { accessor: 'name', title: 'Tên đơn hàng', sortable: false },
        // { accessor: 'type', title: 'Loại phiếu', sortable: false },
        {
            accessor: 'proposals',
            title: 'Yêu cầu',
            render: ({ proposals, repairRequests }: any) => <span>{
                proposals?.map((item: any, index: any) => { return proposals.length > index + 1 ? item.name + ", " : item.name }) ||
                repairRequests?.map((item: any, index: any) => { return repairRequests.length > index + 1 ? item.name + ", " : item.name })
            }</span>,
        },
        {
            accessor: 'warehouse',
            title: 'Kho',
            render: ({ warehouse }: any) => <span>{warehouse?.name}</span>,
        },
        {
            accessor: 'estimatedDeliveryDate',
            title: 'Nhận hàng dự kiến',
            render: ({ estimatedDeliveryDate }: any) => <span>{moment(estimatedDeliveryDate).format("DD/MM/YYYY")}</span>,
        },
        {
            accessor: 'status',
            title: 'Trạng thái',
            sortable: false,
            render: ({ status }: any) => {
                return (
                    <span className={`badge uppercase bg-${(status === "COMPLETED" || status === "HEAD_APPROVED" || status === "MANAGER_APPROVED") ? "success" : (status === "HEAD_REJECTED" || status === "HEAD_REJECTED") ? "danger" : "warning"}`}>{
                        (status === "COMPLETED" || status === "HEAD_APPROVED" || status === "MANAGER_APPROVED") ? "Đã duyệt" :
                            (status === "HEAD_REJECTED" || status === "MANAGER_REJECTED") ? "Không duyệt" :
                                "Chưa duyệt"
                    }</span>
                )
            },
        },
        {
            accessor: 'action',
            title: 'Thao tác',
            titleClassName: '!text-center',
            width: '10%',
            render: (records: any) => (
                <div className="flex justify-start gap-2">
                    <div className="w-[80px]">
                        <Link href={`/warehouse-process/order/${records.id}?status=${true}&&type=${records.status}`}>
                            <button data-testId='detail-order-btn' type='button' className='button-detail'>
                                <IconNewEye /> <span>{t('detail')}</span>
                            </button>
                        </Link>
                    </div>
                    {
                        records.status === "PENDING" &&
                        <div className="w-[60px]">
                            <button data-testId='edit-order-btn' type="button" className='button-edit' onClick={() => handleDetail(records)}>
                                <IconNewEdit /><span>
                                    {t('edit')}
                                </span>
                            </button>
                        </div>
                    }
                    {
                        (records?.status === "HEAD_REJECTED" || records?.status === "MANAGER_REJECTED") &&
                        <div className="w-[80px]">
                            <button type="button" className='button-delete' onClick={() => handleDelete(records)}>
                                <IconNewTrash />
                                <span>
                                    {t('delete')}
                                </span>
                            </button>
                        </div>
                    }
                </div >
            ),
        },
    ]

    const handleActive = (item: any) => {
        if (Number(localStorage.getItem('defaultFilterOrder')) === item.value) {
            setActive([0]);
            localStorage.setItem('defaultFilterOrder', "0");
            router.push({
                query: { warehouseId: '' }
            })
        } else {
            router.push({
                query: { warehouseId: item.value }
            })
            setActive([item.value]);
            localStorage.setItem('defaultFilterOrder', item.value);
        }
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            setActive([Number(localStorage.getItem('defaultFilterOrder'))])
        }
    }, [router])

    return (
        <div>
            {showLoader && (
                <div className="screen_loader fixed inset-0 bg-[#fafafa] dark:bg-[#060818] z-[60] grid place-content-center animate__animated">
                    <IconLoading />
                </div>
            )}
            <title>product</title>
            <div className="panel mt-6">
                <div className="flex md:items-center justify-between md:flex-row flex-col mb-4.5 gap-5">
                    <div className="flex items-center flex-wrap">
                        <button data-testId='add-order' type="button" className="m-1 button-table button-create" onClick={(e) => router.push(`/warehouse-process/order/create`)}>
                            <IconNewPlus />
                            <span className='uppercase'>{t('add')}</span>
                        </button>
                    </div>

                    <input autoComplete="off" type="text" className="form-input w-auto" placeholder={`${t('search')}`} onChange={(e) => handleSearch(e.target.value)} />
                </div>
                <div className="flex md:items-center justify-between md:flex-row flex-col mb-4.5 gap-5">
                    <div className="flex items-center flex-wrap gap-1">
                        {/* <IconFilter /> */}
                        {/* <span>lọc nhanh :</span> */}
                        <div className='flex items-center flex-wrap gap-2'>
                            {
                                warehouses?.data.map((item: any, index: any) => {
                                    return (
                                        <div key={index} className={active.includes(item.value) ? 'border p-2 rounded bg-[#E9EBD5] text-[#476704] cursor-pointer' : 'border p-2 rounded cursor-pointer'} onClick={() => handleActive(item)}>{item.label}</div>
                                    );
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className="datatables">
                    <DataTable
                        highlightOnHover
                        className="whitespace-nowrap table-hover custom_table"
                        records={orders?.data}
                        columns={columns}
                        totalRecords={pagination?.totalRecords}
                        recordsPerPage={pagination?.perPage}
                        page={pagination?.page}
                        onPageChange={(p) => handleChangePage(p, pagination?.perPage)}
                        recordsPerPageOptions={PAGE_SIZES}
                        onRecordsPerPageChange={e => handleChangePage(pagination?.page, e)}
                        sortStatus={sortStatus}
                        onSortStatusChange={setSortStatus}
                        minHeight={200}
                        paginationText={({ from, to, totalRecords }) => `${t('Showing_from_to_of_totalRecords_entries', { from: from, to: to, totalRecords: totalRecords })}`}
                    />
                </div>
            </div>
        </div>
    );
};

export default OrderForm;
