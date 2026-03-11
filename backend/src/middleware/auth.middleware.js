import { requireAuth, clerkClient } from "@clerk/express";
import { User } from "../models/user.model.js";
import { ENV } from "../config/env.js";

export const protectRoute = [
    requireAuth({ signInUrl: undefined }),
    async (req, res, next) => {
        try {
            const auth = req.auth();
            const clerkId = auth.userId;

            if (!clerkId) {
                return res.status(401).json({ 
                    message: "Unauthorized - Invalid token" 
                });
            }

            let user = await User.findOne({ clerkId });

            if (!user) {
                try {
                    const clerkUser = await clerkClient.users.getUser(clerkId);
                    const email = clerkUser.emailAddresses[0]?.emailAddress || '';
                    const name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || email.split('@')[0];
                    const imageUrl = clerkUser.imageUrl || '';

                    user = await User.findOneAndUpdate(
                        { email },
                        { $set: { 
                            clerkId, 
                            imageUrl, 
                            role: clerkUser.publicMetadata?.role || "user" 
                        }, 
                        $setOnInsert: { name, email } 
                    },
                    { upsert: true, new: true, setDefaultsOnInsert: true }
                    );
                    console.log(`Auto-sync: usuario sincronizado en MongoDB — ${email}`);
                } catch (syncError) {
                    console.error("Error auto-sincronizando usuario desde Clerk:", syncError.message);
                    return res.status(404).json({
                        message: "User not found"
                    });
                }
            }

            if (!user.isActive) {
                const adminEmail = ENV.ADMIN_EMAIL;
                return res.status(403).json({
                    code: "ACCOUNT_INACTIVE",
                    message: adminEmail
                        ? `Tu cuenta ha sido desactivada. Escríbenos a ${adminEmail} para recuperarla.`
                        : "Tu cuenta ha sido desactivada. Contacta a soporte para recuperarla.",
                });
            }

            req.user = user;
            req.clerkAuth = auth;
            
            next();
        } catch (error) {
            console.error("Error in protectRoute middleware:", error);
            return res.status(500).json({ 
                message: "Internal server error" 
            });
        }
    }
];

export const adminOnly = async (req, res, next) => {
    try {
        if (!req.user || !req.clerkAuth) {
            return res.status(401).json({ 
                message: "Unauthorized - authentication required" 
            });
        }

        const isAdmin = req.user.role === 'admin' || 
                        req.clerkAuth.sessionClaims?.role === 'admin';

        if (!isAdmin) {
            return res.status(403).json({ 
                message: "Forbidden - admin access only"
            });
        }

        next();
    } catch (error) {
        console.error("Error in adminOnly middleware:", error);
        return res.status(500).json({ 
            message: "Internal server error" 
        });
    }
};

export const requireRole = (allowedRoles) => {
    return async (req, res, next) => {
        try {
            if (!req.clerkAuth) {
                return res.status(401).json({ 
                    message: "Unauthorized - authentication required" 
                });
            }

            const userRole = req.clerkAuth.sessionClaims?.role;

            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({ 
                    message: "Forbidden - insufficient permissions"
                });
            }

            next();
        } catch (error) {
            console.error("Error in requireRole middleware:", error);
            return res.status(500).json({ 
                message: "Internal server error" 
            });
        }
    };
};