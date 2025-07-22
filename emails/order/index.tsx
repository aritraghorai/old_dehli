import {
  Body,
  Container,
  Column,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Row,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { Button } from '@react-email/components';

import { Order } from '../../src/entities/order.entity.js';
import { order } from './data.js';

// const baseUrl = `https://api.mountainroots.co.in`;
const baseUrl = `https://api.mountainroots.co.in`;

interface Order_EmailProps {
  order: Order;
  status: string;
}

// Helper function to convert 24-hour time to 12-hour format
const formatTime12Hour = (time24: string): string => {
  console.log('Time24 ' + time24);
  const [hours, minutes] = time24.split(':');
  let hour = parseInt(hours, 10);
  hour = typeof hour === 'number' ? hour : 0; // Ensure hour is a number
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${hour12}:${minutes} ${period}`;
};

export const Order_Email = ({ order, status }: Order_EmailProps) => (
  <Html>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
    </Head>

    <Body style={main}>
      <Container style={container}>
        {/* Header Section */}
        <Section style={header}>
          <Row>
            <Column align="center">
              <Img
                src={`${baseUrl}/static/images/old_dehli.png`}
                width="80"
                height="80"
                alt="Old Delhi Foods"
                style={logo}
              />
              <Text style={storeName}>Old Delhi Store</Text>
            </Column>
          </Row>
        </Section>

        {/* Status Banner */}
        <Section style={statusBanner}>
          <Text style={statusText}>Your Order has been {status}</Text>
          <Text style={orderNumber}>
            Order #{order.id.slice(-8).toUpperCase()}
          </Text>
        </Section>

        {/* Order Info Card */}
        <Section style={infoCard}>
          <Row>
            <Column style={infoColumn}>
              <Text style={infoLabel}>Order Date</Text>
              <Text style={infoValue}>
                {new Date(order.createdAt).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </Column>
            <Column style={infoColumn}>
              <Text style={infoLabel}>Payment Method</Text>
              <Text style={infoValue}>
                {order.paymentGateway === 'CASH_ON_DELIVERY'
                  ? 'Cash on Delivery'
                  : order.paymentGateway}
              </Text>
            </Column>
          </Row>
          <Row style={{ marginTop: '20px' }}>
            <Column align="center">
              <Link
                href={`${baseUrl}/order/pdf/${order.id}`}
                style={downloadButton}
              >
                📄 Download Invoice PDF
              </Link>
            </Column>
          </Row>
        </Section>

        {/* Order Items */}
        <Section style={itemsSection}>
          <Text style={sectionTitle}>Order Items</Text>

          {/* Table Header */}
          <Row style={tableHeader}>
            <Column style={{ width: '50%' }}>
              <Text style={tableHeaderText}>Item</Text>
            </Column>
            <Column style={{ width: '15%' }} align="center">
              <Text style={tableHeaderText}>Qty</Text>
            </Column>
            <Column style={{ width: '35%' }} align="right">
              <Text style={tableHeaderText}>Price</Text>
            </Column>
          </Row>

          {/* Order Items */}
          {order.orderItems.map((item, index) => (
            <Row
              key={item.id}
              style={{
                ...tableRow,
                backgroundColor: index % 2 === 0 ? '#fafafa' : '#ffffff',
              }}
            >
              <Column style={{ width: '50%', padding: '15px 10px' }}>
                <Text style={itemName}>{item.productItem.product.name}</Text>
                {item.productItem?.productConfig?.length > 0 && (
                  <Text style={itemVariant}>
                    {item.productItem.productConfig.reduce((prev, curr) => {
                      const val = curr?.optionValue?.value ?? '';
                      return prev + (prev ? ', ' : '') + val;
                    }, '')}
                  </Text>
                )}
              </Column>
              <Column
                style={{ width: '15%', padding: '15px 10px' }}
                align="center"
              >
                <Text style={itemQuantity}>{item.quantity}</Text>
              </Column>
              <Column
                style={{ width: '35%', padding: '15px 10px' }}
                align="right"
              >
                <Text style={itemPrice}>
                  ₹{(item.price * item.quantity).toLocaleString()}
                </Text>
              </Column>
            </Row>
          ))}
        </Section>

        {/* Order Summary */}
        <Section style={summarySection}>
          <Row style={summaryRow}>
            <Column align="right" style={{ width: '70%' }}>
              <Text style={summaryLabel}>Subtotal</Text>
            </Column>
            <Column align="right" style={{ width: '30%' }}>
              <Text style={summaryValue}>
                ₹{(order.grandTotal - order.deliveryCharge).toLocaleString()}
              </Text>
            </Column>
          </Row>

          <Row style={summaryRow}>
            <Column align="right" style={{ width: '70%' }}>
              <Text style={summaryLabel}>Delivery Charge</Text>
            </Column>
            <Column align="right" style={{ width: '30%' }}>
              <Text style={summaryValue}>
                ₹{order.deliveryCharge.toLocaleString()}
              </Text>
            </Column>
          </Row>

          <Hr style={summaryDivider} />

          <Row style={summaryRow}>
            <Column align="right" style={{ width: '70%' }}>
              <Text style={totalLabel}>Grand Total</Text>
            </Column>
            <Column align="right" style={{ width: '30%' }}>
              <Text style={totalValue}>
                ₹{order.grandTotal.toLocaleString()}
              </Text>
            </Column>
          </Row>
        </Section>

        {/* Addresses Section */}
        <Section style={addressSection}>
          <Row>
            <Column style={addressColumn}>
              <Text style={addressTitle}>🏠 Billing Address</Text>
              <Text style={addressText}>
                {order.billingAddress.name}
                <br />
                {order.billingAddress.address}
                <br />
                {order.billingAddress.landmark &&
                  `${order.billingAddress.landmark}, `}
                {order.billingAddress.city}
                <br />
                {order.billingAddress.state} -{' '}
                {order.billingAddress.pincode.pincode}
                <br />
                📱 {order.orderAddress.mobile}
              </Text>
            </Column>

            <Column style={addressColumn}>
              <Text style={addressTitle}>🚚 Shipping Address</Text>
              <Text style={addressText}>
                {order.orderAddress.name}
                <br />
                {order.orderAddress.address}
                <br />
                {order.orderAddress.landmark &&
                  `${order.orderAddress.landmark}, `}
                {order.orderAddress.city}
                <br />
                {order.orderAddress.state} -{' '}
                {order.orderAddress.pincode.pincode}
                <br />
                📱 {order.orderAddress.mobile}
              </Text>
            </Column>
          </Row>

          {/* Delivery Date and Time - Left aligned */}
          {order.orderAddress.deliveryDate && (
            <Row style={{ marginTop: '20px' }}>
              <Column style={{ width: '100%' }}>
                <Text style={deliveryInfo}>
                  📅 Delivery Date:{' '}
                  {new Date(order.orderAddress.deliveryDate).toLocaleDateString(
                    'en-US',
                    {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    },
                  )}
                  <br />
                  🕐 Delivery Time:{' '}
                  {formatTime12Hour(
                    order.orderAddress.startTime.toString(),
                  )} - {formatTime12Hour(order.orderAddress.endTime.toString())}
                </Text>
              </Column>
            </Row>
          )}
        </Section>

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerText}>Need help? Contact us on WhatsApp</Text>
          <Link href="https://wa.link/fx1qa0" style={whatsappButton}>
            <Img
              src={`${baseUrl}/static/images/whatapp.png`}
              width="24"
              height="24"
              alt="WhatsApp"
              style={{ verticalAlign: 'middle', marginRight: '8px' }}
            />
            Chat with us
          </Link>

          <Text style={copyright}>
            © 2024 Old Delhi Store. All rights reserved.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default Order_Email;

Order_Email.PreviewProps = {
  order: order as any,
  status: 'Placed',
} as Order_EmailProps;

// Styles
const main = {
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
  backgroundColor: '#f6f9fc',
  margin: 0,
  padding: 0,
};

const container = {
  margin: '0 auto',
  padding: '20px',
  maxWidth: '600px',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
};

const header = {
  textAlign: 'center' as const,
  padding: '20px 0 30px',
  borderBottom: '2px solid #f0f0f0',
};

const logo = {
  borderRadius: '50%',
  border: '3px solid #e74c3c',
};

const storeName = {
  fontSize: '28px',
  fontWeight: '700',
  color: '#2c3e50',
  margin: '15px 0 0 0',
  letterSpacing: '-0.5px',
};

const statusBanner = {
  backgroundColor: '#27ae60',
  padding: '25px',
  borderRadius: '8px',
  textAlign: 'center' as const,
  margin: '20px 0',
};

const statusText = {
  fontSize: '20px',
  fontWeight: '600',
  color: '#ffffff',
  margin: '0 0 5px 0',
};

const orderNumber = {
  fontSize: '14px',
  color: '#d5f4e6',
  margin: 0,
  fontWeight: '500',
};

const infoCard = {
  backgroundColor: '#f8f9fa',
  padding: '25px',
  borderRadius: '8px',
  margin: '20px 0',
  border: '1px solid #e9ecef',
};

const infoColumn = {
  width: '50%',
  padding: '0 10px',
};

const infoLabel = {
  fontSize: '12px',
  fontWeight: '600',
  color: '#6c757d',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  margin: '0 0 5px 0',
};

const infoValue = {
  fontSize: '16px',
  fontWeight: '500',
  color: '#2c3e50',
  margin: 0,
};

const downloadButton = {
  backgroundColor: '#e74c3c',
  color: '#ffffff',
  padding: '12px 24px',
  borderRadius: '6px',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: '600',
  display: 'inline-block',
  boxShadow: '0 2px 4px rgba(231, 76, 60, 0.2)',
};

const itemsSection = {
  margin: '30px 0',
};

const sectionTitle = {
  fontSize: '20px',
  fontWeight: '600',
  color: '#2c3e50',
  margin: '0 0 20px 0',
  borderBottom: '2px solid #e74c3c',
  paddingBottom: '8px',
};

const tableHeader = {
  backgroundColor: '#34495e',
  padding: '0',
  borderRadius: '8px 8px 0 0',
};

const tableHeaderText = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#ffffff',
  margin: 0,
  padding: '15px 10px',
};

const tableRow = {
  borderBottom: '1px solid #e9ecef',
};

const itemName = {
  fontSize: '15px',
  fontWeight: '600',
  color: '#2c3e50',
  margin: '0 0 5px 0',
  lineHeight: '1.4',
};

const itemVariant = {
  fontSize: '12px',
  color: '#6c757d',
  margin: 0,
  fontStyle: 'italic',
};

const itemQuantity = {
  fontSize: '14px',
  fontWeight: '500',
  color: '#2c3e50',
  margin: 0,
};

const itemPrice = {
  fontSize: '15px',
  fontWeight: '600',
  color: '#27ae60',
  margin: 0,
};

const summarySection = {
  backgroundColor: '#f8f9fa',
  padding: '25px',
  borderRadius: '8px',
  margin: '20px 0',
  border: '1px solid #e9ecef',
};

const summaryRow = {
  padding: '8px 0',
};

const summaryLabel = {
  fontSize: '14px',
  color: '#6c757d',
  margin: 0,
  fontWeight: '500',
};

const summaryValue = {
  fontSize: '14px',
  color: '#2c3e50',
  margin: 0,
  fontWeight: '600',
};

const summaryDivider = {
  border: 'none',
  borderTop: '2px solid #e74c3c',
  margin: '15px 0',
};

const totalLabel = {
  fontSize: '18px',
  fontWeight: '700',
  color: '#2c3e50',
  margin: 0,
};

const totalValue = {
  fontSize: '20px',
  fontWeight: '700',
  color: '#e74c3c',
  margin: 0,
};

const addressSection = {
  margin: '30px 0',
};

const addressColumn = {
  width: '50%',
  padding: '0 15px',
  verticalAlign: 'top' as const,
};

const addressTitle = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#2c3e50',
  margin: '0 0 10px 0',
};

const addressText = {
  fontSize: '14px',
  color: '#495057',
  margin: '0 0 15px 0',
  lineHeight: '1.5',
};

const deliveryInfo = {
  fontSize: '14px',
  color: '#27ae60',
  margin: 0,
  fontWeight: '500',
  padding: '15px',
  backgroundColor: '#d5f4e6',
  borderRadius: '8px',
  lineHeight: '1.5',
  textAlign: 'left' as const,
};

const footer = {
  textAlign: 'center' as const,
  padding: '30px 0',
  borderTop: '2px solid #f0f0f0',
  marginTop: '30px',
};

const footerText = {
  fontSize: '14px',
  color: '#6c757d',
  margin: '0 0 15px 0',
};

const whatsappButton = {
  backgroundColor: '#25d366',
  color: '#ffffff',
  padding: '10px 20px',
  borderRadius: '25px',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: '600',
  display: 'inline-flex',
  alignItems: 'center',
  boxShadow: '0 2px 4px rgba(37, 211, 102, 0.2)',
};

const copyright = {
  fontSize: '12px',
  color: '#adb5bd',
  margin: '20px 0 0 0',
};
