/**
 * WidgetContext component.
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
 * External dependencies
 */
import PropTypes from 'prop-types';
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import WidgetAreaRenderer from './WidgetAreaRenderer';
import { STORE_NAME } from '../datastore/constants';
import { Grid, Row, Cell } from '../../../material-components';

const { useSelect } = Data;

const WidgetContextRenderer = ( props ) => {
	const { slug, className, Header, Footer } = props;

	const widgetAreas = useSelect( ( select ) => select( STORE_NAME ).getWidgetAreas( slug ) );
	const widgetAreasLength = widgetAreas?.length;

	return (
		<div className={ classnames( 'googlesitekit-widget-context', className ) }>
			{ Header && (
				<Grid>
					<Row>
						<Cell size={ 12 }>
							<Header />
						</Cell>
					</Row>
				</Grid>
			) }
			{ widgetAreas.map( ( area ) => {
				return <WidgetAreaRenderer slug={ area.slug } key={ area.slug } totalAreas={ widgetAreasLength } />;
			} ) }
			{ Footer && (
				<Grid>
					<Row>
						<Cell size={ 12 }>
							<Footer />
						</Cell>
					</Row>
				</Grid>
			) }
		</div>
	);
};

WidgetContextRenderer.propTypes = {
	slug: PropTypes.string.isRequired,
	className: PropTypes.string,
	Header: PropTypes.elementType,
	Footer: PropTypes.elementType,
};

export default WidgetContextRenderer;
