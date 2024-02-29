import callApi from '@core/call-api';
import Config from '@core/configs';
import Cookies from 'js-cookie';

export const GetRepair = (body: any) => {
	const endpoint = `/repair-request/${body.id}`;
	return callApi(endpoint, 'GET', body);
};

export const CreateRepair = (body: any) => {
	const endpoint = '/repair-request';
	return callApi(endpoint, 'POST', body);
};

export const EditRepair = (body: any) => {
	const endpoint = `/repair-request/${body.id}`;
	return callApi(endpoint, 'PATCH', body);
};

export const DeleteRepair = (body: any) => {
	const endpoint = `/repair-request/${body.id}`;
	return callApi(endpoint, 'DELETE', body);
};

export const AddRepairDetail = (body: any) => {
	const endpoint = `/repair-request/${body.id}/detail`;
	return callApi(endpoint, 'POST', body);
};

export const AddRepairDetails = (body: any) => {
	const endpoint = `/repair-request/${body.id}/add-details`;
	return callApi(endpoint, 'POST', body);
};

export const EditRepairDetail = (body: any) => {
	const endpoint = `/repair-request/${body.id}/detail/${body.detailId}`;
	return callApi(endpoint, 'PATCH', body);
};

export const DeleteRepairDetail = (body: any) => {
	const endpoint = `/repair-request/${body.id}/detail/${body.detailId}`;
	return callApi(endpoint, 'DELETE', body);
};

export const RepairInprogress = (body: any) => {
	const endpoint = `/repair-request/${body.id}/in-progress`;
	return callApi(endpoint, 'PATCH', body);
};

export const RepairComplete = (body: any) => {
	const endpoint = `/repair-request/${body.id}/complete`;
	return callApi(endpoint, 'PATCH', body);
};

export const RepairReject = (body: any) => {
	const endpoint = `/repair-request/${body.id}/reject`;
	return callApi(endpoint, 'PATCH', body);
};
