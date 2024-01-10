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
// component
import LoadingComponent from "@/@core/components/LoadingComponent";
// API
import { deleteDepartment, detailDepartment, listAllDepartment } from '../../../services/apis/department';
// constants
import { PAGE_SIZES, PAGE_SIZES_DEFAULT, PAGE_NUMBER_DEFAULT } from '@/utils/constants';
// helper
import { capitalize, formatDate, showMessage } from '@/@core/utils';
// icons
import IconPrinter from '../../../components/Icon/IconPrinter';
import IconPlus from '../../../components/Icon/IconPlus';
import IconPencil from '../../../components/Icon/IconPencil';
import IconTrashLines from '../../../components/Icon/IconTrashLines';
import IconDownload from '../../../components/Icon/IconDownload';
import IconFile from '../../../components/Icon/IconFile';
import IconFolderMinus from '../../../components/Icon/IconFolderMinus';

import { usePathname, useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router';

const Department = () => {
    /**
     * =======================>>> Initial params <<<=======================
     */
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    /**
     * =======================>>> States <<<=======================
     */

    const [showLoader, setShowLoader] = useState(true);
    const [page, setPage] = useState(PAGE_NUMBER_DEFAULT);
    const [pageSize, setPageSize] = useState(PAGE_SIZES_DEFAULT);
    const [recordsData, setRecordsData] = useState([]);
    const [total, setTotal] = useState(0);

    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'desc' });

    const [dataEdit, setDataEdit] = useState({});

    const [modalAdd, setModalAdd] = useState(false);
    const [modalEdit, setModalEdit] = useState(false);

    /**
     * =======================>>> API calls <<<=======================
     */

    const getDepartment = () => {
        listAllDepartment({
            params: {
                page: page,
                limit: pageSize,
                ...(search && search !== '' && { search }),
                sort: sortStatus.columnAccessor,
                sortOrder: sortStatus.direction,
            },
        }).then((res) => {
            setShowLoader(false)
            setRecordsData(res.data.list);
            setTotal(res.data.total);
        });
    };

    /**
    * =======================>>> Hooks <<<=======================
    */
    useEffect(() => {
        dispatch(setPageTitle(`${t('department')}`));
    });

    useEffect(() => {
        // router.push(window.location.pathname + '?' + createQueryString('sort', sortStatus.columnAccessor)
        //     + '&' + createQueryString('sortOrder', sortStatus.direction)
        //     + '&' + createQueryString('page', page.toString())
        //     + '&' + createQueryString('pageSize', pageSize.toString())
        //     + '&' + createQueryString('search', search))

        getDepartment();
    }, [page, pageSize, sortStatus, search]);

    /**
     * =======================>>> Functions handlers <<<=======================
     */

    const handleModalAdd = () => {
        setModalAdd(false);
    };
    const handleModalEdit = () => {
        setModalEdit(false);
    };

    const handleEditDepartment = (data: any) => {
        detailDepartment({ departmentId: data.id }).then(res => {
            setDataEdit(res.data)
            setModalEdit(true);
        })
    };

    const handleDeleteDepartment = (data: any) => {
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
                text: `${t('delete')} ${data.departmentName}`,
                padding: '2em',
                showCancelButton: true,
                reverseButtons: true,
            })
            .then((result) => {
                if (result.value) {
                    deleteDepartment({
                        departmentId: data.id,
                    }).then((res) => {
                        if (res.status === true) {
                            getDepartment();
                            showMessage(`${t('delete_department_success')}`, 'success')
                        } else {
                            showMessage(`${t('delete_department_err')}`, 'error')
                        }
                    });
                }
            });
    };

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams()
            console.log(params.toString())
            params.set(name, value)
            return params.toString()
        },
        [searchParams]
    )

    return (
        <div>
        { showLoader && (
            <LoadingComponent />
        )}
<div className="panel mt-6" >
    <div className="flex md:items-center justify-between md:flex-row flex-col mb-4.5 gap-5" >
        <div className="flex items-center flex-wrap" >
            <button type="button" onClick = {(e) => setModalAdd(true)} className = "btn btn-primary btn-sm m-1 " >
                <IconPlus className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                    { t('add') }
                    < /button>
                    < button type = "button" className = "btn btn-primary btn-sm m-1" >
                        <IconFolderMinus className="ltr:mr-2 rtl:ml-2" />
                            Nhập file
                                < /button>
                                < button type = "button" className = "btn btn-primary btn-sm m-1" >
                                    <IconDownload className="ltr:mr-2 rtl:ml-2" />
                                        Xuất file excel
                                            < /button>
                                            < /div>
                                            < input type = "text" className = "form-input w-auto" placeholder = {`${t('search')}`} onChange = {(e) => {
    if (e.target.value === "") {
        setSearch("")
    }
}}
onKeyPress = {(e) => {
    if (e.key === "Enter") {
        setSearch(e.target.value)
    }
}} />
    < /div>
    < div className = "datatables" >
        <DataTable
                        highlightOnHover
className = "whitespace-nowrap table-hover"
records = { recordsData }
columns = {
    [
        {
            accessor: 'id',
            title: '#',
            render: (records, index) => <span>{(page - 1) * pageSize + index + 1
        } < /span>,
                            },
    { accessor: 'departmentCode', title: 'Mã phòng ban', sortable: true },
    { accessor: 'departmentName', title: 'Tên phòng ban', sortable: true },
    { accessor: 'numOfHuman', title: 'Số nhân viên', sortable: true },

{
    accessor: 'action',
    title: 'Thao tác',
    titleClassName: '!text-center',
    render: (records) => (
        <div className= "flex items-center w-max mx-auto gap-2" >
        <Tippy content={ `${t('edit')}` }>
            <button type="button" onClick = {() => handleEditDepartment(records)}>
                <IconPencil />
                < /button>
                < /Tippy>
                < Tippy content = {`${t('delete')}`}>
                    <button type="button" onClick = {() => handleDeleteDepartment(records)}>
                        <IconTrashLines />
                        < /button>
                        < /Tippy>
                        < /div>
                                ),
                            },
                        ]}
totalRecords = { total }
recordsPerPage = { pageSize }
page = { page }
onPageChange = {(p) => setPage(p)}
recordsPerPageOptions = { PAGE_SIZES }
onRecordsPerPageChange = { setPageSize }
sortStatus = { sortStatus }
onSortStatusChange = { setSortStatus }
minHeight = { 200}
paginationText = {({ from, to, totalRecords }) => `${t('Showing_from_to_of_totalRecords_entries', { from: from, to: to, totalRecords: totalRecords })}`}
/>
    < /div>
    < /div>
    < AddDepartmentModal open = { modalAdd } handleModal = { handleModalAdd } getDepartment = { getDepartment } />
        <EditDepartmentModal open={ modalEdit } handleModal = { handleModalEdit } dataEdit = { dataEdit } getDepartment = { getDepartment } />
            </div>
    );
};

const AddDepartmentModal = lazy(() => import('./modal/addDepartmentModal'));
const EditDepartmentModal = lazy(() => import('./modal/editDepartmentModal'));

export default Department;
