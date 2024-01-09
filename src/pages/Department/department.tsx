import { useEffect, Fragment, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { lazy } from 'react';
// Third party libs
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import Swal from 'sweetalert2';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useTranslation } from 'react-i18next';
// API
import { deleteDepartment, detailDepartment, listAllDepartment } from '../../services/apis/department';
// constants
import { PAGE_SIZES, PAGE_SIZES_DEFAULT, PAGE_NUMBER_DEFAULT } from '../../libs/constants';
// helper
import { capitalize, formatDate, showMessage } from '../../libs/helper';
// icons
import IconPrinter from '../../components/Icon/IconPrinter';
import IconPlus from '../../components/Icon/IconPlus';
import IconPencil from '../../components/Icon/IconPencil';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import IconDownload from '../../components/Icon/IconDownload';
import IconFile from '../../components/Icon/IconFile';
import IconFolderMinus from '../../components/Icon/IconFolderMinus';

import { usePathname, useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router';
const col = ['departmentCode', 'departmentName', 'numOfHuman'];

const Department = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    useEffect(() => {
        dispatch(setPageTitle(`${t('department')}`));
    });
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

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
                            getDepartMent();
                            showMessage(`${t('delete_department_success')}`, 'success')
                        } else {
                            showMessage(`${t('delete_department_err')}`, 'error')
                        }
                    });
                }
            });
    };
    const getDepartMent = () => {
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
    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams()
            console.log(params.toString())
            params.set(name, value)
            return params.toString()
        },
        [searchParams]
    )
    useEffect(() => {
        // router.push(window.location.pathname + '?' + createQueryString('sort', sortStatus.columnAccessor)
        //     + '&' + createQueryString('sortOrder', sortStatus.direction)
        //     + '&' + createQueryString('page', page.toString())
        //     + '&' + createQueryString('pageSize', pageSize.toString())
        //     + '&' + createQueryString('search', search))

        getDepartMent();
    }, [page, pageSize, sortStatus, search]);


    const exportTable = (type: any) => {
        let columns: any = col;
        let records = recordsData;
        let filename = t('department');

        let newVariable: any;
        newVariable = window.navigator;

        if (type === 'csv') {
            let coldelimiter = ';';
            let linedelimiter = '\n';
            let result = columns
                .map((d: any) => {
                    return capitalize(d);
                })
                .join(coldelimiter);
            result += linedelimiter;
            // eslint-disable-next-line array-callback-return
            records.map((item: any) => {
                // eslint-disable-next-line array-callback-return
                columns.map((d: any, index: any) => {
                    if (index > 0) {
                        result += coldelimiter;
                    }
                    let val = item[d] ? item[d] : '';
                    result += val;
                });
                result += linedelimiter;
            });

            if (result == null) return;
            if (!result.match(/^data:text\/csv/i) && !newVariable.msSaveOrOpenBlob) {
                var data = 'data:application/csv;charset=utf-8,' + encodeURIComponent(result);
                var link = document.createElement('a');
                link.setAttribute('href', data);
                link.setAttribute('download', filename + '.csv');
                link.click();
            } else {
                var blob = new Blob([result]);
                if (newVariable.msSaveOrOpenBlob) {
                    newVariable.msSaveBlob(blob, filename + '.csv');
                }
            }
        } else if (type === 'print') {
            var rowhtml = '<p>' + t('department') + '</p>';
            rowhtml +=
                '<table style="width: 100%; " cellpadding="0" cellcpacing="0"><thead><tr style="color: #515365; background: #eff5ff; -webkit-print-color-adjust: exact; print-color-adjust: exact; "> ';
            // eslint-disable-next-line array-callback-return
            columns.map((d: any) => {
                rowhtml += '<th>' + capitalize(d) + '</th>';
            });
            rowhtml += '</tr></thead>';
            rowhtml += '<tbody>';

            // eslint-disable-next-line array-callback-return
            records.map((item: any) => {
                rowhtml += '<tr>';
                // eslint-disable-next-line array-callback-return
                columns.map((d: any) => {
                    let val = item[d] ? item[d] : '';
                    rowhtml += '<td>' + val + '</td>';
                });
                rowhtml += '</tr>';
            });
            rowhtml +=
                '<style>body {font-family:Arial; color:#495057;}p{text-align:center;font-size:18px;font-weight:bold;margin:15px;}table{ border-collapse: collapse; border-spacing: 0; }th,td{font-size:12px;text-align:left;padding: 4px;}th{padding:8px 4px;}tr:nth-child(2n-1){background:#f7f7f7; }</style>';
            rowhtml += '</tbody></table>';
            var winPrint: any = window.open('', '', 'left=0,top=0,width=1000,height=600,toolbar=0,scrollbars=0,status=0');
            winPrint.document.write('<title>Print</title>' + rowhtml);
            winPrint.document.close();
            winPrint.focus();
            winPrint.print();
        } else if (type === 'txt') {
            let coldelimiter = ',';
            let linedelimiter = '\n';
            let result = columns
                .map((d: any) => {
                    return capitalize(d);
                })
                .join(coldelimiter);
            result += linedelimiter;
            // eslint-disable-next-line array-callback-return
            records.map((item: any) => {
                // eslint-disable-next-line array-callback-return
                columns.map((d: any, index: any) => {
                    if (index > 0) {
                        result += coldelimiter;
                    }
                    let val = item[d] ? item[d] : '';
                    result += val;
                });
                result += linedelimiter;
            });

            if (result == null) return;
            if (!result.match(/^data:text\/txt/i) && !newVariable.msSaveOrOpenBlob) {
                var data1 = 'data:application/txt;charset=utf-8,' + encodeURIComponent(result);
                var link1 = document.createElement('a');
                link1.setAttribute('href', data1);
                link1.setAttribute('download', filename + '.txt');
                link1.click();
            } else {
                var blob1 = new Blob([result]);
                if (newVariable.msSaveOrOpenBlob) {
                    newVariable.msSaveBlob(blob1, filename + '.txt');
                }
            }
        }
    };

    return (
        <div>
            {showLoader && (
                <div className="screen_loader fixed inset-0 bg-[#fafafa] dark:bg-[#060818] z-[60] grid place-content-center animate__animated">
                    <svg width="64" height="64" viewBox="0 0 135 135" xmlns="http://www.w3.org/2000/svg" fill="#4361ee">
                        <path d="M67.447 58c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10zm9.448 9.447c0 5.523 4.477 10 10 10 5.522 0 10-4.477 10-10s-4.478-10-10-10c-5.523 0-10 4.477-10 10zm-9.448 9.448c-5.523 0-10 4.477-10 10 0 5.522 4.477 10 10 10s10-4.478 10-10c0-5.523-4.477-10-10-10zM58 67.447c0-5.523-4.477-10-10-10s-10 4.477-10 10 4.477 10 10 10 10-4.477 10-10z">
                            <animateTransform attributeName="transform" type="rotate" from="0 67 67" to="-360 67 67" dur="2.5s" repeatCount="indefinite" />
                        </path>
                        <path d="M28.19 40.31c6.627 0 12-5.374 12-12 0-6.628-5.373-12-12-12-6.628 0-12 5.372-12 12 0 6.626 5.372 12 12 12zm30.72-19.825c4.686 4.687 12.284 4.687 16.97 0 4.686-4.686 4.686-12.284 0-16.97-4.686-4.687-12.284-4.687-16.97 0-4.687 4.686-4.687 12.284 0 16.97zm35.74 7.705c0 6.627 5.37 12 12 12 6.626 0 12-5.373 12-12 0-6.628-5.374-12-12-12-6.63 0-12 5.372-12 12zm19.822 30.72c-4.686 4.686-4.686 12.284 0 16.97 4.687 4.686 12.285 4.686 16.97 0 4.687-4.686 4.687-12.284 0-16.97-4.685-4.687-12.283-4.687-16.97 0zm-7.704 35.74c-6.627 0-12 5.37-12 12 0 6.626 5.373 12 12 12s12-5.374 12-12c0-6.63-5.373-12-12-12zm-30.72 19.822c-4.686-4.686-12.284-4.686-16.97 0-4.686 4.687-4.686 12.285 0 16.97 4.686 4.687 12.284 4.687 16.97 0 4.687-4.685 4.687-12.283 0-16.97zm-35.74-7.704c0-6.627-5.372-12-12-12-6.626 0-12 5.373-12 12s5.374 12 12 12c6.628 0 12-5.373 12-12zm-19.823-30.72c4.687-4.686 4.687-12.284 0-16.97-4.686-4.686-12.284-4.686-16.97 0-4.687 4.686-4.687 12.284 0 16.97 4.686 4.687 12.284 4.687 16.97 0z">
                            <animateTransform attributeName="transform" type="rotate" from="0 67 67" to="360 67 67" dur="8s" repeatCount="indefinite" />
                        </path>
                    </svg>
                </div>
            )}
            <div className="panel mt-6">
                <div className="flex md:items-center justify-between md:flex-row flex-col mb-4.5 gap-5">
                    <div className="flex items-center flex-wrap">
                        <button type="button" onClick={(e) => setModalAdd(true)} className="btn btn-primary btn-sm m-1 ">
                            <IconPlus className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                            {t('add')}
                        </button>
                        <button type="button" onClick={() => exportTable('print')} className="btn btn-primary btn-sm m-1">
                            <IconPrinter className="ltr:mr-2 rtl:ml-2" />
                            {t('print')}
                        </button>
                        <button type="button" className="btn btn-primary btn-sm m-1">
                            <IconFolderMinus className="ltr:mr-2 rtl:ml-2" />
                            Nhập file
                        </button>
                        <button type="button" className="btn btn-primary btn-sm m-1">
                            <IconDownload className="ltr:mr-2 rtl:ml-2" />
                            Xuất file excel
                        </button>
                    </div>

                    <input type="text" className="form-input w-auto" placeholder={`${t('search')}`} onChange={(e) => {
                        if (e.target.value === "") {
                            setSearch("")
                        }
                    }}
                        onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                setSearch(e.target.value)
                            }
                        }} />
                </div>
                <div className="datatables">
                    <DataTable
                        highlightOnHover
                        className="whitespace-nowrap table-hover"
                        records={recordsData}
                        columns={[
                            {
                                accessor: 'id',
                                title: '#',
                                render: (records, index) => <span>{(page - 1) * pageSize + index + 1}</span>,
                            },
                            { accessor: 'departmentCode', title: 'Mã phòng ban', sortable: true },
                            { accessor: 'departmentName', title: 'Tên phòng ban', sortable: true },
                            { accessor: 'numOfHuman', title: 'Số nhân viên', sortable: true },

                            {
                                accessor: 'action',
                                title: 'Thao tác',
                                titleClassName: '!text-center',
                                render: (records) => (
                                    <div className="flex items-center w-max mx-auto gap-2">
                                        <Tippy content={`${t('edit')}`}>
                                            <button type="button" onClick={() => handleEditDepartment(records)}>
                                                <IconPencil />
                                            </button>
                                        </Tippy>
                                        <Tippy content={`${t('delete')}`}>
                                            <button type="button" onClick={() => handleDeleteDepartment(records)}>
                                                <IconTrashLines />
                                            </button>
                                        </Tippy>
                                    </div>
                                ),
                            },
                        ]}
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
            <AddDepartmentModal open={modalAdd} handleModal={handleModalAdd} getDepartMent={getDepartMent} />
            <EditDepartmentModal open={modalEdit} handleModal={handleModalEdit} dataEdit={dataEdit} getDepartMent={getDepartMent} />
        </div>
    );
};

const AddDepartmentModal = lazy(() => import('./modal/addDepartmentModal'));
const EditDepartmentModal = lazy(() => import('./modal/editDepartmentModal'));

export default Department;
