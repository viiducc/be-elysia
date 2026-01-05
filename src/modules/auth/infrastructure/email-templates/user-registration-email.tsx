import { Body, Container, Head, Heading, Html, Link, Preview, Text } from '@react-email/components';

interface UserRegistrationEmailProps {
  name: string;
  verificationToken: string;
  publicUrl: string;
}

export const UserRegistrationEmail = ({ name, verificationToken, publicUrl }: UserRegistrationEmailProps) => (
  <Html>
    <Head />
    <Preview>Thank you for registering</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Welcome to AGRIPOS.</Heading>
        <Text style={text}>Thank you {name} for registering. We are excited to have you on board.</Text>
        <Text style={text}>
          Please verify your email by clicking the link below:
          <br />
          <Link href={`${publicUrl}/verify-email?token=${verificationToken}`}>Verify Email</Link>
          <br />
          Or:
          <br />
          <code style={text}>{`${publicUrl}/verify-email?token=${verificationToken}`}</code>
          <Text style={text}>
            If you did not request this verification code, please ignore this email.
            <br />
            <br />
            Thank you,
            <br />
            The Agripos Team
          </Text>
        </Text>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: '#000000',
  margin: '0 auto',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const container = {
  margin: 'auto',
  padding: '96px 20px 64px',
};

const h1 = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '40px',
  margin: '0 0 20px',
};

const text = {
  color: '#aaaaaa',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '0 0 40px',
};
