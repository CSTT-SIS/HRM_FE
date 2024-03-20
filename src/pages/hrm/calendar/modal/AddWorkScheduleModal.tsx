import IconX from '@/components/Icon/IconX';
import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';

interface Props {
	[key: string]: any;
}

//FAKE DATA
const getEmployeeOptions = () => {
	const now = new Date();
	const getMonth = (dt: Date, add: number = 0) => {
		let month = dt.getMonth() + 1 + add;
		const str = (month < 10 ? '0' + month : month).toString();
		return str;
		// return dt.getMonth() < 10 ? '0' + month : month;
	};
	return [
		{
			id: 1,
			user: 'Bountafaibounnheuang',
			title: 'Công việc 1',
			start: now.getFullYear() + '-' + getMonth(now) + '-01T14:30:00',
			end: now.getFullYear() + '-' + getMonth(now) + '-01T15:30:00',
			className: 'danger',
			description: 'Aenean fermentum quam vel sapien rutrum cursus. Vestibulum imperdiet finibus odio, nec tincidunt felis facilisis eu.',
		},
		{
			id: 2,
			user: 'Khampa Sirt',
			title: 'Công việc 2',
			start: now.getFullYear() + '-' + getMonth(now) + '-07T19:30:00',
			end: now.getFullYear() + '-' + getMonth(now) + '-08T14:30:00',
			className: 'primary',
			description: 'Etiam a odio eget enim aliquet laoreet. Vivamus auctor nunc ultrices varius lobortis.',
		},
		{
			id: 3,
			user: 'Xaypayou',
			title: 'Công việc 3',
			start: now.getFullYear() + '-' + getMonth(now) + '-17T14:30:00',
			end: now.getFullYear() + '-' + getMonth(now) + '-18T14:30:00',
			className: 'info',
			description: 'Proin et consectetur nibh. Mauris et mollis purus. Ut nec tincidunt lacus. Nam at rutrum justo, vitae egestas dolor.',
		},
		{
			id: 4,
			user: 'Suok Thi Da',
			title: 'Công việc 4',
			start: now.getFullYear() + '-' + getMonth(now) + '-12T10:30:00',
			end: now.getFullYear() + '-' + getMonth(now) + '-13T10:30:00',
			className: 'danger',
			description: 'Mauris ut mauris aliquam, fringilla sapien et, dignissim nisl. Pellentesque ornare velit non mollis fringilla.',
		},
		{
			id: 5,
			user: 'Bount Yo',
			title: 'Công việc 5',
			start: now.getFullYear() + '-' + getMonth(now) + '-12T15:00:00',
			end: now.getFullYear() + '-' + getMonth(now) + '-13T15:00:00',
			className: 'info',
			description: 'Integer fermentum bibendum elit in egestas. Interdum et malesuada fames ac ante ipsum primis in faucibus.',
		},
		{
			id: 6,
			user: 'Khăm sa vẳn',
			title: 'Công việc 6',
			start: now.getFullYear() + '-' + getMonth(now) + '-12T21:30:00',
			end: now.getFullYear() + '-' + getMonth(now) + '-13T21:30:00',
			className: 'success',
			description:
				'Curabitur facilisis vel elit sed dapibus. Nunc sagittis ex nec ante facilisis, sed sodales purus rhoncus. Donec est sapien, porttitor et feugiat sed, eleifend quis sapien. Sed sit amet maximus dolor.',
		},
		{
			id: 7,
			user: 'Toukta',
			title: 'Công việc 7',
			start: now.getFullYear() + '-' + getMonth(now) + '-12T05:30:00',
			end: now.getFullYear() + '-' + getMonth(now) + '-13T05:30:00',
			className: 'info',
			description: ' odio lectus, porttitor molestie scelerisque blandit, hendrerit sed ex. Aenean malesuada iaculis erat, vitae blandit nisl accumsan ut.',
		},
		{
			id: 8,
			user: 'Phoutchana',
			title: 'Công việc 8',
			start: now.getFullYear() + '-' + getMonth(now) + '-12T20:00:00',
			end: now.getFullYear() + '-' + getMonth(now) + '-13T20:00:00',
			className: 'danger',
			description: 'Sed purus urn"a", aliquam et pharetra ut, efficitur id mi. Pellentesque ut convallis velit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
		},
		{
			id: 9,
			user: 'Sitthiphone',
			title: 'Công việc 9',
			start: now.getFullYear() + '-' + getMonth(now) + '-27T20:00:00',
			end: now.getFullYear() + '-' + getMonth(now) + '-28T20:00:00',
			className: 'success',
			description: 'Sed purus urn"a", aliquam et pharetra ut, efficitur id mi. Pellentesque ut convallis velit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
		},
		{
			id: 10,
			user: 'Khăm Pheng',
			title: 'Công việc 10',
			start: now.getFullYear() + '-' + getMonth(now, 1) + '-24T08:12:14',
			end: now.getFullYear() + '-' + getMonth(now, 1) + '-27T22:20:20',
			className: 'danger',
			description: 'Sed purus urn"a", aliquam et pharetra ut, efficitur id mi. Pellentesque ut convallis velit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
		},
		{
			id: 11,
			user: 'Vi lay phone',
			title: 'Công việc 11',
			start: now.getFullYear() + '-' + getMonth(now, -1) + '-13T08:12:14',
			end: now.getFullYear() + '-' + getMonth(now, -1) + '-16T22:20:20',
			className: 'primary',
			description: 'Pellentesque ut convallis velit. Sed purus urn"a", aliquam et pharetra ut, efficitur id mi. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
		},
		{
			id: 13,
			user: 'Seng phệt',
			title: 'Công việc 13',
			start: now.getFullYear() + '-' + getMonth(now, 1) + '-15T08:12:14',
			end: now.getFullYear() + '-' + getMonth(now, 1) + '-18T22:20:20',
			className: 'primary',
			description: 'Pellentesque ut convallis velit. Sed purus urn"a", aliquam et pharetra ut, efficitur id mi. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
		},
	].map((work) => ({
		value: work.user,
		label: work.user,
	}));
};

