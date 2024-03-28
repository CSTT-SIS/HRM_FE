import { useEffect, Fragment, useState, SetStateAction, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { showMessage } from '@/@core/utils';
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
import { RepairDetails, RepairHistory } from '@/services/swr/repair.twr';
import { AddRepairDetail, AddRepairDetails, CreateRepair, DeleteRepairDetail, EditRepair, GetRepair, RepairApprove, RepairInprogress, RepairReject } from '@/services/apis/repair.api';
import { Field, Form, Formik } from 'formik';
import AnimateHeight from 'react-animate-height';
import IconCaretDown from '@/components/Icon/IconCaretDown';
import Link from 'next/link';
import { DropdownUsers } from '@/services/swr/dropdown.twr';
import IconBackward from '@/components/Icon/IconBackward';
import * as Yup from 'yup';
import Select, { components } from 'react-select';
import IconBack from '@/components/Icon/IconBack';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import moment from 'moment';
import DetailModal from '../modal/DetailModal';
import IconNewEye from '@/components/Icon/IconNewEye';
import { PAGE_SIZES } from '@/utils/constants';
import HistoryModal from '../modal/HistoryModal';
import { Upload } from '@/services/apis/upload.api';

interface Props {
    [key: string]: any;
}

const DetailPage = ({ ...props }: Props) => {

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const router = useRouter();

    const [disable, setDisable] = useState<any>(false);
    const [data, setData] = useState<any>();
    const [idH, setIdH] = useState<any>();
    const [dataDetail, setDataDetail] = useState<any>();
    const [openModal, setOpenModal] = useState(false);
    const [openModalH, setOpenModalH] = useState(false);
    const [query, setQuery] = useState<any>();
    const [queryH, setQueryH] = useState<any>();
    const [initialValue, setInitialValue] = useState<any>();
    const [dataUserDropdown, setDataUserDropdown] = useState<any>([]);
    const [page, setPage] = useState(1);
    const [active, setActive] = useState<any>([1, 2]);
    const [listDataDetail, setListDataDetail] = useState<any>();
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'desc' });
    const formRef = useRef<any>();
    const fileRef = useRef<any>();
    // get data
    const { data: repairDetails, pagination, mutate, isLoading } = RepairDetails({ ...query });
    const { data: users, pagination: paginationUser, isLoading: userLoading } = DropdownUsers({ page: page });
    const { data: history, pagination: paginationHistory, isLoading: historyLoading } = RepairHistory({ id: data?.vehicleId || 0, ...queryH });


    const SubmittedForm = Yup.object().shape({
        vehicleRegistrationNumber: Yup.string().required(`${t('please_fill_name')}`),
        repairById: new Yup.ObjectSchema().required(`${t('please_fill_proposal')}`),
    });

    useEffect(() => {
        dispatch(setPageTitle(`${t('Repair')}`));
    });

    useEffect(() => {
        if (Number(router.query.id)) {
            setListDataDetail(repairDetails?.data);
        }
    }, [repairDetails?.data, router])

    useEffect(() => {
        if (Number(router.query.id)) {
            setQuery({ id: router.query.id, ...router.query })
        }
        setDisable(router.query.status === "true" ? true : false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.query]);

    const handleEdit = (data: any) => {
        setOpenModal(true);
        setDataDetail(data);
    };

    const handleDelete = ({ id, replacementPart }: any) => {
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
                text: `${t('delete')} ${replacementPart?.name}`,
                padding: '2em',
                showCancelButton: true,
                cancelButtonText: `${t('cancel')}`,
                confirmButtonText: `${t('confirm')}`,
                reverseButtons: true,
            })
            .then((result) => {
                if (result.value) {
                    if (Number(router.query.id)) {
                        DeleteRepairDetail({ id: router.query.id, detailId: id }).then(() => {
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

    const handleChangePage = (page: number, pageSize: number) => {
        setQueryH({ page: page, perPage: pageSize })
        return pageSize;
    };

    const columns = [
        {
            accessor: 'id',
            title: '#',
            render: (records: any, index: any) => <span>{index + 1}</span>,
        },
        {
            accessor: 'replacementPart',
            title: 'Tên Vật tư',
            render: ({ replacementPart }: any) => <span>{replacementPart?.name}</span>,
            sortable: false
        },
        { accessor: 'quantity', title: 'số lượng', sortable: false },
        { accessor: 'brokenPart', title: 'Phần bị hỏng', sortable: false },
        { accessor: 'description', title: 'Ghi chú', sortable: false },
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

    const columnsHistory = [
        {
            accessor: 'id',
            title: '#',
            render: (records: any, index: any) => <span>{(pagination?.page - 1) * pagination?.perPage + index + 1}</span>,
        },
        { accessor: 'name', title: 'Tên phiếu sửa chữa', sortable: false },
        {
            accessor: 'vehicle',
            title: 'Số đăng ký xe',
            render: ({ vehicle }: any) => <span>{vehicle?.registrationNumber}</span>,
        },
        {
            accessor: 'repairBy',
            title: 'Người phụ trách',
            render: ({ repairBy }: any) => <span>{repairBy?.fullName}</span>,
        },
        // { accessor: 'description', title: 'Ghi chú', sortable: false },
        {
            accessor: 'status',
            title: 'Trạng thái',
            render: ({ status }: any) => <span>{status === "COMPLETED" ? "Đã duyệt" : "Chưa duyệt"}</span>,
            sortable: false
        },
        {
            accessor: 'action',
            title: 'Thao tác',
            width: '10%',
            titleClassName: '!text-center',
            render: (records: any) => (
                <div className="flex justify-start gap-2">
                    <div className="w-[80px]">
                        <button type='button' className='button-detail' onClick={e => { setOpenModalH(true); setIdH(records.id) }}>
                            <IconNewEye /> <span>{t('detail')}</span>
                        </button>
                    </div>
                </div >
            ),
        },
    ]

    const handleCancel = () => {
        router.push("/warehouse-process/repair");
    };

    useEffect(() => {
        setInitialValue({
            vehicleRegistrationNumber: data ? `${data?.vehicle?.registrationNumber}` : "",
            repairById: data ? {
                value: `${data?.repairBy?.id}`,
                label: `${data?.repairBy?.fullName}`
            } : "",
            description: data ? `${data?.description}` : "",
            damageLevel: data ? `${data?.damageLevel}` : "",
            personRequest: data?.createdBy ? data?.createdBy.fullName : JSON.parse(localStorage.getItem('profile') || "").fullName,
            timeRequest: data?.createdAt ? data?.createdAt : moment().format("YYYY-MM-DD hh:mm"),
            customerName: data ? `${data?.customerName}` : ""
        })
        setPath(data?.images);
    }, [data]);

    useEffect(() => {
        if (paginationUser?.page === undefined) return;
        if (paginationUser?.page === 1) {
            setDataUserDropdown(users?.data)
        } else {
            setDataUserDropdown([...dataUserDropdown, ...users?.data])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paginationUser])

    const handleMenuScrollToBottom = () => {
        setTimeout(() => {
            setPage(paginationUser?.page + 1);
        }, 1000);
    }

    const handleRepair = (param: any) => {
        const query: any = {
            vehicleRegistrationNumber: param.vehicleRegistrationNumber,
            repairById: Number(param.repairById.value),
            description: param.description,
            damageLevel: param.damageLevel,
            customerName: param.customerName,
        };
        if (dataPath) {
            query.imageIds = path.map((item: any) => { return (item.id) })
        }
        if (data) {
            EditRepair({ id: router.query?.id, ...query }).then((res) => {
                showMessage(`${t('edit_success')}`, 'success');
                handleCancel();
            }).catch((err) => {
                showMessage(`${err?.response?.data?.message}`, 'error');
            });
        } else {
            CreateRepair(query).then((res) => {
                handleDetail(res.data.id)
            }).catch((err) => {
                showMessage(`${err?.response?.data?.message[0].error}`, 'error');
            });
        }
    }

    const handleDetail = (id: any) => {
        if (listDataDetail?.length > 0) {
            AddRepairDetails({ id: id, details: listDataDetail }).then(() => {
                handleCancel();
            }).catch((err) => {
                showMessage(`${err?.response?.data?.message}`, 'error');
            });
        } else {
            handleCancel();
        }
    }

    const handleActive = (value: any) => {
        if (active.includes(value)) {
            setActive(active.filter((item: any) => item !== value));
        } else {
            setActive([value, ...active]);
        }
    }

    const RenturnError = (param: any) => {
        if (Object.keys(param?.errors || {}).length > 0 && param?.submitCount > 0) {
            showMessage(`${t('please_add_infomation')}`, 'error');
        }
        return <></>;
    }

    useEffect(() => {
        if (Number(router.query.id)) {
            GetRepair({ id: router.query.id }).then((res) => {
                setData(res.data);
            }).catch((err) => {
                showMessage(`${err?.response?.data?.message}`, 'error');
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.query.id]);
    const handleApprove = () => {
        RepairApprove({ id: router.query.id }).then(() => {
            showMessage(`${t('update_success')}`, 'success');
            handleCancel();
        }).catch((err) => {
            showMessage(`${err?.response?.data?.message}`, 'error');
        });
    }

    const handleReject = () => {
        RepairReject({ id: router.query.id }).then(() => {
            showMessage(`${t('update_success')}`, 'success');
            handleCancel();
        }).catch((err) => {
            showMessage(`${err?.response?.data?.message}`, 'error');
        });
    }

    const handleSubmit = () => {
        if (formRef.current) {
            formRef.current.handleSubmit()
        }
    }

    const [path, setPath] = useState<any>([]);
    const [dataPath, setDataPath] = useState<any>();

    useEffect(() => {
        setPath([...path.filter((item: any) => item !== undefined), dataPath]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataPath]);

    const handleChange = async (event: any) => {
        await Object.keys(event.target.files).map((item: any) => {
            const formData = new FormData();
            formData.append('file', event.target.files[item]);
            formData.append('fileName', event.target.files[item].name);
            Upload(formData)
                .then((res) => {
                    setDataPath({ id: res.data.id, path: res.data.path });
                    return
                }).catch((err) => {
                    showMessage(`${err?.response?.data?.message}`, 'error');
                });
        })
    }

    return (
        <div>
            {isLoading && (
                <div className="screen_loader fixed inset-0 bg-[#fafafa] dark:bg-[#060818] z-[60] grid place-content-center animate__animated">
                    <IconLoading />
                </div>
            )}
            <div className='flex justify-between header-page-bottom pb-4 mb-4'>
                <h1 className='page-title'>{t('repair')}</h1>
                <Link href="/warehouse-process/repair">
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
                            {t('repair_infomation')}
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
                                        handleRepair(values);
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
                                                        <Field
                                                            autoComplete="off"
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
                                                        <Field
                                                            autoComplete="off"
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
                                                    <div className="w-1/2">
                                                        <label htmlFor="repairById" className='label' > {t('repair_by_id')} < span style={{ color: 'red' }}>* </span></label >
                                                        <Select
                                                            id='repairById'
                                                            name='repairById'
                                                            options={dataUserDropdown}
                                                            maxMenuHeight={160}
                                                            value={values?.repairById}
                                                            onMenuOpen={() => setPage(1)}
                                                            onMenuScrollToBottom={handleMenuScrollToBottom}
                                                            isLoading={userLoading}
                                                            onChange={e => {
                                                                setFieldValue('repairById', e)
                                                            }}
                                                            isDisabled={disable}
                                                        />
                                                        {submitCount && errors.repairById ? (
                                                            <div className="text-danger mt-1"> {`${errors.repairById}`} </div>
                                                        ) : null}
                                                    </div>
                                                    <div className="w-1/2">
                                                        <label htmlFor="type" className='label'> {t('vehicle_registration_number')} < span style={{ color: 'red' }}>* </span></label >
                                                        <Field
                                                            autoComplete="off"
                                                            name="vehicleRegistrationNumber"
                                                            type="text"
                                                            id="vehicleRegistrationNumber"
                                                            placeholder={`${t('enter_type')}`}
                                                            className={disable ? "form-input bg-[#f2f2f2]" : "form-input"}
                                                            disabled={disable}
                                                        />
                                                        {submitCount && errors.vehicleRegistrationNumber ? (
                                                            <div className="text-danger mt-1"> {`${errors.vehicleRegistrationNumber}`} </div>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className='flex justify-between gap-5 mt-5'>
                                                    <div className="w-1/2">
                                                        <label htmlFor="customerName" className='label'> {t('name_customer')} < span style={{ color: 'red' }}>* </span></label >
                                                        <Field
                                                            autoComplete="off"
                                                            name="customerName"
                                                            type="text"
                                                            id="customerName"
                                                            placeholder={`${t('enter_name_customer')}`}
                                                            className={disable ? "form-input bg-[#f2f2f2]" : "form-input"}
                                                            disabled={disable}
                                                        />
                                                        {submitCount && errors.customerName ? (
                                                            <div className="text-danger mt-1"> {`${errors.customerName}`} </div>
                                                        ) : null}
                                                    </div>
                                                    <div className='w-1/2'></div>
                                                </div>
                                                <div className='mt-5'>
                                                    <label htmlFor="description" className='label'> {t('description')}</label >
                                                    <Field
                                                        autoComplete="off"
                                                        name="description"
                                                        as="textarea"
                                                        id="description"
                                                        placeholder={`${t('enter_description')}`}
                                                        className={disable ? "form-input bg-[#f2f2f2]" : "form-input"}
                                                        disabled={disable}
                                                    />
                                                    {submitCount && errors.description ? (
                                                        <div className="text-danger mt-1"> {`${errors.description}`} </div>
                                                    ) : null}
                                                </div>
                                                <div className='mt-5'>
                                                    <label htmlFor="damageLevel" className='label'> {t('damage_level')} </label >
                                                    <Field
                                                        autoComplete="off"
                                                        name="damageLevel"
                                                        as="textarea"
                                                        id="damageLevel"
                                                        className={disable ? "form-input bg-[#f2f2f2]" : "form-input"}
                                                        disabled={disable}
                                                        placeholder={`${t('enter_damage_level')}`}
                                                    />
                                                    {submitCount && errors.damageLevel ? (
                                                        <div className="text-danger mt-1"> {`${errors.damageLevel}`} </div>
                                                    ) : null}
                                                </div>
                                                <div className='mt-5'>
                                                    <label htmlFor="imageIds" className='label'> {t('attached_image')} </label >
                                                    <Field
                                                        innerRef={fileRef}
                                                        autoComplete="off"
                                                        name="imageIds"
                                                        type="file"
                                                        id="imageIds"
                                                        className={disable ? "form-input bg-[#f2f2f2]" : "form-input"}
                                                        disabled={disable}
                                                        multiple
                                                        onChange={(e: any) => handleChange(e)}
                                                    />
                                                    {submitCount && errors.imageIds ? (
                                                        <div className="text-danger mt-1"> {`${errors.imageIds}`} </div>
                                                    ) : null}
                                                </div>
                                                <div className="grid grid-cols-3 mt-2 gap-4 p-10 border rounded">
                                                    {
                                                        path.map((item: any) => {
                                                            return (
                                                                <>
                                                                    {
                                                                        item?.path &&
                                                                        // eslint-disable-next-line @next/next/no-img-element
                                                                        <img key={item} src={`${process.env.NEXT_PUBLIC_BE_URL}${item?.path}`} alt="img" />
                                                                    }
                                                                </>
                                                            );
                                                        })
                                                    }
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
                    <div className="rounded mb-2">
                        <button
                            type="button"
                            className={`flex w-full items-center p-4 text-white-dark dark:bg-[#1b2e4b] custom-accordion uppercase`}
                            onClick={() => handleActive(2)}
                        >
                            {t('repair_detail')}
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
                                                <button data-testId='modal-repair-btn' type="button" onClick={(e) => setOpenModal(true)} className="btn btn-primary btn-sm m-1 custom-button" >
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
                                            // recordsPerPageOptions={PAGE_SIZES}
                                            // onRecordsPerPageChange={e => handleChangePage(pagination?.page, e)}
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
                                    orderDetailMutate={mutate}
                                    listData={listDataDetail}
                                    setListData={setListDataDetail}
                                />
                            </AnimateHeight>
                        </div>
                    </div>
                    <div className="rounded">
                        <button
                            type="button"
                            className={`flex w-full items-center p-4 text-white-dark dark:bg-[#1b2e4b] custom-accordion uppercase`}
                            onClick={() => handleActive(3)}
                        >
                            {t('repair_history')}
                            <div className={`ltr:ml-auto rtl:mr-auto ${active.includes(3) ? 'rotate-180' : ''}`}>
                                <IconCaretDown />
                            </div>
                        </button>
                        <div className={`${active.includes(3) ? 'custom-content-accordion' : ''}`}>
                            <AnimateHeight duration={300} height={active.includes(3) ? 'auto' : 0}>
                                <div className='p-4'>
                                    <div className="flex md:items-center justify-between md:flex-row flex-col mb-4.5 gap-5">
                                        {/* <input type="text" className="form-input w-auto" placeholder={`${t('search')}`} onChange={(e) => handleSearch(e.target.value)} /> */}
                                    </div>
                                    <div className="datatables">
                                        <DataTable
                                            highlightOnHover
                                            className="whitespace-nowrap table-hover custom_table"
                                            records={history?.data}
                                            columns={columnsHistory}
                                            totalRecords={paginationHistory?.totalRecords}
                                            recordsPerPage={paginationHistory?.perPage}
                                            page={paginationHistory?.page}
                                            onPageChange={(p) => handleChangePage(p, paginationHistory?.perPage)}
                                            recordsPerPageOptions={PAGE_SIZES}
                                            onRecordsPerPageChange={e => handleChangePage(paginationHistory?.page, e)}
                                            sortStatus={sortStatus}
                                            onSortStatusChange={setSortStatus}
                                            minHeight={200}
                                            paginationText={({ from, to, totalRecords }) => `${t('Showing_from_to_of_totalRecords_entries', { from: from, to: to, totalRecords: totalRecords })}`}
                                        />
                                    </div>
                                </div>
                                <HistoryModal
                                    openModal={openModalH}
                                    setOpenModal={setOpenModalH}
                                    data={dataDetail}
                                    setData={setDataDetail}
                                    orderDetailMutate={mutate}
                                    id={idH}
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
                            <button data-testId='submit-btn' type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4 add-button" onClick={() => handleSubmit()}>
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
                            <button data-testId='submit-approve-btn' type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4 add-button" onClick={() => handleApprove()}>
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
