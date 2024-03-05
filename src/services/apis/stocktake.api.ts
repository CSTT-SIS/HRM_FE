import callApi from '@core/call-api';
import Config from '@core/configs';
import Cookies from 'js-cookie';

export const GetStocktake = (body: any) => {
    const endpoint = `/stocktake/${body.id}`;
    return callApi(endpoint, 'GET', body);
};

export const CreateStocktake = (body: any) => {
    const endpoint = '/stocktake';
    return callApi(endpoint, 'POST', body);
};

export const EditStocktake = (body: any) => {
    const endpoint = `/stocktake/${body.id}`;
    return callApi(endpoint, 'PATCH', body);
};

export const DeleteStocktake = (body: any) => {
    const endpoint = `/stocktake/${body.id}`;
    return callApi(endpoint, 'DELETE', body);
};

export const AddStocktakeDetail = (body: any) => {
    const endpoint = `/stocktake/${body.id}/add-detail`;
    return callApi(endpoint, 'POST', body);
};

export const AddStocktakeDetails = (body: any) => {
    const endpoint = `/stocktake/${body.id}/add-details`;
    return callApi(endpoint, 'POST', body);
};

export const AddStocktakeDetailAuto = (body: any) => {
    const endpoint = `/stocktake/${body.id}/auto-add-detail`;
    return callApi(endpoint, 'POST', body);
};

export const EditStocktakeDetail = (body: any) => {
    const endpoint = `/stocktake/${body.id}/update-detail/${body.itemId}`;
    return callApi(endpoint, 'PATCH', body);
};

export const DeleteStocktakeDetail = (body: any) => {
    const endpoint = `/stocktake/${body.id}/remove-detail/${body.itemId}`;
    return callApi(endpoint, 'DELETE', body);
};

export const StocktakeStart = (body: any) => {
    const endpoint = `/stocktake/${body.id}/start`;
    return callApi(endpoint, 'PATCH', body);
};

export const StocktakeFinish = (body: any) => {
    const endpoint = `/stocktake/${body.id}/finish`;
    return callApi(endpoint, 'PATCH', body);
};

export const StocktakeApprove = (body: any) => {
    const endpoint = `/stocktake/${body.id}/approve`;
    return callApi(endpoint, 'PATCH', body);
};

export const StocktakeReject = (body: any) => {
    const endpoint = `/stocktake/${body.id}/reject`;
    return callApi(endpoint, 'PATCH', body);
};

export const StocktakeCancel = (body: any) => {
    const endpoint = `/stocktake/${body.id}/cancel`;
    return callApi(endpoint, 'PATCH', body);
};

export const CheckStocktakeDetail = (body: any) => {
    const endpoint = `/stocktake/${body.id}/tally/${body.detailId}`;
    return callApi(endpoint, 'PATCH', body);
};
