import { useEffect, Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog, Transition } from '@headlessui/react';

import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import Swal from 'sweetalert2';
import { showMessage } from '@/@core/utils';
import IconX from '@/components/Icon/IconX';
import AnimateHeight from 'react-animate-height';
interface Props {
	[key: string]: any;
}

const PersonnelModal = ({ ...props }: Props) => {
	const { t } = useTranslation();
	const [disabled, setDisabled] = useState(false);

	const SubmittedForm = Yup.object().shape({
		name: Yup.string()
			.min(2, 'Too Short!')
			.required(`${t('please_fill_name_staff')}`),
		code: Yup.string()
			.min(2, 'Too Short!')
			.required(`${t('please_fill_staffCode')}`),
	});

	const handleWarehouse = (value: any) => {
		if (props?.data) {
			const reNew = props.totalData.filter((item: any) => item.id !== props.data.id);
			reNew.push({
				id: props.data.id,
				name: value.name,
				code: value.code,
				status: value.status,
			});
			localStorage.setItem('staffList', JSON.stringify(reNew));
			props.setGetStorge(reNew);
			props.setOpenModal(false);
			props.setData(undefined);
			showMessage(`${t('edit_staff_success')}`, 'success');
		} else {
			const reNew = props.totalData;
			reNew.push({
				id: Number(props?.totalData[props?.totalData?.length - 1].id) + 1,
				name: value.name,
				code: value.code,
				status: value.status,
			});
			localStorage.setItem('staffList', JSON.stringify(reNew));
			props.setGetStorge(props.totalData);
			props.setOpenModal(false);
			props.setData(undefined);
			showMessage(`${t('add_staff_success')}`, 'success');
		}
	};

	const handleCancel = () => {
		props.setOpenModal(false);
		props.setData(undefined);
	};
	return (
		<Transition appear show={props.openModal ?? false} as={Fragment}>
			<Dialog as="div" open={props.openModal} onClose={() => props.setOpenModal(false)} className="relative z-50">
				<Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
					<div className="fixed inset-0 bg-[black]/60" />
				</Transition.Child>

				<div className="fixed inset-0 overflow-y-auto">
					<div className="flex min-h-full items-center justify-center px-4 py-8">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<Dialog.Panel className="panel w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark" style={{ maxWidth: '70%' }}>
								<button
									type="button"
									onClick={() => handleCancel()}
									className="absolute top-4 text-gray-400 outline-none hover:text-gray-800 ltr:right-4 rtl:left-4 dark:hover:text-gray-600"
								>
									<IconX />
								</button>
								<div className="bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5 dark:bg-[#121c2c]">
									{props.data !== undefined ? `${t('edit_staff')}` : `${t('add_staff')}`}
								</div>
								<div className="p-5">
									<Formik
										initialValues={{
											name: props?.data ? `${props?.data?.name}` : '',
											code: props?.data ? `${props?.data?.code}` : '',
											surname: props?.data ? `${props?.data?.surname}` : '',
											email: props?.data ? `${props?.data?.email}` : '',
											phone: props?.data ? `${props?.data?.phone}` : '',
											userName: props?.data ? `${props?.data?.userName}` : '',
											othername: props?.data ? `${props?.data?.othername}` : '',
											dateofbirth: props?.data ? `${props?.data?.dateofbirth}` : '',
											sex: props?.data ? `${props?.data?.sex}` : '',
											IDnumber: props?.data ? `${props?.data?.IDnumber}` : '',
											dateissue: props?.data ? `${props?.data?.dateissue}` : '',

										}}
										validationSchema={SubmittedForm}
										onSubmit={(values) => {
											handleWarehouse(values);
										}}
									>
										{({ errors, touched }) => (
											<Form className="space-y-5">
												<div className="mb-5">
													<div className="space-y-2 font-semibold">
														<div className="rounded border border-[#d3d3d3] dark:border-[#1b2e4b]">
															<button type="button" className={`flex w-full items-center p-4 !text-primary text-white-dark dark:bg-[#1b2e4b]`}>
																{t('general_infomation')}
															</button>
															<div>
																<AnimateHeight duration={300} height={'auto'}>
																	<div className="space-y-2 border-t border-[#d3d3d3] p-4 text-[13px] text-white-dark dark:border-[#1b2e4b]">
																		<div className="mb-5">
																			<label htmlFor="code">
																				{' '}
																				{t('code_staff')} <span style={{ color: 'red' }}>* </span>
																			</label>
																			<Field name="code" type="text" id="code" placeholder={`${t('enter_code_staff')}`} className="form-input" />
																			{errors.code ? <div className="mt-1 text-danger"> {errors.code} </div> : null}
																		</div>
																		<div className="mb-5">
																			<label htmlFor="name">
																				{' '}
																				{t('name_staff')} <span style={{ color: 'red' }}>* </span>
																			</label>
																			<Field name="name" type="text" id="name" placeholder={`${t('enter_name_staff')}`} className="form-input" />
																			{errors.name ? <div className="mt-1 text-danger"> {errors.name} </div> : null}
																		</div>
																		<div className="mb-5">
																			<label htmlFor="surname">
																				{' '}
																				Surname and middle name <span style={{ color: 'red' }}>* </span>
																			</label>
																			<Field name="surname" type="text" id="surname" placeholder={`Enter surname and middle name`} className="form-input" />
																			{errors.surname ? <div className="mt-1 text-danger"> {errors.surname} </div> : null}
																		</div>
																		<div className="mb-5">
																			<label htmlFor="email">
																				{' '}
																				Email <span style={{ color: 'red' }}>* </span>
																			</label>
																			<Field name="email" type="text" id="email" placeholder={`Enter email`} className="form-input" />
																			{errors.email ? <div className="mt-1 text-danger"> {errors.email} </div> : null}
																		</div>
																		<div className="mb-5">
																			<label htmlFor="phone">
																				{' '}
																				Phone number <span style={{ color: 'red' }}>* </span>
																			</label>
																			<Field name="phone" type="text" id="phone" placeholder={`Enter phone`} className="form-input" />
																			{errors.phone ? <div className="mt-1 text-danger"> {errors.phone} </div> : null}
																		</div>
																		<div className="mb-5">
																			<label htmlFor="userName">
																				{' '}
																				User name <span style={{ color: 'red' }}>* </span>
																			</label>
																			<Field name="userName" type="text" id="userName" placeholder={`Enter user name`} className="form-input" />
																			{errors.userName ? <div className="mt-1 text-danger"> {errors.userName} </div> : null}
																		</div>
																	</div>
																	<button type="button" className="btn btn-outline-danger" style={{ margin: '18px' }} onClick={() => handleCancel()}>
																		Reset password
																	</button>
																</AnimateHeight>
															</div>
														</div>
														<div className="rounded border border-[#d3d3d3] dark:border-[#1b2e4b]">
															<button type="button" className={`flex w-full items-center p-4 !text-primary text-white-dark dark:bg-[#1b2e4b]`}>
																Personal information
															</button>
															<div>
																<AnimateHeight duration={300} height={'auto'}>
																	<div className="space-y-2 border-t border-[#d3d3d3] p-4 text-[13px] text-white-dark dark:border-[#1b2e4b]">
																		<div className="mb-5">
																			<label htmlFor="othername">
																				{' '}
																				Other name <span style={{ color: 'red' }}>* </span>
																			</label>
																			<Field name="othername" type="text" id="othername" placeholder={`Enter other name`} className="form-input" />
																			{errors.othername ? <div className="mt-1 text-danger"> {errors.othername} </div> : null}
																		</div>
																		<div className="mb-5">
																			<label htmlFor="dateofbirth">
																				{' '}
																				Date of birth <span style={{ color: 'red' }}>* </span>
																			</label>
																			<Field name="dateofbirth" type="text" id="dateofbirth" placeholder={`Enter date of birth`} className="form-input" />
																			{errors.dateofbirth ? <div className="mt-1 text-danger"> {errors.dateofbirth} </div> : null}
																		</div>
																		<div className="mb-5">
																			<label htmlFor="sex">
																				{' '}
																				Sex <span style={{ color: 'red' }}>* </span>
																			</label>
																			<Field name="sex" type="text" id="sex" placeholder={`Enter sex`} className="form-input" />
																			{errors.sex ? <div className="mt-1 text-danger"> {errors.sex} </div> : null}
																		</div>
																		<div className="mb-5">
																			<label htmlFor="IDnumber">
																				{' '}
																				ID number <span style={{ color: 'red' }}>* </span>
																			</label>
																			<Field name="IDnumber" type="text" id="IDnumber" placeholder={`Enter ID number`} className="form-input" />
																			{errors.IDnumber ? <div className="mt-1 text-danger"> {errors.IDnumber} </div> : null}
																		</div>
																		<div className="mb-5">
																			<label htmlFor="dateissue">
																				{' '}
																				Date of issue, place of issue of ID card <span style={{ color: 'red' }}>* </span>
																			</label>
																			<Field name="dateissue" type="text" id="dateissue" placeholder={`Enter date of issue`} className="form-input" />
																			{errors.dateissue ? <div className="mt-1 text-danger"> {errors.dateissue} </div> : null}
																		</div>
																		<div className="mb-5">
																			<label htmlFor="IDnumber">
																				{' '}
																				ID number <span style={{ color: 'red' }}>* </span>
																			</label>
																			<Field name="IDnumber" type="text" id="IDnumber" placeholder={`Enter ID number`} className="form-input" />
																			{errors.IDnumber ? <div className="mt-1 text-danger"> {errors.IDnumber} </div> : null}
																		</div>
																		<div className="mb-5">
																			<label htmlFor="dateissue">
																				{' '}
																				Date of issue, place of issue of ID card <span style={{ color: 'red' }}>* </span>
																			</label>
																			<Field name="dateissue" type="text" id="dateissue" placeholder={`Enter date of issue`} className="form-input" />
																			{errors.dateissue ? <div className="mt-1 text-danger"> {errors.dateissue} </div> : null}
																		</div>
																		<div className="mb-5">
																			<label htmlFor="IDnumber">
																				{' '}
																				ID number <span style={{ color: 'red' }}>* </span>
																			</label>
																			<Field name="IDnumber" type="text" id="IDnumber" placeholder={`Enter ID number`} className="form-input" />
																			{errors.IDnumber ? <div className="mt-1 text-danger"> {errors.IDnumber} </div> : null}
																		</div>
																		<div className="mb-5">
																			<label htmlFor="dateissue">
																				{' '}
																				Date of issue, place of issue of ID card <span style={{ color: 'red' }}>* </span>
																			</label>
																			<Field name="dateissue" type="text" id="dateissue" placeholder={`Enter date of issue`} className="form-input" />
																			{errors.dateissue ? <div className="mt-1 text-danger"> {errors.dateissue} </div> : null}
																		</div>
																		<div className="mb-5">
																			<label htmlFor="IDnumber">
																				{' '}
																				ID number <span style={{ color: 'red' }}>* </span>
																			</label>
																			<Field name="IDnumber" type="text" id="IDnumber" placeholder={`Enter ID number`} className="form-input" />
																			{errors.IDnumber ? <div className="mt-1 text-danger"> {errors.IDnumber} </div> : null}
																		</div>
																		<div className="mb-5">
																			<label htmlFor="dateissue">
																				{' '}
																				Date of issue, place of issue of ID card <span style={{ color: 'red' }}>* </span>
																			</label>
																			<Field name="dateissue" type="text" id="dateissue" placeholder={`Enter date of issue`} className="form-input" />
																			{errors.dateissue ? <div className="mt-1 text-danger"> {errors.dateissue} </div> : null}
																		</div>
																		<div className="mb-5">
																			<label htmlFor="dateissue">
																				{' '}
																				Date of issue, place of issue of ID card <span style={{ color: 'red' }}>* </span>
																			</label>
																			<Field name="dateissue" type="text" id="dateissue" placeholder={`Enter date of issue`} className="form-input" />
																			{errors.dateissue ? <div className="mt-1 text-danger"> {errors.dateissue} </div> : null}
																		</div>
																	</div>
																</AnimateHeight>
															</div>
														</div>
														<div className="rounded border border-[#d3d3d3] dark:border-[#1b2e4b]">
															<button type="button" className={`flex w-full items-center p-4 !text-primary text-white-dark dark:bg-[#1b2e4b]`}>
																Job information
															</button>
															<div>
																<AnimateHeight duration={300} height={'auto'}>
																	<div className="border-t border-[#d3d3d3] p-4 text-[13px] dark:border-[#1b2e4b]"></div>
																</AnimateHeight>
															</div>
														</div>
													</div>
												</div>

												<div className="mt-8 flex items-center justify-end ltr:text-right rtl:text-left">
													<button type="button" className="btn btn-outline-danger" onClick={() => handleCancel()}>
														Cancel
													</button>
													<button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4" disabled={disabled}>
														{props.data !== undefined ? t('update') : t('add')}
													</button>
												</div>
											</Form>
										)}
									</Formik>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
};

export default PersonnelModal;
