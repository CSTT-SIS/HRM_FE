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

const ShiftModal = ({ ...props }: Props) => {
	const { t } = useTranslation();
	const [disabled, setDisabled] = useState(false);

	const SubmittedForm = Yup.object().shape({
		name_shift: Yup.object()
			.typeError(`${t('please_fill_name_shift')}`),
        type_shift: Yup.object()
            .typeError(`${t('please_choose_type_shift')}`),
        department_apply: Yup.object()
            .typeError(`${t('please_choose_department_apply')}`),
        time: Yup.date().typeError(`${t('please_choose_from_day')}`),
        from_time: Yup.date().typeError(`${t('please_fill_from_time')}`),
        end_time: Yup.date().typeError(`${t('please_fill_end_time')}`),
        alo: Yup.string().required('alo')
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
									{props.data !== undefined ? `${t('edit_shift')}` : `${t('add_shift')}`}
								</div>
								<div className="p-5">
									<Formik
										initialValues={{
											name_shift: props?.data ? `${props?.data?.name_shift}` : '',
											type_shift: props?.data ? `${props?.data?.type_shift}` : '',
                                            department_apply: props?.data ? `${props?.data?.department_apply}` : '',
                                            from_time: props?.data ? `${props?.data?.from_time}` : '',
                                            end_time: props?.data ? `${props?.data?.end_time}` : '',
                                            time: props?.data ? `${props?.data?.time}` : '',
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
													<label htmlFor="name_shift">
														{' '}
														{t('name_shift')} <span style={{ color: 'red' }}>* </span>
													</label>
													<Field name="name_shift" type="text" id="name_shift" placeholder={`${t('fill_name_shift')}`} className="form-input" />
													{errors.name_shift ? <div className="mt-1 text-danger"> {errors.name_shift} </div> : null}
												</div>
                                                <div className="mb-5 w-1/2">
													<label htmlFor="type_shift">
														{' '}
														{t('type_shift')} <span style={{ color: 'red' }}>* </span>
													</label>
													<Field name="type_shift" type="text" id="type_shift" placeholder={`${t('choose_type_shift')}`} className="form-input" />
													{errors.type_shift ? <div className="mt-1 text-danger"> {errors.type_shift} </div> : null}
												</div>
                                                </div>
                                                <div className='flex justify-between gap-5'>
                                                <div className="mb-5 w-1/2">
													<label htmlFor="from_time">
														{' '}
														{t('from_time')} <span style={{ color: 'red' }}>* </span>
													</label>
                                                    <Field
                                                            name="from_time"
                                                            render={({ field }: any) => (
                                                                <Flatpickr
                                                                    data-enable-time
                                                                    placeholder={`${t('choose_from_time')}`}
                                                                    options={{
                                                                        enableTime: true,
                                                                        dateFormat: 'H:i'
                                                                    }}
                                                                    className="form-input"
                                                                />
                                                            )}
                                                        />
                                                        {errors.from_time ? <div className="mt-1 text-danger"> {errors.from_time} </div> : null}
												</div>
                                                <div className="mb-5 w-1/2">
													<label htmlFor="end_time">
														{' '}
														{t('end_time')} <span style={{ color: 'red' }}>* </span>
													</label>
                                                    <Field
                                                            name="end_time"
                                                            render={({ field }: any) => (
                                                                <Flatpickr
                                                                    data-enable-time
                                                                    placeholder={`${t('choose_end_time')}`}
                                                                    options={{
                                                                        enableTime: true,
                                                                        dateFormat: 'Y-m-d H:i'
                                                                    }}
                                                                    className="form-input"
                                                                />
                                                            )}
                                                        />
                                                        {errors.end_time ? <div className="mt-1 text-danger"> {errors.end_time} </div> : null}
												</div>
                                                </div>
                                                <div className='flex justify-between gap-5'>
                                                <div className="mb-5 w-1/2">
													<label htmlFor="department_apply">
														{' '}
														{t('department_apply')} <span style={{ color: 'red' }}>* </span>
													</label>
                                                    <Field
                                                        name="department_apply"
                                                        render={({ field }: any) => (
                                                            <>
                                                                <Select
                                                                    {...field}
                                                                    // options={dutyList}
                                                                    isSearchable
                                                                    placeholder={`${t('choose_department_apply')}`}
                                                                    />
                                                                </>
                                                            )}
                                                        />
                                                        {errors.department_apply ? <div className="mt-1 text-danger"> {errors.department_apply} </div> : null}
												</div>
                                                <div className="mb-5 w-1/2">
													<label htmlFor="time">
														{' '}
														{t('time_shift')} <span style={{ color: 'red' }}>* </span>
													</label>
													<Field disabled name="time" type="text" id="time" placeholder="" className="form-input" />
													{errors.time ? <div className="mt-1 text-danger"> {errors.time} </div> : null}
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

export default ShiftModal;
