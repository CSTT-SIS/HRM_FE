import callApi from '@core/call-api';
import Config from '@core/configs';
import Cookies from 'js-cookie';

export const listAllHuman = async (data: any) => {
	const endpoint = '/human';
	return callApi(endpoint, 'GET', data);
};
export const detailHuman = async (data: any) => {
	const endpoint = `/human/detail?humanId=${data.humanId}`;
	return callApi(endpoint, 'GET');
};
export const createHuman = async (data: any) => {
	const endpoint = `/human/create`;
	return callApi(endpoint, 'POST', data);
};
export const updateHuman = async (data: any) => {
	const endpoint = `/human/update`;
	return callApi(endpoint, 'POST', data);
};

export const deleteHuman = async (data: any) => {
	const endpoint = `/human/delete?humanId=${data.humanId}`;
	return callApi(endpoint, 'POST', data);
};
