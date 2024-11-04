## Intro

This project is designed to help you get started with Rutter's [Intuit Bank Feeds](https://docs.rutter.com/guides/intuit-bank-feeds) product. It gives you a redirect URL that, when redirected to, shows you every step you need to go through to finish creating an Intuit Bank Feeds connection. You can use this project as an interactive interface for walking you through the process of setting up a new Rutter Intuit Bank Feed connection.

![Intuit Bank Feeds Demo](https://github.com/user-attachments/assets/513a5ae7-619a-4f39-84f0-50a297dcb07c)


## Getting Started

First, `npm i`.

Then, create an `.env` file with the following variables:

```
NEXT_PUBLIC_RUTTER_CLIENT_ID=
NEXT_PUBLIC_RUTTER_CLIENT_SECRET=
```

Finally, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000/login](http://localhost:3000/login) with your browser to see the result. Or, jump to [http://localhost:3000/login/success](http://localhost:3000/login/success) to see the interactive interface. (Note that you won't be able to complete all the steps unless you have a Rutter-provided `redirect_uri`.)

## Rutter Configuration

Now that you're running the project locally, you can use the localhost URL as the Redirect URL in your Rutter Dashboard.

First, make sure that you've worked with Rutter to onboard to Intuit Bank Feeds. You'll need your own Intuit test bank to go through this functionality. Rutter will provide you with a special ID to search for in QuickBooks to find your test bank.

Once you're set up, head to Platforms > Bank Feeds > Intuit Bank Feeds "Configure".
![image](https://github.com/user-attachments/assets/e7ea362a-c987-4986-8bc1-9706568a5f78)

Then, configure a redirect URL. Ultimately, this redirect URL should be to a login page on your site. However, as like a quick and easy way to test out Intuit Bank Feeds, just run this project and use [http://localhost:3000/login](http://localhost:3000/login) as the redirect URL!

![image](https://github.com/user-attachments/assets/16d1878d-da06-4c19-a1bf-9e2403125a0e)

Now it's time to log into QuickBooks with a paid, production account. (Bank feed functionality cannot be tested in a sandbox account.) Head to Transactions > Bank Transactions > Link account

![image](https://github.com/user-attachments/assets/554195e4-a3d6-48d3-b329-9a18cf999ace)

Search for your unique Intuit test bank ID. When you click "Continue", you should see Intuit redirect to the Redirect URL you configured in your Rutter Dashboard.
