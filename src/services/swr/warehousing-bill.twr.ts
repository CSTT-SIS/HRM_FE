import swr from '@core/swr';
import callApi from '@core/call-api';
import { getEndpoint } from '@core/utils';

export const WarehousingBill = (queries?: any) => swr(getEndpoint('/warehousing-bill', queries));
export const WarehousingBillDetail = (queries?: any) => swr(getEndpoint(`/warehousing-bill/${queries.id}/details`, queries));