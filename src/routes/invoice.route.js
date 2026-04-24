import { Router } from "express";
import {
  createInvoice,
  deleteInvoice,
  getInvoiceById,
  getInvoices,
  markAsPaid,
  updateInvoice,
} from "../controller/invoice.controller.js";

const router = Router();
/**
 * @swagger
 * /api/create-invoices:
 *   post:
 *     summary: Create a new invoice (or save as draft)
 *     tags: [Invoices]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               createdAt:
 *                 type: string
 *                 example: "2026-04-22T00:00:00.000Z"
 *               paymentTerms:
 *                 type: number
 *                 example: 30
 *               description:
 *                 type: string
 *                 example: "Website redesign"
 *               clientName:
 *                 type: string
 *                 example: "John Doe"
 *               clientEmail:
 *                 type: string
 *                 example: "john@example.com"
 *               senderAddress:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
 *                   postCode:
 *                     type: string
 *                   country:
 *                     type: string
 *               clientAddress:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
 *                   postCode:
 *                     type: string
 *                   country:
 *                     type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                     price:
 *                       type: number
 *               status:
 *                 type: string
 *                 enum: [draft, pending]
 *                 example: "pending"
 *     responses:
 *       201:
 *         description: Invoice created or saved as draft
 *         content:
 *           application/json:
 *             example:
 *               message: "Invoice created successfully"
 *               data: {}
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             example:
 *               message: "Client name and email are required"
 *       500:
 *         description: Server error
 */
router.post("/create-invoices", createInvoice);
/**
 * @swagger
 * /api/invoices:
 *   get:
 *     summary: Get all invoices (filterable by status)
 *     tags: [Invoices]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         example: "draft,pending"
 *     responses:
 *       200:
 *         description: List of invoices
 *         content:
 *           application/json:
 *             example:
 *               count: 2
 *               data: []
 *       500:
 *         description: Failed to fetch invoices
 */
router.get("/invoices", getInvoices);
/**
 * @swagger
 * /api/invoices/{id}:
 *   get:
 *     summary: Get invoice by ID
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "FD3206"
 *     responses:
 *       200:
 *         description: Invoice found
 *         content:
 *           application/json:
 *             example:
 *               data: {}
 *       404:
 *         description: Invoice not found
 *       500:
 *         description: Server error
 */
router.get("/invoices/:id", getInvoiceById);
/**
 * @swagger
 * /api/invoices/{id}:
 *   patch:
 *     summary: Update an invoice (cannot update paid invoices)
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "FD3206"
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clientName:
 *                 type: string
 *               clientEmail:
 *                 type: string
 *               items:
 *                 type: array
 *               status:
 *                 type: string
 *                 enum: [draft, pending, paid]
 *     responses:
 *       200:
 *         description: Invoice updated
 *         content:
 *           application/json:
 *             example:
 *               message: "Invoice updated successfully"
 *               data: {}
 *       400:
 *         description: Invalid status or paid invoice edit
 *       404:
 *         description: Invoice not found
 *       500:
 *         description: Server error
 */
router.patch("/invoices/:id", updateInvoice);
/**
 * @swagger
 * /api/invoices/{id}/pay:
 *   patch:
 *     summary: Mark invoice as paid
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "FD3206"
 *     responses:
 *       200:
 *         description: Invoice marked as paid
 *         content:
 *           application/json:
 *             example:
 *               message: "Invoice marked as paid"
 *               data: {}
 *       400:
 *         description: Invalid operation (already paid or draft)
 *       404:
 *         description: Invoice not found
 *       500:
 *         description: Server error
 */
router.patch("/invoices/:id/pay", markAsPaid);

/**
 * @swagger
 * /api/invoices/{id}:
 *   delete:
 *     summary: Delete an invoice
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "FD3206"
 *     responses:
 *       200:
 *         description: Invoice deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Invoice deleted successfully"
 *               data: {}
 *       400:
 *         description: Missing invoice ID
 *       404:
 *         description: Invoice not found
 *       500:
 *         description: Server error
 */
router.delete("/invoices/:id", deleteInvoice);

export default router;
