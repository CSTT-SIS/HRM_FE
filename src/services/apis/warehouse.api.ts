import callApi from '@core/call-api';
import Config from '@core/configs';
import Cookies from 'js-cookie';

export const CreateWarehouse = (body: any) => {
    const endpoint = '/warehouse';
    return callApi(endpoint, 'POST', body);
};

export const EditWarehouse = (body: any) => {
    const endpoint = `/warehouse/${body.id}`;
    return callApi(endpoint, 'PATCH', body);
};

export const DeleteWarehouse = (body: any) => {
    const endpoint = `/warehouse/${body.id}`;
    return callApi(endpoint, 'DELETE', body);
};


