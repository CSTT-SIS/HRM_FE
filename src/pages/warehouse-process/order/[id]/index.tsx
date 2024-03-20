import { useEffect, Fragment, useState, SetStateAction, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { showMessage } from '@/@core/utils';
import { useRouter } from 'next/router';
import { IconLoading } from '@/components/Icon/IconLoading';
import IconPencil from '@/components/Icon/IconPencil';
import IconTrashLines from '@/components/Icon/IconTrashLines';
import { setPageTitle } from '@/store/themeConfigSlice';
import { DataTableSortStatus, DataTable } from 'mantine-datatable';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { AddOrderDetails, CreateOrder, DeleteOrderDetail, EditOrder, GetOrder, OrderHeadApprove, OrderHeadReject, OrderManagerApprove, OrderManagerReject, OrderPlace } from '@/services/apis/order.api';
import { OrderDetails } from '@/services/swr/order.twr';
import Link from 'next/link';
import IconBackward from '@/components/Icon/IconBackward';
import IconCaretDown from '@/components/Icon/IconCaretDown';
import { Formik, Form, Field, useFormikContext } from 'formik';
import AnimateHeight from 'react-animate-height';
import moment from 'moment';
import * as Yup from 'yup';
import { DropdownProposals, DropdownRepair, DropdownWarehouses } from '@/services/swr/dropdown.twr';
import Select, { components } from 'react-select';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { GetProposalDetail } from '@/services/apis/proposal.api';
import DetailModal from '../form/DetailModal';
import IconPlus from '@/components/Icon/IconPlus';
import { GetRepair, GetRepairDetail } from '@/services/apis/repair.api';

interface Props {
    [key: string]: any;
}

const DetailPage = ({ ...props }: Props) => {

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const router = useRouter();

    const [data, setData] = useState<any>();
    const [disable, setDisable] = useState<any>(false);
    const [dataDetail, setDataDetail] = useState<any>();
    const [openModal, setOpenModal] = useState(false);
    const formRef = useRef<any>();
    const [query, setQuery] = useState<any>();
    const [initialValue, setInitialValue] = useState<any>();
    const [dataProposalDropdown, setDataProposalDropdown] = useState<any>([]);
    const [active, setActive] = useState<any>([1, 2]);
    const [pageProposal, setPageProposal] = useState(1);
    const [listDataDetail, setListDataDetail] = useState<any>();
    const [dataRepairDropdown, setDataRepairDropdown] = useState<any>([]);
    const [pageRepair, setPageRepair] = useState<any>(1);
    const [entity, setEntity] = useState<any>("");

    const SubmittedForm = Yup.object().shape({
        name: Yup.string().required(`${t('please_fill_name')}`),
        code: Yup.string().required(`${t('please_fill_code')}`),
        proposalIds: new Yup.ArraySchema().required(`${t('please_fill_proposal')}`),
        // provider: Yup.string().required(`${t('please_fill_provider')}`),
        estimatedDeliveryDate: Yup.string().required(`${t('please_fill_date')}`),
    });

    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'desc' });

    // get data
    const { data: orderDetails, pagination, mutate, isLoading } = OrderDetails({ ...query });
    const { data: proposals, pagination: proposalPagiantion, isLoading: proposalLoading } = DropdownProposals({ page: pageProposal, type: "PURCHASE" });
    const { data: warehouses, pagination: warehousePagination, isLoading: warehouseLoading } = DropdownWarehouses({});
    const { data: dropdownRepair, pagination: repairPagination, isLoading: repairLoading } = DropdownRepair({ page: pageRepair })

    useEffect(() => {
        dispatch(setPageTitle(`${t('Order')}`));
    });

    useEffect(() => {
        if (Number(router.query.id)) {
            setListDataDetail(orderDetails?.data);
        }
    }, [orderDetails?.data, router]);

    useEffect(() => {
        if (Number(router.query.id)) {
            GetOrder({ id: router.query.id }).then((res) => {
                setData(res.data);
            }).catch((err) => {
                showMessage(`${err?.response?.data?.message}`, 'error');
            });
        }
        setDisable(router.query.status === "true" ? true : false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.query]);

    useEffect(() => {
        setInitialValue({
            name: data?.name ? `${data?.name}` : "",
            proposalIds: data ? data?.proposals?.map((item: any) => {
                return (
                    {
                        label: item.name,
                        value: item.id
                    }
                )
            }) : "",
            code: data?.code ? `${data?.code}` : "",
            estimatedDeliveryDate: data?.estimatedDeliveryDate ? moment(`${data?.estimatedDeliveryDate}`).format("YYYY-MM-DD") : "",
            provider: data?.provider ? `${data?.provider}` : "",
            personRequest: JSON.parse(localStorage.getItem('profile') || "").fullName
        })
    }, [data]);

    useEffect(() => {
        if (Number(router.query.id)) {
            setQuery({ id: router.query.id, ...router.query })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.query.id]);

    const handleEdit = (data: any) => {
        setOpenModal(true);
        setDataDetail(data);
    };

    const handleDelete = ({ id, product }: any) => {
        if (Number(router.query.id)) {
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
                        DeleteOrderDetail({ id: router.query.id, itemId: id }).then(() => {
                            mutate();
                            showMessage(`${t('delete_product_success')}`, 'success');
                        }).catch((err) => {
                            showMessage(`${err?.response?.data?.message}`, 'error');
                        });
                    }
                });
        } else {
            setListDataDetail(listDataDetail.filter((item: any) => item.id !== id))
        }
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
            render: (records: any, index: any) => <span>{index + 1}</span>,
        },
        {
            accessor: 'name',
            title: 'Tên Vật tư',
            render: ({ product, replacementPart }: any) => <span>{product?.name || replacementPart?.name}</span>,
            sortable: false
        },
        { accessor: 'quantity', title: 'số lượng', sortable: false },
        { accessor: 'note', title: 'Ghi chú', sortable: false },
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
        router.push("/warehouse-process/order")
    };

    const handleChangeComplete = (id: any) => {
        OrderPlace(id).then(() => {
            router.push("/warehouse-process/order")
            // showMessage(`${t('update_success')}`, 'success');
        }).catch((err) => {
            showMessage(`${err?.response?.data?.message}`, 'error');
        });
    }

    const handleOrder = (param: any) => {
        const query = {
            name: param.name,
            proposalIds: param.proposalIds.map((item: any) => { return (item.value) }),
            type: "PURCHASE",
            code: param.code,
            estimatedDeliveryDate: moment(param.estimatedDeliveryDate).format('YYYY-MM-DD HH:mm:ss'),
            provider: param.provider
        };
        if (data) {
            EditOrder({ id: data.id, ...query }).then(() => {
                showMessage(`${t('edit_success')}`, 'success');
            }).catch((err) => {
                showMessage(`${err?.response?.data?.message}`, 'error');
            });
        } else {
            if (listDataDetail?.length === undefined || listDataDetail?.length === 0) {
                showMessage(`${t('please_add_product')}`, 'error');
                handleActive(2);
            } else {
                CreateOrder(query).then((res) => {
                    handleDetail(res.data.id);
                }).catch((err) => {
                    showMessage(`${err?.response?.data?.message}`, 'error');
                });
            }
        }
        handleCancel();
    }

    const handleDetail = (id: any) => {
        AddOrderDetails({
            id: id, details: listDataDetail
        }).then(() => {
            handleChangeComplete({ id: id, message: "create_success" });
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

    useEffect(() => {
        if (proposalPagiantion?.page === undefined) return;
        if (proposalPagiantion?.page === 1) {
            setDataProposalDropdown(proposals?.data)
        } else {
            setDataProposalDropdown([...dataProposalDropdown, ...proposals?.data])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [proposalPagiantion])

    const handleMenuScrollToBottomProposal = () => {
        setTimeout(() => {
            setPageProposal(proposalPagiantion?.page + 1);
        }, 1000);
    }

    const RenturnError = (param: any) => {
        if (Object.keys(param?.errors || {}).length > 0 && param?.submitCount > 0) {
            showMessage(`${t('please_add_infomation')}`, 'error');
        }
        return <></>;
    }

    const [idProposal, setIdProposal] = useState<any>();
    const [idRepair, setIdRepair] = useState<any>();
    const [statusProposal, setStatusProposal] = useState<any>(false);
    const [statusRepair, setStatusRepair] = useState<any>(false);

    const getValueDetail = (param: any) => {
        if (param.value?.length <= 0) {
            setListDataDetail([]);
        } else {
            switch (param.type) {
                case "repairRequest":
                    setIdRepair(param?.value);
                    break;
                default:
                    setIdProposal(param?.value);
                    break;
            }
        }
    }

    useEffect(() => {
        let a: any = [];
        idRepair?.map((item: any) => {
            const found = listDataDetail?.find((index: any) => index.id === item)
            if (found) {
                listDataDetail.filter((index: any) => {
                    if (index.id === item) a.push(index)
                })
                setListDataDetail(a);
                setStatusRepair(true);
            } else {
                GetRepairDetail({ id: item }).then((res) => {
                    if (listDataDetail?.length > 0) {
                        setListDataDetail([...listDataDetail, ...res.data]);
                    } else {
                        setListDataDetail(res.data);
                    }
                    setStatusRepair(true);
                }).catch((err) => {
                    showMessage(`${err?.response?.data?.message}`, 'error');
                });
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idRepair])

    useEffect(() => {
        let ans: any = listDataDetail?.reduce((agg: any, curr: any) => {
            let found = agg.find((x: any) => x.productId === curr.productId);
            if (found) {
                found.quantity = found.quantity + curr.quantity
                found.note = found.note + "," + curr.note
            }
            else {
                agg.push({
                    ...curr,
                    quantity: curr.quantity
                });
            }
            return agg;
        }, []);
        setListDataDetail(ans);
        setStatusRepair(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusRepair]);

    useEffect(() => {
        let a: any = [];
        idProposal?.map((item: any) => {
            const found = listDataDetail?.find((index: any) => index.id === item)
            if (found) {
                listDataDetail.filter((index: any) => {
                    if (index.id === item) a.push(index)
                })
                setListDataDetail(a);
                setStatusProposal(true);
            } else {
                GetProposalDetail({ id: item }).then((res) => {
                    if (listDataDetail?.length > 0) {
                        setListDataDetail([...listDataDetail, ...res.data]);
                    } else {
                        setListDataDetail(res.data);
                    }
                    setStatusProposal(true);
                }).catch((err) => {
                    showMessage(`${err?.response?.data?.message}`, 'error');
                });
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idProposal])

    useEffect(() => {
        let ans: any = listDataDetail?.reduce((agg: any, curr: any) => {
            let found = agg.find((x: any) => x.productId === curr.productId);
            if (found) {
                found.quantity = found.quantity + curr.quantity
                found.note = found.note + "," + curr.note
            }
            else {
                agg.push({
                    ...curr,
                    quantity: curr.quantity
                });
            }
            return agg;
        }, []);
        setListDataDetail(ans);
        setStatusProposal(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusProposal]);

    const handleSubmit = () => {
        if (formRef.current) {
            formRef.current.handleSubmit()
        }
    }

    const handleApprove = () => {
        OrderHeadApprove({ id: router.query.id }).then(() => {
            handleCancel();
            showMessage(`${t('update_success')}`, 'success');
        }).catch((err) => {
            showMessage(`${err?.response?.data?.message}`, 'error');
        });
    }

    const handleManagerApprove = () => {
        OrderManagerApprove({ id: router.query.id }).then(() => {
            handleCancel();
            showMessage(`${t('update_success')}`, 'success');
        }).catch((err) => {
            showMessage(`${err?.response?.data?.message}`, 'error');
        });
    }

    const handleReject = () => {
        OrderHeadReject({ id: router.query.id }).then(() => {
            handleCancel();
            showMessage(`${t('update_success')}`, 'success');
        }).catch((err) => {
            showMessage(`${err?.response?.data?.message}`, 'error');
        });
    }

    const handleManagerReject = () => {
        OrderManagerReject({ id: router.query.id }).then(() => {
            handleCancel();
            showMessage(`${t('update_success')}`, 'success');
        }).catch((err) => {
            showMessage(`${err?.response?.data?.message}`, 'error');
        });
    }

    useEffect(() => {
        if (repairPagination?.page === undefined) return;
        if (repairPagination?.page === 1) {
            setDataRepairDropdown(dropdownRepair?.data)
        } else {
            setDataRepairDropdown([...dataRepairDropdown, ...dropdownRepair?.data])
        }
    }, [dataRepairDropdown, dropdownRepair, repairPagination]);

    const handleMenuScrollToBottomRepair = () => {
        setTimeout(() => {
            setPageRepair(repairPagination?.page + 1);
        }, 1000);
    }

    return (
        <>
            <div>
                {isLoading && (
                    <div className="screen_loader fixed inset-0 bg-[#fafafa] dark:bg-[#060818] z-[60] grid place-content-center animate__animated">
                        <IconLoading />
                    </div>
                )}
                <div className='flex justify-between header-page-bottom pb-4 mb-4'>
                    <h1 className='page-title'>{t('order')}</h1>
                    <Link href="/warehouse-process/order">
                        <div className="btn btn-primary btn-sm m-1 back-button h-9" >
                            <IconBackward />
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
                                {t('order_infomation')}
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
                                            handleOrder(values);
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
                                                                        // placeholder={`${t('choose_break_end_time')}`}
                                                                        options={{
                                                                            enableTime: true,
                                                                            dateFormat: 'Y-m-d H:i'
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
                                                        <div className="w-1/2">
                                                            <label htmlFor="name" className='label'> {t('name_order')} < span style={{ color: 'red' }}>* </span></label >
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
                                                        <div className="w-1/2">
                                                            <label htmlFor="code" className='label'> {t('code_order')} < span style={{ color: 'red' }}>* </span></label >
                                                            <Field autoComplete="off"
                                                                name="code"
                                                                type="text"
                                                                id="code"
                                                                placeholder={`${t('enter_code')}`}
                                                                className={disable ? "form-input bg-[#f2f2f2]" : "form-input"}
                                                                disabled={disable}
                                                            />
                                                            {submitCount && errors.code ? (
                                                                <div className="text-danger mt-1"> {`${errors.code}`} </div>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                    <div className='flex justify-between gap-5 mt-5 mb-5'>
                                                        <div className="w-1/2">
                                                            <label htmlFor="warehouseId" className='label'>< span style={{ color: 'red' }}>* </span> {t('warehouse')}</label >
                                                            <Select
                                                                id='warehouseId'
                                                                name='warehouseId'
                                                                options={warehouses?.data}
                                                                isLoading={warehouseLoading}
                                                                maxMenuHeight={160}
                                                                value={values?.warehouseId}
                                                                onChange={e => {
                                                                    setFieldValue('warehouseId', e)
                                                                    setFieldValue('repairRequestId', "")
                                                                    setFieldValue('proposalIds', "")
                                                                    setListDataDetail([])
                                                                    setEntity(e.label === "Gara" ? "repairRequest" : '');
                                                                }}
                                                                isDisabled={disable}
                                                            />
                                                            {submitCount && errors.warehouseId ? (
                                                                <div className="text-danger mt-1"> {`${errors.warehouseId}`} </div>
                                                            ) : null}
                                                        </div>
                                                        {
                                                            entity === "repairRequest" ?
                                                                <div className="w-1/2">
                                                                    <label htmlFor="repairRequestId" className='label'> {t('repair_request')} < span style={{ color: 'red' }}>* </span></label >
                                                                    <Select
                                                                        id='repairRequestId'
                                                                        name='repairRequestId'
                                                                        options={dataRepairDropdown}
                                                                        onMenuOpen={() => setPageRepair(1)}
                                                                        onMenuScrollToBottom={handleMenuScrollToBottomRepair}
                                                                        isLoading={repairLoading}
                                                                        maxMenuHeight={160}
                                                                        value={values?.repairRequestId}
                                                                        isMulti
                                                                        onChange={e => {
                                                                            setFieldValue('repairRequestId', e);
                                                                            getValueDetail({ value: e.map((item: any) => { return item.value }), type: "repairRequest" });

                                                                        }}
                                                                        isDisabled={disable}
                                                                    />
                                                                    {submitCount && errors.repairRequestId ? (
                                                                        <div className="text-danger mt-1"> {`${errors.repairRequestId}`} </div>
                                                                    ) : null}
                                                                </div> :
                                                                <div className="w-1/2">
                                                                    <label htmlFor="proposalIds" className='label'> {t('proposal')} < span style={{ color: 'red' }}>* </span></label >
                                                                    <Select
                                                                        isDisabled={disable}
                                                                        id='proposalIds'
                                                                        name='proposalIds'
                                                                        options={dataProposalDropdown}
                                                                        onMenuOpen={() => { setPageProposal(1) }}
                                                                        onMenuScrollToBottom={handleMenuScrollToBottomProposal}
                                                                        isLoading={proposalLoading}
                                                                        maxMenuHeight={160}
                                                                        value={values?.proposalIds}
                                                                        isMulti
                                                                        onChange={e => {
                                                                            setFieldValue('proposalIds', e)
                                                                            getValueDetail({ value: e.map((item: any) => { return item.value }), type: "proposal" });
                                                                        }}
                                                                    />
                                                                    {submitCount && errors.proposalIds ? (
                                                                        <div className="text-danger mt-1"> {`${errors.proposalIds}`} </div>
                                                                    ) : null}
                                                                </div>
                                                        }
                                                        {/* <div className="w-1/2">
                                                            <label htmlFor="proposalIds" className='label'> {t('proposal')} < span style={{ color: 'red' }}>* </span></label >
                                                            <Select
                                                                isDisabled={disable}
                                                                id='proposalIds'
                                                                name='proposalIds'
                                                                options={dataProposalDropdown}
                                                                onMenuOpen={() => setPageProposal(1)}
                                                                onMenuScrollToBottom={handleMenuScrollToBottomProposal}
                                                                isLoading={proposalLoading}
                                                                maxMenuHeight={160}
                                                                value={values?.proposalIds}
                                                                isMulti
                                                                onChange={e => {
                                                                    setFieldValue('proposalIds', e)
                                                                    getValueDetail(e.map((item: any) => { return item.value }));
                                                                }}
                                                            />
                                                            {submitCount && errors.proposalIds ? (
                                                                <div className="text-danger mt-1"> {`${errors.proposalIds}`} </div>
                                                            ) : null}
                                                        </div> */}
                                                    </div>
                                                    <div className='flex justify-between gap-5 mt-5'>
                                                        <div className="w-1/2">
                                                            <label htmlFor="estimatedDeliveryDate" className='label'> {t('estimated_delivery_date')} < span style={{ color: 'red' }}>* </span></label >
                                                            <Field autoComplete="off"
                                                                name="estimatedDeliveryDate"
                                                                render={({ field }: any) => (
                                                                    <Flatpickr
                                                                        data-enable-time
                                                                        placeholder={`${t('YYYY-MM-DD | hh:mm')}`}
                                                                        options={{
                                                                            enableTime: true,
                                                                            dateFormat: 'Y-m-d H:i'
                                                                        }}
                                                                        value={field?.value}
                                                                        onChange={e => setFieldValue("estimatedDeliveryDate", moment(e[0]).format("YYYY-MM-DD hh:mm"))}
                                                                        className={disable ? "form-input bg-[#f2f2f2] calender-input" : "form-input calender-input"}
                                                                        disabled={disable}
                                                                    />
                                                                )}
                                                            />
                                                            {submitCount && errors.estimatedDeliveryDate ? (
                                                                <div className="text-danger mt-1"> {`${errors.estimatedDeliveryDate}`} </div>
                                                            ) : null}
                                                        </div>
                                                        <div className="w-1/2">
                                                            <label htmlFor="provider" className='label'> {t('note')}</label >
                                                            <Field autoComplete="off"
                                                                id="provider"
                                                                as="textarea"
                                                                rows="2"
                                                                name="provider"
                                                                className={disable ? "form-input bg-[#f2f2f2]" : "form-input"}
                                                                disabled={disable}
                                                            />
                                                            {submitCount && errors.provider ? (
                                                                <div className="text-danger mt-1"> {`${errors.provider}`} </div>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                </div>
                                                {
                                                    <RenturnError errors={errors} submitCount={submitCount} />
                                                }
                                            </Form>
                                        )
                                        }
                                    </Formik>
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
                                        <div className="flex md:items-center justify-between md:flex-row flex-col mb-4.5 gap-5">
                                            <div className="flex items-center flex-wrap">
                                                {
                                                    !disable &&
                                                    <button type="button" onClick={e => setOpenModal(true)} className="btn btn-primary btn-sm m-1 custom-button" >
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
                                        orderDetailMutate={mutate}
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
                                <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4 add-button" onClick={() => handleSubmit()}>
                                    {router.query.id !== "create" ? t('update') : t('save')}
                                </button>
                            </div>
                        }
                        {
                            (router.query.type !== "HEAD_APPROVED" && router.query.type !== "HEAD_REJECTED" && disable) &&
                            <div className="mt-8 flex items-center justify-end ltr:text-right rtl:text-left">
                                <button type="button" className="btn btn-outline-danger cancel-button w-28" onClick={() => handleReject()}>
                                    {t('reject')}
                                </button>
                                <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4 add-button" onClick={() => handleApprove()}>
                                    {t('approve')}
                                </button>
                            </div>
                        }
                        {
                            (router.query.type === "HEAD_APPROVED" || router.query.type === "HEAD_REJECTED" && disable) &&
                            <div className="mt-8 flex items-center justify-end ltr:text-right rtl:text-left">
                                <button type="button" className="btn btn-outline-danger cancel-button w-28" onClick={() => handleManagerReject()}>
                                    {t('reject')}
                                </button>
                                <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4 add-button" onClick={() => handleManagerApprove()}>
                                    {t('approve')}
                                </button>
                            </div>
                        }
                    </div>
                </div >
            </div >
        </>
    );
};
export default DetailPage;
