import callApi from '@core/call-api';
import Config from '@core/configs';
import Cookies from 'js-cookie';

export const MarkAllRead = async () => {
    const endpoint = '/notification/mark-all-as-read';
    return callApi(endpoint, 'PATCH', null);
};
export const MarkRead = async (body: any) => {
    const endpoint = `/notification/${body.id}/mark-as-read`;
    return callApi(endpoint, 'PATCH', body);
};
