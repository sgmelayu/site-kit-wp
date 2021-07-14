/**
 * `modules/idea-hub` data store: saved-ideas.
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
import invariant from 'invariant';
import isPlainObject from 'lodash/isPlainObject';

/**
 * Internal dependencies
 */
import API from 'googlesitekit-api';
import Data from 'googlesitekit-data';
import { createFetchStore } from '../../../googlesitekit/data/create-fetch-store';

const REMOVE_IDEA_FROM_NEW_AND_SAVED_IDEAS = 'REMOVE_IDEA_FROM_NEW_AND_SAVED_IDEAS';

const fetchCreateIdeaDraftPostStore = createFetchStore( {
	baseName: 'createIdeaDraftPost',
	controlCallback: async ( { idea } ) => {
		const result = await API.set( 'modules', 'idea-hub', 'create-idea-draft-post', { idea } );

		API.invalidateCache( 'modules', 'idea-hub', 'draft-post-ideas' );

		return result;
	},
	reducerCallback: ( state, ideaDraftPost ) => {
		return {
			...state,
			draftPostIdeas: [ ...( state.draftPostIdeas || [] ), ideaDraftPost ],
		};
	},
	argsToParams: ( idea ) => {
		return { idea };
	},
	validateParams: ( { idea } ) => {
		invariant( isPlainObject( idea ), 'idea must be an object.' );
		invariant( typeof idea.name === 'string', 'idea.name must be a string.' );
		invariant( typeof idea.text === 'string', 'idea.text must be a string.' );
		invariant( Array.isArray( idea.topics ), 'idea.topics must be an array.' );
		idea.topics.forEach( ( topic ) => {
			invariant( typeof topic.mid === 'string', 'topic.mid must be a string.' );
			invariant( typeof topic.display_name === 'string', 'topic.display_name must be a string.' );
		} );
	},
} );

const baseActions = {
	/**
	 * Creates a new Idea Hub Draft Post
	 *
	 * Creates a new draft post and attaches an idea to it.
	 *
	 * @since 1.34.0
	 *
	 * @param {Object} idea Idea Hub Idea.
	 * @return {Object} Object with `response` and `error`.
	 */
	*createIdeaDraftPost( idea ) {
		const { response, error } = yield fetchCreateIdeaDraftPostStore.actions.fetchCreateIdeaDraftPost( idea );
		return { response, error };
	},

	/**
	 * Removes an idea from the list of newIdeas and savedIdeas state variables.
	 *
	 * @since n.e.x.t
	 *
	 * @param {string} name Idea name.
	 * @return {Object} Redux-style action.
	 */
	removeIdeaFromNewAndSavedIdeas( name ) {
		invariant( typeof name === 'string' && name.length > 0, 'name is required.' );

		return {
			payload: { name },
			type: REMOVE_IDEA_FROM_NEW_AND_SAVED_IDEAS,
		};
	},
};

export const baseReducer = ( state, { type, payload } ) => {
	switch ( type ) {
		case REMOVE_IDEA_FROM_NEW_AND_SAVED_IDEAS: {
			return {
				...state,
				newIdeas: ( state.newIdeas || [] ).filter( ( { name } ) => name !== payload?.name ),
				savedIdeas: ( state.savedIdeas || [] ).filter( ( { name } ) => name !== payload?.name ),
			};
		}

		default: {
			return state;
		}
	}
};

const store = Data.combineStores(
	fetchCreateIdeaDraftPostStore,
	{
		actions: baseActions,
		reducer: baseReducer,
	}
);

export const initialState = store.initialState;
export const actions = store.actions;
export const controls = store.controls;
export const reducer = store.reducer;
export const resolvers = store.resolvers;
export const selectors = store.selectors;

export default store;
