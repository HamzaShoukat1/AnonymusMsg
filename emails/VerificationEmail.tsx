import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface OtpVerificationEmailProps {
  username?: string;
  otp: string;
}
export default function OtpVerificationEmail({
  username = "User",
  otp,
}: OtpVerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your OTP verification code</Preview>

      <Body>
        <Container>
          <Heading>Verify your account</Heading>

          <Text>Hi {username},</Text>

          <Text>
            Use the following OTP to verify your email address:
          </Text>

          <Section>
            <Text>{otp}</Text>
          </Section>

          <Text>This OTP is valid for 10 minutes.</Text>

          <Text>
            If you didn’t request this, you can safely ignore this email.
          </Text>

          <Text>
            © {new Date().getFullYear()} All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
