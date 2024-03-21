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
import { Repairs } from '@/services/swr/repair.twr';
import { DeleteRepair, RepairApprove, RepairReject } from '@/services/apis/repair.api';
// constants
import { PAGE_SIZES } from '@/utils/constants';
// helper
import { showMessage } from '@/@core/utils';
// icons
import { IconLoading } from '@/components/Icon/IconLoading';
import IconPlus from '@/components/Icon/IconPlus';
import IconPencil from '@/components/Icon/IconPencil';
import IconTrashLines from '@/components/Icon/IconTrashLines';
import IconCircleCheck from '@/components/Icon/IconCircleCheck';
import IconXCircle from '@/components/Icon/IconXCircle';
import IconEye from '@/components/Icon/IconEye';
import IconChecks from '@/components/Icon/IconChecks';
import { IconFilter } from '@/components/Icon/IconFilter';
import IconNewTrash from '@/components/Icon/IconNewTrash';
import IconNewEdit from '@/components/Icon/IconNewEdit';
import IconNewEye from '@/components/Icon/IconNewEye';
import Link from 'next/link';
import IconNewPlus from '@/components/Icon/IconNewPlus';

interface Props {
    [key: string]: any;
}

const RepairPage = ({ ...props }: Props) => {

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const router = useRouter();
    const [active, setActive] = useState<any>([1]);

    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'desc' });

    // get data
    const { data: repairs, pagination, mutate, isLoading } = Repairs({ ...router.query });

    useEffect(() => {
        dispatch(setPageTitle(`${t('Repair')}`));
    });

    useEffect(() => {
        if (repairs?.data.length <= 0 && pagination.page > 1) {
            router.push({
                query: {
                    page: pagination.page - 1,
                    perPage: pagination.perPage
                }
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [repairs])

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
                    DeleteRepair({ id }).then(() => {
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
        router.push(`/warehouse-process/repair/${value.id}?status=${value.status}`)
    }

    const columns = [
        {
            accessor: 'id',
            title: '#',
            render: (records: any, index: any) => <span>{(pagination?.page - 1) * pagination?.perPage + index + 1}</span>,
        },
        { accessor: 'name', title: 'Tên phiếu sửa chữa', sortable: false },
        {
            accessor: 'vehicle',
            title: 'Số đăng ký xe',
            render: ({ vehicle }: any) => <span>{vehicle?.registrationNumber}</span>,
        },
        {
            accessor: 'repairBy',
            title: 'Người phụ trách',
            render: ({ repairBy }: any) => <span>{repairBy?.fullName}</span>,
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
            width: '10%',
            titleClassName: '!text-center',
            render: (records: any) => (
                <div className="flex justify-start gap-2">
                    <div className="w-[80px]">
                        <Link href={`/warehouse-process/repair/${records.id}?status=${true}&&type=approve`}>
                            <button type='button' className='button-detail'>
                                <IconNewEye /> <span>{t('detail')}</span>
                            </button>
                        </Link>
                    </div>
                    {
                        records.status !== "HEAD_APPROVED" &&
                        <div className="w-[60px]">
                            <button data-testid="edit-repair-btn" type="button" className='button-edit' onClick={() => handleDetail(records)}>
                                <IconNewEdit /><span>
                                    {t('edit')}
                                </span>
                            </button>
                        </div>
                    }
                    {
                        (records.status === "DRAFT" || records.status === "HEAD_REJECTED") &&
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

    const handleActive = (value: any) => {
        setActive([active.includes(value) ? 0 : value]);
        localStorage.setItem('defaultFilterProposalOrder', value);
    };

    return (
        <div>
            {isLoading && (
                <div className="screen_loader fixed inset-0 bg-[#fafafa] dark:bg-[#060818] z-[60] grid place-content-center animate__animated">
                    <IconLoading />
                </div>
            )}
            <title>product</title>
            <div className="panel mt-6">
                <div className="flex md:items-center justify-between md:flex-row flex-col mb-4.5 gap-5">
                    <div className="flex items-center flex-wrap">
                        <button data-testid="add-repair" type="button" className="m-1 button-table button-create" onClick={(e) => router.push(`/warehouse-process/repair/create`)}>
                            <IconNewPlus />
                            <span className='uppercase'>{t('add')}</span>
                        </button>
                    </div>

                    <input data-testId='search-repair-input' autoComplete="off" className="form-input w-auto" placeholder={`${t('search')}`} onChange={(e) => handleSearch(e.target.value)} />
                </div>
                <div className="flex md:items-center justify-between md:flex-row flex-col mb-4.5 gap-5">
                    <div className="flex items-center flex-wrap gap-1">
                        <div className='flex items-center flex-wrap gap-2'>
                            <div className={active.includes(1) ? 'border p-2 rounded bg-[#E9EBD5] text-[#476704] cursor-pointer' : 'border p-2 rounded cursor-pointer'} onClick={() => handleActive(1)}>Chưa duyệt</div>
                            <div className={active.includes(2) ? 'border p-2 rounded bg-[#E9EBD5] text-[#476704] cursor-pointer' : 'border p-2 rounded cursor-pointer'} onClick={() => handleActive(2)}>Đã duyệt</div>
                            <div className={active.includes(3) ? 'border p-2 rounded bg-[#E9EBD5] text-[#476704] cursor-pointer' : 'border p-2 rounded cursor-pointer'} onClick={() => handleActive(3)}>Không duyệt</div>
                        </div>
                    </div>
                </div>
                <div className="datatables">
                    <DataTable
                        highlightOnHover
                        className="whitespace-nowrap table-hover custom_table"
                        records={repairs?.data}
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

export default RepairPage;
