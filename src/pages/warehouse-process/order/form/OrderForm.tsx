import { useEffect, Fragment, useState, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import { showMessage } from '@/@core/utils';
import IconX from '@/components/Icon/IconX';
import { useRouter } from 'next/router';
import Select, { components } from 'react-select';
import { DropdownOrderType, DropdownProposals, DropdownProviders } from '@/services/swr/dropdown.twr';
import { CreateOrder, EditOrder, GetOrder } from '@/services/apis/order.api';
import moment from 'moment';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Link from 'next/link';
import IconBackward from '@/components/Icon/IconBackward';

interface Props {
    [key: string]: any;
}

const OrderModal = ({ ...props }: Props) => {

    const { t } = useTranslation();
    const router = useRouter();
    const [initialValue, setInitialValue] = useState<any>();
    const [pageProposal, setPageProposal] = useState(1);
    const [pageProvider, setPageProvider] = useState(1);
    const [dataProposalDropdown, setDataProposalDropdown] = useState<any>([]);
    const [dataProviderDropdown, setDataProviderDropdown] = useState<any>([]);
    const [data, setData] = useState<any>();

    const SubmittedForm = Yup.object().shape({
        name: Yup.string().required(`${t('please_fill_name')}`),
        type: new Yup.ObjectSchema().required(`${t('please_fill_type')}`),
        code: Yup.string().required(`${t('please_fill_code')}`),
        proposalId: new Yup.ObjectSchema().required(`${t('please_fill_proposal')}`),
        providerId: new Yup.ObjectSchema().required(`${t('please_fill_provider')}`),
        estimatedDeliveryDate: Yup.string().required(`${t('please_fill_date')}`),

    });

    const { data: proposals, pagination: proposalPagiantion, isLoading: proposalLoading } = DropdownProposals({ page: pageProposal, type: "PURCHASE" });
    const { data: orderTypes } = DropdownOrderType({ perPage: 0 });
    const { data: providers, pagination: providerPagiantion, isLoading: providerLoading } = DropdownProviders({ page: pageProvider });

    const handleOrder = (param: any) => {
        const query = {
            name: param.name,
            proposalId: Number(param.proposalId.value),
            type: param.type.value,
            code: param.code,
            estimatedDeliveryDate: param.estimatedDeliveryDate,
            providerId: Number(param.providerId.value)
        };
        if (data) {
            EditOrder({ id: router?.query?.id, ...query }).then(() => {
                getData();
                showMessage(`${t('edit_success')}`, 'success');
            }).catch((err) => {
                showMessage(`${err?.response?.data?.message}`, 'error');
            });
        } else {
            CreateOrder(query).then((res) => {
                router.push({
                    pathname: `/warehouse-process/order/${res.data.id}`,
                    query: {
                        status: res.data.status
                    }
                })
                showMessage(`${t('create_success')}`, 'success');
            }).catch((err) => {
                showMessage(`${err?.response?.data?.message}`, 'error');
            });
        }
    }
    const getData = () => {
        GetOrder({ id: router.query.id }).then((res) => {
            setData(res.data);
            router.push({
                pathname: `/warehouse-process/order/${res.data.id}`,
                query: {
                    status: res.data.status
                }
            })
        }).catch((err) => {
            showMessage(`${err?.response?.data?.message}`, 'error');
        });
    }

    const handleCancel = () => {
        router.push('/warehouse-process/order')
    };

    useEffect(() => {
        if (Number(router.query.id)) {
            getData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.query.id])

    useEffect(() => {
        setInitialValue({
            name: data ? `${data?.name}` : "",
            proposalId: data ? {
                value: `${data?.proposal.id}`,
                label: `${data?.proposal.name}`
            } : "",
            type: data ? data?.type === "PURCHASE" ? {
                value: `${data?.type}`,
                label: `Đơn hàng mua`
            } : {
                value: `${data?.type}`,
                label: `Đơn hàng bán`
            } : "",
            code: data ? `${data?.code}` : "",
            estimatedDeliveryDate: data ? moment(`${data?.estimatedDeliveryDate}`).format("YYYY-MM-DD") : "",
            providerId: data ? {
                value: `${data?.provider?.id}`,
                label: `${data?.provider?.name}`
            } : "",
        })
    }, [data]);

    useEffect(() => {
        if (providerPagiantion?.page === undefined) return;
        if (providerPagiantion?.page === 1) {
            setDataProviderDropdown(providers?.data)
        } else {
            setDataProviderDropdown([...dataProviderDropdown, ...providers?.data])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [providerPagiantion])

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
    const handleMenuScrollToBottomProvider = () => {
        setTimeout(() => {
            setPageProvider(providerPagiantion?.page + 1);
        }, 1000);
    }

    return (
        <div className="p-5">
            <div className='flex justify-between header-page-bottom pb-4 mb-4'>
                <h1 className='page-title'>{t('order_product')}</h1>
                <Link href="/warehouse-process/order">
                    <div className="btn btn-primary btn-sm m-1 back-button h-9" >
                        <IconBackward />
                        <span>
                            {t('back')}
                        </span>
                    </div>
                </Link>
            </div>
            <Formik
                initialValues={initialValue}
                validationSchema={SubmittedForm}
                onSubmit={values => {
                    handleOrder(values);
                }}
                enableReinitialize
            >

                {({ errors, values, setFieldValue }) => (
                    <Form className="space-y-5" >
                        <div className='flex justify-between gap-5'>
                            <div className="w-1/2">
                                <label htmlFor="name" className='label'> {t('name')} < span style={{ color: 'red' }}>* </span></label >
                                <Field
                                    name="name"
                                    type="text"
                                    id="name"
                                    placeholder={`${t('enter_name')}`}
                                    className="form-input"
                                />
                                {errors.name ? (
                                    <div className="text-danger mt-1"> {`${errors.name}`} </div>
                                ) : null}
                            </div>
                            <div className="w-1/2">
                                <label htmlFor="proposalId" className='label'> {t('proposal')} < span style={{ color: 'red' }}>* </span></label >
                                <Select
                                    id='proposalId'
                                    name='proposalId'
                                    options={dataProposalDropdown}
                                    onMenuOpen={() => setPageProposal(1)}
                                    onMenuScrollToBottom={handleMenuScrollToBottomProposal}
                                    isLoading={proposalLoading}
                                    maxMenuHeight={160}
                                    value={values?.proposalId}
                                    onChange={e => {
                                        setFieldValue('proposalId', e)
                                    }}
                                />
                                {errors.proposalId ? (
                                    <div className="text-danger mt-1"> {`${errors.proposalId}`} </div>
                                ) : null}
                            </div>
                        </div>
                        <div className='flex justify-between gap-5'>
                            <div className="w-1/2">
                                <label htmlFor="type" className='label'> {t('type')} < span style={{ color: 'red' }}>* </span></label >
                                <Select
                                    id='type'
                                    name='type'
                                    options={orderTypes?.data}
                                    maxMenuHeight={160}
                                    value={values?.type}
                                    onChange={e => {
                                        setFieldValue('type', e)
                                    }}
                                />
                                {errors.type ? (
                                    <div className="text-danger mt-1"> {`${errors.type}`} </div>
                                ) : null}
                            </div>
                            <div className="w-1/2">
                                <label htmlFor="providerId" className='label'> {t('provider')}< span style={{ color: 'red' }}>* </span></label >
                                <Select
                                    id='providerId'
                                    name='providerId'
                                    options={dataProviderDropdown}
                                    onMenuOpen={() => setPageProvider(1)}
                                    onMenuScrollToBottom={handleMenuScrollToBottomProvider}
                                    isLoading={providerLoading}
                                    maxMenuHeight={160}
                                    value={values?.providerId}
                                    onChange={e => {
                                        setFieldValue('providerId', e)
                                    }}
                                />
                                {errors.providerId ? (
                                    <div className="text-danger mt-1"> {`${errors.providerId}`} </div>
                                ) : null}
                            </div>
                        </div>
                        <div className='flex justify-between gap-5'>
                            <div className="w-1/2">
                                <label htmlFor="code" className='label'> {t('code')} < span style={{ color: 'red' }}>* </span></label >
                                <Field
                                    name="code"
                                    type="text"
                                    id="code"
                                    placeholder={`${t('enter_code')}`}
                                    className="form-input"
                                />
                                {errors.code ? (
                                    <div className="text-danger mt-1"> {`${errors.code}`} </div>
                                ) : null}
                            </div>
                            <div className="w-1/2">
                                <label htmlFor="estimatedDeliveryDate" className='label'> {t('estimated_delivery_date')} < span style={{ color: 'red' }}>* </span></label >
                                <Field
                                    name="estimatedDeliveryDate"
                                    render={({ field }: any) => (
                                        <Flatpickr
                                            data-enable-time
                                            // placeholder={`${t('choose_break_end_time')}`}
                                            options={{
                                                enableTime: true,
                                                dateFormat: 'Y-m-d H:i'
                                            }}
                                            value={field?.value}
                                            onChange={e => setFieldValue("estimatedDeliveryDate", moment(e[0]).format("YYYY-MM-DD hh:mm"))}
                                            className="form-input"
                                        />
                                    )}
                                    className="form-input"
                                />
                                {errors.estimatedDeliveryDate ? (
                                    <div className="text-danger mt-1"> {`${errors.estimatedDeliveryDate}`} </div>
                                ) : null}
                            </div>
                        </div>
                        <div className="mt-8 flex items-center justify-end ltr:text-right rtl:text-left">
                            <button type="button" className="btn btn-outline-danger cancel-button" onClick={() => handleCancel()}>
                                {t('cancel')}
                            </button>
                            <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4 add-button">
                                {data !== undefined ? t('update') : t('add')}
                            </button>
                        </div>

                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default OrderModal;
