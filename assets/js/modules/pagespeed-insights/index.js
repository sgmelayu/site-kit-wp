/**
 * PageSpeed Insights module initialization.
 *
 * Site Kit by Google, Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import { AREA_DASHBOARD_SPEED, AREA_PAGE_DASHBOARD_SPEED } from '../../googlesitekit/widgets/default-areas';
import { getModulesData } from '../../util';
import { createAddToFilter } from '../../util/helpers';
import { SettingsView } from './components/settings';
import DashboardPageSpeedWidget from './components/dashboard/DashboardPageSpeedWidget';
import LegacyDashboardPageSpeedCTA from './components/dashboard/LegacyDashboardPageSpeedCTA';
import LegacyDashboardSpeed from './components/dashboard/LegacyDashboardSpeed';
import PageSpeedInsightsIcon from '../../../svg/pagespeed-insights.svg';
import { STORE_NAME } from './datastore/constants';

export { registerStore } from './datastore';

const {
	active,
	setupComplete,
} = getModulesData()[ 'pagespeed-insights' ];

// @TODO: remove LegacyDashboardSpeed once all widgets have been migrated.
if ( active && setupComplete ) {
	// Add to main dashboard.
	addFilter(
		'googlesitekit.DashboardModule',
		'googlesitekit.PageSpeedInsights',
		createAddToFilter( <LegacyDashboardSpeed /> ),
		45
	);

	// Add to dashboard-details view.
	addFilter(
		'googlesitekit.DashboardDetailsModule',
		'googlesitekit.PageSpeedInsights',
		createAddToFilter( <LegacyDashboardSpeed /> ),
		45
	);
} else {
	addFilter(
		'googlesitekit.DashboardModule',
		'googlesitekit.PageSpeedInsights',
		createAddToFilter( <LegacyDashboardPageSpeedCTA /> ),
		45
	);
}

export const registerModule = ( modules ) => {
	modules.registerModule(
		'pagespeed-insights',
		{
			storeName: STORE_NAME,
			SettingsViewComponent: SettingsView,
			Icon: PageSpeedInsightsIcon,
		}
	);
};

export const registerWidgets = ( widgets ) => {
	widgets.registerWidget( 'pagespeedInsightsWebVitals', {
		Component: DashboardPageSpeedWidget,
		width: widgets.WIDGET_WIDTHS.FULL,
		wrapWidget: false,
	}, [ AREA_DASHBOARD_SPEED, AREA_PAGE_DASHBOARD_SPEED ] );
};
