import { useEffect, Fragment, useState, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import { showMessage } from '@/@core/utils';
import { useRouter } from 'next/router';
import Select, { components } from 'react-select';
import { CreateProposal, EditProposal, GetProposal } from '@/services/apis/proposal.api';
import { DropdownRepair } from '@/services/swr/dropdown.twr';
import IconBackward from '@/components/Icon/IconBackward';
import Link from 'next/link';

interface Props {
    [key: string]: any;
}
const ProposalForm = ({ ...props }: Props) => {

    const { t } = useTranslation();
    const router = useRouter();
    const [initialValue, setInitialValue] = useState<any>();
    const [pageRepair, setPageRepair] = useState<any>(1);
    const [dataRepairDropdown, setDataRepairDropdown] = useState<any>([]);
    const [data, setData] = useState<any>();

    useEffect(() => {
        if (Number(router.query.id)) {
            getData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.query.id])

    const SubmittedForm = Yup.object().shape({
        name: Yup.string().required(`${t('please_fill_name_proposal')}`),
        content: Yup.string().required(`${t('please_fill_content_proposal')}`),
        repairRequestId: new Yup.ObjectSchema().required(`${t('please_choose_repair')}`)
    });

    const { data: dropdownRepair, pagination: repairPagination, isLoading: repairLoading } = DropdownRepair({ page: pageRepair })

    const handleProposal = (param: any) => {
        const query: any = {
            name: param.name,
            type: "REPAIR",
            content: param.content,
            repairRequestId: param?.repairRequestId?.value
        };

        if (data) {
            EditProposal({ id: data?.id, ...query }).then((res) => {
                getData();
                showMessage(`${t('edit_success')}`, 'success');
            }).catch((err) => {
                showMessage(`${err?.response?.data?.message}`, 'error');
            });
        } else {
            CreateProposal(query).then((res) => {
                router.push({
                    pathname: `/warehouse-process/proposal-repair/${res.data.id}`,
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
        GetProposal({ id: router.query.id }).then((res) => {
            setData(res.data);
            router.push({
                pathname: `/warehouse-process/proposal-repair/${res.data.id}`,
                query: {
                    status: res.data.status
                }
            })
        }).catch((err) => {
            showMessage(`${err?.response?.data?.message}`, 'error');
        });
    }

    const handleCancel = () => {
        router.push('/warehouse-process/proposal-repair')
    };

    useEffect(() => {
        setInitialValue({
            name: data ? `${data?.name}` : "",
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
        <div className="p-5">
            <div className='flex justify-between header-page-bottom pb-4 mb-4'>
                <h1 className='page-title'>{t('add_shift')}</h1>
                <Link href="/warehouse-process/proposal-repair">
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
                    handleProposal(values);
                }}
                enableReinitialize
            >

                {({ errors, values, setFieldValue }) => (
                    <Form className="space-y-5" >
                        <div className='flex justify-between gap-5'>
                            <div className=" w-1/2">
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
                            <div className="flex justify-between gap-4 w-1/2">
                                <div className="flex-1">
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
                                        onChange={e => {
                                            setFieldValue('repairRequestId', e)
                                        }}
                                    />
                                    {errors.repairRequestId ? (
                                        <div className="text-danger mt-1"> {`${errors.repairRequestId}`} </div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                        <div className="mb-5">
                            <label htmlFor="type" className='label'> {t('content')} < span style={{ color: 'red' }}>* </span></label >
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
                            <button type="button" className="btn btn-outline-danger cancel-button" onClick={() => handleCancel()}>
                                {t('cancel')}
                            </button>
                            <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4 add-button">
                                {router.query.id !== "create" ? t('update') : t('add')}
                            </button>
                        </div>

                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default ProposalForm;
