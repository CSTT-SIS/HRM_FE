import { useEffect, Fragment, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
// Third party libs
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import Swal from 'sweetalert2';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useTranslation } from 'react-i18next';
// API
// constants
import { PAGE_SIZES, PAGE_SIZES_DEFAULT, PAGE_NUMBER_DEFAULT } from '@/utils/constants';
// helper
// icons
import { IconLoading } from '@/components/Icon/IconLoading';
import IconPlus from '@/components/Icon/IconPlus';
import IconPencil from '@/components/Icon/IconPencil';
import IconTrashLines from '@/components/Icon/IconTrashLines';
import IconCircleCheck from '@/components/Icon/IconCircleCheck';

import { useRouter } from 'next/router';
import { setPageTitle } from '@/store/themeConfigSlice';

// json
import exportList from '../export_list.json';

import ExportModal from '../modal/ExportModal';
import IconXCircle from '@/components/Icon/IconXCircle';

interface Props {
    [key: string]: any;
}

const ExportPage = ({ ...props }: Props) => {

    const dispatch = useDispatch();
    const { t } = useTranslation();
    useEffect(() => {
        dispatch(setPageTitle(`${t('Export')}`));
    });

    const router = useRouter();

    const [showLoader, setShowLoader] = useState(true);
    const [page, setPage] = useState<any>(PAGE_NUMBER_DEFAULT);
    const [pageSize, setPageSize] = useState(PAGE_SIZES_DEFAULT);
    const [recordsData, setRecordsData] = useState<any>();
    const [total, setTotal] = useState(0);
    const [getStorge, setGetStorge] = useState<any>();
    const [data, setData] = useState<any>();

    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'desc' });

    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const data = localStorage.getItem('exportList');
            if (data) {
                setGetStorge(JSON.parse(data));
            } else {
                localStorage.setItem('exportList', JSON.stringify(exportList));
            }

        }
    }, [])

    useEffect(() => {
        setTotal(getStorge?.length);
        setPageSize(PAGE_SIZES_DEFAULT);
        setRecordsData(getStorge?.filter((item: any, index: any) => { return index <= 9 && page === 1 ? item : index >= 10 && index <= (page * 9) ? item : null }));
    }, [getStorge, getStorge?.length, page])

    useEffect(() => {
        setShowLoader(false);
    }, [recordsData])

    const handleEdit = (data: any) => {
        setOpenModal(true);
        setData(data);
    };

    const handleDelete = (data: any) => {
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
                title: `${t('delete_export')}`,
                text: `${t('delete')} ${data.name}`,
                padding: '2em',
                showCancelButton: true,
                reverseButtons: true,
            })
            .then((result) => {
                if (result.value) {
                    const value = getStorge.filter((item: any) => { return (item.id !== data.id) });
                    localStorage.setItem('exportList', JSON.stringify(value));
                    setGetStorge(value);
                }
            });
    };

    const handleSearch = (e: any) => {
        if (e.target.value === "") {
            setRecordsData(getStorge);
        } else {
            setRecordsData(
                getStorge.filter((item: any) => {
                    return item.name.toLowerCase().includes(e.target.value.toLowerCase())
                })
            )
        }
    }
    const columns = [
        {
            accessor: 'id',
            title: '#',
            render: (records: any, index: any) => <span>{(page - 1) * pageSize + index + 1}</span>,
        },
        { accessor: 'code', title: 'Mã vật tư', sortable: false },
        { accessor: 'name', title: 'Tên vật tư', sortable: false },
        { accessor: 'unit', title: 'Đvt', sortable: false },
        { accessor: 'quantity', title: 'Số lượng', sortable: false },
        { accessor: 'unitPrice', title: 'Đơn giá', sortable: false },
        { accessor: 'totalAmount', title: 'Thành tiền', sortable: false },
        {
            accessor: 'status',
            title: 'Trạng thái',
            sortable: false,
            render: ({ status }: any) => <span className={`badge badge-outline-${status === "approved" ? "success" : status === "pending" ? "warning" : "danger"} `}>{status}</span>,
        },

        {
            accessor: 'action',
            title: 'Thao tác',
            titleClassName: '!text-center',
            render: (records: any) => (
                <div className="flex items-center w-max mx-auto gap-2">
                    {
                        records.status === "pending" ?
                            <>
                                <Tippy content={`${t('edit')}`}>
                                    <button type="button" onClick={() => handleEdit(records)}>
                                        <IconPencil />
                                    </button>
                                </Tippy>
                                <Tippy content={`${t('delete')}`}>
                                    <button type="button" onClick={() => handleDelete(records)}>
                                        <IconTrashLines />
                                    </button>
                                </Tippy>
                            </>
                            : ""
                    }
                    {
                        records.status === "pending" ?
                            <>
                                <Tippy content={`${t('approve')}`}>
                                    <button type="button">
                                        <IconCircleCheck size={20} />
                                    </button>
                                </Tippy>
                                <Tippy content={`${t('unapprove')}`}>
                                    <button type="button">
                                        <IconXCircle />
                                    </button>
                                </Tippy>
                            </>
                            : ""
                    }


                </div>
            ),
        },
    ]

    return (
        <div>
            {showLoader && (
                <div className="screen_loader fixed inset-0 bg-[#fafafa] dark:bg-[#060818] z-[60] grid place-content-center animate__animated">
                    <IconLoading />
                </div>
            )}
            <title>Export</title>
            <div className="panel mt-6">
                <div className="flex md:items-center justify-between md:flex-row flex-col mb-4.5 gap-5">
                    <div className="flex items-center flex-wrap">
                        <button type="button" onClick={(e) => setOpenModal(true)} className="btn btn-primary btn-sm m-1 " >
                            <IconPlus className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                            {t('add')}
                        </button>
                    </div>

                    <input type="text" className="form-input w-auto" placeholder={`${t('search')}`} onChange={(e) => handleSearch(e)} />
                </div>
                <div className="datatables">
                    <DataTable
                        highlightOnHover
                        className="whitespace-nowrap table-hover"
                        records={recordsData}
                        columns={columns}
                        totalRecords={total}
                        recordsPerPage={pageSize}
                        page={page}
                        onPageChange={(p) => setPage(p)}
                        recordsPerPageOptions={PAGE_SIZES}
                        onRecordsPerPageChange={setPageSize}
                        sortStatus={sortStatus}
                        onSortStatusChange={setSortStatus}
                        minHeight={200}
                        paginationText={({ from, to, totalRecords }) => `${t('Showing_from_to_of_totalRecords_entries', { from: from, to: to, totalRecords: totalRecords })}`}
                    />
                </div>
            </div>
            <ExportModal
                openModal={openModal}
                setOpenModal={setOpenModal}
                data={data}
                totalData={getStorge}
                setData={setData}
                setGetStorge={setGetStorge}
            />
        </div>
    );
};

export default ExportPage;
