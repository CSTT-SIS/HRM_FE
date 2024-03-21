import callApi from '@core/call-api';
import Config from '@core/configs';
import Cookies from 'js-cookie';

export const listAllShift = async (data: any) => {
	const endpoint = '/shift';
	return callApi(endpoint, 'GET', data);
};
export const detailShift = async (data: any) => {
	const endpoint = `/shift/detail?shiftId=${data.shiftId}`;
	return callApi(endpoint, 'GET');
};
export const createShift = async (data: any) => {
	const endpoint = `/shift/create`;
	return callApi(endpoint, 'POST', data);
};
export const updateShift = async (data: any) => {
	const endpoint = `/shift/update`;
	return callApi(endpoint, 'POST', data);
};

export const deleteShift = async (data: any) => {
	const endpoint = `/shift/delete?shiftId=${data.shiftId}`;
	return callApi(endpoint, 'POST', data);
};

