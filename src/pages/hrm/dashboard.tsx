import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Dropdown from '../../components/Dropdown';
import { useEffect, useState } from 'react';
import { setPageTitle } from '../../store/themeConfigSlice';
import dynamic from 'next/dynamic';
import IconHorizontalDots from '@/components/Icon/IconHorizontalDots';
import IconTrendingUp from '@/components/Icon/IconTrendingUp';
import IconPlus from '@/components/Icon/IconPlus';
import IconCreditCard from '@/components/Icon/IconCreditCard';
import IconChecks from '@/components/Icon/IconChecks';
import IconFile from '@/components/Icon/IconFile';
import IconServer from '@/components/Icon/IconServer';
import IconChrome from '@/components/Icon/IconChrome';
import IconSafari from '@/components/Icon/IconSafari';
import IconGlobe from '@/components/Icon/IconGlobe';
import IconUsersGroup from '@/components/Icon/IconUsersGroup';
import IconLink from '@/components/Icon/IconLink';
import IconChatDots from '@/components/Icon/IconChatDots';
import IconThumbUp from '@/components/Icon/IconThumbUp';
import IconCaretsDown from '@/components/Icon/IconCaretsDown';
import IconSquareCheck from '@/components/Icon/IconSquareCheck';
import IconClock from '@/components/Icon/IconClock';
import IconMail from '@/components/Icon/IconMail';

import IconUser from "../../components/Icon/IconUser";
import IconMessage2 from "../../components/Icon/IconMessage2";
import IconUsers from "../../components/Icon/IconUsers";
import IconTag from "../../components/Icon/IconTag";
import IconCalendar from "../../components/Icon/IconCalendar";
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});

