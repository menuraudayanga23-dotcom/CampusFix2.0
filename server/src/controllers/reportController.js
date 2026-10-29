import mongoose from "mongoose";
import InfrastructureReport from "../models/InfrastructureReport.js";

export const createReport = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      building,
      location,
      priority,
      status,
      reporter,
      photo
    } = req.body;

    if (!reporter) {
      return res.status(400).json({
        success: false,
        message: "Reporter is required"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(reporter)) {
      return res.status(400).json({
        success: false,
        message: "Reporter must be a valid user ID"
      });
    }

    const report = await InfrastructureReport.create({
      title,
      description,
      category,
      building,
      location,
      priority,
      status,
      reporter,
      photo
    });

    const populatedReport = await report.populate(
      "reporter",
      "name email role"
    );

    return res.status(201).json({
      success: true,
      message: "Infrastructure report created successfully",
      data: populatedReport
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (validationError) => ({
          field: validationError.path,
          message: validationError.message
        })
      );

      return res.status(400).json({
        success: false,
        message: "Report validation failed",
        errors: validationErrors
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "One of the submitted values has an invalid format"
      });
    }

    console.error("Create report error:", error);

    return res.status(500).json({
      success: false,
      message: "The report could not be created"
    });
  }
};
