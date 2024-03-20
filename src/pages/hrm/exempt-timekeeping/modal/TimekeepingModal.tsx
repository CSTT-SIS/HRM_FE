import { useEffect, Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog, Transition } from '@headlessui/react';
import Select from "react-select";
import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import Swal from 'sweetalert2';
import IconX from '@/components/Icon/IconX';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../../store/themeConfigSlice';
// Third party libs
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
// API
// constants
import { PAGE_SIZES, PAGE_SIZES_DEFAULT, PAGE_NUMBER_DEFAULT } from '@/utils/constants';
// helper
import { capitalize, formatDate, showMessage } from '@/@core/utils';
// icons
import { IconLoading } from '@/components/Icon/IconLoading';
import IconPlus from '@/components/Icon/IconPlus';
import withReactContent from 'sweetalert2-react-content';
import list_departments from '../../department/department_list.json';
import list_duty from "../../duty/duty_list.json";
import { useRouter } from 'next/router';

// json
import IconFolderMinus from '@/components/Icon/IconFolderMinus';
import IconDownload from '@/components/Icon/IconDownload';
import IconCalendar from '@/components/Icon/IconCalendar';

import PersonnelList from "../personnel_list.json";
import IconNewPlus from '@/components/Icon/IconNewPlus';

interface Props {
    [key: string]: any;
}

