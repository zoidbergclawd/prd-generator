"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePRD = validatePRD;
exports.isValidPRD = isValidPRD;
function isObject(value) {
    return typeof value === "object" && value !== null;
}
function hasNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
}
function validatePRD(prd) {
    const errors = [];
    if (!isObject(prd)) {
        return ["PRD must be an object"];
    }
    if (!hasNonEmptyString(prd.project)) {
        errors.push("Missing required field: project");
    }
    if (!hasNonEmptyString(prd.goal)) {
        errors.push("Missing required field: goal");
    }
    if (!Array.isArray(prd.items)) {
        errors.push("Missing required field: items");
        return errors;
    }
    prd.items.forEach((item, index) => {
        if (!isObject(item)) {
            errors.push(`Item ${index} must be an object`);
            return;
        }
        if (typeof item.id !== "number" || Number.isNaN(item.id)) {
            errors.push(`Item ${index} missing required field: id`);
        }
        if (!hasNonEmptyString(item.title)) {
            errors.push(`Item ${index} missing required field: title`);
        }
        if (!hasNonEmptyString(item.verification)) {
            errors.push(`Item ${index} missing required field: verification`);
        }
        if (!Array.isArray(item.steps)) {
            errors.push(`Item ${index} missing required field: steps`);
        }
    });
    return errors;
}
function isValidPRD(prd) {
    return validatePRD(prd).length === 0;
}
//# sourceMappingURL=validator.js.map