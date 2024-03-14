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
import IconBack from '@/components/Icon/IconBack';
import duty_list from '../duty/duty_list.json';
import personnel_list from '../personnel/personnel_list.json';
import shift from '../shift/shift.json';
import { Vietnamese } from "flatpickr/dist/l10n/vn.js"
import DropdownTreeSelect from "react-dropdown-tree-select";
import "react-dropdown-tree-select/dist/styles.css";
import { getCurrentFormattedTime } from '@/utils/commons';


interface TreeNode {
    label: string;
    checked: boolean;
    children?: TreeNode[];
  }
const treeData = [
  {
    label: 'Phòng Tài chính',
    value: '0-0',
    children: [
      { label: 'Phòng 1', value: '0-0-1' },
      { label: 'Phòng 2', value: '0-0-2' },
    ],
  },
  {
    label: 'Phòng Nhân sự',
    value: '0-1',
  },
];


interface Props {
	[key: string]: any;
}

const LateEarlyFormModal = ({ ...props }: Props) => {
	const { t } = useTranslation();
	const [disabled, setDisabled] = useState(false);
    const [listPersonnel, setListPersonnel] = useState<any>([]);
    const [listDuty, setListDuty] = useState<any>([]);
    const [listShift, setListShift] = useState<any>([]);
    const [department, setDepartment] = useState<any>({});
    const [treeDataState, setTreeDataState] = useState<any>(treeData)

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
        checker: Yup.object()
			.typeError(`${t('please_choose_name_checker')}`),
        position: Yup.object()
            .typeError(`${t('please_choose_duty')}`),
        department: Yup.object()
            .typeError(`${t('please_choose_department')}`),
        submitday: Yup.date().typeError(`${t('please_choose_submit_day')}`),
        fromdate: Yup.date().typeError(`${t('please_choose_from_day')}`),
        enddate: Yup.date().typeError(`${t('please_choose_end_day')}`),
        shift: Yup.date().typeError(`${t('please_choose_shift')}`),
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

    const handleChangeTreeData = (selectedNodes: { label: string }[]) => {
        setTreeDataState((tree: TreeNode[]) => {
          const newTree = tree;
          const selectedNodesLabels = selectedNodes.map((e) => e.label);

          function recursiveFindAndUpdateTree(some_tree: TreeNode[] | undefined): void {
            if (!some_tree || some_tree.length === 0) return;
            some_tree.forEach((e) => {
              if (selectedNodesLabels.includes(e.label)) {
                e.checked = true;
              } else {
                e.checked = false;
              }
              recursiveFindAndUpdateTree(e.children);
            });
          }

          recursiveFindAndUpdateTree(newTree);
          return newTree;
        });
      }
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
											name: "Nguyễn Văn A",
											code: null,
                                            position: "Trưởng phòng",
                                            department: "Phòng Tài chính",
                                            submitday: getCurrentFormattedTime(),
                                            fromdate: null,
                                            enddate: null,
                                            shift: null,
                                            checker: null
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
                                                <Field disabled
                                                className="form-input"
                                                        name="name"
                                                        id="name"
                                                        placeholder={t('please_choose_name_staff')}
                                                    />
                                               {submitCount ? (
    errors.name ? <div className="mt-1 text-danger">{errors.name}</div> : null
  ) : null}
                                            </div>
                                            <div className="mb-5 w-1/2">
                                                <label htmlFor="position" className='label'>
                                                    {' '}
                                                    {t('duty')} <span style={{ color: 'red' }}>* </span>
                                                </label>
                                                <Field disabled
                                                className="form-input"
                                                        name="position"
                                                        id="position"
                                                    />
                                                    {submitCount ? errors.position ? <div className="mt-1 text-danger"> {errors.position} </div> : null : ''}
                                            </div>
                                            </div>
                                            <div className='flex justify-between gap-5'>
                                            <div className="mb-5 w-1/2">
                                                <label htmlFor="department" className='label'>
                                                    {' '}
                                                    {t('department')} <span style={{ color: 'red' }}>* </span>
                                                </label>
                                                <Field
                                                            name="department"
                                                            disabled
                                                            type="text"
                                                            className="form-input"
                                                            />

                                                    {submitCount ? errors.department ? <div className="mt-1 text-danger"> {errors.department} </div> : null : ''}
                                            </div>
                                            <div className="mb-5 w-1/2">
                                                <label htmlFor="submitday" className='label'>
                                                    {' '}
                                                    {t('submitday')} <span style={{ color: 'red' }}>* </span>
                                                </label>
                                                <Field
                                                        name="submitday"
                                                        type="date"
                                                        className="form-input"
                                                    />
                                                    {submitCount ? errors.submitday ? <div className="mt-1 text-danger"> {errors.submitday} </div> : null : ''}
                                            </div>
                                            </div>
                                            <div className='flex justify-between gap-5'>
                                            <div className="mb-5 w-1/2">
                                                <label htmlFor="fromdate" className='label'>
                                                    {' '}
                                                    {t('from_time')} <span style={{ color: 'red' }}>* </span>
                                                </label>
                                                <Field
                                                        name="from_time"
                                                        type="time"
                                                        className="form-input"
                                                    />
                                                    {submitCount ? errors.fromdate ? <div className="mt-1 text-danger"> {errors.fromdate} </div> : null : ''}
                                            </div>
                                            <div className="mb-5 w-1/2">
                                                <label htmlFor="enddate" className='label'>
                                                    {' '}
                                                    {t('end_time')} <span style={{ color: 'red' }}>* </span>
                                                </label>
                                                <Field
                                                        name="end_date"
                                                        type="time"
                                                        className="form-input"
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
                                                <label htmlFor="checker" className='label'>
                                                    {' '}
                                                    {t('checker_name')} <span style={{ color: 'red' }}>* </span>
                                                </label>
                                                <Field
                                                className="form-input"
                                                        name="checker"
                                                        render={({ field }: any) => (
                                                            <>
                                                                <Select
                                                                    // {...field}
                                                                    options={listPersonnel}
                                                                    isSearchable
                                                                    placeholder={t('choose_checker')}
                                                                    maxMenuHeight={150}
                                                                    onChange={(item) => {
                                                                        setFieldValue('checker', item)
                                                                    }}
                                                                />
                                                            </>
                                                        )}
                                                    />
                                               {submitCount ? (
    errors.checker ? <div className="mt-1 text-danger">{errors.checker}</div> : null
  ) : null}
                                            </div>

                                            </div>
                                            <div className="mt-8 flex items-center justify-end ltr:text-right rtl:text-left gap-8">
                                                <button type="button" className="btn btn-outline-dark cancel-button" onClick={() => handleCancel()}>
                                                    {t('cancel')}
                                                </button>
                                                <button type="submit" className="btn :ml-4 rtl:mr-4 add-button" disabled={disabled}>
                                                    {t('save')}
                                                </button>
                                            </div>

                                        </Form>
										)}
									</Formik>
								</div>

	);
}

export default LateEarlyFormModal;
