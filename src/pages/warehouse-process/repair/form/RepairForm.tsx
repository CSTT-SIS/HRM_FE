import { useEffect, Fragment, useState, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog, Transition } from '@headlessui/react';

import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import { showMessage } from '@/@core/utils';
import { useRouter } from 'next/router';
import Select, { components } from 'react-select';
import { DropdownUsers } from '@/services/swr/dropdown.twr';
import { CreateRepair, EditRepair, GetRepair } from '@/services/apis/repair.api';
import Link from 'next/link';
import IconBackward from '@/components/Icon/IconBackward';
import IconBack from '@/components/Icon/IconBack';

interface Props {
    [key: string]: any;
}

const RepairForm = ({ ...props }: Props) => {

    const { t } = useTranslation();
    const router = useRouter();
    const [initialValue, setInitialValue] = useState<any>();
    const [dataUserDropdown, setDataUserDropdown] = useState<any>([]);
    const [page, setPage] = useState(1);
    const [data, setData] = useState<any>();

    const SubmittedForm = Yup.object().shape({
        vehicleRegistrationNumber: Yup.string().required(`${t('please_fill_name')}`),
        repairById: new Yup.ObjectSchema().required(`${t('please_fill_proposal')}`),
    });

    const { data: users, pagination: paginationUser, isLoading: userLoading } = DropdownUsers({ page: page });

    const handleRepair = (param: any) => {
        const query = {
            vehicleRegistrationNumber: param.vehicleRegistrationNumber,
            repairById: Number(param.repairById.value),
            description: param.description,
            damageLevel: param.damageLevel
        };
        if (data) {
            EditRepair({ id: router.query?.id, ...query }).then((res) => {
                getData();
                showMessage(`${t('edit_success')}`, 'success');
            }).catch((err) => {
                showMessage(`${err?.response?.data?.message}`, 'error');
            });
        } else {
            CreateRepair(query).then((res) => {
                router.push({
                    pathname: `/warehouse-process/repair/${res.data.id}`,
                    query: {
                        status: res.data.status
                    }
                })
                showMessage(`${t('create_success')}`, 'success');
            }).catch((err) => {
                showMessage(`${err?.response?.data?.message[0].error}`, 'error');
            });
        }
    }

    const handleCancel = () => {
        router.push(`/warehouse-process/repair`)
    };

    const getData = () => {
        GetRepair({ id: router.query.id }).then((res) => {
            setData(res.data);
            router.push({
                pathname: `/warehouse-process/repair/${res.data.id}`,
                query: {
                    status: res.data.status
                }
            })
        }).catch((err) => {
            showMessage(`${err?.response?.data?.message}`, 'error');
        });
    }

    useEffect(() => {
        if (Number(router.query.id)) {
            getData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.query.id])

    useEffect(() => {
        setInitialValue({
            vehicleRegistrationNumber: data ? `${data?.vehicle?.registrationNumber}` : "",
            repairById: data ? {
                value: `${data?.repairBy?.id}`,
                label: `${data?.repairBy?.fullName}`
            } : "",
            description: data ? `${data?.description}` : "",
            damageLevel: data ? `${data?.damageLevel}` : "",
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

    return (
        <div className="p-5">
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
            <Formik
                initialValues={initialValue}
                validationSchema={SubmittedForm}
                onSubmit={values => {
                    handleRepair(values);
                }}
                enableReinitialize
            >

                {({ errors, values, setFieldValue }) => (
                    <Form className="space-y-5" >
                        <div className='flex justify-between gap-5'>
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
                                />
                                {errors.repairById ? (
                                    <div className="text-danger mt-1"> {`${errors.repairById}`} </div>
                                ) : null}
                            </div>
                            <div className="w-1/2">
                                <label htmlFor="type" className='label'> {t('vehicle_registration_number')} < span style={{ color: 'red' }}>* </span></label >
                                <Field autoComplete="off"
                                    name="vehicleRegistrationNumber"
                                    type="text"
                                    id="vehicleRegistrationNumber"
                                    placeholder={`${t('enter_type')}`}
                                    className="form-input"
                                />
                                {errors.vehicleRegistrationNumber ? (
                                    <div className="text-danger mt-1"> {`${errors.vehicleRegistrationNumber}`} </div>
                                ) : null}
                            </div>
                        </div>
                        <div className='flex justify-between gap-5'>
                            <div className="w-1/2">
                                <label htmlFor="description" className='label'> {t('description')}</label >
                                <Field autoComplete="off"
                                    name="description"
                                    as="textarea"
                                    id="description"
                                    placeholder={`${t('enter_description')}`}
                                    className="form-input"
                                />
                                {errors.description ? (
                                    <div className="text-danger mt-1"> {`${errors.description}`} </div>
                                ) : null}
                            </div>
                            <div className="w-1/2">
                                <label htmlFor="damageLevel" className='label'> {t('damage_level')} </label >
                                <Field autoComplete="off"
                                    name="damageLevel"
                                    as="textarea"
                                    id="damageLevel"
                                    className="form-input"
                                    placeholder={`${t('enter_damage_level')}`}
                                />
                                {errors.damageLevel ? (
                                    <div className="text-danger mt-1"> {`${errors.damageLevel}`} </div>
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

export default RepairForm;
