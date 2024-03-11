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
		<Transition appear show={props.openModal ?? false} as={Fragment}>
			<Dialog as="div" open={props.openModal} onClose={() => props.setOpenModal(false)} className="relative z-50 w-1/2">
				<Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
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
							<Dialog.Panel className="panel w-full overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark" style={{maxWidth: "45rem"}}>
								<button
									type="button"
									onClick={() => handleCancel()}
									className="absolute top-4 text-gray-400 outline-none hover:text-gray-800 ltr:right-4 rtl:left-4 dark:hover:text-gray-600"
								>
									<IconX />
								</button>
								<div className="bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5 dark:bg-[#121c2c]">
									{props.data !== undefined ? `${t('edit_exempt_form')}` : `${t('add_exempt_form')}`}
								</div>
								<div className="p-5">
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
										{({ errors, touched }) => (
											<Form className="space-y-5">
                                                <div className='flex justify-between gap-5'>
                                                <div className="mb-5 w-1/2">
													<label htmlFor="name">
														{' '}
														{t('name')} <span style={{ color: 'red' }}>* </span>
													</label>
													<Field name="name" type="text" id="name" placeholder={`${t('choose_name')}`} className="form-input" />
													{errors.name ? <div className="mt-1 text-danger"> {errors.name} </div> : null}
												</div>
												<div className="mb-5 w-1/2">
													<label htmlFor="position">
														{' '}
														{t('position')} <span style={{ color: 'red' }}>* </span>
													</label>
                                                    <Field
                                                        name="position"
                                                        render={({ field }: any) => (
                                                            <>
                                                                <Select
                                                                    {...field}
                                                                    // options={dutyList}
                                                                    isSearchable
                                                                    placeholder={`${t('choose_position')}`}
                                                                    />

                                                                </>
                                                            )}
                                                        />
                                                        {errors.position ? <div className="mt-1 text-danger"> {errors.department} </div> : null}
												</div>
                                                </div>
                                                <div className='flex justify-between gap-5'>

                                                <div className="mb-5 w-1/2">
													<label htmlFor="department">
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
                                                        {errors.department ? <div className="mt-1 text-danger"> {errors.department} </div> : null}
												</div>
                                                <div className="mb-5 w-1/2">
													<label htmlFor="submitday">
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
                                                        {errors.submitday ? <div className="mt-1 text-danger"> {errors.submitday} </div> : null}
												</div>
                                                </div>
                                                <div className='flex justify-between gap-5'>
                                                <div className="mb-5 w-1/2">
													<label htmlFor="fromdate">
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
                                                        {errors.fromdate ? <div className="mt-1 text-danger"> {errors.fromdate} </div> : null}
												</div>
                                                <div className="mb-5 w-1/2">
													<label htmlFor="enddate">
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
                                                        {errors.enddate ? <div className="mt-1 text-danger"> {errors.enddate} </div> : null}
												</div>
                                                </div>
                                                <div className='flex justify-between gap-5'>
                                                <div className="mb-5 w-1/2">
													<label htmlFor="shift">
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
                                                        {errors.shift ? <div className="mt-1 text-danger"> {errors.shift} </div> : null}
												</div>
                                                <div className="mb-5 w-1/2">
													<label htmlFor="reason">
														{' '}
														{t('reason')} <span style={{ color: 'red' }}>* </span>
													</label>
													<Field name="reason" as="textarea" id="reason" placeholder={`${t('fill_reason')}`} className="form-input" />
													{errors.reason ? <div className="mt-1 text-danger"> {errors.reason} </div> : null}
												</div>
                                                </div>
												<div className="mt-8 flex items-center justify-end ltr:text-right rtl:text-left">
													<button type="button" className="btn btn-outline-danger" onClick={() => handleCancel()}>
														{t('cancel')}
													</button>
													<button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4" disabled={disabled}>
														{props.data !== undefined ? `${t('update')}` : `${t('add')}`}
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

export default ExemptFormModal;
