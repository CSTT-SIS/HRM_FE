import { useEffect, Fragment, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
// Third party libs
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import Swal from 'sweetalert2';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useTranslation } from 'react-i18next';
// API
import { Products } from '@/services/swr/product.twr';
// constants
import { PAGE_SIZES } from '@/utils/constants';
 import { DeleteProduct } from '@/services/apis/product.api';
// helper
import { showMessage } from '@/@core/utils';
// icons
import { IconLoading } from '@/components/Icon/IconLoading';
import IconPlus from '@/components/Icon/IconPlus';
import IconPencil from '@/components/Icon/IconPencil';
import IconTrashLines from '@/components/Icon/IconTrashLines';

// modal
import ProductModal from './ProductModal';
import ProductLimitModal from './ProductLimitModal';

interface Props {
	[key: string]: any;
}

const ProductCategoryPage = ({ ...props }: Props) => {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const router = useRouter();

	const [showLoader, setShowLoader] = useState(true);
	const [data, setData] = useState<any>();
	const [dataLimit, setDataLimit] = useState<any>();
	const [openModal, setOpenModal] = useState(false);
	const [openModalLimit, setOpenModalLimit] = useState(false);

	const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'desc' });

	// get data
	const { data: product, pagination, mutate } = Products({ sortBy: 'id.ASC', ...router.query });

	useEffect(() => {
		dispatch(setPageTitle(`${t('product')}`));
	});

	useEffect(() => {
		setShowLoader(false);
	}, [product]);

	const handleEdit = (data: any) => {
		router.push(`/warehouse/product/list/${data?.id}`);
		setData(data);
	};

	const handleDelete = ({ id, name }: any) => {
		const swalDeletes = Swal.mixin({
			customClass: {
				confirmButton: 'btn btn-secondary testid-confirm-btn',
				cancelButton: 'btn btn-danger ltr:mr-3 rtl:ml-3',
				popup: 'sweet-alerts',
			},
			buttonsStyling: false,
		});
		swalDeletes
			.fire({
				icon: 'question',
				title: `${t('delete_product')}`,
				text: `${t('delete')} ${name}`,
				padding: '2em',
				showCancelButton: true,
				reverseButtons: true,
			})
			.then((result) => {
				if (result.value) {
					DeleteProduct({ id })
						.then(() => {
							mutate();
							showMessage(`${t('delete_product_success')}`, 'success');
						})
						.catch((err) => {
							showMessage(`${err?.response?.data?.message}`, 'error');
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

	const handleLimit = (records: any) => {
		setOpenModalLimit(true);
		setDataLimit(records);
	};

	const columns = [
		{
			accessor: 'id',
			title: '#',
			render: (records: any, index: any) => <span>{(pagination?.page - 1) * pagination?.perPage + index + 1}</span>,
		},
		{ accessor: 'code', title: 'Mã sản phẩm', sortable: false },
		{ accessor: 'name', title: 'Tên sản phẩm', sortable: false },
		// { accessor: 'price', title: 'Giá', sortable: false },
		// { accessor: 'tax', title: 'Thuế', sortable: false },
		{
			accessor: 'unit',
			title: 'Đvt',
			render: ({ unit }: any) => <span>{unit?.name}</span>,
			sortable: false,
		},
		{
			accessor: 'category',
			title: 'Danh mục sản phẩm',
			render: ({ category }: any) => <span>{category?.name}</span>,
			sortable: false,
		},
		{ accessor: 'description', title: 'Ghi chú', sortable: false },
		{
			accessor: 'action',
			title: 'Thao tác',
			titleClassName: '!text-center',
			render: (records: any) => (
				<div className="mx-auto flex w-max items-center gap-2">
					<button className="flex justify-between gap-1 rounded bg-[#9CD3EB] p-1" type="button" onClick={() => handleEdit(records)} data-testid={'edit-product-btn'}>
						<IconPencil /> <span>{`${t('edit')}`}</span>
					</button>
					<button className="flex justify-between gap-1 rounded bg-[#E43940] p-1 text-[#F5F5F5]" type="button" onClick={() => handleDelete(records)} data-testid={'delete-product-btn'}>
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
			<title>product</title>
			<div className="panel mt-6">
				<div className="mb-4.5 flex flex-col justify-between gap-5 md:flex-row md:items-center">
					<div className="flex flex-wrap items-center">
						<button data-testid="add-product" type="button" onClick={(e) => router.push('/warehouse/product/list/create')} className="btn btn-primary btn-sm custom-button m-1">
							<IconPlus className="h-5 w-5 ltr:mr-2 rtl:ml-2" />
							{t('add')}
						</button>
					</div>

					<input type="text" data-testid="search-product-input" className="form-input w-auto" placeholder={`${t('search')}`} onChange={(e) => handleSearch(e.target.value)} />
				</div>
				<div className="datatables">
					<DataTable
						highlightOnHover
						className="table-hover whitespace-nowrap"
						records={product?.data}
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
			{/* <ProductModal
                openModal={openModal}
                setOpenModal={setOpenModal}
                data={data}
                setData={setData}
                productMutate={mutate}
            /> */}
			<ProductLimitModal openModal={openModalLimit} setOpenModal={setOpenModalLimit} data={dataLimit} setData={setDataLimit} productMutate={mutate} />
		</div>
	);
};

export default ProductCategoryPage;
