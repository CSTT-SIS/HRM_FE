import { useEffect, Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog, Transition } from '@headlessui/react';

import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import Swal from 'sweetalert2';
import { showMessage } from '@/@core/utils';
import IconX from '@/components/Icon/IconX';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Select from 'react-select';
import Link from 'next/link';
import IconArrowBackward from '@/components/Icon/IconArrowBackward';
import { ProductCategorys, Providers } from '@/services/swr/product.twr';
import IconBack from '@/components/Icon/IconBack';
import IconCaretDown from '@/components/Icon/IconCaretDown';
import IconCalendar from '@/components/Icon/IconCalendar';

interface Props {
    [key: string]: any;
}

const AddNewTask = ({ ...props }: Props) => {
    const { t } = useTranslation();
    const [disabled, setDisabled] = useState(false);
    const [query, setQuery] = useState<any>();

    const [typeShift, setTypeShift] = useState("0"); // 0: time, 1: total hours
    const { data: departmentparents } = ProductCategorys(query);
    const { data: manages } = Providers(query);
    const departmentparent = departmentparents?.data.filter((item: any) => {
        return (
            item.value = item.id,
            item.label = item.name,
            delete item.createdAt
        )
    })

    const manage = manages?.data.filter((item: any) => {
        return (
            item.value = item.id,
            item.label = item.name
        )
    })
    const SubmittedForm = Yup.object().shape({
        name: Yup.string()
            .min(2, `${t('error_too_short')}`)
            .required(`${t('error_fill_task_name')}`),
        creator: Yup.string().required(`${t('error_select_creator')}`),
        executor: Yup.string().required(`${t('error_select_executor')}`),
        collaborator: Yup.string(),
        description: Yup.string(),
        deadline: Yup.date().required(`${t('error_set_deadline')}`),
        directive: Yup.string(),
    });
    const handleSearch = (param: any) => {
        setQuery({ search: param });
    }
    const handleTask = (values: any) => {
        let updatedTasks = [...props.totalData];

        // Determine the color based on the task status
        let color = '';
        switch (values.status) {
            case 'ĐANG THỰC HIỆN':
                color = 'info';
                break;
            case 'HOÀN THÀNH':
                color = 'success';
                break;
            case 'ĐÃ XONG':
                color = 'warning';
                break;
            case 'HUỶ BỎ':
                color = 'danger';
                break;
            default:
                color = 'info'; // Default color if status is undefined or different
        }

        if (props?.data) {
            // Editing existing task
            updatedTasks = updatedTasks.map((task) => {
                if (task.id === props.data.id) {
                    return { ...task, ...values, color };
                }
                return task;
            });
            showMessage(`${t('edit_task_success')}`, 'success');
        } else {
            // Adding new task
            const newTask = {
                id: updatedTasks.length > 0 ? updatedTasks[updatedTasks.length - 1].id + 1 : 1,
                ...values,
                color,
            };
            updatedTasks.push(newTask);
            showMessage(`${t('add_task_success')}`, 'success');
        }

        localStorage.setItem('taskList', JSON.stringify(updatedTasks));
        props.setGetStorge(updatedTasks);
        props.setOpenModal(false);
        props.setData(undefined);
    };
    const handleChangeTypeShift = (e: any) => {
        setTypeShift(e);
    }

    const handleCancel = () => {
        props.setOpenModal(false);
        props.setData(undefined);
    };
    return (

        <div className="p-5">
            <div className='flex justify-between header-page-bottom pb-4 mb-4'>
                <h1 className='page-title'>{t('add_task')}</h1>
                <Link href="/hrm/task">
                    <button type="button" className="btn btn-primary btn-sm m-1 back-button" >
                        <IconBack className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                        <span>
                            {t('back')}
                        </span>
                    </button>
                </Link>
            </div>
            <Formik
                initialValues={{
                    name: props?.data ? `${props?.data?.name}` : '',
                    creator: 'Nguyễn Văn A',
                    executor: props?.data ? `${props?.data?.executor}` : '',
                    collaborator: props?.data ? `${props?.data?.collaborator}` : '',
                    description: props?.data ? `${props?.data?.description}` : '',
                    deadline: props?.data ? `${props?.data?.deadline}` : '',
                    directive: props?.data ? `${props?.data?.directive}` : '',
                    color: props?.data ? `${props?.data?.color}` : 'info',
                    status: props?.data ? `${props?.data?.status}` : 'ĐANG THỰC HIỆN',
                    attachment: props?.data ? `${props?.data?.attachment}` : '',
                }}
                validationSchema={SubmittedForm}
                onSubmit={(values) => {
                    handleTask(values);
                }}
            >
                {({ errors, values, setFieldValue, submitCount }) => (
                    <Form className="space-y-5">
                        <div className="mb-3">
                            <label htmlFor="name">
                                {' '}
                                {t('name_task')} <span style={{ color: 'red' }}>* </span>
                            </label>
                            <Field name="name" type="text" id="name" placeholder={`${t('enter_name_task')}`} className="form-input" />
                            {submitCount ? errors.name ? <div className="mt-1 text-danger"> {errors.name} </div> : null : ''}
                        </div>
                        <div className='flex justify-between gap-5'>

                            <div className="mb-3 w-1/2">
                                <label htmlFor="creator">
                                    {' '}
                                    {t('creator_task')} <span style={{ color: 'red' }}>* </span>
                                </label>
                                <Field type="text" name="creator" id="creator" className="form-input" disabled style={{ color: 'gray' }}>
                                </Field>
                                {submitCount ? errors.creator ? <div className="mt-1 text-danger"> {errors.creator} </div> : null : ''}
                            </div>
                            <div className="mb-3 w-1/2">
                                <label htmlFor="date_create">
                                    {' '}
                                    {t('date_create')} <span style={{ color: 'red' }}>* </span>
                                </label>
                                <div className="flex">
                                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                        <IconCalendar></IconCalendar>
                                    </div>
                                    <Flatpickr
                                        options={{
                                            dateFormat: 'Y-m-d',
                                            position: 'auto left',
                                        }}
                                        className="form-input ltr:rounded-l-none rtl:rounded-r-none"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-between gap-5'>
                            <div className="mb-3 w-1/2">
                                <label htmlFor="executor">
                                    {' '}
                                    {t('executor_task')} <span style={{ color: 'red' }}>* </span>
                                </label>
                                <Select
                                    id='collaborator'
                                    name='collaborator'
                                    options={[{
                                        value: 'Người thực hiện 1',
                                        label: 'Người thực hiện 1'
                                    }, {
                                        value: 'Người thực hiện 2',
                                        label: 'Người thực hiện 2'
                                    }]}
                                    placeholder={'Chọn người thực hiện'}
                                    maxMenuHeight={160}
                                    value={'Nam'}
                                    onChange={e => {
                                        setFieldValue('gender', e)
                                    }}
                                />

                                {submitCount ? errors.executor ? <div className="mt-1 text-danger"> {errors.executor} </div> : null : ''}
                            </div>
                            <div className="mb-3 w-1/2">
                                <label htmlFor="collaborator"> {t('collaborator_task')}</label>

                                <Select
                                    id='collaborator'
                                    name='collaborator'
                                    options={[{
                                        value: 'Người phối hợp 1',
                                        label: 'Người phối hợp 1'
                                    }, {
                                        value: 'Người phối hợp 2',
                                        label: 'Người phối hợp 2'
                                    }]}
                                    placeholder={'Chọn người phối hợp'}
                                    maxMenuHeight={160}
                                    value={'Nam'}
                                    onChange={e => {
                                        setFieldValue('gender', e)
                                    }}
                                />
                            </div>
                        </div>
                        <div className='flex justify-between gap-5'>
                            <div className="mb-3 w-1/2">
                                <label htmlFor="deadline">
                                    {t('deadline_task')} <span style={{ color: 'red' }}>* </span>

                                </label>
                                <div className="flex">
                                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                        <IconCalendar></IconCalendar>
                                    </div>
                                    <Flatpickr
                                        options={{
                                            dateFormat: 'Y-m-d',
                                            position: 'auto left',
                                        }}
                                        className="form-input ltr:rounded-l-none rtl:rounded-r-none"
                                        placeholder={`${t('enter_deadline_task')}`}
                                    />
                                </div>

                                {submitCount ? errors.deadline ? <div className="mt-1 text-danger"> {errors.deadline} </div> : null : ''}
                            </div>
                            <div className="mb-3 w-1/2">
                                <label htmlFor="file">
                                    {' '}
                                    {t('File')} <span style={{ color: 'red' }}>* </span>
                                </label>
                                <Field name="file" type="file" rows="2" id="file" style={{ height: '37.6px' }} placeholder={`${t('enter_description_task')}`} className="form-input" />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="description">
                                {' '}
                                {t('description_task')} <span style={{ color: 'red' }}>* </span>
                            </label>
                            <Field name="description" as="textarea" rows="2" id="description" placeholder={`${t('enter_description_task')}`} className="form-input" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="directive"> {t('directive_task')}</label>
                            <Field name="directive" as="textarea" rows="2" id="directive" placeholder={`${t('enter_directive_task')}`} className="form-input" />
                        </div>
                        {props.data !== undefined && (
                            <div className="mb-3">
                                <label>{t('status_task')}:</label>
                                <div className="mt-3">
                                    <label className="inline-flex cursor-pointer ltr:mr-3 rtl:ml-3">
                                        <Field type="radio" name="status" value="ĐÃ XONG" className="form-radio text-warning" />
                                        <span className="ltr:pl-2 rtl:pr-2">ĐÃ XONG</span>
                                    </label>
                                    <label className="inline-flex cursor-pointer ltr:mr-3 rtl:ml-3">
                                        <Field type="radio" name="status" value="HOÀN THÀNH" className="form-radio text-success" />
                                        <span className="ltr:pl-2 rtl:pr-2">HOÀN THÀNH</span>
                                    </label>
                                    <label className="inline-flex cursor-pointer ltr:mr-3 rtl:ml-3">
                                        <Field type="radio" name="status" value="HUỶ BỎ" className="form-radio text-danger" />
                                        <span className="ltr:pl-2 rtl:pr-2">HUỶ BỎ</span>
                                    </label>
                                </div>
                            </div>
                        )}
                        <div className="mt-8 flex items-center justify-end ltr:text-right rtl:text-left gap-8">
                            <button type="button" className="btn btn-outline-dark cancel-button" onClick={() => handleCancel()}>
                                {t('cancel')}
                            </button>
                            <button type="submit" className="btn :ml-4 rtl:mr-4 add-button" disabled={disabled}>
                                {props.data !== undefined ? t('update') : t('add')}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>

        </div>

    );
};

export default AddNewTask;
