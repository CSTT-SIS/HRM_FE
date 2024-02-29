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
import { IconRepair } from '@/components/Icon/IconRepair';

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
    }, [product])

    const handleEdit = (data: any) => {
        router.push(`/warehouse/product/list/${data?.id}`);
        setData(data);
    };

    const handleDelete = ({ id, name }: any) => {
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
                title: `${t('delete_product')}`,
                text: `${t('delete')} ${name}`,
                padding: '2em',
                showCancelButton: true,
                reverseButtons: true,
            })
            .then((result) => {
                if (result.value) {
                    DeleteProduct({ id }).then(() => {
                        mutate();
                        showMessage(`${t('delete_product_success')}`, 'success');
                    }).catch((err) => {
                        showMessage(`${err?.response?.data?.message}`, 'error');
                    });
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

    const handleLimit = (records: any) => {
        setOpenModalLimit(true);
        setDataLimit(records);
    }

    const columns = [
        {
            accessor: 'id',
            title: '#',
            render: (records: any, index: any) => <span>{(pagination?.page - 1) * pagination?.perPage + index + 1}</span>,
        },
        { accessor: 'name', title: 'Tên sản phẩm', sortable: false },
        { accessor: 'code', title: 'Mã sản phẩm', sortable: false },
        { accessor: 'price', title: 'Giá', sortable: false },
        { accessor: 'tax', title: 'Thuế', sortable: false },
        {
            accessor: 'unit',
            title: 'Đvt',
            render: ({ unit }: any) => <span >{unit?.name}</span>,
            sortable: false
        },
        {
            accessor: 'category',
            title: 'Danh mục',
            render: ({ category }: any) => <span >{category?.name}</span>,
            sortable: false
        },
        { accessor: 'description', title: 'Ghi chú', sortable: false },
        {
            accessor: 'action',
            title: 'Thao tác',
            titleClassName: '!text-center',
            render: (records: any) => (
                <div className="flex items-center w-max mx-auto gap-2">
                    <Tippy content={`${t('edit')}`}>
                        <button type="button" onClick={() => handleEdit(records)}>
                            <IconPencil />
                        </button>
                    </Tippy>
                    <Tippy content={`${t('limit')}`}>
                        <button type="button" onClick={() => handleLimit(records)}>
                            <IconRepair />
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
    ]

    return (
        <div>
            {showLoader && (
                <div className="screen_loader fixed inset-0 bg-[#fafafa] dark:bg-[#060818] z-[60] grid place-content-center animate__animated">
                    <IconLoading />
                </div>
            )}
            <title>product</title>
            <div className="panel mt-6">
                <div className="flex md:items-center justify-between md:flex-row flex-col mb-4.5 gap-5">
                    <div className="flex items-center flex-wrap">
                        <button type="button" onClick={(e) => router.push("/warehouse/product/list/create")} className="btn btn-primary btn-sm m-1 custom-button"  >
                            <IconPlus className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                            {t('add')}
                        </button>
                    </div>

                    <input type="text" className="form-input w-auto" placeholder={`${t('search')}`} onChange={(e) => handleSearch(e.target.value)} />
                </div>
                <div className="datatables">
                    <DataTable
                        highlightOnHover
                        className="whitespace-nowrap table-hover"
                        records={product?.data}
                        columns={columns}
                        totalRecords={pagination?.totalRecords}
                        recordsPerPage={pagination?.perPage}
                        page={pagination?.page}
                        onPageChange={(p) => handleChangePage(p, pagination?.perPage)}
                        recordsPerPageOptions={PAGE_SIZES}
                        onRecordsPerPageChange={e => handleChangePage(pagination?.page, e)}
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
            <ProductLimitModal
                openModal={openModalLimit}
                setOpenModal={setOpenModalLimit}
                data={dataLimit}
                setData={setDataLimit}
                productMutate={mutate}
            />
        </div>
    );
};

export default ProductCategoryPage;
