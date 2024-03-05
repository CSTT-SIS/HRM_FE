import { useRouter } from 'next/router';
import { useState, useEffect} from "react";
import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import Link from 'next/link';
import IconBack from '@/components/Icon/IconBack';
import holiday from "../holiday.json";
interface Props {
	[key: string]: any;
}

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
			user: 'Staff_A',
			title: 'Tết dương',
			start: now.getFullYear() + '-' + getMonth(now) + '-01T14:30:00',
			end: now.getFullYear() + '-' + getMonth(now) + '-01T15:30:00',
			// className: 'danger',
			description: 'Chi tiết về ngày lễ',
		},
		{
			id: 2,
			user: 'Staff_B',
			title: 'Tết nguyên đán',
			start: now.getFullYear() + '-' + getMonth(now) + '-07T19:30:00',
			end: now.getFullYear() + '-' + getMonth(now) + '-08T14:30:00',
			// className: 'primary',
			description: 'Chi tiết về ngày lễ',
		},
		{
			id: 3,
			user: 'Staff_C',
			title: 'Giỗ tổ',
			start: now.getFullYear() + '-' + getMonth(now) + '-17T14:30:00',
			end: now.getFullYear() + '-' + getMonth(now) + '-18T14:30:00',
			// className: 'info',
			description: 'Chi tiết về ngày lễ',
		},
		{
			id: 4,
			user: 'Staff_D',
			title: 'Quốc khánh',
			start: now.getFullYear() + '-' + getMonth(now) + '-12T10:30:00',
			end: now.getFullYear() + '-' + getMonth(now) + '-13T10:30:00',
			// className: 'danger',
			description: 'Chi tiết về ngày lễ',
		},
		{
			id: 5,
			user: 'Staff_E',
			title: 'Lễ 5',
			start: now.getFullYear() + '-' + getMonth(now) + '-12T15:00:00',
			end: now.getFullYear() + '-' + getMonth(now) + '-13T15:00:00',
			// className: 'info',
			description: 'Chi tiết về ngày lễ',
		},
		{
			id: 6,
			user: 'Staff_F',
			title: 'Lễ 6',
			start: now.getFullYear() + '-' + getMonth(now) + '-12T21:30:00',
			end: now.getFullYear() + '-' + getMonth(now) + '-13T21:30:00',
			// className: 'success',
			description: 'Chi tiết về ngày lễ',
		},
		{
			id: 7,
			user: 'Staff_G',
			title: 'Lễ 7',
			start: now.getFullYear() + '-' + getMonth(now) + '-12T05:30:00',
			end: now.getFullYear() + '-' + getMonth(now) + '-13T05:30:00',
			// className: 'info',
			description: 'Chi tiết về ngày lễ',
		},
		{
			id: 8,
			user: 'Staff_H',
			title: 'Lễ 8',
			start: now.getFullYear() + '-' + getMonth(now) + '-12T20:00:00',
			end: now.getFullYear() + '-' + getMonth(now) + '-13T20:00:00',
			// className: 'danger',
			description: 'Chi tiết về ngày lễ',
		},
		{
			id: 9,
			user: 'Staff_I',
			title: 'Lễ 9',
			start: now.getFullYear() + '-' + getMonth(now) + '-27T20:00:00',
			end: now.getFullYear() + '-' + getMonth(now) + '-28T20:00:00',
			// className: 'success',
			description: 'Chi tiết về ngày lễ',
		},
		{
			id: 10,
			user: 'Staff_K',
			title: 'Lễ 10',
			start: now.getFullYear() + '-' + getMonth(now, 1) + '-24T08:12:14',
			end: now.getFullYear() + '-' + getMonth(now, 1) + '-27T22:20:20',
			// className: 'danger',
			description: 'Chi tiết về ngày lễ',
		},
		{
			id: 11,
			user: 'Staff_L',
			title: 'Lễ 11',
			start: now.getFullYear() + '-' + getMonth(now, -1) + '-13T08:12:14',
			end: now.getFullYear() + '-' + getMonth(now, -1) + '-16T22:20:20',
			// className: 'primary',
			description: 'Chi tiết về ngày lễ',
		},
		{
			id: 13,
			user: 'Staff_M',
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
    const router = useRouter();
    const [detail, setDetail] = useState<any>();
    useEffect(() => {
        if (Number(router.query.id)) {
            const detailData = holiday?.find(d => d.id === Number(router.query.id));
            console.log(detailData)
            setDetail(detailData);
        }
    }, [router]);
	const SubmittedForm = Yup.object().shape({
		user: Yup.string().required(`${t('please_select_the_staff')}`),
		title: Yup.string().required(`${t('please_fill_title_holiday_schedule')}`),
		start: Yup.date().required(`${t('please_fill_holiday_start_date')}`),
		end: Yup.date().required(`${t('please_fill_holiday_end_date')}`),
	});
	const { isAddHolidayScheduleModal, setIsAddHolidayScheduleModal, minStartDate, minEndDate, saveHolidaySchedule, handleDelete } = props;
	return (

								<div className="p-5">
                                    <div className='flex justify-between header-page-bottom pb-4 mb-4'>
                <h1 className='page-title'>{t('update_holiday')}</h1>
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
											id: detail ? `${detail?.id}` : '',
											user: detail ? `${detail?.user}` : '',
											title: detail ? `${detail?.title}` : '',
											start: detail ? `${detail?.start}` : '',
											end: detail ? `${detail?.end}` : '',
											description: detail ? `${detail?.description}` : '',
										}}
                                        enableReinitialize
										validationSchema={SubmittedForm}
										onSubmit={(values) => {
											saveHolidaySchedule(values);
										}}
									>
										{({ errors, touched, submitCount }) => (
												<Form className="space-y-5">
                                                <div className="mb-3">
													<label htmlFor="title">
														{t('holiday_title')}
														<span style={{ color: 'red' }}> *</span>
													</label>
													<Field name="title" type="text" id="title" placeholder={t('fill_holiday_title')} className="form-input" />
													{submitCount? errors.title ? <div className="mt-1 text-danger"> {errors.title} </div> : null : ''}
												</div>
												<div className="mb-3">
													<label htmlFor="user">
														{t('participants')}
														<span style={{ color: 'red' }}> *</span>
													</label>
													<Field as="select" name="user" id="user" className="form-input" placeholder="test">
														{/* <option value="">Chọn nhân viên</option> */}
														{getEmployeeOptions().map((employee) => (
															<option key={employee.value} value={employee.value}>
																{employee.label}
															</option>
														))}
													</Field>
													{submitCount ? errors.user ? <div className="mt-1 text-danger"> {errors.user} </div> : null : ''}
												</div>

												<div className="mb-3 flex gap-2">
                                                    <div className='flex-1'>
                                                    <label htmlFor="dateStart">
														{t('from_time')}<span style={{ color: 'red' }}>* </span>
													</label>
													<Field id="start" type="datetime-local" name="start" className="form-input" placeholder={t('choose_start_time')} min={minStartDate} />
													{submitCount ? errors.start ? <div className="mt-1 text-danger"> {errors.start} </div> : null : ''}
                                                    </div>
                                                    <div className='flex-1'>
													<label htmlFor="dateEnd">
														{t('end_time')} <span style={{ color: 'red' }}>* </span>
													</label>
													<Field id="end" type="datetime-local" name="end" className="form-input" placeholder={t('choose_end_time')} min={minEndDate} />
													{submitCount ? errors.end ? <div className="mt-1 text-danger"> {errors.end} </div> : null : ''}
												</div>
												</div>

												<div className="mb-3">
													<label htmlFor="description">{t('discription')}</label>
													<Field id="description" as="textarea" rows="2" name="description" className="form-input" placeholder={t('fill_holiday_schedule_description')} />
												</div>
                                                <div className="!mt-8 flex items-center justify-end">
														<button type="button" className="btn cancel-button">
															{t('cancel')}
														</button>
														<button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4 add-button">
															{t('update')}
														</button>
													</div>
											</Form>
										)}
									</Formik>
								</div>

	);
};

export default AddWorkScheduleModal;
