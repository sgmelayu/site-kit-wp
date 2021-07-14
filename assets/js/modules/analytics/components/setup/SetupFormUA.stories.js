/**
 * SetupFormUA component stories.
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
 * Internal dependencies
 */
import { STORE_NAME } from '../../datastore/constants';
import { MODULES_ANALYTICS_4 } from '../../../analytics-4/datastore/constants';
import { provideModules, provideModuleRegistrations, provideSiteInfo } from '../../../../../../tests/js/utils';
import ModuleSetup from '../../../../components/setup/ModuleSetup';
import WithRegistrySetup from '../../../../../../tests/js/WithRegistrySetup';
import * as fixtures from '../../datastore/__fixtures__';

const features = [ 'ga4setup' ];

function Template() {
	return <ModuleSetup moduleSlug="analytics" />;
}

export const WithoutExistingTag = Template.bind( null );
WithoutExistingTag.storyName = 'Without Existing Tag';
WithoutExistingTag.parameters = { features };

export const WithExistingTag = Template.bind( null );
WithExistingTag.storyName = 'With Existing Tag';
WithExistingTag.parameters = { features };
WithExistingTag.decorators = [
	( Story ) => {
		const setupRegistry = ( registry ) => {
			registry.dispatch( STORE_NAME ).receiveGetExistingTag( fixtures.accountsPropertiesProfiles.properties[ 0 ].id );
		};

		return (
			<WithRegistrySetup func={ setupRegistry }>
				<Story />
			</WithRegistrySetup>
		);
	},
];

export default {
	title: 'Modules/Analytics/Setup/SetupFormUA',
	decorators: [
		( Story ) => {
			const setupRegistry = ( registry ) => {
				const { accounts, properties, profiles } = fixtures.accountsPropertiesProfiles;
				const accountID = accounts[ 0 ].id;
				const propertyID = properties[ 0 ].id;

				provideModules( registry, [
					{
						slug: 'analytics',
						active: true,
						connected: true,
					},
					{
						slug: 'analytics-4',
						active: true,
						connected: true,
					},
				] );

				provideSiteInfo( registry );
				provideModuleRegistrations( registry );

				registry.dispatch( STORE_NAME ).receiveGetSettings( { adsConversionID: '' } );
				registry.dispatch( STORE_NAME ).receiveGetAccounts( accounts.slice( 0, 1 ) );
				registry.dispatch( STORE_NAME ).receiveGetProperties(
					// eslint-disable-next-line sitekit/acronym-case
					properties.slice( 0, 1 ).map( ( property ) => ( { ...property, websiteUrl: 'http://example.com' } ) ),
					{ accountID },
				);
				registry.dispatch( STORE_NAME ).receiveGetProfiles( profiles, { accountID, propertyID } );
				registry.dispatch( STORE_NAME ).receiveGetExistingTag( null );
				registry.dispatch( MODULES_ANALYTICS_4 ).receiveGetProperties( [], { accountID } );
				registry.dispatch( STORE_NAME ).selectAccount( accountID );
			};

			return (
				<WithRegistrySetup func={ setupRegistry }>
					<Story />
				</WithRegistrySetup>
			);
		},
	],
	parameters: { padding: 0 },
};
