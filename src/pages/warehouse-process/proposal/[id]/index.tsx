import { useEffect, Fragment, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { showMessage } from '@/@core/utils';
import { useRouter } from 'next/router';
import { AddProposalDetail, AddProposalDetails, CreateProposal, DeleteProposalDetail, EditProposal, EditProposalDetail, GetProposal, ProposalApprove, ProposalPending, ProposalReject } from '@/services/apis/proposal.api';
import { IconLoading } from '@/components/Icon/IconLoading';
import IconPencil from '@/components/Icon/IconPencil';
import IconTrashLines from '@/components/Icon/IconTrashLines';
import { ProposalDetails } from '@/services/swr/proposal.twr';
import { setPageTitle } from '@/store/themeConfigSlice';
import { DataTableSortStatus, DataTable } from 'mantine-datatable';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import IconPlus from '@/components/Icon/IconPlus';
import IconCaretDown from '@/components/Icon/IconCaretDown';
import AnimateHeight from 'react-animate-height';
import Link from 'next/link';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import Select, { components } from 'react-select';
import IconBack from '@/components/Icon/IconBack';
import { DropdownDepartment, DropdownWarehouses } from '@/services/swr/dropdown.twr';
import DetailModal from '../modal/DetailModal';
import moment from 'moment';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
interface Props {
    [key: string]: any;
}

const DetailPage = ({ ...props }: Props) => {

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const router = useRouter();

    const [disable, setDisable] = useState<any>(false);
    const [dataDetail, setDataDetail] = useState<any>();
    const [listDataDetail, setListDataDetail] = useState<any>();
    const [openModal, setOpenModal] = useState(false);
    const [query, setQuery] = useState<any>({});
    const [active, setActive] = useState<any>([1, 2]);
    const [initialValue, setInitialValue] = useState<any>();
    const [warehouseId, setWarehouseId] = useState<any>();
    const [data, setData] = useState<any>();
    const [page, setPage] = useState(1);
    const [dataDepartment, setDataDepartment] = useState<any>([]);
    const formRef = useRef<any>();
    const [searchDepartment, setSearchDepartment] = useState<any>();

    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'desc' });


    // get data
    const { data: ProposalDetail, pagination, mutate, isLoading } = ProposalDetails({ ...query });
    const { data: dropdownDepartment, pagination: paginationDepartment, mutate: mutateDepartment, isLoading: isLoadingDepartment } = DropdownDepartment({ page: page, search: searchDepartment });
    const { data: warehouseDropdown, pagination: warehousePagination, isLoading: warehouseLoading } = DropdownWarehouses({ page: 1 });

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
        setDisable(router.query.status === "true" ? true : false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.query])

    useEffect(() => {
        setInitialValue({
            name: data ? `${data?.name}` : "",
            content: data ? `${data?.content}` : "",
            departmentId: data?.department ? {
                value: `${data?.department?.id}`,
                label: `${data?.department?.name}`
            } : "",
            personRequest: data?.createdBy ? data?.createdBy.fullName : JSON.parse(localStorage.getItem('profile') || "").fullName,
            timeRequest: data?.createdAt ? data?.createdAt : moment().format("YYYY-MM-DD hh:mm"),
            warehouseId: data ? {
                value: `${data?.warehouse?.id}`,
                label: `${data?.warehouse?.name}`,
            }
                : '',
        })
        if (data?.warehouse?.length > 0) {
            setWarehouseId(data?.warehouse?.id)
        }
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
                popup: 'confirm-delete',
            },
            imageUrl: '/assets/images/delete_popup.png',
            buttonsStyling: false,
        });
        swalDeletes
            .fire({
                icon: 'question',
                title: `${t('delete_product')}`,
                text: `${t('delete')} ${product?.name}`,
                padding: '2em',
                showCancelButton: true,
                cancelButtonText: `${t('cancel')}`,
                confirmButtonText: `${t('confirm')}`,
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
            render: (records: any, index: any) => <span>{index + 1}</span>,
        },
        {
            accessor: 'name',
            title: 'Tên Vật tư',
            render: ({ product }: any) => <span>{product?.name}</span>,
            sortable: false
        },
        { accessor: 'quantity', title: 'Số lượng', sortable: false },
        // { accessor: 'price', title: 'Giá', sortable: false },
        { accessor: 'note', title: 'Mô tả', sortable: false },
        {
            accessor: 'action',
            title: 'Thao tác',
            titleClassName: '!text-center',
            render: (records: any) => (
                <div className="flex items-center w-max mx-auto gap-2">
                    {
                        !disable &&
                        <>
                            <button className='bg-[#9CD3EB] flex justify-between gap-1 p-1 rounded' type="button" onClick={() => handleEdit(records)}>
                                <IconPencil /> <span>{`${t('edit')}`}</span>
                            </button>
                            <button className='bg-[#E43940] flex justify-between gap-1 p-1 rounded text-[#F5F5F5]' type="button" onClick={() => handleDelete(records)}>
                                <IconTrashLines />  <span>{`${t('delete')}`}</span>
                            </button>
                        </>
                    }
                </div>
            ),
        },
    ]

    const handleCancel = () => {
        router.push(`/warehouse-process/proposal`)
    };

    const handleChangeComplete = (id: any) => {
        ProposalPending(id).then(() => {
            showMessage(`${t('update_success')}`, 'success');
            router.push("/warehouse-process/proposal")
        }).catch((err) => {
            showMessage(`${err?.response?.data?.message}`, 'error');
        });
    }

    const handleActive = (value: any) => {
        if (active.includes(value)) {
            setActive(active.filter((item: any) => item !== value));
        } else {
            setActive([value, ...active]);
        }
    }

    const handleProposal = (param: any) => {
        const query: any = {
            name: param.name,
            type: "SUPPLY",
            content: param.content,
            departmentId: Number(param?.departmentId?.value),
            warehouseId: Number(param?.warehouseId?.value)
        };

        if (data) {
            EditProposal({ id: data?.id, ...query }).then((res) => {
                showMessage(`${t('edit_success')}`, 'success');
                if (data.status !== "PENDING") {
                    handleChangeComplete({ id: data?.id })
                }
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
                    showMessage(`${err?.response?.data?.message[0].error}`, 'error');
                });
            }
        }
        handleCancel();
    }
    const handleDetail = (id: any) => {
        AddProposalDetails({
            id: id, details: listDataDetail
        }).then(() => {
            handleChangeComplete({ id: id });
        }).catch((err) => {
            showMessage(`${err?.response?.data?.message}`, 'error');
        });
    }

    const RenturnError = (param: any) => {
        if (Object.keys(param?.errors || {}).length > 0 && param?.submitCount > 0) {
            showMessage(`${t('please_add_infomation')}`, 'error');
        }
        return <></>;
    }

    useEffect(() => {
        if (paginationDepartment?.page === undefined) return;
        if (paginationDepartment?.page === 1) {
            setDataDepartment(dropdownDepartment?.data)
        } else {
            setDataDepartment([...dataDepartment, ...dropdownDepartment?.data])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paginationDepartment])
    const handleMenuScrollToBottom = () => {
        setTimeout(() => {
            setPage(paginationDepartment?.page + 1);
        }, 1000);
    }

    const handleApprove = () => {
        ProposalApprove({ id: router.query.id }).then(() => {
            handleCancel();
            showMessage(`${t('update_success')}`, 'success');
        }).catch((err) => {
            showMessage(`${err?.response?.data?.message}`, 'error');
        });
    }

    const handleReject = () => {
        ProposalReject({ id: router.query.id }).then(() => {
            handleCancel();
            showMessage(`${t('update_success')}`, 'success');
        }).catch((err) => {
            showMessage(`${err?.response?.data?.message}`, 'error');
        });
    }

    const handleSubmit = () => {
        if (formRef.current) {
            formRef.current.handleSubmit()
        }
    }
    return (
        <div>
            {isLoading && (
                <div className="screen_loader fixed inset-0 bg-[#fafafa] dark:bg-[#060818] z-[60] grid place-content-center animate__animated">
                    <IconLoading />
                </div>
            )}
            <div className='flex justify-between header-page-bottom pb-4 mb-4'>
                <h1 className='page-title'>{t('proposal_supply')}</h1>
                <Link href="/warehouse-process/proposal">
                    <div className="btn btn-primary btn-sm m-1 back-button h-9" >
                        <IconBack />
                        <span>
                            {t('back')}
                        </span>
                    </div>
                </Link>
            </div>
            <div className="mb-5">
                <div className="font-semibold">
                    <div className="rounded">
                        <button
                            type="button"
                            className={`flex w-full items-center p-4 text-white-dark dark:bg-[#1b2e4b] custom-accordion uppercase`}
                            onClick={() => handleActive(1)}
                        >
                            {t('supply_infomation')}
                            <div className={`ltr:ml-auto rtl:mr-auto ${active.includes(1) ? 'rotate-180' : ''}`}>
                                <IconCaretDown />
                            </div>
                        </button>
                        <div className={`mb-2 ${active.includes(1) ? 'custom-content-accordion' : ''}`}>
                            <AnimateHeight duration={300} height={active.includes(1) ? 'auto' : 0}>
                                <Formik
                                    initialValues={initialValue}
                                    validationSchema={SubmittedForm}
                                    onSubmit={values => {
                                        handleProposal(values);
                                    }}
                                    enableReinitialize
                                    innerRef={formRef}
                                >

                                    {({ errors, values, submitCount, setFieldValue }) => (
                                        <Form className="space-y-5" >
                                            <div className='p-4'>
                                                <div className='flex justify-between gap-5 mt-5 mb-5'>
                                                    <div className="w-1/2">
                                                        <label htmlFor="personRequest" className='label'> {t('person_request')} < span style={{ color: 'red' }}>* </span></label >
                                                        <Field autoComplete="off"
                                                            name="personRequest"
                                                            type="text"
                                                            id="personRequest"
                                                            placeholder={`${t('enter_code')}`}
                                                            className={true ? "form-input bg-[#f2f2f2]" : "form-input"}
                                                            disabled={true}
                                                        />
                                                        {submitCount && errors.personRequest ? (
                                                            <div className="text-danger mt-1"> {`${errors.personRequest}`} </div>
                                                        ) : null}
                                                    </div>
                                                    <div className="w-1/2">
                                                        <label htmlFor="timeRequest" className='label'> {t('time_request')} < span style={{ color: 'red' }}>* </span></label >
                                                        <Field autoComplete="off"
                                                            name="timeRequest"
                                                            render={({ field }: any) => (
                                                                <Flatpickr
                                                                    data-enable-time
                                                                    placeholder={`${t('HH:mm DD/MM/YYYY')}`}
                                                                    options={{
                                                                        enableTime: true,
                                                                        dateFormat: 'H:i d/m/Y'
                                                                    }}
                                                                    value={moment().format("DD/MM/YYYY hh:mm")}
                                                                    onChange={e => setFieldValue("estimatedDeliveryDate", moment(e[0]).format("YYYY-MM-DD hh:mm"))}
                                                                    className={true ? "form-input bg-[#f2f2f2] calender-input" : "form-input calender-input"}
                                                                    disabled={true}
                                                                />
                                                            )}
                                                        />
                                                        {submitCount && errors.estimatedDeliveryDate ? (
                                                            <div className="text-danger mt-1"> {`${errors.estimatedDeliveryDate}`} </div>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className='flex justify-between gap-5 mt-5'>
                                                    <div className=" w-1/2">
                                                        <label htmlFor="name" className='label'> {t('name_proposal')} < span style={{ color: 'red' }}>* </span></label >
                                                        <Field autoComplete="off"
                                                            name="name"
                                                            type="text"
                                                            id="name"
                                                            placeholder={`${t('enter_name')}`}
                                                            className={disable ? "form-input bg-[#f2f2f2]" : "form-input"}
                                                            disabled={disable}
                                                        />
                                                        {submitCount && errors.name ? (
                                                            <div className="text-danger mt-1"> {`${errors.name}`} </div>
                                                        ) : null}
                                                    </div>
                                                    <div className=" w-1/2">
                                                        <label htmlFor="departmentId" className='label'> {t('department')} < span style={{ color: 'red' }}>* </span></label >
                                                        <Select
                                                            id='departmentId'
                                                            name='departmentId'
                                                            options={dataDepartment}
                                                            maxMenuHeight={160}
                                                            value={values?.departmentId}
                                                            onMenuOpen={() => setPage(1)}
                                                            onMenuScrollToBottom={handleMenuScrollToBottom}
                                                            isLoading={isLoadingDepartment}
                                                            onInputChange={e => setSearchDepartment(e)}
                                                            onChange={e => {
                                                                setFieldValue('departmentId', e)
                                                            }}
                                                            isDisabled={disable}
                                                        />
                                                        {submitCount && errors.departmentId ? (
                                                            <div className="text-danger mt-1"> {`${errors.departmentId}`} </div>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className='flex justify-between gap-5 mt-5'>
                                                    <div className=" w-1/2">
                                                        <label htmlFor="warehouseId" className='label'>
                                                            {t('warehouse')} <span style={{ color: 'red' }}>* </span>
                                                        </label>
                                                        <Select
                                                            id="warehouseId"
                                                            name="warehouseId"
                                                            options={warehouseDropdown?.data}
                                                            isLoading={warehouseLoading}
                                                            maxMenuHeight={160}
                                                            value={values?.warehouseId}
                                                            onChange={(e) => {
                                                                setFieldValue('warehouseId', e);
                                                                setWarehouseId(e.value);
                                                            }}
                                                        />
                                                        {submitCount && errors.warehouseId ? <div className="mt-1 text-danger"> {`${errors.warehouseId}`} </div> : null}
                                                    </div>
                                                    <div className=" w-1/2"> </div>
                                                </div>
                                                <div className='mt-5'>
                                                    <label htmlFor="type" className='label'> {t('content')} < span style={{ color: 'red' }}>* </span></label >
                                                    <Field autoComplete="off"
                                                        name="content"
                                                        as="textarea"
                                                        id="content"
                                                        placeholder={`${t('enter_content')}`}
                                                        className={disable ? "form-input bg-[#f2f2f2]" : "form-input"}
                                                        disabled={disable}
                                                    />
                                                    {submitCount && errors.content ? (
                                                        <div className="text-danger mt-1"> {`${errors.content}`} </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                            {
                                                <RenturnError errors={errors} submitCount={submitCount} />
                                            }
                                        </Form>
                                    )}
                                </Formik >
                            </AnimateHeight>
                        </div>
                    </div>
                    <div className="rounded">
                        <button
                            type="button"
                            className={`flex w-full items-center p-4 text-white-dark dark:bg-[#1b2e4b] custom-accordion uppercase`}
                            onClick={() => handleActive(2)}
                        >
                            {t('product_list')}
                            <div className={`ltr:ml-auto rtl:mr-auto ${active.includes(2) ? 'rotate-180' : ''}`}>
                                <IconCaretDown />
                            </div>
                        </button>
                        <div className={`${active.includes(2) ? 'custom-content-accordion' : ''}`}>
                            <AnimateHeight duration={300} height={active.includes(2) ? 'auto' : 0}>
                                <div className='p-4'>
                                    <div className="flex md:items-center justify-between md:flex-row flex-col mb-4 gap-5">
                                        <div className="flex items-center flex-wrap">
                                            {
                                                !disable &&
                                                <button data-testId="modal-proposal-btn" type="button" onClick={(e) => setOpenModal(true)} className="btn btn-primary btn-sm m-1 custom-button" >
                                                    <IconPlus className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                                    {t('add_product_list')}
                                                </button>
                                            }
                                        </div>

                                        {/* <input autoComplete="off" type="text" className="form-input w-auto" placeholder={`${t('search')}`} onChange={(e) => handleSearch(e.target.value)} /> */}
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
                                <DetailModal
                                    openModal={openModal}
                                    setOpenModal={setOpenModal}
                                    data={dataDetail}
                                    setData={setDataDetail}
                                    listData={listDataDetail}
                                    setListData={setListDataDetail}
                                    proposalDetailMutate={mutate}
                                    warehouseId={warehouseId}
                                />
                            </AnimateHeight>
                        </div>
                    </div>
                    {
                        !disable &&
                        <div className="mt-8 flex items-center justify-end ltr:text-right rtl:text-left">
                            <button type="button" className="btn btn-outline-danger cancel-button" onClick={() => handleCancel()}>
                                {t('cancel')}
                            </button>
                            <button data-testId="submit-btn" type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4 add-button" onClick={() => handleSubmit()}>
                                {router.query.id !== "create" ? t('update') : t('save')}
                            </button>
                        </div>
                    }
                    {
                        router.query.type === "approve" &&
                        <div className="mt-8 flex items-center justify-end ltr:text-right rtl:text-left">
                            <button type="button" className="btn btn-outline-danger cancel-button w-28" onClick={() => handleReject()}>
                                {t('reject')}
                            </button>
                            <button data-testId="submit-approve-btn" type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4 add-button" onClick={() => handleApprove()}>
                                {t('approve')}
                            </button>
                        </div>
                    }
                </div>
            </div >
        </div >
    );
};
export default DetailPage;
