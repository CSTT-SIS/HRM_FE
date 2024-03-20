import { useEffect, Fragment, useState, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import { showMessage } from '@/@core/utils';
import { useRouter } from 'next/router';
import { CreateProposal, EditProposal, GetProposal } from '@/services/apis/proposal.api';
import Link from 'next/link';
import IconBackward from '@/components/Icon/IconBackward';
import IconBack from '@/components/Icon/IconBack';

interface Props {
    [key: string]: any;
}
const ProposalForm = ({ ...props }: Props) => {

    const { t } = useTranslation();
    const router = useRouter();
    const [initialValue, setInitialValue] = useState<any>();
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

    });

    const handleProposal = (param: any) => {
        const query: any = {
            name: param.name,
            type: "PURCHASE",
            content: param.content,
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
                    pathname: `/warehouse-process/proposal-order/${res.data.id}`,
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
                pathname: `/warehouse-process/proposal-order/${res.data.id}`,
                query: {
                    status: res.data.status
                }
            })
        }).catch((err) => {
            showMessage(`${err?.response?.data?.message}`, 'error');
        });
    }

    const handleCancel = () => {
        router.push('/warehouse-process/proposal-order')
    };

    useEffect(() => {
        setInitialValue({
            name: data ? `${data?.name}` : "",
            content: data ? `${data?.content}` : ""
        })
    }, [data, router]);

    return (
        <div className="p-5">
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
                                <Field autoComplete="off"
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
                            <div className=" w-1/2">
                                <label htmlFor="type" className='label'> {t('content')} < span style={{ color: 'red' }}>* </span></label >
                                <Field autoComplete="off"
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
