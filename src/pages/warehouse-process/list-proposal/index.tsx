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
import IconPencil from '@/components/Icon/IconPencil';
import { WarehousingBillListRequest } from '@/services/swr/warehousing-bill.twr';

interface Props {
    [key: string]: any;
}

const ProposalPage = ({ ...props }: Props) => {

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const router = useRouter();

    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'desc' });

    // get data
    const { data: listRequest, pagination, mutate, isLoading } = WarehousingBillListRequest({ sortBy: 'id.ASC', ...router.query });

    useEffect(() => {
        dispatch(setPageTitle(`${t('proposal')}`));
    });

    const handleDelete = ({ id, name }: any) => {
        const swalDeletes = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-secondary',
                cancelButton: 'btn btn-danger ltr:mr-3 rtl:ml-3',
                popup: 'sweet-alerts',
            },
            buttonsStyling: false,
        });
        swalDeletes
            .fire({
                icon: 'question',
                title: `${t('delete_proposal')}`,
                text: `${t('delete')} ${name}`,
                padding: '2em',
                showCancelButton: true,
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
        router.push(`/warehouse-process/warehousing-bill/create/?proposalId=${value.id}`);
    }

    const handleApprove = ({ id }: any) => {
        ProposalApprove({ id }).then(() => {
            mutate();
            showMessage(`${t('update_success')}`, 'success');
        }).catch((err) => {
            showMessage(`${err?.response?.data?.message}`, 'error');
        });
    }

    const handleReject = ({ id }: any) => {
        ProposalReject({ id }).then(() => {
            mutate();
            showMessage(`${t('update_success')}`, 'success');
        }).catch((err) => {
            showMessage(`${err?.response?.data?.message}`, 'error');
        });
    }

    const handleReturn = ({ id }: any) => {
        ProposalReturn({ id }).then(() => {
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
            render: (records: any, index: any) => <span>{index + 1}</span>,
        },
        { accessor: 'name', title: 'Tên yêu cầu', sortable: false },
        {
            accessor: 'department',
            title: 'Phòng ban',
            render: ({ department }: any) => <span>{department?.name}</span>,
            sortable: false
        },
        { accessor: 'content', title: 'Nội dung', sortable: false },
        {
            accessor: 'entity',
            title: 'Phòng ban',
            render: ({ entity }: any) => <span>
                {
                    entity === "proposal" ? "Xuất mìn" :
                        entity === "repairRequest" ? "Sửa chữa" :
                            "Đặt hàng"
                }
            </span>,
            sortable: false
        },
        { accessor: 'status', title: 'Trạng thái', sortable: false },
        {
            accessor: 'action',
            title: 'Thao tác',
            titleClassName: '!text-center',
            render: (records: any) => (
                <div className="flex items-center w-max mx-auto gap-2">
                    <Tippy content={`${t('add_warehousing')}`}>
                        <button type="button" onClick={() => handleDetail(records)}>
                            <IconPencil />
                        </button>
                    </Tippy>
                    {/* <Tippy content={`${t('delete')}`}>
                        <button type="button" onClick={() => handleDelete(records)}>
                            <IconTrashLines />
                        </button>
                    </Tippy>
                    <Tippy content={`${t('approve')}`}>
                        <button type="button" onClick={() => handleApprove(records)}>
                            <IconCircleCheck size={20} />
                        </button>
                    </Tippy>
                    <Tippy content={`${t('reject')}`}>
                        <button type="button" onClick={() => handleReject(records)}>
                            <IconXCircle />
                        </button>
                    </Tippy>
                    <Tippy content={`${t('return')}`}>
                        <button type="button" onClick={() => handleReturn(records)}>
                            <IconRestore />
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
                </div>
                <div className="datatables">
                    <DataTable
                        highlightOnHover
                        className="whitespace-nowrap table-hover"
                        records={listRequest?.data}
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
