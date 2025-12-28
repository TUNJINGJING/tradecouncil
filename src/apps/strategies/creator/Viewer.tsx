import * as React from 'react';
import TimeAgo from 'react-timeago';

import { Typography } from '@mui/joy';

import { Link } from '~/common/components/Link';
import { useUIContentScaling } from '~/common/stores/store-ui';

import { StrategyPromptCard } from './Creator';
import { useSimplePersona } from '../store-app-strategies';


export function Viewer(props: { selectedSimplePersonaId: string }) {

  // external state
  const contentScaling = useUIContentScaling();
  const { simplePersona } = useSimplePersona(props.selectedSimplePersonaId);

  if (!simplePersona)
    return <Typography level='body-sm'>Loading Strategy...</Typography>;

  return <>

    <Typography level='title-sm'>
      This <em>Strategy Prompt</em> was created <TimeAgo date={simplePersona.creationDate} />
      using the <strong>{simplePersona.llmLabel}</strong> model.
    </Typography>

    <StrategyPromptCard
      content={simplePersona.systemPrompt || ''}
      contentScaling={contentScaling}
    />

    {/* tell about the Provenances */}
    <Typography level='body-sm' sx={{ mt: 3 }}>
      {simplePersona.inputProvenance?.type === 'youtube' && <>The source was this trading video: <Link href={simplePersona.inputProvenance.url} target='_blank'>{simplePersona.inputProvenance.title}</Link>.</>}
      {simplePersona.inputProvenance?.type === 'text' && <>The source was a text snippet of {simplePersona.inputText?.length.toLocaleString()} characters.</>}
    </Typography>

  </>;
}