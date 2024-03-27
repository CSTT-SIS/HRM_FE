import { useEffect, Fragment, useState, SetStateAction, useRef } from 'react';
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
import HandleDetailModal from '../modal/DetailModal';
import { StocktakeDetail } from '@/services/swr/stocktake.twr';
import { AddStocktakeDetail, AddStocktakeDetailAuto, AddStocktakeDetails, CreateStocktake, DeleteStocktakeDetail, EditStocktake, GetStocktake, StocktakeApprove, StocktakeCancel, StocktakeFinish, StocktakeStart } from '@/services/apis/stocktake.api';
import TallyModal from '../modal/TallyModal';
import IconArchive from '@/components/Icon/IconArchive';
import { IconInventory } from '@/components/Icon/IconInventory';
import { Field, Form, Formik } from 'formik';
import AnimateHeight from 'react-animate-height';
import IconCaretDown from '@/components/Icon/IconCaretDown';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Link from 'next/link';
import IconBackward from '@/components/Icon/IconBackward';
import * as Yup from 'yup';
import Select, { components } from 'react-select';
import { DropdownUsers, DropdownWarehouses } from '@/services/swr/dropdown.twr';
import moment from 'moment';
import { GetProduct } from '@/services/apis/product.api';
import IconListCheck from '@/components/Icon/IconListCheck';
import { Upload } from '@/services/apis/upload.api';

interface Props {
    [key: string]: any;
}

