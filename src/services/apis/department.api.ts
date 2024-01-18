import callApi from '@core/call-api';
import Config from '@core/configs';
import Cookies from 'js-cookie';
export const listAllDepartment = async (data: any) => {
	const endpoint = '/department/list-all';
	return callApi(endpoint, 'GET', data);
};
export const detailDepartment = async (data: any) => {
	const endpoint = `/department/detail?departmentId=${data.departmentId}`;
	return callApi(endpoint, 'GET');
};
export const createDepartment = async (data: any) => {
	const endpoint = `/department/create`;
	return callApi(endpoint, 'POST', data);
};
export const updateDepartment = async (data: any) => {
	const endpoint = `/department/update`;
	return callApi(endpoint, 'POST', data);
};

export const deleteDepartment = async (data: any) => {
	const endpoint = `/department/delete?departmentId=${data.departmentId}`;
	return callApi(endpoint, 'POST', data);
};

