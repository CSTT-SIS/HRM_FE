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
import { DeleteProposal, ProposalApprove, ProposalManagemetReject, ProposalMangementApprove, ProposalReject, ProposalReturn } from '@/services/apis/proposal.api';
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
import { DropdownWarehouses } from '@/services/swr/dropdown.twr';
import Select, { components } from 'react-select';

interface Props {
    [key: string]: any;
}

const ProposalPage = ({ ...props }: Props) => {

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const router = useRouter();
    const [active, setActive] = useState<any>([1]);
    const [select, setSelect] = useState<any>();

    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'desc' });

    // get data
    const { data: proposal, pagination, mutate, isLoading } = Proposals({ sortBy: 'id.ASC', ...router.query, type: "PURCHASE", warehouseId: active.includes(0) ? "" : active });
    const { data: warehouseDropdown, pagination: warehousePagination, isLoading: warehouseLoading } = DropdownWarehouses({});

    useEffect(() => {
        dispatch(setPageTitle(`${t('proposal')}`));
    });

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
        router.push(`/warehouse-process/proposal-order/${value.id}?type=${value.type}&&status=${value.status}`)
    }

    const columns = [
        {
            accessor: 'id',
            title: '#',
            render: (records: any, index: any) => <span>{(pagination?.page - 1) * pagination?.perPage + index + 1}</span>,
        },
        { accessor: 'name', title: 'Tên yêu cầu', sortable: false },
        {
            accessor: 'warehouses',
            title: 'Kho',
            render: ({ warehouses }: any) => <span>{warehouses[0]?.name}</span>,
            sortable: false
        },
        {
            accessor: 'department',
            title: 'Phòng ban',
            render: ({ department }: any) => <span>{department?.name}</span>,
            sortable: false
        },
        // { accessor: 'content', title: 'Nội dung', sortable: false },
        {
            accessor: 'status',
            title: 'Trạng thái',
            render: ({ status }: any) => <span>{status === "HEAD_APPROVED" ? "Đã duyệt" : status === "HEAD_REJECTED" ? "Không duyệt" : "Chưa duyệt"}</span>,
            sortable: false
        },
        {
            accessor: 'action',
            title: 'Thao tác',
            titleClassName: '!text-center',
            render: (records: any) => (
                <div className="flex justify-start gap-2">
                    <button className='bg-[#F2E080] flex justify-between gap-1 p-1 rounded' type="button" onClick={() => router.push(`/warehouse-process/proposal-order/${records.id}?status=${true}&&type=${records.status}`)}>
                        <IconEye /> <span>{`${t('detail')}`}</span>
                    </button>
                    {
                        records.status !== "HEAD_APPROVED" &&
                        <button className='bg-[#9CD3EB] flex justify-between gap-1 p-1 rounded' type="button" onClick={() => handleDetail(records)}>
                            <IconPencil /> <span>{`${t('edit')}`}</span>
                        </button>
                    }
                    {
                        (records.status === "DRAFT" || records.status === "HEAD_REJECTED") &&
                        <button className='bg-[#E43940] flex justify-between gap-1 p-1 rounded text-[#F5F5F5]' type="button" onClick={() => handleDelete(records)}>
                            <IconTrashLines /> <span>{`${t('delete')}`}</span>
                        </button>
                    }
                    {/* {
                        records.status === "PENDING" &&
                        <button className='bg-[#C5E7AF] flex justify-between gap-1 p-1 rounded' type="button" onClick={() => router.push(`/warehouse-process/proposal-order/${records.id}?status=${true}&&type=approve`)}>
                            <IconChecks /> <span>{`${t('approve')}`}</span>
                        </button>
                    }
                    {
                        records.status === "HEAD_APPROVED" &&
                        <button className='bg-[#C5E7AF] flex justify-between gap-1 p-1 rounded' type="button" onClick={() => router.push(`/warehouse-process/proposal-order/${records.id}?status=${true}&&type=managerApprove`)}>
                            <IconChecks /> <span>{`${t('approve')}`}</span>
                        </button>
                    } */}
                </div>
            ),
        },
    ]
    const handleChangeSelect = (e: any) => {
        setSelect(e);
        localStorage.setItem('defaultSelectProposalOrder', JSON.stringify(e))
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            setActive([Number(localStorage.getItem('defaultFilterProposalOrder'))])
            if (localStorage.getItem("defaultSelectProposalOrder") !== null) {
                setSelect(JSON.parse(localStorage.getItem("defaultSelectProposalOrder") || ""))
            }
        }
    }, [router]);

    const handleActive = (item: any) => {
        if (Number(localStorage.getItem('defaultFilterExport')) === item.value) {
            setActive([0]);
            localStorage.setItem('defaultFilterExport', "0");
        } else {
            setActive([item.value]);
            localStorage.setItem('defaultFilterExport', item.value);
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
                        <button type="button" onClick={(e) => router.push(`/warehouse-process/proposal-order/create`)} className="btn btn-primary btn-sm m-1 custom-button" >
                            <IconPlus className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                            {t('add')}
                        </button>
                    </div>

                    <input autoComplete="off" type="text" className="form-input w-auto" placeholder={`${t('search')}`} onChange={(e) => handleSearch(e.target.value)} />
                </div>
                <div className="flex md:items-center justify-between md:flex-row flex-col mb-4.5 gap-5">
                    <div className="flex items-center flex-wrap gap-1">
                        {/* <IconFilter /> */}
                        <div className='flex items-center flex-wrap gap-2'>
                            {
                                warehouseDropdown?.data.map((item: any, index: any) => {
                                    return (
                                        <div key={index} className={active.includes(item.value) ? 'border p-2 rounded bg-[#E9EBD5] text-[#476704] cursor-pointer' : 'border p-2 rounded cursor-pointer'} onClick={() => handleActive(item)}>{item.label}</div>
                                    );
                                })
                            }
                        </div>
                        {/* <span className='ml-9'>Lọc kho :</span>
                        <div className='w-52'>
                            <Select
                                options={warehouseDropdown?.data}
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
                        className="whitespace-nowrap table-hover"
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
