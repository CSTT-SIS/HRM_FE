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
import { Orders } from '@/services/swr/order.twr';
import { DeleteOrder, OrderCancel, OrderReceive, OrderShipping } from '@/services/apis/order.api';
// constants
import { PAGE_SIZES } from '@/utils/constants';
// helper
import { showMessage } from '@/@core/utils';
// icons
import { IconLoading } from '@/components/Icon/IconLoading';
import IconPlus from '@/components/Icon/IconPlus';
import IconPencil from '@/components/Icon/IconPencil';
import IconTrashLines from '@/components/Icon/IconTrashLines';
import IconXCircle from '@/components/Icon/IconXCircle';
import { IconCartCheck } from '@/components/Icon/IconCartCheck';
import { IconShipping } from '@/components/Icon/IconShipping';
import moment from 'moment';
import IconEye from '@/components/Icon/IconEye';

interface Props {
    [key: string]: any;
}

const OrderForm = ({ ...props }: Props) => {

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const router = useRouter();

    const [showLoader, setShowLoader] = useState(true);

    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'desc' });


    // get data
    const { data: orders, pagination, mutate } = Orders({ ...router.query });

    useEffect(() => {
        dispatch(setPageTitle(`${t('Order')}`));
    });

    useEffect(() => {
        setShowLoader(false);
    }, [orders])

    const handleDelete = ({ id, name }: any) => {
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
                icon: 'question',
                title: `${t('delete_order')}`,
                text: `${t('delete')} ${name}`,
                padding: '2em',
                showCancelButton: true,
                cancelButtonText: `${t('cancel')}`,
                confirmButtonText: `${t('confirm')}`,
                reverseButtons: true,
            })
            .then((result) => {
                if (result.value) {
                    DeleteOrder({ id }).then(() => {
                        mutate();
                        showMessage(`${t('delete_success')}`, 'success');
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

    const handleDetail = (value: any) => {
        router.push(`/warehouse-process/order/${value.id}?status=${value.status}`)
    }

    const handleShipping = ({ id }: any) => {
        OrderShipping({ id }).then(() => {
            mutate();
            showMessage(`${t('update_success')}`, 'success');
        }).catch((err) => {
            showMessage(`${err?.response?.data?.message}`, 'error');
        });
    }

    const handleCancel = ({ id }: any) => {
        OrderCancel({ id }).then(() => {
            mutate();
            showMessage(`${t('update_success')}`, 'success');
        }).catch((err) => {
            showMessage(`${err?.response?.data?.message}`, 'error');
        });
    }

    const handleReceive = ({ id }: any) => {
        OrderReceive({ id }).then(() => {
            mutate();
            showMessage(`${t('update_success')}`, 'success');
        }).catch((err) => {
            showMessage(`${err?.response?.data?.message}`, 'error');
        });
    }

    const columns = [
        {
            accessor: 'id',
            title: '#',
            render: (records: any, index: any) => <span>{(pagination?.page - 1) * pagination?.perPage + index + 1}</span>,
        },
        { accessor: 'name', title: 'Tên đơn hàng', sortable: false },
        { accessor: 'code', title: 'Mã đơn hàng', sortable: false },
        { accessor: 'type', title: 'Loại phiếu', sortable: false },
        {
            accessor: 'proposal',
            title: 'Yêu cầu',
            render: ({ proposal }: any) => <span>{proposal?.name}</span>,
        },
        {
            accessor: 'estimatedDeliveryDate',
            title: 'Nhận hàng dự kiến',
            render: ({ estimatedDeliveryDate }: any) => <span>{moment(estimatedDeliveryDate).format("DD/MM/YYYY")}</span>,
        },
        { accessor: 'status', title: 'Trạng thái', sortable: false },
        {
            accessor: 'action',
            title: 'Thao tác',
            titleClassName: '!text-center',
            render: (records: any) => (
                <div className="flex items-center w-max mx-auto gap-2">
                    <Tippy content={`${t('detail')}`}>
                        <button type="button" onClick={() => router.push(`/warehouse-process/order/${records.id}?status=${true}`)}>
                            <IconEye />
                        </button>
                    </Tippy>
                    {
                        records.status === "PENDING" &&
                        <Tippy content={`${t('edit')}`}>
                            <button type="button" onClick={() => handleDetail(records)}>
                                <IconPencil />
                            </button>
                        </Tippy>
                    }
                    {
                        (records.status === "PENDING" || records.status === "CANCELLED") &&
                        <Tippy content={`${t('delete')}`}>
                            <button type="button" onClick={() => handleDelete(records)}>
                                <IconTrashLines />
                            </button>
                        </Tippy>
                    }
                    {
                        (records.status === "PENDING" || records.status === "PLACED") &&
                        <>                        <Tippy content={`${t('shipping')}`}>
                            <button type="button" onClick={() => handleShipping(records)}>
                                <IconShipping size={20} />
                            </button>
                        </Tippy>
                            <Tippy content={`${t('cancel')}`}>
                                <button type="button" onClick={() => handleCancel(records)}>
                                    <IconXCircle />
                                </button>
                            </Tippy>
                        </>
                    }
                    {
                        (records.status === "PENDING" || records.status === "SHIPPING") &&
                        <Tippy content={`${t('receive')}`}>
                            <button type="button" onClick={() => handleReceive(records)}>
                                <IconCartCheck />
                            </button>
                        </Tippy>
                    }
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
                        <button type="button" onClick={(e) => router.push(`/warehouse-process/order/create`)} className="btn btn-primary btn-sm m-1 custom-button" >
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
                        records={orders?.data}
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
        </div>
    );
};

export default OrderForm;
