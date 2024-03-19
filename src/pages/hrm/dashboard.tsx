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
                categories: ['Phòng Hành chính', 'Phòng Kế toán', 'Phòng Kỹ thuật', 'Bộ phận bảo trì'],
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
        series: [
            {
                name: '%',
                data: [44, 55, 41],
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
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 1,
            },
            colors: ['#4361ee'],
            xaxis: {
                categories: ['Tốt', 'Đạt', 'Chưa đạt'],
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
            plotOptions: {
                bar: {
                    horizontal: true,
                },
            },
            fill: {
                opacity: 0.8,
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
            labels: ['Chuyên viên', 'Quản lý', 'Trưởng bộ phận'],
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
                <div className="panel h-full p-0">
                    <div className="flex p-5">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                            <img className="h-7 w-7 rounded-full object-cover" src="/assets/images/flags/VI.svg" alt="flag"></img>
                        </div>
                        <div className="font-semibold ltr:ml-3 rtl:mr-3">
                            <p className="text-xl dark:text-white-light">230 nhân sự</p>
                            <h5 className="text-xs text-[#506690]">Việt Nam</h5>
                        </div>
                    </div>
                </div>

                <div className="panel h-full p-0">
                    <div className="flex p-5">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                            <img className="h-7 w-7 rounded-full object-cover" src="/assets/images/flags/LO.svg" alt="flag"></img>

                        </div>
                        <div className="font-semibold ltr:ml-3 rtl:mr-3">
                            <p className="text-xl dark:text-white-light">340 nhân sự</p>
                            <h5 className="text-xs text-[#506690]">Lào</h5>
                        </div>
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

                    <div className="mb-5">
                        {isMounted && <ReactApexChart series={donutChart.series} options={donutChart.options} className="rounded-lg bg-white dark:bg-black overflow-hidden" type="donut" height={300} width={"100%"} />}
                    </div>
                </div>
                <div className="panel">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white">Tình trạng giải quyết công việc</h5>
                    </div>
                    <div className="mb-5">
                        {isMounted && <ReactApexChart series={barChart.series} options={barChart.options} className="rounded-lg bg-white dark:bg-black" type="bar" height={300} width={'100%'} />}
                    </div>
                </div>
                <div className="panel">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light">Thống kê nhiệm vụ theo phòng ban</h5>
                    </div>
                    <div className="mb-5">
                        <div className="datatables">
                            <DataTable
                                highlightOnHover
                                className="whitespace-nowrap table-hover custom_table"
                                records={[{
                                    department: "Phòng hành chính",
                                    good: 10,
                                    reached: 20,
                                    not_reached: 15
                                },
                                {
                                    department: "Phòng kế toán",
                                    good: 11,
                                    reached: 14,
                                    not_reached: 22
                                },
                                {
                                    department: "Phòng kỹ thuật",
                                    good: 4,
                                    reached: 16,
                                    not_reached: 15
                                },
                                {
                                    department: "Bộ phân bảo trì",
                                    good: 23,
                                    reached: 1,
                                    not_reached: 1
                                }]}
                                columns={[
                                    {
                                        accessor: 'department',
                                        title: '',
                                    },
                                    { accessor: 'good', title: 'Tốt', sortable: false },
                                    { accessor: 'reached', title: 'Đạt', sortable: false },
                                    { accessor: 'not_reached', title: 'Chưa đạt', sortable: false },
                                ]}
                                totalRecords={10}
                                recordsPerPage={10}
                                minHeight={200}

                            />
                        </div>
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

                            />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DashBoard;
