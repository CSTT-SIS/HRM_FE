import { useEffect, Fragment, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { lazy } from 'react';
import Link from 'next/link';

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
import { capitalize, formatDate, showMessage } from '@/@core/utils';
// icons
import IconPencil from '../../../components/Icon/IconPencil';
import IconTrashLines from '../../../components/Icon/IconTrashLines';
import { IconLoading } from '@/components/Icon/IconLoading';
import IconPlus from '@/components/Icon/IconPlus';
import IconEye from '@/components/Icon/IconEye';

import { useRouter } from 'next/router';

// json
import shiftList from './shift.json';
import ShiftModal from './modal/ShiftModal';
import DetailModal from './modal/DetailModal';
import IconFolderMinus from '@/components/Icon/IconFolderMinus';
import IconDownload from '@/components/Icon/IconDownload';
import IconChecks from '@/components/Icon/IconChecks';


interface Props {
    [key: string]: any;
}

const Shift = ({ ...props }: Props) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    useEffect(() => {
        dispatch(setPageTitle(`${t('shift')}`));
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
    const [openDetail, setOpenDetail] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const data = localStorage.getItem('shiftList');
            if (data) {
                setGetStorge(JSON.parse(data));
            } else {
                localStorage.setItem('shiftList', JSON.stringify(shiftList));
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
    const handleDetail = (data: any) => {
        setOpenDetail(true);
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
                title: `${t('delete_form')}`,
                text: `${t('delete_form')} ${data.name}`,
                padding: '2em',
                showCancelButton: true,
                reverseButtons: true,
            })
            .then((result) => {
                if (result.value) {
                    const value = getStorge.filter((item: any) => { return (item.id !== data.id) });
                    localStorage.setItem('lateEarlyFormList', JSON.stringify(value));
                    setGetStorge(value);
                    showMessage(`${t('delete_form_success')}`, 'success')
                }
            });
    };

    const handleCheck = (data: any) => {
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
                title: `${t('check_form')}`,
                text: `${t('check')} ${data.name}`,
                padding: '2em',
                showCancelButton: true,
                reverseButtons: true,
            })
            .then((result) => {
                if (result.value) {
                    const value = getStorge.filter((item: any) => { return (item.id !== data.id) });
                    showMessage(`${t('check_form_success')}`, 'success')
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
            render: (records: any, index: any) => <span onClick={() => handleDetail(records)}>{(page - 1) * pageSize + index + 1}</span>,
        },
        {
            accessor: 'code_shift',
            title: `${t('code_shift')}`,
            sortable: false,
            render: (records: any, index: any) => <span onClick={() => handleDetail(records)}>{records?.code_shift}</span>
        },
        {
            accessor: 'name_shift',
            title: `${t('name_shift')}`,
            sortable: false,
            render: (records: any, index: any) => <span onClick={() => handleDetail(records)}>{records?.name_shift}</span>
        },
        {
            accessor: 'type_shift',
            title: `${t('type_shift')}`,
            sortable: false,
            render: (records: any, index: any) => <span onClick={() => handleDetail(records)}>{records?.type_shift}</span>
        },
        {
            accessor: 'from_time',
            title: `${t('from_time')}`,
            sortable: false,
            render: (records: any, index: any) => <span onClick={(records) => handleDetail(records)}>{records?.from_time}</span>
        },
        {
            accessor: 'end_time',
            title: `${t('end_time')}`,
            sortable: false,
            render: (records: any, index: any) => <span onClick={() => handleDetail(records)}>{records?.end_time}</span>
        },
            { accessor: 'break_from_time',
            title: `${t('break_from_time')}`, sortable: false,         render: (records: any, index: any) => <span onClick={(records) => handleDetail(records)}>{records?.break_from_time}</span>
        },
        { accessor: 'break_end_time',
         title: `${t('break_end_time')}`, sortable: false,         render: (records: any, index: any) => <span onClick={() => handleDetail(records)}>{records?.break_end_time}</span>
    },
    { accessor: 'time_total', title: `${t('time_shift')}`, sortable: false,         render: (records: any, index: any) => <span onClick={() => handleDetail(records)}>{records?.time_total}</span>
},
{ accessor: 'description', title: `${t('description')}`, sortable: false,         render: (records: any, index: any) => <span onClick={() => handleDetail(records)}>{records?.description}</span>
},
        {
            accessor: 'action',
            title: 'Thao tác',
            render: (records: any) => (
                <div className="flex items-center w-max mx-auto gap-2">
                     <Tippy content={`${t('detail_shift_employee')}`}>
                        <Link href={`/hrm/shift/detail-shift-employee/${records?.id}`}>
                            <IconEye />
                            </Link>
                    </Tippy>
                    <Tippy content={`${t('edit')}`}>
                        <button type="button" onClick={() => handleEdit(records)}>
                            <IconPencil />
                        </button>
                    </Tippy>
                    <Tippy content={`${t('check')}`}>
                        <button type="button" onClick={() => handleCheck(records)}>
                            <IconChecks />
                        </button>
                    </Tippy>
                    <Tippy content={`${t('delete')}`}>
                        <button type="button" onClick={() => handleDelete(records)}>
                            <IconTrashLines />
                        </button>
                    </Tippy>
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
            <title>{t('department')}</title>
            <div className="panel mt-6">
                <div className="flex md:items-center justify-between md:flex-row flex-col mb-4.5 gap-3">
                    <div className="flex items-center flex-wrap">
                        <button type="button" onClick={(e) => setOpenModal(true)} className="btn btn-primary btn-sm m-1 " >
                            <IconPlus className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                            {t('add')}
                        </button>
                        <button type="button" className="btn btn-primary btn-sm m-1" >
                            <IconFolderMinus className="ltr:mr-2 rtl:ml-2" />
                            Nhập file
                        </button>
                        <button type="button" className="btn btn-primary btn-sm m-1" >
                            <IconDownload className="ltr:mr-2 rtl:ml-2" />
                            Xuất file excel
                        </button>
                    </div>
                    <div className='flex gap-2'>
                        <div className='flex gap-1'>
                        <div className="flex items-center w-auto">Hiển thị</div>
                            <select className="form-select w-auto">
                                <option>Tất cả</option>
                                <option>Ca theo thời gian</option>
                                <option>Ca theo tổng số giờ</option>
                            </select>
                        </div>
                    <input type="text" className="form-input w-auto" placeholder={`${t('search')}`} onChange={(e) => handleSearch(e)} />
                        </div>
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
            <ShiftModal
                openModal={openModal}
                setOpenModal={setOpenModal}
                data={data}
                totalData={getStorge}
                setData={setData}
                setGetStorge={setGetStorge}
            />
             <DetailModal
                openModal={openDetail}
                setOpenModal={setOpenDetail}
                data={data}
                totalData={getStorge}
                setData={setData}
                setGetStorge={setGetStorge}
            />
        </div>
    );
};

export default Shift;
