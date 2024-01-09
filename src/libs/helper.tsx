import Swal from "sweetalert2";

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