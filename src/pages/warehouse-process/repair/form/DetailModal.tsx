import { useEffect, Fragment, useState, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog, Transition } from '@headlessui/react';

import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import { showMessage } from '@/@core/utils';
import IconX from '@/components/Icon/IconX';
import { useRouter } from 'next/router';
import Select, { components } from 'react-select';
import { DropdownProducts } from '@/services/swr/dropdown.twr';
import { AddRepairDetail, EditRepairDetail } from '@/services/apis/repair.api';

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
        replacementPartId: new Yup.ObjectSchema().required(`${t('please_fill_product')}`),
        quantity: Yup.string().required(`${t('please_fill_quantity')}`),
    });

    const { data: productDropdown, pagination: productPagination, isLoading: productLoading } = DropdownProducts({ page: page });


    const handleRepairDetail = (param: any) => {
        if (Number(router.query.id)) {
            const query = {
                replacementPartId: Number(param.replacementPartId.value),
                quantity: Number(param.quantity),
                brokenPart: param.brokenPart,
                description: param.description
            };
            if (props?.data) {
                EditRepairDetail({ id: router.query.id, detailId: props?.data?.id, ...query }).then(() => {
                    props.orderDetailMutate();
                    handleCancel();
                    showMessage(`${t('edit_success')}`, 'success');
                }).catch((err) => {
                    showMessage(`${err?.response?.data?.message}`, 'error');
                });
            } else {
                AddRepairDetail({ id: router.query.id, ...query }).then(() => {
                    props.orderDetailMutate();
                    handleCancel();
                    showMessage(`${t('create_success')}`, 'success');
                }).catch((err) => {
                    showMessage(`${err?.response?.data?.message}`, 'error');
                });
            }
        } else {
            const query = {
                id: props.listData ? props.listData.length + 1 : 1,
                replacementPart: {
                    name: param.replacementPartId.label,
                    id: param.replacementPartId.value
                },
                replacementPartId: Number(param.replacementPartId.value),
                quantity: Number(param.quantity),
                brokenPart: param.brokenPart,
                description: param.description
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
        props.setData();
        setInitialValue({});
    };

    useEffect(() => {
        setInitialValue({
            quantity: props?.data ? `${props?.data?.quantity}` : "",
            replacementPartId: props?.data ? {
                value: `${props?.data?.replacementPart?.id}`,
                label: `${props?.data?.replacementPart?.name}`
            } : "",
            brokenPart: props?.data ? props?.data.brokenPart : "",
            description: props?.data ? props?.data.description : ""
        })
    }, [props?.data, router]);

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
                onSubmit={values => {
                    handleRepairDetail(values);
                }}
                enableReinitialize
            >
                {({ errors, values, setFieldValue, submitCount }) => (
                    <Form className="space-y-5" >
                        <div className="mb-5 flex justify-between gap-4">
                            <div className="w-1/2">
                                <label htmlFor="replacementPartId" className='label'> {t('product')} < span style={{ color: 'red' }}>* </span></label >
                                <Select
                                    id='replacementPartId'
                                    name='replacementPartId'
                                    options={dataProductDropdown}
                                    onMenuOpen={() => setPage(1)}
                                    onMenuScrollToBottom={handleMenuScrollToBottom}
                                    isLoading={productLoading}
                                    maxMenuHeight={160}
                                    value={values?.replacementPartId}
                                    onChange={e => {
                                        setFieldValue('replacementPartId', e)
                                    }}
                                />
                                {submitCount && errors.replacementPartId ? (
                                    <div className="text-danger mt-1"> {`${errors.replacementPartId}`} </div>
                                ) : null}
                            </div>
                            <div className="w-1/2">
                                <label htmlFor="quantity" className='label'> {t('quantity')} < span style={{ color: 'red' }}>* </span></label >
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
                        <div className="mb-5 flex justify-between gap-4">
                            <div className="w-1/2">
                                <label htmlFor="brokenPart" className='label'> {t('broken_part')} </label >
                                <Field
                                    name="brokenPart"
                                    type="text"
                                    id="brokenPart"
                                    placeholder={`${t('enter_broken_part')}`}
                                    className="form-input"
                                />
                                {submitCount && errors.brokenPart ? (
                                    <div className="text-danger mt-1"> {`${errors.brokenPart}`} </div>
                                ) : null}
                            </div>
                            <div className="w-1/2">
                                <label htmlFor="description" className='label'> {t('description')}</label >
                                <Field
                                    name="description"
                                    type="text"
                                    id="description"
                                    placeholder={`${t('enter_description')}`}
                                    className="form-input"
                                />
                                {submitCount && errors.description ? (
                                    <div className="text-danger mt-1"> {`${errors.description}`} </div>
                                ) : null}
                            </div>
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
