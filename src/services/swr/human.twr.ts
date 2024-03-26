import swr from '@core/swr';
import callApi from '@core/call-api';
import { getEndpoint } from '@core/utils';

export const Humans = (queries?: any) => swr(getEndpoint('/human', queries));
