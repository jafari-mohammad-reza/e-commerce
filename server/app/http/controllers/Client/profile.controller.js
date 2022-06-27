const DefaultController = require("../default.controller");
module.exports = new (class ProfileController extends DefaultController {
    async changePassword(req, res, next) {
        try {
            const user = req?.user;
            const { password, confirmPassword } = req.body;
            if (password !== confirmPassword) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: "password and confirmPassword must be same",
                });
            }
            if (compareHashedPassword(password, user.password)) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: "new password cannot be same as old one",
                });
            }
            user.password = hashPassword(password);
            await user.save();
            return res.status(StatusCodes.OK).json({
                success: true,
                message: "your password has been changed successfully",
            });
        } catch (error) {
            next(createError.InternalServerError(error));
        }
    }
})();
