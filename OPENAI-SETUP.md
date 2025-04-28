# Administrator OpenAI API Key Setup

This guide explains how to set up the OpenAI API key for the PDF processing feature in the Joffers application. As an administrator, you will provide a single API key that all users will use.

## Step 1: Get an OpenAI API Key

1. Go to [https://platform.openai.com/signup](https://platform.openai.com/signup) and create an account if you don't already have one.
2. Once logged in, navigate to the [API Keys section](https://platform.openai.com/api-keys).
3. Click "Create new secret key" and give it a name (e.g., "Joffers PDF Processing").
4. Copy the generated API key (it will only be shown once).

## Step 2: Configure Your Application

1. Open the `.env.local` file in the root of your project.
2. Add your API key:

```
ADMIN_OPENAI_API_KEY=sk-your-api-key-here
```

> ⚠️ **Warning**: Never commit your `.env.local` file to version control or share it publicly. The `.gitignore` file should already be configured to ignore this file.

## Step 3: Restart Your Application

After adding the API key, restart your development server:

```bash
npm run dev
```

## How It Works

When a user uploads a PDF file:

1. The PDF is read directly in the browser and converted to a format that can be processed.
2. The content is sent to OpenAI using your admin API key.
3. The structured job information extracted by OpenAI is used to create a job listing.

## Important Information

- **Billing**: All OpenAI API calls will be billed to the administrator's account
- **Rate Limiting**: Your API key's rate limits apply to all users of the application
- **Key Security**: The API key is stored only on the server and never exposed to clients

## Troubleshooting

### API Errors

If you encounter errors with the OpenAI API:

- Check that your API key is correct and has not expired.
- Verify that you have permission to use the models users are selecting.
- Ensure your OpenAI account has sufficient credits.

### Rate Limiting

OpenAI has rate limits on API calls. If many users are processing PDFs simultaneously, you might hit these limits. Consider:

1. Implementing a queue system for high-volume deployments
2. Upgrading your OpenAI tier for higher rate limits
3. Adding request throttling to your application

### Cost Management

Be aware that using the OpenAI API incurs costs based on token usage. Monitor your usage at [https://platform.openai.com/usage](https://platform.openai.com/usage) to avoid unexpected charges.

## Monitoring Usage

To keep track of your application's OpenAI API usage:

1. Regularly check the OpenAI dashboard for billing information
2. Consider implementing logging to track which models are being used most frequently
3. Monitor for any unusual activity that could indicate abuse 