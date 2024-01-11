import Config from '@core/configs';
import axios from 'axios';
// import { FrappeApp } from 'frappe-js-sdk';
import Cookies from 'js-cookie';

const headers: any = {
	'Content-Type': 'application/json',
	'Access-Control-Request-Origin': '*',
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Credentials': 'true',
	'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
	'Access-Control-Allow-Headers': 'Origin, Content-Type, Authorization',
	// 'Access-Control-Expose-Headers': 'Set-Cookie',
};

export interface ITimeInfo {
	createdAt: string;
	updatedAt: string;
	deletedAt: string;
}

axios.interceptors.request.use(
	function (config: any) {
		config.headers = {
			...headers,
			...config.headers,
			Authorization: `Bearer ${Cookies.get(Config.Env.NEXT_PUBLIC_X_ACCESS_TOKEN)}`

		};
		return config;
	},
	function (error: any) {
		return Promise.reject(error);
	},
);

axios.interceptors.response.use(
	function (response: any) {
		return response;
	},
	async function (error: any) {
		const status = error?.response?.status;
		const returnUrl = encodeURI(window.location.pathname + window.location.search);
		const returnUrlStr = returnUrl?.includes('/auth/boxed-signin') ? '' : `?returnUrl=${returnUrl}`;
		switch (status) {
			case 401:
				Cookies.remove(Config.Env.NEXT_PUBLIC_X_ACCESS_TOKEN);
				window.location.href = '/auth/boxed-signin' + returnUrlStr;
				break;
			default:
				return Promise.reject(error);
		}
	},
);

const callApi = (
	endpoint: string,
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
	body?: any,
	headers?: any,
	isBlob = false,
	...config: any
) => {
	const baseUrl = Config.Env.NEXT_PUBLIC_BE_URL;
	const url = baseUrl + endpoint;
	const responseType = isBlob ? 'blob' : 'json';
	return axios({
		url: url,
		params: body || {},
		method: method || 'GET',
		data: body || {},
		headers,
		responseType,
		...config,
		// withCredentials: true,
	})
		.then((res: any) => {
			console.log('LOG ~ .then ~ res:', res.headers);
			console.log('LOG ~ :', res.headers['set-cookies']);
			if (res?.status !== 200 && res?.status !== 201) throw res;
			return res?.data;
		})
		.catch((err: any) => {
			console.error('ERR ~ ', err);
			throw err;
		});
};

export const callApiSWRInfinite = (endpoint: string, method: any, body?: any, headers?: any, isBlob = false) => {
	const baseUrl = process.env.NEXT_PUBLIC_BE_URL;
	const url = baseUrl + endpoint;
	const responseType = isBlob ? 'blob' : 'json';
	return axios({
		url: url,
		method: method,
		data: body || {},
		headers,
		responseType,
	}).then((res: any) => {
		if (res?.status !== 200 && res?.status !== 201) throw res;
		return res?.data?.data;
	});
};
export default callApi;

// export const frappe = new FrappeApp(Config.Env.NEXT_PUBLIC_BE_URL);
