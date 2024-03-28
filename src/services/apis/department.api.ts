import callApi from '@core/call-api';
import Config from '@core/configs';
import Cookies from 'js-cookie';
export const listAllDepartment = async (data: any) => {
	const endpoint = '/department';
	return callApi(endpoint, 'GET', data);
};
export const detailDepartment = async (data: any) => {
	const endpoint = `/department/${data.departmentId}`;
	return callApi(endpoint, 'GET');
};
export const createDepartment = async (data: any) => {
	const endpoint = `/department`;
	return callApi(endpoint, 'POST', data);
};
export const updateDepartment = async (data: any) => {
	const endpoint = `/department`;
	return callApi(endpoint, 'PATCH', data);
};

export const deleteDepartment = async (data: any) => {
	const endpoint = `/department/${data.departmentId}`;
	return callApi(endpoint, 'DELETE', data);
};

