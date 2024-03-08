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
import { CreateWarehouse, EditWarehouse, GetWarehouse } from '@/services/apis/warehouse.api';
// constants
import { PAGE_SIZES } from '@/utils/constants';
// helper
// icons
import { IconLoading } from '@/components/Icon/IconLoading';
import IconPlus from '@/components/Icon/IconPlus';
import ImportModal from '../modal/importModal';
import { Field, Form, Formik } from 'formik';
import { showMessage } from '@/@core/utils';
import * as Yup from 'yup';
import Link from 'next/link';
import IconBackward from '@/components/Icon/IconBackward';


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
            render: ({ product }: any) => <span >{product?.unit?.name}</span>,
            sortable: false
        },
        // {
        //     accessor: 'product',
        //     title: 'Giá',
        //     render: ({ product }: any) => <span >{product?.price}</span>,
        //     sortable: false
        // },
        // {
        //     accessor: 'product',
        //     title: 'Thuế',
        //     render: ({ product }: any) => <span >{product?.tax}</span>,
        //     sortable: false
        // },
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
        const SubmittedForm = Yup.object().shape({
            name: Yup.string().min(2, 'Too Short!').required(`${t('please_fill_name_warehouse')}`),
            code: Yup.string().min(2, 'Too Short!').required(`${t('please_fill_warehouseCode')}`),
        });

        const handleWarehouse = (param: any) => {
            const query = {
                name: param.name,
                code: param.code,
                description: param.description
            }
            if (data) {
                EditWarehouse({ id: data.id, ...query }).then(() => {
                    // handleCancel();
                    showMessage(`${t('edit_warehouse_success')}`, 'success');
                }).catch((err) => {
                    showMessage(`${t('edit_warehouse_error')}`, 'error');
                });
            } else {
                CreateWarehouse(query).then(() => {
                    // handleCancel();
                    showMessage(`${t('create_warehouse_success')}`, 'success');
                }).catch((err) => {
                    showMessage(`${t('create_warehouse_error')}`, 'error');
                });
            }
        }
        return (
            <div className="p-5">
                <Formik
                    initialValues={
                        {
                            name: data ? `${data?.name}` : "",
                            code: data ? `${data?.code}` : "",
                            description: data ? `${data?.description}` : ""
                        }
                    }
                    validationSchema={SubmittedForm}
                    onSubmit={values => {
                        handleWarehouse(values);
                    }}
                    enableReinitialize={true}
                >

                    {({ errors, setFieldValue, values }) => (
                        <Form className="space-y-5" >
                            <div className='flex justify-between gap-5 mt-5 mb-5'>
                                <div className="w-1/2">
                                    <label htmlFor="name" > {t('name')} < span style={{ color: 'red' }}>* </span></label >
                                    <Field name="name" type="text" id="name" placeholder={`${t('enter_name')}`} className="form-input" />
                                    {errors.name ? (
                                        <div className="text-danger mt-1"> {errors.name} </div>
                                    ) : null}
                                </div>
                                <div className="w-1/2">
                                    <label htmlFor="code" > {t('code')} < span style={{ color: 'red' }}>* </span></label >
                                    <Field name="code" type="text" id="code" placeholder={`${t('enter_code')}`} className="form-input" />
                                    {errors.code ? (
                                        <div className="text-danger mt-1"> {errors.code} </div>
                                    ) : null}
                                </div>
                            </div>
                            <div className="mb-5">
                                <label htmlFor="description" > {t('description')} </label >
                                <Field name="description" as="textarea" id="description" placeholder={`${t('enter_description')}`} className="form-input" />
                                {errors.description ? (
                                    <div className="text-danger mt-1"> {errors.description} </div>
                                ) : null}
                            </div>
                            <div className="mt-8 flex items-center justify-end ltr:text-right rtl:text-left ">
                                {/* <button type="button" className="btn btn-outline-danger cancel-button" onClick={() => handleCancel()}>
                                    {t('cancel')}
                                </button> */}
                                <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4 add-button">
                                    {router.query.id !== "create" ? t('update') : t('add')}
                                </button>
                            </div>

                        </Form>
                    )}
                </Formik>
            </div>
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
                        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded panel">
                            <div className='flex justify-between'>
                                <Link href="/warehouse">
                                    <div className="btn btn-primary btn-sm m-1 gap-3 bg-[#E9EBD5] text-[#476704] border-[#E9EBD5] w-28 h-9" >
                                        <IconBackward />
                                        <span>
                                            {t('back')}
                                        </span>
                                    </div>
                                </Link>
                            </div>
                            <ul
                                className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row"
                                role="tablist"
                            >
                                <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                                    <a
                                        className={
                                            "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                                            (openTab === 1
                                                ? "text-[#476704] bg-[#E9EBD5]"
                                                : "text-[#BABABA] bg-[#EBEAEA]")
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
                                                ? "text-[#476704] bg-[#E9EBD5]"
                                                : "text-[#BABABA] bg-[#EBEAEA]")
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
                            {/* <div className="px-4 py-5 flex-auto"> */}
                            <div className="tab-content tab-space">
                                <div className={openTab === 1 ? "block" : "hidden"} id="link1">
                                    <div className="" style={{ borderRadius: "0" }}>
                                        {
                                            RenderData(dataDetail)
                                        }
                                    </div>
                                </div>
                                <div className={openTab === 2 ? "block" : "hidden"} id="link2">
                                    <div className="" style={{ borderRadius: "0" }}>
                                        <div className="flex md:items-center justify-between md:flex-row flex-col mb-4.5 gap-5">
                                            <div className="flex items-center flex-wrap">
                                                <button type="button" onClick={(e) => setOpenModal(true)} className="btn btn-primary btn-sm m-1 custom-button" >
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
