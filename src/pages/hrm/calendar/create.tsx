import IconX from '@/components/Icon/IconX';
import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import IconBack from '@/components/Icon/IconBack';
import Link from 'next/link';
import Select from 'react-select';
interface Props {
	[key: string]: any;
}
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
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
		user: new Yup.ArraySchema().required(`${t('please_select_the_staff')}`),
		title: Yup.string().required(`${t('please_fill_title_work_schedule')}`),
		start: Yup.date().required(`${t('please_fill_work_start_date')}`),
		end: Yup.date().required(`${t('please_fill_work_end_date')}`),
	});
	const { isAddWorkScheduleModal, setIsAddWokScheduleModal, params, minStartDate, minEndDate, saveWorkSchedule, handleDelete } = props;
	return (

		<div className="p-5">
			<div className='flex justify-between header-page-bottom pb-4 mb-4'>
				<h1 className='page-title'>{t('add_calendar')}</h1>
				<Link href="/hrm/calendar">
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
					id: params ? `${params?.id}` : '',
					user: params ? `${params?.user}` : [],
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
				{({ errors, touched, submitCount, setFieldValue }) => (
					<Form className="space-y-5">
						<div className="mb-3 flex gap-2">

							<div className="flex-1">
								<label htmlFor="title">
									{t('calendar_title')}
									<span style={{ color: 'red' }}> *</span>
								</label>
								<Field name="title" type="text" id="title" placeholder={t('fill_calendar_title')} className="form-input" />
								{submitCount ? errors.title ? <div className="mt-1 text-danger"> {errors.title} </div> : null : ''}
							</div>
							<div className="flex-1">
								<label htmlFor="user">
									{t('participants')}
									<span style={{ color: 'red' }}> *</span>
								</label>

								<Select
									name="user"
									id='user'
									options={getEmployeeOptions()}
									isMulti
									isSearchable
									placeholder={`${t('choose_participants')}`}
									onChange={e => {
										setFieldValue('user', e)
									}}
								/>


								{/* <Field as="select" name="user" id="user" className="form-input"
                                                    isMultiple="true"
                                                    placeholder="test">
														{getEmployeeOptions().map((employee) => (
															<option key={employee.value} value={employee.value}>
																{employee.label}
															</option>
														))}
													</Field> */}
								{submitCount ? errors.user ? <div className="mt-1 text-danger"> {errors.user} </div> : null : ''}
							</div>
						</div>

						<div className="mb-3 flex gap-2">
							<div className='flex-1'>
								<label htmlFor="dateStart">
									{t('from_time')}<span style={{ color: 'red' }}>* </span>
								</label>
								<Flatpickr
									options={{
										enableTime: true,
										dateFormat: "d-m-Y H:i",
										time_24hr: true

									}}

									className="form-input calender-input"
								/>
								{submitCount ? errors.start ? <div className="mt-1 text-danger"> {errors.start} </div> : null : ''}
							</div>
							<div className='flex-1'>
								<label htmlFor="dateEnd">
									{t('end_time')} <span style={{ color: 'red' }}>* </span>
								</label>
								<Flatpickr
									options={{
										enableTime: true,
										dateFormat: "d-m-Y H:i",
										time_24hr: true

									}}

									className="form-input calender-input"
								/>
								{submitCount ? errors.end ? <div className="mt-1 text-danger"> {errors.end} </div> : null : ''}
							</div>
						</div>

						<div className="mb-3">
							<label htmlFor="description">{t('discription')}</label>
							<Field id="description" as="textarea" rows="2" name="description" className="form-input" placeholder={t('fill_work_schedule_description')} />
						</div>
						<div>
							<label>{t('level')}</label>
							<div className="mt-3">
								<label className="inline-flex cursor-pointer ltr:mr-3 rtl:ml-3">
									<Field type="radio" name="type" value="primary" className="form-radio" />
									<span className="ltr:pl-2 rtl:pr-2">{t('less_important')}</span>
								</label>
								<label className="inline-flex cursor-pointer ltr:mr-3 rtl:ml-3">
									<Field type="radio" name="type" value="info" className="form-radio text-info" />
									<span className="ltr:pl-2 rtl:pr-2">{t('normal')}</span>
								</label>
								<label className="inline-flex cursor-pointer ltr:mr-3 rtl:ml-3">
									<Field type="radio" name="type" value="success" className="form-radio text-success" />
									<span className="ltr:pl-2 rtl:pr-2">{t('important')}</span>
								</label>
								<label className="inline-flex cursor-pointer">
									<Field type="radio" name="type" value="danger" className="form-radio text-danger" />
									<span className="ltr:pl-2 rtl:pr-2">{t('priority')}</span>
								</label>
							</div>
							<div className="!mt-8 flex items-center justify-end">
								<button type="button" className="btn cancel-button">
									{t('cancel')}
								</button>
								{params?.id && (
									<button type="button" className="btn btn-outline-warning ltr:ml-4 rtl:mr-4" onClick={() => handleDelete(params)}>
										{t('delete')}
									</button>
								)}
								<button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4 add-button">
									{params?.id ? t('update') : t('add')}
								</button>
							</div>
						</div>
					</Form>
				)}
			</Formik>
		</div>

	);
};

export default AddWorkScheduleModal;
