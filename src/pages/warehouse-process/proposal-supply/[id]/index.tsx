import { useEffect, Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { showMessage } from '@/@core/utils';
import { useRouter } from 'next/router';
import { AddProposalDetail, AddProposalDetails, CreateProposal, DeleteProposalDetail, EditProposal, EditProposalDetail, GetProposal, ProposalPending } from '@/services/apis/proposal.api';
import { IconLoading } from '@/components/Icon/IconLoading';
import IconPencil from '@/components/Icon/IconPencil';
import IconTrashLines from '@/components/Icon/IconTrashLines';
import { ProposalDetails } from '@/services/swr/proposal.twr';
import { setPageTitle } from '@/store/themeConfigSlice';
import Tippy from '@tippyjs/react';
import { DataTableSortStatus, DataTable } from 'mantine-datatable';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import ProposalForm from '../modal/ProposalForm';
import HandleDetailModal from '../modal/DetailModal';
import IconPlus from '@/components/Icon/IconPlus';
import IconCaretDown from '@/components/Icon/IconCaretDown';
import AnimateHeight from 'react-animate-height';
import Link from 'next/link';
import IconBackward from '@/components/Icon/IconBackward';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import Select, { components } from 'react-select';
import IconBack from '@/components/Icon/IconBack';

interface Props {
    [key: string]: any;
}

const DetailPage = ({ ...props }: Props) => {

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const router = useRouter();

    const [dataDetail, setDataDetail] = useState<any>();
    const [listDataDetail, setListDataDetail] = useState<any>();
    const [openModal, setOpenModal] = useState(false);
    const [query, setQuery] = useState<any>();
    const [active, setActive] = useState<any>(1);
    const [initialValue, setInitialValue] = useState<any>();
    const [data, setData] = useState<any>();
    const [page, setPage] = useState(1);


    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'desc' });


    // get data
    const { data: ProposalDetail, pagination, mutate, isLoading } = ProposalDetails({ ...query });

    useEffect(() => {
        dispatch(setPageTitle(`${t('proposal')}`));
    });

    useEffect(() => {
        if (Number(router.query.id)) {
            setListDataDetail(ProposalDetail?.data);
        }
    }, [ProposalDetail?.data, router])

    useEffect(() => {
        if (Number(router.query.id)) {
            GetProposal({ id: router.query.id }).then((res) => {
                setData(res.data);
            }).catch((err) => {
                showMessage(`${err?.response?.data?.message}`, 'error');
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.query.id])

    useEffect(() => {
        setInitialValue({
            name: data ? `${data?.name}` : "",
            content: data ? `${data?.content}` : "",
            departmentId: data?.departmentId ? {
                value: `${data?.departmentId?.id}`,
                label: `${data?.departmentId?.name}`
            } : ""
        })
    }, [data, router]);

    useEffect(() => {
        if (Number(router.query.id)) {
            setQuery({ id: router.query.id, ...router.query })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.query.id]);

    const SubmittedForm = Yup.object().shape({
        name: Yup.string().required(`${t('please_fill_name_proposal')}`),
        content: Yup.string().required(`${t('please_fill_content_proposal')}`),
        departmentId: new Yup.ObjectSchema().required(`${t('please_fill_department')}`)
    });

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
                    if (Number(router.query.id)) {
                        DeleteProposalDetail({ id: router.query.id, detailId: id }).then(() => {
                            mutate();
                            showMessage(`${t('delete_product_success')}`, 'success');
                        }).catch((err) => {
                            showMessage(`${err?.response?.data?.message}`, 'error');
                        });
                    } else {
                        setListDataDetail(listDataDetail?.filter((item: any) => item.id !== id));
                    }
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

    const columns = [
        {
            accessor: 'id',
            title: '#',
            render: (records: any, index: any) => <span>{index}</span>,
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
        router.push(`/warehouse-process/proposal-supply`)
    };

    const handleChangeComplete = (id: any) => {
        ProposalPending({ id: id }).then(() => {
            showMessage(`${t('update_success')}`, 'success');
            router.push("/warehouse-process/proposal-order")
        }).catch((err) => {
            showMessage(`${err?.response?.data?.message}`, 'error');
        });
    }

    const handleActive = (value: any) => {
        setActive(active === value ? 0 : value);
    }

    const handleProposal = (param: any) => {
        const query: any = {
            name: param.name,
            type: "SUPPLY",
            content: param.content,
        };

        if (data) {
            EditProposal({ id: data?.id, ...query }).then((res) => {
                showMessage(`${t('edit_success')}`, 'success');
                handleCancel();
            }).catch((err) => {
                showMessage(`${err?.response?.data?.message}`, 'error');
            });
        } else {
            if (listDataDetail?.length === undefined || listDataDetail?.length === 0) {
                showMessage(`${t('please_add_product')}`, 'error');
                handleActive(2);
            } else {
                CreateProposal(query).then((res) => {
                    handleDetail(res.data.id);
                }).catch((err) => {
                    showMessage(`${err?.response?.data?.message}`, 'error');
                });
            }
        }
    }
    const handleDetail = (id: any) => {
        AddProposalDetails({
            id: id, details: listDataDetail
        }).then(async () => {
            await handleConfirm({ id: id });
        }).catch((err) => {
            showMessage(`${err?.response?.data?.message}`, 'error');
        });
    }

    const handleConfirm = ({ id, name }: any) => {
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
                title: `${t('complete_supply')}`,
                text: `${t('move_to_warehouse')}`,
                padding: '2em',
                showCancelButton: true,
                reverseButtons: true,
            })
            .then((result) => {
                if (result.value) {
                    handleChangeComplete(id);
                }
                showMessage(`${t('create_success')}`, 'success');
                handleCancel();
            });
    };

    const RenturnError = (param: any) => {
        if (Object.keys(param?.errors || {}).length > 0 && param?.submitCount > 0) {
            handleActive(1);
        }
        return <></>;
    }

    // useEffect(() => {
    //     if (paginationUser?.page === undefined) return;
    //     if (paginationUser?.page === 1) {
    //         setDataUserDropdown(users?.data)
    //     } else {
    //         setDataUserDropdown([...dataUserDropdown, ...users?.data])
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [paginationUser])

    // const handleMenuScrollToBottom = () => {
    //     setTimeout(() => {
    //         setPage(paginationUser?.page + 1);
    //     }, 1000);
    // }

    return (
        <div>
            {isLoading && (
                <div className="screen_loader fixed inset-0 bg-[#fafafa] dark:bg-[#060818] z-[60] grid place-content-center animate__animated">
                    <IconLoading />
                </div>
            )}
            <div className='flex justify-between header-page-bottom pb-4 mb-4'>
                <h1 className='page-title'>{t('proposal')}</h1>
                <Link href="/warehouse-process/proposal-order">
                    <div className="btn btn-primary btn-sm m-1 back-button h-9" >
                        <IconBack />
                        <span>
                            {t('back')}
                        </span>
                    </div>
                </Link>
            </div>
            <div className="mb-5">
                <Formik
                    initialValues={initialValue}
                    validationSchema={SubmittedForm}
                    onSubmit={values => {
                        handleProposal(values);
                    }}
                    enableReinitialize
                >

                    {({ errors, values, submitCount, setFieldValue }) => (
                        <Form className="space-y-5" >
                            <div className="font-semibold">
                                <div className="rounded">
                                    <button
                                        type="button"
                                        className={`flex w-full items-center p-4 text-white-dark dark:bg-[#1b2e4b] custom-accordion uppercase`}
                                        onClick={() => handleActive(1)}
                                    >
                                        {t('proposal_infomation')}
                                        <div className={`ltr:ml-auto rtl:mr-auto ${active === 1 ? 'rotate-180' : ''}`}>
                                            <IconCaretDown />
                                        </div>
                                    </button>
                                    <div className={`mb-2 ${active === 1 ? 'custom-content-accordion' : ''}`}>
                                        <AnimateHeight duration={300} height={active === 1 ? 'auto' : 0}>
                                            <div className='p-4'>
                                                <div className='flex justify-between gap-5'>
                                                    <div className=" w-1/2">
                                                        <label htmlFor="name" className='label'> {t('content_proposal')} < span style={{ color: 'red' }}>* </span></label >
                                                        <Field
                                                            name="name"
                                                            type="text"
                                                            id="name"
                                                            placeholder={`${t('enter_name')}`}
                                                            className="form-input"
                                                        />
                                                        {submitCount && errors.name ? (
                                                            <div className="text-danger mt-1"> {`${errors.name}`} </div>
                                                        ) : null}
                                                    </div>
                                                    <div className=" w-1/2">
                                                        <label htmlFor="type" className='label'> {t('description')} < span style={{ color: 'red' }}>* </span></label >
                                                        <Field
                                                            name="content"
                                                            type="text"
                                                            id="content"
                                                            placeholder={`${t('enter_content')}`}
                                                            className="form-input"
                                                        />
                                                        {submitCount && errors.content ? (
                                                            <div className="text-danger mt-1"> {`${errors.content}`} </div>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className='flex justify-between gap-5 mt-5'>
                                                    <div className=" w-1/2">
                                                        <label htmlFor="departmentId" className='label'> {t('department')} < span style={{ color: 'red' }}>* </span></label >
                                                        <Select
                                                            id='departmentId'
                                                            name='departmentId'
                                                            options={[]}
                                                            maxMenuHeight={160}
                                                            value={values?.departmentId}
                                                            onMenuOpen={() => setPage(1)}
                                                            // onMenuScrollToBottom={handleMenuScrollToBottom}
                                                            // isLoading={userLoading}
                                                            onChange={e => {
                                                                setFieldValue('departmentId', e)
                                                            }}
                                                        />
                                                        {submitCount && errors.departmentId ? (
                                                            <div className="text-danger mt-1"> {`${errors.departmentId}`} </div>
                                                        ) : null}
                                                    </div>
                                                    <div className='w-1/2'></div>
                                                </div>
                                            </div>
                                        </AnimateHeight>
                                    </div>
                                </div>
                                <div className="rounded">
                                    <button
                                        type="button"
                                        className={`flex w-full items-center p-4 text-white-dark dark:bg-[#1b2e4b] custom-accordion uppercase`}
                                        onClick={() => handleActive(2)}
                                    >
                                        {t('proposal_detail')}
                                        <div className={`ltr:ml-auto rtl:mr-auto ${active === 1 ? 'rotate-180' : ''}`}>
                                            <IconCaretDown />
                                        </div>
                                    </button>
                                    <div className={`${active === 2 ? 'custom-content-accordion' : ''}`}>
                                        <AnimateHeight duration={300} height={active === 2 ? 'auto' : 0}>
                                            <div className='p-4'>
                                                <div className="flex md:items-center justify-between md:flex-row flex-col mb-4 gap-5">
                                                    <div className="flex items-center flex-wrap">
                                                        <button type="button" onClick={(e) => setOpenModal(true)} className="btn btn-primary btn-sm m-1 custom-button" >
                                                            <IconPlus className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                                            {t('add_detail')}
                                                        </button>
                                                    </div>

                                                    {/* <input type="text" className="form-input w-auto" placeholder={`${t('search')}`} onChange={(e) => handleSearch(e.target.value)} /> */}
                                                </div>
                                                <div className="datatables">
                                                    <DataTable
                                                        highlightOnHover
                                                        className="whitespace-nowrap table-hover"
                                                        records={listDataDetail}
                                                        columns={columns}
                                                        sortStatus={sortStatus}
                                                        onSortStatusChange={setSortStatus}
                                                        minHeight={200}
                                                    />
                                                </div>
                                            </div>
                                        </AnimateHeight>
                                    </div>
                                </div>
                                <div className="mt-8 flex items-center justify-end ltr:text-right rtl:text-left">
                                    <button type="button" className="btn btn-outline-danger cancel-button" onClick={() => handleCancel()}>
                                        {t('cancel')}
                                    </button>
                                    <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4 add-button">
                                        {router.query.id !== "create" ? t('update') : t('add')}
                                    </button>
                                </div>
                            </div>
                            {
                                active !== 1 &&
                                <RenturnError errors={errors} submitCount={submitCount} />
                            }
                        </Form>
                    )
                    }
                </Formik >
            </div >
            <HandleDetailModal
                openModal={openModal}
                setOpenModal={setOpenModal}
                data={dataDetail}
                setData={setDataDetail}
                listData={listDataDetail}
                setListData={setListDataDetail}
                proposalDetailMutate={mutate}
            />
        </div >
    );
};
export default DetailPage;