const AddWorkScheduleModal = ({ ...props }: Props) => {
	const { t } = useTranslation();
	const SubmittedForm = Yup.object().shape({
		user: Yup.string().required(`${t('please_select_the_staff')}`),
		title: Yup.string().required(`${t('please_fill_title_work_schedule')}`),
		start: Yup.date().required(`${t('please_fill_work_start_date')}`),
		end: Yup.date().required(`${t('please_fill_work_end_date')}`),
	});
	const { isAddWorkScheduleModal, setIsAddWokScheduleModal, params, minStartDate, minEndDate, saveWorkSchedule, handleDelete } = props;
	return (
		<Transition appear show={isAddWorkScheduleModal ?? false} as={Fragment}>
			<Dialog as="div" onClose={() => setIsAddWokScheduleModal(false)} open={isAddWorkScheduleModal} className="relative z-50">
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
									onClick={() => setIsAddWokScheduleModal(false)}
								>
									<IconX />
								</button>
								<div className="bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5 dark:bg-[#121c2c]">
									{params?.id ? 'Sửa lịch làm việc' : 'Thêm lịch làm việc'}
								</div>
								<div className="p-5">
									<Formik
										initialValues={{
											id: params ? `${params?.id}` : '',
											user: params ? `${params?.user}` : '',
											title: params ? `${params?.title}` : '',
											start: params ? `${params?.start}` : '',
											end: params ? `${params?.end}` : '',
											type: params ? `${params?.type}` : '',
											description: params ? `${params?.description}` : '',
										}}
										validationSchema={SubmittedForm}
										onSubmit={(values) => {
											saveWorkSchedule(values);
										}}
									>
										{({ errors, touched }) => (
											<Form className="space-y-5">
                                                <div className="mb-3">
													<label htmlFor="title">
														Tiêu đề lịch làm việc
														<span style={{ color: 'red' }}> *</span>
													</label>
													<Field autoComplete="off" name="title" type="text" id="title" placeholder="Nhập tiêu đề lịch công việc" className="form-input" />
													{errors.title ? <div className="mt-1 text-danger"> {errors.title} </div> : null}
												</div>
												<div className="mb-3">
													<label htmlFor="user">
														Người tham gia
														<span style={{ color: 'red' }}> *</span>
													</label>
													<Field autoComplete="off" as="select" name="user" id="user" className="form-input">
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
													<label htmlFor="dateStart">
														Thời gian bắt đầu <span style={{ color: 'red' }}>* </span>
													</label>
													<Field autoComplete="off" id="start" type="datetime-local" name="start" className="form-input" placeholder="Giờ bắt đầu" min={minStartDate} />
													{errors.start ? <div className="mt-1 text-danger"> {errors.start} </div> : null}
												</div>
												<div className="mb-3">
													<label htmlFor="dateEnd">
														Thời gian kết thúc <span style={{ color: 'red' }}>* </span>
													</label>
													<Field autoComplete="off" id="end" type="datetime-local" name="end" className="form-input" placeholder="Giờ kết thúc" min={minEndDate} />
													{errors.end ? <div className="mt-1 text-danger"> {errors.end} </div> : null}
												</div>
												<div className="mb-3">
													<label htmlFor="description">Mô tả</label>
													<Field autoComplete="off" id="description" as="textarea" rows="2" name="description" className="form-input" placeholder="Mô tả công việc" />
												</div>
												<div>
													<label>Mức độ:</label>
													<div className="mt-3">
														<label className="inline-flex cursor-pointer ltr:mr-3 rtl:ml-3">
															<Field autoComplete="off" type="radio" name="type" value="primary" className="form-radio" />
															<span className="ltr:pl-2 rtl:pr-2">Ít quan trọng</span>
														</label>
														<label className="inline-flex cursor-pointer ltr:mr-3 rtl:ml-3">
															<Field autoComplete="off" type="radio" name="type" value="info" className="form-radio text-info" />
															<span className="ltr:pl-2 rtl:pr-2">Bình thường</span>
														</label>
														<label className="inline-flex cursor-pointer ltr:mr-3 rtl:ml-3">
															<Field autoComplete="off" type="radio" name="type" value="success" className="form-radio text-success" />
															<span className="ltr:pl-2 rtl:pr-2">Quan trọng</span>
														</label>
														<label className="inline-flex cursor-pointer">
															<Field autoComplete="off" type="radio" name="type" value="danger" className="form-radio text-danger" />
															<span className="ltr:pl-2 rtl:pr-2">Ưu tiên cao</span>
														</label>
													</div>
													<div className="!mt-8 flex items-center justify-end">
														<button type="button" className="btn btn-outline-danger" onClick={() => setIsAddWokScheduleModal(false)}>
															Cancel
														</button>
														{params?.id && (
															<button type="button" className="btn btn-outline-warning ltr:ml-4 rtl:mr-4" onClick={() => handleDelete(params)}>
																Remove
															</button>
														)}
														<button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4">
															{params?.id ? 'Update' : 'Create'}
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
