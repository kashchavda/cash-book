import mongoose, { Schema, Document } from "mongoose";

export interface IPermission extends Document {
  supervisor: mongoose.Types.ObjectId;
  permissions: string[];
}

const permissionSchema = new Schema<IPermission>(
  {
    supervisor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    permissions: [{ type: String }],
  },
  { timestamps: true }
);

export const Permission = mongoose.model<IPermission>(
  "Permission",
  permissionSchema
);