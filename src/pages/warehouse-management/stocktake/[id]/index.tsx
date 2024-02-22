import { useEffect, Fragment, useState, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog, Transition } from '@headlessui/react';

import { showMessage } from '@/@core/utils';
import IconX from '@/components/Icon/IconX';
import { useRouter } from 'next/router';
import { IconLoading } from '@/components/Icon/IconLoading';
import IconPencil from '@/components/Icon/IconPencil';
import IconPlus from '@/components/Icon/IconPlus';
import IconTrashLines from '@/components/Icon/IconTrashLines';
import { setPageTitle } from '@/store/themeConfigSlice';
import Tippy from '@tippyjs/react';
import { DataTableSortStatus, DataTable } from 'mantine-datatable';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import HandleDetailModal from '../form/DetailModal';
import { StocktakeDetail } from '@/services/swr/stocktake.twr';
import { AddStocktakeDetailAuto, DeleteStocktakeDetail, GetStocktake, StocktakeFinish, StocktakeStart } from '@/services/apis/stocktake.api';
import TallyModal from '../form/TallyModal';
import IconArchive from '@/components/Icon/IconArchive';
import StocktakeForm from '../form/StocktakeForm';
import { IconInventory } from '@/components/Icon/IconInventory';

interface Props {
    [key: string]: any;
}