const DetailPage = ({ ...props }: Props) => {

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const router = useRouter();

    const [data, setData] = useState<any>();
    const [disable, setDisable] = useState<any>(false);
    const [dataTally, setDataTally] = useState<any>();
    const [openModal, setOpenModal] = useState(false);
    const [openModalTally, setOpenModalTally] = useState(false);
    const [initialValue, setInitialValue] = useState<any>();
    const [active, setActive] = useState<any>([1, 2]);
    const [query, setQuery] = useState<any>();
    const [dataWarehouseDropdown, setDataWarehouseDropdown] = useState<any>([]);
    const [dataUserDropdown, setDataUserDropdown] = useState<any>([]);
    const [pageUser, setPageUser] = useState(1);
    const [pageWarehouse, setPageWarehouse] = useState(1);
    const [listDataDetail, setListDataDetail] = useState<any>();
    const [dataDetail, setDataDetail] = useState<any>();
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'desc' });
    const [warehouseId, setWarehouseId] = useState<any>();
    const fileRef = useRef<any>();

    const SubmittedForm = Yup.object().shape({
        name: Yup.string().required(`${t('please_fill_name')}`),
        participants: new Yup.ArraySchema().required(`${t('please_fill_proposal')}`),
        warehouseId: new Yup.ObjectSchema().required(`${t('please_fill_warehouse')}`),
        startDate: Yup.string().required(`${t('please_fill_date')}`),
        endDate: Yup.string().required(`${t('please_fill_date')}`)

    });

    // get data
    const { data: stocktakeDetails, pagination, mutate, isLoading } = StocktakeDetail({ ...query });
    const { data: users, pagination: paginationUser, isLoading: userLoading } = DropdownUsers({ page: pageUser });
    const { data: warehouses, pagination: warehousePagination, isLoading: warehouseLoading } = DropdownWarehouses({ page: pageWarehouse });

    useEffect(() => {
        dispatch(setPageTitle(`${t('Stocktake')}`));
    });

    useEffect(() => {
        if (Number(router.query.id)) {
            setListDataDetail(stocktakeDetails?.data);
        }
    }, [stocktakeDetails?.data, router]);

    useEffect(() => {
        if (Number(router.query.id)) {
            setQuery({ id: router.query.id, ...router.query });
            GetStocktake({ id: router.query.id }).then((res) => {
                setData(res.data);
            }).catch((err) => {
                showMessage(`${err?.response?.data?.message}`, 'error');
            });
        }
        setDisable(router.query.status === "true" ? true : false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.query]);

    const handleEdit = (data: any) => {
        setOpenModal(true);
        setDataDetail(data);
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
                    DeleteStocktakeDetail({ id: router.query.id, itemId: id }).then(() => {
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

    const handleOpenTally = (value: any) => {
        setOpenModalTally(true);
        setDataTally(value);
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
            render: ({ product, name }: any) => <span>{product?.name || name}</span>,
            sortable: false
        },
        {
            accessor: 'name',
            title: 'Đvt',
            render: ({ product, unit }: any) => <span>{product?.unit.name || unit.name}</span>,
            sortable: false
        },
        { accessor: 'countedQuantity', title: 'Số lượng đã đếm', sortable: false },
        { accessor: 'openingQuantity', title: 'Tồn đầu kì', sortable: false },
        { accessor: 'quantityDifference', title: 'Số lượng Chênh lệch', sortable: false },
        // { accessor: 'note', title: 'Ghi chú', sortable: false },
        {
            accessor: 'action',
            title: 'Thao tác',
            titleClassName: '!text-center',
            render: (records: any) => (
                <>
                    {
                        !disable &&
                        <div className="flex items-center w-max mx-auto gap-2">
                            {
                                router.query.type === "DRAFT" &&
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
                    }
                    {
                        router.query.type === "IN_PROGRESS" &&
                        <button className='bg-[#C5E7AF] flex justify-between gap-1 p-1 rounded' type="button" onClick={() => handleOpenTally(records)}>
                            <IconListCheck />  <span>{`${t('tally')}`}</span>
                        </button>
                    }
                </>
            ),
        },
    ]

    const handleCancel = () => {
        router.push('/warehouse-process/stocktake');
    };

    const handleChangeComplete = (id: any) => {
        StocktakeStart({ id: id }).then(() => {
            showMessage(`${t('update_success')}`, 'success');
            handleCancel();
        }).catch((err) => {
            showMessage(`${err?.response?.data?.message}`, 'error');
        });
    }

    const handleAutoAdd = () => {
        AddStocktakeDetailAuto({ id: router.query.id }).then(() => {
            showMessage(`${t('update_success')}`, 'success');
        }).catch((err) => {
            showMessage(`${err?.response?.data?.message}`, 'error');
        });
    }

    const handleFinish = () => {
        StocktakeFinish({ id: router.query.id }).then(() => {
            router.push('/warehouse-process/stocktake');
            showMessage(`${t('update_success')}`, 'success');
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
        if (paginationUser?.page === undefined) return;
        if (paginationUser?.page === 1) {
            setDataUserDropdown(users?.data)
        } else {
            setDataUserDropdown([...dataUserDropdown, ...users?.data])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paginationUser])

    useEffect(() => {
        if (warehousePagination?.page === undefined) return;
        if (warehousePagination?.page === 1) {
            setDataWarehouseDropdown(warehouses?.data)
        } else {
            setDataWarehouseDropdown([...dataWarehouseDropdown, ...warehouses?.data])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [warehousePagination])

    const handleMenuScrollToBottomUser = () => {
        setTimeout(() => {
            setPageUser(paginationUser?.page + 1);
        }, 1000);
    }

    const handleMenuScrollToBottomWarehouse = () => {
        setTimeout(() => {
            setPageWarehouse(warehousePagination?.page + 1);
        }, 1000);
    }

    const handleStocktake = (param: any) => {
        const query = {
            name: param.name,
            warehouseId: Number(param.warehouseId.value),
            description: param.description,
            startDate: moment(param.startDate).format("YYYY-MM-DD hh:mm:ss"),
            endDate: moment(param.endDate).format("YYYY-MM-DD hh:mm:ss"),
            participants: param.participants.map((item: any) => { return (item.value) }),
            attachmentIds: path.map((item: any) => { return (item.id) })
        };
        if (data) {
            EditStocktake({ id: router.query?.id, ...query }).then(() => {
                handleChangeComplete(router.query?.id);
                handleCancel();
            }).catch((err) => {
                showMessage(`${err?.response?.data?.message}`, 'error');
            });
        } else {
            if (listDataDetail?.length === undefined || listDataDetail?.length === 0) {
                showMessage(`${t('please_add_product')}`, 'error');
                handleActive(2);
            } else {
                CreateStocktake(query).then((res) => {
                    handleDetail(res.data.id);
                    showMessage(`${t('create_success')}`, 'success');
                }).catch((err) => {
                    showMessage(`${err?.response?.data?.message[0].error}`, 'error');
                });
            }
        }
    }

    useEffect(() => {
        setInitialValue({
            name: data ? `${data?.name}` : "",
            participants: data ? data?.participants.map((item: any) => {
                return (
                    {
                        label: item.fullName,
                        value: item.id
                    }
                )
            }) : "",
            warehouseId: data ? {
                value: `${data?.warehouse.id}`,
                label: `${data?.warehouse.name}`
            } : "",
            description: data ? `${data?.description}` : "",
            startDate: data ? moment(`${data?.startDate}`).format("YYYY-MM-DD hh:mm") : "",
            endDate: data ? moment(`${data?.endDate}`).format("YYYY-MM-DD hh:mm") : ""
        })
        if (data?.warehouse?.length > 0) {
            setWarehouseId(data?.warehouse?.id)
        }
        setPath(data?.attachments);
    }, [data]);

    const handleDetail = async (id: any) => {
        AddStocktakeDetails({ id: id, details: listDataDetail }).then(() => {
        }).catch((err) => {
            showMessage(`${err?.response?.data?.message}`, 'error');
        });
        handleChangeComplete(id);
    };


    const handleStocktakeCancel = () => {
        StocktakeCancel({ id: router.query.id }).then(() => {
            mutate();
            showMessage(`${t('update_success')}`, 'success');
        }).catch((err) => {
            showMessage(`${err?.response?.data?.message}`, 'error');
        });
    }

    const handleApprove = () => {
        StocktakeApprove({ id: router.query.id }).then(() => {
            mutate();
            showMessage(`${t('update_success')}`, 'success');
        }).catch((err) => {
            showMessage(`${err?.response?.data?.message}`, 'error');
        });
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
        <>
            <div>
                {isLoading && (
                    <div className="screen_loader fixed inset-0 bg-[#fafafa] dark:bg-[#060818] z-[60] grid place-content-center animate__animated">
                        <IconLoading />
                    </div>
                )}
                <div className='flex justify-between header-page-bottom pb-4 mb-4'>
                    <h1 className='page-title'>{t('stocktake')}</h1>
                    <Link href="/warehouse-process/stocktake">
                        <div className="btn btn-primary btn-sm m-1 back-button h-9" >
                            <IconBackward />
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
                            handleStocktake(values);
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
                                            {t('stocktake_info')}
                                            <div className={`ltr:ml-auto rtl:mr-auto ${active.includes(1) ? 'rotate-180' : ''}`}>
                                                <IconCaretDown />
                                            </div>
                                        </button>
                                        <div className={`mb-2 ${active.includes(1) ? 'custom-content-accordion' : ''}`}>
                                            <AnimateHeight duration={300} height={active.includes(1) ? 'auto' : 0}>
                                                <div className='p-4'>
                                                    <div className='flex justify-between gap-5'>
                                                        <div className="w-1/2">
                                                            <label htmlFor="name" className='label'> {t('name')} < span style={{ color: 'red' }}>* </span></label >
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
                                                            <label htmlFor="warehouseId" className='label'> {t('warehouse')} < span style={{ color: 'red' }}>* </span></label >
                                                            <Select
                                                                id='warehouseId'
                                                                name='warehouseId'
                                                                options={dataWarehouseDropdown}
                                                                onMenuOpen={() => setPageWarehouse(1)}
                                                                onMenuScrollToBottom={handleMenuScrollToBottomWarehouse}
                                                                isLoading={warehouseLoading}
                                                                maxMenuHeight={160}
                                                                value={values?.warehouseId}
                                                                onChange={e => {
                                                                    setFieldValue('warehouseId', e)
                                                                    setWarehouseId(e.value);
                                                                }}
                                                                isDisabled={disable}
                                                            />
                                                            {submitCount && errors.warehouseId ? (
                                                                <div className="text-danger mt-1"> {`${errors.warehouseId}`} </div>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                    <div className='flex justify-between gap-5 mt-5'>
                                                        <div className="w-1/2">
                                                            <label htmlFor="startDate" className='label'> {t('start_date')} < span style={{ color: 'red' }}>* </span></label >
                                                            <Field autoComplete="off"
                                                                name="startDate"
                                                                render={({ field }: any) =>
                                                                (<Flatpickr
                                                                    data-enable-time
                                                                    // placeholder={`${t('choose_break_end_time')}`}
                                                                    options={{
                                                                        enableTime: true,
                                                                        dateFormat: 'Y-m-d H:i'
                                                                    }}
                                                                    value={field?.value}
                                                                    onChange={e => setFieldValue("startDate", moment(e[0]).format("YYYY-MM-DD hh:mm"))}
                                                                    className={disable ? "form-input bg-[#f2f2f2] calender-input" : "form-input calender-input"}
                                                                    disabled={disable}
                                                                />)
                                                                }
                                                            />
                                                            {submitCount && errors.startDate ? (
                                                                <div className="text-danger mt-1"> {`${errors.startDate}`} </div>
                                                            ) : null}
                                                        </div>
                                                        <div className="w-1/2">
                                                            <label htmlFor="endDate" className='label'> {t('end_date')} < span style={{ color: 'red' }}>* </span></label >
                                                            <Field autoComplete="off"
                                                                name="endDate"
                                                                render={({ field }: any) => (
                                                                    <Flatpickr
                                                                        data-enable-time
                                                                        // placeholder={`${t('choose_break_end_time')}`}
                                                                        options={{
                                                                            enableTime: true,
                                                                            dateFormat: 'Y-m-d H:i'
                                                                        }}
                                                                        value={field?.value}
                                                                        onChange={e => setFieldValue("endDate", moment(e[0]).format("YYYY-MM-DD hh:mm"))}
                                                                        className={disable ? "form-input bg-[#f2f2f2]" : "form-input"}
                                                                        disabled={disable}
                                                                    />
                                                                )}
                                                            />
                                                            {submitCount && errors.endDate ? (
                                                                <div className="text-danger mt-1"> {`${errors.endDate}`} </div>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                    <div className='flex justify-between gap-5 mt-5'>
                                                        <div className="w-1/2">
                                                            <label htmlFor="participants" className='label'> {t('participant')} < span style={{ color: 'red' }}>* </span></label >
                                                            <Select
                                                                id='participants'
                                                                name='participants'
                                                                options={dataUserDropdown}
                                                                maxMenuHeight={160}
                                                                onMenuOpen={() => setPageUser(1)}
                                                                onMenuScrollToBottom={handleMenuScrollToBottomUser}
                                                                isLoading={userLoading}
                                                                isMulti
                                                                value={values?.participants}
                                                                onChange={e => {
                                                                    setFieldValue('participants', e)
                                                                }}
                                                                isDisabled={disable}
                                                            />
                                                            {submitCount && errors.participants ? (
                                                                <div className="text-danger mt-1"> {`${errors.participants}`} </div>
                                                            ) : null}
                                                        </div>
                                                        <div className="w-1/2">
                                                            <label htmlFor="description" className='label'> {t('description')}</label >
                                                            <Field autoComplete="off"
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
                                                    </div>
                                                    <div className='mt-5'>
                                                        <label htmlFor="attachmentIds" className='label'> {t('attached_file')} </label >
                                                        <Field
                                                            innerRef={fileRef}
                                                            autoComplete="off"
                                                            name="attachmentIds"
                                                            type="file"
                                                            id="attachmentIds"
                                                            className={disable ? "form-input bg-[#f2f2f2]" : "form-input"}
                                                            disabled={disable}
                                                            multiple
                                                            onChange={(e: any) => handleChange(e)}
                                                        />
                                                        {submitCount && errors.attachmentIds ? (
                                                            <div className="text-danger mt-1"> {`${errors.attachmentIds}`} </div>
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
                                            </AnimateHeight>
                                        </div>
                                    </div>
                                    <div className="rounded">
                                        <button
                                            type="button"
                                            className={`flex w-full items-center p-4 text-white-dark dark:bg-[#1b2e4b] custom-accordion uppercase`}
                                            onClick={() => handleActive(2)}
                                        >
                                            {t('stocktake_detail')}
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
                                                                <>
                                                                    <button type="button" onClick={(e) => setOpenModal(true)} className="btn btn-primary btn-sm m-1 custom-button" >
                                                                        <IconPlus className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                                                        {t('add_product_list')}
                                                                    </button>
                                                                    {/* <button type="button" onClick={(e) => handleAutoAdd()} className="btn btn-primary btn-sm m-1 custom-button" >
                                                                        <IconArchive className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                                                        {t('auto_add')}
                                                                    </button> */}
                                                                </>
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
                                                <HandleDetailModal
                                                    openModal={openModal}
                                                    setOpenModal={setOpenModal}
                                                    data={dataDetail}
                                                    setData={setDataDetail}
                                                    listData={listDataDetail}
                                                    setListData={setListDataDetail}
                                                    warehouseId={warehouseId}
                                                />
                                                <TallyModal
                                                    openModal={openModalTally}
                                                    setOpenModal={setOpenModalTally}
                                                    data={dataTally}
                                                    setData={setDataTally}
                                                    stocktakeDetailMutate={mutate}
                                                />
                                            </AnimateHeight>
                                        </div>
                                    </div>
                                    <div className="mt-8 flex items-center justify-end ltr:text-right rtl:text-left">
                                        {
                                            !disable &&
                                            <>

                                                {
                                                    router.query?.status === "DRAFT" &&
                                                    <>
                                                        <button type="button" className="btn btn-outline-danger cancel-button" onClick={() => handleCancel()}>
                                                            {t('cancel')}
                                                        </button>
                                                        <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4 add-button">
                                                            {router.query.id !== "create" ? t('update') : t('add')}
                                                        </button>
                                                    </>
                                                }
                                            </>
                                        }
                                        {
                                            router.query.type === "tally" &&
                                            <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4 add-button w-32" onClick={() => handleFinish()}>
                                                {t("finish")}
                                            </button>
                                        }
                                    </div>
                                    {
                                        router.query.type === "approve" &&
                                        <div className="mt-8 flex items-center justify-end ltr:text-right rtl:text-left">
                                            <button type="button" className="btn btn-outline-danger cancel-button w-28" onClick={() => handleStocktakeCancel()}>
                                                {t('reject')}
                                            </button>
                                            <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4 add-button" onClick={() => handleApprove()}>
                                                {t('approve')}
                                            </button>
                                        </div>
                                    }
                                </div>
                            </Form>
                        )
                        }
                    </Formik >
                </div >
            </div >
        </>
    );
};
export default DetailPage;
