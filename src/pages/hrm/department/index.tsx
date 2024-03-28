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
// constants
import { PAGE_SIZES, PAGE_SIZES_DEFAULT, PAGE_NUMBER_DEFAULT } from '@/utils/constants';
// helper
import { capitalize, formatDate, showMessage } from '@/@core/utils';
// icons
import IconPencil from '../../../components/Icon/IconPencil';
import IconTrashLines from '../../../components/Icon/IconTrashLines';
import { IconLoading } from '@/components/Icon/IconLoading';
import IconPlus from '@/components/Icon/IconPlus';
import { Departments } from '@/services/swr/department.twr';


// json
import DepartmentList from './department_list.json';
import DepartmentModal from './modal/DepartmentModal';
import IconFolderMinus from '@/components/Icon/IconFolderMinus';
import IconDownload from '@/components/Icon/IconDownload';

import Link from 'next/link';
import { Box } from '@atlaskit/primitives';
import TableTree, { Cell, Header, Headers, Row, Rows } from '@atlaskit/table-tree';
import IconCaretDown from '@/components/Icon/IconCaretDown';
import IconNewEdit from '@/components/Icon/IconNewEdit';
import IconNewTrash from '@/components/Icon/IconNewTrash';
import IconDisplaylist from '@/components/Icon/IconDisplaylist';
import IconDisplayTree from '@/components/Icon/IconDisplayTree';
import IconNewPlus from '@/components/Icon/IconNewPlus';
interface Props {
    [key: string]: any;
}

