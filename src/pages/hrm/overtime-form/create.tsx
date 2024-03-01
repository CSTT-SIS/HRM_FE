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
import IconBack from '@/components/Icon/IconBack';
import duty_list from '../duty/duty_list.json';
import personnel_list from '../personnel/personnel_list.json';
import shift from '../shift/shift.json';
import { Vietnamese } from "flatpickr/dist/l10n/vn.js"
import TreeSelect from 'rc-tree-select';

interface TreeNode {
  value: string;
  title: string;
  children?: TreeNode[];
}

const treeData = [
  {
    title: 'Phòng Tài chính',
    value: '0-0',
    children: [
      { title: 'Phòng 1', value: '0-0-1' },
      { title: 'Phòng 2', value: '0-0-2' },
    ],
  },
  {
    title: 'Phòng Nhân sự',
    value: '0-1',
  },
];

interface Props {
	[key: string]: any;
}

const OvertimeForm = ({ ...props }: Props) => {
	const { t } = useTranslation();
	const [disabled, setDisabled] = useState(false);
    const [listPersonnel, setListPersonnel] = useState<any>([]);
    const [listDuty, setListDuty] = useState<any>([]);
    const [listShift, setListShift] = useState<any>([]);
    useEffect(() => {
        const listPer = personnel_list?.map((item: any) =>  {
            return {label: item.name, value: item.code}
        });
        setListPersonnel(listPer);

        const listDuty = duty_list?.map((item: any) =>  {
            return {label: item.name, value: item.code}
        });
        setListDuty(listDuty);

        const listShift = shift?.map((item: any) =>  {
            return {label: item.name_shift, value: item.code_shift}
        });
        setListShift(listShift);
    }, []);


	const SubmittedForm = Yup.object().shape({
		name: Yup.object()
			.typeError(`${t('please_choose_name_staff')}`),
        position: Yup.object()
            .typeError(`${t('please_choose_position')}`),
        department: Yup.object()
            .typeError(`${t('please_choose_department')}`),
        submitday: Yup.date().typeError(`${t('please_choose_submit_day')}`),
        fromdate: Yup.date().typeError(`${t('please_choose_from_day')}`),
        enddate: Yup.date().typeError(`${t('please_choose_end_day')}`),
        shift: Yup.date().typeError(`${t('please_choose_shift')}`),
        overtime_time: Yup.number().required(`${t('please_fill_reason')}`)
	});

	const handleDepartment = (value: any) => {
		if (props?.data) {
			const reNew = props.totalData.filter((item: any) => item.id !== props.data.id);
			reNew.push({
				id: props.data.id,
				name: value.name,
				code: value.code,
			});
			localStorage.setItem('departmentList', JSON.stringify(reNew));
			props.setGetStorge(reNew);
			props.setOpenModal(false);
			props.setData(undefined);
			showMessage(`${t('edit_department_success')}`, 'success');
		} else {
			const reNew = props.totalData;
			reNew.push({
				id: Number(props?.totalData[props?.totalData?.length - 1].id) + 1,
				name: value.name,
				code: value.code,
				status: value.status,
			});
			localStorage.setItem('departmentList', JSON.stringify(reNew));
			props.setGetStorge(props.totalData);
			props.setOpenModal(false);
			props.setData(undefined);
			showMessage(`${t('add_department_success')}`, 'success');
		}
	};

	const handleCancel = () => {
		props.setOpenModal(false);
		props.setData(undefined);
	};
	return (

								<div className="p-5">
                                    <div className='flex justify-between header-page-bottom pb-4 mb-4'>
                <h1 className='page-title'>{t('add_overtime_form')}</h1>
                <Link href="/hrm/overtime-form">
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
											name: null,
											code: null,
                                            position: null,
                                            department: null,
                                            submitday: null,
                                            fromdate: null,
                                            enddate: null,
                                            shift: null,
                                            overtime_time: 0
										}}
										validationSchema={SubmittedForm}
										onSubmit={(values) => {
											handleDepartment(values);
										}}
									>
										{({ errors, touched, submitCount, setFieldValue }) => (
											<Form className="space-y-5">
                                                <div className='flex justify-between gap-5'>
                                                <div className="mb-5 w-1/2">
													<label htmlFor="name" className='label'>
														{' '}
														{t('name_staff')} <span style={{ color: 'red' }}>* </span>
													</label>
                                                    <Field
                                                    className="form-input"
                                                            name="name"
                                                            render={({ field }: any) => (
                                                                <>
                                                                    <Select
                                                                        // {...field}
                                                                        options={listPersonnel}
                                                                        isSearchable
                                                                        placeholder={t('choose_name')}
                                                                        maxMenuHeight={150}
                                                                        onChange={(item) => {
                                                                            setFieldValue('name', item)
                                                                        }}
                                                                    />
                                                                </>
                                                            )}
                                                        />
													{submitCount ? errors.name ? <div className="mt-1 text-danger"> {errors.name} </div> : null : ''}
												</div>
												<div className="mb-5 w-1/2">
													<label htmlFor="position" className='label'>
														{' '}
														{t('position')} <span style={{ color: 'red' }}>* </span>
													</label>
                                                    <Field
                                                    className="form-input"
                                                            name="position"
                                                            render={({ field }: any) => (
                                                                <>
                                                                    <Select
                                                                        // {...field}
                                                                        options={listDuty}
                                                                        isSearchable
                                                                        placeholder={t('choose_position')}
                                                                        maxMenuHeight={150}
                                                                        onChange={(item) => {
                                                                            setFieldValue('position', item)
                                                                        }}
                                                                    />
                                                                </>
                                                            )}
                                                        />
                                                        {submitCount ? errors.position ? <div className="mt-1 text-danger"> {errors.department} </div> : null : ''}
												</div>
                                                </div>
                                                <div className='flex justify-between gap-5'>
                                                <div className="mb-5 w-1/2">
													<label htmlFor="department" className='label'>
														{' '}
														{t('department')} <span style={{ color: 'red' }}>* </span>
													</label>
                                                    <Field name="department">
                            {({ field, form }: any) => (
                                <TreeSelect
                                className='form-input'
                                    // style={{ width: '100%' }}
                                    // dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: 10 }}
                                    treeData={treeData}
                                    placeholder={t('choose_department')}
                                    treeDefaultExpandAll
                                    onChange={(value) => setFieldValue('department', value)}
                                />
                            )}
                        </Field>

                                                        {submitCount ? errors.department ? <div className="mt-1 text-danger"> {errors.department} </div> : null : ''}
												</div>
                                                <div className="mb-5 w-1/2">
													<label htmlFor="submitday" className='label'>
														{' '}
														{t('submitday')} <span style={{ color: 'red' }}>* </span>
													</label>
                                                    <Field
                                                            name="submitday"
                                                            render={({ field }: any) => (
                                                                <Flatpickr
                                                                    data-enable-time
                                                                    placeholder={`${t('choose_submit_day')}`}
                                                                    options={{
                                                                        enableTime: true,
                                                                        dateFormat: 'Y-m-d H:i',
                                                                        locale: {
                                                                            ...Vietnamese
                                                                        },
                                                                    }}
                                                                    className="form-input"
                                                                    onChange={(item) => {
                                                                        setFieldValue('submitday', item)
                                                                    }}
                                                                />
                                                            )}
                                                        />
                                                        {submitCount ? errors.submitday ? <div className="mt-1 text-danger"> {errors.submitday} </div> : null : ''}
												</div>
                                                </div>
                                                <div className='flex justify-between gap-5'>
                                                <div className="mb-5 w-1/2">
													<label htmlFor="fromdate" className='label'>
														{' '}
														{t('from_date')} <span style={{ color: 'red' }}>* </span>
													</label>
                                                    <Field
                                                            name="from_date"
                                                            render={({ field }: any) => (
                                                                <Flatpickr
                                                                    data-enable-time
                                                                    placeholder={`${t('choose_from_day')}`}
                                                                    options={{
                                                                        enableTime: true,
                                                                        dateFormat: 'Y-m-d H:i',
                                                                        locale: {
                                                                            ...Vietnamese
                                                                        }
                                                                    }}
                                                                    className="form-input"
                                                                    onChange={(item) => {
                                                                        setFieldValue('fromdate', item)
                                                                    }}
                                                                />
                                                            )}
                                                        />
                                                        {submitCount ? errors.fromdate ? <div className="mt-1 text-danger"> {errors.fromdate} </div> : null : ''}
												</div>
                                                <div className="mb-5 w-1/2">
													<label htmlFor="enddate" className='label'>
														{' '}
														{t('end_date')} <span style={{ color: 'red' }}>* </span>
													</label>
                                                    <Field
                                                            name="end_date"
                                                            render={({ field }: any) => (
                                                                <Flatpickr
                                                                    data-enable-time
                                                                    placeholder={`${t('choose_end_day')}`}
                                                                    options={{
                                                                        enableTime: true,
                                                                        dateFormat: 'Y-m-d H:i',
                                                                        locale: {
                                                                            ...Vietnamese
                                                                        }
                                                                    }}
                                                                    className="form-input"
                                                                    onChange={(item) => {
                                                                        setFieldValue('end_date', item)
                                                                    }}
                                                                />
                                                            )}
                                                        />
                                                        {submitCount ? errors.enddate ? <div className="mt-1 text-danger"> {errors.enddate} </div> : null : ''}
												</div>
                                                </div>
                                                <div className='flex justify-between gap-5'>
                                                <div className="mb-5 w-1/2">
													<label htmlFor="shift" className='label'>
														{' '}
														{t('shift')} <span style={{ color: 'red' }}>* </span>
													</label>
                                                    <Field
                                                        name="shift"
                                                        render={({ field }: any) => (
                                                            <>
                                                                <Select
                                                                    options={listShift}
                                                                    isSearchable
                                                                    placeholder={`${t('choose_shift')}`}
                                                                    onChange={(item) => {
                                                                        setFieldValue('shift', item)
                                                                    }}
                                                                    />

                                                                </>
                                                            )}
                                                        />
                                                        {submitCount ? errors.shift ? <div className="mt-1 text-danger"> {errors.shift} </div> : null : ''}
												</div>


                                                <div className="mb-5 w-1/2">
													<label htmlFor="overtime_time" className='label'>
														{' '}
														{t('overtime_time')} <span style={{ color: 'red' }}>* </span>
													</label>
													<Field name="overtime_time" type="number" id="overtime_time" placeholder={`${t('fill_overtime_time')}`} className="form-input" />
													{submitCount ? errors.overtime_time ? <div className="mt-1 text-danger"> {errors.overtime_time} </div> : null : ''}
												</div>
                                                </div>
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

export default OvertimeForm;
