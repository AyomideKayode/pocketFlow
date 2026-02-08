export function renderBaseLayout(content: string, title: string = 'Notification'): string {
  const primaryColor = process.env.EMAIL_PRIMARY_COLOR || '#3b82f6';
  const logoUrl = process.env.EMAIL_LOGO_URL || 'https://placehold.co/200x50?text=PocketFlow';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f5; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; margin-top: 20px; margin-bottom: 20px; }
    .header { background-color: ${primaryColor}; padding: 20px; text-align: center; }
    .header img { max-height: 40px; }
    .content { padding: 30px; }
    .footer { background-color: #f4f4f5; padding: 20px; text-align: center; font-size: 12px; color: #666; }
    .btn { display: inline-block; padding: 10px 20px; background-color: ${primaryColor}; color: #ffffff; text-decoration: none; border-radius: 4px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header" style="background-color: ${primaryColor}; padding: 20px; text-align: center;">
      <img src="${logoUrl}" alt="PocketFlow Logo" style="max-height: 40px;" />
    </div>
    <div class="content" style="padding: 30px;">
      ${content}
    </div>
    <div class="footer" style="background-color: #f4f4f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
      <p>© ${new Date().getFullYear()} PocketFlow. All rights reserved.</p>
      <p>You are receiving this email based on your notification preferences.</p>
    </div>
  </div>
</body>
</html>
  `;
}
