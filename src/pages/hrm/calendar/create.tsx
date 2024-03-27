import IconX from '@/components/Icon/IconX';
import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import IconBack from '@/components/Icon/IconBack';
import Link from 'next/link';
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { listAllHuman } from '@/services/apis/human.api';
import { createCalendar } from '@/services/apis/calendar.api';
import dayjs from "dayjs";
import { showMessage } from '@/@core/utils';

interface Props {
	[key: string]: any;
}

//FAKE DATA

const AddWorkScheduleModal = ({ ...props }: Props) => {
    const [listHuman, setListHuman] = useState<any>();
    useEffect(() => {
        listAllHuman({
            page: 1,
            perPage: 1000
        }).then((res) => {
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
		userIds: Yup.array().typeError(`${t('please_select_the_staff')}`),
		title: Yup.string().required(`${t('please_fill_title_work_schedule')}`),
		startDate: Yup.date().typeError(`${t('please_fill_work_start_date')}`),
		endDate: Yup.date().typeError(`${t('please_fill_work_end_date')}`),
        description: Yup.string(),
        level: Yup.string().required(`${t('please_select_work_level')}`)
	});
	const { isAddWorkScheduleModal, setIsAddWokScheduleModal, params, minStartDate, minEndDate, saveWorkSchedule, handleDelete } = props;
    const handleAddWorkSchedule = (data: any) => {
        let level_
        switch (data.level) {
            case "primary":
                level_= 1;
                break;
            case "info":
                level_= 2;
                break;
            case "success":
                level_= 3;
                break;
            case "danger":
                level_= 4;
                break;
            default:
                level_= 1;
                break;
        }
        const dataSubmit = {
            ...data,
            level: level_
        };

        createCalendar(dataSubmit).then(() => {
                showMessage(`${t('create_work_schedule_success')}`, 'success');
            }).catch((err) => {
                showMessage(`${t('create_work_schedule_error')}`, 'error');
            });

    }
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
					userIds: params ? `${params?.userIds}` : null,
					title: params ? `${params?.title}` : '',
					startDate: params ? `${params?.startDate}` : null,
					endDate: params ? `${params?.endDate}` : null,
					level: params ? `${params?.level}` : null,
					description: params ? `${params?.description}` : '',
				}}
				validationSchema={SubmittedForm}
				onSubmit={(values) => {
					handleAddWorkSchedule(values);
				}}
			>
				{({ errors, touched, submitCount, setFieldValue, values }) => (
					<Form className="space-y-5">
						<div className="mb-3 flex gap-2">

							<div className="flex-1">
								<label htmlFor="title">
									{t('calendar_title')}
									<span style={{ color: 'red' }}> *</span>
								</label>
								<Field autoComplete="off" name="title" type="text" id="title" placeholder={t('fill_calendar_title')} className="form-input" />
								{submitCount ? errors.title ? <div className="mt-1 text-danger"> {errors.title} </div> : null : ''}
							</div>
							<div className="flex-1">
								<label htmlFor="userIds">
									{t('participants')}
									<span style={{ color: 'red' }}> *</span>
								</label>

								<Select
									name="userIds"
									id='userIds'
									options={listHuman}
									isMulti
									isSearchable
									placeholder={`${t('choose_participants')}`}
									onChange={e => {
										setFieldValue('userIds', e?.map((user: any) => user.value));
									}}
								/>
								{submitCount ? errors.userIds ? <div className="mt-1 text-danger"> {errors.userIds} </div> : null : ''}
							</div>
						</div>

						<div className="mb-3 flex gap-2">
							<div className='flex-1'>
								<label htmlFor="startDate">
									{t('from_time')}<span style={{ color: 'red' }}>* </span>
								</label>
								<Flatpickr
									options={{
										enableTime: true,
										dateFormat: "d-m-Y H:i",
										time_24hr: true

									}}
                                    onChange={(e: any) => {
                                        if (e?.length > 0) {
                                        setFieldValue("startDate", dayjs(e[0]).toISOString());
                                        }
                                    }}
									placeholder={`${t('choose_from_time')}`}
									className="form-input calender-input"
								/>
								{submitCount ? errors.startDate ? <div className="mt-1 text-danger"> {errors.startDate} </div> : null : ''}
							</div>
							<div className='flex-1'>
								<label htmlFor="endDate">
									{t('end_time')} <span style={{ color: 'red' }}>* </span>
								</label>
								<Flatpickr
									options={{
										enableTime: true,
										dateFormat: "d-m-Y H:i",
										time_24hr: true

									}}
									placeholder={`${t('choose_end_time')}`}
                                    onChange={(e: any) => {
                                        if (e?.length > 0) {
                                        setFieldValue("endDate", dayjs(e[0]).toISOString());
                                                                }
                                    }}
									className="form-input calender-input"
								/>
								{submitCount ? errors.endDate ? <div className="mt-1 text-danger"> {errors.endDate} </div> : null : ''}
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
									<Field autoComplete="off" type="radio" name="level" value="primary" className="form-radio" />
									<span className="ltr:pl-2 rtl:pr-2">{t('less_important')}</span>
								</label>
								<label className="inline-flex cursor-pointer ltr:mr-3 rtl:ml-3">
									<Field autoComplete="off" type="radio" name="level" value="info" className="form-radio text-info" />
									<span className="ltr:pl-2 rtl:pr-2">{t('normal')}</span>
								</label>
								<label className="inline-flex cursor-pointer ltr:mr-3 rtl:ml-3">
									<Field autoComplete="off" type="radio" name="level" value="success" className="form-radio text-success" />
									<span className="ltr:pl-2 rtl:pr-2">{t('important')}</span>
								</label>
								<label className="inline-flex cursor-pointer">
									<Field autoComplete="off" type="radio" name="level" value="danger" className="form-radio text-danger" />
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
								<button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4 add-button" onClick={(e: any) => {
                                    console.log(values)
}}>
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
