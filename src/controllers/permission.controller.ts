import { Request, Response } from "express";
import { Permission } from "../models/permission.model";

export const setPermissions = async (req: Request, res: Response) => {
  try {
    const { supervisorId, permissions } = req.body;

    const permission = await Permission.findOneAndUpdate(
      { supervisor: supervisorId },
      { permissions },
      { upsert: true, new: true }
    );

    res.status(200).json({
      message: "Permissions updated",
      data: permission,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPermissions = async (req: Request, res: Response) => {
  try {
    const permission = await Permission.findOne({
      supervisor: req.params.supervisorId,
    });

    res.status(200).json({ data: permission });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};