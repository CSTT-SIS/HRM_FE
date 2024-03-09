import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { useEffect, useState } from 'react';
import { setPageTitle, toggleRTL, toggleLocale } from '../../store/themeConfigSlice';
import Dropdown from '@/components/Dropdown';
import IconCaretDown from '@/components/Icon/IconCaretDown';
import IconInstagram from '@/components/Icon/IconInstagram';
import IconFacebookCircle from '@/components/Icon/IconFacebookCircle';
import IconTwitter from '@/components/Icon/IconTwitter';
import IconGoogle from '@/components/Icon/IconGoogle';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import BlankLayout from '@/components/Layouts/BlankLayout';
import { signIn } from '@/services/apis/auth.api';
import Config from '@/@core/configs';
import Cookies from 'js-cookie';
import { showMessage } from '@/@core/utils';

const LoginBoxed = () => {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(setPageTitle(`${t('login')}`));
	});
	const router = useRouter();

	const submitForm = ({ userName, passWord }: any) => {
		signIn(userName, passWord)
			.then((res: any) => {
				const token = res.data.session;
				const accessTokenKey = Config.Env.NEXT_PUBLIC_X_ACCESS_TOKEN as string;
				Cookies.set(accessTokenKey, token);
				return true;
			})
			.then(() => {
				const returnUrl = (router.query.returnUrl as string) ?? '/';
				router.push(returnUrl).finally(() => {
					setTimeout(() => {
						showMessage(`${t('sign_in_success')}`, 'success');
					}, 300);
				});
			})
			.catch((err: any) => {
				showMessage(`${t('sign_in_error')}`, 'error');
			});
	};
	const SubmittedForm = Yup.object().shape({
		userName: Yup.string().required('Vui lòng nhập tên đăng nhập'),
		passWord: Yup.string().required('Vui lòng nhập mật khẩu'),
	});
	const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

	const themeConfig = useSelector((state: IRootState) => state.themeConfig);
	const setLocale = (flag: string) => {
		setFlag(flag);
		if (flag.toLowerCase() === 'ae') {
			dispatch(toggleRTL('rtl'));
		} else {
			dispatch(toggleRTL('ltr'));
		}
	};
	const [flag, setFlag] = useState('');
	useEffect(() => {
		setLocale(localStorage.getItem('i18nextLng') || themeConfig.locale);
	}, []);

	const { t, i18n } = useTranslation();
	return (
		<div>
			<div className="absolute inset-0">
				<img src="/assets/images/bg.png" alt="image" className="w-full h-full object-cover" />
			</div>
			<div className="relative flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-28 gap-20 ml-8 mr-8" style={{margin: "auto"}}>
                <div className='flex-1 items-center' style={{display: "flex", flexDirection: 'column'}}>
                    <img src='/assets/images/logo_login.png' style={{width: "70%"}} className=''/>
                    {/* <h1 className='company-name mb-2'>vangtat mining</h1> */}
                    <h1 className='welcome uppercase'>{t('welcome')}</h1>
                    <h1 className='welcome-member uppercase'>{t('vangtat_participants')}</h1>
                </div>
				<div className="relative w-full rounded-md p-2 flex-1 form-login-container">
					<div className="relative flex flex-col justify-center rounded-md bg-white/60 px-6 py-20 backdrop-blur-lg dark:bg-black/50 lg:min-h-[70vh]">
						<div className="absolute end-6 top-6">
							<div className="dropdown">
								<Dropdown
									offset={[0, 8]}
									placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
									btnClassName="flex items-center gap-2.5 rounded-lg border border-white-dark/30 bg-white px-2 py-1.5 text-white-dark hover:border-primary hover:text-primary dark:bg-black"
									button={
										<>
                                        <div>
												<img src={`/assets/images/flags/${flag.toUpperCase()}.svg`} alt="image" className="h-5 w-5 rounded-full object-cover" />
											</div>
											<div className="text-base font-bold uppercase">{flag}</div>
											<span className="shrink-0">
												<IconCaretDown />
											</span>
										</>
									}
								>
									<ul className="w-[200px] font-semibold text-dark dark:text-white-dark dark:text-white-light/90 language-list">
										{themeConfig.languageList.map((item: any) => {
											return (
												<li className="language-option" key={item.code}>
													<button
														type="button"
														className={`flex w-full rounded-lg hover:text-primary ${flag === item.code ? 'bg-primary/10 text-primary' : ''}`}
														onClick={() => {
															dispatch(toggleLocale(item.code));
															i18n.changeLanguage(item.code);
															setLocale(item.code);
														}}
													>
														<img src={`/assets/images/flags/${item.code.toUpperCase()}.svg`} alt="flag" className="h-5 w-5 rounded-full object-cover" />
														<span className="ltr:ml-3 rtl:mr-3">{item.name}</span>
													</button>
												</li>
											);
										})}
									</ul>
								</Dropdown>
							</div>
						</div>
						<div className="mx-auto w-full max-w-[440px]">
							<div className="mb-10">
								<h1 className="uppercase !leading-snug sign-in-text !text-center">{t('sign_in')}</h1>
							</div>
							<Formik
								initialValues={{
									userName: '',
									passWord: '',
								}}
								validationSchema={SubmittedForm}
								onSubmit={(value) => submitForm(value)}
							>
								{({ errors, submitCount, touched }) => (
									<Form className="space-y-5 dark:text-white">
										<div className={submitCount ? (errors.userName ? 'has-error' : 'has-success') : ''}>
											<label htmlFor="userName" className='label-login'>
												{t('username')}
											</label>
											<div className="relative text-white-dark">
												<Field
													name="userName"
													data-testid="username"
													id="userName"
													type="text"
													placeholder="Enter username"
													className="form-input placeholder:text-white-dark"
												/>
												{/* <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconUser fill={true} />
                                        </span> */}
												{submitCount ? errors.userName && <div className="mt-1 text-danger">{errors.userName}</div> : ''}
											</div>
										</div>
										<div>
											<p style={{ display: 'flex', justifyContent: 'space-between' }}>
												<label htmlFor="passWord" className='label-login'>
													{t('password')}
												</label>

											</p>
											<div className="relative text-white-dark">
												<Field
													name="passWord"
													data-testid="password"
													id="passWord"
													type="password"
													placeholder="Enter password"
													className="form-input placeholder:text-white-dark"
												/>
												{/* <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconLockDots fill={true} />
                                        </span> */}
												{submitCount ? errors.passWord && <div className="mt-1 text-danger">{errors.passWord}</div> : ''}
											</div>
										</div>

										<button
											type="submit"
											data-testid="submit"
											className="sign-in-btn"
										>
											{t('sign_in')}
										</button>
									</Form>
								)}
							</Formik>
							<div className="relative my-7 md:mb-9 !text-center">
													<Link href="/auth/cover-password-reset">
                                                        <span className='forget-pass-text'>{t('forget_password')}
                                                        </span></Link>
							</div>

						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
LoginBoxed.getLayout = (page: any) => {
	return <BlankLayout>{page}</BlankLayout>;
};
export default LoginBoxed;
