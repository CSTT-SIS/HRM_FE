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

interface Props {
    [key: string]: any;
}

const RepairPage = ({ ...props }: Props) => {

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const router = useRouter();

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
        { accessor: 'description', title: 'Ghi chú', sortable: false },
        { accessor: 'status', title: 'Trạng thái', sortable: false },
        {
            accessor: 'action',
            title: 'Thao tác',
            titleClassName: '!text-center',
            render: (records: any) => (
                <div className="flex items-center w-max mx-auto gap-2">
                    <Tippy content={`${t('detail')}`}>
                        <button type="button" onClick={() => router.push(`/warehouse-process/repair/${records.id}?status=${true}`)}>
                            <IconEye />
                        </button>
                    </Tippy>
                    {
                        records.status === "DRAFT" &&
                        <Tippy content={`${t('edit')}`}>
                            <button type="button" onClick={() => handleDetail(records)}>
                                <IconPencil />
                            </button>
                        </Tippy>
                    }
                    {
                        records.status === "DRAFT" || records.status === "HEAD_REJECTED" &&
                        <Tippy content={`${t('delete')}`}>
                            <button type="button" onClick={() => handleDelete(records)}>
                                <IconTrashLines />
                            </button>
                        </Tippy>
                    }
                    {
                        records.status === "IN_PROGRESS" &&
                        <Tippy content={`${t('approve')}`}>
                            <button type="button" onClick={() => router.push(`/warehouse-process/repair/${records.id}?status=${true}&&type=approve`)}>
                                <IconCircleCheck size={20} />
                            </button>
                        </Tippy>
                    }
                    {/* <Tippy content={`${t('reject')}`}>
                        <button type="button" onClick={() => handleReject(records)}>
                            <IconXCircle />
                        </button>
                    </Tippy> */}
                </div>
            ),
        },
    ]

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
                        <button type="button" onClick={(e) => router.push(`/warehouse-process/repair/create`)} className="btn btn-primary btn-sm m-1 custom-button" >
                            <IconPlus className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                            {t('add')}
                        </button>
                    </div>

                    <input type="text" className="form-input w-auto" placeholder={`${t('search')}`} onChange={(e) => handleSearch(e.target.value)} />
                </div>
                <div className="datatables">
                    <DataTable
                        highlightOnHover
                        className="whitespace-nowrap table-hover"
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
