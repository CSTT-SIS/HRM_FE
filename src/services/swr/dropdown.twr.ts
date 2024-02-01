import swr from '@core/swr';
import callApi from '@core/call-api';
import { getEndpoint } from '@core/utils';

export const DropdownWarehouseTypes = (queries?: any) => swr(getEndpoint('/dropdown/warehouse-type', queries));
export const DropdownProducts = (queries?: any) => swr(getEndpoint('/dropdown/product', queries));
export const DropdownProductCategorys = (queries?: any) => swr(getEndpoint('/dropdown/product-category', queries));
export const DropdownUnits = (queries?: any) => swr(getEndpoint('/dropdown/unit', queries));
export const DropdownProviders = (queries?: any) => swr(getEndpoint('/dropdown/provider', queries));
export const DropdownProposals = (queries?: any) => swr(getEndpoint('/dropdown/proposal', queries));
export const DropdownWarehouses = (queries?: any) => swr(getEndpoint('/dropdown/warehouse', queries));
export const DropdownOrder = (queries?: any) => swr(getEndpoint('/dropdown/order', queries));
export const DropdownOrderType = (queries?: any) => swr(getEndpoint('/dropdown/order-type', queries));
export const DropdownProposalType = (queries?: any) => swr(getEndpoint('/dropdown/proposal-type', queries));
export const DropdownWarehousingType = (queries?: any) => swr(getEndpoint('/dropdown/warehousing-bill-type', queries));