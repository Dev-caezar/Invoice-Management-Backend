import { Router } from "express";
import {
  createInvoice,
  getInvoiceById,
  getInvoices,
  markAsPaid,
  updateInvoice,
} from "../controller/invoice.controller.js";

const router = Router();
/**
 * @swagger
 * /create-invoices:
 *   post:
 *     summary: Create a new invoice
 *     tags: [Invoices]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clientName
 *               - clientEmail
 *               - items
 *             properties:
 *               createdAt:
 *                 type: string
 *                 example: "2026-04-22"
 *               paymentTerms:
 *                 type: number
 *                 example: 30
 *               description:
 *                 type: string
 *                 example: "Website redesign"
 *               clientName:
 *                 type: string
 *               clientEmail:
 *                 type: string
 *               senderAddress:
 *                 type: object
 *               clientAddress:
 *                 type: object
 *               items:
 *                 type: array
 *               status:
 *                 type: string
 *                 enum: [draft, pending]
 *     responses:
 *       201:
 *         description: Invoice created
 */
router.post("/create-invoices", createInvoice);
/**
 * @swagger
 * /invoices:
 *   get:
 *     summary: Get all invoices
 *     tags: [Invoices]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         example: draft,pending
 *     responses:
 *       200:
 *         description: List of invoices
 */
router.get("/invoices", getInvoices);
/**
 * @swagger
 * /invoices/{id}:
 *   get:
 *     summary: Get invoice by ID
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: FD3206
 *     responses:
 *       200:
 *         description: Invoice found
 *       404:
 *         description: Invoice not found
 */
router.get("/invoices/:id", getInvoiceById);
/**
 * @swagger
 * /invoices/{id}:
 *   patch:
 *     summary: Update an invoice
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               clientName: "Jane Doe"
 *     responses:
 *       200:
 *         description: Invoice updated
 */
router.patch("/invoices/:id", updateInvoice);
/**
 * @swagger
 * /invoices/{id}/pay:
 *   patch:
 *     summary: Mark invoice as paid
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Invoice marked as paid
 */
router.patch("/invoices/:id/pay", markAsPaid);

export default router;
