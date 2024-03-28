import { useEffect, Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { Dialog, Transition } from '@headlessui/react';
import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import Swal from 'sweetalert2';
import { showMessage } from '@/@core/utils';
import IconBack from '@/components/Icon/IconBack';
import Select from "react-select";
import { createPosition } from '@/services/apis/position.api';
import { createGroupPositon } from '@/services/apis/group-position.api';
interface Props {
    [key: string]: any;
}
const AddNewGroupPositon = ({ ...props }: Props) => {

    const { t } = useTranslation();
    const [disabled, setDisabled] = useState(false);

    const SubmittedForm = Yup.object().shape({
        name: Yup.string().min(2, 'Too Short!').required(`${t('please_fill_group_position')}`)
    });

    const handleDuty = (value: any) => {
        createGroupPositon(value).then(() => {
                showMessage(`${t('create_group_position_success')}`, 'success');
            }).catch((err) => {
                showMessage(`${t('create_group_position_error')}`, 'error');
            });
    }

    const handleCancel = () => {
        props.setOpenModal(false);
        props.setData(undefined);
    };
    return (
        <div className="p-5">
            <div className='flex justify-between header-page-bottom pb-4 mb-4'>
                <h1 className='page-title'>{t('add_duty')}</h1>
                <Link href="/hrm/group-position">
                    <button type="button" className="btn btn-primary btn-sm m-1 back-button" >
                        <IconBack className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                        <span>
                            {t('back')}
                        </span>
                    </button>
                </Link>
            </div>
                <Formik
                    initialValues={
                        {
                            name: props?.data ? `${props?.data?.name}` : "",
                            description: props?.data ? `${props?.data?.description}` : ""
                        }
                    }
                    validationSchema={SubmittedForm}
                    onSubmit={(values) => {
                        handleDuty(values);
                    }}
                >

                    {({ errors, touched, submitCount, setFieldValue }) => (
                        <Form className="space-y-5" >
                            <div className="mb-5">
                                <label htmlFor="name" className='label'>
                                        {' '}
                                        {t('name_group_position')} <span style={{ color: 'red' }}>* </span>
                                    </label>
                                      <Field autoComplete="off" name="name" type="text" id="name" placeholder={`${t('enter_group_position')}`} className="form-input" />
                                    {submitCount ? errors.name ? <div className="mt-1 text-danger"> {errors.name} </div> : null : ''}
                                </div>       
                            <div className="mb-5">
                                <label htmlFor="description" className='label'> {t('description')}</label >
                                <Field autoComplete="off" name="description" as="textarea" id="description" placeholder={`${t('description')}`} className="form-input" />
                            </div>
                            <div className="mt-8 flex items-center justify-end ltr:text-right rtl:text-left gap-8">
                            <button type="button" className="btn btn-outline-dark cancel-button" onClick={() => handleCancel()}>
                                {t('cancel')}
                            </button>
                            <button type="submit" className="btn :ml-4 rtl:mr-4 add-button" disabled={disabled}>
                                {props.data !== undefined ? t('update') : t('add')}
                            </button>

                        </div>
                        </Form>
                    )}
                </Formik>

        </div>
    );
};

export default AddNewGroupPositon;
