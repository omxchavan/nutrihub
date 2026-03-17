import mongoose, { Schema, Document } from "mongoose";

export interface IFoodLog extends Document {
    userId: string;
    date: Date;
    mealType: string;
    foodName: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    quantity: string;
    createdAt: Date;
}

const FoodLogSchema: Schema = new Schema(
    {
        userId: { type: String, required: true, index: true },
        date: { type: Date, required: true, default: Date.now },
        mealType: { type: String, required: true },
        foodName: { type: String, required: true },
        calories: { type: Number, required: true },
        protein: { type: Number, required: true },
        carbs: { type: Number, required: true },
        fat: { type: Number, required: true },
        fiber: { type: Number, required: true, default: 0 },
        quantity: { type: String, required: true },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.models.FoodLog || mongoose.model<IFoodLog>("FoodLog", FoodLogSchema);
