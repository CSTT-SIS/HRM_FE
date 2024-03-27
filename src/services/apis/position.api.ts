import callApi from '@core/call-api';
import Config from '@core/configs';
import Cookies from 'js-cookie';
export const listAllPosition = async (data: any) => {
	const endpoint = '/position';
	return callApi(endpoint, 'GET', data);
};
export const detailPosition = async (data: any) => {
	const endpoint = `/position/detail?positionId=${data.positionId}`;
	return callApi(endpoint, 'GET');
};
export const createPosition = async (data: any) => {
	const endpoint = `/position`;
	return callApi(endpoint, 'POST', data);
};
export const updatePosition = async (data: any) => {
	const endpoint = `/position/update`;
	return callApi(endpoint, 'POST', data);
};

export const deletePosition = async (data: any) => {
	const endpoint = `/position/${data}`;
	return callApi(endpoint, 'DELETE');
};
