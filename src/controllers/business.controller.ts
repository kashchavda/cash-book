import { Request, Response } from "express";
import { Business } from "../models/business.model";

// CREATE BUSINESS
export const createBusiness = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    const { businessName, businessCategory, country, gstn, phone } = req.body;

    if (!businessName || !businessCategory || !country || !gstn) {
      return res.status(400).json({
        message: "businessName, businessCategory, country and gstn are required"
      });
    }

    const business = await Business.create({
      owner: userId,
      businessName,
      businessCategory,
      country,
      gstn,
      phone: phone || "",
      businessPhoto: ""
    });

    return res.status(201).json({
      message: "Business created successfully",
      business
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET ALL BUSINESSES OF USER
export const getAllBusinesses = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    const businesses = await Business.find({ owner: userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Businesses fetched successfully",
      businesses
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET SINGLE BUSINESS
export const getBusinessById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { businessId } = req.params;

    const business = await Business.findOne({ _id: businessId, owner: userId });

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    return res.status(200).json({
      message: "Business fetched successfully",
      business
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// UPDATE BUSINESS
export const updateBusiness = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { businessId } = req.params;

    const { businessName, businessCategory, country, gstn, phone } = req.body;

    const business = await Business.findOne({ _id: businessId, owner: userId });

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    business.businessName = businessName || business.businessName;
    business.businessCategory = businessCategory || business.businessCategory;
    business.country = country || business.country;
    business.gstn = gstn || business.gstn;
    business.phone = phone || business.phone;

    await business.save();

    return res.status(200).json({
      message: "Business updated successfully",
      business
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE BUSINESS
export const deleteBusiness = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { businessId } = req.params;

    const business = await Business.findOneAndDelete({
      _id: businessId,
      owner: userId
    });

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    return res.status(200).json({
      message: "Business deleted successfully"
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ADD LOCATION
export const addBusinessLocation = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { businessId } = req.params;

    const { locationName, address, pincode, city, state, landmark } = req.body;

    if (!locationName || !address || !pincode || !city || !state) {
      return res.status(400).json({
        message: "locationName, address, pincode, city and state are required"
      });
    }

    const business = await Business.findOne({ _id: businessId, owner: userId });

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    business.locations.push({
      locationName,
      address,
      pincode,
      city,
      state,
      landmark: landmark || ""
    });

    await business.save();

    return res.status(201).json({
      message: "Location added successfully",
      business
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// UPDATE LOCATION
export const updateBusinessLocation = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { businessId, locationId } = req.params;

    const business = await Business.findOne({ _id: businessId, owner: userId });

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    const location = business.locations.id(String(locationId));

    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    location.locationName = req.body.locationName || location.locationName;
    location.address = req.body.address || location.address;
    location.pincode = req.body.pincode || location.pincode;
    location.city = req.body.city || location.city;
    location.state = req.body.state || location.state;
    location.landmark = req.body.landmark || location.landmark;

    await business.save();

    return res.status(200).json({
      message: "Location updated successfully",
      business
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE LOCATION
export const deleteBusinessLocation = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { businessId, locationId } = req.params;

    const business = await Business.findOne({ _id: businessId, owner: userId });

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    const location = business.locations.id(String(locationId));

    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    location.deleteOne();
    await business.save();

    return res.status(200).json({
      message: "Location deleted successfully"
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// UPLOAD BUSINESS PHOTO
export const uploadBusinessPhoto = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { businessId } = req.params;

    const business = await Business.findOne({ _id: businessId, owner: userId });

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Photo is required" });
    }

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    business.businessPhoto = fileUrl;
    await business.save();

    return res.status(200).json({
      message: "Business photo uploaded successfully",
      business
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

