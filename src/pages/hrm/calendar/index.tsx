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
import IconNewPlus from '@/components/Icon/IconNewPlus';
import { listAllCalendar } from '@/services/apis/calendar.api';
import { Calendars } from '@/services/swr/calendar.twr';
import workSchedule from './workSchedules.json'

const Canlendar = () => {
	const dispatch = useDispatch();
	const { t } = useTranslation();
    const router = useRouter();
    const [data, setData] = useState<any>();

	useEffect(() => {
		dispatch(setPageTitle(`${t('work_schedule')}`));
        calendar?.data?.map((item: any) => {
            console.log(item)
        })
	});

    const { data: calendar, pagination, mutate } = Calendars({ sortBy: 'id.ASC', ...router.query });
	const now = new Date();
	const getMonth = (dt: Date, add: number = 0) => {
		let month = dt.getMonth() + 1 + add;
		const str = (month < 10 ? '0' + month : month).toString();
		return str;
		// return dt.getMonth() < 10 ? '0' + month : month;
	};


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
				reverseButtons: true,
                cancelButtonText: `${t('cancel')}`,
                confirmButtonText: `${t('confirm')}`,
			})
			.then((result) => {
				if (result.value) {
					// const updateWorkSchedule = workSchedules.filter((item: any) => item.id !== parseInt(data.id));
					// setWorkSchedules(updateWorkSchedule);
					// setIsAddWokScheduleModal(false);
					// showMessage(`${t('delete_work_schedule_success')}`, 'success');
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
    console.log("calendar", calendar?.data);
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
                    <button type="button" className=" m-1 button-table button-create" >
								<IconNewPlus/>
								<span className="uppercase">{t('add')}</span>
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
						events={calendar?.data}
						eventContent={renderEventContent}
					/>
				</div>
			</div>
		</Fragment>
	);
};

export default Canlendar;
