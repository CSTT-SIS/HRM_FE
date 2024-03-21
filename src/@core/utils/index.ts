import moment from 'moment';
import Swal from "sweetalert2";

export const isEmpty = (value: any) => {
	if (typeof value === 'object' && Object?.keys(value || {}).length === 0) return true;
	return [null, undefined, '', NaN].includes(value);
};

export const isNaNOr = (value: any, fallbackValue = 0) => (isNaN(value) ? fallbackValue : value);
export const deleteNullInObject = (obj: any) => {
	const newObj = { ...obj };
	Object.keys(newObj).forEach((key) => {
		if (isEmpty(newObj[key])) {
			delete newObj[key];
		}
	});
	return newObj;
};

export const getEndpoint = (endpoint: string, queries?: any) => {
	queries = deleteNullInObject(queries);
	const queriesStr = new URLSearchParams(queries).toString();
	return endpoint + '?' + decodeURIComponent(queriesStr);
};

export const mergeClassName = (...classNames: (string | any)[]) => classNames.filter(notNull).join(' ');

export const capitalizeFirstLetter = (string: string) => string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

export const displayDate = (date?: any) => {
	if (!date) return null;
	return moment(date).format('HH:mm:ss DD/MM/YYYY');
};

export const unique = (value: any, index: number, self: any[]) => {
	return self.indexOf(value) === index;
};

export const notNull = (value: any, index: number, self: any[]) => {
	return !isEmpty(value);
};

/**
 *
 * @param time in minutes
 * @returns xxh yym zzs
 */
export const displayTime = (time: number) => {
	time = time * 60;

	const hours = Math.floor(time / 3600);
	const minutes = Math.floor((time % 3600) / 60);
	const seconds = Math.floor(time % 60);
	//check isNan
	if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) return '';
	if (hours === 0 && minutes === 0 && seconds === 0) return '0s';
	if (hours === 0 && minutes === 0) return `${seconds}s`;
	if (hours === 0) return `${minutes}m ${seconds}s`;
	return `${hours}h ${minutes}m ${seconds}s`;
};

export const getAvatar = (name: string) => {
	return `https://ui-avatars.com/api/?name=${name}&background=random&length=1&rounded=true&size=128`;
};

export const randomArrayIndex = (random: number, length: number) => {
	const arr = Array.from({ length }, (_, i) => i);
	let randomNumber: any;
	if (length < 2) return arr;
	if (length === 2) randomNumber = random % length;
	if (length > 2) randomNumber = Math.max(random % length, 1);

	let loop = 0;
	while (loop < randomNumber) {
		const mid = Math.floor(length / 2);
		let loop1 = 0;
		while (loop1 < Math.max(randomNumber, 2)) {
			for (let i = 0; i < length; i++) {
				const tmp = arr[mid];
				arr[mid] = arr[i];
				arr[i] = arr[length - 1];
				arr[length - 1] = tmp;
			}
			loop1++;
		}

		for (let i = 0; i < length; i++) {
			const tmpi = Math.abs(randomNumber - length + 1);
			const tmp = Number(arr[i]);
			arr[i] = arr[tmpi];
			arr[tmpi] = tmp;
		}

		loop++;
	}
	return arr;
};

export const sortArray = (id: any, arr: any[]) => {
	if (!id) return arr;
	if (!arr) return [];
	const randomArrIndex = randomArrayIndex(id, arr.length);
	const newArr = randomArrIndex.map((index) => arr[index]);
	return newArr;
};

export const capitalize = (text: any) => {
	return text
		.replace('_', ' ')
		.replace('-', ' ')
		.toLowerCase()
		.split(' ')
		.map((s: any) => s.charAt(0).toUpperCase() + s.substring(1))
		.join(' ');
};

export const formatDate = (date: any) => {
	if (date) {
		const dt = new Date(date);
		const month = dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1;
		const day = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();
		return day + '/' + month + '/' + dt.getFullYear();
	}
	return '';
};
export const showMessage = (msg = '', type = 'success') => {
	const toast: any = Swal.mixin({
		toast: true,
		position: 'top',
		showConfirmButton: false,
		timer: 3000,
		customClass: { container: 'toast' },
	});
	toast.fire({
		icon: type,
		title: msg,
		padding: '10px 20px',
	});
};
