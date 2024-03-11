export function formatDate(date: Date): string {
	const weekDays = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
	const weekDayName = weekDays[date.getDay()];
	const day = date.getDate().toString().padStart(2, '0');
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	return `${weekDayName}, ${day}/${month}/${date.getFullYear()}`;
}

export function getDaysOfMonth(year: number, month: number): string[] {
	const daysArray: string[] = [];

	const startDate = new Date(year, month - 1, 1);

	const endDate = new Date(year, month, 0);

	for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
		const formattedDate = formatDate(date);
		daysArray.push(formattedDate);
	}

	return daysArray;
}

export function toDateString(date: string | number | Date): string {
    const today = new Date(date);
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  export function toDateStringMonth(date: string | number | Date): string {
    const today = new Date(date);
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    return `${mm}-${yyyy}`;
  };

export function makeRamdomText(length: any) {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	let counter = 0;
	while (counter < length) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
		counter += 1;
	}
	return result;
}
