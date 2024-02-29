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
    const [dataProposalDropdown, setDataProposalDropdown] = useState<any>([]);
    const [data, setData] = useState<any>();

    const SubmittedForm = Yup.object().shape({
        name: Yup.string().required(`${t('please_fill_name')}`),
        code: Yup.string().required(`${t('please_fill_code')}`),
        proposalIds: new Yup.ArraySchema().required(`${t('please_fill_proposal')}`),
        provider: Yup.string().required(`${t('please_fill_provider')}`),
        estimatedDeliveryDate: Yup.string().required(`${t('please_fill_date')}`),
    });

    const { data: proposals, pagination: proposalPagiantion, isLoading: proposalLoading } = DropdownProposals({ page: pageProposal, type: "PURCHASE" });

    const handleOrder = (param: any) => {
        const query = {
            name: param.name,
            proposalIds: param.proposalIds.map((item: any) => { return (item.value) }),
            type: "PURCHASE",
            code: param.code,
            estimatedDeliveryDate: moment(param.estimatedDeliveryDate).format('YYYY-MM-DD'),
            provider: param.provider
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
            proposalIds: data ? data?.proposal.map((item: any) => {
                return (
                    {
                        label: item.name,
                        value: item.id
                    }
                )
            }) : "",
            code: data ? `${data?.code}` : "",
            estimatedDeliveryDate: data ? moment(`${data?.estimatedDeliveryDate}`).format("YYYY-MM-DD") : "",
            provider: data ? `${data?.provider}` : "",
        })
    }, [data]);

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
                                <label htmlFor="proposalIds" className='label'> {t('proposal')} < span style={{ color: 'red' }}>* </span></label >
                                <Select
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
                                    }}
                                />
                                {errors.proposalIds ? (
                                    <div className="text-danger mt-1"> {`${errors.proposalIds}`} </div>
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
                        <div className='flex justify-between gap-5'>
                            <div className="w-1/2">
                                <label htmlFor="provider" className='label'> {t('provider')}< span style={{ color: 'red' }}>* </span></label >
                                <Field id="provider" as="textarea" rows="2" name="provider" className="form-input" />
                                {errors.provider ? (
                                    <div className="text-danger mt-1"> {`${errors.provider}`} </div>
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
