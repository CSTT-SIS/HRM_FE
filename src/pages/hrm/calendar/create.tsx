import IconX from '@/components/Icon/IconX';
import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useState, useEffect } from 'react';
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
import { listAllHuman } from '@/services/apis/human.api';

//FAKE DATA

const AddWorkScheduleModal = ({ ...props }: Props) => {
    const [listHuman, setListHuman] = useState<any>();
    useEffect(() => {
        listAllHuman({
            page: 1,
            perPage: 1000
        }).then((res) => {
            console.log(res);
            setListHuman(res.data?.map((human: any) => {
                return {
                    value: human.id,
                    label: human.fullName
                }
            }));
        }).catch((err) => {
            console.log(err);
        });
    }, []);
	const { t } = useTranslation();
	const SubmittedForm = Yup.object().shape({
		userId: new Yup.ArraySchema().required(`${t('please_select_the_staff')}`),
		content: Yup.string().required(`${t('please_fill_content_work_schedule')}`),
		start: Yup.date().required(`${t('please_fill_work_start_date')}`),
		end: Yup.date().required(`${t('please_fill_work_end_date')}`),
	});
	const { isAddWorkScheduleModal, setIsAddWokScheduleModal, params, minStartDate, minEndDate, saveWorkSchedule, handleDelete } = props;
	return (

		<div className="p-5">
			<div className='flex justify-between header-page-bottom pb-4 mb-4'>
				<h1 className='page-content'>{t('add_calendar')}</h1>
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
					userId: params ? `${params?.userId}` : [],
					content: params ? `${params?.content}` : '',
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
								<label htmlFor="content">
									{t('calendar_title')}
									<span style={{ color: 'red' }}> *</span>
								</label>
								<Field autoComplete="off" name="content" type="text" id="content" placeholder={t('fill_calendar_title')} className="form-input" />
								{submitCount ? errors.content ? <div className="mt-1 text-danger"> {errors.content} </div> : null : ''}
							</div>
							<div className="flex-1">
								<label htmlFor="userId">
									{t('participants')}
									<span style={{ color: 'red' }}> *</span>
								</label>

								<Select
									name="userId"
									id='userId'
									options={listHuman}
									isMulti
									isSearchable
									placeholder={`${t('choose_participants')}`}
									onChange={e => {
										setFieldValue('userId', e?.map((user: any) => user.value));
									}}
								/>
								{submitCount ? errors.userId ? <div className="mt-1 text-danger"> {errors.userId} </div> : null : ''}
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
							<Field autoComplete="off" id="description" as="textarea" rows="2" name="description" className="form-input" placeholder={t('fill_work_schedule_description')} />
						</div>
						<div>
							<label>{t('level')}</label>
							<div className="mt-3">
								<label className="inline-flex cursor-pointer ltr:mr-3 rtl:ml-3">
									<Field autoComplete="off" type="radio" name="type" value="primary" className="form-radio" />
									<span className="ltr:pl-2 rtl:pr-2">{t('less_important')}</span>
								</label>
								<label className="inline-flex cursor-pointer ltr:mr-3 rtl:ml-3">
									<Field autoComplete="off" type="radio" name="type" value="info" className="form-radio text-info" />
									<span className="ltr:pl-2 rtl:pr-2">{t('normal')}</span>
								</label>
								<label className="inline-flex cursor-pointer ltr:mr-3 rtl:ml-3">
									<Field autoComplete="off" type="radio" name="type" value="success" className="form-radio text-success" />
									<span className="ltr:pl-2 rtl:pr-2">{t('important')}</span>
								</label>
								<label className="inline-flex cursor-pointer">
									<Field autoComplete="off" type="radio" name="type" value="danger" className="form-radio text-danger" />
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
