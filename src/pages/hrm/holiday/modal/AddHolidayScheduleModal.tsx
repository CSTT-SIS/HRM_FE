import IconX from '@/components/Icon/IconX';
import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import { data_holiday_schedule } from '../data';

interface Props {
	[key: string]: any;
}

const getEmployeeOptions = () => {
	return data_holiday_schedule.map((work) => ({
		value: work.user,
		label: work.user,
	}));
};

const AddWorkScheduleModal = ({ ...props }: Props) => {
	const { t } = useTranslation();
	const SubmittedForm = Yup.object().shape({
		user: Yup.string().required(`${t('please_select_the_staff')}`),
		title: Yup.string().required(`${t('please_fill_title_holiday_schedule')}`),
		start: Yup.date().required(`${t('please_fill_holiday_start_date')}`),
		end: Yup.date().required(`${t('please_fill_holiday_end_date')}`),
	});
	const { isAddHolidayScheduleModal, setIsAddHolidayScheduleModal, params, minStartDate, minEndDate, saveHolidaySchedule, handleDelete } = props;
	return (
		<Transition appear show={isAddHolidayScheduleModal} as={Fragment}>
			<Dialog as="div" onClose={() => setIsAddHolidayScheduleModal(false)} open={isAddHolidayScheduleModal} className="relative z-50">
				<Transition.Child as={Fragment} enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
					<Dialog.Overlay className="fixed inset-0 bg-[black]/60" />
				</Transition.Child>

				<div className="fixed inset-0 overflow-y-auto">
					<div className="flex min-h-full items-center justify-center px-4 py-8">
						<Transition.Child
							as={Fragment}
							enter="duration-300 ease-out"
							enter-from="opacity-0 scale-95"
							enter-to="opacity-100 scale-100"
							leave="duration-200 ease-in"
							leave-from="opacity-100 scale-100"
							leave-to="opacity-0 scale-95"
						>
							<Dialog.Panel className="panel w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
								<button
									type="button"
									className="absolute top-4 text-gray-400 outline-none hover:text-gray-800 ltr:right-4 rtl:left-4 dark:hover:text-gray-600"
									onClick={() => setIsAddHolidayScheduleModal(false)}
								>
									<IconX />
								</button>
								<div className="bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5 dark:bg-[#121c2c]">
									{params.id ? 'Sửa lịch nghỉ lễ' : 'Thêm lịch nghỉ lễ'}
								</div>
								<div className="p-5">
									<Formik
										initialValues={{
											id: params ? `${params?.id}` : '',
											user: params ? `${params?.user}` : '',
											title: params ? `${params?.title}` : '',
											start: params ? `${params?.start}` : '',
											end: params ? `${params?.end}` : '',
											description: params ? `${params?.description}` : '',
										}}
										validationSchema={SubmittedForm}
										onSubmit={(values) => {
											saveHolidaySchedule(values);
										}}
									>
										{({ errors, touched }) => (
											<Form className="space-y-5">
												<div className="mb-3">
													<label htmlFor="user">
														Nhân viên
														<span style={{ color: 'red' }}> *</span>
													</label>
													<Field as="select" name="user" id="user" className="form-input">
														<option value="">Chọn nhân viên</option>
														{getEmployeeOptions().map((employee) => (
															<option key={employee.value} value={employee.value}>
																{employee.label}
															</option>
														))}
													</Field>
													{errors.user ? <div className="mt-1 text-danger"> {errors.user} </div> : null}
												</div>
												<div className="mb-3">
													<label htmlFor="title">
														Tiêu đề lịch nghỉ lễ
														<span style={{ color: 'red' }}> *</span>
													</label>
													<Field name="title" type="text" id="title" placeholder="Nhập tiêu đề lịch nghỉ lễ" className="form-input" />
													{errors.title ? <div className="mt-1 text-danger"> {errors.title} </div> : null}
												</div>
												<div className="mb-3">
													<label htmlFor="dateStart">
														Thời gian bắt đầu <span style={{ color: 'red' }}>* </span>
													</label>
													<Field id="start" type="datetime-local" name="start" className="form-input" placeholder="Thời gian bắt đầu" min={minStartDate} />
													{errors.start ? <div className="mt-1 text-danger"> {errors.start} </div> : null}
												</div>
												<div className="mb-3">
													<label htmlFor="dateEnd">
														Thời gian kết thúc <span style={{ color: 'red' }}>* </span>
													</label>
													<Field id="end" type="datetime-local" name="end" className="form-input" placeholder="Thời gian kết thúc" min={minEndDate} />
													{errors.end ? <div className="mt-1 text-danger"> {errors.end} </div> : null}
												</div>
												<div className="mb-3">
													<label htmlFor="description">Mô tả ngày lễ</label>
													<Field id="description" as="textarea" rows="5" name="description" className="form-input" placeholder="Nhập mô tả ngày lễ" />
												</div>
												<div>
													<div className="!mt-8 flex items-center justify-end">
														<button type="button" className="btn btn-outline-danger" onClick={() => setIsAddHolidayScheduleModal(false)}>
															Cancel
														</button>
														{params.id && (
															<button type="button" className="btn btn-outline-warning ltr:ml-4 rtl:mr-4" onClick={() => handleDelete(params)}>
																Remove
															</button>
														)}
														<button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4">
															{params.id ? 'Update' : 'Create'}
														</button>
													</div>
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

export default AddWorkScheduleModal;
