import type { Request, Response } from "express";
import prisma from "../../datasource";
import { success, failure } from "../../utils/responses";
import type { Order } from "../../types";

// Get payment accepted status ID (used in order creation)
const getPaymentAcceptedStatusId = async (): Promise<number> => {
  const status = await prisma.orderStatus.findUnique({
    where: { name: 'Payment Accepted' }
  });
  return status?.id || 1; // Default to 1 if not found
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  try {
    const orderData: Order = req.body;

    // Basic validation
    if (!orderData.items?.length || !orderData.customerDetails || !orderData.paymentDetails) {
      return failure({ 
        res, 
        status: 400, 
        message: "Missing required order data" 
      });
    }

    // Get payment accepted status
    const statusId = await getPaymentAcceptedStatusId();

    // Create order with all related data in a transaction
    const order = await prisma.$transaction(async (prisma) => {
      // Create the main order
      const order = await prisma.order.create({
        data: {
          customerName: orderData.customerDetails.name,
          customerEmail: orderData.customerDetails.email,
          customerAddress: orderData.customerDetails.address,
          subtotal: orderData.subtotal,
          tax: orderData.tax,
          total: orderData.total,
          statusId: statusId,
          items: {
            create: orderData.items.map(item => ({
              movieId: parseInt(item.productId),
              quantity: item.quantity,
              price: item.price
            }))
          },
          paymentDetails: {
            create: {
              cardNumber: orderData.paymentDetails.cardNumber,
              expiryDate: orderData.paymentDetails.expiryDate,
              cvc: orderData.paymentDetails.cvc
            }
          }
        },
        include: {
          items: {
            include: {
              movie: true
            }
          },
          paymentDetails: true,
          orderStatus: true
        }
      });

      return order;
    });

    return success({ 
      res, 
      status: 201, 
      data: order, 
      message: "Order created successfully" 
    });
  } catch (error) {
    console.error('Error in create order:', error);
    return failure({ res, message: error });
  }
};

export const findOne = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id = Number(req.params.id);
    
    if (isNaN(id)) {
      return failure({ res, status: 400, message: "Invalid ID format" });
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            movie: true
          }
        },
        paymentDetails: true,
        orderStatus: true
      }
    });

    if (!order) {
      return failure({ res, status: 404, message: "Order not found" });
    }

    return success({ res, data: order });
  } catch (error) {
    return failure({ res, message: error });
  }
};

export const findAll = async (req: Request, res: Response): Promise<Response> => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            movie: true
          }
        },
        paymentDetails: true,
        orderStatus: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    return success({ res, data: orders });
  } catch (error) {
    return failure({ res, message: error });
  }
};

export const updateStatus = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = Number(req.params.id);
    const { statusId } = req.body;

    if (isNaN(id)) {
      return failure({ res, status: 400, message: "Invalid order ID format" });
    }

    if (!statusId || isNaN(Number(statusId))) {
      return failure({ res, status: 400, message: "Invalid status ID" });
    }

    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id }
    });

    if (!existingOrder) {
      return failure({ res, status: 404, message: "Order not found" });
    }

    // Check if status exists
    const existingStatus = await prisma.orderStatus.findUnique({
      where: { id: Number(statusId) }
    });

    if (!existingStatus) {
      return failure({ res, status: 404, message: "Order status not found" });
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { statusId: Number(statusId) },
      include: {
        items: {
          include: {
            movie: true
          }
        },
        paymentDetails: true,
        orderStatus: true
      }
    });

    return success({ 
      res, 
      data: updatedOrder, 
      message: "Order status updated successfully" 
    });
  } catch (error) {
    console.error('Error in update order status:', error);
    return failure({ res, message: error });
  }
};