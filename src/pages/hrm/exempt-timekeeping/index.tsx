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
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { Vietnamese } from "flatpickr/dist/l10n/vn.js"
// ** Styles
//
import "flatpickr/dist/plugins/monthSelect/style.css"
import monthSelectPlugin, { Config } from "flatpickr/dist/plugins/monthSelect"
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
import DayList from './dayOfMonth_list.json'
import EmployeeList from './employee_list.json';
import TimekeepingModal from './modal/TimekeepingModal';
import IconFolderMinus from '@/components/Icon/IconFolderMinus';
import IconDownload from '@/components/Icon/IconDownload';
import IconEye from '@/components/Icon/IconEye';
import IconChecks from '@/components/Icon/IconChecks';
import { getDaysOfMonth, toDateString } from '@/utils/commons';
import Link from 'next/link';
import IconTrash from '@/components/Icon/IconTrash';
import IconNewPlus from '@/components/Icon/IconNewPlus';
import IconNewDownload2 from '@/components/Icon/IconNewDownload2';
import IconNewTrash from '@/components/Icon/IconNewTrash';


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

const Department = ({ ...props }: Props) => {

    const dispatch = useDispatch();
    const { t } = useTranslation();
    useEffect(() => {
        dispatch(setPageTitle(`${t('timekeeping')}`));
    });
    const [listDay, setListDay] = useState<undefined | string[]>(undefined);
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
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const [isSelected, setIsSelected]= useState<any>(undefined);
    const [isDelete, setDelete]= useState<undefined | string[]>(undefined);
    const [listSelected, setListSelected]= useState<any>([]);
    useEffect(() => {
        if (typeof window !== 'undefined') {
                setGetStorge(EmployeeList);
                localStorage.setItem('employeeList', JSON.stringify(EmployeeList));
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
                title: `${t('delete_timekeeping')}`,
                // text: `${t('delete')} ${data.name}`,
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
    const handleSelect = (data: any, selected: any) => {
        console.log(data, selected);
        let listSelectTempt = [];
        if (selected) {
            listSelectTempt = [...listSelected, data?.id];
        } else {
            listSelectTempt = listSelected?.filter((item: any) => { return item!== data?.id });
        }
        setListSelected(listSelectTempt);
        if (selected || listSelectTempt.length > 0) {
        setIsSelected(true);
        } else {
        setIsSelected(false);
        }
    }

    // const columns = [
    //     {
    //         accessor: 'id',
    //         title: '#',
    //         render: (records: any, index: any) => <span>{(page - 1) * pageSize + index + 1}</span>
    //     },
    //     { accessor: 'code', title: 'Mã chấm công', sortable: false
    // },
    //     { accessor: 'name', title: 'Tên nhân viên', sortable: false,
    // }
    // ]

    // listDay?.map((item: string, columIndex: number) => {
    //     columns.push(
    //         {
    //             accessor: '',
    //             title: item,
    //             render: (records: any, index: any) =>
    //                 // if (columIndex <= 3) {
    //                 //     return <span onClick={() => handleEdit(records)} style={{cursor: "pointer"}}>1</span>
    //                 // } else {
    //                 //     return <div onClick={() => setOpenModal(true)} style={{cursor: "pointer", height: "20px"}}></div>
    //                 // }
    //                 <span onClick={() => handleEdit(records)} style={{cursor: "pointer"}}>1</span>
    //             ,
    //         }
    //     )
    // })
	const columns = [
		{
			accessor: 'id',
			title: '#',
			render: (records: any, index: any) => <span>{(page - 1) * pageSize + index + 1}</span>,
		},
		{ accessor: 'name', title: 'Tên nhân viên', sortable: false },
		{ accessor: 'code', title: 'Mã nhân viên', sortable: false },
		{ accessor: 'department', title: 'Phòng ban', sortable: false },
		{ accessor: 'duty', title: 'Chức vụ', sortable: false },

		{
			accessor: 'action',
			title: 'Thao tác',
			titleClassName: '!text-center',
			render: (records: any) => (
				<div className="mx-auto flex w-max items-center gap-2">
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
	];
    return (
        <div>
            {showLoader && (
                <div className="screen_loader fixed inset-0 bg-[#fafafa] dark:bg-[#060818] z-[60] grid place-content-center animate__animated">
                    <IconLoading />
                </div>
            )}
            <div className="panel mt-6">
                <div className="flex md:items-center justify-between md:flex-row flex-col mb-4.5 gap-1">
                    <div className="flex items-center flex-wrap">
                        <button type="button" className="button-table button-import m-1" onClick={() => setOpenModal(true)}>
                                    <IconNewPlus />
                                                    <span className="uppercase">{t('add_personnel')}</span>
                                    </button>

                        {/* <button type="button" className="btn btn-primary btn-sm m-1 custom-button" >
                            <IconFolderMinus className="ltr:mr-2 rtl:ml-2" />
                            Nhập file
                        </button> */}
                        {/* <button type="button" className="button-table button-download" >
                            <IconNewDownload2 className="ltr:mr-2 rtl:ml-2" />
                            <span className="uppercase">Xuất file excel</span>
                        </button> */}
                           {
                           isSelected && <button type="button" className="btn btn-primary btn-sm m-1 custom-button" onClick={() => handleDelete({})} >
                                    <IconTrash className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                                    {t('delete')}
                                    </button>
                           }
                    </div>
                    <div className='flex gap-2'>
                        {/* <div className='flex gap-1'>
                        <div className="flex items-center min-w-[80px]" style={{width: "50%"}}>{t('choose_month')}</div>
                        <Flatpickr
                            className='form-input'
                            options = {{
                            // dateFormat: 'm/Y',
                            defaultDate: new Date(),
                            locale: {
                                ...Vietnamese
                            },
                                plugins: [
                                    monthSelectPlugin(monthSelectConfig) // Sử dụng plugin với cấu hình
                                ]
                            }}
                            onChange={(selectedDates, dateStr) => {
                               handleChangeMonth(selectedDates, dateStr)
                            }}
                         />
                        </div> */}
                    <input type="text" className="form-input w-auto" placeholder={`${t('search')}`} onChange={(e) => handleSearch(e)} />
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
            <TimekeepingModal
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
