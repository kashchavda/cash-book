import { Request, Response } from "express";
import { Location } from "../models/location.model";

export const createLocation = async (req: Request, res: Response) => {
  try {
    console.log("BODY:", req.body);

    const { name, address, latitude, longitude } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Location name is required" });
    }

    const location = await Location.create({
      name,
      address,
      latitude,
      longitude
    });

    return res.status(201).json({
      message: "Location created successfully",
      data: location
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

export const getAllLocations = async (req: Request, res: Response) => {
  try {
    const locations = await Location.find().sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Locations fetched successfully",
      total: locations.length,
      data: locations
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};
