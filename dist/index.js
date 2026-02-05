"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadTemplate = exports.getTemplateNames = exports.validatePRD = exports.isValidPRD = void 0;
exports.main = main;
function main() {
    console.log("PRD Generator CLI");
}
if (require.main === module) {
    main();
}
var validator_1 = require("./validator");
Object.defineProperty(exports, "isValidPRD", { enumerable: true, get: function () { return validator_1.isValidPRD; } });
Object.defineProperty(exports, "validatePRD", { enumerable: true, get: function () { return validator_1.validatePRD; } });
var template_loader_1 = require("./template-loader");
Object.defineProperty(exports, "getTemplateNames", { enumerable: true, get: function () { return template_loader_1.getTemplateNames; } });
Object.defineProperty(exports, "loadTemplate", { enumerable: true, get: function () { return template_loader_1.loadTemplate; } });
//# sourceMappingURL=index.js.map