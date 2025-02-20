"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SubscriptionController {
    constructor(subscriptionService) {
        this.createSubscription = async (req, res) => {
            try {
                const { plan } = req.body;
                const { userId } = req.headers["x-user"]
                    ? JSON.parse(req.headers["x-user"])
                    : null;
                const sessionUrl = await this.subscriptionService.createSubscription(userId, plan);
                res.json({ sessionUrl });
            }
            catch (error) {
                console.log(error);
                res.status(400).json({ error: error.message });
            }
        };
        this.subscriptionService = subscriptionService;
    }
}
exports.default = SubscriptionController;
