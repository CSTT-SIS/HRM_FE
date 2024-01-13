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
import { data_work_schedule } from './data';

import IconXCircle from '@/components/Icon/IconXCircle';
import AddWorkScheduleModal from './modal/AddWorkScheduleModal';

const Canlendar = () => {
	const dispatch = useDispatch();
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

	const [workSchedules, setWorkSchedules] = useState<any>(data_work_schedule);

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
	return (
		<Fragment>
			<div className="panel mb-5">
				<div className="mb-4 flex flex-col items-center justify-center sm:flex-row sm:justify-between">
					<div className="mb-4 sm:mb-0">
						<div className="text-center text-lg font-semibold ltr:sm:text-left rtl:sm:text-right">{t('work_schedule')}</div>
						<div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start">
							<div className="flex items-center ltr:mr-4 rtl:ml-4">
								<div className="h-2.5 w-2.5 rounded-sm bg-primary ltr:mr-2 rtl:ml-2"></div>
								<div>Ít quan trọng</div>
							</div>
							<div className="flex items-center ltr:mr-4 rtl:ml-4">
								<div className="h-2.5 w-2.5 rounded-sm bg-info ltr:mr-2 rtl:ml-2"></div>
								<div>Bình thường</div>
							</div>
							<div className="flex items-center ltr:mr-4 rtl:ml-4">
								<div className="h-2.5 w-2.5 rounded-sm bg-success ltr:mr-2 rtl:ml-2"></div>
								<div>Quan trọng</div>
							</div>
							<div className="flex items-center">
								<div className="h-2.5 w-2.5 rounded-sm bg-danger ltr:mr-2 rtl:ml-2"></div>
								<div>Ưu tiên cao</div>
							</div>
						</div>
					</div>
					<button type="button" className="btn btn-primary" onClick={() => editWorkSchedule()}>
						<IconPlus className="ltr:mr-2 rtl:ml-2" />
						{t('add')}
					</button>
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
						eventClick={(event: any) => editWorkSchedule(event)}
						select={(event: any) => editDate(event)}
						events={workSchedules}
						eventContent={renderEventContent}
					/>
				</div>
				<AddWorkScheduleModal
					isAddWorkScheduleModal={isAddWorkScheduleModal}
					setIsAddWokScheduleModal={setIsAddWokScheduleModal}
					params={params}
					handleDelete={handleDelete}
					changeValue={changeValue}
					minStartDate={minStartDate}
					startDateChange={startDateChange}
					minEndDate={minEndDate}
					setParams={setParams}
					saveWorkSchedule={saveWorkSchedule}
				/>
			</div>
		</Fragment>
	);
};

export default Canlendar;
