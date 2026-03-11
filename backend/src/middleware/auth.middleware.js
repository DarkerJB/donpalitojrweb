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

            // Auto-sync: usuario existe en Clerk pero no está en MongoDB con ese clerkId
            // Puede ocurrir cuando: (a) el webhook de Inngest no disparó, o (b) el usuario
            // fue recreado en Clerk Dashboard y tiene un nuevo clerkId para el mismo email.
            if (!user) {
                try {
                    const clerkUser = await clerkClient.users.getUser(clerkId);
                    const email = clerkUser.emailAddresses[0]?.emailAddress || '';
                    const name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || email.split('@')[0];
                    const imageUrl = clerkUser.imageUrl || '';

                    // findOneAndUpdate con upsert: si existe por email actualiza el clerkId,
                    // si no existe lo crea — evita el duplicate key error en email
                    user = await User.findOneAndUpdate(
                        { email },
                        { $set: { clerkId, imageUrl }, $setOnInsert: { name, email } },
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
        console.log("SESSION CLAIMS:", JSON.stringify(req.clerkAuth.sessionClaims));
        if (!req.user || !req.clerkAuth) {
            console.error("adminOnly: protectRoute no se ejecutó primero");
            return res.status(401).json({ 
                message: "Unauthorized - authentication required" 
            });
        }

        const userRole = req.clerkAuth.sessionClaims?.role;
        const userEmail = req.user.email;

        if (ENV.NODE_ENV === 'development') {
            console.log(`Admin check:`, {
                email: userEmail,
                role: userRole || 'sin role',
                clerkId: req.user.clerkId
            });
        }

        const isAdmin = userRole === 'admin';
        
        const isAdminByEmail = ENV.NODE_ENV === 'development' &&
                                ENV.ADMIN_EMAIL && 
                                ENV.ADMIN_EMAIL.split(',')
                                    .map(e => e.trim())
                                    .includes(userEmail);

        if (!isAdmin && !isAdminByEmail) {
            if (ENV.NODE_ENV === 'development') {
                console.log(`Acceso denegado:`, {
                    email: userEmail,
                    role: userRole || 'sin rol'
                });
            }        
            return res.status(403).json({ 
                message: "Forbidden - admin access only",
                details: ENV.NODE_ENV === 'development' 
                    ? `Rol actual: ${userRole || 'ninguno'}` 
                    : undefined
            });
        }

        if (ENV.NODE_ENV === 'development') {
            console.log(`Admin autorizado: ${userEmail} (${isAdmin ? 'por rol' : 'por email'})`);
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