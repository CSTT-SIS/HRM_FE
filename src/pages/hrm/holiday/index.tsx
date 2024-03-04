import IconPlus from '@/components/Icon/IconPlus';
import { setPageTitle } from '@/store/themeConfigSlice';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import React, { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import IconXCircle from '@/components/Icon/IconXCircle';
import AddHolidayScheduleModal from './modal/AddHolidayScheduleModal';
import Link from 'next/link';

const HolidaySchedule = () => {
	const dispatch = useDispatch();
    const router = useRouter();
	const { t } = useTranslation();
	useEffect(() => {
		dispatch(setPageTitle(`${t('work_schedule')}`));
	});
	const now = new Date();
	const getMonth = (dt: Date, add: number = 0) => {
		let month = dt.getMonth() + 1 + add;
		const str = (month < 10 ? '0' + month : month).toString();
		return str;
		// return dt.getMonth() < 10 ? '0' + month : month;
	};

	const [holidaySchedules, setHolidaySchedules] = useState<any>([
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
	]);

	const [isAddHolidayScheduleModal, setIsAddHolidayScheduleModal] = useState(false);
	const [minStartDate, setMinStartDate] = useState<any>('');
	const [minEndDate, setMinEndDate] = useState<any>('');
	const defaultParams = {
		id: null,
		user: '',
		title: '',
		start: '',
		end: '',
		description: '',
	};
	const [params, setParams] = useState<any>(defaultParams);
	const dateFormat = (dt: any) => {
		dt = new Date(dt);
		const month = dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1;
		const date = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();
		const hours = dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours();
		const mins = dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes();
		dt = dt.getFullYear() + '-' + month + '-' + date + 'T' + hours + ':' + mins;
		return dt;
	};
	const editHolidaySchedule = (data: any = null) => {
		let params = JSON.parse(JSON.stringify(defaultParams));
		setParams(params);
		if (data) {
			let obj = JSON.parse(JSON.stringify(data.event));
			setParams({
				id: obj.id ? obj.id : null,
				user: obj.extendedProps ? obj.extendedProps.user : null,
				title: obj.title ? obj.title : null,
				start: dateFormat(obj.start),
				end: dateFormat(obj.end),

				description: obj.extendedProps ? obj.extendedProps.description : '',
			});
			setMinStartDate(new Date());
			setMinEndDate(dateFormat(obj.start));
		} else {
			setMinStartDate(new Date());
			setMinEndDate(new Date());
		}
		setIsAddHolidayScheduleModal(true);
	};
	const handleDelete = (data: any) => {
		const swalDeletes = Swal.mixin({
			customClass: {
				confirmButton: 'btn btn-secondary',
				cancelButton: 'btn btn-danger ltr:mr-3 rtl:ml-3',
				popup: 'sweet-alerts',
			},
			buttonsStyling: false,
		});
		swalDeletes
			.fire({
				icon: 'question',
				title: `${t('delete_holiday_schedule')}`,
				text: `${t('delete')} ${data.title}`,
				padding: '2em',
				showCancelButton: true,
				reverseButtons: true,
			})
			.then((result) => {
				if (result.value) {
					const updateHolidaySchedule = holidaySchedules.filter((item: any) => item.id !== parseInt(data.id));
					setHolidaySchedules(updateHolidaySchedule);
					setIsAddHolidayScheduleModal(false);
					showMessage(`${t('delete_holiday_schedule_success')}`, 'success');
				}
			});
	};
	const editDate = (data: any) => {
		let obj = {
			event: {
				start: data.start,
				end: data.end,
			},
		};
		editHolidaySchedule(obj);
	};

	const saveHolidaySchedule = (value: any) => {
		if (value.id !== 'null') {
			//update holiday schedule
			let dataHolidaySchedule = holidaySchedules || [];
			let holidaySchedule: any = dataHolidaySchedule.find((d: any) => d.id === parseInt(value.id));
			holidaySchedule.user = value.user;
			holidaySchedule.title = value.title;
			holidaySchedule.start = value.start;
			holidaySchedule.end = value.end;
			holidaySchedule.description = value.description;

			setHolidaySchedules([]);
			setTimeout(() => {
				setHolidaySchedules(dataHolidaySchedule);
			});
		} else {
			//add holiday schedule
			let maxHolidayId = 0;
			if (holidaySchedules) {
				maxHolidayId = holidaySchedules.reduce((max: number, character: any) => (character.id > max ? character.id : max), holidaySchedules[0].id);
			}
			maxHolidayId = maxHolidayId + 1;
			let holidaySchedule = {
				id: maxHolidayId,
				user: value.user,
				title: value.title,
				start: value.start,
				end: value.end,
				description: value.description,
			};
			let dataHolidaySchedule = holidaySchedules || [];
			dataHolidaySchedule = dataHolidaySchedule.concat([holidaySchedule]);
			setTimeout(() => {
				setHolidaySchedules(dataHolidaySchedule);
			});
		}
		showMessage(`${t('save_holiday_schedule')}`);
		setIsAddHolidayScheduleModal(false);
	};
	const startDateChange = (event: any) => {
		const dateStr = event.target.value;
		if (dateStr) {
			setMinEndDate(dateFormat(dateStr));
			setParams({ ...params, start: dateStr, end: '' });
		}
	};
	const changeValue = (e: any) => {
		const { value, id } = e.target;
		setParams({ ...params, [id]: value });
	};
	const showMessage = (msg = '', type = 'success') => {
		const toast: any = Swal.mixin({
			toast: true,
			position: 'top',
			showConfirmButton: false,
			timer: 3000,
			customClass: { container: 'toast' },
		});
		toast.fire({
			icon: type,
			title: msg,
			padding: '10px 20px',
		});
	};
	const renderEventContent = (eventInfo: any) => {
		return (
			<>
				<div className="fc-event-main flex items-center text-black dark:text-white">
					<div className="fc-event-user">
						{'['}
						<span className="font-semibold">{eventInfo.event.extendedProps.user}</span>
						{']'}-{eventInfo.event.title}
					</div>
					{/* <div className="fc-event-time"> {eventInfo.timeText}</div> */}
				</div>
			</>
		);
	};
    const handleClickEvent = (event: any) => {
        router.push(`/hrm/holiday/${event.id}`)
    }
	return (
		<Fragment>
			<div className="panel mb-5">
				<div className="mb-4 flex flex-col items-center justify-center sm:flex-row sm:justify-between">
					<div className="mb-4 sm:mb-0">
						<div className="text-center text-lg font-semibold ltr:sm:text-left rtl:sm:text-right">{t('dayoff')}</div>
					</div>
					<Link href="/hrm/holiday/create">
                        <button type="button" className="btn btn-primary btn-sm m-1 custom-button" >
                                    <IconPlus className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                                    {t('add')}
                                    </button>
                        </Link>
				</div>
				<div className="calendar-wrapper">
					<FullCalendar
						plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
						initialView="dayGridMonth"
						headerToolbar={{
							left: 'prev,next today',
							center: 'title',
							right: 'dayGridMonth,timeGridWeek,timeGridDay',
						}}
						editable={true}
						dayMaxEvents={true}
						selectable={true}
						droppable={true}
						eventClick={(event: any) => handleClickEvent(event)}
						select={(event: any) => editDate(event)}
						events={holidaySchedules}
						eventContent={renderEventContent}
					/>
				</div>
				<AddHolidayScheduleModal
					isAddHolidayScheduleModal={isAddHolidayScheduleModal}
					setIsAddHolidayScheduleModal={setIsAddHolidayScheduleModal}
					params={params}
					handleDelete={handleDelete}
					minStartDate={minStartDate}
					startDateChange={startDateChange}
					minEndDate={minEndDate}
					setParams={setParams}
					saveHolidaySchedule={saveHolidaySchedule}
				/>
			</div>
		</Fragment>
	);
};

export default HolidaySchedule;
