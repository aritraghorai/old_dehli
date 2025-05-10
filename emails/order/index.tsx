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

const baseUrl = `https://api.mountainroots.co.in`;
// const baseUrl = `http://localhost:3001`;

interface Order_EmailProps {
  order: Order;
  status: string;
}

export const Order_Email = ({ order, status }: Order_EmailProps) => (
  <Html>
    <Head />

    <Body style={main}>
      <Container style={container}>
        <Section>
          <Row>
            <Column>
              <Text style={heading}>Your Order {status}</Text>
            </Column>

            <Column align="right" style={tableCell}>
              <Text style={heading}>Receipt</Text>
            </Column>
          </Row>
        </Section>
        <Section style={informationTable}>
          <Row style={informationTableRow}>
            <Column colSpan={2}>
              <Section>
                <Row>
                  <Column style={informationTableColumn}>
                    <Text style={informationTableLabel}>INVOICE DATE</Text>
                    <Text style={informationTableValue}>
                      {new Date(order.createdAt).toDateString()}
                    </Text>
                  </Column>
                </Row>

                <Row>
                  <Column style={informationTableColumn}>
                    <Link
                      href={`${baseUrl}/order/pdf/${order.id}`}
                      style={{
                        color: 'white',
                        padding: '10px 20px',
                        backgroundColor: 'red',
                        borderRadius: '5px',
                        cursor: 'pointer',
                      }}
                    >
                      Download Pdf
                    </Link>
                  </Column>
                </Row>
              </Section>
            </Column>
            {/* { */}
            {/*   !!order.billingAddress &&            <Column style={informationTableColumn} colSpan={2}> */}
            {/*   <Text style={informationTableLabel}>BILLED TO</Text> */}
            {/*   <Text style={informationTableValue}> */}
            {/*       {order.billingAddress.} */}
            {/*   </Text> */}
            {/*   <Text style={informationTableValue}>Alan Turing</Text> */}
            {/*   <Text style={informationTableValue}>2125 Chestnut St</Text> */}
            {/*   <Text style={informationTableValue}>San Francisco, CA 94123</Text> */}
            {/*   <Text style={informationTableValue}>USA</Text> */}
            {/* </Column> */}
            {/**/}
            {/* } */}
          </Row>
        </Section>
        <Section style={productTitleTable}>
          <Text style={productsTitle}>Old Dehli Store</Text>
        </Section>
        <Section>
          <Row>
            <Column
              style={{
                width: '40%',
                alignItems: 'center',
              }}
            >
              <Text style={{ ...productTitle }}></Text>
            </Column>
            <Column style={{ width: '20%' }} align="left">
              <Text style={{ ...productPrice }}>Varient</Text>
            </Column>

            <Column style={{ width: '20%' }} align="right">
              <Text style={{ ...productPrice, paddingLeft: '10px' }}>
                Quantity
              </Text>
            </Column>

            <Column
              style={{ ...productPriceWrapper, width: '20%' }}
              align="right"
            >
              <Text style={productPrice}>Price</Text>
            </Column>
          </Row>

          {order.orderItems.map(ele => (
            <Row>
              <Column style={{ width: '40%' }}>
                <Text style={productTitle}>{ele.productItem.product.name}</Text>
              </Column>
              <Column
                style={{
                  ...productPriceWrapper,
                  width: '20%',
                }}
                align="left"
              >
                <Text
                  style={{
                    ...productPriceWrapper,
                  }}
                >
                  {ele.productItem?.productConfig?.reduce((prev, curr) => {
                    console.log(curr);
                    const val = curr?.optionValue?.value ?? '';
                    return prev + ' ' + val;
                  }, '')}
                </Text>
              </Column>

              <Column
                style={{
                  ...productPriceWrapper,
                  width: '20%',
                }}
                align="right"
              >
                <Text style={productPrice}>{ele.quantity}</Text>
              </Column>

              <Column
                style={{
                  ...productPriceWrapper,
                  width: '20%',
                }}
                align="right"
              >
                <Text style={productPrice}>Rs.{ele.price}</Text>
              </Column>
            </Row>
          ))}
        </Section>
        <Hr style={productPriceLine} />
        <Section align="right">
          <Row>
            <Column style={tableCell} align="right">
              <Text style={productPriceTotal}>Total</Text>
            </Column>
            <Column style={productPriceVerticalLine}></Column>
            <Column style={productPriceLargeWrapper}>
              <Text style={productPriceLarge}>
                Rs.{order.grandTotal - order.deliveryCharge}
              </Text>
            </Column>
          </Row>
          <Row>
            <Column style={tableCell} align="right">
              <Text style={productPriceTotal}>Delivery Charge</Text>
            </Column>
            <Column style={productPriceVerticalLine}></Column>
            <Column style={productPriceLargeWrapper}>
              <Text style={productPriceLarge}>Rs.{order.deliveryCharge}</Text>
            </Column>
          </Row>

          <Row>
            <Column style={tableCell} align="right">
              <Text style={productPriceTotal}>Grand Total</Text>
            </Column>
            <Column style={productPriceVerticalLine}></Column>
            <Column style={productPriceLargeWrapper}>
              <Text style={productPriceLarge}>Rs.{order.grandTotal}</Text>
            </Column>
          </Row>
        </Section>
        <Hr style={{}} />
        <Section align="center">
          <Row align="center">
            <Column style={{}}>
              <Row>
                <Text style={heading}>Billing Address</Text>
                <Text style={NormalText}>
                  {order.billingAddress.name},{order.billingAddress.landmark},
                  {order.billingAddress.city},
                  {order.billingAddress.pincode.pincode},
                  {order.billingAddress.state}
                </Text>
              </Row>
            </Column>
          </Row>
        </Section>
        <Hr style={{}} />
        <Section align="center">
          <Row align="center">
            <Column style={{}}>
              <Row>
                <Text style={heading}>Shipping Address</Text>
                <Text style={NormalText}>
                  {order.orderAddress.name},{order.orderAddress.landmark},
                  {order.orderAddress.city},{order.orderAddress.pincode.pincode}
                  ,{order.orderAddress.state}
                </Text>
              </Row>
            </Column>
          </Row>
        </Section>
        <Hr style={productPriceLineBottom} />
        <Section>
          <Row>
            <Column align="center" style={block}>
              <Img
                src={`${baseUrl}/static/images/old_dehli.png`}
                width="60"
                height="60"
                alt="old_dehli"
              />
            </Column>
          </Row>
        </Section>
        <Text style={footerCopyright}>
          Copyright © 2023 Old Dehli <br />{' '}
          {/* <Link href="https://www.apple.com/legal/">All rights reserved</Link> */}
        </Text>
        <Section>
          <Row>
            <Column align="center" style={block}>
              <Text
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  justifyContent: 'center',
                }}
              >
                Contact Us On{' '}
                <Link
                  href="https://wa.link/fx1qa0"
                  style={{ display: 'inline' }}
                >
                  <Img
                    src={`${baseUrl}/static/images/whatapp.png`}
                    style={{
                      cursor: 'pointer',
                    }}
                    width="20"
                    height="20"
                    alt="What app"
                  />
                </Link>
              </Text>
            </Column>
          </Row>
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

