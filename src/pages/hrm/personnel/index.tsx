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
import IconNewPlus from '@/components/Icon/IconNewPlus';
import IconImportFile from '@/components/Icon/IconImportFile';
import IconNewDownload from '@/components/Icon/IconNewDownload';
import IconNewDownload2 from '@/components/Icon/IconNewDownload2';
import { Humans } from '@/services/swr/human.twr';
import { deleteHuman } from '@/services/apis/human.api';

interface Props {
	[key: string]: any;
}

const Department = ({ ...props }: Props) => {
	const fileInputRef = useRef<HTMLInputElement>(null);

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
	const { data: human, pagination, mutate } = Humans({ sortBy: 'id.ASC', ...router.query });



	const [codeArr, setCodeArr] = useState<string[]>([]);


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
		router.push(`/hrm/personnel/${data}`)
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
				title: `${t('delete_staff')}`,
				html: `<span class='confirm-span'>${t('confirm_delete')}</span> ${data.fullName}?`,
				padding: '2em',
				showCancelButton: true,
				cancelButtonText: `${t('cancel')}`,
				confirmButtonText: `${t('confirm')}`,
				reverseButtons: true,
			})
			.then((result) => {
				if (result.value) {
					deleteHuman(data?.id).then(() => {
						mutate();
						showMessage(`${t('delete_staff_success')}`, 'success');
					}).catch((err) => {
						showMessage(`${err?.response?.data?.message}`, 'error');
					});
				}
			});
	};

	const handleSearch = (e: any) => {
		router.replace(
			{
				pathname: router.pathname,
				query: {
					...router.query,
					search: e
				},
			}
		);
	};
	type Content = { id: number; name: string; code: string; department?: string; duty?: string, type: string };

	type Item = {
		id: number;
		fullName: string; code: string; department?: string; duty?: string; email: string;
		hasChildren: boolean;
		children?: Item[];
	};


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
							<button type="button" className=" m-1 button-table button-create" >
								<IconNewPlus />
								<span className="uppercase">{t('add')}</span>
							</button>
						</Link>
						<input autoComplete="off" type="file" ref={fileInputRef} style={{ display: "none" }} />

						<button type="button" className=" m-1 button-table button-import" onClick={() => fileInputRef.current?.click()}>
							<IconImportFile />
							<span className="uppercase">Nhập file</span>
						</button>
						<button type="button" className=" m-1 button-table button-download">
							<IconNewDownload2 />
							<span className="uppercase">Xuất file excel</span>
						</button>
					</div>
					<input autoComplete="off" type="text" className="form-input w-auto" placeholder={`${t('search')}`} onChange={(e) => handleSearch(e.target.value)} />

				</div>
				<div className="mb-5">
					<TableTree>
						<Headers>
							<Header width={'20%'}>Tên nhân viên</Header>
							<Header width={'20%'}>Mã nhân viên</Header>
							<Header width={'20%'}>Chức vụ</Header>
							<Header width={'20%'}>Email</Header>
							<Header width={'20%'}>Thao tác</Header>
						</Headers>
						<Rows
							items={human?.data}
							render={({ id, fullName, code, email, children = [] }: Item) => (
								<Row
									itemId={id}
									items={children}
									hasChildren={children.length > 0}
									isDefaultExpanded
								>
									<Cell singleLine>{fullName}</Cell>
									<Cell>{code}</Cell>
									<Cell></Cell>
									<Cell>{email}</Cell>
									<Cell> <div className="flex items-center w-max mx-auto gap-2">
										{
											<div className="flex items-center w-max mx-auto gap-2">
												<div className="w-[60px]">

													<button type="button" className='button-edit' onClick={() => handleEdit(id)}>
														<IconNewEdit /><span>
															{t('edit')}
														</span>
													</button>
												</div>
												<div className="w-[80px]">
													<button type="button" className='button-delete' onClick={() => handleDelete({ id, fullName })}>
														<IconNewTrash />
														<span>
															{t('delete')}
														</span>
													</button>
												</div>
											</div>
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
		</div>
	);
};

export default Department;
