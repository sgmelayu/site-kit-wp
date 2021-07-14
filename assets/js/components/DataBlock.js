/**
 * DataBlock component.
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
 * WordPress dependencies
 */
import { Component, Fragment, cloneElement } from '@wordpress/element';
import { sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ChangeArrow from './ChangeArrow';
import SourceLink from './SourceLink';
import { numFmt } from '../util';

class DataBlock extends Component {
	constructor( props ) {
		super( props );

		this.handleClick = this.handleClick.bind( this );
		this.handleKeyPress = this.handleKeyPress.bind( this );
	}

	handleClick() {
		const { stat, handleStatSelection } = this.props;
		handleStatSelection( stat );
	}

	handleKeyPress( e ) {
		e.preventDefault();
		const { stat, handleStatSelection } = this.props;
		if ( 'Enter' === e.key || ' ' === e.key ) {
			handleStatSelection( stat );
		}
	}

	render() {
		const {
			className,
			title,
			datapoint,
			datapointUnit,
			change,
			changeDataUnit,
			context,
			period,
			selected,
			handleStatSelection,
			source,
			sparkline,
			invertChangeColor,
		} = this.props;

		const role = ( 'button' === context ) ? 'button' : '';

		// The `sparkline` prop is passed as a component, but if `invertChangeColor`
		// is set, we should pass that to `<Sparkline>`. In that case, we clone
		// the element and add the prop.
		let sparklineComponent = sparkline;
		if ( sparklineComponent && invertChangeColor ) {
			sparklineComponent = cloneElement( sparkline, { invertChangeColor } );
		}

		let changeFormatted = change;

		// If changeDataUnit is given, try using it as currency first, otherwise add it as suffix.
		if ( changeDataUnit ) {
			if ( changeDataUnit === '%' ) {
				// Format percentage change with only 1 digit instead of the usual 2.
				changeFormatted = numFmt( change, {
					style: 'percent',
					signDisplay: 'never',
					maximumFractionDigits: 1,
				} );
			} else {
				changeFormatted = numFmt( change, changeDataUnit );
			}
		}

		// If period is given (requires %s placeholder), add it.
		if ( period ) {
			changeFormatted = sprintf( period, changeFormatted );
		}

		const datapointFormatted = datapoint && numFmt( datapoint, datapointUnit || undefined );

		return (
			<div
				className={ classnames(
					'googlesitekit-data-block',
					className,
					`googlesitekit-data-block--${ context }`,
					{ 'googlesitekit-data-block--selected': selected },
				) }
				tabIndex={ 'button' === context ? '0' : '-1' }
				role={ handleStatSelection && role }
				onClick={ handleStatSelection && this.handleClick }
				onKeyPress={ handleStatSelection && this.handleKeyPress }
				aria-label={ handleStatSelection && title }
				aria-pressed={ handleStatSelection && selected }
			>
				<div className="googlesitekit-data-block__title-datapoint-wrapper">
					<h3 className="
						googlesitekit-subheading-1
						googlesitekit-data-block__title
					">
						{ title }
					</h3>
					<div className="googlesitekit-data-block__datapoint">
						{ datapointFormatted }
					</div>
				</div>
				{ sparklineComponent && (
					<div className="googlesitekit-data-block__sparkline">
						{ sparklineComponent }
					</div>
				) }
				<div className="googlesitekit-data-block__change-source-wrapper">
					<div className={ classnames(
						'googlesitekit-data-block__change',
						{ 'googlesitekit-data-block__change--no-change': ! change }
					) }>
						<Fragment>
							{ !! change && (
								<span className="googlesitekit-data-block__arrow">
									<ChangeArrow
										direction={ 0 < parseFloat( change ) ? 'up' : 'down' }
										invertColor={ invertChangeColor }
									/>
								</span>
							) }
							<span className="googlesitekit-data-block__value">
								{ changeFormatted }
							</span>
						</Fragment>
					</div>
					{ source && (
						<SourceLink
							className="googlesitekit-data-block__source"
							name={ source.name }
							href={ source.link }
							external={ source?.external }
						/>
					) }
				</div>
			</div>
		);
	}
}

DataBlock.propTypes = {
	stat: PropTypes.number,
	onClick: PropTypes.func,
	className: PropTypes.string,
	title: PropTypes.string,
	datapoint: PropTypes.oneOfType( [
		PropTypes.string,
		PropTypes.number,
	] ),
	datapointUnit: PropTypes.string,
	change: PropTypes.oneOfType( [
		PropTypes.string,
		PropTypes.number,
	] ),
	changeDataUnit: PropTypes.oneOfType( [
		PropTypes.string,
		PropTypes.bool,
	] ),
	context: PropTypes.string,
	period: PropTypes.string,
	selected: PropTypes.bool,
	handleStatSelection: PropTypes.func,
	invertChangeColor: PropTypes.bool,
};

DataBlock.defaultProps = {
	stat: null,
	onClick: null,
	className: '',
	title: '',
	datapoint: null,
	datapointUnit: '',
	change: null,
	changeDataUnit: '',
	context: 'default',
	period: '',
	selected: false,
	handleStatSelection: null,
	invertChangeColor: false,
};

export default DataBlock;
