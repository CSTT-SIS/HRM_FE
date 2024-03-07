import { useEffect, Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog, Transition } from '@headlessui/react';

import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import Swal from 'sweetalert2';
import { showMessage } from '@/@core/utils';
import IconX from '@/components/Icon/IconX';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Select from 'react-select';
import Link from 'next/link';
import IconArrowBackward from '@/components/Icon/IconArrowBackward';
import IconBack from '@/components/Icon/IconBack';
// import dutyList from '../../duty/duty_list.json';

interface Props {
	[key: string]: any;
}

const ExemptFormModal = ({ ...props }: Props) => {
	const { t } = useTranslation();
	const [disabled, setDisabled] = useState(false);

	const SubmittedForm = Yup.object().shape({
		name: Yup.object()
			.typeError(`${t('please_choose_name')}`),
        position: Yup.object()
            .typeError(`${t('please_choose_position')}`),
        department: Yup.object()
            .typeError(`${t('please_choose_department')}`),
        submitday: Yup.date().typeError(`${t('please_choose_submit_day')}`),
        fromdate: Yup.date().typeError(`${t('please_choose_from_day')}`),
        enddate: Yup.date().typeError(`${t('please_choose_end_day')}`),
        shift: Yup.date().typeError(`${t('please_choose_shift')}`),
        reason: Yup.string().required(`${t('please_fill_reason')}`)
	});

	const handleDepartment = (value: any) => {
		if (props?.data) {
			const reNew = props.totalData.filter((item: any) => item.id !== props.data.id);
			reNew.push({
				id: props.data.id,
				name: value.name,
				code: value.code,
			});
			localStorage.setItem('departmentList', JSON.stringify(reNew));
			props.setGetStorge(reNew);
			props.setOpenModal(false);
			props.setData(undefined);
			showMessage(`${t('edit_department_success')}`, 'success');
		} else {
			const reNew = props.totalData;
			reNew.push({
				id: Number(props?.totalData[props?.totalData?.length - 1].id) + 1,
				name: value.name,
				code: value.code,
				status: value.status,
			});
			localStorage.setItem('departmentList', JSON.stringify(reNew));
			props.setGetStorge(props.totalData);
			props.setOpenModal(false);
			props.setData(undefined);
			showMessage(`${t('add_department_success')}`, 'success');
		}
	};

	const handleCancel = () => {
		props.setOpenModal(false);
		props.setData(undefined);
	};
	return (

								<div className="p-5">
                                    <div className='flex justify-between header-page-bottom pb-4 mb-4'>
                <h1 className='page-title'>{t('add_exempt_form')}</h1>
                <Link href="/hrm/exempt-form">
                    <button type="button" className="btn btn-primary btn-sm m-1 back-button" >
                        <IconBack className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                        <span>
                            {t('back')}
                        </span>
                    </button>
                </Link>
            </div>
									<Formik
										initialValues={{
											name: props?.data ? `${props?.data?.name}` : '',
											code: props?.data ? `${props?.data?.code}` : '',
                                            position: props?.data ? `${props?.data?.position}` : '',
                                            department: props?.data ? `${props?.data?.department}` : '',
                                            submitday: props?.data ? `${props?.data?.submitday}` : '',
                                            fromdate: props?.data ? `${props?.data?.fromdate}` : '',
                                            enddate: props?.data ? `${props?.data?.enddate}` : '',
                                            shift: props?.data ? `${props?.data?.shift}` : '',
                                            reason: props?.data ? `${props?.data?.reason}` : ''
										}}
										validationSchema={SubmittedForm}
										onSubmit={(values) => {
											handleDepartment(values);
										}}
									>
										{({ errors, touched, submitCount }) => (
											<Form className="space-y-5">
                                                <div className='flex justify-between gap-5'>
                                                <div className="mb-5 w-1/2">
													<label className="label" htmlFor="name">
														{' '}
														{t('name')} <span style={{ color: 'red' }}>* </span>
													</label>
													<Field name="name" type="text" id="name" placeholder={`${t('choose_name')}`} className="form-input" />
													{submitCount ? errors.name ? <div className="mt-1 text-danger"> {errors.name} </div> : null : ''}
												</div>
												<div className="mb-5 w-1/2">
													<label className="label" htmlFor="position">
														{' '}
														{t('position')} <span style={{ color: 'red' }}>* </span>
													</label>
                                                    <Field
                                                        name="position"
                                                        render={({ field }: any) => (
                                                            <>
                                                                <Select
                                                                    {...field}
                                                                    isSearchable
                                                                    placeholder={`${t('choose_position')}`}
                                                                    />

                                                                </>
                                                            )}
                                                        />
                                                        {submitCount ? errors.position ? <div className="mt-1 text-danger"> {errors.position} </div> : null : ''}
												</div>
                                                </div>
                                                <div className='flex justify-between gap-5'>

                                                <div className="mb-5 w-1/2">
													<label className="label" htmlFor="department">
														{' '}
														{t('department')} <span style={{ color: 'red' }}>* </span>
													</label>
                                                    <Field
                                                        name="department"
                                                        render={({ field }: any) => (
                                                            <>
                                                                <Select
                                                                    {...field}
                                                                    // options={dutyList}
                                                                    isSearchable
                                                                    placeholder={`${t('choose_department')}`}
                                                                    />

                                                                </>
                                                            )}
                                                        />
                                                         {submitCount ? errors.department ? <div className="mt-1 text-danger"> {errors.department} </div> : null : ''}
												</div>
                                                <div className="mb-5 w-1/2">
													<label className="label" htmlFor="submitday">
														{' '}
														{t('submitday')} <span style={{ color: 'red' }}>* </span>
													</label>
                                                    <Field
                                                            name="submitday"
                                                            render={({ field }: any) => (
                                                                <Flatpickr
                                                                    data-enable-time
                                                                    placeholder={`${t('choose_submit_day')}`}
                                                                    options={{
                                                                        enableTime: true,
                                                                        dateFormat: 'Y-m-d H:i'
                                                                    }}
                                                                    className="form-input"
                                                                />
                                                            )}
                                                        />
                                                         {submitCount ? errors.submitday ? <div className="mt-1 text-danger"> {errors.submitday} </div> : null : ''}
												</div>
                                                </div>
                                                <div className='flex justify-between gap-5'>
                                                <div className="mb-5 w-1/2">
													<label className="label" htmlFor="fromdate">
														{' '}
														{t('from_date')} <span style={{ color: 'red' }}>* </span>
													</label>
                                                    <Field
                                                            name="from_date"
                                                            render={({ field }: any) => (
                                                                <Flatpickr
                                                                    data-enable-time
                                                                    placeholder={`${t('choose_from_day')}`}
                                                                    options={{
                                                                        enableTime: true,
                                                                        dateFormat: 'Y-m-d H:i'
                                                                    }}
                                                                    className="form-input"
                                                                />
                                                            )}
                                                        />
                                                         {submitCount ? errors.fromdate ? <div className="mt-1 text-danger"> {errors.fromdate} </div> : null : ''}
												</div>
                                                <div className="mb-5 w-1/2">
													<label className="label" htmlFor="enddate">
														{' '}
														{t('end_date')} <span style={{ color: 'red' }}>* </span>
													</label>
                                                    <Field
                                                            name="end_date"
                                                            render={({ field }: any) => (
                                                                <Flatpickr
                                                                    data-enable-time
                                                                    placeholder={`${t('choose_end_day')}`}
                                                                    options={{
                                                                        enableTime: true,
                                                                        dateFormat: 'Y-m-d H:i'
                                                                    }}
                                                                    className="form-input"
                                                                />
                                                            )}
                                                        />
                                                         {submitCount ? errors.enddate ? <div className="mt-1 text-danger"> {errors.enddate} </div> : null : ''}

												</div>
                                                </div>
                                                <div className='flex justify-between gap-5'>
                                                <div className="mb-5 w-1/2">
													<label className="label" htmlFor="shift">
														{' '}
														{t('shift')} <span style={{ color: 'red' }}>* </span>
													</label>
                                                    <Field
                                                        name="shift"
                                                        render={({ field }: any) => (
                                                            <>
                                                                <Select
                                                                    {...field}
                                                                    // options={dutyList}
                                                                    isSearchable
                                                                    placeholder={`${t('choose_shift')}`}
                                                                    />

                                                                </>
                                                            )}
                                                        />
                                                                                                                 {submitCount ? errors.shift ? <div className="mt-1 text-danger"> {errors.shift} </div> : null : ''}

												</div>
                                                <div className="mb-5 w-1/2">
													<label className="label" htmlFor="reason">
														{' '}
														{t('reason')} <span style={{ color: 'red' }}>* </span>
													</label>
													<Field name="reason" type="text" id="reason" placeholder={`${t('fill_reason')}`} className="form-input" />
                                                    {submitCount ? errors.reason ? <div className="mt-1 text-danger"> {errors.reason} </div> : null : ''}
												</div>
                                                </div>
												<div className="mt-8 flex items-center justify-end ltr:text-right rtl:text-left gap-8">
                            <button type="button" className="btn btn-outline-dark cancel-button" onClick={() => handleCancel()}>
                                {t('cancel')}
                            </button>
                            <button type="submit" className="btn :ml-4 rtl:mr-4 add-button" disabled={disabled}>
                                {t('add')}
                            </button>
                        </div>
											</Form>
										)}
									</Formik>
								</div>

	);
};

export default ExemptFormModal;
