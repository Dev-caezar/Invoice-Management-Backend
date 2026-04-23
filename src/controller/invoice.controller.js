import invoiceModel from "../model/invoice.model.js";
import { calculateInvoice } from "../utils/calculateInvoice.js";
import { calculatePaymentDue } from "../utils/dateHelper.js";
import { generateInvoiceId } from "../utils/generateInvoiceId.js";

export const createInvoice = async (req, res) => {
  try {
    const {
      createdAt,
      paymentTerms,
      description,
      clientName,
      clientEmail,
      senderAddress,
      clientAddress,
      items,
      status,
    } = req.body;

    // 🔴 Validation
    if (!clientName || !clientEmail) {
      return res.status(400).json({
        message: "Client name and email are required",
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "At least one item is required",
      });
    }

    // 🔢 Calculate totals
    const { calculatedItems, total } = calculateInvoice(items);

    // 📅 Payment due
    const paymentDue = calculatePaymentDue(createdAt, paymentTerms);

    // 🆔 Generate ID (no loop)
    const invoiceId = generateInvoiceId();

    const invoice = new invoiceModel({
      id: invoiceId,
      createdAt,
      paymentDue,
      paymentTerms,
      description,
      status: status || "pending",

      senderAddress,
      clientName,
      clientEmail,
      clientAddress,

      items: calculatedItems,
      total,
    });

    await invoice.save();

    return res.status(201).json({
      message: "Invoice created successfully",
      data: invoice,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Duplicate invoice ID, try again",
      });
    }

    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getInvoices = async (req, res) => {
  try {
    const { status } = req.query;

    let query = {};

    if (status) {
      // allow multiple: ?status=draft,pending
      const statusArray = status.split(",");

      query.status = { $in: statusArray };
    }

    const invoices = await invoiceModel.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      count: invoices.length,
      data: invoices,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch invoices",
    });
  }
};

export const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await invoiceModel.findOne({ id });

    if (!invoice) {
      return res.status(404).json({
        message: "Invoice not found",
      });
    }

    return res.status(200).json({
      data: invoice,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch invoice",
    });
  }
};

export const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    const existingInvoice = await invoiceModel.findOne({ id });

    if (!existingInvoice) {
      return res.status(404).json({
        message: "Invoice not found",
      });
    }

    if (existingInvoice.status === "paid") {
      return res.status(400).json({
        message: "Paid invoices cannot be edited",
      });
    }

    const {
      createdAt,
      paymentTerms,
      description,
      clientName,
      clientEmail,
      senderAddress,
      clientAddress,
      items,
      status,
    } = req.body;

    let calculatedItems = existingInvoice.items;
    let total = existingInvoice.total;

    if (items && items.length > 0) {
      const result = calculateInvoice(items);
      calculatedItems = result.calculatedItems;
      total = result.total;
    }

    // 📅 Recalculate payment due if needed
    let paymentDue = existingInvoice.paymentDue;

    if (createdAt || paymentTerms) {
      const newCreatedAt = createdAt || existingInvoice.createdAt;
      const newTerms = paymentTerms || existingInvoice.paymentTerms;

      paymentDue = calculatePaymentDue(newCreatedAt, newTerms);
    }

    // ⚠️ Validate status
    const allowedStatus = ["draft", "pending", "paid"];
    if (status && !allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status value",
      });
    }

    // 📦 Update fields (only if provided)
    existingInvoice.createdAt = createdAt || existingInvoice.createdAt;
    existingInvoice.paymentTerms = paymentTerms || existingInvoice.paymentTerms;
    existingInvoice.paymentDue = paymentDue;

    existingInvoice.description = description || existingInvoice.description;

    existingInvoice.clientName = clientName || existingInvoice.clientName;
    existingInvoice.clientEmail = clientEmail || existingInvoice.clientEmail;

    existingInvoice.senderAddress =
      senderAddress || existingInvoice.senderAddress;
    existingInvoice.clientAddress =
      clientAddress || existingInvoice.clientAddress;

    existingInvoice.items = calculatedItems;
    existingInvoice.total = total;

    existingInvoice.status = status || existingInvoice.status;

    await existingInvoice.save();

    return res.status(200).json({
      message: "Invoice updated successfully",
      data: existingInvoice,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to update invoice",
    });
  }
};

export const markAsPaid = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await invoiceModel.findOne({ id });

    if (!invoice) {
      return res.status(404).json({
        message: "Invoice not found",
      });
    }

    if (invoice.status === "paid") {
      return res.status(400).json({
        message: "Invoice is already paid",
      });
    }

    if (invoice.status === "draft") {
      return res.status(400).json({
        message: "Draft invoice cannot be marked as paid",
      });
    }

    invoice.status = "paid";

    await invoice.save();

    return res.status(200).json({
      message: "Invoice marked as paid",
      data: invoice,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to update invoice status",
      error: error.message,
    });
  }
};
