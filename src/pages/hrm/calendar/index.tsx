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
import AddWorkScheduleModal from './modal/AddWorkScheduleModal';
import Link from 'next/link';

const Canlendar = () => {
	const dispatch = useDispatch();
	const { t } = useTranslation();
    const router = useRouter();
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

	const [workSchedules, setWorkSchedules] = useState<any>([
		{
			id: 1,
			user: 'Staff_A',
			title: 'Công việc 1',
			start: now.getFullYear() + '-' + getMonth(now) + '-01T14:30:00',
			end: now.getFullYear() + '-' + getMonth(now) + '-01T15:30:00',
			className: 'danger',
			description: 'Aenean fermentum quam vel sapien rutrum cursus. Vestibulum imperdiet finibus odio, nec tincidunt felis facilisis eu.',
		},
		{
			id: 2,
			user: 'Staff_B',
			title: 'Công việc 2',
			start: now.getFullYear() + '-' + getMonth(now) + '-07T19:30:00',
			end: now.getFullYear() + '-' + getMonth(now) + '-08T14:30:00',
			className: 'primary',
			description: 'Etiam a odio eget enim aliquet laoreet. Vivamus auctor nunc ultrices varius lobortis.',
		},
		{
			id: 3,
			user: 'Staff_C',
			title: 'Công việc 3',
			start: now.getFullYear() + '-' + getMonth(now) + '-17T14:30:00',
			end: now.getFullYear() + '-' + getMonth(now) + '-18T14:30:00',
			className: 'info',
			description: 'Proin et consectetur nibh. Mauris et mollis purus. Ut nec tincidunt lacus. Nam at rutrum justo, vitae egestas dolor.',
		},
		{
			id: 4,
			user: 'Staff_D',
			title: 'Công việc 4',
			start: now.getFullYear() + '-' + getMonth(now) + '-12T10:30:00',
			end: now.getFullYear() + '-' + getMonth(now) + '-13T10:30:00',
			className: 'danger',
			description: 'Mauris ut mauris aliquam, fringilla sapien et, dignissim nisl. Pellentesque ornare velit non mollis fringilla.',
		},
		{
			id: 5,
			user: 'Staff_E',
			title: 'Công việc 5',
			start: now.getFullYear() + '-' + getMonth(now) + '-12T15:00:00',
			end: now.getFullYear() + '-' + getMonth(now) + '-13T15:00:00',
			className: 'info',
			description: 'Integer fermentum bibendum elit in egestas. Interdum et malesuada fames ac ante ipsum primis in faucibus.',
		},
		{
			id: 6,
			user: 'Staff_F',
			title: 'Công việc 6',
			start: now.getFullYear() + '-' + getMonth(now) + '-12T21:30:00',
			end: now.getFullYear() + '-' + getMonth(now) + '-13T21:30:00',
			className: 'success',
			description:
				'Curabitur facilisis vel elit sed dapibus. Nunc sagittis ex nec ante facilisis, sed sodales purus rhoncus. Donec est sapien, porttitor et feugiat sed, eleifend quis sapien. Sed sit amet maximus dolor.',
		},
		{
			id: 7,
			user: 'Staff_G',
			title: 'Công việc 7',
			start: now.getFullYear() + '-' + getMonth(now) + '-12T05:30:00',
			end: now.getFullYear() + '-' + getMonth(now) + '-13T05:30:00',
			className: 'info',
			description: ' odio lectus, porttitor molestie scelerisque blandit, hendrerit sed ex. Aenean malesuada iaculis erat, vitae blandit nisl accumsan ut.',
		},
		{
			id: 8,
			user: 'Staff_H',
			title: 'Công việc 8',
			start: now.getFullYear() + '-' + getMonth(now) + '-12T20:00:00',
			end: now.getFullYear() + '-' + getMonth(now) + '-13T20:00:00',
			className: 'danger',
			description: 'Sed purus urn"a", aliquam et pharetra ut, efficitur id mi. Pellentesque ut convallis velit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
		},
		{
			id: 9,
			user: 'Staff_I',
			title: 'Công việc 9',
			start: now.getFullYear() + '-' + getMonth(now) + '-27T20:00:00',
			end: now.getFullYear() + '-' + getMonth(now) + '-28T20:00:00',
			className: 'success',
			description: 'Sed purus urn"a", aliquam et pharetra ut, efficitur id mi. Pellentesque ut convallis velit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
		},
		{
			id: 10,
			user: 'Staff_K',
			title: 'Công việc 10',
			start: now.getFullYear() + '-' + getMonth(now, 1) + '-24T08:12:14',
			end: now.getFullYear() + '-' + getMonth(now, 1) + '-27T22:20:20',
			className: 'danger',
			description: 'Sed purus urn"a", aliquam et pharetra ut, efficitur id mi. Pellentesque ut convallis velit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
		},
		{
			id: 11,
			user: 'Staff_L',
			title: 'Công việc 11',
			start: now.getFullYear() + '-' + getMonth(now, -1) + '-13T08:12:14',
			end: now.getFullYear() + '-' + getMonth(now, -1) + '-16T22:20:20',
			className: 'primary',
			description: 'Pellentesque ut convallis velit. Sed purus urn"a", aliquam et pharetra ut, efficitur id mi. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
		},
		{
			id: 13,
			user: 'Staff_M',
			title: 'Công việc 13',
			start: now.getFullYear() + '-' + getMonth(now, 1) + '-15T08:12:14',
			end: now.getFullYear() + '-' + getMonth(now, 1) + '-18T22:20:20',
			className: 'primary',
			description: 'Pellentesque ut convallis velit. Sed purus urn"a", aliquam et pharetra ut, efficitur id mi. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
		},
	]);

	const [isAddWorkScheduleModal, setIsAddWokScheduleModal] = useState(false);
	const [minStartDate, setMinStartDate] = useState<any>('');
	const [minEndDate, setMinEndDate] = useState<any>('');
	const defaultParams = {
		id: null,
		user: '',
		title: '',
		start: '',
		end: '',
		description: '',
		type: 'primary',
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
	const editWorkSchedule = (data: any = null) => {
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
				type: obj.classNames ? obj.classNames[0] : 'primary',
				description: obj.extendedProps ? obj.extendedProps.description : '',
			});
			setMinStartDate(new Date());
			setMinEndDate(dateFormat(obj.start));
		} else {
			setMinStartDate(new Date());
			setMinEndDate(new Date());
		}
		setIsAddWokScheduleModal(true);
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
				title: `${t('delete_work_schedule')}`,
				text: `${t('delete')} ${data.title}`,
				padding: '2em',
				showCancelButton: true,
				reverseButtons: true,
			})
			.then((result) => {
				if (result.value) {
					const updateWorkSchedule = workSchedules.filter((item: any) => item.id !== parseInt(data.id));
					setWorkSchedules(updateWorkSchedule);
					setIsAddWokScheduleModal(false);
					showMessage(`${t('delete_work_schedule_success')}`, 'success');
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
		editWorkSchedule(obj);
	};

	const saveWorkSchedule = (value: any) => {
		if (value.id !== 'null') {
			//update work schedule
			let dataWorkSchedule = workSchedules || [];
			let workSchedule: any = dataWorkSchedule.find((d: any) => d.id === parseInt(value.id));
			workSchedule.user = value.user;
			workSchedule.title = value.title;
			workSchedule.start = value.start;
			workSchedule.end = value.end;
			workSchedule.description = value.description;
			workSchedule.className = value.type;

			setWorkSchedules([]);
			setTimeout(() => {
				setWorkSchedules(dataWorkSchedule);
			});
		} else {
			//add work schedule
			let maxEventId = 0;
			if (workSchedules) {
				maxEventId = workSchedules.reduce((max: number, character: any) => (character.id > max ? character.id : max), workSchedules[0].id);
			}
			maxEventId = maxEventId + 1;
			let workSchedule = {
				id: maxEventId,
				user: value.user,
				title: value.title,
				start: value.start,
				end: value.end,
				description: value.description,
				className: value.type,
			};
			let dataWorkSchedule = workSchedules || [];
			dataWorkSchedule = dataWorkSchedule.concat([workSchedule]);
			setTimeout(() => {
				setWorkSchedules(dataWorkSchedule);
			});
		}
		showMessage(`${t('save_work_schedule')}`);
		setIsAddWokScheduleModal(false);
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
				<div className="fc-event-main flex items-center">
					<div className="fc-event-user">
						{'['}
						{eventInfo.event.extendedProps.user}
						{']'}-{eventInfo.event.title}: &nbsp;
					</div>
					<div className="fc-event-time"> {eventInfo.timeText}</div>
				</div>
			</>
		);
	};
    const handleClickEvent = (event: any) => {
        let obj = JSON.parse(JSON.stringify(event.event));
        router.push(`/hrm/calendar/${obj.id}`)
    }
	return (
		<Fragment>
			<div className="panel mb-5">
				<div className="mb-4 flex flex-col items-center justify-center sm:flex-row sm:justify-between">
					<div className="mb-4 sm:mb-0">
						<div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start">
							<div className="flex items-center ltr:mr-4 rtl:ml-4">
								<div className="h-2.5 w-2.5 rounded-sm bg-primary ltr:mr-2 rtl:ml-2"></div>
								<div>{t('less_important')}</div>
							</div>
							<div className="flex items-center ltr:mr-4 rtl:ml-4">
								<div className="h-2.5 w-2.5 rounded-sm bg-info ltr:mr-2 rtl:ml-2"></div>
								<div>{t('normal')}</div>
							</div>
							<div className="flex items-center ltr:mr-4 rtl:ml-4">
								<div className="h-2.5 w-2.5 rounded-sm bg-success ltr:mr-2 rtl:ml-2"></div>
								<div>{t('important')}</div>
							</div>
							<div className="flex items-center">
								<div className="h-2.5 w-2.5 rounded-sm bg-danger ltr:mr-2 rtl:ml-2"></div>
								<div>{t('priority')}</div>
							</div>
						</div>
					</div>
					<Link href="/hrm/calendar/create">
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
						events={workSchedules}
						eventContent={renderEventContent}
					/>
				</div>
			</div>
		</Fragment>
	);
};

export default Canlendar;
