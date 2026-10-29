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



const allowedSortFields = {
  title: "title",
  priority: "priority",
  status: "status",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};

const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const listReports = async (req, res) => {
  try {
    const {
      search = "",
      category,
      priority,
      status,
      reporter,
      sortBy = "createdAt",
      order = "desc"
    } = req.query;

    const filters = {};

    if (search.trim()) {
      const safeSearch = escapeRegex(search.trim());
      const searchPattern = new RegExp(safeSearch, "i");

      filters.$or = [
        { title: searchPattern },
        { description: searchPattern },
        { building: searchPattern },
        { location: searchPattern }
      ];
    }

    if (category) {
      filters.category = category;
    }

    if (priority) {
      filters.priority = priority;
    }

    if (status) {
      filters.status = status;
    }

    if (reporter) {
      if (!mongoose.Types.ObjectId.isValid(reporter)) {
        return res.status(400).json({
          success: false,
          message: "Reporter must be a valid user ID"
        });
      }

      filters.reporter = reporter;
    }

    const selectedSortField =
      allowedSortFields[sortBy] || allowedSortFields.createdAt;

    const sortDirection = order.toLowerCase() === "asc" ? 1 : -1;

    const reports = await InfrastructureReport.find(filters)
      .populate("reporter", "name email role")
      .sort({
        [selectedSortField]: sortDirection
      })
      .lean();

    return res.status(200).json({
      success: true,
      count: reports.length,
      filters: {
        search,
        category: category || null,
        priority: priority || null,
        status: status || null,
        reporter: reporter || null,
        sortBy: selectedSortField,
        order: sortDirection === 1 ? "asc" : "desc"
      },
      data: reports
    });
  } catch (error) {
    console.error("List reports error:", error);

    return res.status(500).json({
      success: false,
      message: "Reports could not be loaded"
    });
  }
};

export const getReportById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Report ID is invalid"
      });
    }

    const report = await InfrastructureReport.findById(id)
      .populate("reporter", "name email role")
      .lean();

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error("Get report error:", error);

    return res.status(500).json({
      success: false,
      message: "The report could not be loaded"
    });
  }
};
const editableReportFields = [
  "title",
  "description",
  "category",
  "building",
  "location",
  "priority",
  "status",
  "photo"
];

export const updateReport = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Report ID is invalid"
      });
    }

    const updateData = {};

    for (const field of editableReportFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one editable field is required"
      });
    }

    const updatedReport = await InfrastructureReport.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    )
      .populate("reporter", "name email role")
      .lean();

    if (!updatedReport) {
      return res.status(404).json({
        success: false,
        message: "Report not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Infrastructure report updated successfully",
      data: updatedReport
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

    console.error("Update report error:", error);

    return res.status(500).json({
      success: false,
      message: "The report could not be updated"
    });
  }
};
