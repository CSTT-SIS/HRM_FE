import { useEffect, Fragment, useState, useRef } from 'react';
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

// json
import TimekeepingList from './timekeeping_fake.json';
import IconFolderMinus from '@/components/Icon/IconFolderMinus';
import IconDownload from '@/components/Icon/IconDownload';
import IconEye from '@/components/Icon/IconEye';
import IconChecks from '@/components/Icon/IconChecks';
import IconNewEye from '@/components/Icon/IconNewEye';
import IconNewCheck from '@/components/Icon/IconNewCheck';
import IconNewTrash from '@/components/Icon/IconNewTrash';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { toDateStringMonth } from '@/utils/commons';
import monthSelectPlugin, { Config } from "flatpickr/dist/plugins/monthSelect"
import "flatpickr/dist/plugins/monthSelect/style.css"


const monthSelectConfig: Partial<Config> = {
    shorthand: true, //defaults to false
    dateFormat: "F Y", //defaults to "F Y"
    theme: "light" // defaults to "light"
};

interface Props {
    [key: string]: any;
}

const Department = ({ ...props }: Props) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
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

    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'desc' });

    const [openModal, setOpenModal] = useState(false);
    const getCurrentMonth = () => {
        var currentDate = new Date();

        // Lấy tháng và năm hiện tại
        var month = currentDate.getMonth() + 1; // Tháng bắt đầu từ 0 nên cần cộng thêm 1
        var year = currentDate.getFullYear();

        // Chuyển đổi tháng và năm thành chuỗi và kết hợp lại với nhau
        var dateString = month.toString() + '-' + year.toString();

        return dateString;
    }
    const [currentTime, setCurrentTime] = useState<any>(getCurrentMonth())



    useEffect(() => {
        if (typeof window !== 'undefined') {
            const data = localStorage.getItem('TimekeepingList');
            if (data) {
                setGetStorge(JSON.parse(data));
            } else {
                localStorage.setItem('TimekeepingList', JSON.stringify(TimekeepingList));
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
        {
            accessor: 'action',
            title: 'Thao tác',
            titleClassName: '!text-center',
            render: (records: any) => (
                <div className="flex items-center w-max mx-auto gap-2">
                    <Tippy content={`${t('detail')}`}>
                        <Link href="/hrm/timekeeping-detail-table" className="button-detail">
                            <IconNewEye /><span>
                                {t('detail')}
                            </span>
                        </Link>

                    </Tippy>
                    <Tippy content={`${t('check')}`}>
                        <button type="button" className="button-check" onClick={() => handleCheck(records)}>
                            <IconNewCheck /> <span>
                                {t('approve')}
                            </span>
                        </button>
                    </Tippy>
                    <Tippy content={`${t('delete')}`}>
                        <button type="button" className='button-delete' onClick={() => handleDelete(records)}>
                            <IconNewTrash />
                            <span>
                                {t('delete')}
                            </span>
                        </button>
                    </Tippy>
                </div>
            ),
        },
    ]
    const getDaysOfWeek = () => {
        return ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    }
    const getDaysInMonthWithWeekdays = (year: any, month: any) => {
        var daysInMonth = [];
        var daysOfWeek = getDaysOfWeek();

        // Tạo một đối tượng ngày cho ngày đầu tiên của tháng
        var date = new Date(year, month - 1, 1);

        // Lặp qua tất cả các ngày trong tháng
        while (date.getMonth() === month - 1) {
            // Lấy thứ tương ứng của ngày hiện tại
            var dayOfWeek = daysOfWeek[date.getDay()];
            var day = date.getDate();

            // Kết hợp ngày và tháng vào chuỗi
            var formattedDate = day + '/' + month;
            // Thêm ngày và thứ vào mảng
            daysInMonth.push({
                accessor: `${day}`,
                title: `${dayOfWeek} ${formattedDate}`
            });

            // Tăng ngày lên 1 để tiếp tục vòng lặp
            date.setDate(date.getDate() + 1);
        }

        return daysInMonth;
    }
    const [column, setColumn] = useState<any>([
        {
            accessor: 'id',
            title: '#',
            render: (records: any, index: any) => <span>{(page - 1) * pageSize + index + 1}</span>,
        },
        { accessor: 'code', title: 'Mã nhân viên', sortable: false },
        { accessor: 'name', title: 'Tên nhân viên', sortable: false },
        ...getDaysInMonthWithWeekdays(parseInt(currentTime.split('-')[1], 10), parseInt(currentTime.split('-')[0], 10))

    ])
    useEffect(() => {
        setColumn([
            {
                accessor: 'id',
                title: '#',
                render: (records: any, index: any) => <span>{(page - 1) * pageSize + index + 1}</span>,
            },
            { accessor: 'code', title: 'Mã nhân viên', sortable: false },
            { accessor: 'name', title: 'Tên nhân viên', sortable: false },
            ...getDaysInMonthWithWeekdays(parseInt(currentTime.split('-')[1], 10), parseInt(currentTime.split('-')[0], 10))

        ])
    }, [currentTime])
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
                        <input type="file" ref={fileInputRef} style={{ display: "none" }} />
                        <button type="button" className="btn btn-primary btn-sm m-1 custom-button" onClick={() => fileInputRef.current?.click()}>
                            <IconFolderMinus className="ltr:mr-2 rtl:ml-2" />
                            Nhập file
                        </button>
                    </div>
                    <div className="flex items-center">
                        <span style={{ display: 'block', width: '100px' }}>{t('choose_month')}</span>

                        <Flatpickr
                            options={{
                                // dateFormat: 'd/m/y',
                                defaultDate: new Date(),
                                plugins: [
                                    monthSelectPlugin(monthSelectConfig) // Sử dụng plugin với cấu hình
                                ]
                            }}

                            value={currentTime}
                            onChange={(date) => setCurrentTime(toDateStringMonth(date[0]))}
                            style={{ marginRight: '10px', width: '150px' }}
                            className="form-input"
                        />
                        <input type="text" className="form-input w-auto" placeholder={`${t('search')}`} onChange={(e) => handleSearch(e)} />

                    </div>
                </div>
                <div className="datatables">
                    <DataTable
                        highlightOnHover
                        className="whitespace-nowrap table-hover custom_table"
                        records={recordsData}
                        columns={column}
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

export default Department;
