
export function formatDate(date: Date): string {
    const weekDays = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const weekDayName = weekDays[date.getDay()];
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}/${month}/${date.getFullYear()}`;
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

export function getCurrentFormattedTime() {
    const now = new Date();

    const year = now.getFullYear();

    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');

    const hour = now.getHours().toString().padStart(2, '0');

    const minute = now.getMinutes().toString().padStart(2, '0');

    const formattedTime = `${year}-${month}-${day}T${hour}:${minute}`;

    return formattedTime;
}


