import { useEffect, Fragment, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { lazy } from 'react';
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

import { useRouter } from 'next/router';

// json
import ExemptFormList from './exempt_form.json';
import ExemptFormModal from './modal/ExemptFormModal';
import DetailModal from './modal/DetailModal';
import IconFolderMinus from '@/components/Icon/IconFolderMinus';
import IconDownload from '@/components/Icon/IconDownload';
import IconChecks from '@/components/Icon/IconChecks';
import Link from 'next/link';


interface Props {
    [key: string]: any;
}

const ExemptForm = ({ ...props }: Props) => {

    const dispatch = useDispatch();
    const { t } = useTranslation();
    useEffect(() => {
        dispatch(setPageTitle(`${t('exempt_form')}`));
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
            const data = localStorage.getItem('lateEarlyFormList');
            if (data) {
                setGetStorge(JSON.parse(data));
            } else {
                localStorage.setItem('lateEarlyFormList', JSON.stringify(ExemptFormList));
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
        router.push(`/hrm/exempt-form/${data.id}`)
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
        { accessor: 'code', title: `${t('personel_code')}`, sortable: false,
        render: (records: any, index: any) => <span onClick={() => handleDetail(records)}>{records?.code}</span>
    },
        { accessor: 'name', title: `${t('personel_name')}`, sortable: false,
        render: (records: any, index: any) => <span onClick={() => handleDetail(records)}>{records?.name}</span>
    },
        { accessor: 'position', title: `${t('personel_position')}`, sortable: false,
        render: (records: any, index: any) => <span onClick={() => handleDetail(records)}>{records?.position}</span>
    },
        { accessor: 'department', title: `${t('personel_department')}`, sortable: false,         render: (records: any, index: any) => <span onClick={() => handleDetail(records)}>{records?.department}</span>
    },
        { accessor: 'submitday', title: `${t('submitday')}`, sortable: false,         render: (records: any, index: any) => <span onClick={(records) => handleDetail(records)}>{records?.submitday}</span>
    },
        { accessor: 'fromdate', title: `${t('fromdate')}`, sortable: false,         render: (records: any, index: any) => <span onClick={() => handleDetail(records)}>{records?.fromdate}</span>
    },
        { accessor: 'enddate', title: `${t('enddate')}`, sortable: false,         render: (records: any, index: any) => <span onClick={() => handleDetail(records)}>{records?.enddate}</span>
    },
        { accessor: 'shift', title: `${t('late_early_shift')}`, sortable: false, render: (records: any, index: any) => <span onClick={() => handleDetail(records)}>{records?.shift}</span> },
        { accessor: 'checker', title: `${t('checker')}`, sortable: false, render: (records: any, index: any) => <span onClick={() => handleDetail(records)}>{records?.checker}</span> },
        { accessor: 'isCheck',
         title: `${t('isCheck')}`,
          sortable: false,
          render: (records: any, index: any) => <span className={`badge badge-outline-${records?.isCheck ? "success" : "danger"} `} onClick={() => handleDetail(records)}>{records?.isCheck ? `${t('isCheckTrue')}` : `${t('isCheckFalse')}`}</span>
    },
    {
        accessor: 'action',
        title: 'Thao tác',
        titleClassName: '!text-center',
        render: (records: any) => (
            <div className="flex items-center w-max mx-auto gap-2">
                <Tippy content={`${t('edit')}`}>
                    <button type="button"  className='button-edit' onClick={() => handleEdit(records)}>
                        <IconPencil /> {t('edit')}
                    </button>
                </Tippy>
                <Tippy content={`${t('check')}`}>
                    <button type="button" className="button-check" onClick={() => handleCheck(records)}>
                        <IconChecks /> {t('approve')}
                    </button>
                </Tippy>
                <Tippy content={`${t('delete')}`}>
                    <button type="button" className='button-delete' onClick={() => handleDelete(records)}>
                        <IconTrashLines /> {t('delete')}
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
            <div className="panel mt-6">
                <div className="flex md:items-center justify-between md:flex-row flex-col mb-4.5 gap-5">
                    <div className="flex items-center flex-wrap">
                        <Link href="/hrm/exempt-form/create">
                            <button type="button" className="btn btn-primary btn-sm m-1 custom-button" onClick={(e) => router.push(`/hrm/exempt-form/create`)}>
                                <IconPlus className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                {t('add')}
                            </button>
                        </Link>
                        <button type="button" className="btn btn-primary btn-sm m-1 custom-button" >
                            <IconFolderMinus className="ltr:mr-2 rtl:ml-2" />
                            Nhập file
                        </button>
                        <button type="button" className="btn btn-primary btn-sm m-1 custom-button" >
                            <IconDownload className="ltr:mr-2 rtl:ml-2" />
                            Xuất file excel
                        </button>
                    </div>
                    <input type="text" className="form-input w-auto" placeholder={`${t('search')}`} onChange={(e) => handleSearch(e)} />
                </div>
                <div className="datatables">
                    <DataTable
                        highlightOnHover
                        className="whitespace-nowrap table-hover custom_table"
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
            <ExemptFormModal
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

export default ExemptForm;