const DashBoard = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Analytics Admin'));
    });

    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    });
    const lineChart: any = {
        series: [
            {
                name: 'Sales',
                data: [45, 55, 75, 25, 45, 110],
            },
        ],
        options: {
            chart: {
                height: 300,
                type: 'line',
                toolbar: false,
            },
            colors: ['#4361EE'],
            tooltip: {
                marker: false,
                y: {
                    formatter(number: number) {
                        return '$' + number;
                    },
                },
            },
            stroke: {
                width: 2,
                curve: 'smooth',
            },
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June'],
                axisBorder: {
                    color: isDark ? '#191e3a' : '#e0e6ed',
                },
            },
            yaxis: {
                opposite: isRtl ? true : false,
                labels: {
                    offsetX: isRtl ? -20 : 0,
                },
            },
            grid: {
                borderColor: isDark ? '#191e3a' : '#e0e6ed',
                xaxis: {
                    lines: {
                        show: false,
                    },
                },
            },
        },
    };
    const columnChart: any = {
        series: [
            {
                name: 'Revenue',
                data: [76, 85, 101, 98],
            },
        ],
        options: {
            chart: {
                height: 300,
                type: 'bar',
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },
            colors: ['#805dca', '#e7515a'],
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent'],
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    endingShape: 'rounded',
                },
            },
            grid: {
                borderColor: isDark ? '#191e3a' : '#e0e6ed',
                xaxis: {
                    lines: {
                        show: false,
                    },
                },
            },
            xaxis: {
                categories: ['Phòng nhân sự', 'Phòng kế toán', 'Phòng IT', 'Phòng Marketing'],
                axisBorder: {
                    color: isDark ? '#191e3a' : '#e0e6ed',
                },
            },
            yaxis: {
                opposite: isRtl ? true : false,
                labels: {
                    offsetX: isRtl ? -10 : 0,
                },
            },
            tooltip: {
                theme: isDark ? 'dark' : 'light',
                y: {
                    formatter: function (val: any) {
                        return val;
                    },
                },
            },
        },
    };
    const donutChart: any = {
        series: [44, 55, 13],
        options: {
            chart: {
                height: 300,
                type: 'donut',
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },
            stroke: {
                show: false,
            },
            labels: ['Nghỉ phép', 'Thai sản', 'Tăng ca'],
            colors: ['#4361ee', '#805dca', '#e2a03f'],
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200,
                        },
                    },
                },
            ],
            legend: {
                position: 'bottom',
            },
        },
    };
   
    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse mb-6">
                <li>
                    <Link href="#" className="text-primary hover:underline">
                        Trang chủ
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Thống kê nhân sự</span>
                </li>
            </ul>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="panel h-full xl:col-span-2">
                    <div className="w-full sm:w-auto grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                        <button
                            type="button"
                            className={`btn btn-outline-primary flex`}

                        >
                            <IconCalendar className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                            Công
                        </button>

                        <button
                            type="button"
                            className={`btn btn-outline-warning flex`}

                        >
                            <IconUser className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                            Hồ sơ nhân sự
                        </button>

                        <button
                            type="button"
                            className={`btn btn-outline-success flex`}

                        >
                            <IconClock className="ltr:mr-2 rtl:ml-2" />
                            Danh sách tăng ca
                        </button>

                        <button
                            type="button"
                            className={`btn btn-outline-danger flex`}

                        >
                            <IconTag className="ltr:mr-2 rtl:ml-2" />
                            Danh sách quên chấm công
                        </button>
                    </div>
                </div>
                <div className="panel">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light">Tình hình nghỉ theo thời gian</h5>
                    </div>
                    <div className="mb-5">
                        {isMounted && <ReactApexChart series={lineChart.series} options={lineChart.options} className="rounded-lg bg-white dark:bg-black overflow-hidden" type="line" height={300} />}
                    </div>
                </div>
                <div className="panel">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white">Tình hình nghỉ theo phòng ban</h5>
                    </div>
                    <div className="mb-5">
                        {isMounted && <ReactApexChart series={columnChart.series} options={columnChart.options} className="rounded-lg bg-white dark:bg-black overflow-hidden" type="bar" height={300} />}
                    </div>
                </div>
                <div className="panel">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white">Tình hình nhân sự</h5>
                    </div>
                    <p>Tất cả đơn vị</p>

                    <div className="mb-5">
                        {isMounted && <ReactApexChart series={donutChart.series} options={donutChart.options} className="rounded-lg bg-white dark:bg-black overflow-hidden" type="donut" height={300} />}
                    </div>
                </div>
                <div className="panel h-full">
                    <div className="flex items-start justify-between dark:text-white-light mb-5 -mx-5 p-5 pt-0 border-b  border-white-light dark:border-[#1b2e4b]">
                        <h5 className="font-semibold text-lg ">Nhật ký hoạt động</h5>
                        <div className="dropdown">
                            <Dropdown
                                offset={[0, 5]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="hover:text-primary"
                                button={<IconHorizontalDots className="text-black/70 dark:text-white/70 hover:!text-primary" />}
                            >
                                <ul>
                                    <li>
                                        <button type="button">View All</button>
                                    </li>
                                    <li>
                                        <button type="button">Mark as Read</button>
                                    </li>
                                </ul>
                            </Dropdown>
                        </div>
                    </div>
                    <PerfectScrollbar className="perfect-scrollbar relative h-[360px] ltr:pr-3 rtl:pl-3 ltr:-mr-3 rtl:-ml-3">
                        <div className="space-y-7">
                            <div className="flex">
                                <div className="shrink-0 ltr:mr-2 rtl:ml-2 relative z-10 before:w-[2px] before:h-[calc(100%-24px)] before:bg-white-dark/30 before:absolute before:top-10 before:left-4">
                                    <div className="bg-secondary shadow shadow-secondary w-8 h-8 rounded-full flex items-center justify-center text-white">
                                        <IconPlus className="w-4 h-4" />
                                    </div>
                                </div>
                                <div>
                                    <h5 className="font-semibold dark:text-white-light">
                                        New project created :{' '}
                                        <button type="button" className="text-success">
                                            [CSTT Admin Template]
                                        </button>
                                    </h5>
                                    <p className="text-white-dark text-xs">27 Feb, 2020</p>
                                </div>
                            </div>
                            <div className="flex">
                                <div className="shrink-0 ltr:mr-2 rtl:ml-2 relative z-10 before:w-[2px] before:h-[calc(100%-24px)] before:bg-white-dark/30 before:absolute before:top-10 before:left-4">
                                    <div className="bg-success shadow-success w-8 h-8 rounded-full flex items-center justify-center text-white">
                                        <IconMail className="w-4 h-4" />
                                    </div>
                                </div>
                                <div>
                                    <h5 className="font-semibold dark:text-white-light">
                                        Mail sent to{' '}
                                        <button type="button" className="text-white-dark">
                                            HR
                                        </button>{' '}
                                        and{' '}
                                        <button type="button" className="text-white-dark">
                                            Admin
                                        </button>
                                    </h5>
                                    <p className="text-white-dark text-xs">28 Feb, 2020</p>
                                </div>
                            </div>
                            <div className="flex">
                                <div className="shrink-0 ltr:mr-2 rtl:ml-2 relative z-10 before:w-[2px] before:h-[calc(100%-24px)] before:bg-white-dark/30 before:absolute before:top-10 before:left-4">
                                    <div className="bg-primary w-8 h-8 rounded-full flex items-center justify-center text-white">
                                        <IconChecks className="w-4 h-4" />
                                    </div>
                                </div>
                                <div>
                                    <h5 className="font-semibold dark:text-white-light">Server Logs Updated</h5>
                                    <p className="text-white-dark text-xs">27 Feb, 2020</p>
                                </div>
                            </div>
                            <div className="flex">
                                <div className="shrink-0 ltr:mr-2 rtl:ml-2 relative z-10 before:w-[2px] before:h-[calc(100%-24px)] before:bg-white-dark/30 before:absolute before:top-10 before:left-4">
                                    <div className="bg-danger w-8 h-8 rounded-full flex items-center justify-center text-white">
                                        <IconChecks className="w-4 h-4" />
                                    </div>
                                </div>
                                <div>
                                    <h5 className="font-semibold dark:text-white-light">
                                        Task Completed :
                                        <button type="button" className="text-success ml-1">
                                            [Backup Files EOD]
                                        </button>
                                    </h5>
                                    <p className="text-white-dark text-xs">01 Mar, 2020</p>
                                </div>
                            </div>
                            <div className="flex">
                                <div className="shrink-0 ltr:mr-2 rtl:ml-2 relative z-10 before:w-[2px] before:h-[calc(100%-24px)] before:bg-white-dark/30 before:absolute before:top-10 before:left-4">
                                    <div className="bg-warning w-8 h-8 rounded-full flex items-center justify-center text-white">
                                        <IconFile className="w-4 h-4" />
                                    </div>
                                </div>
                                <div>
                                    <h5 className="font-semibold dark:text-white-light">
                                        Documents Submitted from <button type="button">Sara</button>
                                    </h5>
                                    <p className="text-white-dark text-xs">10 Mar, 2020</p>
                                </div>
                            </div>
                            <div className="flex">
                                <div className="ltr:mr-2 rtl:ml-2">
                                    <div className="bg-dark w-8 h-8 rounded-full flex items-center justify-center text-white">
                                        <IconServer className="w-4 h-4" />
                                    </div>
                                </div>
                                <div>
                                    <h5 className="font-semibold dark:text-white-light">Server rebooted successfully</h5>
                                    <p className="text-white-dark text-xs">06 Apr, 2020</p>
                                </div>
                            </div>
                        </div>
                    </PerfectScrollbar>
                </div>
            </div>
        </div>
    );
};

export default DashBoard;
