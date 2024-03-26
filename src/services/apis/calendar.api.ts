import callApi from '@core/call-api';
import Config from '@core/configs';
import Cookies from 'js-cookie';
export const listAllCalendar = async (data: any) => {
	const endpoint = '/calendar/list-all';
	return callApi(endpoint, 'GET', data);
};
export const detailCalendar = async (data: any) => {
	const endpoint = `/calendar/detail?calendarId=${data.calendarId}`;
	return callApi(endpoint, 'GET');
};
export const createCalendar = async (data: any) => {
	const endpoint = `/calendar`;
	return callApi(endpoint, 'POST', data);
};
export const updateCalendar = async (data: any) => {
	const endpoint = `/calendar/update`;
	return callApi(endpoint, 'POST', data);
};

export const deleteCalendar = async (data: any) => {
	const endpoint = `/calendar/delete?calendarId=${data.calendarId}`;
	return callApi(endpoint, 'POST', data);
};

