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
import { Units } from '@/services/swr/product.twr';
import { DeleteUnit } from '@/services/apis/product.api';
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
import UnitModal from './UnitModal';
import IconNewEdit from '@/components/Icon/IconNewEdit';
import IconNewTrash from '@/components/Icon/IconNewTrash';
import IconNewPlus from '@/components/Icon/IconNewPlus';


interface Props {
    [key: string]: any;
}

const ProductUnitPage = ({ ...props }: Props) => {

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const router = useRouter();

    const [showLoader, setShowLoader] = useState(true);
    const [data, setData] = useState<any>();
    const [openModal, setOpenModal] = useState(false);

    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'desc' });


    // get data
    const { data: unit, pagination, mutate } = Units({ sortBy: "id.DESC", ...router.query });

    useEffect(() => {
        dispatch(setPageTitle(`${t('unit')}`));
    });

    useEffect(() => {
        setShowLoader(false);
    }, [unit])

    const handleEdit = (data: any) => {
        router.push(`/warehouse/product/unit/${data?.id}`);
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
                title: `${t('delete_unit')}`,
                text: `${t('delete')} ${name}`,
                padding: '2em',
                showCancelButton: true,
                cancelButtonText: `${t('cancel')}`,
                confirmButtonText: `${t('confirm')}`,
                reverseButtons: true,
            })
            .then((result) => {
                if (result.value) {
                    DeleteUnit({ id }).then(() => {
                        mutate();
                        showMessage(`${t('delete_unit_success')}`, 'success');
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

    const columns = [
        {
            accessor: 'id',
            title: '#',
            render: (records: any, index: any) => <span>{(pagination?.page - 1) * pagination?.perPage + index + 1}</span>,
        },
        { accessor: 'name', title: 'Tên Đvt', sortable: false },
        { accessor: 'description', title: 'Ghi chú', sortable: false },
        {
            accessor: 'action',
            title: 'Thao tác',
            titleClassName: '!text-center',
            width: '10%',
            render: (records: any) => (
                <div className="flex justify-start gap-2">
                    <div className="w-[60px]">
                        <button data-testId="edit-unit-btn" type="button" className='button-edit' onClick={() => handleEdit(records)}>
                            <IconNewEdit /><span>
                                {t('edit')}
                            </span>
                        </button>
                    </div>
                    <div className="w-[80px]">
                        <button data-testId="delete-unit-btn" type="button" className='button-delete' onClick={() => handleDelete(records)}>
                            <IconNewTrash />
                            <span>
                                {t('delete')}
                            </span>
                        </button>
                    </div>
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
            <title>unit</title>
            <div className="panel mt-6">
                <div className="flex md:items-center justify-between md:flex-row flex-col mb-4.5 gap-5">
                    <div className="flex items-center flex-wrap">
                        <button data-testId="add-unit" type="button" className="m-1 button-table button-create" onClick={(e) => router.push(`/warehouse/product/unit/create`)}>
                            <IconNewPlus />
                            <span className='uppercase'>{t('add')}</span>
                        </button>
                    </div>

                    <input data-testid="search-unit-input" autoComplete="off" type="text" className="form-input w-auto" placeholder={`${t('search')}`} onChange={(e) => handleSearch(e.target.value)} />
                </div>
                <div className="datatables">
                    <DataTable
                        highlightOnHover
                        className="whitespace-nowrap table-hover custom_table"
                        records={unit?.data}
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
            <UnitModal
                openModal={openModal}
                setOpenModal={setOpenModal}
                data={data}
                setData={setData}
                unitMutate={mutate}
            />
        </div>
    );
};

export default ProductUnitPage;
