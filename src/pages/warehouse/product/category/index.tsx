import { useEffect, Fragment, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { lazy } from 'react';
import { setPageTitle } from '@/store/themeConfigSlice';
// Third party libs
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import Swal from 'sweetalert2';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useTranslation } from 'react-i18next';
// API
import { ProductCategorys } from '@/services/swr/product.twr';
import { DeleteProductCategory } from '@/services/apis/product.api';
// constants
import { PAGE_SIZES } from '@/utils/constants';
// helper
import { showMessage } from '@/@core/utils';
// icons
import { IconLoading } from '@/components/Icon/IconLoading';
import IconPlus from '@/components/Icon/IconPlus';
import IconPencil from '@/components/Icon/IconPencil';
import IconTrashLines from '@/components/Icon/IconTrashLines';

// modal
import CategoryModal from './CategoryModal';

interface Props {
	[key: string]: any;
}

const ProductCategoryPage = ({ ...props }: Props) => {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const router = useRouter();

	const [showLoader, setShowLoader] = useState(true);
	const [data, setData] = useState<any>();
	const [openModal, setOpenModal] = useState(false);

	const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'desc' });

	// get data
	const { data: category, pagination, mutate } = ProductCategorys({ sortBy: 'id.ASC', ...router.query });
	useEffect(() => {
		dispatch(setPageTitle(`${t('category')}`));
	});

	useEffect(() => {
		setShowLoader(false);
	}, [category]);

	const handleEdit = (data: any) => {
		router.push(`/warehouse/product/category/${data?.id}`);
		setData(data);
	};

	const handleDelete = ({ id, name }: any) => {
		const swalDeletes = Swal.mixin({
			customClass: {
				confirmButton: 'btn btn-secondary testid-confirm-btn',
				cancelButton: 'btn btn-danger ltr:mr-3 rtl:ml-3',
				popup: 'confirm-delete',
			},
			imageUrl: '/assets/images/delete_popup.png',
			buttonsStyling: false,
		});
		swalDeletes
			.fire({
				icon: 'question',
				title: `${t('delete_category')}`,
				text: `${t('delete')} ${name}`,
				padding: '2em',
				showCancelButton: true,
				cancelButtonText: `${t('cancel')}`,
				confirmButtonText: `${t('confirm')}`,
				reverseButtons: true,
			})
			.then((result) => {
				if (result.value) {
					DeleteProductCategory({ id })
						.then(() => {
							mutate();
							showMessage(`${t('delete_category_success')}`, 'success');
						})
						.catch((err) => {
							showMessage(`${t('delete_category_error')}`, 'error');
						});
				}
			});
	};

	const handleSearch = (param: any) => {
		router.replace({
			pathname: router.pathname,
			query: {
				...router.query,
				search: param,
			},
		});
	};

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

	const columns = [
		{
			accessor: 'id',
			title: '#',
			render: (records: any, index: any) => <span>{(pagination?.page - 1) * pagination?.perPage + index + 1}</span>,
		},
		{ accessor: 'name', title: 'Tên danh mục', sortable: false },
		{
			accessor: 'warehouse',
			title: 'Kho',
			render: ({ warehouse }: any) => <span>{warehouse?.name}</span>,
			sortable: false,
		},
		{
			accessor: 'action',
			title: 'Thao tác',
			titleClassName: '!text-center',
			render: (records: any) => (
				<div className="mx-auto flex w-max items-center gap-2">
					<button className="flex justify-between gap-1 rounded bg-[#9CD3EB] p-1" data-testid="edit-category-btn" type="button" onClick={() => handleEdit(records)}>
						<IconPencil /> <span>{`${t('edit')}`}</span>
					</button>
					<button className="flex justify-between gap-1 rounded bg-[#E43940] p-1 text-[#F5F5F5]" data-testid="delete-category-btn" type="button" onClick={() => handleDelete(records)}>
						<IconTrashLines /> <span>{`${t('delete')}`}</span>
					</button>
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
			<title>category</title>
			<div className="panel mt-6">
				<div className="mb-4.5 flex flex-col justify-between gap-5 md:flex-row md:items-center">
					<div className="flex flex-wrap items-center">
						<button type="button" data-testId="add-category" onClick={(e) => router.push(`/warehouse/product/category/create`)} className="btn btn-primary btn-sm custom-button m-1">
							<IconPlus className="h-5 w-5 ltr:mr-2 rtl:ml-2" />
							{t('add')}
						</button>
					</div>

					<input type="text" data-testid="search-category-input" className="form-input w-auto" placeholder={`${t('search')}`} onChange={(e) => handleSearch(e.target.value)} />
				</div>
				<div className="datatables">
					<DataTable
						highlightOnHover
						className="table-hover whitespace-nowrap"
						records={category?.data}
						columns={columns}
						totalRecords={pagination?.totalRecords}
						recordsPerPage={pagination?.perPage}
						page={pagination?.page}
						onPageChange={(p) => handleChangePage(p, pagination?.perPage)}
						recordsPerPageOptions={PAGE_SIZES}
						onRecordsPerPageChange={(e) => handleChangePage(pagination?.page, e)}
						sortStatus={sortStatus}
						onSortStatusChange={setSortStatus}
						minHeight={200}
						paginationText={({ from, to, totalRecords }) => `${t('Showing_from_to_of_totalRecords_entries', { from: from, to: to, totalRecords: totalRecords })}`}
					/>
				</div>
			</div>
			<CategoryModal openModal={openModal} setOpenModal={setOpenModal} data={data} setData={setData} categoryMutate={mutate} />
		</div>
	);
};

export default ProductCategoryPage;
