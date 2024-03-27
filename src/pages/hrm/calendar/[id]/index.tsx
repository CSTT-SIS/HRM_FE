import { useRouter } from 'next/router';
import { useState, useEffect } from "react";
import IconX from '@/components/Icon/IconX';
import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import Link from 'next/link';
import IconBack from '@/components/Icon/IconBack';
import workSchedules from '../workSchedules.json'
import Select from "react-select";
import personnel_list from "../../personnel/personnel_list.json"
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { deleteCalendar, detailCalendar, updateCalendar } from '@/services/apis/calendar.api';
import { listAllHuman } from '@/services/apis/human.api';
import dayjs from 'dayjs';
import moment from 'moment';
import { showMessage } from '@/@core/utils';
import { Calendar } from '@fullcalendar/core';
import { Calendars } from '@/services/swr/calendar.twr';
import Swal from 'sweetalert2';
interface Props {
	[key: string]: any;
}

const AddWorkScheduleModal = ({ ...props }: Props) => {
	const { t } = useTranslation();
	const router = useRouter();
	const [detail, setDetail] = useState<any>();
	const [listPerson, setListPerson] = useState<any>();
	useEffect(() => {
		if (Number(router.query.id)) {
			const detailData = workSchedules?.find(d => d.id === Number(router.query.id));
            detailCalendar(router.query.id).then(res => {
                let level_
                 switch (res?.data?.level) {
                    case 1:
                        level_= "primary";
                        break;
                    case 2:
                        level_= "info";
                        break;
                    case 3:
                        level_= "success";
                        break;
                    case 4:
                        level_= "danger";
                        break;
                    default:
                        level_= "primary";
                        break;
                }
                const data = {
                    ...res.data,
                    userIds: res?.data?.calendarUsers?.map((per: any) => {
                        return {
                        value: per.userId,
                        label: per.user?.fullName
                    }
                }),
                    level: level_
                }
                setDetail(data);
            }).catch(err => console.log(err));
		}
	}, [router]);
	useEffect(() => {
		listAllHuman({
            page: 1,
            perPage: 1000
        }).then((res) => {
            setListPerson(res.data?.map((human: any) => {
                return {
                    value: human.id,
                    label: human.fullName
                }
            }));
        }).catch((err) => {
            console.log(err);
        });
	}, [])

    const { data: calendar, pagination, mutate } = Calendars({ sortBy: 'id.ASC', ...router.query });

	const SubmittedForm = Yup.object().shape({
		userIds: Yup.array().typeError(`${t('please_select_the_staff')}`),
		title: Yup.string().required(`${t('please_fill_title_work_schedule')}`),
		startDate: Yup.date().typeError(`${t('please_fill_work_start_date')}`),
		endDate: Yup.date().typeError(`${t('please_fill_work_end_date')}`),
        description: Yup.string(),
        level: Yup.string().required(`${t('please_select_work_level')}`)
	});
    const handleUpdateSchedule = (values: any) => {
        let level_
        switch (values.level) {
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
            ...values,
            level: level_,
            userIds: values?.userIds?.map((user: any) => user.value)
        };
        delete dataSubmit.id
        updateCalendar(values?.id, dataSubmit).then(() => {
                showMessage(`${t('update_work_schedule_success')}`, 'success');
                mutate();
            }
        ).catch(() => {
                showMessage(`${t('update_work_schedule_error')}`, 'error');
        } )


    }
    const handleDelete = (data: any) => {
		const swalDeletes = Swal.mixin({
			customClass: {
				confirmButton: 'btn btn-secondary',
				cancelButton: 'btn btn-danger ltr:mr-3 rtl:ml-3',
				popup: 'confirm-delete',
			},
            imageUrl: '/assets/images/delete_popup.png',
			buttonsStyling: false,
		});
		swalDeletes
			.fire({
				title: `${t('delete_work_schedule')}`,
				html: `<span class='confirm-span'>${t('confirm_delete')}</span> ${data.title}?`,
				padding: '2em',
				showCancelButton: true,
                cancelButtonText: `${t('cancel')}`,
                confirmButtonText: `${t('confirm')}`,
				reverseButtons: true,
			})
			.then((result) => {
				if (result.value) {
                    deleteCalendar(data?.id).then(() => {
					showMessage(`${t('delete_work_schedules_success')}`, 'success');
                    mutate();
                    router.push('/hrm/calendar')
                    }).catch(() => {
                    showMessage(`${t('delete_work_schedules_error')}`, 'error');
                    })
				}
			});
	};
	return (
		<div className="p-5">
			<div className='flex justify-between header-page-bottom pb-4 mb-4'>
				<h1 className='page-title'>{t('update_calendar')}</h1>
				<Link href="/hrm/calendar">
					<button type="button" className="btn btn-primary btn-sm m-1 back-button" >
						<IconBack className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
						<span>
							{t('back')}
						</span>
					</button>
				</Link>
			</div>
			{ detail?.id !== undefined && <Formik
				initialValues={{
					id: detail ? `${detail?.id}` : '',
					userIds: detail ? detail?.userIds : [],
					title: detail ? `${detail?.title}` : '',
					startDate: detail ? moment(detail.startDate).format("YYYY-MM-DD hh:mm:ss") : "",
					endDate: detail ? moment(detail.endDate).format("YYYY-MM-DD hh:mm:ss") : "",
					level: detail ? `${detail?.level}` : null,
					description: detail ? `${detail?.description}` : '',
				}}
				validationSchema={SubmittedForm}
				onSubmit={(values) => {
					handleUpdateSchedule(values);
				}}
				enableReinitialize
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
									options={listPerson}
									isMulti
									isSearchable
                                    value={values?.userIds}
									placeholder={`${t('choose_participants')}`}
									onChange={e => {
										setFieldValue('userIds', e?.map((user: any) => user.value));
									}}
								/>
								{submitCount ? errors.userIds ? <div className="mt-1 text-danger"> {`${errors.userIds}`} </div> : null : ''}
							</div>
						</div>

						<div className="mb-3 flex gap-2">
							<div className='flex-1'>
								<label htmlFor="startDate">
									{t('from_time')}<span style={{ color: 'red' }}>* </span>
								</label>
								<Flatpickr
                                    data-enable-time
									options={{
										enableTime: true,
										dateFormat: "d-m-Y H:i",
										time_24hr: true

									}}
                                    value={values?.startDate}
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
                                    data-enable-time
									options={{
										enableTime: true,
										dateFormat: "d-m-Y H:i",
										time_24hr: true
									}}
                                    value={values?.endDate}
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
								{detail?.id && (
									<button type="button" className="btn btn-outline-warning ltr:ml-4 rtl:mr-4" onClick={() => handleDelete(detail)}>
										{t('delete')}
									</button>
								)}
								<button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4 add-button">
									{detail?.id ? t('update') : t('add')}
								</button>
							</div>
						</div>
					</Form>
				)}
			</Formik>}
		</div>

	);
};

export default AddWorkScheduleModal;
