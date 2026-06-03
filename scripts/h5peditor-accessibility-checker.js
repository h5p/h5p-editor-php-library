/* global ns */

/**
 * The structure and possible values of the Accessibility semantic attribute's conditions
 * @readonly
 */
const FIELD_CONDITION = Object.freeze({
  CHECKED: 'Checked', // The checkbox is checked
  NOT_CHECKED: 'NotChecked', // The checkbox is not checked
  NOT_EMPTY: 'NotEmpty', // Some input
});

/**
 * The structure and possible values of the Accessibility semantic attribute is as follows:
 *
 * @typedef {Object} accessibility
 * @property {'Compliance' | 'Recommended'} importance Whether the criteria is required
 *   by WCAG or just recommended
 * @property {String} [relatedCriteria] Optional WCAG criteria that will be broken if accessibleWhen is not met
 *    e.g. "SC 3.3.6 Error Prevention (All) (Level AAA)"
 * @property {FIELD_CONDITION} accessibleWhen The condition to meet for the field to be accessible
 * @property {Object} [dependsOn] Optional dependency on state of a neighboring field
 *   (only evaluates accessibleWhen if the dependent condition is met)
 * @property {String} dependsOn.source Name of the other field to check
 * @property {FIELD_CONDITION} dependsOn.condition The condition the other field should meet to
 *   evaluate accessibleWhen
 */

/**
 * Accessibiltiy Checker
 *
 * Evaluates the current author input against the accessibiliy attribute in semantics
 *
 * @param {HTMLElement} container The container to append the button to
 * @param {object} params The params of the content (including the subcontent)
 */
ns.AccessibilityCheckerButton = function (container, parent) {
  button = document.createElement('button');
  button.classList.add('h5peditor-button', 'h5peditor-button-textual');

  // Icon fixed left aligned
  const icon = document.createElement('div');
  icon.classList.add('icon');
  button.append(icon);

  // Label centered in remaining space
  label = document.createElement('div');
  label.classList.add('label');
  label.innerText = H5PEditor.t('core', 'checkAccessibility');
  button.append(label);

  button.addEventListener('click', () => { // TODO: Update ui
    showResultList(ns.EvaluateAccessibility(
      parent.getParams(),
      parent.getMetadata(),
      ns.libraryCache,
    ), button);
  });

  container.append(button);
};

/**
 * Evaluates the current author input against the accessibiliy attribute in semantics
 * Triggered by the author or system
 *
 * @param {object} params The params of the content (including the subcontent)
 * @param {object} metadata The metadata of the main content or standalone content
 * @param {object} libraries An object containing all the libraries used in the editor.
 *    The objects should have a child object called semantics, containing the semantic structure of the content
 * @returns {Array} An array of recommended changes
 */
ns.EvaluateAccessibility = (params, metadata, libraries) => {
  const results = [];

  if (libraries) {
    Object.values(libraries).forEach((library) => {
      const libraryResult = [];
      findAllOccurences(
        library.semantics,
        (potentialMatch) =>
          typeof potentialMatch === 'object' &&
          Object.prototype.hasOwnProperty.call(potentialMatch, 'accessibility'),
        (match) => {
          const evaluation = evaluateField(match, params);
          if (!H5P.isEmpty(evaluation)) {
            libraryResult.push(evaluation);
          }
        },
      );

      if (!H5P.isEmpty(libraryResult)) {
        results.push({
          contentTitle: library.title ?? library.name, // TODO: use the content title from the metadata (probably need to propogate it from evaluateField)
          results: libraryResult,
        });
      }
    });
  }

  console.log('final results', results); // TODO: remove

  return results;
};

/**
 * Render the list of results
 * 
 * @param {Array} results A list of identified accessibility gaps
 * @param {HTMLElement} sibling The element to append the list after
 */
const showResultList = (results, sibling) => { // TODO: Implement designer-made UI
  // TODO: is already shown, just update the info
  const wrapper = document.createElement('div');
  wrapper.classList.add('h5p-editor-accessibility-results');
  const title = document.createElement('span');
  title.classList.add('h5peditor-label');
  wrapper.append(title);
  
  if(H5P.isEmpty(results)) {
    title.innerText = 'No accessibility problems detected'; // TODO: don't hardcode
  }
  else {
    title.innerText = 'Accessibility concerns:'; // TODO: don't hardcode
    
    const list = document.createElement('ul');
    results.forEach((content) => {
      const contentTitle = document.createElement('li');
      contentTitle.innerText = content.contentTitle;
      const contentList = document.createElement('ul');
      content.results.forEach((semanticProblem) => {
        semanticProblem.forEach((paramProblem) => { // TODO: update text based on param problems of same semantic
          const problemElement = document.createElement('li');
          const problemText = document.createElement('span');
          // TODO: Make human readable
          problemText.innerHTML = `(${paramProblem.importance}) <b>${paramProblem.field}:</b> Should be ${paramProblem.accessibleWhen}`;

          problemElement.append(problemText);
          contentList.append(problemElement);
        })
      });

      contentTitle.append(contentList);
      list.append(contentTitle);
    });

    wrapper.append(list);
  }

  sibling.after(wrapper);
}

/**
 * Evaluate the accessibility of a given field
 *
 * @param {object} semantics The field semantics, including the accessibility conditions
 * @param {object} params the author-created params
 * @returns {Array} An array or the recommended changes for this content/subcontent
 */
const evaluateField = (semantics, params) => {
  const results = [];

  findAllOccurences(
    params,
    (potentialMatch) => Object.hasOwn(potentialMatch, semantics.name),
    (match) => {
      const accessibility = semantics.accessibility;

      if (accessibility) {
        let applicable = true;
        let passed = true;

        if (accessibility.dependsOn) { // TODO: currently only works if in same setting group/level
          applicable = meetsCondition(
            match[accessibility.dependsOn.source],
            accessibility.dependsOn.condition,
          );
        }

        if (
          applicable &&
          !meetsCondition(match[semantics.name], accessibility.accessibleWhen)
        ) {
          results.push({
            field: semantics.label,
            importance: accessibility.importance,
            accessibleWhen: accessibility.accessibleWhen,
          });
        }
      }
    },
  );

  return results;
};

/**
 * Evaluates a given field against a given condition
 * @param {unknown} value The current value of the field
 * @param {FIELD_CONDITION} condition Which condition to evaluate against
 * @returns {Boolean} Returns whether or not the condition is met
 */
const meetsCondition = (value, condition) => {
  switch (condition) {
    case FIELD_CONDITION.CHECKED:
      return value === true;
    case FIELD_CONDITION.NOT_CHECKED:
      return value === false;
    case FIELD_CONDITION.NOT_EMPTY: // TODO: Does not currently work. Params not updated/added if empty...
      return !H5P.isEmpty(value);
    default:
      return true;
  }
};

/**
 * Search through the nested object/array and trigger the callback for
 * all found matches
 *
 * @param {object|Array} searchArea The structure to be searched through
 * @param {function} condition Any element matching this filter (return true)
 *   will trigger the callback
 */
const findAllOccurences = (searchArea, condition, callback) => {
  // If match, trigger callback
  if (condition(searchArea)) {
    callback(searchArea);
  }

  // Search through potential children
  if (Array.isArray(searchArea)) {
    searchArea.forEach((child) =>
      findAllOccurences(child, condition, callback),
    );
  } else if (searchArea && typeof searchArea === 'object') {
    Object.values(searchArea).forEach((child) =>
      findAllOccurences(child, condition, callback),
    );
  }
};
