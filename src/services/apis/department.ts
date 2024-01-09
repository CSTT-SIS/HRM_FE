
import { API } from "../../libs/client";

export const listAllDepartment = async (data: any): Promise<any> => {
    const res = await API.get(`/department/list-all`, data);
    return res.data;
};
export const detailDepartment = async (data: any): Promise<any> => {
    const res = await API.get(`/department/detail?departmentId=${data.departmentId}`);
    return res.data;
};
export const createDepartment = async (data: any): Promise<any> => {
    const res = await API.post(`/department/create`, data);
    return res.data;
};
export const updateDepartment = async (data: any): Promise<any> => {
    const res = await API.post(`/department/update`, data);
    return res.data;
};

export const deleteDepartment = async (data: any): Promise<any> => {
    const res = await API.post(`/department/delete?departmentId=${data.departmentId}`);
    return res.data;
};

