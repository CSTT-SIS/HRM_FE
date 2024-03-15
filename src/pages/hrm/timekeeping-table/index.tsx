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
import { deleteDepartment, detailDepartment, listAllDepartment } from '../../../services/apis/department.api';
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
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { Vietnamese } from "flatpickr/dist/l10n/vn.js"
// ** Styles
//
import "flatpickr/dist/plugins/monthSelect/style.css"
import monthSelectPlugin, { Config } from "flatpickr/dist/plugins/monthSelect"
// json
import TimekeepingList from './timekeeping_fake.json';
import DepartmentModal from './modal/DepartmentModal';
import IconFolderMinus from '@/components/Icon/IconFolderMinus';
import IconDownload from '@/components/Icon/IconDownload';
import IconEye from '@/components/Icon/IconEye';
import IconChecks from '@/components/Icon/IconChecks';
import IconNewEye from '@/components/Icon/IconNewEye';
import IconNewCheck from '@/components/Icon/IconNewCheck';
import IconNewTrash from '@/components/Icon/IconNewTrash';
import IconNewDownload2 from '@/components/Icon/IconNewDownload2';
import IconNewPlus from '@/components/Icon/IconNewPlus';
import { getDaysOfMonth } from '@/utils/commons';


interface Props {
    [key: string]: any;
}
const monthSelectConfig: Partial<Config> = {
    shorthand: true, //defaults to false
    dateFormat: "m/Y", //defaults to "F Y"
    theme: "light" // defaults to "light"
};

const Department = ({ ...props }: Props) => {

    const dispatch = useDispatch();
    const { t } = useTranslation();
    useEffect(() => {
        dispatch(setPageTitle(`${t('timekeeping-table')}`));
    });

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

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setGetStorge(TimekeepingList);
            localStorage.setItem('TimekeepingList', JSON.stringify(TimekeepingList));
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
                popup: 'confirm-delete',
            },
            imageUrl: '/assets/images/delete_popup.png',
            buttonsStyling: false,
        });
        swalDeletes
            .fire({
                title: `${t('delete_department')}`,
                html: `<span class='confirm-span'>${t('confirm_delete')}</span> ${data.name}?`,
                padding: '2em',
                showCancelButton: true,
                cancelButtonText: `${t('cancel')}`,
                confirmButtonText: `${t('confirm')}`,
                reverseButtons: true,
            })
            .then((result) => {
                if (result.value) {
                    const value = getStorge.filter((item: any) => { return (item.id !== data.id) });
                    localStorage.setItem('TimekeepingList', JSON.stringify(value));
                    setGetStorge(value);
                    showMessage(`${t('delete_department_success')}`, 'success')
                }
            });
    };
    const handleChangeMonth = (selectedDates: any, dateStr: any) => {
        const date_str = selectedDates[0] ?? ""
        console.log(date_str, selectedDates)
        const year: number = date_str.getFullYear();
        const month: number = date_str.getMonth() + 1;
        const listDay = getDaysOfMonth(year, month);
        setListDay(listDay);
    }
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
                    localStorage.setItem('TimekeepingList', JSON.stringify(value));
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
        { accessor: 'code', title: 'Mã nhân viên', sortable: false },
        { accessor: 'name', title: 'Tên nhân viên', sortable: false },
        { accessor: 'standard_working_hours', title: 'Số công chuẩn', sortable: false },
        { accessor: 'regular_workday_hours', title: 'Công ngày thường', sortable: false },
        { accessor: 'non_working_day_hours', title: 'Công ngày nghỉ', sortable: false },
        { accessor: 'holiday_hours', title: 'Công ngày lễ', sortable: false },
        { accessor: 'overtime_with_pay', title: 'Làm thêm', sortable: false },
        { accessor: 'leave_of_absence', title: 'Nghỉ phép', sortable: false },
        { accessor: 'holiday_leave', title: 'Nghỉ lễ', sortable: false },
        { accessor: 'business_trip', title: 'Công tác', sortable: false },
        { accessor: 'total_hours_worked', title: 'Tổng công thực tế', sortable: false },
        {
            accessor: 'action',
            title: 'Thao tác',
            titleClassName: '!text-center',
            render: (records: any) => (
                <div className="flex items-center w-max mx-auto gap-2">
                    <div className="w-[80px]">
                        <Link href={`/hrm/timekeeping-table/${records.id}`} className="button-detail">
                            <IconNewEye /><span>
                                {t('detail')}
                            </span>
                        </Link>

                    </div>
                    <div className="w-[80px]">
                        <button type="button" className='button-delete' onClick={() => handleDelete(records)}>
                            <IconNewTrash />
                            <span>
                                {t('delete')}
                            </span>
                        </button>
                    </div>
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
                        {/* <Link href="/hrm/overtime-form/AddNewForm">
                        <button type="button" className="btn btn-primary btn-sm m-1 custom-button" >
                                    <IconPlus className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                                    {t('add')}
                                    </button>
                        </Link> */}

                        {/* <button type="button" className="btn btn-primary btn-sm m-1 custom-button" >
                            <IconFolderMinus className="ltr:mr-2 rtl:ml-2" />
                            Nhập file
                        </button> */}
                        <button type="button" className="button-table button-download m-1" >
                            <IconNewDownload2/>
                            <span className="uppercase">Xuất file excel</span>
                        </button>

                    </div>
                    <div className="flex items-center flex-wrap">
                        <button type="button" className="button-table button-import m-1" >
                            <IconNewPlus />
                            <span className="uppercase"> Tổng hợp</span>
                        </button>
                        <button type="button" className="button-table" style={{paddingLeft: "5px", paddingRight: "5px"}}>
                            <IconChecks/>
                            <span className="uppercase">Khóa công tổng hợp</span>
                            </button>

                        {/* <input type="text" className="form-input w-auto" placeholder={`${t('search')}`} onChange={(e) => handleSearch(e)} /> */}

                    </div>
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
            <DepartmentModal
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

export default Department;
