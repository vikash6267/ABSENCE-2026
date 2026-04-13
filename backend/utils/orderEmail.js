const { sendEmail } = require('./email');

const formatMoney = (value) => `Rs. ${Number(value || 0).toFixed(2)}`;

const buildItemsRows = (items = []) =>
  items
    .map((item) => {
      const qty = Number(item.quantity || 0);
      const price = Number(item.price || 0);
      const lineTotal = qty * price;
      return `
        <tr>
          <td style="padding:10px;border-bottom:1px solid #eceff3;">${item.name || '-'}</td>
          <td style="padding:10px;border-bottom:1px solid #eceff3;">${item.size || '-'}</td>
          <td style="padding:10px;border-bottom:1px solid #eceff3;text-align:right;">${qty}</td>
          <td style="padding:10px;border-bottom:1px solid #eceff3;text-align:right;">${formatMoney(price)}</td>
          <td style="padding:10px;border-bottom:1px solid #eceff3;text-align:right;">${formatMoney(lineTotal)}</td>
        </tr>
      `;
    })
    .join('');

const buildAddressBlock = (shippingAddress = {}) =>
  [
    shippingAddress.name,
    shippingAddress.phone,
    shippingAddress.addressLine1,
    shippingAddress.addressLine2,
    [shippingAddress.city, shippingAddress.state].filter(Boolean).join(', '),
    shippingAddress.pincode,
  ]
    .filter(Boolean)
    .join('<br/>') || '-';

const getSubject = (context, order) => {
  if (context === 'status_updated') {
    return `Order ${order.orderNumber} status updated to ${String(order.orderStatus || '').toUpperCase()}`;
  }
  return `Order Confirmation - ${order.orderNumber}`;
};

const buildHtml = (order, context) => {
  const couponText = order.couponUsed?.code
    ? `${order.couponUsed.code} (- ${formatMoney(order.couponUsed.discount)})`
    : '-';

  const statusNote =
    context === 'status_updated'
      ? `<p style="margin:0 0 14px;color:#0f172a;">Your order status is now <strong>${String(
          order.orderStatus || '-'
        ).toUpperCase()}</strong>.</p>`
      : `<p style="margin:0 0 14px;color:#0f172a;">Your order has been placed successfully.</p>`;

  return `
    <div style="font-family:Arial,sans-serif;color:#111;background:#f7f8fa;padding:20px;">
      <div style="max-width:760px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:20px;">
        <h2 style="margin:0 0 6px;">ABSENCE</h2>
        <p style="margin:0 0 14px;color:#6b7280;">Order #${order.orderNumber}</p>
        ${statusNote}
        <p style="margin:0 0 6px;"><strong>Payment:</strong> ${order.paymentStatus || '-'}</p>
        <p style="margin:0 0 12px;"><strong>Order Status:</strong> ${order.orderStatus || '-'}</p>

        <h3 style="margin:16px 0 8px;">Items</h3>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <thead>
            <tr style="background:#f8fafc;">
              <th style="padding:10px;text-align:left;border-bottom:1px solid #eceff3;">Product</th>
              <th style="padding:10px;text-align:left;border-bottom:1px solid #eceff3;">Size</th>
              <th style="padding:10px;text-align:right;border-bottom:1px solid #eceff3;">Qty</th>
              <th style="padding:10px;text-align:right;border-bottom:1px solid #eceff3;">Unit</th>
              <th style="padding:10px;text-align:right;border-bottom:1px solid #eceff3;">Total</th>
            </tr>
          </thead>
          <tbody>${buildItemsRows(order.items || [])}</tbody>
        </table>

        <h3 style="margin:18px 0 8px;">Pricing</h3>
        <p style="margin:2px 0;"><strong>Subtotal:</strong> ${formatMoney(order.subtotal)}</p>
        <p style="margin:2px 0;"><strong>Discount:</strong> - ${formatMoney(order.discount)}</p>
        <p style="margin:2px 0;"><strong>Shipping:</strong> ${formatMoney(order.shippingCost)}</p>
        <p style="margin:2px 0;"><strong>Coupon:</strong> ${couponText}</p>
        <p style="margin:6px 0 0;"><strong>Grand Total:</strong> ${formatMoney(order.total)}</p>

        <h3 style="margin:18px 0 8px;">Shipping Address</h3>
        <p style="margin:0;line-height:1.55;">${buildAddressBlock(order.shippingAddress)}</p>
      </div>
    </div>
  `;
};

const sendOrderMail = async ({ to, order, context = 'created' }) => {
  if (!to || !order) return;
  await sendEmail({
    to,
    subject: getSubject(context, order),
    html: buildHtml(order, context),
  });
};

module.exports = { sendOrderMail };
