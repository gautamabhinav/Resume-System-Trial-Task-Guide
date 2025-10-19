// controllers/admin.controller.js
import asyncHandler from '../middlewares/asyncHandler.middleware.js';
import AppError from '../utils/AppError.js';
import User from '../models/user.model.js';

// Get all users
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');
  res.status(200).json({ success: true, users });
});

// Update role
export const updateUserRole = asyncHandler(async (req, res, next) => {
//   const { role } = req.body;
//   const { id } = req.params;

//   if (!['USER', 'ADMIN', 'SUPERADMIN'].includes(role)) {
//     return next(new AppError('Invalid role provided', 400));
//   }

//   // Only SUPERADMIN can assign SUPERADMIN role
//   if (role === 'SUPERADMIN' && req.user.role !== 'SUPERADMIN') {
//     return next(new AppError('Only SUPERADMIN can assign SUPERADMIN role', 403));
//   }

//   const user = await User.findByIdAndUpdate(
//     id,
//     { role },
//     { new: true, runValidators: true }
//   );

//   if (!user) return next(new AppError('User not found', 404));

//   res.status(200).json({ success: true, user });

    try {
        const { role } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) return res.status(404).json({ message: "User not found" });

        // Prevent superadmin from being downgraded accidentally
        if (user.role === "SUPERADMIN") {
        return res.status(403).json({ message: "Cannot change SUPERADMIN role" });
        }

        user.role = role;
        await user.save();

        return res.json({ message: "Role updated", user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete user
export const deleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) return next(new AppError('User not found', 404));

  await user.remove();

  res.status(200).json({ success: true, message: 'User deleted successfully' });
});
