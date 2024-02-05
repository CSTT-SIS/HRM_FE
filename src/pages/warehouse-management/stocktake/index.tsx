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
import moment from 'moment';
// API
import { Stocktakes } from '@/services/swr/stocktake.twr';
import { DeleteStocktake, StocktakeApprove, StocktakeCancel, StocktakeFinish, StocktakeReject } from '@/services/apis/stocktake.api';
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
import IconChecks from '@/components/Icon/IconChecks';
import IconCircleCheck from '@/components/Icon/IconCircleCheck';
import IconRestore from '@/components/Icon/IconRestore';
// modal
import DetailModal from './modal/DetailModal';
import StocktakeModal from './modal/StocktakeModal';
import { IconInventory } from '@/components/Icon/IconInventory';






interface Props {
    [key: string]: any;
}

const StocktakePage = ({ ...props }: Props) => {

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const router = useRouter();

    const [showLoader, setShowLoader] = useState(true);
    const [data, setData] = useState<any>();
    const [openModal, setOpenModal] = useState(false);
    const [openModalDetail, setOpenModalDetail] = useState(false);
    const [idDetail, setIdDetail] = useState();
    const [status, setStatus] = useState();
    const [tally, setTally] = useState(false);

    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'desc' });


    // get data
    const { data: stocktakes, pagination, mutate } = Stocktakes({ ...router.query });
    useEffect(() => {
        dispatch(setPageTitle(`${t('Stocktake')}`));
    });

    useEffect(() => {
        setShowLoader(false);
    }, [stocktakes])

    const handleEdit = (data: any) => {
        setOpenModal(true);
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
                title: `${t('delete_stocktake')}`,
                text: `${t('delete')} ${name}`,
                padding: '2em',
                showCancelButton: true,
                reverseButtons: true,
            })
            .then((result) => {
                if (result.value) {
                    DeleteStocktake({ id }).then(() => {
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
        setOpenModalDetail(true);
        setIdDetail(value.id);
        setStatus(value.status);
    }

    const handleReject = ({ id }: any) => {
        StocktakeReject({ id }).then(() => {
            mutate();
            showMessage(`${t('update_success')}`, 'success');
        }).catch((err) => {
            showMessage(`${err?.response?.data?.message}`, 'error');
        });
    }

    const handleCancel = ({ id }: any) => {
        StocktakeCancel({ id }).then(() => {
            mutate();
            showMessage(`${t('update_success')}`, 'success');
        }).catch((err) => {
            showMessage(`${err?.response?.data?.message}`, 'error');
        });
    }

    const handleApprove = ({ id }: any) => {
        StocktakeApprove({ id }).then(() => {
            mutate();
            showMessage(`${t('update_success')}`, 'success');
        }).catch((err) => {
            showMessage(`${err?.response?.data?.message}`, 'error');
        });
    }

    const handleFinish = ({ id }: any) => {
        StocktakeFinish({ id }).then(() => {
            mutate();
            showMessage(`${t('update_success')}`, 'success');
        }).catch((err) => {
            showMessage(`${err?.response?.data?.message}`, 'error');
        });
    }

    const handleTally = (value: any) => {
        setOpenModalDetail(true);
        setIdDetail(value.id);
        setStatus(value.status);
        setTally(true);
    }

    const columns = [
        {
            accessor: 'id',
            title: '#',
            render: (records: any, index: any) => <span>{(pagination?.page - 1) * pagination?.perPage + index + 1}</span>,
        },
        { accessor: 'name', title: 'Tên đơn hàng', sortable: false },
        {
            accessor: 'warehouse',
            title: 'Tên kho',
            render: ({ warehouse }: any) => <span>{warehouse?.name}</span>,
        },
        {
            accessor: 'participants',
            title: 'Người tham gia',
            render: ({ participants }: any) => {
                return participants?.map((item: any, index: any) => {
                    return (
                        <span key={item}>{index + 1 < participants.length ? item?.fullName + ", " : item?.fullName}</span>
                    )
                })
            }
        },
        {
            accessor: 'startDate',
            title: 'Ngày bắt đầu',
            render: ({ startDate }: any) => <span>{moment(startDate).format("DD/MM/YYYY")}</span>,
        },
        {
            accessor: 'EndDate',
            title: 'Ngày kết thúc',
            render: ({ EndDate }: any) => <span>{moment(EndDate).format("DD/MM/YYYY")}</span>,
        },
        { accessor: 'description', title: 'Ghi chú', sortable: false },
        { accessor: 'status', title: 'Trạng thái', sortable: false },
        {
            accessor: 'action',
            title: 'Thao tác',
            titleClassName: '!text-center',
            render: (records: any) => (
                <div className="flex items-center w-max mx-auto gap-2">
                    <Tippy content={`${t('add_detail')}`}>
                        <button type="button" onClick={() => handleDetail(records)}>
                            <IconPlus />
                        </button>
                    </Tippy>
                    <Tippy content={`${t('tally')}`}>
                        <button type="button" onClick={() => handleTally(records)}>
                            <IconInventory />
                        </button>
                    </Tippy>
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
                    <Tippy content={`${t('finish')}`}>
                        <button type="button" onClick={() => handleFinish(records)}>
                            <IconChecks />
                        </button>
                    </Tippy>
                    <Tippy content={`${t('reject')}`}>
                        <button type="button" onClick={() => handleReject(records)}>
                            <IconRestore />
                        </button>
                    </Tippy>
                    <Tippy content={`${t('cancel')}`}>
                        <button type="button" onClick={() => handleCancel(records)}>
                            <IconXCircle />
                        </button>
                    </Tippy>
                    <Tippy content={`${t('approve')}`}>
                        <button type="button" onClick={() => handleApprove(records)}>
                            <IconCircleCheck size={20} />
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
                        <button type="button" onClick={(e) => setOpenModal(true)} className="btn btn-primary btn-sm m-1 " >
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
                        records={stocktakes?.data}
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
            <StocktakeModal
                openModal={openModal}
                setOpenModal={setOpenModal}
                data={data}
                setData={setData}
                stocktakeMutate={mutate}
            />
            <DetailModal
                openModalDetail={openModalDetail}
                setOpenModalDetail={setOpenModalDetail}
                idDetail={idDetail}
                status={status}
                stocktakeMutate={mutate}
                tally={tally}
                setTally={setTally}
            />
        </div>
    );
};

export default StocktakePage;