import { useEffect, Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog, Transition } from '@headlessui/react';

import IconX from '../../../../components/Icon/IconX';
import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import Swal from 'sweetalert2';
import { updateDepartment } from '../../../../services/apis/department';
import { showMessage } from '@/@core/utils';
interface Props {
    open: boolean;
    handleModal: any;
    dataEdit: any;
    getDepartMent: any;
}
const EditDepartmentModal: React.FC<Props> = (props) => {
    const { open, handleModal, dataEdit, getDepartMent } = props;
    const [edit, setEdit] = useState(false)
    const { t } = useTranslation();

    const handleEditDepartment = (value: any) => {
        updateDepartment({
            departmentId: dataEdit.id,
            ...value,
            startDate: new Date()
        }).then(res => {
            if (res.status === true) {
                handleModal()
                getDepartMent()
                showMessage(t('edit_department_success'), 'success')
            } else {
                showMessage(t('edit_department_err'), 'error')
            }

        }).catch(err => {
            showMessage(t('edit_department_err'), 'error')
        })
    };
    const SubmittedForm = Yup.object().shape({
        departmentName: Yup.string().required(`${t('please_fill_name_department')}`),
        departmentCode: Yup.string().required(`${t('please_fill_departmentCode')}`),
        numOfHuman: Yup.number().required(`${t('please_fill_numOfHuman')}`),
    });
    return (
        <div>
        <Transition appear show = { open } as={ Fragment }>
            <Dialog as="div" open = { open } onClose = {() => handleModal()}>
                <Transition.Child
                        as={ Fragment }
enter = "ease-out duration-300"
enterFrom = "opacity-0"
enterTo = "opacity-100"
leave = "ease-in duration-200"
leaveFrom = "opacity-100"
leaveTo = "opacity-0"
    >
    <div className="fixed inset-0" />
        </Transition.Child>
        < div className = "fixed inset-0 z-[999] overflow-y-auto bg-[black]/60" >
            <div className="flex min-h-screen items-start justify-center px-4" >
                <Transition.Child
                                as={ Fragment }
enter = "ease-out duration-300"
enterFrom = "opacity-0 scale-95"
enterTo = "opacity-100 scale-100"
leave = "ease-in duration-200"
leaveFrom = "opacity-100 scale-100"
leaveTo = "opacity-0 scale-95"
    >
    <Dialog.Panel as="div" className = "panel my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark" >
        <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]" >
            <div className="text-lg font-bold" > { t('add_department') } < /div>
                < button type = "button" className = "text-white-dark hover:text-dark" onClick = {() => {
    setEdit(false)
    handleModal()
}}>
    <IconX />
    < /button>
    < /div>
    < div className = "p-5" >
        <Formik
                                            initialValues={
    {
        departmentName: `${dataEdit.departmentName}`,
            departmentCode: `${dataEdit.departmentCode}`,
                numOfHuman: dataEdit.numOfHuman,
                                            }
}

validationSchema = { SubmittedForm }
onSubmit = { values => {
    // same shape as initial values
    handleEditDepartment(values)
}}
                                        >
    {({ errors, submitCount, touched }) => (
        <Form className= "space-y-5" >
        <div className={ submitCount ? (errors.departmentName ? 'has-error' : 'has-success') : '' }>
            <label htmlFor="departmentName" > { t('name_department') } < span style = {{ color: 'red' }}>* </span></label >
                <Field name="departmentName" type = "text" id = "departmentName" placeholder = {`${t('enter_name_department')}`} className = "form-input" disabled = {!edit} style = {{ backgroundColor: edit === true ? 'white' : '#E7E9EB' }}/>
{ submitCount ? errors.departmentName ? <div className="text-danger mt-1" > { errors.departmentName } < /div> : <div className="text-success mt-1"></div > : '' }
</div>
    < div className = { submitCount?(errors.departmentCode ? 'has-error' : 'has-success') : ''} >
        <label htmlFor="departmentCode" > { t('code_department') } < span style = {{ color: 'red' }}>* </span></label >
            <Field name="departmentCode" type = "text" id = "departmentCode" placeholder = {`${t('enter_code_department')}`} className = "form-input" disabled = {!edit} style = {{ backgroundColor: edit === true ? 'white' : '#E7E9EB' }}/>
{ submitCount ? errors.departmentCode ? <div className="text-danger mt-1" > { errors.departmentCode } < /div> : <div className="text-success mt-1"></div > : '' }
</div>
    < div className = { submitCount?(errors.numOfHuman ? 'has-error' : 'has-success') : ''} >
        <label htmlFor="numOfHuman" > { t('num_human') } < span style = {{ color: 'red' }}>* </span></label >
            <Field name="numOfHuman" type = "number" id = "numOfHuman" placeholder = {`${t('enter_numhuman')}`} className = "form-input" disabled = {!edit} style = {{ backgroundColor: edit === true ? 'white' : '#E7E9EB' }}/>
{ submitCount ? errors.numOfHuman ? <div className="text-danger mt-1" > { errors.numOfHuman } < /div> : <div className="text-success mt-1"></div > : '' }
</div>
    < div className = "mt-8 flex items-center justify-center" >
    {
        edit === false ? <button type="button" className = "btn btn-primary" onClick = {() => setEdit(true)}>
            { t('edit') }
            < /button> : <>
            < button type = "button" className = "btn btn-outline-danger" onClick = {() => {
    handleModal()
    setEdit(false)
}}>
    { t('discard') }
    < /button>
    < button
type = "submit"
className = "btn btn-primary ltr:ml-4 rtl:mr-4"
    >
    { t('save') }
    < /button></ >
                                                        }

</div>

    < /Form>
                                            )}
</Formik>
    < /div>
    < /Dialog.Panel>
    < /Transition.Child>
    < /div>
    < /div>
    < /Dialog>
    < /Transition>
    < /div>
    );
};

export default EditDepartmentModal;