const DetailPage = ({ ...props }: Props) => {

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const router = useRouter();

    const [showLoader, setShowLoader] = useState(true);
    const [data, setData] = useState<any>();
    const [openModal, setOpenModal] = useState(false);
    const [openModalTally, setOpenModalTally] = useState(false);

    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'desc' });


    // get data
    const { data: stocktakeDetails, pagination, mutate } = StocktakeDetail({ id: router.query.id, ...router.query });

    useEffect(() => {
        dispatch(setPageTitle(`${t('Stocktake')}`));
    });

    useEffect(() => {
        setShowLoader(false);
    }, [stocktakeDetails]);


    const getData = () => {
        GetStocktake({ id: router.query.id }).then((res) => {
            router.push({
                pathname: `/warehouse-management/stocktake/${res.data.id}`,
                query: {
                    status: res.data.status
                }
            })
        }).catch((err) => {
            showMessage(`${err?.response?.data?.message}`, 'error');
        });
    }

    const handleEdit = (data: any) => {
        setOpenModal(true);
        setData(data);
    };

    const handleDelete = ({ id, product }: any) => {
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
                text: `${t('delete')} ${product?.name}`,
                padding: '2em',
                showCancelButton: true,
                reverseButtons: true,
            })
            .then((result) => {
                if (result.value) {
                    DeleteStocktakeDetail({ id: router.query.id, itemId: id }).then(() => {
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

    const handleOpenTally = (value: any) => {
        setOpenModalTally(true);
        setData(value);
    }

    const columns = [
        {
            accessor: 'id',
            title: '#',
            render: (records: any, index: any) => <span>{(pagination?.page - 1) * pagination?.perPage + index + 1}</span>,
        },
        {
            accessor: 'name',
            title: 'Tên sản phẩm',
            render: ({ product }: any) => <span>{product?.name}</span>,
            sortable: false
        },
        {
            accessor: 'name',
            title: 'Đvt',
            render: ({ product }: any) => <span>{product?.unit.name}</span>,
            sortable: false
        },
        { accessor: 'countedQuantity', title: 'Số lượng đã đếm', sortable: false },
        { accessor: 'openingQuantity', title: 'Số lượng khai trương', sortable: false },
        { accessor: 'quantityDifference', title: 'Số lượng Chênh lệch', sortable: false },
        { accessor: 'note', title: 'Ghi chú', sortable: false },
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
                    {
                        router.query?.status !== "DRAFT" &&
                        <Tippy content={`${t('tally')}`}>
                            <button type="button" onClick={() => handleOpenTally(records)}>
                                <IconInventory />
                            </button>
                        </Tippy>
                    }
                    {
                        router.query?.status === "DRAFT" &&
                        <Tippy content={`${t('delete')}`}>
                            <button type="button" onClick={() => handleDelete(records)}>
                                <IconTrashLines />
                            </button>
                        </Tippy>
                    }
                </div>
            ),
        },
    ]

    const handleCancel = () => {
        router.push('/warehouse-management/stocktake');
    };

    const handleChangeComplete = () => {
        StocktakeStart({ id: router.query.id }).then(() => {
            showMessage(`${t('update_success')}`, 'success');
            getData();
        }).catch((err) => {
            showMessage(`${err?.response?.data?.message}`, 'error');
        });
    }

    const handleAutoAdd = () => {
        AddStocktakeDetailAuto({ id: router.query.id }).then(() => {
            showMessage(`${t('update_success')}`, 'success');
        }).catch((err) => {
            showMessage(`${err?.response?.data?.message}`, 'error');
        });
    }

    const handleFinish = () => {
        StocktakeFinish({ id: router.query.id }).then(() => {
            router.push('/warehouse-management/stocktake');
            showMessage(`${t('update_success')}`, 'success');
        }).catch((err) => {
            showMessage(`${err?.response?.data?.message}`, 'error');
        });
    }

    return (
        <div>
            {showLoader && (
                <div className="screen_loader fixed inset-0 bg-[#fafafa] dark:bg-[#060818] z-[60] grid place-content-center animate__animated">
                    <IconLoading />
                </div>
            )}
            <StocktakeForm />
            {
                router.query.id !== "create" &&
                <div className="panel mt-6">
                    <div className="bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pr-5 rtl:pl-[50px] dark:bg-[#121c2c]">
                        {t('stocktake_detail')}
                    </div>
                    <div className="flex md:items-center justify-between md:flex-row flex-col mb-4.5 gap-5 mt-3">
                        <div className="flex items-center flex-wrap">
                            <button type="button" onClick={(e) => setOpenModal(true)} className="btn btn-primary btn-sm m-1 " >
                                <IconPlus className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                {t('add_detail')}
                            </button>
                            <button type="button" onClick={(e) => handleAutoAdd()} className="btn btn-primary btn-sm m-1 " >
                                <IconArchive className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                {t('auto_add')}
                            </button>
                        </div>

                        <input type="text" className="form-input w-auto" placeholder={`${t('search')}`} onChange={(e) => handleSearch(e.target.value)} />
                    </div>
                    <div className="datatables">
                        <DataTable
                            highlightOnHover
                            className="whitespace-nowrap table-hover"
                            records={stocktakeDetails?.data}
                            columns={columns}
                            totalRecords={pagination?.totalRecords}
                            recordsPerPage={pagination?.perPage}
                            page={pagination?.page}
                            onPageChange={(p) => handleChangePage(p, pagination?.perPage)}
                            // recordsPerPageOptions={PAGE_SIZES}
                            // onRecordsPerPageChange={e => handleChangePage(pagination?.page, e)}
                            sortStatus={sortStatus}
                            onSortStatusChange={setSortStatus}
                            minHeight={200}
                            paginationText={({ from, to, totalRecords }) => ``}
                        />
                    </div>
                    {
                        router.query?.status === "DRAFT" ?
                            <div className="mt-8 flex items-center justify-end ltr:text-right rtl:text-left">
                                <button type="button" className="btn btn-outline-warning" onClick={() => handleCancel()}>
                                    {t("pending")}
                                </button>
                                <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={() => handleChangeComplete()}>
                                    {t("complete")}
                                </button>
                            </div>
                            :
                            <div className="mt-8 flex items-center justify-end ltr:text-right rtl:text-left">
                                <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={() => handleFinish()}>
                                    {t("finish")}
                                </button>
                            </div>
                    }
                </div>
            }
            <HandleDetailModal
                openModal={openModal}
                setOpenModal={setOpenModal}
                data={data}
                setData={setData}
                stocktakeDetailMutate={mutate}
            />
            <TallyModal
                openModal={openModalTally}
                setOpenModal={setOpenModalTally}
                data={data}
                setData={setData}
                stocktakeDetailMutate={mutate}
            />
        </div>
    );
};
export default DetailPage;
