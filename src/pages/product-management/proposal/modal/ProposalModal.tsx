import { useEffect, Fragment, useState, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog, Transition } from '@headlessui/react';

import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import { showMessage } from '@/@core/utils';
import IconX from '@/components/Icon/IconX';
import { useRouter } from 'next/router';
import Select, { components } from 'react-select';
import { CreateProposal, EditProposal } from '@/services/apis/proposal.api';

interface Props {
    [key: string]: any;
}

const ProposalModal = ({ ...props }: Props) => {

    const { t } = useTranslation();
    const router = useRouter();
    const [initialValue, setInitialValue] = useState<any>();

    const SubmittedForm = Yup.object().shape({
        name: Yup.string().required(`${t('please_fill_name_proposal')}`),
        content: Yup.string().required(`${t('please_fill_content_proposal')}`),
        type: new Yup.ObjectSchema().required(`${t('please_fill_type_proposal')}`)

    });

    const handleProposal = (param: any) => {
        const query = {
            name: param.name,
            type: param.type.value,
            content: param.content
        };
        if (props?.data) {
            EditProposal({ id: props?.data?.id, ...query }).then(() => {
                props.proposalMutate();
                handleCancel();
                showMessage(`${t('edit_success')}`, 'success');
            }).catch((err) => {
                showMessage(`${err?.response?.data?.message}`, 'error');
            });
        } else {
            CreateProposal(query).then(() => {
                props.proposalMutate();
                handleCancel();
                showMessage(`${t('create_success')}`, 'success');
            }).catch((err) => {
                showMessage(`${err?.response?.data?.message}`, 'error');
            });
        }
    }

    const handleCancel = () => {
        props.setOpenModal(false);
        setInitialValue({});
    };

    useEffect(() => {
        setInitialValue({
            name: props?.data ? `${props?.data?.name}` : "",
            type: props?.data ? {
                value: `${props?.data?.type}`,
                label: `${props?.data?.type}`
            } : "",
            content: props?.data ? `${props?.data?.content}` : ""

        })
    }, [props?.data, router]);

    const option = [
        {
            label: "PURCHASE",
            value: "PURCHASE"
        },
        {
            label: "REPAIR",
            value: "REPAIR"
        }
    ]

    return (
        <Transition appear show={props.openModal ?? false} as={Fragment}>
            <Dialog as="div" open={props.openModal} onClose={() => props.setOpenModal(false)} className="relative z-50">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-[black]/60" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center px-4 py-8">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="panel w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                <button
                                    type="button"
                                    onClick={() => handleCancel()}
                                    className="absolute top-4 text-gray-400 outline-none hover:text-gray-800 ltr:right-4 rtl:left-4 dark:hover:text-gray-600"
                                >
                                    <IconX />
                                </button>
                                <div className="bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pr-5 rtl:pl-[50px] dark:bg-[#121c2c]">
                                    {props.data !== undefined ? 'Edit proposal' : 'Add proposal'}
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
                                                    <label htmlFor="name" > {t('name_proposal')} < span style={{ color: 'red' }}>* </span></label >
                                                    <Field
                                                        name="name"
                                                        type="text"
                                                        id="name"
                                                        placeholder={`${t('enter_name_proposal')}`}
                                                        className="form-input"
                                                    />
                                                    {errors.name ? (
                                                        <div className="text-danger mt-1"> {`${errors.name}`} </div>
                                                    ) : null}
                                                </div>
                                                <div className="mb-5 flex justify-between gap-4">
                                                    <div className="flex-1">
                                                        <label htmlFor="type" > {t('type_proposal')} < span style={{ color: 'red' }}>* </span></label >
                                                        <Select
                                                            id='type'
                                                            name='type'
                                                            options={option}
                                                            maxMenuHeight={160}
                                                            value={values.type}
                                                            onChange={e => {
                                                                setFieldValue('type', e)
                                                            }}
                                                        />
                                                        {errors.type ? (
                                                            <div className="text-danger mt-1"> {`${errors.type}`} </div>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="mb-5">
                                                    <label htmlFor="type" > {t('content_proposal')} < span style={{ color: 'red' }}>* </span></label >
                                                    <Field
                                                        name="content"
                                                        type="text"
                                                        id="content"
                                                        placeholder={`${t('enter_content_proposal')}`}
                                                        className="form-input"
                                                    />
                                                    {errors.content ? (
                                                        <div className="text-danger mt-1"> {`${errors.content}`} </div>
                                                    ) : null}
                                                </div>
                                                <div className="mt-8 flex items-center justify-end ltr:text-right rtl:text-left">
                                                    <button type="button" className="btn btn-outline-danger" onClick={() => handleCancel()}>
                                                        Cancel
                                                    </button>
                                                    <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                                        {props.data !== undefined ? 'Update' : 'Add'}
                                                    </button>
                                                </div>

                                            </Form>
                                        )}
                                    </Formik>

                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default ProposalModal;