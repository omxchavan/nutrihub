import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    userId: string;
    age: number;
    gender: string;
    height: number;
    weight: number;
    activityLevel: string;
    goalType: string;
    targetCalories: number;
    targetProtein: number;
    targetCarbs: number;
    targetFat: number;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        userId: { type: String, required: true, unique: true },
        age: { type: Number, required: true },
        gender: { type: String, required: true },
        height: { type: Number, required: true },
        weight: { type: Number, required: true },
        activityLevel: { type: String, required: true },
        goalType: { type: String, required: true },
        targetCalories: { type: Number, required: true },
        targetProtein: { type: Number, required: true },
        targetCarbs: { type: Number, required: true },
        targetFat: { type: Number, required: true },
    },
    { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
