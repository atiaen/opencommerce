import { Html } from "@react-email/html";
import { Text } from "@react-email/text";
import { Section } from "@react-email/section";
import { Container } from "@react-email/container";

interface EmailProps {
    name:string,
    reserveNum:string
}

export default function OrderPlaced(props: EmailProps) {
  return (
    <Html>
      <Section style={main}>
        <Container style={container}>
          <Text style={heading}>Hi there! {props.name}</Text>
          <Text style={paragraph}>Congratulations!!🎉💃🏾🎉 Your order {props.reserveNum} has been placed!</Text>
          <Text style={paragraph}>An admin/supervisor will contact you shortly regarding your order.</Text>
          <Text style={paragraph}>Please keep an eye out on your email and phone number.</Text>
          <Text style={paragraph}>Thank you for shopping at Medzone!!!</Text>
        </Container>
      </Section>
    </Html>
  );
}

// Styles for the email template
const main = {
  backgroundColor: "#ffffff",
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "580px",
};

const heading = {
  fontSize: "32px",
  lineHeight: "1.3",
  fontWeight: "700",
  color: "#484848",
};

const paragraph = {
  fontSize: "18px",
  lineHeight: "1.4",
  color: "#484848",
};
