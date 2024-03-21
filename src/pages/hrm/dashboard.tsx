import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Dropdown from '../../components/Dropdown';
import { useEffect, useState } from 'react';
import { setPageTitle } from '../../store/themeConfigSlice';
import dynamic from 'next/dynamic';
import { DataTable } from 'mantine-datatable';

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
                name: 'Số lượng',
                data: [14, 50, 13, 23],
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
            colors: ['#C8102E', '#FFCD00', '#9CD3EB', '#002868'],
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
                    distributed: true,
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
            legend: {
                show: false
            },
            xaxis: {
                categories: ['Phòng Hành chính', 'Phòng Kế hoạch', 'Phòng Kỹ thuật', 'Khai thác'],
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
    const columnChart1: any = {
        series: [
            {
                name: 'Revenue',
                data: [76, 85, 101, 98, 67],
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
            colors: ['#C8102E', '#FFCD00', '#9CD3EB', '#002868', '#476704'],
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
                    distributed: true,

                },
            },
            legend: {
                show: false
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
                categories: ['Kho nhà máy', 'Kho garage', 'Kho mìn', 'Kho hành chính', 'Kho xăng dầu'],
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
    const barChart: any = {
        series: [{
            name: 'Tốt',
            data: [44, 55, 57, 56]
        }, {
            name: 'Đạt',
            data: [76, 85, 101, 98]
        }, {
            name: 'Chưa đạt',
            data: [35, 41, 36, 26]
        }],
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
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 1,
            },
            colors: ['#002868', '#C8102E', '#FFCD00'],

            xaxis: {
                categories: ['Phòng Hành chính', 'Phòng Kế toán', 'Phòng Kỹ thuật', 'Bộ phận bảo trì'],
                axisBorder: {
                    color: isDark ? '#191e3a' : '#e0e6ed',
                },
            },
            yaxis: {
                opposite: isRtl ? true : false,
                reversed: isRtl ? true : false,
            },
            grid: {
                borderColor: isDark ? '#191e3a' : '#e0e6ed',
            },
            fill: {
                opacity: 0.8,
            },
            legend: {
                position: 'top',
            },
        },
    };
    const donutChart: any = {
        series: [1143, 25, 3],
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
            plotOptions: {
                pie: {
                    donut: {
                        labels: {
                            show: true,

                            total: {
                                showAlways: true,
                                show: true,

                            }
                        }
                    }
                }
            },
            labels: ['Nhân viên', 'Tổ trưởng', 'Trưởng phòng'],
            colors: ['#C8102E', '#FFCD00', '#002868'],
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
    const quaterChart: any = {
        series: [44, 55, 13],
        options: {
            chart: {
                width: 700,
                type: 'pie',
            },
            grid: {
                padding: {
                    top: 0,
                    bottom: -220,
                }
            },
            plotOptions: {
                pie: {
                    startAngle: -90,
                    endAngle: 0.1,
                }
            },
            labels: ['Chuyên viên', 'Quản lý', 'Trưởng bộ phận'],
            colors: ['#C8102E', '#FFCD00', '#002868'],
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 300,
                        },
                    },
                },
            ],
            legend: {
                position: 'left',
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

                <div className="panel  h-full xl:col-span-2">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light">Cơ cấu nhân sự</h5>
                    </div>
                    <div className="w-full sm:w-auto grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">

                        <div className="flex border-r justify-around">
                            <div className="flex shrink-0 items-center justify-center" style={{ width: '128px' }}>
                                <img className="object-cover" src="/assets/images/vietnam.gif" alt="flag"></img>
                            </div>
                            <div className="font-semibold ltr:ml-3 rtl:mr-3">
                                <h5 className="text-[#082819]" style={{ fontSize: '14px', fontWeight: '700' }}>VIỆT NAM</h5>
                                <p className="text-[#C8102E]" style={{ fontSize: '40px', fontWeight: '700', lineHeight: '50px' }}>790</p>
                                <h5 className="text-[#082819]" style={{ fontSize: '14px', fontWeight: '400' }}>Nhân sự</h5>

                            </div>
                        </div>
                        <div className="flex border-r justify-around">
                            <div className="flex shrink-0 items-center justify-center" style={{ width: '128px' }}>
                                <img className="object-cover" src="/assets/images/lao.gif" alt="flag"></img>
                            </div>
                            <div className="font-semibold ltr:ml-3 rtl:mr-3">
                                <h5 className="text-[#082819]" style={{ fontSize: '14px', fontWeight: '700' }}>LÀO</h5>
                                <p className="text-[#002868]" style={{ fontSize: '40px', fontWeight: '700', lineHeight: '50px' }}>426</p>
                                <h5 className="text-[#082819]" style={{ fontSize: '14px', fontWeight: '400' }}>Nhân sự</h5>

                            </div>
                        </div>
                        <div className="flex justify-around">
                            <div className="flex shrink-0 items-center justify-center" style={{ width: '128px' }}>
                                <img className="object-cover" src="/assets/images/quocte.gif" alt="flag"></img>
                            </div>
                            <div className="font-semibold ltr:ml-3 rtl:mr-3">
                                <h5 className="text-[#082819]" style={{ fontSize: '14px', fontWeight: '700' }}>QUỐC TẾ</h5>
                                <p className="text-[#476704]" style={{ fontSize: '40px', fontWeight: '700', lineHeight: '50px' }}>10</p>
                                <h5 className="text-[#082819]" style={{ fontSize: '14px', fontWeight: '400' }}>Nhân sự</h5>

                            </div>
                        </div>
                    </div>
                    <div className="w-full h-4 bg-[#ebedf2] dark:bg-dark/40 rounded-full flex" style={{ height: '8px', marginTop: '20px' }}>
                        <div className="bg-[#C8102E] h-4 rounded-full w-7/12 text-center text-white text-xs" style={{ height: '8px' }}></div>
                        <div className="bg-[#002868] h-4 rounded-full w-4/12 text-center text-white text-xs" style={{ height: '8px' }}></div>
                        <div className="bg-[#476704] h-4 rounded-full  w-1/12 text-center text-white text-xs" style={{ height: '8px' }}></div>
                    </div>
                </div>
                <div className="panel">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white">Số lượng nhân sự theo phòng ban</h5>
                    </div>
                    <div className="mb-5">
                        {isMounted && <ReactApexChart series={columnChart.series} options={columnChart.options} className="rounded-lg bg-white dark:bg-black overflow-hidden" type="bar" height={300} width={"100%"} />}
                    </div>
                </div>
                <div className="panel">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white">Tình hình nhân sự</h5>
                    </div>
                    <p>Tất cả đơn vị</p>

                    <div className="mb-5" style={{ zIndex: '9999999', position: "relative" }}>
                        {isMounted && <ReactApexChart series={donutChart.series} options={donutChart.options} className="rounded-lg bg-white dark:bg-black overflow-hidden" type="donut" height={300} width={"100%"} />}
                    </div>
                </div>
                <div className="panel">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white">Tình trạng giải quyết công việc</h5>
                    </div>
                    <div className="mb-5">
                        {isMounted && <ReactApexChart series={quaterChart.series} options={quaterChart.options} className="rounded-lg bg-white dark:bg-black overflow-hidden" type="pie" height={300} width={700} />}

                    </div>
                </div>
                <div className="panel">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light">Thống kê nhiệm vụ theo phòng ban</h5>
                    </div>
                    <div className="mb-5">
                        {isMounted && <ReactApexChart series={barChart.series} options={barChart.options} className="rounded-lg bg-white dark:bg-black" type="bar" height={300} width={'100%'} />}


                    </div>
                </div>
                <div className="panel">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light">Thống kê vật tư</h5>
                    </div>
                    <div className="mb-5">
                        {isMounted && <ReactApexChart series={columnChart1.series} options={columnChart1.options} className="rounded-lg bg-white dark:bg-black overflow-hidden" type="bar" height={300} width={"100%"} />}

                    </div>
                </div>
                <div className="panel">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light">Thống kê vật tư hết hạn</h5>
                    </div>
                    <div className="mb-5">
                        <div className="datatables">
                            <DataTable
                                highlightOnHover
                                className="whitespace-nowrap table-hover custom_table"
                                records={[{
                                    stt: 1,
                                    name: 'Mìn C4',
                                    type: 'Thuốc nổ',
                                    ware: 'kho mìn',
                                    num: 15,
                                    date: '6/2024'
                                },
                                {
                                    stt: 1,
                                    name: 'Mìn C4',
                                    type: 'Thuốc nổ',
                                    ware: 'kho mìn',
                                    num: 15,
                                    date: '6/2024'
                                },
                                {
                                    stt: 1,
                                    name: 'Mìn C4',
                                    type: 'Thuốc nổ',
                                    ware: 'kho mìn',
                                    num: 15,
                                    date: '6/2024'
                                },
                                {
                                    stt: 1,
                                    name: 'Mìn C4',
                                    type: 'Thuốc nổ',
                                    ware: 'kho mìn',
                                    num: 15,
                                    date: '6/2024'
                                }]}
                                columns={[
                                    {
                                        accessor: 'stt',
                                        title: 'STT',
                                    },
                                    { accessor: 'name', title: 'Tên', sortable: false },
                                    { accessor: 'type', title: 'Loại', sortable: false },
                                    { accessor: 'ware', title: 'Kho', sortable: false },
                                    { accessor: 'num', title: 'Số lượng', sortable: false },
                                    { accessor: 'date', title: 'Hạn', sortable: false },

                                ]}
                                totalRecords={10}
                                recordsPerPage={10}
                                minHeight={200}
                                page={1}
                                onPageChange={(p) => p.toString()}
                            />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DashBoard;
