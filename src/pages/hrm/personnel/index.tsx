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
import PersonnelModal from './modal/PersonnelModal';
import IconFolderMinus from '@/components/Icon/IconFolderMinus';
import IconDownload from '@/components/Icon/IconDownload';
import IconCalendar from '@/components/Icon/IconCalendar';
import Link from 'next/link';

import { Box } from '@atlaskit/primitives';
import TableTree, { Cell, Header, Headers, Row, Rows } from '@atlaskit/table-tree';

import IconNewEdit from '@/components/Icon/IconNewEdit';
import IconNewTrash from '@/components/Icon/IconNewTrash';
import IconNewCalendar from '@/components/Icon/IconNewCalendar';


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
		router.push(`/hrm/personnel/${data.id}`)
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
            title: `${t('delete_asset')}`,
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
	type Content = { id: number; name: string; code: string; department?: string; duty?: string, type: string };

	type Item = {
		id: number;
		content: Content;
		hasChildren: boolean;
		children?: Item[];
	};
	const Name = (props: Content) => <Box as="span">{props.name}</Box>;
	const Code = (props: Content) => (
		<Box as="span">{props.code}</Box>
	);
	const Duty = (props: Content) => (
		<Box as="span">{props.duty}</Box>
	);
	const Department = (props: Content) => (
		<Box as="span">{props.department}</Box>
	);
	const Action = (props: Content) => (
		<>
			{
				props.type !== 'PB' ?
                <div className="flex items-center w-max mx-auto gap-2">
                <Tippy content={`${t('edit')}`}>
                    <button type="button"  className='button-edit' onClick={() => handleEdit(props)}>
                    <IconNewEdit /><span>
                            {t('edit')}
                                </span>
                    </button>
                </Tippy>

                <Tippy content={`${t('delete')}`}>
                    <button type="button" className='button-delete' onClick={() => handleDelete(props)}>
                    <IconNewTrash />
                            <span>
                            {t('delete')}
                                </span>
                    </button>
                </Tippy>
                <Tippy content={`${t('work_schedule')}`}>
						<Link href="/hrm/calendar" className="group">
							<IconNewCalendar />
                            <span>
                            {t('work_schedule')}
                                </span>
						</Link>
					</Tippy>
            </div> : <></>
			}
		</>

	);
	const items: Item[] = [
		{
			id: 1,
			content: {
				id: 1,
				name: "Phòng hành chính",
				code: "PB01",
				type: 'PB'
			},
			hasChildren: true,
			children: [
				{
					id: 2,
					content: {
						id: 1,
						name: "Nguyễn Văn A",
						code: "NV1",
						type: 'NV',
						department: 'Phòng hành chính',
						duty: 'Trưởng phòng'
					},
					hasChildren: false,

				},
			],

		},
		{
			id: 2,
			content: {
				id: 2,
				name: "Phòng kĩ thuật",
				code: "PB02",
				type: 'PB'
			},
			hasChildren: true,
			children: [
				{
					id: 4,
					content: {
						id: 2,
						name: "Trần Văn B",
						code: "NV02",
						type: 'NV',
						department: 'Phòng kĩ thuật',
						duty: 'Kế toán'
					},
					hasChildren: false,

				},
				{
					id: 5,
					content: {
						id: 3,
						name: "Nguyễn Thị C",
						code: "NV03",
						type: 'NV',
						department: 'Phòng kĩ thuật',
						duty: 'Trợ lý'
					},
					hasChildren: false,

				},
			],

		},
	];
	const columns = [
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
						<Link href="/hrm/personnel/AddNewPersonel">
							<button type="button" className="btn btn-primary btn-sm m-1 custom-button" >
								<IconPlus className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
								{t('add')}
							</button>
						</Link>
						<button type="button" className="btn btn-primary btn-sm m-1  custom-button">
							<IconFolderMinus className="ltr:mr-2 rtl:ml-2" />
							Nhập file
						</button>
						<button type="button" className="btn btn-primary btn-sm m-1  custom-button">
							<IconDownload className="ltr:mr-2 rtl:ml-2" />
							Xuất file excel
						</button>
					</div>
					<input type="text" className="form-input w-auto" placeholder={`${t('search')}`} onChange={(e) => handleSearch(e)} />

				</div>
				<div className="mb-5">
					<TableTree>
						<Headers>
							<Header width={300}>Tên nhân viên</Header>
							<Header width={300}>Mã nhân viên</Header>
							<Header width={200}>Chức vụ</Header>
							<Header width={200}>Phòng ban</Header>
							<Header width={100}>Thao tác</Header>
						</Headers>
						<Rows
							items={items}
							render={({ id, content, children = [] }: Item) => (
								<Row
									itemId={id}
									items={children}
									hasChildren={children.length > 0}
									isDefaultExpanded
								>
									<Cell singleLine>{content.name}</Cell>
									<Cell>{content.code}</Cell>
									<Cell>{content.duty}</Cell>
									<Cell>{content.department}</Cell>
									<Cell> <div className="flex items-center w-max mx-auto gap-2">
										{
											content.type !== 'PB' ?
												<div className="flex items-center w-max mx-auto gap-2">
													<Tippy content={`${t('edit')}`}>
														<button type="button" className='button-edit' onClick={() => handleEdit(content)}>
															<IconPencil /> Sửa
														</button>
													</Tippy>
													<Tippy content={`${t('delete')}`}>
														<button type="button" className='button-delete' onClick={() => handleDelete(content)}>
															<IconTrashLines /> Xóa
														</button>
													</Tippy> </div> : <></>
										}
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
			<PersonnelModal openModal={openModal} setOpenModal={setOpenModal} data={data} totalData={getStorge} setData={setData} setGetStorge={setGetStorge} />
		</div>
	);
};

export default Department;
