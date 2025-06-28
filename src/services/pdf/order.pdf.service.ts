import { Order } from '@/entities/order.entity.js';
import PDFDocument from 'pdfkit';
import path from 'path';

function createInvoice(order: Order) {
  let doc = new PDFDocument({ size: 'A4', margin: 50 });

  generateHeader(doc);
  generateCustomerInformation(doc, order);
  generateInvoiceTable(doc, order);
  generateFooter(doc);
  return doc;
}

function generateHeader(doc: PDFKit.PDFDocument) {
  doc
    .image('logo.png', 50, 45, { width: 50 })
    .fillColor('#444444')
    .fontSize(20)
    .text('Old Dehli Foods', 110, 57)
    .fontSize(10)
    .text('151 – A, Club Road,', 200, 50, { align: 'right' })
    .text('Sainik Farm,', 200, 65, { align: 'right' })
    .text('New Delhi -110062, India', 200, 80, { align: 'right' })
    .moveDown();
}

function generateCustomerInformation(doc: PDFKit.PDFDocument, order: Order) {
  doc.fillColor('#444444').fontSize(20).text('Invoice', 50, 160);

  generateHr(doc, 185);

  const customerInformationTop = 200;

  doc
    .fontSize(10)
    .text('Invoice Number:', 50, customerInformationTop)
    .font('Helvetica-Bold')
    .text(order.id, 150, customerInformationTop)
    .font('Helvetica')
    .text('Invoice Date:', 50, customerInformationTop + 15)
    .text(formatDate(new Date()), 150, customerInformationTop + 15)
    .text('Balance Due:', 50, customerInformationTop + 30)
    .text(
      formatCurrency(order.grandTotal + order.deliveryCharge),
      150,
      customerInformationTop + 30,
    )
    .text('Delivery Date:', 50, customerInformationTop + 45)
    .text(
      new Date(order.orderAddress.deliveryDate).toLocaleString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      150,
      customerInformationTop + 45,
    )
    .text('Delivery Time:', 50, customerInformationTop + 60)
    .text(
      order.orderAddress.startTime + '-' + order.orderAddress.endTime,
      150,
      customerInformationTop + 60,
    )

    .font('Helvetica-Bold')
    .text(order.orderAddress.name, 400, customerInformationTop)
    .font('Helvetica')
    .text(order.orderAddress.address, 400, customerInformationTop + 15)
    .text(
      order.orderAddress.city +
        ', ' +
        order.orderAddress.state +
        ', ' +
        order.orderAddress.pincode.pincode +
        '\n',
      400,
      customerInformationTop + 30,
    )
    .moveDown();

  generateHr(doc, 274);
}

function generateInvoiceTable(doc: PDFKit.PDFDocument, order: Order) {
  let i;
  const invoiceTableTop = 330;

  doc.font('Helvetica-Bold');
  generateTableRow(
    doc,
    invoiceTableTop,
    'Item',
    'Weight(gram)',
    'Varient',
    'Quantity',
    'Price',
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font('Helvetica');

  for (i = 0; i < order.orderItems.length; i++) {
    const item = order.orderItems[i];
    const position = invoiceTableTop + (i + 1) * 30;
    let varient = '';
    console.log(item.productItem.productConfig);
    if (item.productItem?.productConfig?.length > 0) {
      varient = item.productItem.productConfig
        .map(config => config.optionValue.value)
        .join(', ');
    }
    generateTableRow(
      doc,
      position,
      item.productItem.product.name.length > 30
        ? item.productItem.product.name.substring(0, 30) + '...'
        : item.productItem.product.name,
      String(item.productItem.weight),
      varient,
      item.quantity,
      formatCurrency(item.price * item.quantity),
    );

    generateHr(doc, position + 20);
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  // generateTableRow(
  //   doc,
  //   subtotalPosition,
  //   '',
  //   'Subtotal',
  //   '',
  //   formatCurrency(order.grandTotal + order.deliveryCharge),
  // );
  let y = subtotalPosition;

  doc
    .fontSize(10)
    .text('', 50, subtotalPosition + 15)
    .font('Helvetica-Bold')
    .text('Subtotal', 200, y)
    // .text(unitCost, 280, y, { width: 90, align: 'right' })
    .text('', 370, y, { width: 90, align: 'right' })
    .font('Helvetica')
    .text(formatCurrency(order.grandTotal - order.deliveryCharge), 0, y, {
      align: 'right',
    });

  y = subtotalPosition + 15;
  doc
    .fontSize(10)
    .text('', 50, subtotalPosition + 15)
    .font('Helvetica-Bold')
    .text('Delivery Charge', 200, y)
    // .text(unitCost, 280, y, { width: 90, align: 'right' })
    .text('', 370, y, { width: 90, align: 'right' })
    .font('Helvetica')
    .text(formatCurrency(order.deliveryCharge), 0, y, { align: 'right' });

  // generateTableRow(
  //   doc,
  //   subtotalPosition + 15,
  //   '',
  //   'DeliveryCharge',
  //   '',
  //   formatCurrency(order.deliveryCharge),
  // );
  y = subtotalPosition + 30;
  doc
    .fontSize(10)
    .text('', 50, subtotalPosition + 15)
    .font('Helvetica-Bold')
    .text('Grand Total', 200, y)
    // .text(unitCost, 280, y, { width: 90, align: 'right' })
    .text('', 370, y, { width: 90, align: 'right' })
    .font('Helvetica')
    .text(formatCurrency(order.deliveryCharge + order.grandTotal), 0, y, {
      align: 'right',
    });

  // generateTableRow(
  //   doc,
  //   subtotalPosition + 30,
  //   '',
  //   'GrandTotal',
  //   '',
  //   formatCurrency(order.deliveryCharge + order.grandTotal),
  // );

  const paidToDatePosition = subtotalPosition + 20;
  // generateTableRow(
  //   doc,
  //   paidToDatePosition,
  //   '',
  //   '',
  //   'Paid To Date',
  //   '',
  //   formatCurrency(order.paid),
  // );
  //
  // const duePosition = paidToDatePosition + 25;
  // doc.font('Helvetica-Bold');
  // generateTableRow(
  //   doc,
  //   duePosition,
  //   '',
  //   '',
  //   'Balance Due',
  //   '',
  //   formatCurrency(order.subtotal - order.paid),
  // );
  doc.font('Helvetica');
}

function generateFooter(doc: PDFKit.PDFDocument) {
  doc.fontSize(10).text('Thank you for your business.', 50, 730, {
    align: 'center',
    width: 500,
  });

  // Contact information
  doc
    .fontSize(10)
    .text('Get in Touch', 50, 745, {
      align: 'center',
      width: 500,
    })
    .text('Call Us: +917289938122', 50, 760, {
      align: 'center',
      width: 500,
    })
    .text('Email Us: info@olddelhifoods.com', 50, 775, {
      align: 'center',
      width: 500,
    });
}

function generateTableRow(
  doc: PDFKit.PDFDocument,
  y: number,
  item: string,
  weight: string,
  varient: string,
  quantity,
  lineTotal,
) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    // .text(weight, 200, y)
    .text(varient || '-', 330, y, { width: 90, align: 'center' })
    // .text(unitCost, 280, y, { width: 90, align: 'right' })
    .text(quantity, 370, y, { width: 90, align: 'right' })
    .text(lineTotal, 0, y, { align: 'right' });
}

function generateHr(doc, y) {
  doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 3,
});

function formatCurrency(cents) {
  return 'Rs. ' + currencyFormatter.format(cents);
}

function formatDate(date: Date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return year + '/' + month + '/' + day;
}

export default {
  createInvoice,
};
