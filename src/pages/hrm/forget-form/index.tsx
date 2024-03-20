import { useEffect, Fragment, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { lazy } from 'react';
// Third party libs
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import Swal from 'sweetalert2';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useTranslation } from 'react-i18next';
import dayjs from "dayjs";
import Select from "react-select";

// API
// constants
import { PAGE_SIZES, PAGE_SIZES_DEFAULT, PAGE_NUMBER_DEFAULT } from '@/utils/constants';
// helper
import { capitalize, formatDate, showMessage } from '@/@core/utils';
// icons
import { IconLoading } from '@/components/Icon/IconLoading';
import IconPlus from '@/components/Icon/IconPlus';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { Vietnamese } from "flatpickr/dist/l10n/vn.js"
import "flatpickr/dist/plugins/monthSelect/style.css"
import monthSelectPlugin, { Config } from "flatpickr/dist/plugins/monthSelect"
import list_departments from '../department/department_list.json';

import { useRouter } from 'next/router';

// json
import ForgetFormList from './forget_form.json';
import ForgetFormModal from './modal/ForgetFormModal';
import DetailModal from './modal/DetailModal';
import IconFolderMinus from '@/components/Icon/IconFolderMinus';
import IconDownload from '@/components/Icon/IconDownload';
import IconChecks from '@/components/Icon/IconChecks';
import Link from 'next/link';
import IconNewEdit from '@/components/Icon/IconNewEdit';
import IconNewCheck from '@/components/Icon/IconNewCheck';
import IconNewTrash from '@/components/Icon/IconNewTrash';
import DropdownTreeSelect from "react-dropdown-tree-select";
import "react-dropdown-tree-select/dist/styles.css";
import IconNewEye from '@/components/Icon/IconNewEye';
import IconNewPlus from '@/components/Icon/IconNewPlus';

interface Props {
    [key: string]: any;
}
const monthSelectConfig: Partial<Config> = {
    shorthand: true, //defaults to false
    dateFormat: "m/Y", //defaults to "F Y"
    theme: "light" // defaults to "light"
};
const treeData = [
    {
        label: 'Phòng Hành chính',
        value: '0-0',
        children: [
            { label: 'Bộ phận cấp dưỡng', value: '0-0-1' },
            { label: 'Tổ xe', value: '0-0-2' },
        ],
    },
    {
        label: 'Phòng Kế toán',
        value: '0-1',
    },
];


