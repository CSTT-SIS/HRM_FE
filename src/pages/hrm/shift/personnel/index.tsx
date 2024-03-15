import { useEffect, Fragment, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../../store/themeConfigSlice';
import { lazy } from 'react';
// Third party libs
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import Swal from 'sweetalert2';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useTranslation } from 'react-i18next';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { Vietnamese } from "flatpickr/dist/l10n/vn.js"
// ** Styles
//
import "flatpickr/dist/plugins/monthSelect/style.css"
import monthSelectPlugin, { Config } from "flatpickr/dist/plugins/monthSelect"
import { deleteDepartment, detailDepartment, listAllDepartment } from '../../../../services/apis/department.api';
// constants
import { PAGE_SIZES, PAGE_SIZES_DEFAULT, PAGE_NUMBER_DEFAULT } from '@/utils/constants';
// helper
import { capitalize, formatDate, showMessage } from '@/@core/utils';
// icons
import IconPencil from '../../../../components/Icon/IconPencil';
import IconTrashLines from '../../../../components/Icon/IconTrashLines';
import { IconLoading } from '@/components/Icon/IconLoading';
import IconPlus from '@/components/Icon/IconPlus';

import { useRouter } from 'next/router';

// json
import IconDownload from '@/components/Icon/IconDownload';
import IconEye from '@/components/Icon/IconEye';
import IconChecks from '@/components/Icon/IconChecks';
import { getDaysOfMonth } from '@/utils/commons';

import personnel_list from './personnel_list.json';
import IconFolderMinus from '@/components/Icon/IconFolderMinus';

interface Props {
    [key: string]: any;
}

interface Day {
    dayMonth: string,
    dayWeek: string
}

const monthSelectConfig: Partial<Config> = {
    shorthand: true, //defaults to false
    dateFormat: "m/Y", //defaults to "F Y"
    theme: "light" // defaults to "light"
};

const TimekeepingHistory = ({ ...props }: Props) => {

    const dispatch = useDispatch();
    const { t } = useTranslation();
   
    const router = useRouter();
    const [showLoader, setShowLoader] = useState(true);
    const [page, setPage] = useState<any>(PAGE_NUMBER_DEFAULT);
    const [pageSize, setPageSize] = useState(PAGE_SIZES_DEFAULT);
    const [recordsData, setRecordsData] = useState<any>();
    const [total, setTotal] = useState(0);
    const [getStorge, setGetStorge] = useState<any>();
    const [data, setData] = useState<any>();
    const [listDay, setListDay] = useState<undefined | string[]>(undefined);

    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'desc' });

    const [openModal, setOpenModal] = useState(false);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setGetStorge(personnel_list);
            localStorage.setItem('employeeList', JSON.stringify(personnel_list));
        }
    }, [])

    useEffect(() => {
        setTotal(getStorge?.length);
        setPageSize(PAGE_SIZES_DEFAULT);
        setRecordsData(getStorge?.filter((item: any, index: any) => { return index <= 9 && page === 1 ? item : index >= 10 && index <= (page * 9) ? item : null }));
        const listDay_ = getDaysOfMonth(currentYear, currentMonth);
        setListDay(listDay_);
    }, [getStorge, getStorge?.length, page])

    useEffect(() => {
        setShowLoader(false);
    }, [recordsData])

    const handleEdit = (data: any) => {
        setOpenModal(true);
        setData(data);
    };
    const handleChangeMonth = (selectedDates: any, dateStr: any) => {
        const date_str = selectedDates[0] ?? ""
        console.log(date_str, selectedDates)
        const year: number = date_str.getFullYear();
        const month: number = date_str.getMonth() + 1;
        const listDay = getDaysOfMonth(year, month);
        setListDay(listDay);
    }
    const handleDelete = (data: any) => {
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
                title: `${t('delete_department')}`,
                text: `${t('delete')} ${data.name}`,
                padding: '2em',
                showCancelButton: true,
                cancelButtonText: `${t('cancel')}`,
                confirmButtonText: `${t('confirm')}`,
                reverseButtons: true,
            })
            .then((result) => {
                if (result.value) {
                    const value = getStorge.filter((item: any) => { return (item.id !== data.id) });
                    localStorage.setItem('employeeList', JSON.stringify(value));
                    setGetStorge(value);
                    showMessage(`${t('delete_department_success')}`, 'success')
                }
            });
    };
    const handleCheck = (data: any) => {
        const swalChecks = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-secondary',
                cancelButton: 'btn btn-danger ltr:mr-3 rtl:ml-3',
                popup: 'sweet-alerts',
            },
            buttonsStyling: false,
        });
        swalChecks
            .fire({
                title: `${t('check_timekeeping')}`,
                text: `${t('check')} ${data.name}`,
                padding: '2em',
                showCancelButton: true,
                cancelButtonText: `${t('cancel')}`,
                confirmButtonText: `${t('confirm')}`,
                reverseButtons: true,
            })
            .then((result) => {
                if (result.value) {
                    const value = getStorge.filter((item: any) => { return (item.id !== data.id) });
                    localStorage.setItem('employeeList', JSON.stringify(value));
                    setGetStorge(value);
                    showMessage(`${t('check_timekeeping_success')}`, 'success')
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

        {
            accessor: 'name',
            title: 'Tên nhân viên', sortable: false,
        },
        {
            accessor: 'code',
            title: 'Mã nhân viên', sortable: false
        },
        {
            accessor: 'department',
            title: 'Phòng ban', sortable: false
        },
        {
            accessor: 'duty',
            title: 'Chức vụ', sortable: false
        }
    ]


    return (
        <div>
            {showLoader && (
                <div className="screen_loader fixed inset-0 bg-[#fafafa] dark:bg-[#060818] z-[60] grid place-content-center animate__animated">
                    <IconLoading />
                </div>
            )}
            <div className="panel mt-6">
                <div className="flex md:items-end justify-end md:flex-row flex-col mb-4.5 gap-5">
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

        </div>
    );
};

export default TimekeepingHistory;
