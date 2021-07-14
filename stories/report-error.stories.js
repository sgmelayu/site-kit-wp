/**
 * ReportError stories.
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
import {
	createTestRegistry,
	provideModules,
	WithTestRegistry,
} from '../tests/js/utils';
import { createModuleStore } from '../assets/js/googlesitekit/modules/create-module-store';
import ReportError from '../assets/js/components/ReportError';

const error = {
	code: 'test-error-code',
	message: 'Test error message',
	data: {},
};

export const ReportErrorStory = () => (
	<ReportError moduleSlug="test-module" error={ error } />
);
ReportErrorStory.storyName = 'Report Error';
ReportErrorStory.decorators = [
	( Story ) => {
		const registry = createTestRegistry();
		const testModuleDefinition = createModuleStore( 'test-module', {
			storeName: 'modules/test-module',
		} );
		registry.registerStore( testModuleDefinition.STORE_NAME, testModuleDefinition );
		provideModules( registry, [ { slug: 'test-module', name: 'Test Module' } ] );

		return (
			<WithTestRegistry registry={ registry }>
				<Story />
			</WithTestRegistry>
		);
	},
];

export default {
	title: 'Global',
};
