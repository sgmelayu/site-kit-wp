/**
 * DashboardSetupAlerts component.
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
import { Component, Fragment } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { applyFilters } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import { getQueryParameter, getModulesData } from '../../util';
import Notification from './notification';
import ModulesList from '../ModulesList';
import SuccessGreenSVG from '../../../svg/success-green.svg';
import UserInputSuccessNotification from '../notifications/UserInputSuccessNotification';

class DashboardSetupAlerts extends Component {
	render() {
		// Only show the connected win when the user completes setup flow.
		const notification = getQueryParameter( 'notification' );
		if ( ( ! notification ) || '' === notification ) {
			return null;
		}

		let winData = {
			id: 'connected-successfully',
			setupTitle: __( 'Site Kit', 'google-site-kit' ),
			description: __( 'Now you’ll be able to see how your site is doing in search. To get even more detailed stats, activate more modules. Here are our recommendations for what to include in your Site Kit:', 'google-site-kit' ),
			learnMore: {
				label: '',
				url: '',
				description: '',
			},
		};

		const { canManageOptions } = global._googlesitekitLegacyData.permissions;

		switch ( notification ) {
			case 'authentication_success':
				if ( ! canManageOptions ) {
					return null;
				}

				const modulesData = getModulesData();
				const slug = getQueryParameter( 'slug' );

				if ( slug && modulesData[ slug ] && ! modulesData[ slug ].active ) {
					return null;
				}

				if ( slug && modulesData[ slug ] ) {
					winData.id = `${ winData.id }-${ slug }`;
					winData.setupTitle = modulesData[ slug ].name;
					winData.description = __( 'Here are some other services you can connect to see even more stats:', 'google-site-kit' );

					winData = applyFilters( `googlesitekit.SetupWinNotification-${ slug }`, winData );
				}

				return (
					<Fragment>
						<Notification
							id={ winData.id }
							/* translators: %s: the name of a module that setup was completed for */
							title={ sprintf( __( 'Congrats on completing the setup for %s!', 'google-site-kit' ), winData.setupTitle ) }
							description={ winData.description }
							handleDismiss={ () => {} }
							WinImageSVG={ SuccessGreenSVG }
							dismiss={ __( 'OK, Got it!', 'google-site-kit' ) }
							format="large"
							type="win-success"
							learnMoreLabel={ winData.learnMore.label }
							learnMoreDescription={ winData.learnMore.description }
							learnMoreURL={ winData.learnMore.url }
							anchorLink={ 'pagespeed-insights' === slug ? '#googlesitekit-pagespeed-header' : '' }
							anchorLinkLabel={ 'pagespeed-insights' === slug ? __( 'Jump to the bottom of the dashboard to see how fast your home page is', 'google-site-kit' ) : '' }
						>
							<ModulesList
								moduleSlugs={ [ 'search-console', 'adsense', 'analytics', 'pagespeed-insights' ] }
							/>
						</Notification>
					</Fragment>
				);

			case 'authentication_failure':
				return (
					<Fragment>
						<Notification
							id="connection error"
							title={ __( 'There was a problem connecting to Google!', 'google-site-kit' ) }
							description={ '' }
							handleDismiss={ () => {} }
							format="small"
							type="win-error"
						/>

					</Fragment>
				);

			case 'user_input_success':
				return <UserInputSuccessNotification />;
		}
	}
}

export default DashboardSetupAlerts;
