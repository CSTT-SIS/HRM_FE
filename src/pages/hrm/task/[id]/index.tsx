import { useEffect, Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog, Transition } from '@headlessui/react';
import { useRouter } from 'next/router';
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
import task_list from '../task_list.json';
import { getCurrentFormattedTime } from '@/utils/commons';
import personel_list from '../../personnel/personnel_list.json';
interface Props {
    [key: string]: any;
}

const AddNewTask = ({ ...props }: Props) => {
    const { t } = useTranslation();
    const [disabled, setDisabled] = useState(false);
    const [query, setQuery] = useState<any>();
    const router = useRouter()
    const [listPersonnel, setListPersonnel] = useState<any>();
    const [typeShift, setTypeShift] = useState("0"); // 0: time, 1: total hours
    const { data: departmentparents } = ProductCategorys(query);
    const { data: manages } = Providers(query);
    const [detail, setDetail] = useState<any>();

    const departmentparent = departmentparents?.data.filter((item: any) => {
        return (
            item.value = item.id,
            item.label = item.name,
            delete item.createdAt
        )
    })
    useEffect(() => {
        if (Number(router.query.id)) {
            const detailData = task_list?.find(d => d.id === Number(router.query.id));
            setDetail(detailData);
        }
    }, [router])
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
    useEffect(() => {
        const list_per = personel_list?.map((e: any) => {
            return { label: e.name, value: e.code }
        })
        setListPersonnel(list_per)
    }, [])
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
                <h1 className='page-title'>{t('edit_task')}</h1>
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
                    name: detail ? `${detail?.name}` : '',
                    creator: detail ? `${detail?.creator}` : '',
                    executor: detail ? listPersonnel?.find((e: any) => e.label === detail?.executor) : {},
                    collaborator: detail ? listPersonnel?.filter((e: any) => e.label === detail?.collaborator) : [],
                    description: detail ? `${detail?.description}` : '',
                    deadline: detail ? `${detail?.deadline}` : '',
                    directive: detail ? `${detail?.directive}` : '',
                    color: detail ? `${detail?.color}` : 'info',
                    status: detail ? `${detail?.status}` : 'ĐANG THỰC HIỆN',
                    attachment: detail ? `${detail?.attachment}` : '',
                    date_create: detail ? `${detail?.date_create}` : getCurrentFormattedTime()
                }}
                enableReinitialize
                validationSchema={SubmittedForm}
                onSubmit={(values) => {
                    handleTask(values);
                }}
            >
                {({ errors, values, setFieldValue, submitCount }) => (
                    <Form className="space-y-5">
                        <div className="flex justify-between gap-5">
                            <div className="mb-3 w-1/2">
                                <label htmlFor="date_create">
                                    {' '}
                                    {t('date_create')} <span style={{ color: 'red' }}>* </span>
                                </label>
                                <Field autoComplete="off" type="date" name="date_create" id="date_create" className="form-input" disabled>
                                </Field>

                            </div>

                            <div className="mb-3 w-1/2">
                                <label htmlFor="creator">
                                    {' '}
                                    {t('creator_task')} <span style={{ color: 'red' }}>* </span>
                                </label>
                                <Field autoComplete="off" type="text" name="creator" id="creator" className="form-input" disabled style={{ color: 'gray' }}>
                                </Field>
                                {submitCount ? errors.creator ? <div className="mt-1 text-danger"> {errors.creator} </div> : null : ''}
                            </div>
                        </div>
                        <div className='flex justify-between gap-5'>
                            <div className="mb-3 w-1/2">
                                <label htmlFor="name">
                                    {' '}
                                    {t('name_task')} <span style={{ color: 'red' }}>* </span>
                                </label>
                                <Field autoComplete="off" name="name" type="text" id="name" placeholder={`${t('enter_name_task')}`} className="form-input" />
                                {submitCount ? errors.name ? <div className="mt-1 text-danger"> {errors.name} </div> : null : ''}
                            </div>


                            <div className="mb-3 w-1/2">
                                <label htmlFor="deadline">
                                    {t('deadline_task')} <span style={{ color: 'red' }}>* </span>

                                </label>
                                <Flatpickr
                                    options={{
                                        enableTime: true,
                                        dateFormat: "d-m-Y H:i",
                                        time_24hr: true
                                    }}
                                    className="form-input calender-input"
                                    placeholder={`${t('enter_deadline_task')}`}

                                />
                                {submitCount ? errors.deadline ? <div className="mt-1 text-danger"> {errors.deadline} </div> : null : ''}
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
                                    options={listPersonnel}
                                    placeholder={'Chọn người thực hiện'}
                                    maxMenuHeight={160}
                                    onChange={e => {
                                        setFieldValue('gender', e)
                                    }}
                                />

                                {submitCount ? errors.executor ? <div className="mt-1 text-danger"> {`${errors.executor}`} </div> : null : ''}
                            </div>
                            <div className="mb-3 w-1/2">
                                <label htmlFor="collaborator"> {t('collaborator_task')}</label>

                                <Select
                                    id='collaborator'
                                    name='collaborator'
                                    options={listPersonnel}
                                    placeholder={'Chọn người phối hợp'}
                                    maxMenuHeight={160}
                                    onChange={e => {
                                        setFieldValue('gender', e)
                                    }}
                                    isMulti={true}
                                />
                            </div>
                        </div>


                        <div className='flex justify-between gap-5'>
                            <div className="mb-3 w-1/2">
                                <label htmlFor="file">
                                    {' '}
                                    {t('file')} <span style={{ color: 'red' }}>* </span>
                                </label>
                                <Field autoComplete="off" name="file" type="file" rows="2" id="file" style={{ height: '37.6px' }} placeholder={`${t('enter_description_task')}`} className="form-input" />
                            </div>
                            <div className="mb-3 w-1/2">
                                <label htmlFor="project">
                                    {' '}
                                    {t('project')} <span style={{ color: 'red' }}>* </span>
                                </label>
                                <Field autoComplete="off" name="project" type="project" rows="2" id="project" style={{ height: '37.6px' }} placeholder={`${t('enter_project')}`} className="form-input" />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description">
                                {' '}
                                {t('description_task')} <span style={{ color: 'red' }}>* </span>
                            </label>
                            <Field autoComplete="off" name="description" as="textarea" rows="2" id="description" placeholder={`${t('enter_description_task')}`} className="form-input" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="directive"> {t('directive_task')}</label>
                            <Field autoComplete="off" name="directive" as="textarea" rows="2" id="directive" placeholder={`${t('enter_directive_task')}`} className="form-input" />
                        </div>
                        {props.data !== undefined && (
                            <div className="mb-3">
                                <label>{t('status_task')}:</label>
                                <div className="mt-3">
                                    <label className="inline-flex cursor-pointer ltr:mr-3 rtl:ml-3">
                                        <Field autoComplete="off" type="radio" name="status" value="ĐÃ XONG" className="form-radio text-warning" />
                                        <span className="ltr:pl-2 rtl:pr-2">ĐÃ XONG</span>
                                    </label>
                                    <label className="inline-flex cursor-pointer ltr:mr-3 rtl:ml-3">
                                        <Field autoComplete="off" type="radio" name="status" value="HOÀN THÀNH" className="form-radio text-success" />
                                        <span className="ltr:pl-2 rtl:pr-2">HOÀN THÀNH</span>
                                    </label>
                                    <label className="inline-flex cursor-pointer ltr:mr-3 rtl:ml-3">
                                        <Field autoComplete="off" type="radio" name="status" value="HUỶ BỎ" className="form-radio text-danger" />
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
