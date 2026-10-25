import mongoose from "mongoose";

const infrastructureReportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Report title is required"],
      trim: true,
      minlength: [5, "Report title must contain at least 5 characters"],
      maxlength: [120, "Report title cannot exceed 120 characters"]
    },

    description: {
      type: String,
      required: [true, "Report description is required"],
      trim: true,
      minlength: [
        10,
        "Report description must contain at least 10 characters"
      ],
      maxlength: [
        2000,
        "Report description cannot exceed 2000 characters"
      ]
    },

    category: {
      type: String,
      required: [true, "Report category is required"],
      enum: {
        values: [
          "Furniture",
          "Electrical",
          "Plumbing",
          "Building/Facilities",
          "IT/Network",
          "Roads/Grounds"
        ],
        message: "Please select a valid report category"
      }
    },

    building: {
      type: String,
      required: [true, "Building is required"],
      trim: true,
      maxlength: [120, "Building cannot exceed 120 characters"]
    },

    location: {
      type: String,
      required: [true, "Exact location is required"],
      trim: true,
      maxlength: [200, "Location cannot exceed 200 characters"]
    },

    priority: {
      type: String,
      required: [true, "Priority is required"],
      enum: {
        values: ["Low", "Medium", "High", "Critical"],
        message: "Please select a valid priority"
      },
      default: "Medium"
    },

    status: {
      type: String,
      enum: {
        values: ["Pending", "In Progress", "Resolved"],
        message: "Please select a valid report status"
      },
      default: "Pending"
    },

    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Reporter is required"]
    },

    photo: {
      url: {
        type: String,
        trim: true
      },

      filename: {
        type: String,
        trim: true
      },

      contentType: {
        type: String,
        trim: true
      }
    }
  },
  {
    timestamps: true
  }
);

infrastructureReportSchema.index({
  title: "text",
  description: "text",
  building: "text",
  location: "text"
});

infrastructureReportSchema.index({ status: 1 });
infrastructureReportSchema.index({ category: 1 });
infrastructureReportSchema.index({ priority: 1 });
infrastructureReportSchema.index({ reporter: 1 });
infrastructureReportSchema.index({ createdAt: -1 });

const InfrastructureReport = mongoose.model(
  "InfrastructureReport",
  infrastructureReportSchema
);

export default InfrastructureReport;
