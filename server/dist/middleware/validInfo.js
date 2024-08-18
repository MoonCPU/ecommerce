"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(req, res, next) {
    const { email, name, password } = req.body;
    function validEmail(userEmail) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
    }
    if (req.path === "/register") {
        console.log(!email.length);
        if (![email, name, password].every(Boolean)) {
            return res.json("Missing Credentials");
        }
        else if (!validEmail(email)) {
            return res.json("Invalid Email");
        }
    }
    else if (req.path === "/login") {
        if (![email, password].every(Boolean)) {
            return res.json("Missing Credentials");
        }
        else if (!validEmail(email)) {
            return res.json("Invalid Email");
        }
    }
    next();
}
exports.default = default_1;
//# sourceMappingURL=validInfo.js.map