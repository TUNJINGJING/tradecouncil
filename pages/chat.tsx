import * as React from 'react';

import { AppChat } from '../src/apps/chat/AppChat';

import { withNextJSPerPageLayout } from '~/common/layout/withLayout';


export default withNextJSPerPageLayout({ type: 'optima' }, () => <AppChat />);
