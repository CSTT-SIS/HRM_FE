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
import { RepairDetails } from '@/services/swr/repair.twr';
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
import HandleDetailForm from '../form/DetailModal';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import moment from 'moment';
import DetailModal from '../form/DetailModal';

interface Props {
    [key: string]: any;
}

const DetailPage = ({ ...props }: Props) => {

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const router = useRouter();

    const [disable, setDisable] = useState<any>(false);
    const [data, setData] = useState<any>();
    const [dataDetail, setDataDetail] = useState<any>();
    const [openModal, setOpenModal] = useState(false);
    const [query, setQuery] = useState<any>();
    const [initialValue, setInitialValue] = useState<any>();
    const [dataUserDropdown, setDataUserDropdown] = useState<any>([]);
    const [page, setPage] = useState(1);
    const [active, setActive] = useState<any>([1, 2]);
    const [listDataDetail, setListDataDetail] = useState<any>();
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'desc' });
    const formRef = useRef<any>();

    // get data
    const { data: repairDetails, pagination, mutate, isLoading } = RepairDetails({ ...query });
    const { data: users, pagination: paginationUser, isLoading: userLoading } = DropdownUsers({ page: page });


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

    const handleCancel = () => {
        router.push("/warehouse-process/repair");
    };

    const handleChangeComplete = (id: any) => {
        RepairInprogress(id).then(() => {
            router.push("/warehouse-process/repair");
            showMessage(`${t('update_success')}`, 'success');
        }).catch((err) => {
            showMessage(`${err?.response?.data?.message}`, 'error');
        });
    }
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
        const query = {
            vehicleRegistrationNumber: param.vehicleRegistrationNumber,
            repairById: Number(param.repairById.value),
            description: param.description,
            damageLevel: param.damageLevel,
            customerName: param.customerName
        };
        if (data) {
            EditRepair({ id: router.query?.id, ...query }).then((res) => {
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
                CreateRepair(query).then((res) => {
                    handleDetail(res.data.id)
                }).catch((err) => {
                    showMessage(`${err?.response?.data?.message[0].error}`, 'error');
                });
            }
        }
        handleCancel();
    }

    const handleDetail = (id: any) => {
        AddRepairDetails({ id: id, details: listDataDetail }).then(() => {
            // handleChangeComplete({ id: id });
            handleCancel();
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
                                                    <label htmlFor="attachedImage" className='label'> {t('attached_image')} </label >
                                                    <Field
                                                        name="attachedImage"
                                                        type="file"
                                                        id="attachedImage"
                                                        className={disable ? "form-input bg-[#f2f2f2]" : "form-input"}
                                                        disabled={disable}
                                                    />
                                                    {submitCount && errors.attachedImage ? (
                                                        <div className="text-danger mt-1"> {`${errors.attachedImage}`} </div>
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
                                                <button type="button" onClick={(e) => setOpenModal(true)} className="btn btn-primary btn-sm m-1 custom-button" >
                                                    <IconPlus className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                                    {t('add_product_list')}
                                                </button>
                                            }
                                        </div>

                                        {/* <input type="text" className="form-input w-auto" placeholder={`${t('search')}`} onChange={(e) => handleSearch(e.target.value)} /> */}
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
                    {
                        !disable &&
                        <div className="mt-8 flex items-center justify-end ltr:text-right rtl:text-left">
                            <button type="button" className="btn btn-outline-danger cancel-button" onClick={() => handleCancel()}>
                                {t('cancel')}
                            </button>
                            <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4 add-button" onClick={() => handleSubmit()}>
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
                            <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4 add-button" onClick={() => handleApprove()}>
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
