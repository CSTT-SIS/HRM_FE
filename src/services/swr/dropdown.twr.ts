import swr from '@core/swr';
import callApi from '@core/call-api';
import { getEndpoint } from '@core/utils';

export const DropdownWarehouseTypes = (queries?: any) => swr(getEndpoint('/dropdown/warehouse-type', queries));
export const DropdownProducts = (queries?: any) => swr(getEndpoint('/dropdown/product', queries));
export const DropdownProductCategorys = (queries?: any) => swr(getEndpoint('/dropdown/product-category', queries));
export const DropdownUnits = (queries?: any) => swr(getEndpoint('/dropdown/unit', queries));
export const DropdownProviders = (queries?: any) => swr(getEndpoint('/dropdown/provider', queries));