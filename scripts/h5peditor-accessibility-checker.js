/**
 * Accessibiltiy Checker
 * 
 * Triggered by user or system
 * Evaluates the current author input against the accessibiliy attribute in semantics
 */

const FieldCondition = Object.freeze({
  Checked: 'Checked', // The checkbox is checked
  NotChecked: 'NotChecked', // The checkbox is not checked
  NotEmpty: 'NotEmpty', // Some input
});

/**
 * The structure and possible values of the Accessibility semantic attrribute
 * @readonly
 */
const AccessibilityAttr = Object.freeze({
  Importance: Object.freeze({
    Compliance: 'Compliance', // Required for WCAG compliance
    Recommended: 'Recommended', // Not required, but still recommended
  }),
  AccessibleWhen: FieldCondition,
  DependsOn: Object.freeze({ // Rule only applies if condition is met
    Source: 'Source', // The element to evaluate
    Condition: FieldCondition,
  })
});

/**
 * Evaluates the current author input against the accessibiliy attribute in semantics
 * 
 * @returns A list of recommended changes
 */
H5PEditor.EvaluateAccessibility = () => {
  console.log('Accessibility stuff happening :O'); // TODO: remove

  return []
}