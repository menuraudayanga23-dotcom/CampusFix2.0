import mongoose from "mongoose";
import InfrastructureReport from "../models/InfrastructureReport.js";

const allowedSortFields = {
  title: "title",
  priority: "priority",
  status: "status",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
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

const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const isAdministrator = (user) => {
  return user.role === "administrator";
};

const canAccessReport = (report, user) => {
  return (
    isAdministrator(user) ||
    report.reporter.toString() === user._id.toString()
  );
};

export const createReport = async (req, res) => {
  try {
    if (!req.user) {
  return res.status(401).json({
    success: false,
    message: "You must log in to create a report"
  });
}

    const {
      title,
      description,
      category,
      building,
      location,
      priority,
      status,
      photo
    } = req.body;

    const report = await InfrastructureReport.create({
      title,
      description,
      category,
      building,
      location,
      priority,
      status,
      photo,
      reporter: req.user._id
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

    console.error("Create report error:", error);

    return res.status(500).json({
      success: false,
      message: "The report could not be created"
    });
  }
};

export const listReports = async (req, res) => {
  try {
    if (!req.user) {
  return res.status(401).json({
    success: false,
    message: "You must log in to view reports"
  });
}

    const {
      search = "",
      category,
      priority,
      status,
      sortBy = "createdAt",
      order = "desc"
    } = req.query;

    const filters = {};

    if (!isAdministrator(req.user)) {
      filters.reporter = req.user._id;
    }

    if (search.trim()) {
      const searchPattern = new RegExp(
        escapeRegex(search.trim()),
        "i"
      );

      filters.$or = [
        { title: searchPattern },
        { description: searchPattern },
        { building: searchPattern },
        { location: searchPattern }
      ];
    }

    if (category) filters.category = category;
    if (priority) filters.priority = priority;
    if (status) filters.status = status;

    const selectedSortField =
      allowedSortFields[sortBy] || allowedSortFields.createdAt;

    const sortDirection = order.toLowerCase() === "asc" ? 1 : -1;

    const reports = await InfrastructureReport.find(filters)
      .populate("reporter", "name email role")
      .sort({ [selectedSortField]: sortDirection })
      .lean();

    return res.status(200).json({
      success: true,
      count: reports.length,
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

    if (!canAccessReport(report, req.user)) {
      return res.status(403).json({
        success: false,
        message: "You cannot access this report"
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

export const updateReport = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Report ID is invalid"
      });
    }

    const existingReport = await InfrastructureReport.findById(id);

    if (!existingReport) {
      return res.status(404).json({
        success: false,
        message: "Report not found"
      });
    }

    if (!canAccessReport(existingReport, req.user)) {
      return res.status(403).json({
        success: false,
        message: "You cannot update this report"
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

    return res.status(200).json({
      success: true,
      message: "Infrastructure report updated successfully",
      data: updatedReport
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Report validation failed",
        errors: Object.values(error.errors).map((item) => ({
          field: item.path,
          message: item.message
        }))
      });
    }

    console.error("Update report error:", error);

    return res.status(500).json({
      success: false,
      message: "The report could not be updated"
    });
  }
};

export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Report ID is invalid"
      });
    }

    const existingReport = await InfrastructureReport.findById(id);

    if (!existingReport) {
      return res.status(404).json({
        success: false,
        message: "Report not found"
      });
    }

    if (!canAccessReport(existingReport, req.user)) {
      return res.status(403).json({
        success: false,
        message: "You cannot delete this report"
      });
    }

    await InfrastructureReport.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Infrastructure report deleted successfully"
    });
  } catch (error) {
    console.error("Delete report error:", error);

    return res.status(500).json({
      success: false,
      message: "The report could not be deleted"
    });
  }
};
