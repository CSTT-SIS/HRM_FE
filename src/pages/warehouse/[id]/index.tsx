import { useEffect, Fragment, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { setPageTitle } from '@/store/themeConfigSlice';
// Third party libs
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import 'tippy.js/dist/tippy.css';
import { useTranslation } from 'react-i18next';
// API
import { ProductByIdWarehouse } from '@/services/swr/product.twr';
import { GetWarehouse } from '@/services/apis/warehouse.api';
// constants
import { PAGE_SIZES } from '@/utils/constants';
// helper
// icons
import { IconLoading } from '@/components/Icon/IconLoading';
import IconPlus from '@/components/Icon/IconPlus';
//modal
import ImportModal from '../modal/ImportModal';

interface Props {
    [key: string]: any;
}

const ShelfPage = ({ ...props }: Props) => {

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [openModal, setOpenModal] = useState(false);
    const [dataDetail, setDataDetail] = useState<any>();
    const router = useRouter();
    const [showLoader, setShowLoader] = useState(true);

    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'desc' });

    //get data
    const { data: product, pagination, mutate } = ProductByIdWarehouse({ sortBy: 'id.ASC', ...router.query });

    useEffect(() => {
        dispatch(setPageTitle(`${t('Warehouse')}`));
    });

    useEffect(() => {
        setShowLoader(false);
    }, [product]);

    useEffect(() => {
        GetWarehouse({ id: router.query.id }).then((res) => {
            setDataDetail(res.data);
        }).catch((err: any) => {
        });
    }, [router])

    const columns = [
        {
            accessor: 'id',
            title: '#',
            render: (records: any, index: any) => <span>{(pagination?.page - 1) * pagination?.perPage + index + 1}</span>,
        },
        {
            accessor: 'product',
            title: 'Tên sản phẩm',
            render: ({ product }: any) => <span >{product?.name}</span>,
            sortable: false
        },
        {
            accessor: 'product',
            title: 'Mã sản phẩm',
            render: ({ product }: any) => <span >{product?.code}</span>,
            sortable: false
        },
        {
            accessor: 'product',
            title: 'Đvt',
            render: ({ product }: any) => <span >{product?.unit.name}</span>,
            sortable: false
        },
        {
            accessor: 'product',
            title: 'Giá',
            render: ({ product }: any) => <span >{product?.price}</span>,
            sortable: false
        },
        {
            accessor: 'product',
            title: 'Thuế',
            render: ({ product }: any) => <span >{product?.tax}</span>,
            sortable: false
        },
        { accessor: 'quantity', title: 'Số lương', sortable: false },
        // { accessor: 'minQuantity', title: 'Số lương tối thiểu', sortable: false },
        // { accessor: 'maxQuantity', title: 'Số lương tối đa', sortable: false },
        { accessor: 'description', title: 'Ghi chú', sortable: false }
    ]

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

    const [openTab, setOpenTab] = useState(1);

    const RenderData = (data: any) => {
        delete data?.id;
        delete data?.createdAt;
        delete data?.parentId;
        delete data?.parentPath;
        delete data?.typeId;
        delete data?.managerId;
        typeof data?.type === 'object' && (data.type = data?.type.name);
        return (
            <>
                {
                    data && Object.keys(data).map((item) => {
                        return (
                            <div className='flex flex-col-reverse divide-y divide-y-reverse' key={item}>
                                <div className='flex flex-col-revers'>
                                    <div className="basis-32 text-xl antialiased font-light leading-10 text-current">{item}</div>
                                    <div className="basis-6 text-xl antialiased font-light leading-10 text-current">:</div>
                                    <div className="basis-1/4 text-xl antialiased font-light leading-10 text-current">{data[item]}</div>
                                </div>
                            </div>
                        );
                    })
                }
            </>
        )
    }

    return (
        <div>
            {showLoader && (
                <div className="screen_loader fixed inset-0 bg-[#fafafa] dark:bg-[#060818] z-[60] grid place-content-center animate__animated">
                    <IconLoading />
                </div>
            )}
            <title>ShelfPage</title>
            <>
                <div className="flex flex-wrap">
                    <div className="w-full">
                        <ul
                            className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row"
                            role="tablist"
                        >
                            <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                                <a
                                    className={
                                        "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                                        (openTab === 1
                                            ? "text-white bg-blue-500"
                                            : "text-black dark:bg-neutral-100")
                                    }
                                    onClick={e => {
                                        e.preventDefault();
                                        setOpenTab(1);
                                    }}
                                    data-toggle="tab"
                                    href="#link1"
                                    role="tablist"
                                >
                                    {t('warehouse_info')}
                                </a>
                            </li>
                            <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                                <a
                                    className={
                                        "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                                        (openTab === 2
                                            ? "text-white bg-blue-500"
                                            : "text-black dark:bg-neutral-100")
                                    }
                                    onClick={e => {
                                        e.preventDefault();
                                        setOpenTab(2);
                                    }}
                                    data-toggle="tab"
                                    href="#link2"
                                    role="tablist"
                                >
                                   {t('product_in_warehouse')}
                                </a>
                            </li>
                        </ul>
                        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
                            {/* <div className="px-4 py-5 flex-auto"> */}
                            <div className="tab-content tab-space">
                                <div className={openTab === 1 ? "block" : "hidden"} id="link1">
                                    <div className="panel" style={{ borderRadius: "0" }}>
                                        {
                                            RenderData(dataDetail)
                                        }
                                    </div>
                                </div>
                                <div className={openTab === 2 ? "block" : "hidden"} id="link2">
                                    <div className="panel" style={{ borderRadius: "0" }}>
                                        <div className="flex md:items-center justify-between md:flex-row flex-col mb-4.5 gap-5">
                                            <div className="flex items-center flex-wrap">
                                                <button type="button" onClick={(e) => setOpenModal(true)} className="btn btn-primary btn-sm m-1 " >
                                                    <IconPlus className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                                    {t('add')}
                                                </button>
                                            </div>
                                            <input type="text" className="form-input w-auto" placeholder={`${t('search')}`} onChange={(e) => handleSearch(e)} />
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
                                </div>
                            </div>
                            {/* </div> */}
                        </div>
                    </div>
                </div>
            </>
            <ImportModal openModal={openModal} setOpenModal={setOpenModal} importMutate={mutate} />
        </div>
    );
};

export default ShelfPage;
