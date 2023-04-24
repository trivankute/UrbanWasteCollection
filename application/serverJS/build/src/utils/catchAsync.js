"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function catchAsync(fn) {
    return (req, res, next) => {
        fn(req, res, next).catch((e) => next(e));
    };
}
exports.default = catchAsync;
