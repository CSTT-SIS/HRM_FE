import { useEffect, Fragment, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
// Third party libs
import * as Yup from 'yup';
import 'tippy.js/dist/tippy.css';
import { useTranslation } from 'react-i18next';
// API
import { Permissions } from '@/services/swr/role.twr';
// helper
import { showMessage } from '@/@core/utils';
// icons
import { IconLoading } from '@/components/Icon/IconLoading';
import { Formik, Form, Field } from 'formik';
import { CreateRole, EditRole, GetRole } from '@/services/apis/role.api';

// modal



interface Props {
    [key: string]: any;
}

const RoleDetailPage = ({ ...props }: Props) => {

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const router = useRouter();

    const [showLoader, setShowLoader] = useState(true);
    const [data, setData] = useState<any>();
    const [checked, setChecked] = useState<any>([]);
    const [checkAll, setCheckAll] = useState<any>(false);
    const [dataPermission, setDataPermission] = useState<any>();
    // get data
    const { data: permission } = Permissions({ perPage: 0, ...router.query });

    const SubmittedForm = Yup.object().shape({
        name: Yup.string().required(`${t('please_fill_name_role')}`),
    });

    useEffect(() => {
        dispatch(setPageTitle(`${t('role')}`));
    });

    useEffect(() => {
        setShowLoader(false);
        setDataPermission(permission?.data?.reduce(
            (h: any, permission: any) =>
                Object.assign(h, {
                    [permission.type]: (h[permission.type] || [])
                        .concat({ ...permission })
                }), {})
        )
    }, [permission]);

    useEffect(() => {
        GetRole({ id: router.query.id }).then((res) => {
            setData(res.data);
            setChecked(res.data.permissionIds);
        }).catch((err: any) => {
        });
    }, [router.query.id]);

    useEffect(() => {
        if (checked.length === permission?.data.length) {
            setCheckAll(true);
        } else {
            setCheckAll(false);
        }
    }, [checked, permission]);

    const handleRole = (param: any) => {
        if (data && data?.id !== 'create') {
            EditRole({ id: router.query.id, ...param }).then(() => {
                showMessage(`${t('edit_role_success')}`, 'success');
                router.push('/hrm/role');
            }).catch((err) => {
                showMessage(`${t('edit_role_error')}`, 'error');
            });
        } else {
            CreateRole(param).then(() => {
                showMessage(`${t('create_role_success')}`, 'success');
                router.push('/hrm/role');
            }).catch((err) => {
                showMessage(`${t('create_role_error')}`, 'error');
            });
        }
    }

    const handleChecked = (permissionId: any, values: any) => {
        setData({
            id: router.query.id,
            name: values.name,
            description: values.description
        })
        setChecked(
            checked?.includes(permissionId)
                ? checked.filter((item: any) => item !== permissionId)
                : [...checked, permissionId]
        );
    }
    const handleCheckAll = (e: any) => {
        if (checkAll === false) {
            const permissionIds = permission?.data
                .map((item: any) => item.id)
            setChecked(permissionIds);
            setCheckAll(true);
        } else {
            setChecked([]);
            setCheckAll(false);
        }
    };

    return (
        <div>
            {showLoader && (
                <div className="screen_loader fixed inset-0 bg-[#fafafa] dark:bg-[#060818] z-[60] grid place-content-center animate__animated">
                    <IconLoading />
                </div>
            )}
            <title>role</title>
            <div >
                <Formik
                    initialValues={{
                        name: data ? data.name : "",
                        description: data ? data.description : "",
                        permissionIds: checked ? checked : []
                    }}
                    validationSchema={SubmittedForm}
                    onSubmit={values => {
                        handleRole(values);
                    }}
                    enableReinitialize
                >

                    {({ errors, values, setFieldValue }) => (
                        <Form>
                            <div className="space-y-5 panel mt-6">
                                <div className="flex md:items-center justify-between md:flex-row flex-col mb-4.5 gap-5">
                                    <div className="text-2xl">Role details</div>
                                    <div className="flex items-center justify-between flex-row gap-1">
                                        <button type="submit" className="btn btn-primary btn-sm m-1 text-lg px-4" >
                                            {t('Save')}
                                        </button>
                                        <button
                                            type="button"
                                            className="text-lg bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1.5 px-4 rounded inline-flex items-center"
                                            onClick={e => router.push('/hrm/role')}
                                        >
                                            {t('Back')}
                                        </button>
                                    </div>
                                </div>
                                <div className="mb-5" >
                                    <label htmlFor="name" > {t('name_role')} < span style={{ color: 'red' }}>* </span></label >
                                    <Field
                                        name="name"
                                        type="text"
                                        id="name"
                                        placeholder={`${t('enter_name_role')}`}
                                        className="form-input"
                                    />
                                    {errors.name ? (
                                        <div className="text-danger mt-1"> {`${errors.name}`} </div>
                                    ) : null}
                                </div>
                                <div className="mb-5">
                                    <label htmlFor="description" > {t('description')}</label >
                                    <Field
                                        name="description"
                                        component="textarea"
                                        id="description"
                                        placeholder={`${t('enter_description')}`}
                                        className="form-input"
                                    />
                                </div>
                            </div>
                            <div className="space-y-5 panel mt-6">
                                <div className='flex items-center justify-between flex-row border-b-2 border-current leading-10 py-2'>
                                    <div className="text-2xl">Permissions</div>
                                    <label className='flex items-center justify-between'>
                                        <Field
                                            className="mr-2"
                                            type="checkbox"
                                            onChange={(e: any) => handleCheckAll(e)}
                                            checked={checkAll}
                                        />
                                        check all
                                    </label>
                                </div>
                                {
                                    dataPermission && Object.keys(dataPermission).map((key: any) => {
                                        return (
                                            <div className="mb-5" key={key}>
                                                <label className="text-xl mb-4"> {t(key)}</label>
                                                <div className="grid grid-cols-4 gap-4 pl-2.5">
                                                    {
                                                        dataPermission[key].map((item: any) => {
                                                            return (
                                                                <label key={item} className='basis-1/4'>
                                                                    <Field
                                                                        className="mr-2"
                                                                        type="checkbox"
                                                                        name="permissionIds"
                                                                        value={item.id}
                                                                        checked={checked?.includes(item.id)}
                                                                        onChange={(e: any) => handleChecked(Number(e.target.value), values)}
                                                                    />
                                                                    {item.name}
                                                                </label>
                                                            )
                                                        })
                                                    }
                                                </div>
                                                {/* {
                                                        dataPermission[key].map((item: any) => {
                                                            return (
                                                                <label key={item} className='basis-1/4'>
                                                                    <Field
                                                                        className="mr-2"
                                                                        type="checkbox"
                                                                        name="permissionIds"
                                                                        value={item.id}
                                                                        checked={checked?.includes(item.id)}
                                                                        onChange={(e: any) => handleChecked(Number(e.target.value), values)}
                                                                    />
                                                                    {item.name}
                                                                </label>
                                                            )
                                                        })
                                                    } */}
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default RoleDetailPage;