const ForgetForm = ({ ...props }: Props) => {
    const [treeDataState, setTreeDataState] = useState<any>(treeData)
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [listDepartment, setListDepartment] = useState<any>();

    const dispatch = useDispatch();
    const { t } = useTranslation();
    useEffect(() => {
        dispatch(setPageTitle(`${t('forget_timekeeping_form')}`));
    });
    useEffect(() => {
        const list_temp_department = list_departments?.map((department: any) => {
            return {
                value: department.id,
                label: department.name
            }
        })
        setListDepartment(list_temp_department);
    }, [])
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
            setGetStorge(ForgetFormList);
            localStorage.setItem('lateEarlyFormList', JSON.stringify(ForgetFormList));


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
        router.push(`/hrm/forget-form/${data.id}`)

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
                title: `${t('delete_form')}`,
                text: `${t('delete_form')} ${data.name}`,
                padding: '2em',
                showCancelButton: true,
                cancelButtonText: `${t('cancel')}`,
                confirmButtonText: `${t('confirm')}`,
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
                popup: 'confirm-delete',
            },
            imageUrl: '/assets/images/delete_popup.png',
            buttonsStyling: false,
        });
        swalDeletes
            .fire({
                title: `${t('check_form')}`,
                html: `<span class='confirm-span'>${t('check')}</span> ${data.name}?`,
                padding: '2em',
                showCancelButton: true,
                cancelButtonText: `${t('cancel')}`,
                confirmButtonText: `${t('confirm')}`,
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

    const handleDetail = (e: any) => {
        router.push(`/hrm/forget-form/detail/${e.id}`)
    }

    const columns = [
        {
            accessor: 'id',
            title: '#',
            render: (records: any, index: any) => <span onClick={() => handleDetail(records)}>{(page - 1) * pageSize + index + 1}</span>,
        },
        //     { accessor: 'code', title: `${t('personel_code')}`, sortable: false,
        //     render: (records: any, index: any) => <span onClick={() => handleDetail(records)}>{records?.code}</span>
        // },
        {
            accessor: 'name', title: `${t('personel_name')}`, sortable: false,
            render: (records: any, index: any) => <span onClick={() => handleDetail(records)}>{records?.name}</span>
        },
        {
            accessor: 'position', title: `${t('personel_position')}`, sortable: false,
            render: (records: any, index: any) => <span onClick={() => handleDetail(records)}>{records?.position}</span>
        },
        {
            accessor: 'department', title: `${t('personel_department')}`, sortable: false, render: (records: any, index: any) => <span onClick={() => handleDetail(records)}>{records?.department}</span>
        },
        {
            accessor: 'submitday', title: `${t('submitday')}`, sortable: false, render: (records: any, index: any) => <span onClick={(records) => handleDetail(records)}>{`${dayjs(records?.submitday).format("DD/MM/YYYY")}`}</span>
        },
        //     { accessor: 'fromdate', title: `${t('fromdate')}`, sortable: false,         render: (records: any, index: any) => <span onClick={() => handleDetail(records)}>{records?.fromdate}</span>
        // },
        //     { accessor: 'enddate', title: `${t('enddate')}`, sortable: false,         render: (records: any, index: any) => <span onClick={() => handleDetail(records)}>{records?.enddate}</span>
        // },
        { accessor: 'shift', title: `${t('late_early_shift')}`, sortable: false, render: (records: any, index: any) => <span onClick={() => handleDetail(records)}>{records?.shift}</span> },
        { accessor: 'checker', title: `${t('checker')}`, sortable: false, render: (records: any, index: any) => <span onClick={() => handleDetail(records)}>{records?.checker}</span> },
        { accessor: 'isCheck',
         title: `${t('status')}`,
          sortable: false,
          render: (records: any, index: any) => <span className={`badge badge-outline-${records?.isCheck ? "success" : "danger"} `} onClick={() => handleDetail(records)}>{records?.isCheck ? `${t('isCheckTrue')}` : `${t('isCheckFalse')}`}</span>
    },
    {
        accessor: 'action',
        title: 'Thao tác',
        titleClassName: '!text-center',
        render: (records: any) => (
         <div className="mx-auto flex items-center gap-2 justify-center">
                    <div className="w-[80px]">
                        <button type="button" className='button-detail' onClick={() => handleDetail(records)}>
                            <IconNewEye /><span>
                                {t('detail')}
                            </span>
                        </button>
                    </div>
                    <div className="w-[60px]">
                        <button type="button" className='button-edit' onClick={() => handleEdit(records)}>
                            <IconNewEdit /><span>
                                {t('edit')}
                            </span>
                        </button>
                    </div>
                    <div className="w-[80px]">
                        <button type="button" className='button-delete' onClick={() => handleDelete(records)}>
                            <IconNewTrash />
                            <span>
                                {t('delete')}
                            </span>
                        </button>
                    </div>
                    {/* <button type="button" className='button-download1'>
						<IconNewDownload />
                        <span>{t('download')}</span>
					</button> */}
                </div>
            )
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
                <div className="flex md:items-center justify-between md:flex-row flex-col mb-4.5 gap-5">
                    <div className="flex items-center flex-wrap">
                        <Link href="/hrm/forget-form/create">
                            <button type="button" className=" m-1 button-table button-create" >
                                <IconNewPlus />
                                <span className="uppercase">{t('add')}</span>
                            </button>
                        </Link>
                        <input autoComplete="off" type="file" ref={fileInputRef} style={{ display: "none" }} />
                        {/* <button type="button" className="btn btn-primary btn-sm m-1 custom-button" onClick={() => fileInputRef.current?.click()}>
                            <IconFolderMinus className="ltr:mr-2 rtl:ml-2" />
                            Nhập file
                        </button>
                        <button type="button" className="btn btn-primary btn-sm m-1 custom-button" >
                            <IconDownload className="ltr:mr-2 rtl:ml-2" />
                            Xuất file excel
                        </button> */}
                    </div>
                    <div className='flex flex-row gap-2'>
                        <div className='flex flex-1 w-[180px]'>
                        <Select
                        className="zIndex-10 w-[100%]"
                                                            id='unidepartmentparentIdtId'
                                                            name='departmentparentId'
                                                            placeholder={t('choose_department')}
                                                            options={listDepartment}
                                                            maxMenuHeight={160}
                                                        />
                                                        </div>
                        <div className='flex flex-1'>
                        <Flatpickr
                            className='form-input'
                            options = {{
                            // dateFormat: 'd/m/y',
                            defaultDate: new Date(),
                            locale: {
                                ...Vietnamese
                            },
                                plugins: [
                                    monthSelectPlugin(monthSelectConfig) // Sử dụng plugin với cấu hình
                                ]
                            }}
                            onChange={(selectedDates, dateStr, instance) => {
                                // Xử lý sự kiện thay đổi ngày tháng ở đây
                            }}
                         />
                        </div>
                        <div className='flex flex-1'>
                            <Flatpickr
                                className='form-input'
                                options={{
                                    // dateFormat: 'd/m/y',
                                    defaultDate: new Date(),
                                    locale: {
                                        ...Vietnamese
                                    },
                                    plugins: [
                                        monthSelectPlugin(monthSelectConfig) // Sử dụng plugin với cấu hình
                                    ]
                                }}
                                onChange={(selectedDates, dateStr, instance) => {
                                    // Xử lý sự kiện thay đổi ngày tháng ở đây
                                }}
                            />
                        </div>
                        <div className='flex flex-1'>
                            <input autoComplete="off" type="text" className="form-input w-auto" placeholder={`${t('search')}`} onChange={(e) => handleSearch(e)} />
                        </div>
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
            <ForgetFormModal
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

export default ForgetForm;
