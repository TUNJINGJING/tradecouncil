import * as React from 'react';
import Router from 'next/router';

import type { SxProps } from '@mui/joy/styles/types';
import { Divider, Tooltip } from '@mui/joy';
import HistoryIcon from '@mui/icons-material/History';
import MenuIcon from '@mui/icons-material/Menu';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import TerminalOutlinedIcon from '@mui/icons-material/TerminalOutlined';

import { checkDivider, checkVisibileIcon, NavItemApp, navItems } from '~/common/app.nav';
import { themeZIndexDesktopNav } from '~/common/app.theme';
import { useHasLLMs } from '~/common/stores/llms/llms.hooks';

import { DesktopNavGroupBox, DesktopNavIcon, navItemClasses } from './DesktopNavIcon';
import { InvertedBar, InvertedBarCornerItem } from '../InvertedBar';
import { optimaActions, optimaOpenModels, optimaOpenPreferences, optimaToggleDrawer, useOptimaDrawerOpen, useOptimaDrawerPeeking, useOptimaModals } from '../useOptima';
import { scratchClipSupported, useScratchClipVisibility } from '../scratchclip/store-scratchclip';


const desktopNavBarSx: SxProps = {
  zIndex: themeZIndexDesktopNav,
};

const bottomGroupSx: SxProps = {
  mb: 'calc(2 * var(--GroupMarginY))',
};

const navItemsDividerSx: SxProps = {
  my: 1,
  width: '50%',
  mx: 'auto',
};


export function DesktopNav(props: { component: React.ElementType, currentApp?: NavItemApp }) {

  // external state
  const isDrawerOpen = useOptimaDrawerOpen();
  const isDrawerPeeking = useOptimaDrawerPeeking();
  const { showModels, showPreferences } = useOptimaModals();
  const { peekDrawerEnter, peekDrawerLeave } = optimaActions();
  const { isVisible: isScratchClipVisible, toggleVisibility: toggleScratchClipVisibility } = useScratchClipVisibility();

  // derived state
  const noLLMs = !useHasLLMs();


  // show/hide the pane when clicking on the logo
  const appUsesDrawer = !props.currentApp?.hideDrawer;
  const logoButtonTogglesPane = (appUsesDrawer && !isDrawerOpen) || isDrawerOpen;


  // App items - show ALL apps directly in sidebar
  const navAppItems = React.useMemo(() => {

    // Get all visible apps (no more overflow/dropdown)
    const visibleApps: NavItemApp[] = [];

    navItems.apps.forEach((app) => {
      if (checkVisibileIcon(app, false, props.currentApp)) {
        visibleApps.push(app);
      }
    });

    // Application buttons (and group separator)
    return visibleApps.map((app, appIdx) => {
      const isActive = app === props.currentApp;
      const isDrawerable = isActive && !app.hideDrawer;
      const isPaneOpen = isDrawerable && isDrawerOpen;

      if (checkDivider(app))
        return <Divider key={'app-sep-' + appIdx} sx={navItemsDividerSx} />;

      return (
        <Tooltip key={'n-m-' + app.route.slice(1)} disableInteractive enterDelay={600} title={app.name + (app.isDev ? ' [DEV]' : '')}>
          <DesktopNavIcon
            variant={isActive ? 'solid' : undefined}
            onPointerDown={isDrawerable ? optimaToggleDrawer : () => Router.push(app.landingRoute || app.route)}
            className={`${navItemClasses.typeApp} ${isActive ? navItemClasses.active : ''} ${isPaneOpen ? navItemClasses.paneOpen : ''} ${app.isDev ? navItemClasses.dev : ''}`}
            sx={appIdx !== 0 ? undefined : { '--Icon-fontSize': '1.375rem!important' }}
          >
            {(isActive && app.iconActive) ? <app.iconActive /> : <app.icon />}
          </DesktopNavIcon>
        </Tooltip>
      );
    });
  }, [props.currentApp, isDrawerOpen]);


  // Quick Tools items - shown directly in sidebar
  const navToolItems = React.useMemo(() => {
    return (
      <>
        <Tooltip disableInteractive enterDelay={600} title='AI Inspector'>
          <DesktopNavIcon
            onClick={optimaActions().openAIXDebugger}
            className={navItemClasses.typeApp}
          >
            <TerminalOutlinedIcon />
          </DesktopNavIcon>
        </Tooltip>
        {scratchClipSupported() && (
          <Tooltip disableInteractive enterDelay={600} title={isScratchClipVisible ? 'Hide Clipboard History' : 'Clipboard History'}>
            <DesktopNavIcon
              onClick={toggleScratchClipVisibility}
              className={navItemClasses.typeApp}
            >
              <HistoryIcon />
            </DesktopNavIcon>
          </Tooltip>
        )}
      </>
    );
  }, [toggleScratchClipVisibility, isScratchClipVisible]);


  // Modal items
  const navModalItems = React.useMemo(() => {
    return navItems.modals.map(item => {

      // map the overlayId to the corresponding state and action
      const stateActionMap: { [key: string]: { isActive: boolean, showModal: (event: React.MouseEvent) => void } } = {
        settings: { isActive: showPreferences, showModal: () => optimaOpenPreferences() },
        models: { isActive: showModels, showModal: () => optimaOpenModels() },
        0: { isActive: false, showModal: () => console.log('Action missing for ', item.overlayId) },
      };
      const { isActive, showModal } = stateActionMap[item.overlayId] ?? stateActionMap[0];

      // attract the attention to the models configuration when no LLMs are available
      const isAttractive = noLLMs && item.overlayId === 'models';

      // skip the models configuration, unless it is required
      if (item.overlayId === 'models' && !isAttractive) return null;

      return (
        <Tooltip key={'n-m-' + item.overlayId} title={isAttractive ? 'Add Language Models - REQUIRED' : item.name}>
          <DesktopNavIcon
            variant={isActive ? 'soft' : undefined}
            onClick={showModal}
            className={`${navItemClasses.typeLinkOrModal} ${isActive ? navItemClasses.active : ''} ${isAttractive ? navItemClasses.attractive : ''}`}
          >
            {(isActive && item.iconActive) ? <item.iconActive /> : <item.icon />}
          </DesktopNavIcon>
        </Tooltip>
      );
    }).filter(component => !!component);
  }, [noLLMs, showModels, showPreferences]);


  return (
    <InvertedBar
      id='desktop-nav'
      component={props.component}
      direction='vertical'
      sx={desktopNavBarSx}
      onMouseEnter={appUsesDrawer ? peekDrawerEnter : undefined}
      onMouseLeave={peekDrawerLeave}
    >

      <InvertedBarCornerItem>
        <Tooltip disableInteractive title={isDrawerPeeking ? 'Pin Drawer' : (isDrawerOpen ? 'Close Drawer' : 'Open Drawer')}>
          <DesktopNavIcon
            disabled={!logoButtonTogglesPane}
            onPointerDown={logoButtonTogglesPane ? optimaToggleDrawer : undefined}
            className={navItemClasses.typeMenu}
          >
            {isDrawerPeeking ? <PushPinOutlinedIcon sx={{ fontSize: 'xl', transform: 'rotate(45deg)' }} /> : <MenuIcon />}
          </DesktopNavIcon>
        </Tooltip>
      </InvertedBarCornerItem>

      <DesktopNavGroupBox>
        {navAppItems}
      </DesktopNavGroupBox>

      <DesktopNavGroupBox sx={bottomGroupSx}>
        {navToolItems}
        {navModalItems}
      </DesktopNavGroupBox>

    </InvertedBar>
  );
}