const Department = ({ ...props }: Props) => {

    const dispatch = useDispatch();
    const { t } = useTranslation();
    useEffect(() => {
        dispatch(setPageTitle(`${t('department')}`));
    });

    const router = useRouter()

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

    const { data: shift, pagination, mutate } = Departments({ sortBy: 'id.ASC', ...router.query });
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setGetStorge(DepartmentList);
            localStorage.setItem('departmentList', JSON.stringify(DepartmentList));

        }
    }, [])


    useEffect(() => {
        setShowLoader(false);
    }, [recordsData])

    const handleEdit = (data: any) => {
        // setOpenModal(true);
        // setData(data);
        router.push(`/hrm/department/${data.id}`)

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
                    localStorage.setItem('departmentList', JSON.stringify(value));
                    setGetStorge(value);
                    showMessage(`${t('delete_department_success')}`, 'success')
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
    type Content = { id: number; name: string; code: string; status: string; abbreviated: string };

    type Item = {
        id: number;
        content: Content;
        hasChildren: boolean;
        children?: Item[];
    };

    const items: Item[] = [
        {
            id: 1,
            content: {
                id: 1,
                name: "Phòng Hành chính",
                code: "HC",
                abbreviated: "PHC",
                status: "active"
            },
            hasChildren: true,
            children: [
                {
                    id: 2,
                    content: {
                        id: 2,
                        name: "Tổ xe",
                        code: "B1.1",
                        status: "active",
                        abbreviated: "TX",

                    },
                    hasChildren: false,

                },
                {
                    id: 3,
                    content: {
                        id: 3,
                        name: "Bộ phận cấp dưỡng",
                        code: "B1.2",
                        status: "active",
                        abbreviated: "CD",

                    },
                    hasChildren: false,

                },
                {
                    id: 4,
                    content: {
                        id: 4,
                        name: "Bảo vệ",
                        code: "B1.3",
                        status: "active",
                        abbreviated: "BV",

                    },
                    hasChildren: false,
                },
            ],

        },
        {
            id: 5,
            content: {
                id: 5,
                name: "Phòng Kĩ thuật",
                code: "PB02",
                abbreviated: "PHKT",
                status: "active"
            },
            hasChildren: true,
            children: [
                {
                    id: 6,
                    content: {
                        id: 6,
                        name: "Tổ gia công mẫu",
                        code: "B2.1",
                        abbreviated: "PHKTB1",
                        status: "active"
                    },
                    hasChildren: false,

                },
                {
                    id: 7,
                    content: {
                        id: 7,
                        name: "Tổ Môi trường",
                        code: "B2.2",
                        abbreviated: "PHKTB2",
                        status: "active"
                    },
                    hasChildren: false,

                },
            ],

        },
    ];
    const itemslist: Item[] = [
        {
            id: 1,
            content: {
                id: 1,
                name: "Phòng Hành chính",
                code: "HC",
                abbreviated: "PHC",
                status: "active"
            },
            hasChildren: false,

        },
        {
            id: 2,
            content: {
                id: 2,
                name: "Tổ xe",
                code: "B1.1",
                status: "active",
                abbreviated: "TX",

            },
            hasChildren: false,

        },
        {
            id: 3,
            content: {
                id: 3,
                name: "Bộ phận cấp dưỡng",
                code: "B1.2",
                status: "active",
                abbreviated: "CD",

            },
            hasChildren: false,

        },
        {
            id: 4,
            content: {
                id: 4,
                name: "Bảo vệ",
                code: "B1.3",
                status: "active",
                abbreviated: "BV",

            },
            hasChildren: false,
        },
        {
            id: 5,
            content: {
                id: 5,
                name: "Phòng Kĩ thuật",
                code: "PB02",
                abbreviated: "PHKT",
                status: "active"
            },
            hasChildren: false,

        },
        {
            id: 6,
            content: {
                id: 6,
                name: "Tổ gia công mẫu",
                code: "B2.1",
                abbreviated: "PHKTB1",
                status: "active"
            },
            hasChildren: false,

        },
        {
            id: 7,
            content: {
                id: 7,
                name: "Tổ Môi trường",
                code: "B2.2",
                abbreviated: "PHKTB2",
                status: "active"
            },
            hasChildren: false,

        },
    ];


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
                            <button type="button" className="m-1 button-table button-create" >
                                <IconNewPlus />
                                <span className='uppercase'>{t('add')}</span>
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
                    <div className='display-style'>

                        <input autoComplete="off" type="text" className="form-input w-auto" placeholder={`${t('search')}`} onChange={(e) => handleSearch(e)} />
                        <button type="button" className="btn btn-primary btn-sm m-1  custom-button-display" style={{ backgroundColor: display === 'flat' ? '#E9EBD5' : '#FAFBFC', color: 'black' }} onClick={() => setDisplay('flat')}>
                            <IconDisplaylist fill={display === 'flat' ? '#959E5E' : '#BABABA'}></IconDisplaylist>
                        </button>
                        <button type="button" className="btn btn-primary btn-sm m-1  custom-button-display" style={{ backgroundColor: display === 'tree' ? '#E9EBD5' : '#FAFBFC' }} onClick={() => setDisplay('tree')}>
                            <IconDisplayTree fill={display === 'tree' ? '#959E5E' : '#BABABA'}></IconDisplayTree>

                        </button>
                    </div>
                </div>
                <div className="mb-5">
                    <TableTree>
                        <Headers>
                            <Header width={'27%'}>Tên phòng ban</Header>
                            <Header width={'22%'}>Mã phòng ban</Header>
                            <Header width={'27%'}>Tên viết tắt</Header>
                            <Header width={'10%'}>Thao tác</Header>
                        </Headers>
                        <Rows
                            items={display === 'tree' ? items : itemslist}
                            render={({ id, content, children = [] }: Item) => (
                                <Row
                                    itemId={id}
                                    items={children}
                                    hasChildren={children.length > 0}
                                    isDefaultExpanded
                                >
                                    <Cell singleLine>{content.name}</Cell>
                                    <Cell>{content.code}</Cell>
                                    <Cell>{content.abbreviated}</Cell>

                                    <Cell> <div className="flex items-center w-max mx-auto gap-2">
                                        <div className="w-[60px]">
                                            <button type="button" className='button-edit' onClick={() => handleEdit(content)}>
                                                <IconNewEdit /><span>
                                                    {t('edit')}
                                                </span>
                                            </button>
                                        </div>
                                        <div className="w-[80px]">
                                            <button type="button" className='button-delete' onClick={() => handleDelete(content)}>
                                                <IconNewTrash />
                                                <span>
                                                    {t('delete')}
                                                </span>
                                            </button>
                                        </div>
                                    </div></Cell>
                                </Row>
                            )}
                        />
                    </TableTree>
                    <div className="flex w-full flex-col justify-start">
                        <ul className="inline-flex items-center space-x-1 rtl:space-x-reverse justify-end" style={{ marginTop: '10px' }}>
                            <li>
                                <button
                                    type="button"
                                    className="flex justify-center rounded-full bg-white-light p-2 font-semibold text-dark transition hover:bg-primary hover:text-white dark:bg-[#191e3a] dark:text-white-light dark:hover:bg-primary"
                                >
                                    <IconCaretDown className="w-5 h-5 rotate-90 rtl:-rotate-90" />
                                </button>
                            </li>
                            <li>
                                <button type="button" className="flex justify-center rounded-full px-3.5 py-2 font-semibold text-white transition dark:bg-primary dark:text-white-light bt-pagination-active">
                                    1
                                </button>
                            </li>
                            <li>
                                <button
                                    type="button"
                                    className="flex justify-center rounded-full bg-white-light p-2 font-semibold text-dark transition hover:bg-primary hover:text-white dark:bg-[#191e3a] dark:text-white-light dark:hover:bg-primary"
                                >
                                    <IconCaretDown className="w-5 h-5 -rotate-90 rtl:rotate-90" />
                                </button>
                            </li>
                        </ul>
                    </div>
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
