import React, { useEffect, useMemo, useState } from 'react';

import IconDownload from '@/components/Icon/IconDownload';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { setPageTitle } from '@/store/themeConfigSlice';
import { showMessage } from '@/@core/utils';
import { PAGE_NUMBER_DEFAULT, PAGE_SIZES, PAGE_SIZES_DEFAULT } from '@/utils/constants';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import Link from 'next/link';
import dayjs from 'dayjs';
import Select from "react-select";

import TaskList from './task_list.json';
import Swal from 'sweetalert2';
import Tippy from '@tippyjs/react';
import IconPencil from '@/components/Icon/IconPencil';
import IconTrashLines from '@/components/Icon/IconTrashLines';
import { IconLoading } from '@/components/Icon/IconLoading';
import IconPlus from '@/components/Icon/IconPlus';
import TaskModal from './modal/TaskModal';
import { ActionIcon, Button, Checkbox, MultiSelect, Stack, TextInput } from '@mantine/core';
import { useRouter } from 'next/router';
import IconFile from '@/components/Icon/IconFile';
import IconTag from '@/components/Icon/IconTag';
import IconEdit from '@/components/Icon/IconEdit';
import IconNewTrash from '@/components/Icon/IconNewTrash';
import IconNewDownload from '@/components/Icon/IconNewDownload';
import IconNewEdit from '@/components/Icon/IconNewEdit';
import IconNewEye from '@/components/Icon/IconNewEye';
import IconNewPlus from '@/components/Icon/IconNewPlus';
import list_departments from '../department/department_list.json';
import { IconFilter } from '@/components/Icon/IconFilter';

interface Props {
	[key: string]: any;
}

const Task = ({ ...props }: Props) => {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	useEffect(() => {
		dispatch(setPageTitle(`${t('task')}`));
	});
	const router = useRouter();
	const [showLoader, setShowLoader] = useState(true);
	const [page, setPage] = useState<any>(PAGE_NUMBER_DEFAULT);
	const [pageSize, setPageSize] = useState(PAGE_SIZES_DEFAULT);
	const [recordsData, setRecordsData] = useState<any>([]);
	const [total, setTotal] = useState(0);
	const [getStorge, setGetStorge] = useState<any>();
	const [data, setData] = useState<any>();
	const [listDepartment, setListDepartment] = useState<any>();
	const [active, setActive] = useState<any>([1]);

	const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'desc' });

	const [openModal, setOpenModal] = useState(false);

	const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

	useEffect(() => {
		const list_temp_department = list_departments?.map((department: any) => {
			return {
				value: department.id,
				label: department.name
			}
		})
		setListDepartment(list_temp_department);
		if (typeof window !== 'undefined') {
			setGetStorge(TaskList);
			localStorage.setItem('taskList', JSON.stringify(TaskList));
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
	const handleActive = (value: any) => {
		setActive([value]);
	};
	const handleEdit = (data: any) => {
		// setOpenModal(true);
		// setData(data);
		router.push(`/hrm/task/${data.id}`)
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
				title: `${t('delete_task')}`,
				html: `<span class='confirm-span'>${t('confirm_delete')}</span> ${data.name}?`,
				padding: '2em',
				cancelButtonText: `${t('cancel')}`,
				confirmButtonText: `${t('confirm')}`,
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
					showMessage(`${t('delete_task_success')}`, 'success');
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
	const handleDetail = (item: any) => {
		router.push(`/hrm/task/detail/${item.id}`)
	}
	const columns = [
		{
			accessor: 'id',
			title: '#',
			render: (records: any, index: any) => <span>{(page - 1) * pageSize + index + 1}</span>,
		},
		{ accessor: 'creator', title: 'Người tạo', sortable: false },
		{
			accessor: 'name', title: 'Tên nhiệm vụ', sortable: false,
			render: (records: any) => {
				return <span onClick={() => handleDetail(records)}>{records?.name}</span>
			}
		},
		{
			accessor: 'department',
			title: 'Phòng ban',
			filter: (
				<MultiSelect
					label="Departments"
					description="Show all employees working at the selected departments"
					data={[
						{
							name: 'Phòng Hành chính',
							value: '1'
						}
					]}
					value={selectedDepartments}
					placeholder="Search departments…"
					onChange={setSelectedDepartments}
					clearable
					searchable
				/>
			),
			filtering: selectedDepartments.length > 0,
		},
		{ accessor: 'executor', title: 'Người thực hiện', sortable: false },
		// { accessor: 'collaborator', title: 'Người phối hợp thực hiện', sortable: false },
		// { accessor: 'description', title: 'Mô tả nhiệm vụ', sortable: false },
		{
			accessor: 'deadline', title: 'Thời hạn', sortable: false,
			render: (records: any, index: any) => <span>{`${dayjs(records?.deadline).format("H:m DD/MM/YYYY")}`}</span>
		},
		{
			accessor: 'status',
			title: 'Trạng thái',
			render: (records: any, index: any) => <span className={`badge bg-${records?.color}`}>{records?.status}</span>,
		},
		{ accessor: 'percent', title: '% công việc', sortable: false },
		// { accessor: 'attachment', title: 'File đính kèm', sortable: false },

		{
			accessor: 'action',
			title: 'Thao tác',
			// width: "150px",
			titleClassName: '!text-center',
			render: (records: any) => (
				<div className="mx-auto flex items-center gap-2 justify-center">
					<div className="w-[80px]">
						<button type="button" className='button-detail' onClick={() => handleDetail(records)}>
							<IconNewEye /><span>
								{t('detail')}
							</span>
						</button>
					</div>
					<div className="w-[60px]">
						<button type="button" className='button-edit' onClick={() => handleEdit(records)}>
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
					{/* <button type="button" className='button-download1'>
						<IconNewDownload />
                        <span>{t('download')}</span>
					</button> */}
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
						<Link href="/hrm/task/AddNewTask">
							<button type="button" className=" m-1 button-table button-create" >
								<IconNewPlus />
								<span className="uppercase">{t('add')}</span>
							</button>
						</Link>
					</div>


				</div>
				<div className="flex md:items-center justify-between md:flex-row flex-col mb-4.5 gap-5">
					<div className="flex items-center flex-wrap gap-1">
						<IconFilter />
						<span>Lọc nhanh :</span>
						<div className='flex items-center flex-wrap gap-2'>
							<div className={active.includes(1) ? 'border p-2 rounded bg-[#E9EBD5] text-[#476704] cursor-pointer' : 'border p-2 rounded cursor-pointer'} onClick={() => handleActive(1)}>Đang tiến hành</div>
							<div className={active.includes(3) ? 'border p-2 rounded bg-[#E9EBD5] text-[#476704] cursor-pointer' : 'border p-2 rounded cursor-pointer'} onClick={() => handleActive(3)}>Hoàn thành</div>
						</div>
					</div>
					<div className='flex flex-row gap-2'>
						<Select
							className="zIndex-10 w-[180px]"
							id='unidepartmentparentIdtId'
							name='departmentparentId'
							placeholder={t('choose_department')}
							options={listDepartment}
							maxMenuHeight={160}
						/>
						<input autoComplete="off" type="text" className="form-input w-auto" placeholder={`${t('search')}`} onChange={(e) => handleSearch(e)} />
					</div>
				</div>
				<div className="datatables">
					<DataTable
						highlightOnHover
						className="table-hover whitespace-nowrap custom_table"
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
