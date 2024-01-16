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

import { useRouter } from 'next/router';

// json
import DepartmentList from './asset_list.json';
import IconFolderMinus from '@/components/Icon/IconFolderMinus';
import IconDownload from '@/components/Icon/IconDownload';
import AssetModal from './modal/AssetModal';

interface Props {
	[key: string]: any;
}

const Asset = ({ ...props }: Props) => {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	useEffect(() => {
		dispatch(setPageTitle(`${t('asset')}`));
	});

	const router = useRouter();

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
			const data = localStorage.getItem('assetList');
			if (data) {
				setGetStorge(JSON.parse(data));
			} else {
				localStorage.setItem('assetList', JSON.stringify(DepartmentList));
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
				title: `${t('delete_asset')}`,
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
					localStorage.setItem('assetList', JSON.stringify(value));
					setGetStorge(value);
					showMessage(`${t('delete_asset_success')}`, 'success');
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
		{ accessor: 'name', title: 'Tên tài sản', sortable: false },
		{ accessor: 'quantity', title: 'Số lượng', sortable: false },
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
			<title>{t('asset')}</title>
			<div className="panel mt-6">
				<div className="mb-4.5 flex flex-col justify-between gap-5 md:flex-row md:items-center">
					<div className="flex flex-wrap items-center">
						<button type="button" onClick={(e) => setOpenModal(true)} className="btn btn-primary btn-sm m-1 ">
							<IconPlus className="h-5 w-5 ltr:mr-2 rtl:ml-2" />
							{t('add')}
						</button>
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
			</div>
			<AssetModal openModal={openModal} setOpenModal={setOpenModal} data={data} totalData={getStorge} setData={setData} setGetStorge={setGetStorge} />
		</div>
	);
};

export default Asset;
