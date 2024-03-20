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
import Link from 'next/link';
import IconNewEye from '@/components/Icon/IconNewEye';
import IconNewEdit from '@/components/Icon/IconNewEdit';
import IconNewTrash from '@/components/Icon/IconNewTrash';
import IconNewPlus from '@/components/Icon/IconNewPlus';


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
    const { data: warehousing, pagination, mutate } = WarehousingBill({ ...router.query, type: "EXPORT", warehouseId: active.includes(0) ? "" : active });
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
            width: '10%',
            titleClassName: '!text-center',
            render: (records: any) => (
                <div className="flex justify-start gap-2">
                    <div className="w-[80px]">
                        <Link href={`/warehouse-process/warehousing-bill/export/${records.id}?status=${true}&&type=${records.status}`}>
                            <button type='button' className='button-detail'>
                                <IconNewEye /> <span>{t('detail')}</span>
                            </button>
                        </Link>
                    </div>
                    {
                        records.status === "PENDING" &&
                        <>
                            <div className="w-[60px]">
                                <button type="button" className='button-edit' onClick={() => handleDetail(records)}>
                                    <IconNewEdit /><span>
                                        {t('edit')}
                                    </span>
                                </button>
                            </div>
                            <div className="w-[80px]">
                                <button type="button" className='button-delete' onClick={() => handleDelete(records)}>
                                    <IconNewTrash />
                                    <span>
                                        {t('delete')}
                                    </span>
                                </button>
                            </div>
                        </>
                    }
                </div>
            ),
        },
    ]

    const handleActive = (item: any) => {
        if (Number(localStorage.getItem('defaultFilterExport')) === item.value) {
            setActive([0]);
            localStorage.setItem('defaultFilterExport', "0");
        } else {
            setActive([item.value]);
            localStorage.setItem('defaultFilterExport', item.value);
        }
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
                        <button type="button" className="m-1 button-table button-create" onClick={(e) => router.push(`/warehouse-process/warehousing-bill/export/create`)}>
                            <IconNewPlus />
                            <span className='uppercase'>{t('add')}</span>
                        </button>
                    </div>

                    <input type="text" className="form-input w-auto" placeholder={`${t('search')}`} onChange={(e) => handleSearch(e.target.value)} />
                </div>
                <div className="flex md:items-center justify-between md:flex-row flex-col mb-4.5 gap-5">
                    <div className="flex items-center flex-wrap gap-1">
                        {/* <IconFilter /> */}
                        {/* <span>Lọc nhanh :</span> */}
                        <div className='flex items-center flex-wrap gap-2'>
                            {
                                warehouses?.data.map((item: any, index: any) => {
                                    return (
                                        <div key={index} className={active.includes(item.value) ? 'border p-2 rounded bg-[#E9EBD5] text-[#476704] cursor-pointer' : 'border p-2 rounded cursor-pointer'} onClick={() => handleActive(item)}>{item.label}</div>
                                    );
                                })
                            }
                        </div>
                        {/* <span className='ml-9'>Lọc kho :</span>
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
                        </div> */}
                    </div>
                </div>
                <div className="datatables">
                    <DataTable
                        highlightOnHover
                        className="whitespace-nowrap table-hover custom_table"
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
