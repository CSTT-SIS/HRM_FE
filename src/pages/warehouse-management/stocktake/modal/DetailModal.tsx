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
import HandleDetailModal from './HandleDetailModal';
import { StocktakeDetail } from '@/services/swr/stocktake.twr';
import { AddStocktakeDetailAuto, DeleteStocktakeDetail, StocktakeStart } from '@/services/apis/stocktake.api';
import TallyModal from './TallyModal';
import IconArchive from '@/components/Icon/IconArchive';

interface Props {
    [key: string]: any;
}

const DetailModal = ({ ...props }: Props) => {

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const router = useRouter();

    const [showLoader, setShowLoader] = useState(true);
    const [data, setData] = useState<any>();
    const [openModal, setOpenModal] = useState(false);
    const [openModalTally, setOpenModalTally] = useState(false);

    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'desc' });


    // get data
    const { data: stocktakeDetails, pagination, mutate } = StocktakeDetail({ id: props.idDetail, ...router.query });

    useEffect(() => {
        dispatch(setPageTitle(`${t('Stocktake')}`));
    });

    useEffect(() => {
        setShowLoader(false);
    }, [stocktakeDetails])
    
    const handleEdit = (data: any) => {
        if (props?.tally === true) {
            setOpenModalTally(true)
        } else {
            setOpenModal(true);
        }
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
                    DeleteStocktakeDetail({ id: props.idDetail, itemId: id }).then(() => {
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
                        props.tally !== true &&
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
        props.setOpenModalDetail(false);
        props.setTally(false);
    };

    const handleChangeComplete = () => {
        StocktakeStart({ id: props.idDetail }).then(() => {
            props.stocktakeMutate();
            props.setOpenModalDetail(false);
            showMessage(`${t('update_success')}`, 'success');
        }).catch((err) => {
            showMessage(`${err?.response?.data?.message}`, 'error');
        });
    }

    const handleAutoAdd = () => {
        AddStocktakeDetailAuto({ id: props.idDetail }).then(() => {
            props.stocktakeMutate();
            props.setOpenModalDetail(false);
            showMessage(`${t('update_success')}`, 'success');
        }).catch((err) => {
            showMessage(`${err?.response?.data?.message}`, 'error');
        });
    }

    return (
        <Transition appear show={props.openModalDetail ?? false} as={Fragment}>
            <Dialog as="div" open={props.openModalDetail} onClose={() => props.setOpenModalDetail(false)} className="relative z-50" >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-[black]/60" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center px-4 py-8">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="panel w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark" style={{ minWidth: '90%' }}>
                                <button
                                    type="button"
                                    onClick={() => handleCancel()}
                                    className="absolute top-4 text-gray-400 outline-none hover:text-gray-800 ltr:right-4 rtl:left-4 dark:hover:text-gray-600"
                                >
                                    <IconX />
                                </button>
                                <div className="bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pr-5 rtl:pl-[50px] dark:bg-[#121c2c]">
                                    {'Stocktake Detail'}
                                </div>

                                <div>
                                    {showLoader && (
                                        <div className="screen_loader fixed inset-0 bg-[#fafafa] dark:bg-[#060818] z-[60] grid place-content-center animate__animated">
                                            <IconLoading />
                                        </div>
                                    )}
                                    <div className="panel mt-6">
                                        <div className="flex md:items-center justify-between md:flex-row flex-col mb-4.5 gap-5">
                                            <div className="flex items-center flex-wrap">
                                                {props?.tally === false &&
                                                    <>
                                                        <button type="button" onClick={(e) => setOpenModal(true)} className="btn btn-primary btn-sm m-1 " >
                                                            <IconPlus className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                                            {t('add')}
                                                        </button>
                                                        <button type="button" onClick={(e) => handleAutoAdd()} className="btn btn-primary btn-sm m-1 " >
                                                            <IconArchive className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                                            {t('auto_add')}
                                                        </button>
                                                    </>
                                                }
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
                                            props.status === "DRAFT" &&
                                            <div className="mt-8 flex items-center justify-end ltr:text-right rtl:text-left">
                                                <button type="button" className="btn btn-outline-warning" onClick={() => handleCancel()}>
                                                    Pending
                                                </button>
                                                <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={() => handleChangeComplete()}>
                                                    {props.tally === true ? "Finish" : "Complete"}
                                                </button>
                                            </div>
                                        }
                                        {
                                            props.status === "IN_PROGRESS" && props.tally === true &&
                                            <div className="mt-8 flex items-center justify-end ltr:text-right rtl:text-left">
                                                <button type="button" className="btn btn-outline-warning" onClick={() => handleCancel()}>
                                                    Pending
                                                </button>
                                                <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={() => handleChangeComplete()}>
                                                    Finish
                                                </button>
                                            </div>
                                        }
                                    </div>
                                    <HandleDetailModal
                                        openModal={openModal}
                                        setOpenModal={setOpenModal}
                                        data={data}
                                        setData={setData}
                                        stocktakeDetailMutate={mutate}
                                        idDetail={props.idDetail}
                                    />
                                    <TallyModal
                                        openModal={openModalTally}
                                        setOpenModal={setOpenModalTally}
                                        data={data}
                                        setData={setData}
                                        stocktakeDetailMutate={mutate}
                                        idDetail={props.idDetail}
                                    />
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};
export default DetailModal;
