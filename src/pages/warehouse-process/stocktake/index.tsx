import { useEffect, Fragment, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
// Third party libs
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import Swal from 'sweetalert2';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
// API
import { Stocktakes } from '@/services/swr/stocktake.twr';
import { DeleteStocktake, StocktakeApprove, StocktakeCancel, StocktakeReject } from '@/services/apis/stocktake.api';
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
import IconRestore from '@/components/Icon/IconRestore';
import IconEye from '@/components/Icon/IconEye';
import { IconInventory } from '@/components/Icon/IconInventory';
import IconChecks from '@/components/Icon/IconChecks';
import IconListCheck from '@/components/Icon/IconListCheck';
import IconNewEdit from '@/components/Icon/IconNewEdit';
import IconNewEye from '@/components/Icon/IconNewEye';
import IconNewTrash from '@/components/Icon/IconNewTrash';
import Link from 'next/link';
import IconNewPlus from '@/components/Icon/IconNewPlus';
import IconImportFile from '@/components/Icon/IconImportFile';

interface Props {
    [key: string]: any;
}

const StocktakePage = ({ ...props }: Props) => {

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const router = useRouter();

    const [showLoader, setShowLoader] = useState(true);
    const [tally, setTally] = useState(false);

    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'desc' });


    // get data
    const { data: stocktakes, pagination, mutate } = Stocktakes({ ...router.query, sortBy: "id.DESC" });
    useEffect(() => {
        dispatch(setPageTitle(`${t('Stocktake')}`));
    });

    useEffect(() => {
        setShowLoader(false);
    }, [stocktakes])

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
                title: `${t('delete_stocktake')}`,
                text: `${t('delete')} ${name}`,
                padding: '2em',
                showCancelButton: true,
                cancelButtonText: `${t('cancel')}`,
                confirmButtonText: `${t('confirm')}`,
                reverseButtons: true,
            })
            .then((result) => {
                if (result.value) {
                    DeleteStocktake({ id }).then(() => {
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
        router.push(`/warehouse-process/stocktake/${value.id}?status=${value.status}&&type=${value.status}`)
    }

    const handleReject = ({ id }: any) => {
        StocktakeReject({ id }).then(() => {
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
        { accessor: 'name', title: 'Tên phiếu kiểm kê', sortable: false },
        {
            accessor: 'warehouse',
            title: 'Tên kho',
            render: ({ warehouse }: any) => <span>{warehouse?.name}</span>,
        },
        {
            accessor: 'participants',
            title: 'Người tham gia',
            render: ({ participants }: any) => {
                return participants?.map((item: any, index: any) => {
                    return (
                        <span key={item}>{index + 1 < participants.length ? item?.fullName + ", " : item?.fullName}</span>
                    )
                })
            }
        },
        {
            accessor: 'startDate',
            title: 'Ngày bắt đầu',
            render: ({ startDate }: any) => <span>{moment(startDate).format("DD/MM/YYYY")}</span>,
        },
        {
            accessor: 'EndDate',
            title: 'Ngày kết thúc',
            render: ({ EndDate }: any) => <span>{moment(EndDate).format("DD/MM/YYYY")}</span>,
        },
        // { accessor: 'description', title: 'Ghi chú', sortable: false },
        {
            accessor: 'status',
            title: 'Trạng thái',
            render: ({ status }: any) =>
                <span className={`badge uppercase bg-${(status === "COMPLETED" || status === "HEAD_APPROVED" || status === "MANAGER_APPROVED") ? "success" : (status === "HEAD_REJECTED" || status === "HEAD_REJECTED") ? "danger" : "warning"}`}>{
                    (status === "COMPLETED" || status === "HEAD_APPROVED") ? "Đã duyệt" :
                        (status === "HEAD_REJECTED") ? "Không duyệt" :
                            "Chưa duyệt"
                }</span>,
            sortable: false
        },
        {
            accessor: 'action',
            title: 'Thao tác',
            titleClassName: '!text-center',
            render: (records: any) => {
                return (
                    <>
                        <div className="flex justify-start gap-2">
                            <div className="w-[80px]">
                                <Link href={`/warehouse-process/stocktake/${records.id}?status=${true}&&type=${records.status
                                    }`}>
                                    <button type='button' className='button-detail'>
                                        <IconNewEye /> <span>{t('detail')}</span>
                                    </button>
                                </Link>
                            </div>
                            {
                                records.status === "DRAFT" &&
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
                    </>
                )
            }
        },
    ]

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
                        <button type="button" className="m-1 button-table button-create" onClick={(e) => router.push(`/warehouse-process/stocktake/create?status=DRAFT`)}>
                            <IconNewPlus />
                            <span className='uppercase'>{t('add')}</span>
                        </button>
                    </div>

                    <input autoComplete="off" type="text" className="form-input w-auto" placeholder={`${t('search')}`} onChange={(e) => handleSearch(e.target.value)} />
                </div>
                <div className="datatables">
                    <DataTable
                        highlightOnHover
                        className="whitespace-nowrap table-hover custom_table"
                        records={stocktakes?.data}
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

export default StocktakePage;
