import { useEffect, Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { showMessage } from '@/@core/utils';
import { useRouter } from 'next/router';
import { DeleteProposalDetail, ProposalPending } from '@/services/apis/proposal.api';
import { IconLoading } from '@/components/Icon/IconLoading';
import IconPencil from '@/components/Icon/IconPencil';
import IconTrashLines from '@/components/Icon/IconTrashLines';
import { ProposalDetails } from '@/services/swr/proposal.twr';
import { setPageTitle } from '@/store/themeConfigSlice';
import Tippy from '@tippyjs/react';
import { DataTableSortStatus, DataTable } from 'mantine-datatable';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import ProposalForm from '../form/ProposalForm';
import HandleDetailModal from '../form/DetailModal';
import IconPlus from '@/components/Icon/IconPlus';

interface Props {
    [key: string]: any;
}

const DetailPage = ({ ...props }: Props) => {

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const router = useRouter();

    const [showLoader, setShowLoader] = useState(true);
    const [dataDetail, setDataDetail] = useState<any>();
    const [openModal, setOpenModal] = useState(false);
    const [query, setQuery] = useState<any>();

    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'desc' });


    // get data
    const { data: ProposalDetail, pagination, mutate } = ProposalDetails({ ...query });

    useEffect(() => {
        dispatch(setPageTitle(`${t('proposal')}`));
    });

    useEffect(() => {
        setShowLoader(false);
    }, [ProposalDetail])

    useEffect(() => {
        if (Number(router.query.id)) {
            setQuery({ id: router.query.id, ...router.query })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.query.id]);

    const handleEdit = (data: any) => {
        setDataDetail(data);
        setOpenModal(true);
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
                    DeleteProposalDetail({ id: router.query.id, detailId: id }).then(() => {
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
        { accessor: 'quantity', title: 'Số lượng', sortable: false },
        { accessor: 'price', title: 'Giá', sortable: false },
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
                    <Tippy content={`${t('delete')}`}>
                        <button type="button" onClick={() => handleDelete(records)}>
                            <IconTrashLines />
                        </button>
                    </Tippy>
                </div>
            ),
        },
    ]

    const handleCancel = () => {
        router.push(`/warehouse-process/proposal-order`)
    };

    const handleChangeComplete = () => {
        ProposalPending({ id: router.query.id }).then(() => {
            showMessage(`${t('update_success')}`, 'success');
            router.push("/warehouse-process/proposal-order")
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
            <ProposalForm />
            <div className="p-5 panel">
                <div className='flex justify-between header-page-bottom pb-4 mb-4'>
                    <h1 className='page-title'> {t('proposal_detail')}</h1>
                </div>
                <div className="flex md:items-center justify-between md:flex-row flex-col mb-4.5 gap-5">
                    <div className="flex items-center flex-wrap">
                        <button type="button" onClick={(e) => router.query.id !== "create" ? setOpenModal(true) : showMessage(`${t('create_befor_update_detail')}`, 'error')} className="btn btn-primary btn-sm m-1 custom-button" >
                            <IconPlus className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                            {t('add_detail')}
                        </button>
                    </div>

                    <input type="text" className="form-input w-auto" placeholder={`${t('search')}`} onChange={(e) => handleSearch(e.target.value)} />
                </div>
                <div className="datatables">
                    <DataTable
                        highlightOnHover
                        className="whitespace-nowrap table-hover"
                        records={ProposalDetail?.data}
                        columns={columns}
                        // totalRecords={pagination?.totalRecords}
                        // recordsPerPage={pagination?.perPage}
                        // page={pagination?.page}
                        // onPageChange={(p) => handleChangePage(p, pagination?.perPage)}
                        // recordsPerPageOptions={PAGE_SIZES}
                        // onRecordsPerPageChange={e => handleChangePage(pagination?.page, e)}
                        sortStatus={sortStatus}
                        onSortStatusChange={setSortStatus}
                        minHeight={200}
                        // paginationText={({ from, to, totalRecords }) => ``}
                    />
                </div>
                {
                    router.query.status === "DRAFT" &&
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
            <HandleDetailModal
                openModal={openModal}
                setOpenModal={setOpenModal}
                data={dataDetail}
                setData={setDataDetail}
                proposalDetailMutate={mutate}
            // idDetail={props.idDetail}
            // type={props.type}
            />
        </div>

    );
};
export default DetailPage;


