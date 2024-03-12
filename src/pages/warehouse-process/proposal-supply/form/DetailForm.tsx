import { useEffect, Fragment, useState, SetStateAction, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog, Transition } from '@headlessui/react';

import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import { showMessage } from '@/@core/utils';
import IconX from '@/components/Icon/IconX';
import { useRouter } from 'next/router';
import Select, { components } from 'react-select';
import { AddProposalDetail, EditProposalDetail } from '@/services/apis/proposal.api';
import { DropdownProducts } from '@/services/swr/dropdown.twr';

interface Props {
    [key: string]: any;
}

const HandleDetailForm = ({ ...props }: Props) => {
    const { t } = useTranslation();
    const router = useRouter();
    const [initialValue, setInitialValue] = useState<any>();
    const [dataProductDropdown, setDataProductDropdown] = useState<any>([]);
    const [page, setPage] = useState(1);

    const SubmittedForm = Yup.object().shape({
        productId: new Yup.ObjectSchema().required(`${t('please_fill_product')}`),
        quantity: Yup.string().required(`${t('please_fill_quantity')}`),
    });

    const { data: productDropdown, pagination: productPagination, isLoading: productLoading } = DropdownProducts({ page: page });

    const handleProposal = (param: any) => {
        if (Number(router.query.id)) {
            const query = {
                productId: Number(param.productId.value),
                quantity: Number(param.quantity),
                note: param.note,
                // price: param?.price ? param?.price : 0
            };
            if (props?.data) {
                EditProposalDetail({ id: router.query.id, detailId: props?.data?.id, ...query }).then(() => {
                    handleCancel();
                    showMessage(`${t('edit_success')}`, 'success');
                }).catch((err) => {
                    showMessage(`${err?.response?.data?.message}`, 'error');
                });
            } else {
                AddProposalDetail({ id: router.query.id, ...query }).then(() => {
                    handleCancel();
                    showMessage(`${t('create_success')}`, 'success');
                }).catch((err) => {
                    showMessage(`${err?.response?.data?.message}`, 'error');
                });
            }
        } else {
            const query = {
                id: props.listData ? props.listData.length + 1 : 0,
                product: {
                    name: param.productId.label,
                    id: param.productId.value
                },
                productId: Number(param.productId.value),
                quantity: Number(param.quantity),
                note: param.note,
                // price: param?.price ? param?.price : 0
            };
            if (props?.data?.id) {
                const filteredItems = props.listData.filter((item: any) => item.id !== props.data.id)
                props.setListData([...filteredItems, query])
                props.setData(query);
            } else {
                if (props.listData && props.listData.length > 0) {
                    props.setListData([...props.listData, query])
                } else {
                    props.setListData([query])
                }
            }
            handleCancel();
        }
    }

    const handleCancel = () => {
        props.setOpenModal(false);
        // props.setData();
        props.proposalDetailMutate();
        setInitialValue({});
    };

    useEffect(() => {
        setInitialValue({
            quantity: props?.data ? `${props?.data?.quantity}` : "",
            productId: props?.data ? {
                value: `${props?.data?.product?.id}`,
                label: `${props?.data?.product?.name}`
            } : "",
            note: props?.data ? `${props?.data?.note}` : "",
            // price: props?.data ? props?.data.price : ""
        })
    }, [props?.data]);


    useEffect(() => {
        if (productPagination?.page === undefined) return;
        if (productPagination?.page === 1) {
            setDataProductDropdown(productDropdown?.data)
        } else {
            setDataProductDropdown([...dataProductDropdown, ...productDropdown?.data])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productPagination])

    const handleMenuScrollToBottom = () => {
        setTimeout(() => {
            setPage(productPagination?.page + 1);
        }, 1000);
    }

    return (
        <div className="p-5">
            <Formik
                initialValues={initialValue}
                validationSchema={SubmittedForm}
                onSubmit={async (values, { resetForm }) => {
                    await handleProposal(values)
                    resetForm()
                }}
                enableReinitialize
            >
                {({ errors, values, setFieldValue, submitCount }) => (
                    <Form className="space-y-5" >
                        <div className="mb-5 flex justify-between gap-4" >
                            <div className="w-1/2" >
                                <label htmlFor="productId" className='label'> {t('product')} < span style={{ color: 'red' }}>* </span></label >
                                <Select
                                    id='productId'
                                    name='productId'
                                    options={dataProductDropdown}
                                    onMenuOpen={() => setPage(1)}
                                    onMenuScrollToBottom={handleMenuScrollToBottom}
                                    isLoading={productLoading}
                                    maxMenuHeight={160}
                                    value={values?.productId}
                                    onChange={e => {
                                        setFieldValue('productId', e)
                                    }}
                                />
                                {submitCount && errors.productId ? (
                                    <div className="text-danger mt-1"> {`${errors.productId}`} </div>
                                ) : null}
                            </div>
                            <div className="w-1/2">
                                <label htmlFor="quantity" className='label' > {t('quantity')} < span style={{ color: 'red' }}>* </span></label >
                                <Field
                                    name="quantity"
                                    type="number"
                                    id="quantity"
                                    placeholder={`${t('enter_quantity')}`}
                                    className="form-input"
                                />
                                {submitCount && errors.quantity ? (
                                    <div className="text-danger mt-1"> {`${errors.quantity}`} </div>
                                ) : null}
                            </div>
                        </div>
                        {/* <div className="mb-5">
                        <label htmlFor="price" > {t('price')} </label >
                        <Field name="price" type="number" id="price" placeholder={`${t('enter_price')}`} className="form-input" />
                        {submitCount && errors.price ? (
                            <div className="text-danger mt-1"> {`${errors.price}`} </div>
                        ) : null}
                    </div> */}
                        <div className="mb-5">
                            <label htmlFor="note" className='label'> {t('description')} </label >
                            <Field
                                name="note"
                                type="text"
                                id="note"
                                placeholder={`${t('enter_description')}`}
                                className="form-input"
                            />
                            {errors.note ? (
                                <div className="text-danger mt-1"> {`${errors.note}`} </div>
                            ) : null}
                        </div>
                        <div className="mt-8 flex items-center justify-end ltr:text-right rtl:text-left">
                            <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4 add-button">
                                {props.data !== undefined ? t('update') : t('add_new')}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};
export default HandleDetailForm;
