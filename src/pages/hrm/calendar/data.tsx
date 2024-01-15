const now = new Date();
const getMonth = (dt: Date, add: number = 0) => {
	let month = dt.getMonth() + 1 + add;
	const str = (month < 10 ? '0' + month : month).toString();
	return str;
	// return dt.getMonth() < 10 ? '0' + month : month;
};
export const data_work_schedule = [
	{
		id: 1,
		user: 'Staff_A',
		title: 'Công việc 1',
		start: now.getFullYear() + '-' + getMonth(now) + '-01T14:30:00',
		end: now.getFullYear() + '-' + getMonth(now) + '-01T15:30:00',
		className: 'danger',
		description: 'Aenean fermentum quam vel sapien rutrum cursus. Vestibulum imperdiet finibus odio, nec tincidunt felis facilisis eu.',
	},
	{
		id: 2,
		user: 'Staff_B',
		title: 'Công việc 2',
		start: now.getFullYear() + '-' + getMonth(now) + '-07T19:30:00',
		end: now.getFullYear() + '-' + getMonth(now) + '-08T14:30:00',
		className: 'primary',
		description: 'Etiam a odio eget enim aliquet laoreet. Vivamus auctor nunc ultrices varius lobortis.',
	},
	{
		id: 3,
		user: 'Staff_C',
		title: 'Công việc 3',
		start: now.getFullYear() + '-' + getMonth(now) + '-17T14:30:00',
		end: now.getFullYear() + '-' + getMonth(now) + '-18T14:30:00',
		className: 'info',
		description: 'Proin et consectetur nibh. Mauris et mollis purus. Ut nec tincidunt lacus. Nam at rutrum justo, vitae egestas dolor.',
	},
	{
		id: 4,
		user: 'Staff_D',
		title: 'Công việc 4',
		start: now.getFullYear() + '-' + getMonth(now) + '-12T10:30:00',
		end: now.getFullYear() + '-' + getMonth(now) + '-13T10:30:00',
		className: 'danger',
		description: 'Mauris ut mauris aliquam, fringilla sapien et, dignissim nisl. Pellentesque ornare velit non mollis fringilla.',
	},
	{
		id: 5,
		user: 'Staff_E',
		title: 'Công việc 5',
		start: now.getFullYear() + '-' + getMonth(now) + '-12T15:00:00',
		end: now.getFullYear() + '-' + getMonth(now) + '-13T15:00:00',
		className: 'info',
		description: 'Integer fermentum bibendum elit in egestas. Interdum et malesuada fames ac ante ipsum primis in faucibus.',
	},
	{
		id: 6,
		user: 'Staff_F',
		title: 'Công việc 6',
		start: now.getFullYear() + '-' + getMonth(now) + '-12T21:30:00',
		end: now.getFullYear() + '-' + getMonth(now) + '-13T21:30:00',
		className: 'success',
		description:
			'Curabitur facilisis vel elit sed dapibus. Nunc sagittis ex nec ante facilisis, sed sodales purus rhoncus. Donec est sapien, porttitor et feugiat sed, eleifend quis sapien. Sed sit amet maximus dolor.',
	},
	{
		id: 7,
		user: 'Staff_G',
		title: 'Công việc 7',
		start: now.getFullYear() + '-' + getMonth(now) + '-12T05:30:00',
		end: now.getFullYear() + '-' + getMonth(now) + '-13T05:30:00',
		className: 'info',
		description: ' odio lectus, porttitor molestie scelerisque blandit, hendrerit sed ex. Aenean malesuada iaculis erat, vitae blandit nisl accumsan ut.',
	},
	{
		id: 8,
		user: 'Staff_H',
		title: 'Công việc 8',
		start: now.getFullYear() + '-' + getMonth(now) + '-12T20:00:00',
		end: now.getFullYear() + '-' + getMonth(now) + '-13T20:00:00',
		className: 'danger',
		description: 'Sed purus urn"a", aliquam et pharetra ut, efficitur id mi. Pellentesque ut convallis velit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
	},
	{
		id: 9,
		user: 'Staff_I',
		title: 'Công việc 9',
		start: now.getFullYear() + '-' + getMonth(now) + '-27T20:00:00',
		end: now.getFullYear() + '-' + getMonth(now) + '-28T20:00:00',
		className: 'success',
		description: 'Sed purus urn"a", aliquam et pharetra ut, efficitur id mi. Pellentesque ut convallis velit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
	},
	{
		id: 10,
		user: 'Staff_K',
		title: 'Công việc 10',
		start: now.getFullYear() + '-' + getMonth(now, 1) + '-24T08:12:14',
		end: now.getFullYear() + '-' + getMonth(now, 1) + '-27T22:20:20',
		className: 'danger',
		description: 'Sed purus urn"a", aliquam et pharetra ut, efficitur id mi. Pellentesque ut convallis velit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
	},
	{
		id: 11,
		user: 'Staff_L',
		title: 'Công việc 11',
		start: now.getFullYear() + '-' + getMonth(now, -1) + '-13T08:12:14',
		end: now.getFullYear() + '-' + getMonth(now, -1) + '-16T22:20:20',
		className: 'primary',
		description: 'Pellentesque ut convallis velit. Sed purus urn"a", aliquam et pharetra ut, efficitur id mi. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
	},
	{
		id: 13,
		user: 'Staff_M',
		title: 'Công việc 13',
		start: now.getFullYear() + '-' + getMonth(now, 1) + '-15T08:12:14',
		end: now.getFullYear() + '-' + getMonth(now, 1) + '-18T22:20:20',
		className: 'primary',
		description: 'Pellentesque ut convallis velit. Sed purus urn"a", aliquam et pharetra ut, efficitur id mi. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
	},
];