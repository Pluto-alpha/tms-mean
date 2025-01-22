import { Request, Response, NextFunction } from 'express';
import User from '../models/UserModel';

export const getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).select('-password');
        if (!user) {
            res.status(404).json({ status: false, msg: 'User not found' });
            return;
        }
        res.status(200).json([user]);
    } catch (error: any) {
        next(error)
    }
}
export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.params.id;
        let updateData = { ...req.body };
        const user = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select("-password");
        if (!user) {
            res.status(404).json({ status: false, msg: "User not found" });
            return;
        }
        res.status(200).json({ status: true, msg: "User updated successfully", user });
    } catch (error: any) {
        next(error)
    }
};