const TimekeepingModal = ({ ...props }: Props) => {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	useEffect(() => {
		dispatch(setPageTitle(`${t('staff')}`));
	});
    const [listDepartment, setListDepartment] = useState<any>();
    const [listDuty, setListDuty]= useState<any>([]);
	const router = useRouter();
	const [display, setDisplay] = useState('tree')
	const [showLoader, setShowLoader] = useState(true);
	const [page, setPage] = useState<any>(PAGE_NUMBER_DEFAULT);
	const [pageSize, setPageSize] = useState(PAGE_SIZES_DEFAULT);
	const [recordsData, setRecordsData] = useState<any>();
	const [total, setTotal] = useState(0);
	const [getStorge, setGetStorge] = useState<any>();
	const [data, setData] = useState<any>();

	const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'desc' });

	const [openModal, setOpenModal] = useState(false);
	const [codeArr, setCodeArr] = useState<string[]>([]);
    useEffect(() => {
        const list_temp_department = list_departments?.map((department: any) => {
            return {
                value: department.id,
                label: department.name
            }
        })
        setListDepartment(list_temp_department);

        const list_temp_duty = list_duty?.map((person: any) => {
            return {
                value: person.code,
                label: person.name
            }
        })
        setListDuty(list_temp_duty);
    }, [])
	const toggleCode = (name: string) => {
		if (codeArr.includes(name)) {
			setCodeArr((value) => value.filter((d) => d !== name));
		} else {
			setCodeArr([...codeArr, name]);
		}
	};
	const [treeview1, setTreeview1] = useState<string[]>(['images']);
	const [pagesSubMenu, setPagesSubMenu] = useState(false);
    const [listSelected, setListSelected] = useState<any>([]);
	const toggleTreeview1 = (name: any) => {
		if (treeview1.includes(name)) {
			setTreeview1((value) => value.filter((d) => d !== name));
		} else {
			setTreeview1([...treeview1, name]);
		}
	};
    const MySwal = withReactContent(Swal);


	const [treeview2, setTreeview2] = useState<string[]>(['parent']);
	const toggleTreeview2 = (name: any) => {
		if (treeview2.includes(name)) {
			setTreeview2((value) => value.filter((d) => d !== name));
		} else {
			setTreeview2([...treeview2, name]);
		}
	};
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const data = localStorage.getItem('staffList');
			if (data) {
				setGetStorge(JSON.parse(data));
			} else {
				localStorage.setItem('staffList', JSON.stringify(PersonnelList));
			}
		}
	}, []);

	useEffect(() => {
		setTotal(getStorge?.length);
		setPageSize(PAGE_SIZES_DEFAULT);
		setRecordsData(
			getStorge?.filter((item: any, index: any) => {
				return index <= 9 && page === 1 ? item : index >= 10 && index <= page * 9 ? item : null;
			}),
		);
	}, [getStorge, getStorge?.length, page]);

	useEffect(() => {
		setShowLoader(false);
	}, [recordsData]);

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
				title: `${t('delete_staff')}`,
				html: `<span class='confirm-span'>${t('confirm_delete')}</span> ${data.name}?`,
				padding: '2em',
				showCancelButton: true,
                cancelButtonText: `${t('cancel')}`,
                confirmButtonText: `${t('confirm')}`,
				reverseButtons: true,
			})
			.then((result) => {
				if (result.value) {
					const value = getStorge.filter((item: any) => {
						return item.id !== data.id;
					});
					localStorage.setItem('staffList', JSON.stringify(value));
					setGetStorge(value);
					showMessage(`${t('delete_department_success')}`, 'success');
				}
			});
	};

	const handleSearch = (e: any) => {
		if (e.target.value === '') {
			setRecordsData(getStorge);
		} else {
			setRecordsData(
				getStorge.filter((item: any) => {
					return item.name.toLowerCase().includes(e.target.value.toLowerCase());
				}),
			);
		}
	};

    const handleChangeSelect = (isSelected: any, record: any) => {
        if (isSelected) {
            setListSelected([...listSelected, record]);
        } else {
            setListSelected(listSelected?.filter((item: any) => item.id!== record.id));
        };
    };

	const columns = [
        { accessor: 'check', title: 'Chọn', sortable: false, render: (records: any) => <input autoComplete="off" type="checkbox" onChange={(e) => handleChangeSelect(e.target.checked, records)} className='form-checkbox'/>},
		{
			accessor: 'id',
			title: '#',
			render: (records: any, index: any) => <span>{(page - 1) * pageSize + index + 1}</span>,
		},

		{ accessor: 'name', title: 'Tên nhân viên', sortable: false },
		{ accessor: 'code', title: 'Mã nhân viên', sortable: false },
        { accessor: 'department', title: 'Phòng ban', sortable: false },
        { accessor: 'duty', title: 'Chức vụ', sortable: false },

	];

    const handleCancel = () => {
        props.setOpenModal(false);
        props.setData(undefined);
        setListSelected([])
    };

    const handleAddToList = () => {
        showMessage(`${t('add_personnel_to_list_success')}`, 'success');
        props.setOpenModal(false);
    }

    return (
        <Transition appear show={props.openModal ?? false} as={Fragment}>
            <Dialog as="div" open={props.openModal} onClose={() => props.setOpenModal(false)} className="relative z-50">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-[black]/60" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center px-4 py-8">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="panel w-full max-w-5xl overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                <button
                                    type="button"
                                    onClick={() => handleCancel()}
                                    className="absolute top-4 text-gray-400 outline-none hover:text-gray-800 ltr:right-4 rtl:left-4 dark:hover:text-gray-600"
                                >
                                    <IconX />
                                </button>
                                <div className="bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pr-5 rtl:pl-[50px] dark:bg-[#121c2c]">
                                    {`${t('add_exempt_timekeeping')}`}
                                </div>
                                <div className="">
			{showLoader && (
				<div className="screen_loader animate__animated fixed inset-0 z-[60] grid place-content-center bg-[#fafafa] dark:bg-[#060818]">
					<IconLoading />
				</div>
			)}
			<div className="panel mt-6">
                <div className="mb-4.5 flex flex-col justify-between gap-20 md:flex-row md:items-center">
					<div className="flex flex-wrap items-center">
                    {
                            listSelected?.length > 0 &&
                             <button type="button" className="button-table" onClick={() => handleAddToList()} style={{paddingLeft: "1rem", paddingRight: "1rem"}}>
							<IconNewPlus />
							<span className="uppercase">Thêm vào danh sách</span>
						</button>
                        }
					</div>
					<div className='flex flex-1 flex-wrap gap-2 max-w-[60%] mb-1'>
                        <div className="flex flex-1">
                        <Select
                        className="zIndex-10 w-[100%]"
                                                            name='departmentparentId'
                                                            placeholder={t('choose_department')}
                                                            options={listDepartment}
                                                            maxMenuHeight={160}

                                                        />
                        </div>
                        <div className="flex flex-1">
                        <Select
                        className="zIndex-10 w-[100%]"
                        name='dutyid'
                                                            placeholder={t('select_duty')}
                                                            options={listDuty}
                                                            maxMenuHeight={160}

                                                        />
                        </div>
                        <div className="flex flex-1">
						<input autoComplete="off" type="text" className="form-input flex-1" placeholder={`${t('search')}`} onChange={(e) => handleSearch(e)} />
                        </div>
					</div>
				</div>
				<div className="datatables">
							<DataTable
								highlightOnHover
								className="table-hover whitespace-nowrap custom_table"
								records={PersonnelList}
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

                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default TimekeepingModal;