const main = {
  fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
  backgroundColor: '#ffffff',
};

const resetText = {
  margin: '0',
  padding: '0',
  lineHeight: 1.4,
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '660px',
  maxWidth: '100%',
};

const tableCell = { display: 'table-cell' };

const heading = {
  fontSize: '20px',
  fontWeight: '400',
  color: '#000',
};

const informationTable = {
  borderCollapse: 'collapse' as const,
  borderSpacing: '0px',
  color: 'rgb(51,51,51)',
  backgroundColor: 'rgb(250,250,250)',
  borderRadius: '3px',
  fontSize: '12px',
};

const informationTableRow = {
  height: '46px',
};

const informationTableColumn = {
  paddingLeft: '20px',
  borderStyle: 'solid',
  borderColor: 'white',
  borderWidth: '0px 1px 1px 0px',
  height: '44px',
};

const informationTableLabel = {
  ...resetText,
  color: 'rgb(102,102,102)',
  fontSize: '10px',
};

const informationTableValue = {
  fontSize: '12px',
  margin: '0',
  padding: '0',
  lineHeight: 1.4,
};

const productTitleTable = {
  ...informationTable,
  margin: '30px 0 15px 0',
  height: '24px',
};

const productsTitle = {
  background: '#fafafa',
  paddingLeft: '10px',
  fontSize: '14px',
  fontWeight: '500',
  margin: '0',
};

const productIcon = {
  margin: '0 0 0 20px',
  borderRadius: '14px',
  border: '1px solid rgba(128,128,128,0.2)',
};

const productTitle = { fontSize: '12px', fontWeight: '600', ...resetText };

const productPriceTotal = {
  margin: '0',
  color: 'rgb(102,102,102)',
  fontSize: '14px',
  fontWeight: '600',
  padding: '0px 30px 0px 0px',
  textAlign: 'right' as const,
};

const NormalText = {
  margin: '0',
};

const productPrice = {
  fontSize: '12px',
  fontWeight: '600',
  margin: '0',
};

const productPriceLarge = {
  margin: '0px 20px 0px 0px',
  fontSize: '16px',
  fontWeight: '600',
  whiteSpace: 'nowrap' as const,
  textAlign: 'right' as const,
};

const productPriceWrapper = {
  display: 'table-cell',
  padding: '0px 20px 0px 0px',
  verticalAlign: 'top',
};

const productPriceLine = { margin: '30px 0 0 0' };

const productPriceVerticalLine = {
  height: '48px',
  borderLeft: '1px solid',
  borderColor: 'rgb(238,238,238)',
};

const productPriceLargeWrapper = { display: 'table-cell', width: '90px' };

const productPriceLineBottom = { margin: '0 0 75px 0' };

const block = { display: 'block' };

const footerCopyright = {
  margin: '25px 0 0 0',
  textAlign: 'center' as const,
  fontSize: '12px',
  color: 'rgb(102,102,102)',
};
