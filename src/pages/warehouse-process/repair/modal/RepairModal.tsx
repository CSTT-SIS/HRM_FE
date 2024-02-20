import { useEffect, Fragment, useState, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog, Transition } from '@headlessui/react';

import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import { showMessage } from '@/@core/utils';
import IconX from '@/components/Icon/IconX';
import { useRouter } from 'next/router';
import Select, { components } from 'react-select';
import { DropdownUsers } from '@/services/swr/dropdown.twr';
import { CreateRepair, EditRepair } from '@/services/apis/repair.api';

interface Props {
    [key: string]: any;
}

const RepairModal = ({ ...props }: Props) => {

    const { t } = useTranslation();
    const router = useRouter();
    const [initialValue, setInitialValue] = useState<any>();
    const [dataUserDropdown, setDataUserDropdown] = useState<any>([]);
    const [page, setPage] = useState(1);

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
        if (props?.data) {
            EditRepair({ id: props?.data?.id, ...query }).then(() => {
                props.repairMutate();
                handleCancel();
                showMessage(`${t('edit_success')}`, 'success');
            }).catch((err) => {
                showMessage(`${err?.response?.data?.message}`, 'error');
            });
        } else {
            CreateRepair(query).then(() => {
                props.repairMutate();
                handleCancel();
                showMessage(`${t('create_success')}`, 'success');
            }).catch((err) => {
                showMessage(`${err?.response?.data?.message[0].error}`, 'error');
            });
        }
    }

    const handleCancel = () => {
        props.setOpenModal(false);
        props.setData();
        setInitialValue({});
    };

    useEffect(() => {
        setInitialValue({
            vehicleRegistrationNumber: props?.data ? `${props?.data?.vehicle?.registrationNumber}` : "",
            repairById: props?.data ? {
                value: `${props?.data?.repairBy?.id}`,
                label: `${props?.data?.repairBy?.fullName}`
            } : "",
            description: props?.data ? `${props?.data?.description}` : "",
            damageLevel: props?.data ? `${props?.data?.damageLevel}` : "",
        })
    }, [props?.data, router]);


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
                                    {t('repair')}
                                </div>
                                <div className="p-5">
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
                                                <div className="mb-5 flex justify-between gap-4">
                                                    <div className="flex-1">
                                                        <label htmlFor="repairById" > {t('repair_by_id')} < span style={{ color: 'red' }}>* </span></label >
                                                        <Select
                                                            id='repairById'
                                                            name='repairById'
                                                            options={dataUserDropdown}
                                                            maxMenuHeight={160}
                                                            value={values.repairById}
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
                                                </div>
                                                <div className="mb-5">
                                                    <label htmlFor="type" > {t('vehicle_registration_number')} < span style={{ color: 'red' }}>* </span></label >
                                                    <Field
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
                                                <div className="mb-5">
                                                    <label htmlFor="description" > {t('description')}</label >
                                                    <Field
                                                        name="description"
                                                        type="text"
                                                        id="description"
                                                        placeholder={`${t('enter_description')}`}
                                                        className="form-input"
                                                    />
                                                    {errors.description ? (
                                                        <div className="text-danger mt-1"> {`${errors.description}`} </div>
                                                    ) : null}
                                                </div>
                                                <div className="mb-5">
                                                    <label htmlFor="damageLevel" > {t('damage_level')} </label >
                                                    <Field
                                                        name="damageLevel"
                                                        type="text"
                                                        id="damageLevel"
                                                        className="form-input"
                                                        placeholder={`${t('enter_damage_level')}`}
                                                    />
                                                    {errors.damageLevel ? (
                                                        <div className="text-danger mt-1"> {`${errors.damageLevel}`} </div>
                                                    ) : null}
                                                </div>
                                                <div className="mt-8 flex items-center justify-end ltr:text-right rtl:text-left">
                                                    <button type="button" className="btn btn-outline-danger" onClick={() => handleCancel()}>
                                                       {t('cancel')}
                                                    </button>
                                                    <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                                        {props.data !== undefined ? t('update') : t('add')}
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

export default RepairModal;
