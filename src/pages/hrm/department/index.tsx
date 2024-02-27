import { useEffect, Fragment, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

import { setPageTitle } from '../../../store/themeConfigSlice';
import { lazy } from 'react';
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


// json
import DepartmentList from './department_list.json';
import DepartmentModal from './modal/DepartmentModal';
import IconFolderMinus from '@/components/Icon/IconFolderMinus';
import IconDownload from '@/components/Icon/IconDownload';
import IconCaretDown from '@/components/Icon/IconCaretDown';

import Link from 'next/link';
import AnimateHeight from 'react-animate-height';


interface Props {
    [key: string]: any;
}

const Department = ({ ...props }: Props) => {

    const dispatch = useDispatch();
    const { t } = useTranslation();
    useEffect(() => {
        dispatch(setPageTitle(`${t('department')}`));
    });

    const router = useRouter();

    const [display, setDisplay] = useState('tree')
    const [showLoader, setShowLoader] = useState(true);
    const [page, setPage] = useState<any>(PAGE_NUMBER_DEFAULT);
    const [pageSize, setPageSize] = useState(PAGE_SIZES_DEFAULT);
    const [recordsData, setRecordsData] = useState<any>();
    const [total, setTotal] = useState(0);
    const [getStorge, setGetStorge] = useState<any>();
    const [data, setData] = useState<any>();
    const [treeview1, setTreeview1] = useState<string[]>(['images']);

    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'desc' });

    const [openModal, setOpenModal] = useState(false);

    const toggleTreeview1 = (name: any) => {
        if (treeview1.includes(name)) {
            setTreeview1((value) => value.filter((d) => d !== name));
        } else {
            setTreeview1([...treeview1, name]);
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const data = localStorage.getItem('departmentList');
            if (data) {
                setGetStorge(JSON.parse(data));
            } else {
                localStorage.setItem('departmentList', JSON.stringify(DepartmentList));
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
                title: `${t('delete_department')}`,
                text: `${t('delete')} ${data.name}`,
                padding: '2em',
                showCancelButton: true,
                reverseButtons: true,
            })
            .then((result) => {
                if (result.value) {
                    const value = getStorge.filter((item: any) => { return (item.id !== data.id) });
                    localStorage.setItem('departmentList', JSON.stringify(value));
                    setGetStorge(value);
                    showMessage(`${t('delete_department_success')}`, 'success')
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
        { accessor: 'name', title: 'Tên phòng ban', sortable: false },
        { accessor: 'code', title: 'Mã phòng ban', sortable: false },

        {
            accessor: 'action',
            title: 'Thao tác',
            titleClassName: '!text-center',
            render: (records: any) => (
                <div className="flex items-center w-max mx-auto gap-2">
                    <Tippy content={`${t('edit')}`}>
                        <button type="button" className='button-edit' onClick={() => handleEdit(records)}>
                            <IconPencil /> Sửa
                        </button>
                    </Tippy>
                    <Tippy content={`${t('delete')}`}>
                        <button type="button" className='button-delete' onClick={() => handleDelete(records)}>
                            <IconTrashLines /> Xóa
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
                <div className="flex md:items-center justify-between md:flex-row flex-col mb-4.5 gap-5">
                    <div className="flex items-center flex-wrap">
                        <Link href="/hrm/department/AddNewDepartment">
                            <button type="button" className="btn btn-primary btn-sm m-1 custom-button" >
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
                    <div className='display-style'>
                        Cách hiển thị
                        <button type="button" className="btn btn-primary btn-sm m-1  custom-button-display" style={{ backgroundColor: display === 'flat' ? '#E9EBD5' : '#FAFBFC' }} onClick={() => setDisplay('flat')}>
                            <img src="/assets/images/display-flat.svg" alt="img" />
                        </button>
                        <button type="button" className="btn btn-primary btn-sm m-1  custom-button-display" style={{ backgroundColor: display === 'tree' ? '#E9EBD5' : '#FAFBFC' }} onClick={() => setDisplay('tree')}>
                            <img src="/assets/images/display-tree.png" alt="img" />
                        </button>
                        <input type="text" className="form-input w-auto" placeholder={`${t('search')}`} onChange={(e) => handleSearch(e)} />

                    </div>
                </div>
                {
                    display === 'tree' ?
                        <div className="mb-5">
                            <ul className="font-semibold">
                                <li className="py-[5px]">
                                    <button type="button" className={`${treeview1.includes('css') ? 'active' : ''}`} onClick={() => toggleTreeview1('css')} style={{ display: 'flex', justifyItems: 'space-between', width: '100%' }}>
                                        <div>
                                            <IconCaretDown className={`w-5 h-5 text-primary inline relative -top-1 ltr:mr-2 rtl:ml-2 ${treeview1.includes('css') && 'rotate-180'}`} />
                                            Ban Giám đốc
                                        </div>
                                        <div className="mx-auto flex w-max items-center gap-2" style={{ marginRight: '0' }}>
                                            <Tippy content={`${t('edit')}`}>
                                                <button type="button" className='button-edit'>
                                                    <IconPencil /> Sửa
                                                </button>
                                            </Tippy>
                                            <Tippy content={`${t('delete')}`}>
                                                <button type="button" className='button-delete'>
                                                    <IconTrashLines /> Xóa
                                                </button>
                                            </Tippy>
                                        </div>
                                    </button>
                                    <AnimateHeight duration={300} height={treeview1.includes('css') ? 'auto' : 0}>
                                        <ul className="sub-menu ltr:pl-14 rtl:pr-14">
                                            <li className="py-[5px]">
                                                Phòng kế hoạch
                                                <div className="mx-auto flex w-max items-center gap-2" style={{ float: 'right' }}>
                                                    <Tippy content={`${t('edit')}`}>
                                                        <button type="button" className='button-edit'>
                                                            <IconPencil /> Sửa
                                                        </button>
                                                    </Tippy>
                                                    <Tippy content={`${t('delete')}`}>
                                                        <button type="button" className='button-delete'>
                                                            <IconTrashLines /> Xóa
                                                        </button>
                                                    </Tippy>
                                                </div>
                                            </li>
                                        </ul>
                                    </AnimateHeight>
                                </li>
                                <li className="py-[5px]">
                                    <button type="button" className={`${treeview1.includes('css') ? 'active' : ''}`} onClick={() => toggleTreeview1('css')} style={{ display: 'flex', justifyItems: 'space-between', width: '100%' }}>
                                        <div>
                                            <IconCaretDown className={`w-5 h-5 text-primary inline relative -top-1 ltr:mr-2 rtl:ml-2 ${treeview1.includes('css') && 'rotate-180'}`} />
                                            Phòng tài chính
                                        </div>
                                        <div className="mx-auto flex w-max items-center gap-2" style={{ marginRight: '0' }}>
                                            <Tippy content={`${t('edit')}`}>
                                                <button type="button" className='button-edit'>
                                                    <IconPencil /> Sửa
                                                </button>
                                            </Tippy>
                                            <Tippy content={`${t('delete')}`}>
                                                <button type="button" className='button-delete'>
                                                    <IconTrashLines /> Xóa
                                                </button>
                                            </Tippy>
                                        </div>
                                    </button>
                                    <AnimateHeight duration={300} height={treeview1.includes('images') ? 'auto' : 0}>
                                        <ul className="ltr:pl-14 rtl:pr-14">
                                            <li className="py-[5px]">
                                                Ban kế toán
                                                <div className="mx-auto flex w-max items-center gap-2" style={{ float: 'right' }}>
                                                    <Tippy content={`${t('edit')}`}>
                                                        <button type="button" className='button-edit'>
                                                            <IconPencil /> Sửa
                                                        </button>
                                                    </Tippy>
                                                    <Tippy content={`${t('delete')}`}>
                                                        <button type="button" className='button-delete'>
                                                            <IconTrashLines /> Xóa
                                                        </button>
                                                    </Tippy>
                                                </div>
                                            </li>
                                            <li className="py-[5px]">
                                                Ban hậu cần
                                                <div className="mx-auto flex w-max items-center gap-2" style={{ float: 'right' }}>
                                                    <Tippy content={`${t('edit')}`}>
                                                        <button type="button" className='button-edit'>
                                                            <IconPencil /> Sửa
                                                        </button>
                                                    </Tippy>
                                                    <Tippy content={`${t('delete')}`}>
                                                        <button type="button" className='button-delete'>
                                                            <IconTrashLines /> Xóa
                                                        </button>
                                                    </Tippy>
                                                </div>
                                            </li>
                                        </ul>
                                    </AnimateHeight>
                                </li>
                            </ul>
                        </div> : <div className="datatables">
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
                }

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
