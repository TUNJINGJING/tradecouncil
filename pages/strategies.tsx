import * as React from 'react';

import { AppStrategies } from '../src/apps/strategies/AppStrategies';

import { withNextJSPerPageLayout } from '~/common/layout/withLayout';


export default withNextJSPerPageLayout({ type: 'optima' }, () => <AppStrategies />);
