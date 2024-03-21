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
import { Proposals } from '@/services/swr/proposal.twr';
import { DeleteProposal, ProposalApprove, ProposalReject, ProposalReturn } from '@/services/apis/proposal.api';
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
import Link from 'next/link';
import IconNewEdit from '@/components/Icon/IconNewEdit';
import IconNewTrash from '@/components/Icon/IconNewTrash';
import IconNewEye from '@/components/Icon/IconNewEye';
import IconNewPlus from '@/components/Icon/IconNewPlus';
import { DropdownWarehouses } from '@/services/swr/dropdown.twr';

interface Props {
    [key: string]: any;
}

const ProposalPage = ({ ...props }: Props) => {

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const router = useRouter();
    const [active, setActive] = useState<any>([1]);

    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'desc' });

    // get data
    const { data: proposal, pagination, mutate, isLoading } = Proposals({ sortBy: 'id.ASC', ...router.query });
    const { data: warehouses, pagination: warehousePagination, isLoading: warehouseLoading } = DropdownWarehouses({});

    useEffect(() => {
        if (proposal?.data.length <= 0 && pagination.page > 1) {
            router.push({
                query: {
                    page: pagination.page - 1,
                    perPage: pagination.perPage
                }
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [proposal])

    useEffect(() => {
        dispatch(setPageTitle(`${t('proposal')}`));
    });

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
                title: `${t('delete_proposal')}`,
                text: `${t('delete')} ${name}`,
                padding: '2em',
                showCancelButton: true,
                cancelButtonText: `${t('cancel')}`,
                confirmButtonText: `${t('confirm')}`,
                reverseButtons: true,
            })
            .then((result) => {
                if (result.value) {
                    DeleteProposal({ id }).then(() => {
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
        router.push(`/warehouse-process/proposal/${value.id}`)
    }

    const columns = [
        {
            accessor: 'id',
            title: '#',
            render: (records: any, index: any) => <span>{(pagination?.page - 1) * pagination?.perPage + index + 1}</span>,
        },
        { accessor: 'name', title: 'Tên yêu cầu', sortable: false },
        // { accessor: 'type', title: 'Loại yêu cầu', sortable: false },
        { accessor: 'content', title: 'Nội dung', sortable: false },
        {
            accessor: 'warehouse',
            title: 'Kho',
            render: ({ warehouse }: any) => <span>{warehouse?.name}</span>,
        },
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
                        <Link href={`/warehouse-process/proposal/${records.id}?status=${true}&&type=approve`}>
                            <button data-testId="detail-proposal-btn" type='button' className='button-detail'>
                                <IconNewEye /> <span>{t('detail')}</span>
                            </button>
                        </Link>
                    </div>
                    {
                        (records.status !== "HEAD_APPROVED" || records.status !== "HEAD_REJECTED") &&
                        <div className="w-[60px]">
                            <button data-testId="edit-proposal-btn" type="button" className='button-edit' onClick={() => handleDetail(records)}>
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
                </div>
            ),
        },
    ]


    const handleActive = (item: any) => {
        if (Number(localStorage.getItem('defaultFilterProposalOrder')) === item.value) {
            setActive([0]);
            localStorage.setItem('defaultFilterProposalOrder', "0");
            router.push({
                query: { warehouseId: '' }
            })
        } else {
            router.push({
                query: { warehouseId: item.value }
            })
            setActive([item.value]);
            localStorage.setItem('defaultFilterProposalOrder', item.value);
        }
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
                        <button data-testId="add-proposal" type="button" className="m-1 button-table button-create" onClick={(e) => router.push(`/warehouse-process/proposal/create`)}>
                            <IconNewPlus />
                            <span className='uppercase'>{t('add')}</span>
                        </button>
                    </div>

                    <input data-testId="search-proposal-input" autoComplete="off" type="text" className="form-input w-auto" placeholder={`${t('search')}`} onChange={(e) => handleSearch(e.target.value)} />
                </div>
                <div className="flex md:items-center justify-between md:flex-row flex-col mb-4.5 gap-5">
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
                <div className="datatables">
                    <DataTable
                        highlightOnHover
                        className="whitespace-nowrap table-hover custom_table"
                        records={proposal?.data}
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

export default ProposalPage;
