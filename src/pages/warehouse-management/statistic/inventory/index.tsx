import { useEffect, Fragment, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
// Third party libs
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import 'tippy.js/dist/tippy.css';
import { useTranslation } from 'react-i18next';
import { PAGE_SIZES } from '@/utils/constants';
import { IconLoading } from '@/components/Icon/IconLoading';
import { ProductInventory } from '@/services/swr/statistic.twr';
import { DropdownWarehouses } from '@/services/swr/dropdown.twr';
import Select, { components } from 'react-select';

interface Props {
    [key: string]: any;
}

const StocktakePage = ({ ...props }: Props) => {

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const router = useRouter();

    const [showLoader, setShowLoader] = useState(true);
    const [dataWarehouseDropdown, setDataWarehouseDropdown] = useState<any>([]);
    const [page, setPage] = useState(1);

    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'desc' });


    // get data
    const { data: inventory, pagination } = ProductInventory({ ...router.query });
    const { data: dropdownWarehouse, pagination: paginationWarehousetype, isLoading, mutate } = DropdownWarehouses({ page: page });

    useEffect(() => {
        dispatch(setPageTitle(`${t('inventory')}`));
    });

    useEffect(() => {
        setShowLoader(false);
    }, [inventory]);

    useEffect(() => {
        if (paginationWarehousetype?.page === undefined) return;
        if (paginationWarehousetype?.page === 1) {
            setDataWarehouseDropdown(dropdownWarehouse?.data)
        } else {
            setDataWarehouseDropdown([...dataWarehouseDropdown, ...dropdownWarehouse?.data])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paginationWarehousetype])

    const handleMenuScrollToBottom = () => {
        setTimeout(() => {
            setPage(paginationWarehousetype?.page + 1);
        }, 1000);
    }

    const handleSearch = (param: any) => {
        router.replace(
            {
                pathname: router.pathname,
                query: {
                    ...router.query,
                    warehouseId: param?.value || ""
                },
            }
        );
    }

    const handleChangePage = (page: number, pageSize: number) => {
        router.replace(
            {
                pathname: router.pathname,
                query: {
                    ...router.query,
                    page: page,
                    perPage: pageSize,
                },
            },
            undefined,
            { shallow: true },
        );
        return pageSize;
    };


    const columns = [
        {
            accessor: 'id',
            title: '#',
            render: (records: any, index: any) => <span>{index + 1}</span>,
        },
        { accessor: 'name', title: 'Tên', sortable: false },
        {
            accessor: 'warehouseName',
            title: 'Tên kho'
        },
        { accessor: 'quantity', title: 'Số lượng', sortable: false },
    ]

    return (
        <div>
            {showLoader && (
                <div className="screen_loader fixed inset-0 bg-[#fafafa] dark:bg-[#060818] z-[60] grid place-content-center animate__animated">
                    <IconLoading />
                </div>
            )}
            <title>Inventory</title>
            <div className="panel mt-6">
                <div className="flex md:items-center justify-between md:flex-row flex-col mb-4.5 gap-5">
                    <div className="flex items-center flex-wrap"></div>
                    <Select
                        options={dataWarehouseDropdown}
                        onMenuOpen={() => setPage(1)}
                        onMenuScrollToBottom={handleMenuScrollToBottom}
                        maxMenuHeight={160}
                        isClearable
                        isLoading={isLoading}
                        className="z-50 w-3/12"
                        onChange={e => handleSearch(e)}
                    />
                </div>
                <div className="datatables">
                    <DataTable
                        highlightOnHover
                        className="whitespace-nowrap table-hover"
                        records={inventory?.data}
                        columns={columns}
                        totalRecords={pagination?.totalRecords}
                        recordsPerPage={pagination?.perPage}
                        page={pagination?.page}
                        onPageChange={(p) => handleChangePage(p, pagination?.perPage)}
                        recordsPerPageOptions={PAGE_SIZES}
                        onRecordsPerPageChange={e => handleChangePage(pagination?.page, e)}
                        sortStatus={sortStatus}
                        onSortStatusChange={setSortStatus}
                        minHeight={200}
                        paginationText={({ from, to, totalRecords }) => `${t('Showing_from_to_of_totalRecords_entries', { from: from, to: to, totalRecords: totalRecords })}`}
                    />
                </div>
            </div>
        </div>
    );
};

export default StocktakePage;