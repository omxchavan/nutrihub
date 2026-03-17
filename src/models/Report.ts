import mongoose, { Schema, Document } from "mongoose";

export interface IReport extends Document {
    userId: string;
    period: "daily" | "weekly" | "monthly";
    startDate: Date;
    endDate: Date;
    avgCalories: number;
    avgProtein: number;
    goalAdherence: number;
    aiSummary: string;
    createdAt: Date;
}

const ReportSchema: Schema = new Schema(
    {
        userId: { type: String, required: true, index: true },
        period: { type: String, enum: ["daily", "weekly", "monthly"], required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        avgCalories: { type: Number, required: true },
        avgProtein: { type: Number, required: true },
        goalAdherence: { type: Number, required: true },
        aiSummary: { type: String, required: true },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.models.Report || mongoose.model<IReport>("Report", ReportSchema);
