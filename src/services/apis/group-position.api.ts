import callApi from '@core/call-api';
import Config from '@core/configs';
import Cookies from 'js-cookie';
export const listAllGroupPositon = async (data: any) => {
	const endpoint = '/position-group';
	return callApi(endpoint, 'GET', data);
};
export const detailGroupPositon = async (data: any) => {
	const endpoint = `/position-group/detail?position-groupId=${data.id}`;
	return callApi(endpoint, 'GET');
};
export const createGroupPositon = async (data: any) => {
	const endpoint = `/position-group`;
	return callApi(endpoint, 'POST', data);
};
export const updateGroupPositon = async (data: any) => {
	const endpoint = `/position-group/update`;
	return callApi(endpoint, 'POST', data);
};

export const deleteGroupPositon = async (data: any) => {
	const endpoint = `/position-group/${data}`;
	return callApi(endpoint, 'DELETE');
};

