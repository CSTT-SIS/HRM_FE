import { useEffect, Fragment, useState, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog, Transition } from '@headlessui/react';

import { showMessage } from '@/@core/utils';
import IconX from '@/components/Icon/IconX';
import { useRouter } from 'next/router';
import { IconLoading } from '@/components/Icon/IconLoading';
import IconPencil from '@/components/Icon/IconPencil';
import { setPageTitle } from '@/store/themeConfigSlice';
import Tippy from '@tippyjs/react';
import { DataTableSortStatus, DataTable } from 'mantine-datatable';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import HandleDetailModal from '../form/HandleDetailModal';
import { DeleteOrderDetail, OrderPlace } from '@/services/apis/order.api';
import { WarehousingBillDetail } from '@/services/swr/warehousing-bill.twr';
import { WarehousingBillFinish } from '@/services/apis/warehousing-bill.api';
import DetailPage from '../form/WarehousingBillForm';

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

    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'desc' });


    // get data
    const { data: warehousingBillDetail, pagination, mutate } = WarehousingBillDetail({ id: router.query.id, page: 1, perPage: 10, ...router.query });
    useEffect(() => {
        dispatch(setPageTitle(`${t('proposal')}`));
    });

    useEffect(() => {
        setShowLoader(false);
    }, [warehousingBillDetail])

    const handleEdit = (data: any) => {
        setOpenModal(true);
        setData(data);
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
            accessor: 'action',
            title: 'Thao tác',
            titleClassName: '!text-center',
            render: (records: any) => (
                <div className="flex items-center w-max mx-auto gap-2">
                    <Tippy content={`${t('enter_quantity')}`}>
                        <button type="button" onClick={() => handleEdit(records)}>
                            <IconPencil />
                        </button>
                    </Tippy>
                </div>
            ),
        },
    ]

    const handleCancel = () => {
        router.push("/warehouse-process/warehousing-bill")
    };

    const handleChangeComplete = () => {
        WarehousingBillFinish({ id: router.query.id }).then(() => {
            router.push("/warehouse-process/warehousing-bill")
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
            <DetailPage mutate={mutate} />
            {
                router.query.id !== "create" &&
                <div className="panel mt-6">
                    <div className="flex md:items-center justify-between md:flex-row flex-col mb-4.5 gap-5">
                        <div className="flex items-center flex-wrap">
                            {/* <button type="button" onClick={(e) => setOpenModal(true)} className="btn btn-primary btn-sm m-1 " >
                        <IconPlus className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                        {t('add')}
                    </button> */}
                        </div>

                        <input type="text" className="form-input w-auto" placeholder={`${t('search')}`} onChange={(e) => handleSearch(e.target.value)} />
                    </div>
                    <div className="datatables">
                        <DataTable
                            highlightOnHover
                            className="whitespace-nowrap table-hover"
                            records={warehousingBillDetail?.data}
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
                        router.query.status !== "COMPLETED" &&
                        <div className="mt-8 flex items-center justify-end ltr:text-right rtl:text-left">
                            <button type="button" className="btn btn-outline-warning" onClick={() => handleCancel()}>
                                {t('pending')}
                            </button>
                            <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={() => handleChangeComplete()}>
                                {t('complete')}
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
                warehousingDetailMutate={mutate}
            // idDetail={props.idDetail}
            />
        </div>
    );
};
export default DetailModal;
