import IconX from '@/components/Icon/IconX';
import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import IconBack from '@/components/Icon/IconBack';
import Link from 'next/link';
import Select from "react-select";
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
			title: 'Tết dương',
			start: now.getFullYear() + '-' + getMonth(now) + '-01T14:30:00',
			end: now.getFullYear() + '-' + getMonth(now) + '-01T15:30:00',
			// className: 'danger',
			description: 'Chi tiết về ngày lễ',
		},
		{
			id: 2,
			user: 'Khampa Sirt',
			title: 'Tết nguyên đán',
			start: now.getFullYear() + '-' + getMonth(now) + '-07T19:30:00',
			end: now.getFullYear() + '-' + getMonth(now) + '-08T14:30:00',
			// className: 'primary',
			description: 'Chi tiết về ngày lễ',
		},
		{
			id: 3,
			user: 'Xaypayou',
			title: 'Giỗ tổ',
			start: now.getFullYear() + '-' + getMonth(now) + '-17T14:30:00',
			end: now.getFullYear() + '-' + getMonth(now) + '-18T14:30:00',
			// className: 'info',
			description: 'Chi tiết về ngày lễ',
		},
		{
			id: 4,
			user: 'Suok Thi Da',
			title: 'Quốc khánh',
			start: now.getFullYear() + '-' + getMonth(now) + '-12T10:30:00',
			end: now.getFullYear() + '-' + getMonth(now) + '-13T10:30:00',
			// className: 'danger',
			description: 'Chi tiết về ngày lễ',
		},
		{
			id: 5,
			user: 'Bount Yo',
			title: 'Lễ 5',
			start: now.getFullYear() + '-' + getMonth(now) + '-12T15:00:00',
			end: now.getFullYear() + '-' + getMonth(now) + '-13T15:00:00',
			// className: 'info',
			description: 'Chi tiết về ngày lễ',
		},
		{
			id: 6,
			user: 'Khăm sa vẳn',
			title: 'Lễ 6',
			start: now.getFullYear() + '-' + getMonth(now) + '-12T21:30:00',
			end: now.getFullYear() + '-' + getMonth(now) + '-13T21:30:00',
			// className: 'success',
			description: 'Chi tiết về ngày lễ',
		},
		{
			id: 7,
			user: 'Toukta',
			title: 'Lễ 7',
			start: now.getFullYear() + '-' + getMonth(now) + '-12T05:30:00',
			end: now.getFullYear() + '-' + getMonth(now) + '-13T05:30:00',
			// className: 'info',
			description: 'Chi tiết về ngày lễ',
		},
		{
			id: 8,
			user: 'Phoutchana',
			title: 'Lễ 8',
			start: now.getFullYear() + '-' + getMonth(now) + '-12T20:00:00',
			end: now.getFullYear() + '-' + getMonth(now) + '-13T20:00:00',
			// className: 'danger',
			description: 'Chi tiết về ngày lễ',
		},
		{
			id: 9,
			user: 'Sitthiphone',
			title: 'Lễ 9',
			start: now.getFullYear() + '-' + getMonth(now) + '-27T20:00:00',
			end: now.getFullYear() + '-' + getMonth(now) + '-28T20:00:00',
			// className: 'success',
			description: 'Chi tiết về ngày lễ',
		},
		{
			id: 10,
			user: 'Khăm Pheng',
			title: 'Lễ 10',
			start: now.getFullYear() + '-' + getMonth(now, 1) + '-24T08:12:14',
			end: now.getFullYear() + '-' + getMonth(now, 1) + '-27T22:20:20',
			// className: 'danger',
			description: 'Chi tiết về ngày lễ',
		},
		{
			id: 11,
			user: 'Vi lay phone',
			title: 'Lễ 11',
			start: now.getFullYear() + '-' + getMonth(now, -1) + '-13T08:12:14',
			end: now.getFullYear() + '-' + getMonth(now, -1) + '-16T22:20:20',
			// className: 'primary',
			description: 'Chi tiết về ngày lễ',
		},
		{
			id: 13,
			user: 'Seng phệt',
			title: 'Lễ 13',
			start: now.getFullYear() + '-' + getMonth(now, 1) + '-15T08:12:14',
			end: now.getFullYear() + '-' + getMonth(now, 1) + '-18T22:20:20',
			// className: 'primary',
			description: 'Chi tiết về ngày lễ',
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
		title: Yup.string().required(`${t('please_fill_title_holiday_schedule')}`),
		start: Yup.date().required(`${t('please_fill_holiday_start_date')}`),
		end: Yup.date().required(`${t('please_fill_holiday_end_date')}`),
	});
	const { isAddWorkScheduleModal, setIsAddWokScheduleModal, params, minStartDate, minEndDate, saveWorkSchedule, handleDelete } = props;
	return (

		<div className="p-5">
			<div className='flex justify-between header-page-bottom pb-4 mb-4'>
				<h1 className='page-title'>{t('add_holiday')}</h1>
				<Link href="/hrm/holiday">
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
					user: params ? `${params?.user}` : '',
					title: params ? `${params?.title}` : '',
					start: params ? `${params?.start}` : '',
					end: params ? `${params?.end}` : '',
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
									{t('holiday_title')}
									<span style={{ color: 'red' }}> *</span>
								</label>
								<Field autoComplete="off" name="title" type="text" id="title" placeholder={t('fill_holiday_title')} className="form-input" />
								{submitCount ? errors.title ? <div className="mt-1 text-danger"> {errors.title} </div> : null : ''}
							</div>
							<div className="flex-1">
								<label htmlFor="user">
									{t('participants')}
									<span style={{ color: 'red' }}> *</span>
								</label>
								<Field autoComplete="off"
									name="user"
									render={({ field }: any) => (
										<>
											<Select
												{...field}
												options={getEmployeeOptions()}
												isMulti
												isSearchable
												placeholder={`${t('choose_participants')}`}
												onChange={e => {
													setFieldValue('user', e)
												}}
											/>

										</>
									)}
								/>
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
									placeholder={`${t('choose_from_time')}`}
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

									placeholder={`${t('choose_end_time')}`}
									className="form-input calender-input"
								/>
								{submitCount ? errors.end ? <div className="mt-1 text-danger"> {errors.end} </div> : null : ''}
							</div>
						</div>

						<div className="mb-3">
							<label htmlFor="description">{t('discription')}</label>
							<Field autoComplete="off" id="description" as="textarea" rows="2" name="description" className="form-input" placeholder={t('fill_holiday_schedule_description')} />
						</div>
						<div className="!mt-8 flex items-center justify-end">
							<button type="button" className="btn cancel-button" onClick={() => setIsAddWokScheduleModal(false)}>
								{t('cancel')}
							</button>
							<button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4 add-button">
								{params?.id ? t('update') : t('add')}
							</button>
						</div>
					</Form>
				)}
			</Formik>
		</div>

	);
};

export default AddWorkScheduleModal;
