# Vehicle Service Center - Backend (MVC)

This repository contains the backend (Express + MongoDB) for the Vehicle Service Center project.
Structure follows MVC pattern with controllers, routes, models, utils and config.

## Quick start

1. Copy `.env.example` to `.env` and fill values.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start (development):
   ```bash
   npm run dev
   ```

## Notes
- Receipts are saved to `public/receipts/`.
- PDF generation uses `pdfkit`.
- Emails use `nodemailer` (configure SMTP in `.env`).
