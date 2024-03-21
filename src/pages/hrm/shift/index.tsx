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
import Select from 'react-select';

import { useRouter } from 'next/router';
import ShiftModal from './modal/ShiftModal';
import shiftList from './shift.json';
// json
import IconNewEdit from '@/components/Icon/IconNewEdit';
import IconNewTrash from '@/components/Icon/IconNewTrash';
import IconNewPlus from '@/components/Icon/IconNewPlus';
import { Shifts } from '@/services/swr/shift.twr';
import { deleteShift } from '@/services/apis/shift.api';

interface Props {
    [key: string]: any;
}

const Duty = ({ ...props }: Props) => {

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
    const list_type = [
        {
            value: 'all',
            label: `${t('all')}`
        },
        {
            value: 'active',
            label: `${t('shift_base_time')}`
        },
        {
            value: 'inactive',
            label: `${t('shift_base_total_time')}`
        }
    ]

        // get data
    const { data: unit, pagination, mutate } = Shifts({ sortBy: 'id.ASC', ...router.query });

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
        setShowLoader(false);
    }, [recordsData])

    const handleEdit = (data: any) => {
		router.push(`/hrm/shift/${data.id}`)
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
                title: `${t('delete_shift')}`,
				html: `<span class='confirm-span'>${t('confirm_delete')}</span> ${data.name_shift}?`,
                padding: '2em',
                showCancelButton: true,
                cancelButtonText: `${t('cancel')}`,
                confirmButtonText: `${t('confirm')}`,
				reverseButtons: true,
            })
            .then((result) => {
                 if (result.value) {
                    deleteShift({ id }).then(() => {
                        mutate();
                        showMessage(`${t('delete_shift_success')}`, 'success');
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

    const handleDetail = (data: any) => {
        setData(data);
    };
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
    //         { accessor: 'break_from_time',
    //         title: `${t('break_from_time')}`, sortable: false,         render: (records: any, index: any) => <span onClick={(records) => handleDetail(records)}>{records?.break_from_time}</span>
    //     },
    //     { accessor: 'break_end_time',
    //      title: `${t('break_end_time')}`, sortable: false,         render: (records: any, index: any) => <span onClick={() => handleDetail(records)}>{records?.break_end_time}</span>
    // },
    { accessor: 'time_total', title: `${t('time_shift')}`, sortable: false,         render: (records: any, index: any) => <span onClick={() => handleDetail(records)}>{records?.time_total}</span>
},
// { accessor: 'description', title: `${t('description')}`, sortable: false,         render: (records: any, index: any) => <span onClick={() => handleDetail(records)}>{records?.description}</span>
// },
        {
            accessor: 'action',
            title: 'Thao tác',
            titleClassName: '!text-center',
            render: (records: any) => (
                <div className="flex items-center w-max mx-auto gap-2">
                                        <div className="w-[80px]">

                        <Link href={`/hrm/shift/detail/${records?.id}`}>
                            <button type='button' className='button-detail'>
                                <IconNewEye /> <span>{t('detail')}</span>
                            </button>
                            </Link>
                            </div>
                            <div className="w-[60px]">

                    <button type="button"  className='button-edit' onClick={() => handleEdit(records)}>
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
            <title>{t('shift')}</title>
            <div className="panel mt-6">
                <div className="flex md:items-center justify-between md:flex-row flex-col mb-4.5 gap-5">
                    <div className="flex items-center flex-wrap">
                        <Link href="/hrm/shift/create">
                        <button type="button" className=" m-1 button-table button-create" >
								<IconNewPlus/>
								<span className="uppercase">{t('add')}</span>
							</button>
                        </Link>

                        {/* <button type="button" className="btn btn-primary btn-sm m-1 custom-button" >
                            <IconFolderMinus className="ltr:mr-2 rtl:ml-2" />
                            Nhập file
                        </button>
                        <button type="button" className="btn btn-primary btn-sm m-1 custom-button" >
                            <IconDownload className="ltr:mr-2 rtl:ml-2" />
                            Xuất file excel
                        </button> */}
                    </div>
                    <div className='flex gap-2'>
                        <div className='flex gap-1'>
                        <div className="flex-1">
                        <Select
                        className='w-[150px] zIndex-10'
                                    id='unidepartmentparentIdtId'
                                    name='departmentparentId'
                                    // defaultValue='all'
                                    placeholder={t('choose_type_shift')}
                                    // onInputChange={e => handleSearch(e)}
                                    options={list_type}
                                    maxMenuHeight={160}
                                />
                        </div>
                        <div className="flex-1">
                        <input autoComplete="off" type="text" className="form-input w-auto" placeholder={`${t('search')}`} onChange={(e) => handleSearch(e)} />

</div>
                        </div>
                        </div>
                </div>
                <div className="datatables">
                      <DataTable
                        highlightOnHover
                        className="whitespace-nowrap table-hover custom_table"
                        records={unit?.data}
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
            <ShiftModal
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

export default Duty;
