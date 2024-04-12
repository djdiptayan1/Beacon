import os
import csv
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load
import smtplib

# Load environment variables from .env file
load()

# Accessing environment variables
SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = os.getenv("SMTP_PORT")
EMAIL = os.getenv("EMAIL")
PASSWORD = os.getenv("PASSWORD")
SENDER_EMAIL = "dj2037@srmist.edu.in"


def read_template(filename):
    with open(filename, "r", encoding="utf-8") as file:
        template = file.read()
    return template


def send_email(receiver_email, recipient_name, subject, message):

    personalized_message = message.replace("[Recipient's Name]", recipient_name)

    msg = MIMEMultipart()
    msg["From"] = SENDER_EMAIL
    msg["To"] = receiver_email
    msg["Subject"] = subject
    msg.attach(MIMEText(personalized_message, "html"))

    # Connect to the SMTP server
    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        server.starttls()
        server.login(EMAIL, PASSWORD)
        server.send_message(msg)


def main():
    # Read HTML template
    html_template = read_template("template.html")
    csv_file = "test.csv"

    with open(csv_file, "r", encoding="utf-8") as file:
        csv_reader = csv.DictReader(file)
        for row in csv_reader:
            recipient_name = row["Name"]
            receiver_email = row["Email"]
            subject = "Your Email Subject Here"

            send_email(receiver_email, recipient_name, subject, html_template)


if __name__ == "__main__":
    main()
