import React, { useEffect, useState } from 'react';

import IconDownload from '@/components/Icon/IconDownload';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { setPageTitle } from '@/store/themeConfigSlice';
import { showMessage } from '@/@core/utils';
import { PAGE_NUMBER_DEFAULT, PAGE_SIZES, PAGE_SIZES_DEFAULT } from '@/utils/constants';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';

import TaskList from './task_list.json';
import Swal from 'sweetalert2';
import Tippy from '@tippyjs/react';
import IconPencil from '@/components/Icon/IconPencil';
import IconTrashLines from '@/components/Icon/IconTrashLines';
import { IconLoading } from '@/components/Icon/IconLoading';
import IconPlus from '@/components/Icon/IconPlus';
import IconFolderMinus from '@/components/Icon/IconFolderMinus';
import TaskModal from './modal/TaskModal';

interface Props {
	[key: string]: any;
}

const Task = ({ ...props }: Props) => {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	useEffect(() => {
		dispatch(setPageTitle(`${t('task')}`));
	});

	const [showLoader, setShowLoader] = useState(true);
	const [page, setPage] = useState<any>(PAGE_NUMBER_DEFAULT);
	const [pageSize, setPageSize] = useState(PAGE_SIZES_DEFAULT);
	const [recordsData, setRecordsData] = useState<any>();
	const [total, setTotal] = useState(0);
	const [getStorge, setGetStorge] = useState<any>();
	const [data, setData] = useState<any>();

	const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'desc' });

	const [openModal, setOpenModal] = useState(false);

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const data = localStorage.getItem('taskList');
			if (data) {
				setGetStorge(JSON.parse(data));
			} else {
				localStorage.setItem('taskList', JSON.stringify(TaskList));
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
				title: `${t('delete_department')}`,
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

	const columns = [
		{
			accessor: 'id',
			title: '#',
			render: (records: any, index: any) => <span>{(page - 1) * pageSize + index + 1}</span>,
		},
		{ accessor: 'creator', title: 'Người tạo', sortable: false },
		{ accessor: 'name', title: 'Tên nhiệm vụ', sortable: false },
		{ accessor: 'executor', title: 'Người thực hiện', sortable: false },
		// { accessor: 'collaborator', title: 'Người phối hợp thực hiện', sortable: false },
		// { accessor: 'description', title: 'Mô tả nhiệm vụ', sortable: false },
		{ accessor: 'deadline', title: 'Thời hạn', sortable: false },
		// { accessor: 'directive', title: 'Ý kiến chỉ đạo', sortable: false },
		// { accessor: 'attachment', title: 'File đính kèm', sortable: false },
		// { accessor: 'additional_info', title: 'Thông tin thêm', sortable: false },

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
					<Tippy content={`${t('download')}`}>
						<button type="button">
							<IconDownload />
						</button>
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
			<title>{t('task')}</title>
			<div className="panel mt-6">
				<div className="mb-4.5 flex flex-col justify-between gap-5 md:flex-row md:items-center">
					<div className="flex flex-wrap items-center">
						<button type="button" onClick={(e) => setOpenModal(true)} className="btn btn-primary btn-sm m-1 ">
							<IconPlus className="h-5 w-5 ltr:mr-2 rtl:ml-2" />
							{t('add')}
						</button>
						{/* <button type="button" className="btn btn-primary btn-sm m-1">
							<IconFolderMinus className="ltr:mr-2 rtl:ml-2" />
							Nhập file
						</button>
						<button type="button" className="btn btn-primary btn-sm m-1">
							<IconDownload className="ltr:mr-2 rtl:ml-2" />
							Xuất file excel
						</button> */}
					</div>
					<input type="text" className="form-input w-auto" placeholder={`${t('search')}`} onChange={(e) => handleSearch(e)} />
				</div>
				<div className="datatables">
					<DataTable
						highlightOnHover
						className="table-hover whitespace-nowrap"
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
				<TaskModal openModal={openModal} setOpenModal={setOpenModal} data={data} totalData={getStorge} setData={setData} setGetStorge={setGetStorge} />
			</div>
		</div>
	);
};

export default Task;
