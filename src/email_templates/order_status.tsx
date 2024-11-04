import { Html } from "@react-email/html";
import { Text } from "@react-email/text";
import { Section } from "@react-email/section";
import { Container } from "@react-email/container";

interface EmailProps {
    name:string,
    reserveNum:string,
    order_status:string,
}

export default function OrderStatus(props: EmailProps) {
  return (
    <Html>
      <Section style={main}>
        {props.order_status === "Accepted" ? <Container style={container}>
          <Text style={paragraph}>Congratulations {props.name}!!🎉💃🏾🎉 Your order {props.reserveNum} has been accepted!</Text>
          <Text style={paragraph}>Someone will be in contact with you shortly regarding your order.</Text>
          <Text style={paragraph}>Please keep an eye out on your email and phone number.</Text>
          <Text style={paragraph}>Thank you for shopping at Medzone!!!</Text>
        </Container> : null}

        {props.order_status === "Cancelled" ? <Container style={container}>
          <Text style={paragraph}>Unfortunately {props.name}😓 Your order {props.reserveNum} has been cancelled</Text>
          <Text style={paragraph}>We cannot fulfill your order at the moment. Due to unforseen circumstances</Text>
          <Text style={paragraph}>But thank you for shopping at Medzone and we hope we see you again!</Text>
        </Container> : null}

        {props.order_status === "Rejected" ? <Container style={container}>
          <Text style={paragraph}>Unfortunately {props.name}😢 Your order {props.reserveNum} has been rejected</Text>
          <Text style={paragraph}>We cannot fulfill your order at the moment. Due to unforseen circumstances</Text>
          <Text style={paragraph}>But thank you for shopping at Medzone and we hope we see you again!</Text>
        </Container> : null}
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
