import { useEffect, Fragment, useState, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import { showMessage } from '@/@core/utils';
import { useRouter } from 'next/router';
import Select, { components } from 'react-select';
import { CreateProposal, EditProposal, GetProposal } from '@/services/apis/proposal.api';
import { DropdownProposalType, DropdownRepair } from '@/services/swr/dropdown.twr';

interface Props {
    [key: string]: any;
}
const ProposalForm = ({ ...props }: Props) => {

    const { t } = useTranslation();
    const router = useRouter();
    const [initialValue, setInitialValue] = useState<any>();
    const [repair, setRepair] = useState(false);
    const [pageRepair, setPageRepair] = useState<any>(1);
    const [dataRepairDropdown, setDataRepairDropdown] = useState<any>([]);
    const [data, setData] = useState<any>();
    console.log("🚀 ~ ProposalForm ~ data:", data)

    useEffect(() => {
        if (router.query.id !== "create") {
            GetProposal({ id: router.query.id }).then((res) => {
                setData(res.data);
            }).catch((err) => {
                showMessage(`${err?.response?.data?.message}`, 'error');
            });
        }
    }, [router.query.id])

    useEffect(() => {
        if (data?.type === "REPAIR") {
            setRepair(true);
        } else {
            setRepair(false)
        }
    }, [data])

    const SubmittedForm = Yup.object().shape({
        name: Yup.string().required(`${t('please_fill_name_proposal')}`),
        content: Yup.string().required(`${t('please_fill_content_proposal')}`),
        type: new Yup.ObjectSchema().required(`${t('please_fill_type_proposal')}`)

    });

    const { data: dropdownProposalType } = DropdownProposalType({ perPage: 0 })
    const { data: dropdownRepair, pagination: repairPagination, isLoading: repairLoading } = DropdownRepair({ page: pageRepair })

    const handleProposal = (param: any) => {
        const query = {
            name: param.name,
            type: param.type.value,
            content: param.content,
            repairRequestId: param?.repairRequestId?.value
        };
        if (data) {
            EditProposal({ id: data?.id, ...query }).then(() => {
                handleCancel();
                showMessage(`${t('edit_success')}`, 'success');
            }).catch((err) => {
                showMessage(`${err?.response?.data?.message}`, 'error');
            });
        } else {
            CreateProposal(query).then((res) => {
                router.push({
                    pathname: `/warehouse-process/proposal/${res.data.id}`,
                    query: {
                        type: res.data.type,
                        status: res.data.status,
                        name: res.data.name
                    }
                })
                showMessage(`${t('create_success')}`, 'success');
            }).catch((err) => {
                showMessage(`${err?.response?.data?.message}`, 'error');
            });
        }
    }

    const handleCancel = () => {
        router.push('/warehouse-process/proposal')
    };

    useEffect(() => {
        setInitialValue({
            name: data ? `${data?.name}` : "",
            type: data ? data?.type === "PURCHASE" ?
                {
                    value: `${data?.type}`,
                    label: `Yêu cầu mua hàng`
                } :
                data?.type === "SUPPLY" ?
                    {
                        value: `${data?.type}`,
                        label: `Yêu cầu cung cấp`
                    } :
                    {
                        value: `${data?.type}`,
                        label: `Yêu cầu sửa chữa`
                    } : "",
            content: data ? `${data?.content}` : "",
            repairRequestId: data ? {
                value: `${data?.repairRequest?.id}`,
                label: `${data?.repairRequest?.name}`,
            } : "",

        })
    }, [data, router]);

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
        <div className='panel'>
            <div className="bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pr-5 rtl:pl-[50px] dark:bg-[#121c2c]">
                {t('proposal')}
            </div>
            <div className="p-5">
                <Formik
                    initialValues={initialValue}
                    validationSchema={SubmittedForm}
                    onSubmit={values => {
                        handleProposal(values);
                    }}
                    enableReinitialize
                >

                    {({ errors, values, setFieldValue }) => (
                        <Form className="space-y-5" >
                            <div className="mb-5">
                                <label htmlFor="name" > {t('name')} < span style={{ color: 'red' }}>* </span></label >
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
                            <div className="mb-5 flex justify-between gap-4">
                                <div className="flex-1">
                                    <label htmlFor="type" > {t('type')} < span style={{ color: 'red' }}>* </span></label >
                                    <Select
                                        id='type'
                                        name='type'
                                        options={dropdownProposalType?.data}
                                        maxMenuHeight={160}
                                        value={values?.type}
                                        onChange={e => {
                                            if (e.value === "REPAIR") {
                                                setFieldValue('repairRequestId', '')
                                                setRepair(true)
                                            } else {
                                                setRepair(false)
                                            }
                                            setFieldValue('type', e)
                                        }}
                                    />
                                    {errors.type ? (
                                        <div className="text-danger mt-1"> {`${errors.type}`} </div>
                                    ) : null}
                                </div>
                            </div>
                            {
                                repair &&
                                <div className="mb-5 flex justify-between gap-4">
                                    <div className="flex-1">
                                        <label htmlFor="repairRequestId" > {t('repair_request')} < span style={{ color: 'red' }}>* </span></label >
                                        <Select
                                            id='repairRequestId'
                                            name='repairRequestId'
                                            options={dataRepairDropdown}
                                            onMenuOpen={() => setPageRepair(1)}
                                            onMenuScrollToBottom={handleMenuScrollToBottomRepair}
                                            isLoading={repairLoading}
                                            maxMenuHeight={160}
                                            value={values.repairRequestId}
                                            onChange={e => {
                                                setFieldValue('repairRequestId', e)
                                            }}
                                        />
                                        {errors.repairRequestId ? (
                                            <div className="text-danger mt-1"> {`${errors.repairRequestId}`} </div>
                                        ) : null}
                                    </div>
                                </div>
                            }
                            <div className="mb-5">
                                <label htmlFor="type" > {t('content')} < span style={{ color: 'red' }}>* </span></label >
                                <Field
                                    name="content"
                                    type="text"
                                    id="content"
                                    placeholder={`${t('enter_content')}`}
                                    className="form-input"
                                />
                                {errors.content ? (
                                    <div className="text-danger mt-1"> {`${errors.content}`} </div>
                                ) : null}
                            </div>
                            <div className="mt-8 flex items-center justify-end ltr:text-right rtl:text-left">
                                <button type="button" className="btn btn-outline-danger" onClick={() => handleCancel()}>
                                    {t('cancel')}
                                </button>
                                <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                    {router.query.id !== "create" ? t('update') : t('add')}
                                </button>
                            </div>

                        </Form>
                    )}
                </Formik>

            </div>
        </div>
    );
};

export default ProposalForm;
