import * as React from 'react';

import { AppAnalysis } from '../../src/apps/analysis/AppAnalysis';

import { withNextJSPerPageLayout } from '~/common/layout/withLayout';


export default withNextJSPerPageLayout({ type: 'optima' }, () => <AppAnalysis />);
