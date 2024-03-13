import { useEffect, useState } from 'react';
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
import { WarehousingBill } from '@/services/swr/warehousing-bill.twr';
import { DeleteWarehousingBill, WarehousingBillApprove, WarehousingBillReject } from '@/services/apis/warehousing-bill.api';
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
import IconCircleCheck from '@/components/Icon/IconCircleCheck';
import IconEye from '@/components/Icon/IconEye';
import { IconFilter } from '@/components/Icon/IconFilter';
import Select, { components } from 'react-select';
import { DropdownWarehouses } from '@/services/swr/dropdown.twr';


interface Props {
    [key: string]: any;
}

const WarehousingPage = ({ ...props }: Props) => {

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const router = useRouter();
    const [active, setActive] = useState<any>([1]);
    const [select, setSelect] = useState<any>();
    const [pageWarehouse, setPageWarehouse] = useState(1);

    const [showLoader, setShowLoader] = useState(true);

    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'desc' });


    // get data
    const { data: warehousing, pagination, mutate } = WarehousingBill({ ...router.query });
    const { data: warehouses, pagination: warehousePagination, isLoading: warehouseLoading } = DropdownWarehouses({ page: pageWarehouse });


    useEffect(() => {
        dispatch(setPageTitle(`${t('proposal')}`));
    });

    useEffect(() => {
        setShowLoader(false);
    }, [warehousing])

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
                html: `<span class='confirm-span'>${t('delete')}</span> ${name}?`,
                padding: '2em',
                showCancelButton: true,
                cancelButtonText: `${t('cancel')}`,
                confirmButtonText: `${t('confirm')}`,
                reverseButtons: true,
            })
            .then((result) => {
                if (result.value) {
                    DeleteWarehousingBill({ id }).then(() => {
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
        router.push(`/warehouse-process/warehousing-bill/export/${value.id}?status=${value.status}`)
    }

    const handleApprove = ({ id }: any) => {
        WarehousingBillApprove({ id }).then(() => {
            mutate();
            showMessage(`${t('update_success')}`, 'success');
        }).catch((err) => {
            showMessage(`${err?.response?.data?.message}`, 'error');
        });
    }

    const handleReject = ({ id }: any) => {
        WarehousingBillReject({ id }).then(() => {
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
        // { accessor: 'name', title: 'Tên phiếu kho', sortable: false },
        // { accessor: 'type', title: 'Loại phiếu', sortable: false },
        {
            accessor: 'proposal',
            title: ' Loại yêu cầu',
            render: ({ proposal, order, repairRequest }: any) => <span>
                {
                    proposal !== null ? "Xuất mìn" :
                        order !== null ? "Mua hàng" :
                            repairRequest !== null ? "Sửa chữa" : ""
                }
            </span>,
        },
        // {
        //     accessor: 'order',
        //     title: 'Đơn hàng',
        //     render: ({ order }: any) => <span>{order?.name}</span>,
        // },
        {
            accessor: 'warehouse',
            title: 'Tên kho',
            render: ({ warehouse }: any) => <span>{warehouse?.name}</span>,
        },
        {
            accessor: 'status',
            title: 'Trạng thái',
            render: ({ status }: any) => <span>{status === "COMPLETED" ? "Đã duyệt" : "Chưa duyệt"}</span>,
            sortable: false
        },
        // { accessor: 'note', title: 'Ghi chú', sortable: false },
        {
            accessor: 'action',
            title: 'Thao tác',
            titleClassName: '!text-center',
            render: (records: any) => (
                <div className="flex w-max mx-auto gap-2">
                    <button className='bg-[#F2E080] flex justify-between gap-1 p-1 rounded' type="button" onClick={() => router.push(`/warehouse-process/warehousing-bill/export/${records.id}?status=${true}`)}>
                        <IconEye /> <span>{`${t('detail')}`}</span>
                    </button>
                    {
                        records.status === "PENDING" &&
                        <>
                            <button className='bg-[#9CD3EB] flex justify-between gap-1 p-1 rounded' type="button" onClick={() => handleDetail(records)}>
                                <IconPencil /> <span>{`${t('edit')}`}</span>
                            </button>
                            <button className='bg-[#E43940] flex justify-between gap-1 p-1 rounded text-[#F5F5F5]' type="button" onClick={() => handleDelete(records)}>
                                <IconTrashLines /> <span>{`${t('delete')}`}</span>
                            </button>
                        </>
                    }
                </div>
            ),
        },
    ]

    const [dataWarehouseDropdown, setDataWarehouseDropdown] = useState<any>([]);

    useEffect(() => {
        if (warehousePagination?.page === undefined) return;
        if (warehousePagination?.page === 1) {
            setDataWarehouseDropdown(warehouses?.data)
        } else {
            setDataWarehouseDropdown([...dataWarehouseDropdown, ...warehouses?.data])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [warehousePagination]);

    const handleMenuScrollToBottomWarehouse = () => {
        setTimeout(() => {
            setPageWarehouse(warehousePagination?.page + 1);
        }, 1000);
    }

    const handleActive = (value: any) => {
        setActive([value]);
        localStorage.setItem('defaultFilterExport', value);
    };

    const handleChangeSelect = (e: any) => {
        setSelect(e);
        localStorage.setItem('defaultSelectExport', JSON.stringify(e))
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            setActive([Number(localStorage.getItem('defaultFilterExport'))])
            if (localStorage.getItem("defaultSelectExport") !== null) {
                setSelect(JSON.parse(localStorage.getItem("defaultSelectExport") || ""))
            }
        }
    }, [router]);

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
                        <button type="button" onClick={(e) => router.push(`/warehouse-process/warehousing-bill/export/create`)} className="btn btn-primary btn-sm m-1 custom-button" >
                            <IconPlus className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                            {t('add')}
                        </button>
                    </div>

                    <input type="text" className="form-input w-auto" placeholder={`${t('search')}`} onChange={(e) => handleSearch(e.target.value)} />
                </div>
                <div className="flex md:items-center justify-between md:flex-row flex-col mb-4.5 gap-5">
                    <div className="flex items-center flex-wrap gap-1">
                        <IconFilter />
                        <span>Lọc nhanh :</span>
                        <div className='flex items-center flex-wrap gap-2'>
                            <div className={active.includes(1) ? 'border p-2 rounded bg-[#E9EBD5] text-[#476704] cursor-pointer' : 'border p-2 rounded cursor-pointer'} onClick={() => handleActive(1)}>Chưa duyệt</div>
                            <div className={active.includes(2) ? 'border p-2 rounded bg-[#E9EBD5] text-[#476704] cursor-pointer' : 'border p-2 rounded cursor-pointer'} onClick={() => handleActive(2)}>Đã duyệt</div>
                            <div className={active.includes(3) ? 'border p-2 rounded bg-[#E9EBD5] text-[#476704] cursor-pointer' : 'border p-2 rounded cursor-pointer'} onClick={() => handleActive(3)}>Không duyệt</div>
                        </div>
                        <span className='ml-9'>Lọc kho :</span>
                        <div className='w-52'>
                            <Select
                                options={dataWarehouseDropdown}
                                onMenuOpen={() => setPageWarehouse(1)}
                                onMenuScrollToBottom={handleMenuScrollToBottomWarehouse}
                                isLoading={warehouseLoading}
                                maxMenuHeight={160}
                                className='z-10'
                                value={select || ''}
                                onChange={e => handleChangeSelect(e)}
                            />
                        </div>
                    </div>
                </div>
                <div className="datatables">
                    <DataTable
                        highlightOnHover
                        className="whitespace-nowrap table-hover"
                        records={warehousing?.data}
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

export default WarehousingPage;
