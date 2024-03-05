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
import IconCaretDown from '@/components/Icon/IconCaretDown';

import { useRouter } from 'next/router';

// json
import PersonnelList from './personnel_list.json';
import IconFolderMinus from '@/components/Icon/IconFolderMinus';
import IconDownload from '@/components/Icon/IconDownload';
import IconCalendar from '@/components/Icon/IconCalendar';
import Link from 'next/link';

import { Box } from '@atlaskit/primitives';
import TableTree from '@atlaskit/table-tree';
import personnel_list from './personnel_list.json';

interface Props {
	[key: string]: any;
}

const Department = ({ ...props }: Props) => {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	useEffect(() => {
		dispatch(setPageTitle(`${t('staff')}`));
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

	const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'desc' });

	const [openModal, setOpenModal] = useState(false);
	const [codeArr, setCodeArr] = useState<string[]>([]);

	const toggleCode = (name: string) => {
		if (codeArr.includes(name)) {
			setCodeArr((value) => value.filter((d) => d !== name));
		} else {
			setCodeArr([...codeArr, name]);
		}
	};
	const [treeview1, setTreeview1] = useState<string[]>(['images']);
	const [pagesSubMenu, setPagesSubMenu] = useState(false);

	const toggleTreeview1 = (name: any) => {
		if (treeview1.includes(name)) {
			setTreeview1((value) => value.filter((d) => d !== name));
		} else {
			setTreeview1([...treeview1, name]);
		}
	};

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
				icon: 'question',
				title: `${t('delete_staff')}`,
				text: `${t('delete')} ${data.name}`,
				padding: '2em',
				showCancelButton: true,
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
	type Content = { title: string; description: string };

	type Item = {
		id: string;
		content: Content;
		hasChildren: boolean;
		children?: Item[];
	};
    const CheckBox = (props: Content) => <input type='checkbox' className='form-checkbox' />;
	const Title = (props: Content) => <Box as="span">{props.title}</Box>;
	const Description = (props: Content) => (
		<Box as="span">{props.description}</Box>
	);
	const Action = (props: Content) => (
		<div className="flex items-center w-max mx-auto gap-2">
			<Tippy content={`${t('edit')}`}>
				<button type="button" className='button-edit' >
					<IconPencil /> Sửa
				</button>
			</Tippy>
			<Tippy content={`${t('delete')}`}>
				<button type="button" className='button-delete' >
					<IconTrashLines /> Xóa
				</button>
			</Tippy>
		</div>
	);
	const items: Item[] = [
		{
			id: 'item1',
			content: {
				title: 'Nguyễn Văn A',
				description: 'NV1',
			},
			hasChildren: false,
			children: [],
		},
		{
			id: 'item2',
			content: {
				title: 'Trần Văn B',
				description: 'NV2',
			},
			hasChildren: true,
			children: [
				{
					id: 'item3',
					content: {
						title: 'Vũ Văn C',
						description: 'NV3',
					},
					hasChildren: false,
				},
			],
		},
	];
	const columns = [
        { accessor: 'check', title: 'Chọn', sortable: false, render: (records: any) => <input type="checkbox" className='form-checkbox'/>},
		{
			accessor: 'id',
			title: '#',
			render: (records: any, index: any) => <span>{(page - 1) * pageSize + index + 1}</span>,
		},

		{ accessor: 'name', title: 'Tên nhân viên', sortable: false },
		{ accessor: 'code', title: 'Mã nhân viên', sortable: false },
		{
			accessor: 'action',
			title: 'Thao tác',
			titleClassName: '!text-center',
			render: (records: any) => (
				<div className="mx-auto flex w-max items-center gap-2">
					<Tippy content={`${t('edit')}`}>
						<button type="button" onClick={() => handleEdit(records)}>
							<IconPencil />
						</button>
					</Tippy>
					<Tippy content={`${t('delete')}`}>
						<button type="button" onClick={() => handleDelete(records)}>
							<IconTrashLines />
						</button>
					</Tippy>
					<Tippy content={`${t('work_schedule')}`}>
						<Link href="/hrm/calendar" className="group">
							<IconCalendar />
						</Link>
					</Tippy>
				</div>
			),
		},
	];

	return (
		<div>
			{showLoader && (
				<div className="screen_loader animate__animated fixed inset-0 z-[60] grid place-content-center bg-[#fafafa] dark:bg-[#060818]">
					<IconLoading />
				</div>
			)}
			<title>{t('staff')}</title>
			<div className="panel mt-6">
				<div className="mb-4.5 flex flex-col justify-between gap-5 md:flex-row md:items-center">
					<div className="flex flex-wrap items-center">
						<button type="button" className="btn btn-primary btn-sm m-1  custom-button">
							<IconFolderMinus className="ltr:mr-2 rtl:ml-2" />
							Nhập file
						</button>
						<button type="button" className="btn btn-primary btn-sm m-1  custom-button">
							<IconDownload className="ltr:mr-2 rtl:ml-2" />
							Xuất file excel
						</button>
					</div>
					<div className='display-style'>
						<input type="text" className="form-input w-auto" placeholder={`${t('search')}`} onChange={(e) => handleSearch(e)} />

					</div>
				</div>
				<div className="datatables">
							<DataTable
								highlightOnHover
								className="table-hover whitespace-nowrap custom_table"
								records={personnel_list}
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
	);
};

export default Department;
